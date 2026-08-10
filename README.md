# Config Forge

A single-file Cloudflare Worker that batch-edits VLESS/Trojan configs:

- Swaps the server address across one or many IPs (1 output per config × IP)
- Overrides `fingerprint`, `cipherSuites`, and a fragment ("final mask") setting, all editable in the UI with sane defaults
- Exports either as share links (`vless://…`) or as full standalone Xray-core JSON configs (for v2rayN / NekoRay / PC)
- Dark/light theme, English/Persian UI

No build step, no dependencies, no backend state — it's one Worker script that serves its own HTML/CSS/JS.

## Deploy

**Option A — one click:**

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Awhiteowl/config-forge)



**Option B — CLI:**

```bash
npm install
npx wrangler login
npx wrangler deploy
```

That's it — Wrangler prints the `*.workers.dev` URL when it's done.

**Option C — Dashboard paste:**

Copy the contents of `src/index.js` into a new Worker via *Cloudflare Dashboard → Workers & Pages → Create → Quick Edit*.

## Local dev

```bash
npm install
npx wrangler dev
```

Opens a local preview with hot reload.

## Notes / caveats

- Only `vless://` and `trojan://` style links are parsed (query-param based). VMess (base64 JSON) links aren't supported.
- The JSON-config export uses the official Xray-core fragment schema (single-stage `freedom` outbound). It's derived from the app's fragment field on a best-effort basis — test on your actual client before relying on it.
- No data leaves the browser; everything runs client-side in the page the Worker serves.

## License

MIT — see [LICENSE](LICENSE).
