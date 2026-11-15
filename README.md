# Ellie, website

To publish with GitHub Pages: Settings, Pages, deploy from the `main` branch, root folder. The site then lives at
**https://charlusminus.github.io/ellie-site/**, until it moves to the Ellie domain.
Every page carries `noindex` until the site moves to its own domain.

## What lives where

| Address | What it is | Source |
|---|---|---|
| `/` | Website, home | `_src/pages/index.html` |
| `/maisons/` | For maisons | `_src/pages/maisons.html` |
| `/agencies/` | For agencies and DMCs | `_src/pages/agencies.html` |
| `/how-it-works/` | Create, orchestrate, analyse | `_src/pages/how.html` |
| `/security/` | Privacy and security file | `_src/pages/security.html` |
| `/pilot/` | Start with one event | `_src/pages/pilot.html` |
| `/about/` | Behind Ellie | `_src/pages/about.html` |
| `/contact/` | Request an introduction (form not connected yet) | `_src/pages/contact.html` |
| `/legal/` | Legal notice and privacy of this site | `_src/pages/legal.html` |

The top strip of every page holds three tabs: Website, Demo, Onboarding. The demo and the onboarding tour live in
their own repository, https://github.com/charlusminus/ellie-demo, published at https://charlusminus.github.io/ellie-demo/
(demo) and https://charlusminus.github.io/ellie-demo/onboarding/ (tour); the site links to them by full address
(`DEMO` in `_src/build.mjs`), and they link back here.

## The website

- **Look A of the demo**, "Maison de nuit": night blue, ivory, gold for the filled button. Dark by default; the
  "Light theme" switch in the top strip, or `?theme=light`, opens it light (remembered in the browser).
- **Built, not hand-copied**: `node _src/build.mjs` writes every page from `_src/pages/` with the shared header,
  footer and includes (`_src/inc/`). No dependency. GitHub Pages runs Jekyll, which ignores `_src/`, so the sources
  are never published. Edit `_src/`, run the build, commit both.
- Shared files: `assets/site.css`, `assets/site.js` (theme, menu, transport board, form), pictures in `assets/img/`
  (WebP at two widths, listed in `assets/img/manifest.json`).
- **Logo**: the official Ellie Experience artwork (gold on night blue, "Orchestrate the invisible"), received on
  15/11/2026. The wordmark is redrawn as a vector in `assets/logo/ellie-wordmark.svg` (straight strokes and the
  rounded join of the first E, measured on the artwork and checked by overlay); it takes the theme colour (gold on
  night blue, night blue on ivory). The full lockup with its tagline is a mask cut from the artwork
  (`assets/logo/ellie-lockup-mask.png`), used in the footer. Tab icon: the first E, `assets/logo/favicon.svg` and two
  PNG. Ask for the source files (vector) to replace the mask.
- **Pictures** are generated illustrations, checked one by one: no faces, no readable text, no logos. Never a real
  guest, a real maison or a real place card.
- Guests, cars and figures are fictional, and the footer says so. Nothing marked "In co-design" in the demo is sold
  as available on the website: it is listed once, on the pilot page.
- **Contrast** measured on the rendered pages in both themes: text at 4.5 or more, control borders at 3.0 or more.

## To settle before a public launch

Marked in red on the pages ("to confirm", "to write"): the legal entity and address, the hosting region, data
retention after an event, the sub-processors, an independent security review. Also: the founders' names on the about
page, where the contact form sends its requests, and the move to the Ellie domain (then remove `noindex`).
