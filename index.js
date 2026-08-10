// Cloudflare Worker — V2Ray/VLESS Config Editor
// Deploy as-is with `wrangler deploy` or paste into the Cloudflare dashboard
// "Quick Edit" for a Worker. No build step, no dependencies.

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Config Forge</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#f5f6fa; --bg-soft:#ffffff; --card:#ffffff; --border:#e3e5ec;
    --text:#14161c; --text-dim:#6b7280; --accent:#5b5ff0; --accent-2:#8b5cf6;
    --accent-soft:#eef0ff; --danger:#ef4444; --ok:#16a34a; --shadow:0 8px 30px rgba(20,22,28,.06);
    --mono:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;
    --font:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;
  }
  [data-theme="dark"]{
    --bg:#0d0e13; --bg-soft:#14161d; --card:#171923; --border:#262a37;
    --text:#eef0f7; --text-dim:#8b91a3; --accent:#7c7ff5; --accent-2:#a78bfa;
    --accent-soft:#1c1d3a; --danger:#f87171; --ok:#4ade80; --shadow:0 8px 30px rgba(0,0,0,.4);
  }
  [data-lang="fa"]{ --font:'Vazirmatn',Tahoma,sans-serif; }
  *{box-sizing:border-box;}
  body{
    margin:0; font-family:var(--font);
    background:
      radial-gradient(1200px 600px at 10% -10%, var(--accent-soft), transparent 60%),
      radial-gradient(1000px 500px at 110% 10%, var(--accent-soft), transparent 55%),
      var(--bg);
    color:var(--text); min-height:100vh; transition:background .3s,color .3s;
  }
  body[dir="rtl"] .stat{margin-left:0; margin-right:auto;}
  body[dir="rtl"] .badge{margin-left:0; margin-right:8px;}
  .wrap{max-width:1100px; margin:0 auto; padding:32px 20px 80px;}
  header{display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; gap:12px; flex-wrap:wrap;}
  .brand{display:flex; align-items:center; gap:12px;}
  .logo{
    width:38px; height:38px; border-radius:11px; flex:none;
    background:linear-gradient(135deg,var(--accent),var(--accent-2));
    display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:16px;
    box-shadow:0 4px 14px rgba(91,95,240,.35);
  }
  h1{font-size:19px; margin:0; letter-spacing:-.02em;}
  .sub{font-size:12.5px; color:var(--text-dim); margin-top:1px;}
  .toggles{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
  .toggle{
    display:flex; align-items:center; gap:8px; background:var(--card); border:1px solid var(--border);
    padding:6px 12px; border-radius:999px; cursor:pointer; font-size:13px; color:var(--text-dim);
    box-shadow:var(--shadow); user-select:none;
  }
  .toggle:hover{color:var(--text);}
  .grid{display:grid; grid-template-columns:1fr 1fr; gap:18px;}
  @media (max-width:820px){.grid{grid-template-columns:1fr;}}
  .card{
    background:var(--card); border:1px solid var(--border); border-radius:16px; padding:18px;
    box-shadow:var(--shadow);
  }
  .card h2{font-size:13px; margin:0 0 4px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); font-weight:600;}
  [dir="rtl"] .card h2{text-transform:none;}
  .card p.hint{font-size:12.5px; color:var(--text-dim); margin:0 0 12px;}
  textarea, input[type="text"]{
    width:100%; background:var(--bg-soft); border:1px solid var(--border); border-radius:11px;
    color:var(--text); font-family:var(--mono); font-size:12.5px; padding:12px; resize:vertical;
    outline:none; transition:border-color .15s;
  }
  [dir="rtl"] textarea, [dir="rtl"] input[type="text"]{font-family:var(--font);}
  textarea:focus, input[type="text"]:focus{border-color:var(--accent);}
  #configs{height:220px;}
  #ips{height:100px;}
  #output{height:280px;}
  #fmInput{height:150px;}
  #csInput{height:70px;}
  .row{display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; align-items:center;}
  button, select{
    border:none; cursor:pointer; font-size:13px; font-weight:600; border-radius:10px;
    padding:10px 16px; transition:transform .1s, opacity .15s, filter .15s; font-family:inherit;
  }
  button:active{transform:scale(.97);}
  .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2)); color:#fff; box-shadow:0 6px 18px rgba(91,95,240,.3);}
  .btn-primary:hover{filter:brightness(1.08);}
  .btn-ghost{background:var(--bg-soft); color:var(--text); border:1px solid var(--border);}
  .btn-ghost:hover{border-color:var(--accent);}
  .btn-ghost:disabled{opacity:.45; cursor:not-allowed;}
  .seg{display:flex; background:var(--bg-soft); border:1px solid var(--border); border-radius:10px; padding:3px; gap:2px;}
  .seg button{padding:7px 14px; border-radius:8px; background:transparent; color:var(--text-dim); box-shadow:none;}
  .seg button.active{background:linear-gradient(135deg,var(--accent),var(--accent-2)); color:#fff;}
  .stat{font-size:12.5px; color:var(--text-dim); margin-left:auto;}
  .full{grid-column:1/-1;}
  .badge{
    display:inline-block; font-size:11px; padding:2px 8px; border-radius:999px;
    background:var(--accent-soft); color:var(--accent); font-weight:600; margin-left:8px;
  }
  .foot-note{font-size:11.5px; color:var(--text-dim); margin-top:10px; line-height:1.6;}
  .foot-note b{color:var(--text);}
  .err{color:var(--danger); font-size:12.5px; margin-top:8px; display:none;}
  .json-note{
    display:none; font-size:12px; line-height:1.6; color:var(--accent);
    background:var(--accent-soft); border:1px solid var(--border); border-radius:10px;
    padding:10px 12px; margin-top:12px;
  }
  .adv-head{display:flex; align-items:center; justify-content:space-between; cursor:pointer; user-select:none;}
  .adv-head h2{margin:0;}
  .chevron{color:var(--text-dim); transition:transform .2s; font-size:12px;}
  .chevron.open{transform:rotate(180deg);}
  .adv-body{display:none; margin-top:14px;}
  .field{margin-top:14px;}
  .field:first-child{margin-top:0;}
  .field-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;}
  .field-label{font-size:12.5px; font-weight:600; color:var(--text);}
  .reset-link{font-size:11.5px; color:var(--accent); background:none; border:none; padding:0; cursor:pointer; font-weight:600;}
  .reset-link:hover{text-decoration:underline;}
</style>
</head>
<body data-theme="dark" data-lang="en">
  <div class="wrap">
    <header>
      <div class="brand">
        <div class="logo">Cf</div>
        <div>
          <h1 data-i18n="title">Config Forge</h1>
          <div class="sub" data-i18n="subtitle">VLESS / Trojan config batch editor</div>
        </div>
      </div>
      <div class="toggles">
        <div class="toggle" id="langToggle">🌐 <span id="langLabel">EN</span></div>
        <div class="toggle" id="themeToggle">🌙 <span id="themeLabel" data-i18n="dark">Dark</span></div>
      </div>
    </header>

    <div class="grid">
      <div class="card full">
        <h2 data-i18n="sourceTitle">Source configs</h2>
        <p class="hint" data-i18n="sourceHint">Paste one config per line (vless:// or trojan://).</p>
        <textarea id="configs" data-i18n-ph="sourcePlaceholder" placeholder="vless://uuid@old-host:443?...&#10;vless://uuid2@old-host2:443?..."></textarea>
      </div>

      <div class="card">
        <h2><span data-i18n="ipTitle">Target IP(s)</span> <span class="badge" data-i18n="ipBadge">1 config per IP</span></h2>
        <p class="hint" data-i18n="ipHint">One IP per line. Each source config is duplicated for every IP.</p>
        <textarea id="ips">188.114.97.6</textarea>
      </div>

      <div class="card">
        <h2 data-i18n="overridesTitle">Overrides applied</h2>
        <p class="hint" data-i18n="overridesHint" style="margin-bottom:8px;">These are injected/overwritten on every generated config:</p>
        <div style="font-size:12px; line-height:1.9; color:var(--text-dim);">
          <div>• <b style="color:var(--text)">fp</b> <span data-i18n="ovFp">→ fingerprint (edit below)</span></div>
          <div>• <b style="color:var(--text)">fm</b> <span data-i18n="ovFm">→ fragment mask (edit below)</span></div>
          <div>• <b style="color:var(--text)">cs</b> <span data-i18n="ovCs">→ cipher suites (edit below)</span></div>
          <div>• <b style="color:var(--text)">address</b> <span data-i18n="ovAddr">→ your IP(s) above</span></div>
        </div>
      </div>

      <div class="card full">
        <div class="adv-head" id="advHead">
          <h2 data-i18n="advTitle">Advanced overrides</h2>
          <span class="chevron" id="advChevron">▾</span>
        </div>
        <p class="hint" data-i18n="advHint" style="margin-top:4px;">Optional — pre-filled with sensible defaults, edit anything you like.</p>
        <div class="adv-body" id="advBody">
          <div class="field">
            <div class="field-head">
              <span class="field-label" data-i18n="fpLabel">Fingerprint (fp)</span>
              <button class="reset-link" data-reset="fp" data-i18n="resetLink">Reset to default</button>
            </div>
            <input type="text" id="fpInput" />
          </div>
          <div class="field">
            <div class="field-head">
              <span class="field-label" data-i18n="csLabel">Cipher suites (cs)</span>
              <button class="reset-link" data-reset="cs" data-i18n="resetLink">Reset to default</button>
            </div>
            <textarea id="csInput"></textarea>
          </div>
          <div class="field">
            <div class="field-head">
              <span class="field-label" data-i18n="fmLabel">Final mask / fragment (fm, JSON)</span>
              <button class="reset-link" data-reset="fm" data-i18n="resetLink">Reset to default</button>
            </div>
            <textarea id="fmInput"></textarea>
          </div>
        </div>
      </div>

      <div class="card full">
        <div class="row" style="margin-top:0; justify-content:space-between;">
          <div class="seg" id="modeSeg">
            <button class="active" data-mode="link" data-i18n="modeLink">Share Link</button>
            <button data-mode="json" data-i18n="modeJson">JSON Config (PC / older clients)</button>
          </div>
        </div>
        <div class="row">
          <button class="btn-primary" id="generateBtn">⚡ <span data-i18n="generateBtn">Generate configs</span></button>
          <button class="btn-ghost" id="copyBtn" disabled data-i18n="copyBtn">Copy all</button>
          <button class="btn-ghost" id="downloadBtn" disabled data-i18n="downloadBtn">Download .txt</button>
          <span class="stat" id="stat"></span>
        </div>
        <div class="err" id="err"></div>
        <div class="json-note" id="jsonNote" data-i18n="jsonNote">
          JSON mode outputs a full standalone Xray-core config (local SOCKS inbounds included) for each config × IP combo — import it in v2rayN / NekoRay as a custom server config, or run it directly with Xray-core. Fragment is applied as a single "freedom" outbound using the official Xray-core schema (packets / length / interval), taken from the first stage of your Final mask field above. This is a simplified single-stage version of the two-stage mask used in Share Link mode — a chained two-stage version isn't confirmed to work reliably across Xray-core builds yet.
        </div>
        <div class="row" style="margin-top:14px;">
          <textarea id="output" class="full" readonly data-i18n-ph="outputPlaceholder" placeholder="Generated configs will appear here…" style="width:100%;"></textarea>
        </div>
        <div class="foot-note" data-i18n="footNote">Only <b>vless://</b> and <b>trojan://</b> style URIs are supported (query-param based). VMess links (base64 JSON) aren't parsed by this tool. Existing query params you already set are preserved — only address, fp, fm, and cs are overwritten.</div>
      </div>
    </div>
  </div>

<script>
const DEFAULT_FRAGMENT_MASK = {"tcp":[{"type":"fragment","settings":{"packets":"tlshello","lengths":["5","94","1"],"delays":["0"],"maxSplit":"0"}},{"type":"fragment","settings":{"packets":"1-1","lengths":["109","1"],"delays":["1"],"maxSplit":"355"}}]};
const DEFAULT_CIPHER_SUITES = "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256";
const DEFAULT_FP = "unsafe";

/* ---------- i18n ---------- */
const I18N = {
  en: {
    title:"Config Forge", subtitle:"VLESS / Trojan config batch editor",
    dark:"Dark", light:"Light",
    sourceTitle:"Source configs", sourceHint:"Paste one config per line (vless:// or trojan://).",
    sourcePlaceholder:"vless://uuid@old-host:443?...\\nvless://uuid2@old-host2:443?...",
    ipTitle:"Target IP(s)", ipBadge:"1 config per IP",
    ipHint:"One IP per line. Each source config is duplicated for every IP.",
    overridesTitle:"Overrides applied", overridesHint:"These are injected/overwritten on every generated config:",
    ovFp:"→ fingerprint (edit below)", ovFm:"→ fragment mask (edit below)", ovCs:"→ cipher suites (edit below)", ovAddr:"→ your IP(s) above",
    advTitle:"Advanced overrides", advHint:"Optional — pre-filled with sensible defaults, edit anything you like.",
    fpLabel:"Fingerprint (fp)", csLabel:"Cipher suites (cs)", fmLabel:"Final mask / fragment (fm, JSON)", resetLink:"Reset to default",
    modeLink:"Share Link", modeJson:"JSON Config (PC / older clients)",
    generateBtn:"Generate configs", copyBtn:"Copy all", copiedBtn:"Copied ✓", downloadBtn:"Download .txt",
    outputPlaceholder:"Generated configs will appear here…",
    footNote:"Only <b>vless://</b> and <b>trojan://</b> style URIs are supported (query-param based). VMess links (base64 JSON) aren't parsed by this tool. Existing query params you already set are preserved — only address, fp, fm, and cs are overwritten.",
    jsonNote:"JSON mode outputs a full standalone Xray-core config (local SOCKS inbounds included) for each config × IP combo — import it in v2rayN / NekoRay as a custom server config, or run it directly with Xray-core. Fragment is applied as a single \\"freedom\\" outbound using the official Xray-core schema (packets / length / interval), taken from the first stage of your Final mask field above. This is a simplified single-stage version of the two-stage mask used in Share Link mode — a chained two-stage version isn't confirmed to work reliably across Xray-core builds yet.",
    errNoConfigs:"Paste at least one config.", errNoIps:"Enter at least one IP.",
    errUnsupported:"Unsupported / unrecognized scheme: ",
    errBadJson:"Final mask isn't valid JSON — please fix it or hit Reset to default.",
    errEmptyFm:"Final mask needs at least one entry in its \\"tcp\\" array.",
    statGenerated:(n,c,i)=> n + (n===1?" config":" configs") + " generated (" + c + " × " + i + ")"
  },
  fa: {
    title:"کانفیگ‌فورج", subtitle:"ویرایشگر دسته‌ای کانفیگ‌های VLESS / Trojan",
    dark:"تیره", light:"روشن",
    sourceTitle:"کانفیگ‌های ورودی", sourceHint:"در هر خط یک کانفیگ وارد کنید (vless:// یا trojan://).",
    sourcePlaceholder:"vless://uuid@old-host:443?...\\nvless://uuid2@old-host2:443?...",
    ipTitle:"آی‌پی(های) مقصد", ipBadge:"به ازای هر آی‌پی، یک کانفیگ",
    ipHint:"در هر خط یک آی‌پی. هر کانفیگ ورودی برای هر آی‌پی تکرار می‌شود.",
    overridesTitle:"مقادیری که تغییر می‌کنند", overridesHint:"این موارد در هر کانفیگ خروجی درج یا جایگزین می‌شوند:",
    ovFp:"→ فینگرپرینت (قابل ویرایش)", ovFm:"→ ماسک فرگمنت (قابل ویرایش)", ovCs:"→ لیست cipherSuites (قابل ویرایش)", ovAddr:"→ آی‌پی(های) شما",
    advTitle:"تنظیمات پیشرفته", advHint:"اختیاری — از قبل با مقادیر پیش‌فرض پر شده، هر بخشی را می‌توانید ویرایش کنید.",
    fpLabel:"فینگرپرینت (fp)", csLabel:"لیست cipherSuites (cs)", fmLabel:"ماسک نهایی / فرگمنت (fm، به‌صورت JSON)", resetLink:"بازگشت به پیش‌فرض",
    modeLink:"لینک اشتراک‌گذاری", modeJson:"کانفیگ JSON (کامپیوتر / نسخه‌های قدیمی)",
    generateBtn:"ساخت کانفیگ‌ها", copyBtn:"کپی همه", copiedBtn:"کپی شد ✓", downloadBtn:"دانلود .txt",
    outputPlaceholder:"کانفیگ‌های ساخته‌شده اینجا نمایش داده می‌شوند…",
    footNote:"فقط لینک‌های <b>vless://</b> و <b>trojan://</b> پشتیبانی می‌شوند (بر پایه‌ی query param). لینک‌های VMess (JSON با base64) توسط این ابزار پردازش نمی‌شوند. سایر پارامترهایی که از قبل تنظیم کرده‌اید حفظ می‌شوند — فقط address، fp، fm و cs بازنویسی می‌شوند.",
    jsonNote:"حالت JSON برای هر ترکیب کانفیگ×آی‌پی، یک کانفیگ کامل و مستقل Xray-core (همراه با ورودی‌های محلی SOCKS) می‌سازد — آن را در v2rayN / NekoRay به‌عنوان «کانفیگ سفارشی سرور» وارد کنید یا مستقیماً با Xray-core اجرا کنید. فرگمنت به‌صورت یک خروجی «freedom» با ساختار رسمی Xray-core (packets / length / interval) اعمال می‌شود که از مرحله‌ی اول فیلد «ماسک نهایی» بالا گرفته می‌شود. این نسخه‌ی ساده‌شده و تک‌مرحله‌ای از ماسک دو‌مرحله‌ای حالت لینک است — نسخه‌ی زنجیره‌ای دو‌مرحله‌ای هنوز روی همه‌ی نسخه‌های Xray-core تایید نشده است.",
    errNoConfigs:"حداقل یک کانفیگ وارد کنید.", errNoIps:"حداقل یک آی‌پی وارد کنید.",
    errUnsupported:"پروتکل پشتیبانی‌نشده: ",
    errBadJson:"ماسک نهایی یک JSON معتبر نیست — آن را اصلاح کنید یا روی «بازگشت به پیش‌فرض» بزنید.",
    errEmptyFm:"ماسک نهایی باید حداقل یک آیتم در آرایه‌ی \\"tcp\\" داشته باشد.",
    statGenerated:(n,c,i)=> n + " کانفیگ ساخته شد (" + c + " × " + i + ")"
  }
};
let LANG = "en";

function applyI18n(){
  const t = I18N[LANG];
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    const key = el.getAttribute("data-i18n-ph");
    if(t[key] !== undefined) el.setAttribute("placeholder", t[key]);
  });
  $("themeLabel").textContent = document.body.getAttribute("data-theme")==="dark" ? t.dark : t.light;
  $("copyBtn").textContent = t.copyBtn;
}

/* ---------- share-link mode ---------- */
function processLine(line, ip, opts){
  const trimmed = line.trim();
  if(!trimmed) return null;
  if(!/^(vless|trojan):\\/\\//i.test(trimmed)){
    throw new Error(I18N[LANG].errUnsupported + trimmed.slice(0,30) + "…");
  }
  const u = new URL(trimmed);
  u.hostname = ip;
  u.searchParams.set("fp", opts.fp);
  u.searchParams.set("cs", opts.cs);
  u.searchParams.set("fm", JSON.stringify(opts.fmObj));
  return u.toString();
}

/* ---------- JSON config mode (standard Xray-core schema) ---------- */
function buildTransportSettings(network, params){
  const path = params.get("path") || "/";
  const host = params.get("host");
  const extraRaw = params.get("extra");
  let extra;
  if(extraRaw){ try{ extra = JSON.parse(extraRaw); }catch(e){ extra = undefined; } }
  switch(network){
    case "ws":
      return { wsSettings: { path, headers: host ? { Host: host } : {} } };
    case "xhttp": {
      const s = { path, mode: params.get("mode") || "auto" };
      if(extra) s.extra = extra;
      return { xhttpSettings: s };
    }
    case "grpc":
      return { grpcSettings: { serviceName: path.replace(/^\\//,"") } };
    default:
      return {};
  }
}

function buildFragmentOutbound(fmObj){
  if(!fmObj || !Array.isArray(fmObj.tcp) || fmObj.tcp.length === 0){
    throw new Error(I18N[LANG].errEmptyFm);
  }
  const s = fmObj.tcp[0].settings || {};
  const lengths = Array.isArray(s.lengths) ? s.lengths : ["0","0"];
  const delays = Array.isArray(s.delays) ? s.delays : ["0"];
  const length = lengths.slice(0,2).join("-");
  const interval = delays[0] + "-" + delays[0];
  return {
    tag: "fragment-out",
    protocol: "freedom",
    settings: {
      domainStrategy: "UseIP",
      fragment: { packets: s.packets || "tlshello", length, interval }
    }
  };
}

function buildJsonConfig(line, ip, opts){
  const trimmed = line.trim();
  if(!/^(vless|trojan):\\/\\//i.test(trimmed)){
    throw new Error(I18N[LANG].errUnsupported + trimmed.slice(0,30) + "…");
  }
  const u = new URL(trimmed);
  const scheme = u.protocol.replace(":","");
  const port = Number(u.port) || 443;
  const secret = decodeURIComponent(u.username);
  const p = u.searchParams;
  const network = p.get("type") || "tcp";
  const security = p.get("security") || "tls";
  const sni = p.get("sni") || p.get("host") || "";
  const alpn = p.get("alpn");
  const allowInsecure = (p.get("allowInsecure") || p.get("insecure") || "0") === "1";
  const flow = p.get("flow") || "";
  const encryption = p.get("encryption") || "none";

  const tlsSettings = {
    serverName: sni, fingerprint: opts.fp, allowInsecure, cipherSuites: opts.cs
  };
  if(alpn) tlsSettings.alpn = alpn.split(",");

  const user = { id: secret, email: "user@user", security: "auto", encryption };
  if(flow) user.flow = flow;

  const mainOutbound = {
    tag: "proxy",
    protocol: scheme,
    settings: scheme === "vless"
      ? { vnext: [{ address: ip, port, users: [user] }] }
      : { servers: [{ address: ip, port, password: secret }] },
    streamSettings: Object.assign(
      { network, security, tlsSettings },
      buildTransportSettings(network, p)
    ),
    mux: { enabled: false, concurrency: -1 }
  };

  const fragOutbound = buildFragmentOutbound(opts.fmObj);
  mainOutbound.streamSettings.sockopt = { dialerProxy: fragOutbound.tag };

  return {
    log: { loglevel: "warning" },
    inbounds: [
      {
        tag: "socks", port: 10808, listen: "0.0.0.0", protocol: "mixed",
        sniffing: { enabled: true, destOverride: ["http","tls"], routeOnly: false },
        settings: { auth: "noauth", udp: true, allowTransparent: false }
      },
      {
        tag: "socks2", port: 10809, listen: "127.0.0.1", protocol: "mixed",
        sniffing: { enabled: true, destOverride: ["http","tls"], routeOnly: false },
        settings: { auth: "noauth", udp: true, allowTransparent: false }
      }
    ],
    outbounds: [ mainOutbound, fragOutbound,
      { tag: "direct", protocol: "freedom" },
      { tag: "block", protocol: "blackhole" }
    ],
    routing: {
      domainStrategy: "AsIs",
      rules: [
        { type: "field", port: "443", network: "udp", outboundTag: "block" },
        { type: "field", outboundTag: "direct", ip: ["geoip:private"] },
        { type: "field", outboundTag: "direct", domain: ["geosite:private"] },
        { type: "field", port: "0-65535", outboundTag: "proxy" }
      ]
    }
  };
}

/* ---------- UI wiring ---------- */
const $ = (id) => document.getElementById(id);
const errBox = $("err");
let MODE = "link";

$("advHead").addEventListener("click", () => {
  const open = $("advBody").style.display === "block";
  $("advBody").style.display = open ? "none" : "block";
  $("advChevron").classList.toggle("open", !open);
});

document.querySelectorAll(".reset-link").forEach(btn => {
  btn.addEventListener("click", () => {
    const which = btn.getAttribute("data-reset");
    if(which === "fp") $("fpInput").value = DEFAULT_FP;
    if(which === "cs") $("csInput").value = DEFAULT_CIPHER_SUITES;
    if(which === "fm") $("fmInput").value = JSON.stringify(DEFAULT_FRAGMENT_MASK, null, 2);
  });
});

$("modeSeg").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-mode]");
  if(!btn) return;
  MODE = btn.getAttribute("data-mode");
  document.querySelectorAll("#modeSeg button").forEach(b => b.classList.toggle("active", b === btn));
  $("jsonNote").style.display = MODE === "json" ? "block" : "none";
  $("downloadBtn").textContent = MODE === "json" ? "Download .json" : I18N[LANG].downloadBtn;
});

$("generateBtn").addEventListener("click", () => {
  errBox.style.display = "none";
  const configLines = $("configs").value.split("\\n").map(l=>l.trim()).filter(Boolean);
  const ipLines = $("ips").value.split("\\n").map(l=>l.trim()).filter(Boolean);
  if(configLines.length === 0){ showErr(I18N[LANG].errNoConfigs); return; }
  if(ipLines.length === 0){ showErr(I18N[LANG].errNoIps); return; }

  const fp = $("fpInput").value.trim() || DEFAULT_FP;
  const cs = $("csInput").value.trim() || DEFAULT_CIPHER_SUITES;
  let fmObj;
  try{
    fmObj = JSON.parse($("fmInput").value.trim() || "{}");
  }catch(e){
    showErr(I18N[LANG].errBadJson);
    return;
  }
  const opts = { fp, cs, fmObj };

  const blocks = [];
  try{
    for(const cfg of configLines){
      for(const ip of ipLines){
        if(MODE === "link"){
          blocks.push(processLine(cfg, ip, opts));
        }else{
          const label = "// ==== " + cfg.slice(0, 24) + "…  →  " + ip + " ====";
          blocks.push(label + "\\n" + JSON.stringify(buildJsonConfig(cfg, ip, opts), null, 2));
        }
      }
    }
  }catch(e){
    showErr(e.message);
    return;
  }

  $("output").value = blocks.join(MODE === "json" ? "\\n\\n" : "\\n");
  $("copyBtn").disabled = false;
  $("downloadBtn").disabled = false;
  const n = configLines.length * ipLines.length;
  $("stat").textContent = I18N[LANG].statGenerated(n, configLines.length, ipLines.length);
});

function showErr(msg){
  errBox.textContent = "⚠ " + msg;
  errBox.style.display = "block";
  $("copyBtn").disabled = true;
  $("downloadBtn").disabled = true;
  $("stat").textContent = "";
}

$("copyBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("output").value);
  $("copyBtn").textContent = I18N[LANG].copiedBtn;
  setTimeout(()=> $("copyBtn").textContent = I18N[LANG].copyBtn, 1200);
});

$("downloadBtn").addEventListener("click", () => {
  const isJson = MODE === "json";
  const blob = new Blob([$("output").value], {type: isJson ? "application/json" : "text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = isJson ? "configs.json" : "configs.txt";
  a.click();
});

$("themeToggle").addEventListener("click", () => {
  const body = document.body;
  const isDark = body.getAttribute("data-theme") === "dark";
  body.setAttribute("data-theme", isDark ? "light" : "dark");
  $("themeLabel").textContent = isDark ? I18N[LANG].light : I18N[LANG].dark;
  $("themeToggle").firstChild.textContent = isDark ? "☀️ " : "🌙 ";
  localStorage.setItem("cf-theme", isDark ? "light" : "dark");
});

$("langToggle").addEventListener("click", () => {
  LANG = LANG === "en" ? "fa" : "en";
  document.body.setAttribute("data-lang", LANG);
  document.body.setAttribute("dir", LANG === "fa" ? "rtl" : "ltr");
  $("langLabel").textContent = LANG === "en" ? "EN" : "FA";
  applyI18n();
  localStorage.setItem("cf-lang", LANG);
});

(function init(){
  $("fpInput").value = DEFAULT_FP;
  $("csInput").value = DEFAULT_CIPHER_SUITES;
  $("fmInput").value = JSON.stringify(DEFAULT_FRAGMENT_MASK, null, 2);

  const savedTheme = localStorage.getItem("cf-theme");
  if(savedTheme){
    document.body.setAttribute("data-theme", savedTheme);
    $("themeToggle").firstChild.textContent = savedTheme === "dark" ? "🌙 " : "☀️ ";
  }
  const savedLang = localStorage.getItem("cf-lang");
  if(savedLang){
    LANG = savedLang;
    document.body.setAttribute("data-lang", LANG);
    document.body.setAttribute("dir", LANG === "fa" ? "rtl" : "ltr");
    $("langLabel").textContent = LANG === "en" ? "EN" : "FA";
  }
  applyI18n();
})();
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(HTML, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
