# Config Forge

A single-file Cloudflare Worker that batch-edits VLESS/Trojan configs:

- Swaps the server address across one or many IPs (1 output per config × IP)
- Overrides `fingerprint`, `cipherSuites`, and a fragment ("final mask") setting, all editable in the UI with sane defaults
- Exports either as share links (`vless://…`) or as full standalone Xray-core JSON configs (for v2rayN / NekoRay / PC)
- Dark/light theme, English/Persian UI

No build step, no dependencies, no backend state — it's one Worker script that serves its own HTML/CSS/JS. Because of that, it can be deployed with **just a Cloudflare account** — no GitHub, no CLI, no npm required.

## Deploy — no GitHub needed

**Easiest: paste it into the dashboard**

1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Create Worker** (the default "Hello World" template is fine).
2. Click **Edit code**.
3. Select all the placeholder code, delete it, and paste in the contents of [`src/index.js`](src/index.js) from this repo.
4. Click **Save and Deploy**.

That's it — you'll get a `*.workers.dev` URL immediately. Only a Cloudflare account is required.

**Also GitHub-free: share it as a live Playground link**

If you want to let *other* people one-click deploy to *their own* account (like a "deploy button," but without forking into GitHub first):

1. Go to the [Cloudflare Workers Playground](https://workers.cloudflare.com/playground), paste in `src/index.js`.
2. Click **Share** to generate a playground URL.
3. Anyone who opens that URL sees a live preview with a **Deploy** button — clicking it deploys straight to *their own* Cloudflare account. No GitHub, no fork, no repo access needed on their end.

## Deploy — with Wrangler CLI (also GitHub-free)

```bash
npm install
npx wrangler login   # opens a browser to authorize your Cloudflare account only
npx wrangler deploy
```

Needs Node.js/npm locally, but authentication is Cloudflare-only — no GitHub account involved.

## Deploy — via GitHub (optional)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR-USERNAME/config-forge)

Note: this button forks this repo into the *deployer's own GitHub account* before deploying, so — despite the name — it requires a GitHub account in addition to Cloudflare. Use one of the GitHub-free options above if you want to avoid that.

## Local dev

```bash
npm install
npx wrangler dev
```

Opens a local preview with hot reload. (Also Cloudflare-account-only via `wrangler login`.)

## Notes / caveats

- Only `vless://` and `trojan://` style links are parsed (query-param based). VMess (base64 JSON) links aren't supported.
- The JSON-config export uses the official Xray-core fragment schema (single-stage `freedom` outbound). It's derived from the app's fragment field on a best-effort basis — test on your actual client before relying on it.
- No data leaves the browser; everything runs client-side in the page the Worker serves.

## License

MIT — see [LICENSE](LICENSE).
