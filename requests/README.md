# SlashtheHare — Request Form Setup

## Files

| File | Where it goes |
|------|--------------|
| `requests.html` | GitHub Pages repo (same folder as `index.html`) |
| `requests.css` | GitHub Pages repo |
| `requests.js` | GitHub Pages repo |
| `worker.js` | Cloudflare (copy-paste into Worker editor) |

---

## Step 1 — Create a Discord Bot

1. Go to **https://discord.com/developers/applications**
2. Click **New Application** → give it a name (e.g. `SlashMessages`)
3. Go to **Bot** in the left sidebar → click **Add Bot**
4. Under **Token**, click **Reset Token** and copy it — you'll need this later
5. Scroll down and make sure **Message Content Intent** is **OFF** (you don't need it)
6. Go to **OAuth2 → URL Generator**
   - Scopes: check `bot`
   - Bot Permissions: check `Send Messages`
7. Copy the generated URL, open it in your browser, and add the bot to **any server you own** (it just needs to be in one server to DM you — it won't need to post there)

---

## Step 2 — Get your Discord User ID

1. In Discord, go to **Settings → Advanced** and enable **Developer Mode**
2. Right-click your own username anywhere → **Copy User ID**
3. Save that number

---

## Step 3 — Deploy the Cloudflare Worker

1. Go to **https://dash.cloudflare.com** (free account is fine)
2. Click **Workers & Pages** in the sidebar → **Create** → **Create Worker**
3. Give it a name (e.g. `slash-requests`)
4. Click **Edit code**, delete everything in the editor, paste in the contents of `worker.js`
5. Click **Deploy**

### Set environment variables

Still in your Worker dashboard:
1. Go to **Settings → Variables**
2. Add these (click **Add variable** for each):

| Variable name | Value |
|---------------|-------|
| `DISCORD_BOT_TOKEN` | The bot token from Step 1 |
| `DISCORD_USER_ID` | Your user ID from Step 2 |
| `ALLOWED_ORIGIN` | Your GitHub Pages URL, e.g. `https://yourname.github.io` |

3. Click **Save and Deploy**

Your Worker URL will look like:
`https://slash-requests.YOUR-SUBDOMAIN.workers.dev`

---

## Step 4 — Wire up requests.js

Open `requests.js` and find this line near the top of the submit handler:

```js
const WORKER_URL = 'https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev';
```

Replace it with your actual Worker URL from Step 3. Save and push to GitHub.

---

## Step 5 — Test it

1. Open your `requests.html` page
2. Fill in the form and submit
3. You should get a Discord DM within a second or two

If something goes wrong, check the **Logs** tab in your Cloudflare Worker dashboard — it shows every request and any errors.

---

## Notes

- The bot needs to share at least one server with you to DM you — that's just a Discord requirement, not a limitation of this setup
- The free Cloudflare Workers tier gives you 100,000 requests/day — more than enough
- The `ALLOWED_ORIGIN` variable locks the Worker so only your page can call it, blocking random people from POSTing directly to the endpoint
