// Builds the Ellie website from _src/ into the repository root (GitHub Pages serves main, root folder).
// The demo and the onboarding tour live in their own repository, charlusminus/ellie-demo, linked by full address.
// No dependencies: `node _src/build.mjs`. GitHub Pages runs Jekyll, which ignores folders starting with "_",
// so _src/ is never published.
//
// A page is _src/pages/<file>.html: a front-matter comment, then the body.
//   <!--
//   path: maisons/          output folder ("" for the home page)
//   nav: maisons            which main navigation item is current
//   title: For maisons      tab title, " | Ellie" is added (except the home page)
//   description: ...        meta description
//   -->
// In a page or an include:
//   {{root}}                         relative path to the site root ("" or "../"), so the site works under any sub-path
//   {{demo}}                         full address of the demo (the onboarding tour is {{demo}}onboarding/)
//   {{inc:name}}                     _src/inc/name.html
//   {{img:name|alt|sizes|eager}}     a responsive picture from assets/img (see assets/img/manifest.json)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, "..");
const DEMO = "https://charlusminus.github.io/ellie-demo/";
const manifest = JSON.parse(readFileSync(join(OUT, "assets/img/manifest.json"), "utf8"));

const NAV = [
  ["maisons", "maisons/", "Maisons"],
  ["agencies", "agencies/", "Agencies"],
  ["how", "how-it-works/", "How it works"],
  ["security", "security/", "Security"],
  ["pilot", "pilot/", "Pilot"],
  ["about", "about/", "About"]
];

const LOGO = '<svg viewBox="0 0 1013 146" fill="currentColor" aria-hidden="true" focusable="false"><rect x="0" y="0" width="130.5" height="12.5"/><rect x="0" y="0" width="12.5" height="60"/><path d="M114.5 66H30A30 30 0 0 0 0 96V146H12.5V96A17.5 17.5 0 0 1 30 78.5H114.5Z"/><rect x="0" y="133.5" width="130.5" height="12.5"/><rect x="267" y="0" width="12.5" height="146"/><rect x="267" y="133.5" width="92.5" height="12.5"/><rect x="499" y="0" width="12.5" height="146"/><rect x="499" y="133.5" width="92" height="12.5"/><rect x="737.5" y="0" width="12.5" height="146"/><rect x="905" y="0" width="12.5" height="146"/><rect x="905" y="0" width="107.5" height="12.5"/><rect x="905" y="66" width="96.5" height="12.5"/><rect x="905" y="133.5" width="107.5" height="12.5"/></svg>';

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function img(spec, root) {
  const [name, alt = "", sizes = "100vw", load = "lazy"] = spec.split("|");
  const m = manifest[name];
  if (!m) throw new Error("Unknown image " + name);
  const srcset = m.widths.map((w) => `${root}assets/img/${name}-${w}.webp ${w}w`).join(", ");
  const big = m.widths[m.widths.length - 1];
  return `<img src="${root}assets/img/${name}-${big}.webp" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}"` +
    (load === "eager" ? ` fetchpriority="high"` : ` loading="lazy" decoding="async"`) + `>`;
}

function expand(text, root, depth = 0) {
  if (depth > 4) throw new Error("Includes nested too deep");
  return text
    .replace(/\{\{inc:([a-z0-9-]+)\}\}/g, (_, n) => expand(readFileSync(join(SRC, "inc", n + ".html"), "utf8").trim(), root, depth + 1))
    .replace(/\{\{img:([^}]+)\}\}/g, (_, spec) => img(spec, root))
    .replace(/\{\{demo\}\}/g, DEMO)
    .replace(/\{\{root\}\}/g, root);
}

function layout(meta, body, root) {
  const title = meta.nav === "home" ? "Ellie" : `${meta.title} | Ellie`;
  const nav = NAV.map(([key, href, label]) =>
    `<a href="${root}${href}"${meta.nav === key ? ' aria-current="page"' : ""}>${label}</a>`).join("\n      ");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description || "")}">
<meta name="robots" content="noindex, nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..600&family=Hanken+Grotesk:wght@400;500;600&display=swap">
<link rel="stylesheet" href="${root}assets/site.css">
<link rel="icon" href="${root}assets/logo/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${root}assets/logo/icon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${root}assets/logo/icon-180.png">
<script>try{var t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("ellie-site-theme");if(t==="light")document.documentElement.setAttribute("data-theme","light");}catch(e){}</script>
${meta.head || ""}</head>
<body>
<div class="strip">
  <div class="wrap">
    <nav class="xtabs" aria-label="Ellie">
      <a href="${root}" aria-current="page">Website</a>
      <a href="{{demo}}?look=a">Demo</a>
      <a href="{{demo}}onboarding/">Onboarding</a>
    </nav>
    <button type="button" class="themebtn">Light theme</button>
  </div>
</div>
<header class="hdr">
  <div class="wrap">
    <a class="brand" href="${root}" aria-label="Ellie, home">${LOGO}</a>
    <button type="button" class="menubtn" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
      ${nav}
      <a class="btn primary" href="${root}contact/">Request an introduction</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="ftr">
  <div class="wrap">
    <div class="cols">
      <div class="col"><span class="lockup" role="img" aria-label="Ellie Experience, orchestrate the invisible"></span><span class="muted">Ellie looks after your team, so your team can look after the guests.</span></div>
      <div class="col"><b>Ellie</b><a href="${root}maisons/">For maisons</a><a href="${root}agencies/">For agencies and DMCs</a><a href="${root}how-it-works/">How it works</a><a href="${root}pilot/">Pilot</a></div>
      <div class="col"><b>Trust</b><a href="${root}security/">Privacy and security</a><a href="${root}about/">About</a><a href="${root}legal/">Legal notice</a></div>
      <div class="col"><b>See Ellie</b><a href="{{demo}}?look=a">Interactive demo</a><a href="{{demo}}onboarding/">Onboarding tour</a><a href="${root}contact/">Request an introduction</a></div>
    </div>
    <div class="fine"><span>Ellie Experience, by Strand64, Singapore.</span><span>Guests, cars and figures shown on this site are fictional.</span></div>
  </div>
</footer>
<script src="${root}assets/site.js" defer></script>
</body>
</html>
`;
}

let count = 0;
for (const file of readdirSync(join(SRC, "pages")).filter((f) => f.endsWith(".html")).sort()) {
  const raw = readFileSync(join(SRC, "pages", file), "utf8");
  const m = raw.match(/^<!--\n([\s\S]*?)\n-->\n/);
  if (!m) throw new Error(file + ": missing front matter");
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  meta.path = meta.path === undefined ? "" : meta.path;
  const depth = meta.path === "" ? 0 : meta.path.split("/").filter(Boolean).length;
  const root = "../".repeat(depth);
  let body = raw.slice(m[0].length);
  let head = "";
  body = body.replace(/<!--head\n([\s\S]*?)\n-->\n?/, (_, h) => { head = h + "\n"; return ""; });
  meta.head = head;
  const html = expand(layout(meta, body.trim(), root), root);
  if (/—/.test(html)) throw new Error(file + ": em dash found");
  if (/\{\{/.test(html)) throw new Error(file + ": unexpanded placeholder");
  const outFile = file === "404.html" ? join(OUT, "404.html") : join(OUT, meta.path, "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  count++;
}
console.log(count + " pages written");
