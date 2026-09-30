// api/chat.js — Vercel serverless proxy to the Anthropic API
// Handles both non-streaming and streaming (SSE) requests, and forwards
// prompt-caching content blocks (cache_control) as-is.
//
// Deploy: replace your current /api/chat.js with this file.
// Env vars required: ANTHROPIC_API_KEY

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { model, max_tokens = 1000, system, messages, stream = false } = body;

  // Build the outgoing payload — system can be a string or an array of blocks
  // with cache_control. Anthropic accepts both.
  const payload = {
    model: model || 'claude-haiku-4-5',
    max_tokens,
    messages: messages || [],
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
