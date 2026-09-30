// api/chat.js — Vercel serverless proxy to the Anthropic API
// Handles both non-streaming and streaming (SSE) requests, and forwards
// prompt-caching content blocks (cache_control) as-is.
//
// Only signed-in users of the app can use it: every request must carry the
// user's Supabase access token, which is checked before anything is sent to
// Anthropic. Models and response length are restricted to what the app uses.
//
// Env vars required: ANTHROPIC_API_KEY, VITE_SUPABASE_URL and
// VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY).

export const config = { runtime: 'edge' };

// Models the app is allowed to request. Anything else is refused (400), which
// makes the client move on to the next model in its fallback list.
const ALLOWED_MODELS = new Set([
  'claude-haiku-4-5',
  'claude-sonnet-4-20250514',
]);
const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS_CAP = 2000;     // the app never asks for more than 1500
const MAX_MESSAGES = 100;        // longest conversation history sent at once
const MAX_BODY_CHARS = 200_000;  // ~50k tokens of input, well above normal use

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

// Returns the user's id if the access token is a valid Supabase session.
async function verifyUser(req) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const apikey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    || process.env.VITE_SUPABASE_ANON_KEY
    || process.env.SUPABASE_PUBLISHABLE_KEY
    || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !apikey) return { error: 'Supabase not configured on the server', status: 500 };

  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
  if (!token) return { error: 'Authentication required', status: 401 };

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey },
    });
    if (!res.ok) return { error: 'Invalid or expired session', status: 401 };
    const me = await res.json();
    if (!me?.id) return { error: 'Invalid or expired session', status: 401 };
    return { userId: me.id };
  } catch {
    return { error: 'Could not verify session', status: 502 };
  }
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'ANTHROPIC_API_KEY not configured' }, 500);

  const user = await verifyUser(req);
  if (user.error) return json({ error: { message: user.error } }, user.status);

  let raw;
  try { raw = await req.text(); } catch { return json({ error: 'Invalid body' }, 400); }
  if (raw.length > MAX_BODY_CHARS) return json({ error: { message: 'Request too large' } }, 413);

  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: 'Invalid JSON body' }, 400); }

  const { model, max_tokens = 1000, system, messages, stream = false } = body || {};

  const chosenModel = model || DEFAULT_MODEL;
  if (!ALLOWED_MODELS.has(chosenModel)) {
    return json({ error: { message: `Model ${chosenModel} not allowed` } }, 400);
  }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return json({ error: { message: 'Invalid messages' } }, 400);
  }
  const maxTokens = Math.min(Math.max(parseInt(max_tokens, 10) || 1000, 1), MAX_TOKENS_CAP);

  // Build the outgoing payload — system can be a string or an array of blocks
  // with cache_control. Anthropic accepts both.
  const payload = {
    model: chosenModel,
    max_tokens: maxTokens,
    messages,
    ...(system ? { system } : {}),
    ...(stream ? { stream: true } : {}),
  };

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Prompt caching is GA — no beta header needed for the ephemeral
        // cache type. Kept here as a defensive fallback for older API versions.
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify(payload),
    });

    // Streaming: forward the SSE stream as-is
    if (stream) {
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming: forward JSON response
    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: e.message } }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
