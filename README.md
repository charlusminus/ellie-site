# Ellie, website

To publish with GitHub Pages: Settings, Pages, deploy from the `main` branch, root folder. The site then lives at
**https://charlusminus.github.io/ellie-site/**, until it moves to the Ellie domain.
Every page carries `noindex` until the site moves to its own domain.

## What lives where

The public site is **one landing page**, a visiting card rather than a sales page (17/11/2026, after the kick-off and
the proposed luxury codes), plus a legal notice and a 404 page. It links to nothing but itself and one e-mail address.

| Address | What it is | Source |
|---|---|---|
| `/` | Four moments: the logotype, the signature and one sentence; what the guest lives, in three lines; discretion; "Request an introduction", by invitation | `_src/pages/index.html` |
| `/legal/` | Legal notice and privacy of this site | `_src/pages/legal.html` |

The detailed pages of the first site wait in `_src/drafts/`, with their own styles and script in
`_src/drafts/assets/` (Bodoni Moda, Hanken Grotesk, light and dark themes). They are not built and not linked. The
demo lives in its own repository and is no longer linked from the site.

## The website

- **Charter**: Cormorant Garamond for what names, Mulish for what explains; night blue `#051022` and ivory `#f7f3ea`
  alternate, a navy band `#0b2447` concludes; one gold `#d8b873`, as ink and as a hairline. No gradient, no glow, no
  shadow. The typefaces are served from `assets/fonts/` (SIL Open Font License): no third party is called.
- **What the page never carries**: prices, feature lists, product screenshots, client names or logos, figures,
  "book a demo", a link to the demo. Vocabulary: maison, client, guest, client experience team. British English.
- **Built, not hand-copied**: `node _src/build.mjs` writes every page from `_src/pages/` with the shared head and
  footer. No dependency. GitHub Pages runs Jekyll, which ignores `_src/`, so the sources are never published. Edit
  `_src/`, run the build, commit both.
- **Contact**: one address, `CONTACT` in `_src/build.mjs`, used by the "Request an introduction" button as a mailto
  link. It is empty until the address is decided; the build warns about it.
- Shared files: `assets/site.css`, `assets/site.js` (each moment fades in once, slowly; nothing moves if the visitor
  asks for reduced motion, and everything is visible without the script), pictures in `assets/img/` (WebP at two
  widths, listed in `assets/img/manifest.json`; the landing uses `hero-car` and `dinner-table`).
- **Logo**: the official Ellie wordmark redrawn as a vector (`assets/logo/ellie-wordmark.svg`, inlined by the build),
  gold on night blue, with the signature "Orchestrate the invisible" set in spaced capitals. Tab icon: the first E.
  `assets/logo/ellie-lockup-mask.png` (the full artwork) is kept but no longer used.
- **Pictures** are generated illustrations, checked one by one: no faces, no readable text, no logos. Never a real
  guest, a real maison or a real place card.
- **Measured on the rendered pages** at 1440 x 900 and 390 x 844: text contrast 4.5 or more (lowest 4.99), nothing
  under 14 px, no console error, no sideways scroll.

## To settle before a public launch

The contact address (`CONTACT`). The sentence "Once the event is over, it is deleted": data retention after an event
is not confirmed in the product yet. On the legal page, marked "to confirm": the legal entity and its address. Also
the move to the Ellie domain (then remove `noindex`), and the luxury codes themselves, still a proposal.
