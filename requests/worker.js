/**
 * ════════════════════════════════════════════════════
 *  SlashtheHare — Request Form Worker
 *  Receives a form POST and sends a Discord DM to you.
 *
 *  Environment variables to set in Cloudflare dashboard:
 *    DISCORD_BOT_TOKEN  — your bot token
 *    DISCORD_USER_ID    — your personal Discord user ID
 *    ALLOWED_ORIGIN     — your GitHub Pages URL, e.g. https://yourname.github.io
 * ════════════════════════════════════════════════════
 */

const TYPE_LABELS = {
  'art-request':    '🖊 Art Request',
  'trade-interest': '🔄 Trade Interest',
  'question':       '❓ Question',
  'feedback':       '💬 Feedback',
  'other':          '📌 Other',
};

export default {
  async fetch(request, env) {

    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, env);
    }

    // ── Only accept POST ──
    if (request.method !== 'POST') {
      return corsResponse(JSON.stringify({ error: 'Method not allowed' }), 405, env);
    }

    // ── Parse body ──
    let data;
    try {
      data = await request.json();
    } catch {
      return corsResponse(JSON.stringify({ error: 'Invalid JSON' }), 400, env);
    }

    const { name, type, message, anonymous } = data;

    // ── Basic validation ──
    if (!type || !message || message.trim().length === 0) {
      return corsResponse(JSON.stringify({ error: 'Missing required fields' }), 400, env);
    }

    // ── Build Discord message ──
    const sender    = anonymous ? 'Anonymous' : (name || 'Anonymous');
    const typeLabel = TYPE_LABELS[type] || type;
    const timestamp = new Date().toUTCString();

    const dmContent = [
      '```',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      ' NEW MESSAGE — slashthehare.com',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `  From : ${sender}`,
      `  Type : ${typeLabel}`,
      `  Sent : ${timestamp}`,
      '──────────────────────────────',
      message.trim(),
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '```',
    ].join('\n');

    // ── Open DM channel with yourself ──
    const dmChannel = await discordFetch(
      'POST',
      '/users/@me/channels',
      { recipient_id: env.DISCORD_USER_ID },
      env.DISCORD_BOT_TOKEN
    );

    if (!dmChannel.ok) {
      const err = await dmChannel.text();
      console.error('Failed to open DM channel:', err);
      return corsResponse(JSON.stringify({ error: 'Discord DM channel error' }), 502, env);
    }

    const channel = await dmChannel.json();

    // ── Send the message ──
    const sent = await discordFetch(
      'POST',
      `/channels/${channel.id}/messages`,
      { content: dmContent },
      env.DISCORD_BOT_TOKEN
    );

    if (!sent.ok) {
      const err = await sent.text();
      console.error('Failed to send DM:', err);
      return corsResponse(JSON.stringify({ error: 'Discord send error' }), 502, env);
    }

    return corsResponse(JSON.stringify({ ok: true }), 200, env);
  }
};

/* ── helpers ── */

function discordFetch(method, path, body, token) {
  return fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: {
      'Authorization': `Bot ${token}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(body),
  });
}

function corsResponse(body, status, env) {
  const origin = env?.ALLOWED_ORIGIN || '*';
  const headers = {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  return new Response(body, { status, headers });
}
