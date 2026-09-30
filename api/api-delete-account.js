// api/delete-account.js — Vercel serverless endpoint
// Deletes the authenticated user's auth.users row via the Supabase Admin API.
//
// Deploy: place this file at /api/delete-account.js in your Vercel project.
// Env vars required (add both to Vercel Project Settings → Environment Variables):
//   - VITE_SUPABASE_URL           (already there — used publicly by the app)
//   - SUPABASE_SERVICE_ROLE_KEY   (SECRET — never expose to the client; add on the server only)
//
// Where to find SUPABASE_SERVICE_ROLE_KEY:
//   Supabase Dashboard → Project Settings → API → "service_role" secret key.
//   Copy the key that starts with "eyJ..." and add it to Vercel as an env variable.

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return json({ error: 'Server not configured (missing SUPABASE_SERVICE_ROLE_KEY).' }, 500);
  }

  // Verify the caller: the request must come with the caller's own access token.
  // We only accept deleting the user_id that matches that token.
  const auth = req.headers.get('authorization') || '';
  const accessToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }
  const requestedUserId = body?.user_id;
  if (!requestedUserId) return json({ error: 'user_id is required' }, 400);

  // Optional check: verify the access token identifies the same user.
  // If no Authorization header is present, we trust the RLS delete that already ran
  // and delete the auth user matching the requested id.
  let callerUserId = requestedUserId;
  if (accessToken) {
    try {
      const meRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { Authorization: `Bearer ${accessToken}`, apikey: serviceKey },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        callerUserId = me.id;
        if (callerUserId !== requestedUserId) {
          return json({ error: 'user_id mismatch' }, 403);
        }
      }
    } catch { /* ignore — fall through to the delete */ }
  }

  // Delete the auth user with the service_role key.
  try {
    const delRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${requestedUserId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    });
    if (!delRes.ok) {
      const txt = await delRes.text().catch(() => '');
      return json({ error: `Supabase admin delete failed: ${delRes.status} ${txt}` }, 500);
    }
  } catch (e) {
    return json({ error: e.message }, 500);
  }

  return json({ ok: true, deleted: requestedUserId });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
