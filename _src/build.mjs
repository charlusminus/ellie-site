// Builds the Ellie website from _src/ into the repository root (GitHub Pages serves main, root folder).
// One landing page, a legal notice and a 404. The site links to nothing but itself and one e-mail address.
// No dependencies: `node _src/build.mjs`. GitHub Pages runs Jekyll, which ignores folders starting with "_",
// so _src/ is never published.
//
// A page is _src/pages/<file>.html: a front-matter comment, then the body.
//   <!--
//   path: maisons/          output folder ("" for the home page)
//   nav: maisons            which main navigation item is current
//   title: For maisons      tab title, " | Ellie" is added (except the home page)
//   description: ...        meta description
//   paper: night | paper    the paper of the page body (night blue by default, ivory to read)
//   -->
// In a page or an include:
//   {{root}}                         relative path to the site root ("" or "../"), so the site works under any sub-path
//   {{contact}}                      the "Request an introduction" address, as a mailto link (see CONTACT below)
//   {{logo}}                         the Ellie wordmark, inline, in the current text colour
//   {{inc:name}}                     _src/inc/name.html
//   {{img:name|alt|sizes|eager}}     a responsive picture from assets/img (see assets/img/manifest.json)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, "..");
// The one way in. The address is not decided yet: leave it empty rather than invent one. While it is empty the
// button opens an e-mail with no recipient, and the build says so.
const CONTACT = "";
// The e-mail the button opens: a subject and the start of an introduction, for the visitor to complete.
const SUBJECT = "An introduction to Ellie";
const BODY = [
  "Good day,",
  "",
  "I would welcome the opportunity to meet and hear more about Ellie.",
  "",
  "My name is [your name], with [maison or agency], in [city].",
  "Our next client event: [city, month, number of guests].",
  "",
  "With kind regards,",
  "",
].join("\r\n");
const MAILTO = "mailto:" + CONTACT + "?subject=" + encodeURIComponent(SUBJECT) + "&amp;body=" + encodeURIComponent(BODY);
const manifest = JSON.parse(readFileSync(join(OUT, "assets/img/manifest.json"), "utf8"));

// The detailed pages of the first site wait in _src/drafts/ with their own styles (_src/drafts/assets/). They are not
// built and not linked.
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
    .replace(/\{\{contact\}\}/g, MAILTO)
    .replace(/\{\{logo\}\}/g, LOGO)
    .replace(/\{\{root\}\}/g, root);
}

function layout(meta, body, root) {
  const home = meta.nav === "home";
  const title = home ? "Ellie Experience" : `${meta.title} | Ellie`;
  const paper = meta.paper || "night";
  // The landing page opens on the logotype itself; the two plain pages carry it as a way back.
  const top = home ? "" : `<header class="top">
  <a href="${root}" aria-label="Ellie, back to the page">${LOGO}</a>
</header>
`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description || "")}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#051022">
<link rel="preload" href="${root}assets/fonts/cormorant-garamond-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/mulish-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}assets/site.css">
<link rel="icon" href="${root}assets/logo/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${root}assets/logo/icon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${root}assets/logo/icon-180.png">
<script>try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.className="js"}catch(e){}</script>
${meta.head || ""}</head>
<body class="${paper}">
${top}<main id="main">
${body}
</main>
<footer class="ftr night">
  <span class="over">Ellie · Orchestrate the invisible</span>
  <span class="ftr-end"><span>Ellie Experience, by Strand64, Singapore</span>${meta.nav === "legal" ? "" : `<a href="${root}legal/">Legal notice</a>`}</span>
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
if (!CONTACT) console.warn("Contact address not set (CONTACT in _src/build.mjs): the introduction button has no recipient.");
