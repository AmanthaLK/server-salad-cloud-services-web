# Server Salad — Website Build Spec & Reference

> **How to use this document.** This file fully specifies the Server Salad
> website: *why* it's built the way it is, and the *exact* HTML/CSS/JS/PHP
> needed to build it from nothing. **Part B — Build Steps** embeds every
> source file verbatim, in dependency order — copy each code block into the
> named file and the site is reproduced exactly, no other source required.
> **Part C onward** explains every design decision, content provenance flag,
> and open item, so whoever continues the work (human or AI) understands not
> just the code but the reasoning behind it. Read top to bottom once; after
> that, jump to the section you need.

---

## Part A — Orientation

### A.1 What this is
A website for a web hosting business, **Server Salad** — Sri Lanka-based
support, European infrastructure. Built and served locally via XAMPP (Apache)
from `htdocs/server-salad-cloud-services-web`. Local URL:
`http://localhost/server-salad-cloud-services-web/`.

### A.2 Stack
- **HTML + CSS + JavaScript only.** No build tools, no frameworks.
- **One deliberate exception: a single PHP endpoint for live pricing**
  (`api/pricing.php`). A browser can't speak MySQL directly, and DB
  credentials must never reach client-side code (fully exposed to any visitor
  via view-source) — so pulling the cpanel-hosting Plans table's prices from a
  real database needs a server-side layer. This is the **only** PHP in the
  project; everything else stays static HTML/CSS/JS.

### A.3 Standing conventions
- **Only update this README when explicitly asked.** Make code changes
  without touching README.md by default; when an update *is* requested,
  update the relevant section in place — this file describes *what the site
  is*, not *what was done to it*.
- **Narrow scope by default.** When an instruction shows one specific element,
  change only that element — don't assume it applies to lookalike elements
  elsewhere (e.g. the hero cards and the Web Hosting▾ mega-menu cards look
  similar but are separate). Broaden scope only if needed to avoid visual
  inconsistency, and flag that decision.
- **Never invent unverified factual claims** (fake review scores, fake
  pricing, fabricated statistics/partnerships/logos) — use neutral
  placeholders and flag them clearly until real content is supplied. This
  extends to unverifiable **qualitative** claims too (e.g. "award-winning").
- **Image rule — every image, every time:** place it under `assets/img/`
  (its own subfolder for a distinct group), and rename it to a
  lowercase-hyphenated SEO-friendly filename that **tallies with the
  card/section title it illustrates** — never keep an upload's original name
  (camera/export names, "(1)" suffixes, stock-photo IDs, spaces).
- **Cache-busting:** `css/styles.css` is linked with `?v=N` (currently
  **v=346**); `js/main.js` has its own separate `?v=N` (currently **v=22**).
  Bump the relevant one any time that file changes, in **every** page's tag —
  now three pages (`index.html`, `cpanel-hosting/index.html`,
  `discount-programs/index.html`) — so browsers fetch the latest version
  instead of a stale cached copy.
- **Brand name.** The brand name is **two words: "Server Salad"** in **all
  human-readable text** — page copy, headings, `alt`/`aria-label` text, page
  titles. The tab title is "Server Salad Cloud Services" on every page.
  **Machine-readable slugs stay one lowercase word `serversalad`**: image
  filenames (`serversalad-logo.png`, `serversalad-favicon.svg`), CSS classes,
  the `info@serversalad.com` / `+94 71 200 0006` contact details, and any real
  external URL/domain (`serversalad.com`, the Trustpilot/LinkedIn links).
  **The project folder and every root-relative site path use the longer slug
  `server-salad-cloud-services-web`** instead — distinct from the one-word
  slugs above, which stayed unchanged when the repo was renamed. If you see
  the one-word "ServerSalad" in visible text, it's a bug — fix it to the
  two-word form.
- **Brand colours usage:** official brand colours (from the logo) are dark
  slate `#323D41` and orange `#F57E20` (`--brand-dark`, `--brand-orange`).
  These don't need to appear everywhere — use them at genuine brand
  touchpoints; elsewhere prefer the broader orange→red accent palette
  (`--accent`/`--accent-2`). The homepage Plans section, "Why Choose Server
  Salad" heading/icons, eco/hero accents, and the **entire cpanel-hosting
  page** use `--brand-orange` throughout; the homepage hero cards and main nav
  keep the rose/red `--accent` palette. This split is intentional.
- **Reference-styling rule:** when implementing or restyling an element from a
  supplied reference/template (e.g. a font-inspector screenshot), match its
  **typography and box dimensions** (font family/size/weight/line-height,
  padding, icon size, gaps) but **not its colours** — keep the site's own
  colour for that element unless told otherwise for that specific request.
  Any such override applies only to the element named, not as a blanket rule.
- **Homepage section underlines are unified:** `.features__underline`,
  `.migration__underline`, `.cloud__underline` all share one look — 150px
  wide, 4px tall, flat solid `--brand-orange`, sharp square corners.
  `.eco__underline` is the one exception (green→red→orange gradient,
  deliberate one-off).
- Folder-with-`index.html` structure (not `<page>.html`) for every page, so
  URLs stay clean (`/server-salad-cloud-services-web/cpanel-hosting/`, not
  `.../cpanel-hosting.html`) — Apache serves `index.html` automatically for a
  directory request. Apply this to any future page.

### A.4 Design tokens (consolidated reference)

All in `:root`, `css/styles.css`:

| Token | Value | Usage |
|---|---|---|
| `--brand-dark` | `#323d41` | Genuine brand touchpoints only |
| `--brand-orange` | `#f57e20` | Brand touchpoints + entire cpanel-hosting page |
| `--bg-dark` | `#0a0a0b` | Main nav background |
| `--bg-topbar` | `#000` | Topbar, footer, cph-table package header, nav mega-features box |
| `--text` | `#f5f5f7` | Light text on dark sections |
| `--text-muted` | `#b5b5bd` | Topbar text |
| `--accent` | `#e5484d` | Rose/red — hero title accent, nav, plan-card badge gradient |
| `--accent-2` | `#ff8a5c` | Paired with `--accent` in gradients |
| `--eco-green-light` | `rgb(95, 227, 154)` | Sustainability section only |
| `--radius` | `8px` | Default border-radius |
| `--container` | `1240px` | Max content width, every section |
| `--gutter` | `24px` (16px ≤600px) | Left/right page spacing, every section |
| `--font-heading` | `"Poppins", "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | Base heading stack |
| `--font-body` | `"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | Base body stack |

**Layered per-element font families** (not site-wide — see each component's CSS
in Part B for exactly which class uses which): **Cairo** (400/600/900) on most
headings/titles instead of Poppins; **Manrope** (300/400/500/600) on most
body/description text instead of Inter; **Montserrat** (600/800) narrowly on
the hero title and main nav links. All three are pinned to specific weights in
the Google Fonts `<link>` in every page's `<head>` (see B.5/B.6) — add a new
weight there before using it in CSS, or the browser fakes it.

**`.container`** = `max-width: var(--container)`, centred,
`padding: 0 var(--gutter)`. Every full-width band colours the **outer**
section element and keeps the inner `.container` for content — never add
ad-hoc left/right margins on components.

**Breakpoints used across the site:** 1240 (container), 980, 900, 860, 700,
600, 560, 480, 400/480/760 (hero logo carousel visible-count steps only).

### A.5 Project structure
```
server-salad-cloud-services-web/
  README.md                        <- this file
  index.html                       <- homepage
  css/
    styles.css                     <- all styles (tokens in :root at top)
  js/
    main.js                        <- nav, hero carousel, header/footer inject,
                                       live pricing + billing toggle
  partials/
    header.html                    <- topbar + nav, injected into every page
    footer.html                    <- footer, injected into every page
  cpanel-hosting/
    index.html                     <- 2nd page, /server-salad-cloud-services-web/cpanel-hosting/
  discount-programs/
    index.html                     <- 3rd page, /server-salad-cloud-services-web/discount-programs/
                                       (Student & Academic / Startup / Agency
                                       & Freelancer tab switcher — see B.7/C.20)
  api/
    pricing.php                    <- the one server-side file (live pricing)
  downloads/                       <- TEMPORARY staging only for owner-supplied
                                       source files (git-ignored contents, kept
                                       via .gitkeep). Process each file (crop/
                                       resize as needed), rename to an
                                       SEO-friendly slug, and move it into the
                                       matching assets/img/<section>/ folder
                                       below — then DELETE the original from
                                       downloads/. Never reference downloads/
                                       from HTML/CSS.
  assets/
    img/
      brand/       <- nav logo, footer logo, favicon (serversalad-*)
      photos/       <- eco-forest-canopy.jpg
      graphics/     <- world-map-dots.png, jetbackup-illustration.png,
                        jetbackup-logo.png, cpanel-dashboard-devices.webp
      partners/     <- 6 "powered by" carousel logos
      flags/        <- uk-flag.svg, uk-flag-circle.png
      hero/         <- 4 homepage hero-card icons (reused by Plans + mega-menu)
      why-choose/   <- 6 homepage "Why Choose Server Salad" icons
      migration/    <- 4 homepage "Effortless cPanel Transfer" icons
      cloud/        <- 6 homepage "Our Cloud Infrastructure" icons
      reviews/      <- google-logo.png, trustpilot-logo.png
      features/     <- 12 cph "Features" icons
      why-cpanel/   <- 3 cph "Why Server Salad" icons (named distinctly from
                        why-choose/ above — same kind of content, but a
                        separate, page-specific icon set; not interchangeable)
      email/        <- 6 cph "Business Email" icons
      backups/      <- 6 cph "Backups" icons
      security/     <- 6 cph "Security in Depth" icons
      workflow/     <- 6 cph "Works With Your Workflow" icons
      apps/         <- 7 one-click-install app logos (real brand colours)
      nav/          <- mega-menu mouse-pointer icon
      footer/       <- footer icons (phone/email/socials/CTA)
```
Every `assets/img/<section>/` icon (except `apps/`, real brand logos) is a
single-colour SVG saved with `fill="currentColor"`; CSS recolours it to
`--brand-orange` (or `currentColor`) via `mask` — see the masked-icon pattern
in Part B's CSS.

**`downloads/` workflow, in full:** the user drops a raw source file (original
vendor filename, oversized export, arbitrary casing) into `downloads/` for use
somewhere on the site. Never reference it from there directly. Instead: (1)
process it — crop to content bounds, resize, optimize — as the specific use
needs; (2) save the result under whichever existing `assets/img/<section>/`
folder already matches its role (don't invent a new one if an existing folder
fits); (3) name it a descriptive, kebab-case, SEO-friendly filename consistent
with its siblings in that folder (never the original upload name); (4)
reference only the new `assets/img/...` path from HTML/CSS; (5) delete the
original from `downloads/` once it's placed — the folder is temporary staging
only, cleaned after each use, not an asset store.

---

## Part B — Build Steps

Follow in order. Every code block is the complete, exact file content — copy
it verbatim into the named path.

### B.0 Before you start
Load these fonts in the `<head>` of **every** HTML page (both `index.html`
and `cpanel-hosting/index.html`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&family=Inter:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
```
Every page also carries the same `<title>Server Salad Cloud Services</title>`
and the same favicon tag:
```html
<link rel="icon" type="image/svg+xml" href="/server-salad-cloud-services-web/assets/img/brand/serversalad-favicon.svg">
```

### B.1 `css/styles.css`
```css
/* ===== Base / tokens ===== */
:root {
  /* Official brand colours (from the logo). Not used everywhere by default — reach
     for these at brand touchpoints; the rest of the UI uses a broader accent palette
     for visual interest. */
  --brand-dark: #323d41;
  --brand-orange: #f57e20;

  --bg-dark: #0a0a0b;
  --bg-topbar: #000;
  --text: #f5f5f7;
  --text-muted: #b5b5bd;
  --accent: #e5484d;
  --accent-2: #ff8a5c;
  --eco-green-light: rgb(95, 227, 154); /* used only in the sustainability section */
  --radius: 8px;
  --container: 1240px;   /* max content width — same on every section */
  --gutter: 24px;        /* left/right page spacing — same on every section */

  /* Type system — 2 families site-wide: Poppins for headings/emphasis (bold, punchy),
     Inter for body/UI text (readable at small sizes). Both loaded via Google Fonts
     in index.html <head>. Fall back to the system stack if the webfont fails. */
  --font-heading: "Poppins", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-body: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* { box-sizing: border-box; }

html, body { margin: 0; }

body {
  font-family: var(--font-body);
  color: #1b1b1f;
  background: #fff;
}

h1, h2, h3, h4,
.nav__link, .btn,
.hero-card__badge,
.mega-card__title {
  font-family: var(--font-heading);
}

a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }

/* Every full-width section wraps its content in .container so the left/right
   gutter is identical site-wide. A full-bleed background = colour the outer
   section, keep the inner .container. */
.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

@media (max-width: 600px) {
  :root { --gutter: 16px; }
}

/* ===== Top utility bar ===== */
.topbar {
  background: var(--bg-topbar);
  color: var(--text-muted);
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.topbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  height: 34px;
}

.topbar__group {
  display: flex;
  align-items: center;
  gap: 24px;
}

.topbar__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  transition: color .15s;
}
.topbar__link:hover { color: var(--text); }

/* ===== Nav dropdown (simple lists: Discount Programs, Support) ===== */
.caret {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid currentColor;
  transition: transform .15s;
}
.nav__item.is-open .caret { transform: rotate(180deg); }

.nav__item { position: relative; }

.nav__sub {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 200px;
  background: #17171a;
  border: 1px solid #26262b;
  border-radius: var(--radius);
  padding: 6px;
  list-style: none;
  margin: 0;
  box-shadow: 0 18px 40px rgba(0, 0, 0, .4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: opacity .15s, transform .15s, visibility .15s;
  z-index: 60;
}
.nav__item.is-open .nav__sub {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav__sub li a {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  color: var(--text-muted);
  padding: 9px 12px;
  border-radius: 6px;
  font-size: 13px;
  transition: background .12s, color .12s;
}
.nav__sub li a:hover {
  background: #23232a;
  color: var(--text);
}

/* ===== Mega menu (Web Hosting) =====
   .nav__item.has-mega overrides position back to static so .nav__mega (absolute,
   left:0; right:0) resolves against .nav (the full-width sticky header) instead of
   the li — that's what makes the panel span edge-to-edge. The inner .container
   re-applies the site's standard gutter so card content lines up with everything else. */
.nav__item.has-mega { position: static; }

.nav__mega {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e3e3e8;
  border-bottom: 2px solid var(--brand-orange);
  box-shadow: 0 24px 48px rgba(0, 0, 0, .12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity .18s, transform .18s, visibility .18s;
  z-index: 60;
}
.nav__item.is-open .nav__mega {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav__mega-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  padding-top: 28px;
  padding-bottom: 32px;
}
/* Used by the Web Hosting▾ and Discount Programs▾ menus (see their comments
   in header.html): a fixed-width intro column + thin divider + a flexible row
   of cards, instead of the plain auto-fit grid the other (introless) mega
   menus use. */
.nav__mega-inner--intro {
  grid-template-columns: 1fr 260px;
  align-items: stretch;
  gap: 0;
}
/* Tops already line up (both start at the grid row's top); stretch makes the
   Key Features box grow to match .nav__mega-left's height too, so its bottom
   edge lands level with the apps strip's bottom instead of ending short. */
.nav__mega-left { display: flex; flex-direction: column; }
/* Intro + divider + cards, side by side — everything left of the Key
   Features box. The app-logos strip sits below this as a 2nd row, its width
   naturally capped to this wrapper's own width (see .nav__mega-apps). */
.nav__mega-left-top {
  display: grid;
  grid-template-columns: 300px 1fr;
  align-items: start;
  gap: 0;
}
.nav__mega-intro { padding: 12px 28px 4px 0; }
.nav__mega-intro-title {
  margin: 0 0 10px;
  font-family: "Montserrat", var(--font-heading);
  font-size: 33px;
  line-height: 33px;
  font-weight: 700;
  text-transform: uppercase;
  color: rgb(40, 39, 39);
  white-space: nowrap;
}
/* Discount Programs▾'s title ("Discount Programs") is longer than Web
   Hosting's ("Web Hosting") and doesn't fit the 300px intro column on one
   line — let it wrap to two instead of overflowing into the cards column. */
.nav__mega-intro-title--wrap { white-space: normal; }
/* Gradient accent word — same red/orange gradient as .hero__title-accent. */
.nav__mega-intro-title strong {
  font-weight: 700;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nav__mega-intro-desc {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: rgb(122, 122, 122);
}
/* Divider + cards are flex siblings here (not separate grid columns) so the
   divider stretches to the cards' own content height, not the taller Key
   Features box's height. */
.nav__mega-middle { display: flex; align-items: stretch; }
.nav__mega-intro-divider { width: 1px; flex-shrink: 0; background: #e3e3e8; }
/* Stacked top-to-bottom (not side-by-side) — matches the reference's product-row
   layout, where each card runs the full width of its column. */
.nav__mega-cards { flex: 1 1 auto; display: flex; flex-direction: column; gap: 18px; padding-left: 28px; margin-right: 28px; }
.nav__mega-cards .mega-card { width: 100%; }

/* App-install logos strip — 2nd row under intro+cards, width-capped to
   .nav__mega-left (never reaches the Key Features box at any viewport
   width); wraps to a 2nd line rather than overflowing if it doesn't fit. */
.nav__mega-apps {
  position: relative;
  margin-top: 18px;
  width: max-content;
  max-width: calc(100% - 28px);
  padding: 34px 18px;
  border-radius: var(--radius);
  background: #f8f8fa;
}
/* Same traveling-bolt effect as .plans__note-beam (see its comment for why
   an SVG stroke, not a conic-gradient) — reuses its keyframes as-is. */
/* Single stroke (no separate white core), softened with an actual blur so it
   reads as a hazy glow rather than a crisp line. */
.nav__mega-apps-beam {
  position: absolute;
  inset: 0;
  pointer-events: none;
  filter: blur(1.6px) drop-shadow(0 0 6px rgba(245, 126, 32, .8));
  animation: plans-note-flicker 4.2s ease-in-out infinite;
}
.nav__mega-apps-beam svg { display: block; width: 100%; height: 100%; overflow: visible; }
.nav__mega-apps-beam-glow {
  fill: none;
  stroke-linecap: round;
  stroke: var(--brand-orange);
  stroke-width: 3;
  opacity: .9;
  animation: plans-note-travel 4.2s linear infinite,
             plans-note-length 5.6s ease-in-out infinite;
}
.nav__mega-apps-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.nav__mega-apps-logo {
  height: 38px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}
/* The whole link (text + pointer) bounces together as one unit, on top of
   which the pointer also gets its own press-squash + ripple — so the text
   isn't just sitting still while only the icon animates. All 4 animations
   below are scoped to ".nav__item.is-open" (not applied unconditionally) so
   they restart from 0% the instant the mega menu opens, instead of running
   continuously in the background the whole time it's closed — where
   visibility:hidden doesn't pause them — and being caught mid-cycle (often
   the idle stretch) whenever it's opened. */
.nav__mega-apps-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 14px;
  font-family: "Cairo", var(--font-heading);
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  color: var(--brand-orange);
}
.nav__item.is-open .nav__mega-apps-link { animation: nav-apps-link-bounce 1.8s ease-in-out infinite; }
.nav__mega-apps-link-text { max-width: 150px; text-align: right; }
.nav__item.is-open .nav__mega-apps-link-text { animation: nav-apps-text-glow 1.8s ease-in-out infinite; }
@keyframes nav-apps-link-bounce {
  0%, 100% { transform: translateY(0); }
  18% { transform: translateY(3px); }
  32% { transform: translateY(0); }
}
@keyframes nav-apps-text-glow {
  0%, 100% { text-shadow: none; }
  18% { text-shadow: 0 0 10px rgba(245, 126, 32, .6); }
  32% { text-shadow: none; }
}
/* Press-and-ripple loop — the finger dips down like it's pressing, then two
   rings expand outward from it and fade, like a tap/click ripple. */
.nav__mega-apps-link-arrow {
  position: relative;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  background-color: currentColor;
  -webkit-mask: var(--apps-link-icon) center / contain no-repeat;
  mask: var(--apps-link-icon) center / contain no-repeat;
}
.nav__item.is-open .nav__mega-apps-link-arrow { animation: nav-apps-press 1.8s ease-in-out infinite; }
.nav__mega-apps-link-arrow::before,
.nav__mega-apps-link-arrow::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  transform: translate(-50%, -50%) scale(.4);
  opacity: 0;
  pointer-events: none;
}
.nav__item.is-open .nav__mega-apps-link-arrow::before,
.nav__item.is-open .nav__mega-apps-link-arrow::after { animation: nav-apps-wave 1.8s ease-out infinite; }
.nav__mega-apps-link-arrow::after { animation-delay: .5s; }
@keyframes nav-apps-press {
  0%, 100% { transform: translateY(0) scale(1); }
  18% { transform: translateY(3px) scale(.88); }
  32% { transform: translateY(0) scale(1); }
}
@keyframes nav-apps-wave {
  0% { transform: translate(-50%, -50%) scale(.4); opacity: .6; }
  18% { opacity: .45; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .nav__mega-apps-link,
  .nav__mega-apps-link-text,
  .nav__mega-apps-link-arrow,
  .nav__mega-apps-link-arrow::before,
  .nav__mega-apps-link-arrow::after,
  .nav__item.is-open .nav__mega-apps-link,
  .nav__item.is-open .nav__mega-apps-link-text,
  .nav__item.is-open .nav__mega-apps-link-arrow,
  .nav__item.is-open .nav__mega-apps-link-arrow::before,
  .nav__item.is-open .nav__mega-apps-link-arrow::after { animation: none; }
}

/* "Key Features" / "cPanel Business Hosting Difference" box — owner-supplied
   real plan-spec copy. Solid black, same token as the footer/topbar, not a
   new colour; checkmarks use --brand-orange, not the reference's red. */
.nav__mega-features {
  padding: 20px 20px 22px;
  border-radius: var(--radius);
  background: var(--bg-topbar);
}
.nav__mega-features-title {
  margin: 0 0 12px;
  font-family: "Montserrat", var(--font-heading);
  font-size: 18px;
  line-height: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .3px;
  color: #fff;
}
.nav__mega-features-title strong {
  font-weight: 600;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nav__mega-features-title--sub { margin-top: 20px; }
.nav__mega-features-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nav__mega-features-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 20px;
  color: rgb(255, 255, 255);
}
.nav__mega-features-list li strong { color: #fff; font-weight: 700; }
.nav__mega-features-check {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  margin-top: 2px;
  color: var(--brand-orange);
}

.mega-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 18px;
  border-radius: var(--radius);
  background: #f8f8fa;
  border: 1px solid #e3e3e8;
  transition: border-color .15s, transform .15s, background .15s;
}
.mega-card:hover {
  border-color: var(--brand-orange, var(--accent-2));
  background: #f1f1f5;
  transform: translateY(-2px);
}

/* Not-yet-launched service (cPanel Business Hosting): plain <div> now, not a
   link — same "Launching Soon" hover overlay as .hero-card__soon. */
.mega-card--soon { cursor: default; }
.mega-card__soon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, .96);
  font-family: "Cairo", var(--font-heading);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: .4px;
  text-transform: uppercase;
  color: var(--brand-orange);
  opacity: 0;
  transition: opacity .2s ease;
  pointer-events: none;
}
.mega-card--soon:hover .mega-card__soon { opacity: 1; }

/* Icon + title sit inline on one row (reference-inspired layout), rather than
   icon stacked above title. */
.mega-card__row { display: flex; align-items: center; gap: 10px; }

/* Solid orange icon on a light orange-tinted tile — same combo as
   .migration-card__icon — reads with far more contrast at this small size than
   the previous white-icon-on-gradient treatment, where the thin icon linework
   washed out against the busy background. */
.mega-card__icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: rgba(245, 126, 32, .14);
  color: var(--brand-orange);
}

/* Same masked-external-SVG technique as .hero-card__icon-img (see its comment) —
   reuses the exact same icon files as the matching hero cards (cPanel Hosting /
   cPanel Business Hosting) via the --mega-icon custom property, so the icon glyph
   stays identical between the hero section and this mega-menu card. */
.mega-card__icon-img {
  width: 18px;
  height: 18px;
  background-color: currentColor;
  -webkit-mask: var(--mega-icon) center / contain no-repeat;
  mask: var(--mega-icon) center / contain no-repeat;
}

.mega-card__title {
  font-family: "Montserrat", var(--font-heading);
  font-size: 22px;
  line-height: 26px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  color: rgb(40, 39, 39);
}
.mega-card__title strong { font-weight: 500; }

.mega-card__desc {
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 300;
  line-height: 21px;
  color: rgb(122, 122, 122);
}

/* ===== Hero ===== */
.hero {
  position: relative;
  overflow: hidden;
  color: var(--text);
  /* Fill the rest of the viewport on load: 100vh minus the fixed header above it
     (34px topbar + 74px main nav). Content is vertically centred within that. */
  min-height: calc(100vh - 108px);
  display: flex;
  align-items: center;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, .12) 0, transparent 60%),
    linear-gradient(120deg, #2c1240 0%, #171a2e 45%, #0c2f37 100%);
}
.hero__bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, .35) 1px, transparent 1px);
  background-size: 34px 34px;
  opacity: .12;
}

.hero__inner {
  position: relative;
  z-index: 1;
  width: 100%; /* .hero is now a flex container (for vertical centring) — without an
                  explicit width this flex item would shrink to its content instead
                  of filling/centring like a normal block .container would. */
  padding: 64px 0 56px;
  text-align: center;
}

.hero__title {
  margin: 0 0 14px;
  font-family: "Montserrat", var(--font-heading);
  font-size: clamp(26px, 3.6vw, 40px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: .3px;
  text-transform: uppercase;
  color: rgb(255, 255, 255);
}
.hero__title-accent {
  font-weight: 600;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 22px;
  margin-top: 88px;
  margin-bottom: 40px;
}

.hero-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 14px;
  min-height: 340px;
  background: #fff;
  color: #1b1b1f;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 48px 26px;
  transition: transform .18s, box-shadow .18s, border-color .18s;
}
.hero-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, .35);
}

/* Not-yet-launched services (cPanel Business Hosting, VPS Hosting, Domains):
   plain <div> now, not a link — hovering reveals a "Launching Soon" overlay
   instead of navigating anywhere. */
.hero-card--soon { cursor: default; }
.hero-card__soon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, .96);
  font-family: "Cairo", var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: .4px;
  text-transform: uppercase;
  color: var(--brand-orange);
  opacity: 0;
  transition: opacity .2s ease;
  pointer-events: none;
}
.hero-card--soon:hover .hero-card__soon { opacity: 1; }

/* Floating pill centred on the card's top edge, half in / half out — replaces the
   earlier corner-ribbon treatment. */
.hero-card__badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: var(--brand-orange);
  border: 1.5px solid var(--brand-orange);
  font-family: "Cairo", var(--font-heading);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .3px;
  line-height: 13px;
  text-align: center;
  padding: 6px 16px;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .12);
  white-space: nowrap;
}

.hero-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-orange);
  margin-bottom: 4px;
}

/* Icon graphic itself: same masked-external-SVG technique as the cpanel-hosting
   page's .cph-feature__icon (see its comment) — painted via CSS `background-color`
   through a `mask`, so recolouring only ever means changing `color` here, not
   editing each SVG file. Each card sets its own icon file via the --hero-icon
   custom property inline on the element. */
.hero-card__icon-img {
  display: block;
  width: 34px;
  height: 34px;
  background-color: currentColor;
  -webkit-mask: var(--hero-icon) center / contain no-repeat;
  mask: var(--hero-icon) center / contain no-repeat;
}

.hero-card__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 26px;
  font-weight: 600;
  line-height: 26px;
  color: rgb(40, 39, 39);
}

.hero-card__desc {
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  color: rgb(40, 39, 39);
}

/* "Powered by" partner logo strip — stretches to the same width as .hero__cards
   above it (both are full-width children of .hero__inner). */
.hero__strip {
  margin-top: 72px;
  border-top: 1px solid rgba(255, 255, 255, .12);
  padding-top: 28px;
}

/* Fixed "window" that only ever shows 4 logo slots; the track inside slides past it.
   js/main.js sets --logo-slot = this element's width ÷ 4 on load/resize. */
.hero__logos-viewport {
  overflow: hidden;
  cursor: grab;
  -webkit-user-select: none;
  user-select: none;
}
.hero__logos-viewport.is-dragging { cursor: grabbing; }

.hero__logos {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  width: max-content;
  will-change: transform;
}
.hero__logos li {
  flex: 0 0 auto;
  width: var(--logo-slot, 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero__logos img {
  display: block;
  height: 34px;
  width: auto;
  max-width: 85%;
  opacity: .75;
  filter: brightness(0) invert(1); /* normalise all partner logos to solid white */
  transition: opacity .15s;
  -webkit-user-drag: none;
  pointer-events: none; /* clicks/drags go to the viewport, not individual images */
}

@media (max-width: 600px) {
  .hero__inner { padding: 48px 0 40px; }
  .hero__cards { grid-template-columns: 1fr; }
}

/* ===== "What Makes Us Different" ===== */
.features {
  background: #f7f7f9;
  padding: 88px 0;
}

.features__title {
  margin: 0 0 20px;
  text-align: center;
  font-family: "Cairo", var(--font-body);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 400;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgb(40, 39, 39);
}

.features__underline {
  width: 150px;
  height: 4px;
  margin: 0 auto 64px;
  border-radius: 0;
  background: var(--brand-orange);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 40px;
  row-gap: 56px;
}

.feature__icon {
  display: inline-flex;
  color: var(--brand-orange);
  margin-bottom: 16px;
}

/* Same masked-external-SVG technique as .hero-card__icon-img (see its comment) —
   background-color painted through a mask, so each card's icon file is just an
   asset swap via the --why-icon custom property, no colour baked into the file. */
.feature__icon-img {
  display: block;
  width: 30px;
  height: 30px;
  background-color: currentColor;
  -webkit-mask: var(--why-icon) center / contain no-repeat;
  mask: var(--why-icon) center / contain no-repeat;
}

.feature__title {
  margin: 0 0 10px;
  font-family: "Cairo", var(--font-heading);
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: .3px;
  color: rgb(40, 39, 39);
}
.feature__title-accent {
  display: block;
  font-weight: 900;
}

.feature__desc {
  margin: 0;
  max-width: 320px;
  font-family: "Manrope", var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgb(122, 122, 122);
}

.features__reviews {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 76px;
  padding-bottom: 12px;
}
.review-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 8px; /* same rounded-corner as .plan-card .btn--outline */
  background: #fff;
  border: 1px solid #e3e3e8;
  box-shadow: 0 6px 16px rgba(0, 0, 0, .05);
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: rgb(76, 73, 96);
  transition: transform .15s, box-shadow .15s, border-color .15s;
}
.review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, .09);
  border-color: #d4d4db;
}
.review-btn__icon { width: 18px; height: 18px; flex-shrink: 0; }
.review-btn__arrow {
  color: var(--brand-orange);
  font-weight: 700;
  transition: transform .15s;
}
.review-btn:hover .review-btn__arrow { transform: translateX(3px); }

@media (max-width: 860px) {
  .features__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .features { padding: 64px 0; }
  .features__grid { grid-template-columns: 1fr; row-gap: 40px; }
  .feature__desc { max-width: none; }
  .features__reviews { flex-direction: column; align-items: stretch; }
  .review-btn { justify-content: center; }
}

/* ===== Main navigation ===== */
.nav {
  background: var(--bg-dark);
  color: var(--text);
  border-bottom: 1px solid #1c1c20;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav__inner {
  display: flex;
  align-items: center;
  gap: 40px;
  height: 74px;
}

.brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.brand__logo {
  display: block;
  height: 46px;
  width: auto;
  border-radius: 9px;
}

.nav__menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;  /* whole group (links + My Account) flush to the right,
                                  mirroring the logo's gutter on the left */
  gap: 30px;
  flex: 1;
}

.nav__list {
  display: flex;
  align-items: center;
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: 0;
  color: rgba(255, 255, 255, .9);
  font-family: "Montserrat", var(--font-heading);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: .3px;
  text-transform: uppercase;
  padding: 0;
  transition: color .15s;
}
.nav__link:hover { color: var(--brand-orange); }

/* Not-yet-launched top-level nav items (Servers, Domains): plain <span>, not a
   link — hovering/focusing shows a small "Launching Soon" tooltip below it.
   Same white-pill/orange-border look as .hero-card__badge, for visual
   consistency with the other "coming soon" treatments on the site. */
.nav__link--soon { cursor: default; }
.nav__link--soon:hover { color: rgba(255, 255, 255, .9); }

.nav__tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 4px);
  margin-top: 14px;
  background: #fff;
  color: var(--brand-orange);
  border: 1.5px solid var(--brand-orange);
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .3px;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 6px 14px;
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, .2);
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s ease, transform .18s ease;
  z-index: 20;
}
.nav__tooltip::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: var(--brand-orange);
}
.nav__tooltip::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(1.5px);
  border: 5px solid transparent;
  border-bottom-color: #fff;
}
.nav__item--soon:hover .nav__tooltip,
.nav__link--soon:focus-visible + .nav__tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 12px 26px;
  font-weight: 700;
  font-size: 14px;
  transition: transform .12s, box-shadow .15s, background .15s;
}
.btn--account {
  background: #fff;
  color: rgb(54, 51, 65);
  font-family: "Montserrat", var(--font-heading);
  line-height: 14px;
}
.btn--account:hover {
  background: var(--brand-orange);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 255, 255, .18);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 0;
  margin-left: auto;
  padding: 6px;
}
.nav__burger span {
  width: 24px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform .2s, opacity .2s;
}
.nav__burger.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__burger.is-active span:nth-child(2) { opacity: 0; }
.nav__burger.is-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ===== Responsive ===== */
@media (max-width: 980px) {
  .topbar__inner { gap: 16px; flex-wrap: wrap; height: auto; padding-top: 8px; padding-bottom: 8px; }

  .nav__burger { display: flex; }

  .nav__inner { gap: 16px; }

  .nav__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    background: var(--bg-dark);
    border-bottom: 1px solid #1c1c20;
    padding: 8px 24px 20px;
    max-height: 0;
    overflow: hidden;
    transition: max-height .25s ease;
  }
  .nav__menu.is-open { max-height: 90vh; overflow: auto; }

  .nav__list { flex-direction: column; align-items: stretch; gap: 0; }
  .nav__item { border-bottom: 1px solid #1c1c20; }
  .nav__link { width: 100%; justify-content: space-between; padding: 16px 0; }

  .nav__sub {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: 0;
    background: #101013;
    display: none;
    margin: 0 0 10px;
  }
  .nav__item.is-open .nav__sub { display: block; }

  /* Mega menu collapses to the same stacked-list treatment as a simple dropdown —
     card grid doesn't make sense on small screens. */
  .nav__mega {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: 0;
    background: #101013;
    display: none;
  }
  .nav__item.is-open .nav__mega { display: block; }

  .nav__mega-inner,
  .nav__mega-inner--intro {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0 0 10px;
    max-width: none;
    margin: 0;
  }

  /* Intro column (Web Hosting▾ only) stacks above the card list instead of
     sitting beside it, and its divider (a vertical rule on desktop) is dropped
     rather than rendered sideways. */
  .nav__mega-left-top { display: flex; flex-direction: column; gap: 0; }
  .nav__mega-intro { padding: 12px 0; }
  .nav__mega-middle { flex-direction: column; }
  .nav__mega-intro-divider { display: none; }
  .nav__mega-cards { flex-direction: column; padding-left: 0; margin-right: 0; gap: 0; }
  .nav__mega-apps { margin: 12px 0 0; width: auto; max-width: 100%; padding: 14px; }
  .nav__mega-apps-row { flex-wrap: wrap; justify-content: flex-start; }
  .nav__mega-features { margin: 12px 0 0; }

  .mega-card {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid #1c1c20;
    background: none;
  }
  .mega-card:hover { background: none; transform: none; }
  .mega-card__desc { display: none; }

  .btn--account { margin: 16px 0 0; align-self: flex-start; }
}

/* ===== Sustainability ===== */
.eco {
  position: relative;
  z-index: 0; /* establishes a stacking context so .eco__photo's z-index:-1 stays
                 contained inside .eco instead of escaping below the page background */
  overflow: hidden;
  color: var(--text);
}

/* Photo sits at full strength as the base layer; .eco__bg on top is a *translucent*
   (not opaque) dark-green tint, so the photo shows through faintly instead of being
   fully blocked by a solid colour. (Previously .eco__bg's gradient stops had no
   alpha at all, so it was 100% opaque and hid the photo completely regardless of
   z-index/opacity — that was the actual bug, not a caching issue.) */
.eco__photo {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: url("../assets/img/photos/eco-forest-canopy.jpg");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed; /* parallax: image stays put in the viewport while
    the page scrolls past it, instead of scrolling with the section. Desktop only —
    background-attachment:fixed is unreliable on mobile Safari/iOS, which falls back
    to normal scrolling there regardless of this rule. */
}

.eco__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, .08) 0, transparent 55%),
    linear-gradient(120deg, rgba(10, 61, 44, .68) 0%, rgba(6, 42, 32, .74) 55%, rgba(4, 26, 21, .8) 100%);
}

.eco__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 0;
}

.eco__content { max-width: 560px; }

.eco__label {
  display: block;
  margin-bottom: 10px;
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--eco-green-light);
}

.eco__title {
  margin: 0;
  font-family: "Cairo", "Manrope", var(--font-heading);
  font-size: clamp(24px, 3vw, 35px);
  font-weight: 600;
  line-height: 1.2;
  color: rgb(255, 255, 255);
}
.eco__title-accent { color: var(--brand-orange); }

.eco__underline {
  width: 150px;
  height: 4px;
  margin: 16px auto 18px;
  border-radius: 0;
  background: linear-gradient(90deg, #2f9e44, var(--accent), var(--accent-2));
}

.eco__desc {
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 24px;
  color: rgba(255, 255, 255, .78);
}

/* The global `a { color: inherit; text-decoration: none }` reset would make this
   indistinguishable from the surrounding text, so it needs explicit link styling.
   Underlined (not colour alone) so it still reads as a link without relying on
   colour perception. */
.eco__link {
  color: #fff;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(255, 255, 255, .45);
  transition: color .15s, text-decoration-color .15s;
}
.eco__link:hover,
.eco__link:focus-visible {
  color: var(--brand-orange);
  text-decoration-color: var(--brand-orange);
}

@media (max-width: 900px) {
  .eco__inner { padding: 56px 0; }
}

/* ===== Plans ===== */
.plans-locations {
  background: linear-gradient(to bottom, #ffffff 0%, #f5f5f7 35%, #e2e2e8 100%);
}

.plans {
  padding: 88px 0 48px;
}

.plans__inner {
  text-align: center;
}

.plans__title {
  margin: 0 0 10px;
  font-family: "Cairo", var(--font-heading);
  font-size: clamp(22px, 3vw, 33px);
  font-weight: 600;
  line-height: 1;
  color: rgb(40, 39, 39);
}
.plans__title strong { font-weight: 900; }
.plans__title-accent { font-weight: 600; }

.plans__subtitle {
  margin: 18px 0 32px;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 300;
  line-height: 14px;
  color: rgb(122, 122, 122);
}

.plans__note {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 56px;
  padding: 18px 30px;
  border: 1px solid #e3e3e8;
  border-radius: 14px;
  font-family: "Cairo", var(--font-heading);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: rgb(122, 122, 122);
  background: #fff;
}

/* A single bright bar of light travels continuously around the card's border,
   instead of the whole border blinking/pulsing on and off. This is drawn as an SVG
   rect stroke (not a conic-gradient) specifically because conic-gradient's angle is
   measured from the box's *center* — on a wide, short pill like this one, equal
   angle steps cover very uneven physical distances near the corners, which made the
   comet visually stretch/tear into two pieces as it crossed them. An SVG stroke
   with pathLength="200" walks the *actual* rounded-rect perimeter at constant
   speed, so the bar stays one continuous piece all the way around, on any box size. */
.plans__note-beam {
  position: absolute;
  inset: 0;
  pointer-events: none;
  filter: blur(1.6px) drop-shadow(0 0 6px rgba(245, 126, 32, .8));
  animation: plans-note-flicker 4.2s ease-in-out infinite;
}
.plans__note-beam svg { display: block; width: 100%; height: 100%; overflow: visible; }

/* Single stroke (no separate white core) travels the border at one constant
   speed (plans-note-travel is linear, no dart/stall), softened by the blur
   on .plans__note-beam above so it reads as a hazy glow, not a crisp line. */
.plans__note-beam-glow {
  fill: none;
  stroke-linecap: round;
  stroke: var(--brand-orange);
  stroke-width: 3;
  opacity: .9;
  animation: plans-note-travel 4.2s linear infinite,
             plans-note-length 5.6s ease-in-out infinite;
}
/* Constant travel speed — a plain linear loop around the full perimeter, no
   dart/stall pacing. Paired with a soft brightness flicker on the glow so it
   still reads as an arc rather than a plain progress bar. */
@keyframes plans-note-travel {
  0%   { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -200; }
}
/* The bolt's length pulses on its own timeline (uneven stops, a duration that
   doesn't evenly divide the travel loop) so it reads as "sometimes short,
   sometimes long" rather than a metronomic grow/shrink synced to the travel. */
@keyframes plans-note-length {
  0%, 100% { stroke-dasharray: 22 178; }
  35%      { stroke-dasharray: 55 145; }
  60%      { stroke-dasharray: 30 170; }
  85%      { stroke-dasharray: 48 152; }
}
@keyframes plans-note-flicker {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(245, 126, 32, .75)); }
  20%      { filter: drop-shadow(0 0 9px rgba(245, 126, 32, .95)); }
  38%      { filter: drop-shadow(0 0 2px rgba(245, 126, 32, .4)); }
  42%      { filter: drop-shadow(0 0 5px rgba(245, 126, 32, .75)); }
  60%      { filter: drop-shadow(0 0 10px rgba(245, 126, 32, 1)); }
  80%      { filter: drop-shadow(0 0 2px rgba(245, 126, 32, .4)); }
  84%      { filter: drop-shadow(0 0 5px rgba(245, 126, 32, .75)); }
}

@media (prefers-reduced-motion: reduce) {
  .plans__note-beam,
  .nav__mega-apps-beam { display: none; }
}

.plans__note-icon { display: flex; color: var(--brand-orange); flex-shrink: 0; }
.plans__note-icon svg { width: 34px; height: 34px; }

.plans__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 480px));
  justify-content: center;
  gap: 26px;
  text-align: left;
}

.plan-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 40px 30px 46px;
  border: 1px solid #c9c9d2;
  border-radius: 14px;
  transition: border-color .18s, box-shadow .18s, transform .18s;
}
.plan-card:hover {
  border-color: var(--brand-orange);
  box-shadow: 0 18px 40px rgba(0, 0, 0, .08);
  transform: translateY(-3px);
}

/* A diagonal corner ribbon (not a centered banner) — sits across the top-right
   corner at 45deg, overhanging both edges slightly so the card's own
   `overflow: hidden` clips it flush with the rounded corner, the classic
   "Sale"/"Most Popular" ribbon treatment. */
.plan-card__badge {
  position: absolute;
  top: 22px;
  right: -38px;
  width: 150px;
  padding: 6px 0;
  transform: rotate(45deg);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: rgb(255, 255, 255);
  font-family: "Cairo", var(--font-heading);
  font-size: 12px;
  font-weight: 600;
  line-height: 13px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: .3px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .18);
}

.plan-card__icon {
  display: block;
  width: 30px;
  height: 30px;
  margin-bottom: 20px;
  background-color: var(--brand-orange);
  mask: var(--plan-icon) center / contain no-repeat;
  -webkit-mask: var(--plan-icon) center / contain no-repeat;
}

.plan-card__title {
  margin: 0 0 10px;
  font-family: "Cairo", var(--font-heading);
  font-size: 26px;
  font-weight: 600;
  line-height: 26px;
  color: rgb(40, 39, 39);
}

.plan-card__desc {
  margin: 0 0 26px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 23px;
  color: rgb(153, 153, 153);
}

.plan-card__features {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 0 44px;
  padding: 0;
  list-style: none;
}
.plan-card__features li {
  position: relative;
  padding-left: 24px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 23px;
  color: rgb(153, 153, 153);
}
.plan-card__features li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(245, 126, 32, .12);
}
.plan-card__features li::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 8px;
  width: 6px;
  height: 3px;
  border-left: 1.6px solid var(--brand-orange);
  border-bottom: 1.6px solid var(--brand-orange);
  transform: rotate(-45deg);
}

.plan-card__price {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 58px;
  margin: 16px 0 26px;
}
.plan-card__price-label {
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 300;
  line-height: 14px;
  letter-spacing: .08em;
  color: rgb(122, 122, 122);
}
.plan-card__price-value {
  font-family: "Manrope", var(--font-body);
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  color: var(--brand-orange);
}
.plan-card__price-period {
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgb(136, 136, 136);
  margin-left: 2px;
}
.plan-card__price--soon {
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: .02em;
  color: rgb(122, 122, 122);
}
/* "billed as LKR X/year" line — the annual-equivalent total that backs the
   per-month figure above it. Populated by renderPrices() via [data-billed].
   The cPanel Business Hosting card carries an EMPTY copy of this element
   (aria-hidden, no [data-billed]) purely as a spacer, so its description /
   features / button line up row-for-row with the cPanel Hosting card's —
   hence the min-height, which reserves the line whether or not it has text. */
.plan-card__billed {
  min-height: 14px;
  margin: -18px 0 24px; /* -18 pulls it up close under .plan-card__price's 26px bottom */
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 300;
  line-height: 14px;
  color: rgb(122, 122, 122);
}

.plan-card .btn--outline {
  width: auto;
  align-self: center;
  padding: 12px 32px;
  margin-top: auto;
  border-radius: 8px; /* rounded-corner button (overrides the base .btn pill) */
}

.btn--outline {
  display: inline-flex;
  width: 100%;
  justify-content: center;
  background: transparent;
  border: 1.5px solid var(--brand-orange);
  font-family: "Montserrat", var(--font-heading);
  font-size: 15px;
  font-weight: 700;
  line-height: 15px;
  color: var(--brand-orange);
}
.btn--outline:hover { background: var(--brand-orange); color: #fff; }

/* Not-yet-launched plan (cPanel Business Hosting): plain <span> now, not a
   link — hovering/focusing swaps the label for "Launching Soon" instead of
   navigating anywhere. */
.btn--soon { position: relative; overflow: hidden; cursor: default; }
.btn--soon-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-orange);
  color: #fff;
  opacity: 0;
  transition: opacity .18s ease;
  pointer-events: none;
}
.btn--soon:hover .btn--soon-overlay,
.btn--soon:focus-visible .btn--soon-overlay {
  opacity: 1;
}

@media (max-width: 860px) {
  .plans__cards { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .plans { padding: 64px 0 36px; }
}

/* ===== Locations ===== */
.locations {
  padding: 48px 0 88px;
  text-align: center;
}

.locations__map {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}
.locations__map-img {
  display: block;
  width: 100%;
  height: auto;
}

/* Pin coordinates are hand-placed to sit over London, UK on this specific map image. */
.locations__pin {
  position: absolute;
  left: 46.5%;
  top: 37%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
}
.locations__pin-dot {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--brand-orange);
  box-shadow: 0 0 0 5px rgba(245, 126, 32, .18);
}
.locations__pin-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--brand-orange);
  animation: locations-pulse 2s ease-out infinite;
}
@keyframes locations-pulse {
  0% { transform: scale(1); opacity: .55; }
  100% { transform: scale(3.4); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .locations__pin-pulse { animation: none; opacity: 0; }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Hover/focus card: hidden by default, revealed when the pin is hovered or
   focused (keyboard users can tab to it, since .locations__pin has tabindex="0"). */
.locations__pin { display: block; cursor: pointer; }
.locations__pin:focus { outline: none; }
.locations__pin:focus .locations__pin-dot { box-shadow: 0 0 0 5px rgba(245, 126, 32, .32); }

.locations__card {
  position: absolute;
  left: calc(100% + 18px);
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  width: 260px;
  text-align: left;
  background: #fff;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 20px 44px rgba(0, 0, 0, .16);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity .18s, transform .18s, visibility .18s;
  z-index: 5;
}
.locations__pin:hover .locations__card,
.locations__pin:focus .locations__card,
.locations__pin:focus-within .locations__card {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}
.locations__card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  font-family: "Manrope", var(--font-body);
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
  color: rgb(40, 39, 39);
}
.locations__card-flag {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
}
.locations__card p {
  margin: 0 0 10px;
  font-family: "Manrope", var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgb(40, 39, 39);
}
.locations__card p:last-child { margin-bottom: 0; }

@media (max-width: 700px) {
  .locations__card {
    left: 50%;
    top: calc(100% + 16px);
    transform: translateX(-50%) translateY(-6px);
    width: min(280px, 80vw);
  }
  .locations__pin:hover .locations__card,
  .locations__pin:focus .locations__card,
  .locations__pin:focus-within .locations__card {
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 560px) {
  .locations { padding: 36px 0 64px; }
}

/* ===== Migration ===== */
.migration {
  position: relative;
  overflow: hidden;
  color: var(--text);
  background:
    radial-gradient(circle at 12% 18%, rgba(245, 126, 32, .14) 0, transparent 45%),
    radial-gradient(circle at 88% 88%, rgba(229, 72, 77, .12) 0, transparent 45%),
    linear-gradient(135deg, #1b2427 0%, #2b383c 52%, #141b1d 100%);
}

.migration__inner { padding: 88px 0; }

.migration__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
  align-items: center;
  gap: 48px;
  margin-bottom: 64px;
}

.migration__eyebrow {
  display: block;
  margin-bottom: 16px;
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffa45c; /* lighter tint of --brand-orange: the full-saturation orange
                     visually vibrates against this dark background at small
                     uppercase sizes */
}

.migration__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: clamp(28px, 3.6vw, 40px);
  font-weight: 600;
  line-height: 1.15;
  color: rgb(255, 255, 255);
}

.migration__underline {
  width: 150px;
  height: 4px;
  margin: 16px 0 20px;
  border-radius: 0;
  background: var(--brand-orange);
}

.migration__desc {
  margin: 0;
  max-width: 620px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 25px;
  color: rgba(255, 255, 255, .82);
}
.migration__desc strong { color: #fff; font-weight: 700; }

/* Illustration: "your current host" box --dashed arrow--> "ServerSalad" box */
.migration__visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.migration__box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 132px;
  padding: 18px 16px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 14px;
  background: rgba(255, 255, 255, .04);
}
.migration__box--ours {
  align-items: center;
  text-align: center;
  border-color: rgba(245, 126, 32, .45);
  background: rgba(245, 126, 32, .08);
  box-shadow: 0 16px 34px rgba(0, 0, 0, .28);
}
.migration__box-label {
  font-family: "Cairo", var(--font-heading);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: .2px;
  color: rgba(255, 255, 255, .75);
}
.migration__box--ours .migration__box-label { color: #fff; }
.migration__bar {
  height: 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, .22);
}
.migration__bar--mid { width: 78%; }
.migration__bar--short { width: 52%; }
.migration__tick {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  margin: 2px 0;
  border-radius: 50%;
  border: 2px solid var(--brand-orange);
  color: var(--brand-orange);
}
.migration__tick svg { width: 20px; height: 20px; }
.migration__box-note {
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 300;
  letter-spacing: .4px;
  color: rgba(255, 255, 255, .6);
}
.migration__arrow {
  width: 110px;
  height: 60px;
  flex-shrink: 0;
  overflow: visible;
  color: rgba(245, 126, 32, .6);
}
/* Dashes travel toward the destination. -12 = one full dash+gap cycle (6 + 6), so
   the loop is seamless. The file packet riding the same path is animated in the
   markup via <animateMotion> + <mpath>, which references the path itself rather
   than duplicating its `d` here (so the two can never drift apart). */
.migration__arrow-path {
  animation: migration-flow 1s linear infinite;
}
@keyframes migration-flow {
  to { stroke-dashoffset: -12; }
}

/* Destination box glows as the packet lands (same 2.6s cycle as the packet). */
.migration__box--ours {
  animation: migration-arrive 2.6s ease-in-out infinite;
}
@keyframes migration-arrive {
  0%, 62% { box-shadow: 0 16px 34px rgba(0, 0, 0, .28); }
  80% { box-shadow: 0 16px 34px rgba(0, 0, 0, .28), 0 0 0 4px rgba(245, 126, 32, .18); }
  100% { box-shadow: 0 16px 34px rgba(0, 0, 0, .28); }
}

@media (prefers-reduced-motion: reduce) {
  .migration__arrow-path,
  .migration__box--ours { animation: none; }
  .migration__packet { display: none; }
}

.migration__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.migration-card {
  padding: 26px 22px;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 14px;
  background: rgba(255, 255, 255, .04);
  transition: border-color .18s, background .18s, transform .18s;
}
.migration-card:hover {
  border-color: rgba(245, 126, 32, .5);
  background: rgba(255, 255, 255, .07);
  transform: translateY(-3px);
}
.migration-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-bottom: 18px;
  border-radius: 11px;
  background: rgba(245, 126, 32, .14);
  color: var(--brand-orange);
}

/* Same masked-external-SVG technique as .hero-card__icon-img (see its comment). */
.migration-card__icon-img {
  width: 22px;
  height: 22px;
  background-color: currentColor;
  -webkit-mask: var(--migration-icon) center / contain no-repeat;
  mask: var(--migration-icon) center / contain no-repeat;
}
.migration-card__title {
  margin: 0 0 10px;
  font-family: "Cairo", "Manrope", var(--font-heading);
  font-size: 17px;
  font-weight: 600;
  line-height: 21px;
  color: rgb(255, 255, 255);
}
.migration-card__desc {
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 20px;
  color: rgba(255, 255, 255, .76);
}

@media (max-width: 980px) {
  .migration__top { grid-template-columns: 1fr; gap: 40px; }
  .migration__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .migration__inner { padding: 64px 0; }
  .migration__grid { grid-template-columns: 1fr; }
  .migration__arrow { width: 62px; }
}

/* ===== Cloud infrastructure ===== */
.cloud {
  padding: 88px 0;
  /* Airy "sky" wash instead of the reference's stock cloud photo — same reasoning as
     the Secret Sauce section: no stock image sourced without known licensing. */
  background: linear-gradient(180deg, #ffffff 0%, #eef3f8 55%, #e7eef6 100%);
}

/* Sizing/proportions here follow the owner's reference: a large, light-weight
   heading over a wide underline, then roomy cards with big icons and titles.
   Deliberately larger than the site's other card sections — don't normalise. */
.cloud__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: clamp(26px, 3.4vw, 36px);
  font-weight: 400;
  line-height: 1;
  color: rgb(40, 39, 39);
}

.cloud__underline {
  width: 150px;
  height: 4px;
  margin: 18px 0 46px;
  border-radius: 0;
  background: var(--brand-orange);
}

.cloud__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.cloud-card {
  display: flex;
  align-items: flex-start;
  gap: 22px;
  padding: 30px 32px;
  border: 1px solid rgba(245, 126, 32, .38);
  border-radius: 9px;
  background: rgba(255, 255, 255, .82);
  transition: border-color .18s, box-shadow .18s, transform .18s;
}
.cloud-card:hover {
  border-color: var(--brand-orange);
  box-shadow: 0 16px 34px rgba(50, 61, 65, .1);
  transform: translateY(-3px);
}

.cloud-card__icon {
  display: flex;
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--brand-orange);
}
/* Same masked-external-SVG technique as .hero-card__icon-img (see its comment). */
.cloud-card__icon-img {
  display: block;
  width: 32px;
  height: 32px;
  background-color: currentColor;
  -webkit-mask: var(--cloud-icon) center / contain no-repeat;
  mask: var(--cloud-icon) center / contain no-repeat;
}

.cloud-card__title {
  margin: 0 0 16px;
  font-family: "Cairo", var(--font-heading);
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: rgb(40, 39, 39);
}
.cloud-card__title strong { font-weight: 900; }

.cloud-card__desc {
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgb(122, 122, 122);
}

@media (max-width: 860px) {
  .cloud__grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .cloud { padding: 64px 0; }
  .cloud-card { padding: 24px 22px; gap: 16px; }
  .cloud-card__title { font-size: 18px; }
  .cloud-card__icon-img { width: 28px; height: 28px; }
  .cloud__underline { width: 140px; }
}

/* ===== Footer ===== */
.footer {
  background: var(--bg-topbar); /* solid black — bookends the equally-black topbar */
  color: rgba(245, 245, 247, .68);
  border-top: 1px solid #fff;
}

.footer__inner { padding: 72px 0 0; }

.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px;
  padding-bottom: 52px;
}

/* This logo (icon square + "SERVER" wordmark) is drawn in --brand-dark (#323D41),
   designed to sit on a LIGHT background — both the icon's own backdrop and the
   "SERVER" text are nearly invisible against this footer's pure black. A
   translucent chip (rgba(255,255,255,.08) ≈ near-black once composited) wasn't
   bright enough; needs a genuinely light/solid backing, not just "less black". */
.footer__logo-link {
  display: inline-flex;
  padding: 10px 16px;
  border-radius: 10px;
  background: #f5f5f7;
}
.footer__logo { display: block; height: 40px; width: auto; }

.footer__tagline-desc {
  margin: 22px 0 0;
  max-width: 320px;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 300;
  line-height: 21px;
  color: rgb(247, 251, 250);
}
.footer__tagline {
  margin: 14px 0 22px;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 300;
  line-height: 21px;
  letter-spacing: .3px;
  color: rgb(247, 251, 250);
}

.footer__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .16);
  color: rgb(255, 255, 255);
  font-family: "Cairo", var(--font-heading);
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
}
.footer__cta:hover { background: rgba(255, 255, 255, .1); }
/* Same masked-external-SVG technique as .hero-card__icon-img (see its comment). */
.footer__cta-icon {
  display: block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background-color: var(--brand-orange);
  -webkit-mask: var(--footer-cta-icon) center / contain no-repeat;
  mask: var(--footer-cta-icon) center / contain no-repeat;
}

.footer__col-title {
  display: block;
  margin-bottom: 22px;
  padding-top: 12px;
  /* Same red -> orange gradient as .cph-backups__underline (owner's "orange
     and red mixed" gradient) instead of flat --brand-orange — border-color
     can't take a gradient directly, so border-image stretches it across
     this single (top-only) border side; other sides stay borderless since
     their width is still 0. */
  border-top: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--accent), var(--accent-2)) 1;
  font-family: "Cairo", var(--font-heading);
  font-size: 17px;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: rgb(255, 255, 255);
}
/* "Follow Us" title: no top border/padding (it's not the column's first item), and
   no bottom margin either — the flex column's own `gap` already spaces it from the
   icon row below; without zeroing this out, the margin and the gap stack (22px +
   14px = 36px), which is why the icons sat too far from the label. */
.footer__col--touch .footer__col-title:last-of-type {
  padding-top: 0;
  border-top: 0;
  margin-bottom: 0;
}

/* align-items: flex-start so each <li> shrinks to its own text width instead
   of stretching to the column's full width — otherwise .footer__tooltip's
   left:50% below centers on that full-width box instead of the short label
   text sitting inside it, landing the tooltip far off to the side. */
.footer__links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.footer__links a,
.footer__links-link--soon {
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 13px;
  color: rgba(245, 245, 247, .68);
  transition: color .15s;
}
.footer__links a:hover { color: var(--brand-orange); }

/* Not-yet-launched products (cPanel Business Hosting, VPS Hosting, Domains):
   plain <span>, not a link — hovering/focusing shows a small "Launching
   Soon" tooltip, same idea as the nav's .nav__tooltip (Servers/Domains) but
   positioned ABOVE the item instead of below, since these sit at the very
   bottom of the page and a below-item tooltip could run off past the
   viewport/page edge. */
.footer__links-item--soon { position: relative; }
.footer__links-link--soon { display: inline-block; cursor: default; }
.footer__links-link--soon:hover { color: rgba(245, 245, 247, .68); }

.footer__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, -4px);
  margin-bottom: 10px;
  background: #fff;
  color: var(--brand-orange);
  border: 1.5px solid var(--brand-orange);
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .3px;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 6px 14px;
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, .2);
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s ease, transform .18s ease;
  z-index: 20;
}
.footer__tooltip::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--brand-orange);
}
.footer__tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-1.5px);
  border: 5px solid transparent;
  border-top-color: #fff;
}
.footer__links-item--soon:hover .footer__tooltip,
.footer__links-link--soon:focus-visible + .footer__tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
}

.footer__col--touch { display: flex; flex-direction: column; gap: 14px; }

.footer__contact-line {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 13px;
  color: rgba(245, 245, 247, .78);
  transition: color .15s;
}
/* Same masked-external-SVG technique as .hero-card__icon-img (see its comment). */
.footer__contact-line-icon {
  display: block;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  background-color: var(--brand-orange);
  -webkit-mask: var(--footer-icon) center / contain no-repeat;
  mask: var(--footer-icon) center / contain no-repeat;
}
.footer__contact-line:hover { color: #fff; }

.footer__underline {
  width: 60px;
  height: 3px;
  margin: 6px 0 2px;
  /* Same red -> orange gradient as .cph-backups__underline / .footer__col-title
     above (owner's "orange and red mixed" gradient), instead of flat --brand-orange. */
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

/* Same lesson as the logo backdrop above: a faint translucent circle on pure black
   barely registers. Brighter fill + a visible border + full-white icon colour
   (was rgba(245,245,247,.7)) so the circles read clearly at rest, not just on hover. */
.footer__social { display: flex; gap: 12px; }
.footer__social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .14);
  border: 1px solid rgba(255, 255, 255, .22);
  color: #fff;
  transition: background .15s, border-color .15s, color .15s;
}
.footer__social a:hover { background: var(--brand-orange); border-color: var(--brand-orange); color: #fff; }
/* Same masked-external-SVG technique as .hero-card__icon-img (see its comment) —
   background-color: currentColor picks up the anchor's own `color: #fff`, so the
   icon stays white in both the resting and hover state, matching the old inline
   `fill/stroke="currentColor"` SVGs' behaviour exactly. */
.footer__social-icon {
  display: block;
  width: 16px;
  height: 16px;
  background-color: currentColor;
  -webkit-mask: var(--social-icon) center / contain no-repeat;
  mask: var(--social-icon) center / contain no-repeat;
}

.footer__bottom {
  padding: 22px 0;
  border-top: 1px solid rgba(255, 255, 255, .1);
  text-align: center;
}
.footer__bottom p {
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 11px;
  font-weight: 300;
  line-height: 11px;
  color: rgb(247, 251, 250);
}

@media (max-width: 980px) {
  .footer__grid { grid-template-columns: 1fr 1fr; row-gap: 44px; }
  .footer__brand { grid-column: 1 / -1; }
}

@media (max-width: 560px) {
  .footer__inner { padding: 56px 0 0; }
  .footer__grid { grid-template-columns: 1fr; gap: 40px; }
}

/* ===== cPanel Hosting page: hero ===== */
.cph-hero {
  position: relative;
  overflow: hidden;
  color: var(--text);
}

/* Same gradient + dot-grid treatment as the homepage .hero__bg (no stock "person
   at a laptop" photo was supplied for this page, so a CSS backdrop stands in) —
   deliberately reused rather than inventing a new palette, so this page still
   reads as part of the same site. */
.cph-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, .12) 0, transparent 60%),
    linear-gradient(120deg, #2c1240 0%, #171a2e 45%, #0c2f37 100%);
}
.cph-hero__bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, .35) 1px, transparent 1px);
  background-size: 34px 34px;
  opacity: .12;
}

.cph-hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 620px);
  align-items: center;
  gap: 48px;
  padding: 96px 0;
}

.cph-hero__title {
  margin: 0;
  font-family: "Montserrat", var(--font-heading);
  font-size: 54px;
  line-height: 59px;
  font-weight: 800;
  letter-spacing: .3px;
  text-transform: uppercase;
}
.cph-hero__title-accent {
  font-weight: 600;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cph-hero__underline {
  width: 64px;
  height: 3px;
  margin: 20px 0 24px;
  border-radius: 2px;
  background: linear-gradient(90deg, #ffb27a, var(--brand-orange));
}

.cph-hero__desc {
  margin: 0 0 18px;
  max-width: 520px;
  font-family: "Manrope", var(--font-body);
  font-size: 17px;
  font-weight: 400;
  line-height: 29px;
  color: rgba(255, 255, 255, .85);
}
.cph-hero__desc:last-of-type { margin-bottom: 0; }

.cph-hero__visual img {
  display: block;
  width: 100%;
  height: auto;
}

/* Used on hero instances with no product-screenshot visual (see
   discount-programs/index.html) — collapses the two-column grid to one
   centred column instead of leaving an empty, lopsided second column. Same
   centred-content pattern as .eco__inner/.eco__content elsewhere. */
.cph-hero__inner--centered {
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  text-align: center;
}
.cph-hero__inner--centered .cph-hero__content { max-width: 700px; }
.cph-hero__inner--centered .cph-hero__underline { margin-left: auto; margin-right: auto; }
.cph-hero__inner--centered .cph-hero__desc { margin-left: auto; margin-right: auto; }

@media (max-width: 980px) {
  .cph-hero__inner { grid-template-columns: 1fr; padding: 72px 0; }
  .cph-hero__visual { order: -1; }
}

@media (max-width: 560px) {
  .cph-hero__inner { padding: 56px 0; gap: 36px; }
}

/* ===== cPanel Hosting page: Plans & feature comparison ===== */
.cph-plans {
  background: #f7f7f9;
  padding: 88px 0;
}

/* Sits immediately before the toggle, invisible — purely an
   IntersectionObserver target (see js/main.js) marking where the toggle's own
   top edge is in normal flow, so JS can tell exactly when it locks into its
   sticky position (see .cph-billing-toggle.is-stuck below). 1px, not 0 —
   some browsers handle intersection ratios unreliably for a truly zero-area
   target. */
.cph-billing-toggle__sentinel { height: 1px; }
/* Same idea, marking where the package header row (.cph-table__intro /
   .cph-table__pkg below) sits in normal flow, so js/main.js can tell when
   IT locks into its own (later, lower) sticky spot. */
.cph-table__pkg-sentinel { height: 1px; }

/* Billing toggle (Monthly / Annually) — see js/main.js for the switch handler
   and the monthly↔annual price math, README "Pricing API" for why the annual
   figures are calculated client-side rather than a 2nd DB column.

   Pinned under the sticky nav (74px + a small gap) while scrolling through the
   feature rows below, with the black package-header row (.cph-table__intro /
   .cph-table__pkg) pinned right beneath it. This toggle's own stick range is
   bounded by .cph-plans__sticky-scope (toggle + both table grids), longer than
   the header's — see .cph-table--main / .cph-table--cta for why the header
   specifically releases right as the CTA row arrives; it's fine for this
   toggle to stay stuck a bit past that point, same as any ordinary sticky bar. */
.cph-billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  /* Padding, not margin, on both sides — margin sits OUTSIDE this element's
     own painted background, so while stuck it would leave a gap that reveals
     whatever feature row has scrolled to that band underneath (the same bug
     on both the nav-side and table-side of this box). Equal 14px top/bottom
     once stuck (see .is-stuck below) so the nav<->switcher gap matches the
     switcher<->table-header gap, same as before — that stuck-state look was
     fine as-is. Sticky top is flush with the nav's own bottom edge (74px
     content + 1px border) so there's no gap at all between .nav's background
     and this one. */
  padding-top: 14px;
  padding-bottom: 28px;
  position: sticky;
  top: 75px; /* nav__inner's 74px + its 1px border-bottom — flush, no reveal */
  z-index: 20;
  background: #f7f7f9; /* matches .cph-plans so scrolled-past rows don't show through while stuck */
}
/* Only the pre-stick (normal document-flow) switcher<->table gap needed
   widening — the already-stuck gap was fine and had to stay exactly as it
   was. Padding can't differ between those two states on its own (it's part
   of the box regardless of scroll position), so js/main.js watches the
   sentinel just above this element with an IntersectionObserver and adds
   .is-stuck the instant this toggle actually locks into its sticky spot,
   which is exactly when this override should kick in. */
.cph-billing-toggle.is-stuck { padding-bottom: 14px; }
.cph-billing-toggle__label {
  font-family: "Montserrat", var(--font-heading);
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  color: rgba(40, 39, 39, .55);
  transition: color .15s;
}
.cph-billing-toggle__label.is-active { color: #1b1b1f; }
.cph-billing-toggle__badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(245, 126, 32, .12);
  color: var(--brand-orange);
  font-size: 11px;
  font-weight: 700;
}
.cph-billing-toggle__switch {
  position: relative;
  width: 46px;
  height: 26px;
  border-radius: 999px;
  border: none;
  background: #d9d9de;
  cursor: pointer;
  transition: background .18s;
  flex-shrink: 0;
}
.cph-billing-toggle__switch[aria-checked="true"] { background: var(--brand-orange); }
.cph-billing-toggle__knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
  transition: transform .18s;
}
.cph-billing-toggle__switch[aria-checked="true"] .cph-billing-toggle__knob {
  transform: translateX(20px);
}

.cph-table__pkg-billed {
  margin: 6px 0 0; /* was the parent's 16px gap + this element's own -10px —
                       kept net-tight so price + billed-as-line still read as
                       one paired unit, not two separately-spaced lines */
  min-height: 16px; /* reserves space so toggling Monthly/Annually doesn't
                        reflow the row (the CTA button lives in its own row at
                        the bottom of the table now, not directly below this —
                        but this still keeps the price block's own height
                        steady between toggle states). */
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #fff;
}
/* "(switch to Annual to save)" / "(16% Discount)" suffix — forced onto its own
   second line (set by renderPrices() in js/main.js). */
.cph-table__pkg-billed-note {
  display: block;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  /* colour left to inherit from .cph-table__pkg-billed (#fff) — per owner */
}
/* The Monthly-state note is a real <button> that flips billing to Annual —
   strip the UA button chrome, keep it reading as an inline text link. */
.cph-table__pkg-billed-switch {
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
.cph-table__pkg-billed-switch:hover { opacity: .8; }
.cph-table__pkg-billed-switch:focus-visible {
  outline: 2px solid var(--brand-orange);
  outline-offset: 2px;
}

/* Now lives under the Order button in the CTA row (moved off the black
   package header, see .cph-table__btn-cell) — colour changed from white to a
   muted dark tone to read as fine print on that row's white background. */
.cph-table__pkg-guarantee {
  margin: 8px 0 0;
  font-family: "Manrope", var(--font-body);
  font-size: 11px;
  font-weight: 400;
  line-height: 13px;
  text-align: center;
  color: rgb(127, 133, 136);
}

/* overflow-x only applies below the width the 680px-min-width table actually
   needs it (~728px of usable space) — kept out of the unconditional rule
   because ANY non-"visible" overflow on an ancestor (even just one axis; the
   other axis auto-computes to "auto" too) becomes the nearest scroll container
   for position:sticky descendants, breaking the sticky package-header row's
   stick-to-the-real-page-scroll behaviour. Above that width the table already
   fits, so no horizontal scroll is needed and sticky works normally. */
.cph-table-wrap { margin-top: 0; }
@media (max-width: 860px) {
  .cph-table-wrap { overflow-x: auto; }
}

/* Direct grid children in row-major order (label, val, val, val, repeat…) — CSS
   Grid auto-placement wraps them into rows on its own, so no wrapping "row" divs
   are needed. A shared-across-plans row (Support, Money-Back) just supplies one
   spanning value cell (`--span3`) instead of 3, and auto-placement still lands the
   next row's label in column 1 correctly.

   No overflow:hidden here (same reason as .cph-table-wrap above — it would
   block the sticky header row) — the rounded corners are instead carved
   directly into the 4 corner cells (.cph-table__intro, .cph-table__pkg--last,
   .cph-table__label--last, .cph-table__btn-cell--last) below. */
.cph-table {
  display: grid;
  grid-template-columns: minmax(160px, 1.2fr) repeat(3, minmax(150px, 1fr));
  min-width: 680px;
  background: #fff;
  border: 1px solid #e3e3e8;
  border-radius: 14px;
}
/* The CTA row lives in its own grid, seamlessly stacked right under the main
   one (see the HTML comment above .cph-table--cta for why: it's what makes
   the sticky header release exactly when the CTA row arrives instead of
   after it). Split the outer frame's border/radius between them so together
   they still read as one continuous rounded box — border-bottom (main) /
   border-top (cta) are dropped so no line shows at that seam, same as the
   (now border-free) boundary between every other row inside the table. */
.cph-table--main {
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.cph-table--cta {
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.cph-table__label {
  display: flex;
  align-items: center;
  /* Vertical padding tightened from 13px — with the row-separator lines gone
     (see .cph-table__val's comment), that much padding read as too loose a
     gap between rows. */
  padding: 8px 20px;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: rgb(23, 25, 26);
  background: #fafafb;
  border-right: 1px solid #ececf0;
}
/* Last row's empty leading cell (under the intro column) — bottom-left corner,
   same reasoning as .cph-table__pkg--last above. */
.cph-table__label--last { border-bottom-left-radius: 14px; }
/* The otherwise-empty top-left spacer cell carries an intro line instead of
   sitting blank next to the black package headers. Pinned (with .cph-table__pkg
   below) right under .cph-billing-toggle while scrolling the feature rows,
   releasing exactly when .cph-table--main's own bottom edge (now right before
   the CTA row — see .cph-table--cta) reaches this offset. Per owner: this
   whole header row should shrink further once it's scrolled into its sticky
   spot — see .cph-table__intro.is-condensed / .cph-table__pkg.is-condensed
   below, toggled by js/main.js.

   That toggle fires once, right as it locks into place (an
   IntersectionObserver watching a sentinel, same technique as the billing
   toggle's own is-stuck detector above), and the shrink itself is a plain
   CSS transition — NOT continuously scrubbed off live scroll position via a
   scroll-event handler. An earlier version did that (recomputing padding/
   margin/max-height on every scroll frame): forcing a full layout reflow on
   every single scroll pixel is a textbook jank source, and it showed —
   stuttery, dropped frames, unreadable mid-scroll. A one-time CSS transition
   triggered by a single class flip costs one short, browser-optimized
   transition instead of dozens of forced reflows per scroll gesture. */
.cph-table__intro {
  flex-direction: column;
  align-items: center;
  justify-content: center; /* centre the flag + heading block in the tall cell */
  /* No `gap` here (moved to .cph-table__intro-flag's own margin-bottom) — a
     flex `gap` can't be transitioned away when the flag collapses on
     .is-condensed below, since it isn't owned by either child. */
  font-family: "Cairo", var(--font-heading);
  font-size: 24px;
  line-height: 24px;
  font-weight: 500;
  color: rgb(40, 39, 39);
  text-align: center;
  position: sticky;
  top: 129px; /* 75px toggle offset + its stuck-state 14px+26px+14px padding-top/content/padding-bottom (.is-stuck — see that class's comment), all inside its own painted box so nothing shows through */
  z-index: 15;
  background: none; /* the white fill now comes from ::before below, not this box's own background */
}
/* The white background + rounded top-left corner live on a ::before instead
   of directly on this box: some browsers don't reliably keep clipping a
   position:sticky element's OWN border-radius once it's actually in its
   "stuck"/offset state (confirmed — overflow:hidden on the element itself
   wasn't enough), but a plain absolutely-positioned pseudo-element with its
   own border-radius has no such issue since it isn't itself the thing being
   stuck. z-index:-1 keeps it behind the real content (flag + text). */
.cph-table__intro::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: #fff;
  border-top-left-radius: 14px;
}
.cph-table__intro-flag {
  width: 34px;
  height: auto;
  margin-bottom: 14px;
  opacity: 1;
  transition: opacity .2s ease, margin-bottom .2s ease;
}
/* Fades away once it locks into its sticky spot — see .cph-table__intro's
   comment above and js/main.js. No max-height/overflow:hidden collapse on
   the flag itself (tried first, reverted): animating a raster image's
   height that way clips it frame-by-frame instead of scaling it, which
   read as a glitchy little sliver mid-shrink. Its own un-collapsed height
   barely matters anyway, since the row's total height is set by the taller
   .cph-table__pkg cells regardless. */
.cph-table__intro.is-condensed .cph-table__intro-flag {
  opacity: 0;
  margin-bottom: 0;
}

.cph-table__val {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Vertical padding tightened from 13px to 8px, matching .cph-table__label —
     the border-top row separators used to mark each row's edge, so once
     those were removed this much padding left the rows looking too loosely
     spaced. */
  padding: 8px 14px;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  color: rgb(23, 25, 26);
}
.cph-table__cross { color: #d3382e; }

/* Data Center row: flag has white in it, which would vanish against the table's
   white cells without a border to define its edge. */
.cph-table__flag {
  display: block;
  border-radius: 2px;
  box-shadow: 0 0 0 1px #e3e3e8;
}

/* "Unlimited"/"Unmetered" replaced with ∞ — the visible glyph is aria-hidden and
   paired with a .sr-only span carrying the real word, so screen readers still
   announce "Unlimited"/"Unmetered" rather than a bare, ambiguous symbol. */
.cph-table__val--infinity [aria-hidden] {
  font-size: 19px;
  font-weight: 700;
  color: var(--brand-orange);
}

.cph-table__pkg {
  /* sticky (not just relative) so this cell pins alongside .cph-table__intro
     and releases the same way (see .cph-table__intro's comment above). */
  position: sticky;
  top: 129px; /* matches .cph-table__intro's offset, so the row pins as one */
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  /* Inter-child spacing lives on each child's own margin-top now, not a flex
     `gap` — a `gap` can't be transitioned away when the tagline collapses on
     .is-condensed below, since it isn't owned by either neighbouring child.
     Values match the old 16px gap (see each child's own margin comment). */
  padding: 26px 18px;
  background: var(--bg-topbar);
  transition: padding .2s ease;
}
/* Shrinks once it locks into its sticky spot — see .cph-table__intro's
   comment above and js/main.js. */
.cph-table__pkg.is-condensed { padding: 8px 18px; }
/* Last (Premium Salad) header cell only — carries the top-right corner that
   .cph-table's own border-radius used to get for free via overflow:hidden.
   Same ::before approach as .cph-table__intro (see its comment): a plain
   pseudo-element with its own border-radius, instead of border-radius
   directly on the sticky cell, since that wasn't reliably clipping once
   the cell was actually stuck. */
.cph-table__pkg--last { background: none; }
.cph-table__pkg--last::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--bg-topbar);
  border-top-right-radius: 14px;
}
.cph-table__pkg-name {
  font-family: "Cairo", var(--font-heading);
  font-size: 24px;
  line-height: 24px;
  font-weight: 500;
  color: #fff;
}
.cph-table__pkg-tagline {
  margin: 16px 0 0; /* was the parent's 16px gap, now owned here so it can
                        collapse away below */
  min-height: 34px;
  max-height: 60px;
  overflow: hidden;
  opacity: 1;
  transform: scaleY(1);
  transform-origin: top;
  transition: max-height .2s ease, opacity .15s ease, margin-top .2s ease, transform .2s ease;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  color: rgb(255, 255, 255);
}
/* Collapses away once it locks into its sticky spot, bringing the package
   name and price closer together — see .cph-table__intro's comment above
   and js/main.js. No min-height here: an earlier version kept the base
   min-height in this override and it silently won over max-height (min-
   height always wins when the two conflict), so the tagline's box stayed
   full-height, just invisible — that was the actual bug behind the
   name<->price gap not visibly shrinking that time. transform: scaleY(0)
   is paired with the max-height collapse for a separate reason: max-height
   alone clips this multi-line text at a flat horizontal line as it shrinks,
   which can slice straight through a line of text mid-transition, reading
   as garbled rather than a clean shrink — scaling the block down in sync
   keeps its visible content's own proportions matching the shrinking box
   instead, so it reads as one whole (if compressed) block, never a
   cut-off one. */
.cph-table__pkg.is-condensed .cph-table__pkg-tagline {
  margin-top: 0;
  min-height: 0;
  max-height: 0;
  opacity: 0;
  transform: scaleY(0);
}
/* Condensing still happens (js/main.js still toggles the class), just as an
   instant cut instead of an animated shrink. */
@media (prefers-reduced-motion: reduce) {
  .cph-table__intro-flag,
  .cph-table__pkg-tagline,
  .cph-table__pkg-price,
  .cph-table__pkg { transition: none; }
}
.cph-table__pkg-price {
  /* price + "/mo" share one baseline-aligned row instead of stacking */
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
  margin: 20px 0 0; /* was the parent's 16px gap + this element's own 4px */
  color: rgba(255, 255, 255, .6);
  transition: margin-top .2s ease;
}
/* Pulls closer to the name once the tagline above it is gone — see
   .cph-table__intro's comment and js/main.js. */
.cph-table__pkg.is-condensed .cph-table__pkg-price { margin-top: 2px; }
.cph-table__pkg-price strong {
  font-family: "Manrope", var(--font-body);
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  color: var(--brand-orange);
}
.cph-table__pkg-price span {
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
}

/* Per owner: the first two feature rows (Websites, Storage) should ALSO stay
   pinned once the header above locks into its sticky spot, not just the
   toggle + header themselves. Same `position: sticky` mechanism as
   .cph-table__intro/.cph-table__pkg above — each row's 4 cells (label + 3
   vals) share one `top` offset so the whole row pins as one, stacked
   directly under the header.

   The header's own rendered height isn't fixed — it changes the moment it
   condenses (see .is-condensed above) and again whenever the Monthly/
   Annually toggle changes the "billed as..." line's content — so a
   hardcoded pixel offset here would leave a gap, or an overlap, the moment
   the header's height changes. js/main.js measures the header's actual
   height with a ResizeObserver and writes it into --cph-pkg-header-h; a
   ResizeObserver only fires when that box's size genuinely changes, never
   on scroll itself, so this doesn't reintroduce the layout-thrashing
   anti-pattern already reverted once for the header's own condense
   animation (see the comment above .cph-table__intro). Storage then stacks
   on top of that plus one row's own fixed height (36px = 8px+8px vertical
   padding + 20px line-height, shared by .cph-table__label/.cph-table__val —
   both rows are single-line, plain-text content, so this doesn't need the
   same live-measurement treatment as the header). */
.cph-table__row--pin-1,
.cph-table__row--pin-2 {
  position: sticky;
  z-index: 14; /* above ordinary rows scrolling past underneath, below the header's 15 */
}
.cph-table__row--pin-1 { top: calc(129px + var(--cph-pkg-header-h, 160px)); }
.cph-table__row--pin-2 { top: calc(129px + var(--cph-pkg-header-h, 160px) + 36px); }
/* .cph-table__label already carries its own #fafafb background; .cph-table__val
   doesn't (it relies on .cph-table's white background showing through), which
   is fine while scrolling normally but would let rows scrolled past show
   through once this cell is actually pinned — give it an explicit opaque
   background only while pinned. */
.cph-table__val.cph-table__row--pin-1,
.cph-table__val.cph-table__row--pin-2 {
  background: #fff;
}
/* CTA row lives at the bottom of the table now (moved per owner — used to sit
   directly under each price in the header row). Each cell matches the padding/
   border rhythm of an ordinary .cph-table__val row so it reads as one more row,
   not a bolted-on footer. */
.cph-table__btn-cell {
  display: flex;
  flex-direction: column; /* stacks the Order button + .cph-table__pkg-guarantee under it */
  align-items: center;
  justify-content: center;
  padding: 18px 16px;
}
/* Last (Premium Salad) button cell — bottom-right corner, same reasoning as
   .cph-table__pkg--last above. */
.cph-table__btn-cell--last { border-bottom-right-radius: 14px; }
.cph-table__pkg-btn {
  width: 100%;
  background: transparent;
  border: 1.5px solid var(--brand-orange);
  border-radius: 8px; /* squared with a small corner — same as .plan-card .btn--outline / .review-btn (overrides the base .btn pill) */
  color: var(--brand-orange);
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 400;
  line-height: 15px;
  padding: 10px 14px;
}
.cph-table__pkg-btn:hover { background: var(--brand-orange); color: #fff; }

/* "Exclusive Benefits:" group heading — a full-width row inside the grid,
   bold + underlined like the source template. */
.cph-table__group {
  grid-column: 1 / -1;
  padding: 20px 20px 12px;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: rgb(23, 25, 26);
  text-decoration: underline;
  text-underline-offset: 3px;
  background: #fafafb;
}
/* "Yes" value cells under Exclusive Benefits — check glyph + label. */
.cph-table__val--yes { color: rgb(23, 25, 26); }
.cph-table__check { color: var(--brand-orange); flex-shrink: 0; }

@media (max-width: 560px) {
  .cph-plans { padding: 64px 0; }
}

/* ===== cPanel Hosting page: feature grid ===== */
.cph-features {
  position: relative;
  overflow: hidden;
  color: var(--text);
  /* Dark section so the page keeps alternating: dark hero -> light plans table ->
     dark features. Same --brand-dark-family gradient + soft orange glow as the
     homepage Migration section, for a consistent "dark content band" look. */
  background:
    radial-gradient(circle at 15% 12%, rgba(245, 126, 32, .12) 0, transparent 45%),
    radial-gradient(circle at 85% 90%, rgba(245, 126, 32, .08) 0, transparent 45%),
    linear-gradient(135deg, #1b2427 0%, #2b383c 52%, #141b1d 100%);
}

.cph-features__inner { padding: 88px 0; }

/* Header block sizing matches the source template: large light-weight title, a
   short thin rule set well below the subtitle, then a wide gap before the grid. */
.cph-features__head { text-align: center; margin-bottom: 64px; }

.cph-features__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  line-height: 40px;
  letter-spacing: .2px;
}

.cph-features__subtitle {
  margin: 14px auto 0;
  max-width: 560px;
  font-family: "Manrope", var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(245, 245, 247, .72);
}

.cph-features__underline {
  width: 64px;
  height: 2px;
  margin: 36px auto 0;
  border-radius: 2px;
  /* Brand orange + the site's red accent (same red used in the hero title /
     Web Hosting mega-menu gradient), not the previous light-orange tint. */
  background: linear-gradient(90deg, var(--accent), var(--brand-orange));
}

.cph-features__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 28px; /* row / column — template's horizontal gutter is a touch wider */
}

/* icon (col 1, row 1) | title (col 2, row 1) ; description spans both cols on row 2
   so its left edge lines up under the icon — matches the reference layout. */
.cph-feature {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 18px;
  row-gap: 14px;
  padding: 30px 28px;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 10px;
  background: rgba(255, 255, 255, .04);
  transition: border-color .18s, background .18s, transform .18s;
}
.cph-feature:hover {
  border-color: rgba(245, 126, 32, .5);
  background: rgba(255, 255, 255, .07);
  transform: translateY(-3px);
}

/* Icons are external single-colour SVGs in assets/img/features/ (each card sets
   its own file via the --feature-icon custom property). Painted with the brand
   orange via `mask`, so the colour stays defined once here rather than baked
   into 12 files — same idea as the partner-logo `filter` recolour. */
.cph-feature__icon {
  display: block;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background-color: var(--brand-orange);
  -webkit-mask: var(--feature-icon) center / contain no-repeat;
  mask: var(--feature-icon) center / contain no-repeat;
}

.cph-feature__title {
  align-self: center;
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 25px;
  font-weight: 600;
  line-height: 25px;
  color: #fff;
}

.cph-feature__desc {
  grid-column: 1 / -1;
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgba(245, 245, 247, .72);
}

@media (max-width: 900px) {
  .cph-features__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .cph-features__inner { padding: 64px 0; }
  .cph-features__grid { grid-template-columns: 1fr; }
  .cph-feature__title { font-size: 19px; }
  .cph-feature__icon { width: 30px; height: 30px; }
}

/* ===== cPanel Hosting page: why / infrastructure ===== */
.cph-why {
  /* Light section — keeps the page alternating: dark features -> light "why". */
  background: linear-gradient(160deg, #ffffff 0%, #f4f7fb 58%, #eef1f7 100%);
}

.cph-why__inner { padding: 88px 0; }

.cph-why__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
  align-items: center;
  gap: 48px;
  margin-bottom: 56px;
}

.cph-why__eyebrow {
  display: block;
  margin-bottom: 18px;
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--brand-orange);
}

/* Type scale + colour match the source template's font-inspector spec (Cairo
   600, 40px/46px) exactly, including its single-colour treatment — no
   gradient/accent split on this heading. */
.cph-why__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 40px;
  line-height: 46px;
  font-weight: 600;
  color: #1b1b1f;
}

.cph-why__underline {
  width: 72px;
  height: 3px;
  margin: 18px 0 20px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.cph-why__desc {
  margin: 0;
  max-width: 560px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 25px;
  color: #55555c;
}

.cph-why__map {
  border: 1px solid #e6e6ec;
  border-radius: 14px;
  background: #fff;
  padding: 18px;
  box-shadow: 0 12px 32px rgba(50, 61, 65, .07);
  overflow: hidden; /* clips the zoomed map on hover to the card's rounded edge */
}
/* transform-origin matches .cph-why__pin's left/top below, so hovering zooms
   the whole map (image + pin, scaled together as one unit) in on London
   specifically rather than on the card's center. */
.cph-why__map-inner {
  position: relative;
  transform-origin: 46.5% 37%;
  transition: transform .5s ease;
}
.cph-why__map:hover .cph-why__map-inner { transform: scale(2.6); }
.cph-why__map-img { display: block; width: 100%; height: auto; }

/* Single marker over London — same map image and same coordinates as the
   homepage Locations pin, so the two stay consistent (London is the one data
   centre stated site-wide; see the homepage Locations section). */
.cph-why__pin {
  position: absolute;
  left: 46.5%;
  top: 37%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
}
.cph-why__pin-dot {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--brand-orange);
  box-shadow: 0 0 0 4px rgba(245, 126, 32, .18);
  transition: opacity .3s ease;
}
/* Same UK circle flag as the homepage Locations card (assets/img/flags/uk-flag-circle.png).
   Sits over the dot, hidden until the map is hovered/zoomed, then crossfades in. */
.cph-why__pin-flag {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  opacity: 0;
  transition: opacity .3s ease;
}
.cph-why__map:hover .cph-why__pin-dot { opacity: 0; }
.cph-why__map:hover .cph-why__pin-flag { opacity: 1; }
.cph-why__pin-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: var(--brand-dark);
}

@media (prefers-reduced-motion: reduce) {
  .cph-why__map-inner { transition: none; }
  .cph-why__map:hover .cph-why__map-inner { transform: none; }
  .cph-why__pin-dot,
  .cph-why__pin-flag { transition: none; }
}

.cph-why__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch; /* equal-height cards regardless of description length */
  gap: 20px;
}

/* icon (col 1, row 1) | title (col 2, row 1) ; description spans row 2 under both */
.cph-why-card {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 14px;
  row-gap: 14px;
  padding: 22px;
  background: #fff;
  border: 1px solid #e6e6ec;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .04);
  transition: border-color .18s, box-shadow .18s, transform .18s;
}
.cph-why-card:hover {
  border-color: var(--brand-orange);
  box-shadow: 0 16px 34px rgba(50, 61, 65, .1);
  transform: translateY(-3px);
}

/* Brand-orange glyph (masked external SVG in assets/img/why-cpanel/, set per card via
   --why-icon) inside a soft orange-tinted tile. */
.cph-why-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(245, 126, 32, .1);
}
.cph-why-card__icon::before {
  content: "";
  width: 20px;
  height: 20px;
  background-color: var(--brand-orange);
  -webkit-mask: var(--why-icon) center / contain no-repeat;
  mask: var(--why-icon) center / contain no-repeat;
}

.cph-why-card__title {
  align-self: center;
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 17px;
  font-weight: 600;
  line-height: 21px;
  color: #1b1b1f;
}
.cph-why-card__desc {
  grid-column: 1 / -1;
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 20px;
  color: #6a6a72;
}

@media (max-width: 980px) {
  .cph-why__top { grid-template-columns: 1fr; gap: 36px; }
  .cph-why__map { width: 100%; max-width: 460px; margin: 0 auto; }
}

@media (max-width: 900px) {
  .cph-why__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .cph-why__inner { padding: 64px 0; }
  .cph-why__grid { grid-template-columns: 1fr; }
}

/* ===== cPanel Hosting page: business email ===== */
.cph-email {
  position: relative;
  overflow: hidden;
  color: var(--text);
  /* Dark section — keeps the page alternating: light "why" -> dark email. Same
     dark-band treatment as the Features section. */
  background:
    radial-gradient(circle at 15% 12%, rgba(245, 126, 32, .12) 0, transparent 45%),
    radial-gradient(circle at 85% 90%, rgba(245, 126, 32, .08) 0, transparent 45%),
    linear-gradient(135deg, #1b2427 0%, #2b383c 52%, #141b1d 100%);
}

.cph-email__inner { padding: 88px 0; }

.cph-email__top {
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  align-items: center;
  gap: 72px;
  margin-bottom: 72px;
}

.cph-email__visual { display: flex; justify-content: center; }
.cph-email__art { width: 100%; max-width: 340px; height: auto; }

/* Static envelope outline — no reveal/fade cycle. Motion lives entirely in
   the send/incoming mail glyphs (.cph-email__art-mail-out/-in) further down. */
.cph-email__art-env {
  fill: rgba(255, 255, 255, .04);
  stroke: rgba(255, 255, 255, .32);
  stroke-width: 2;
}
.cph-email__art-line {
  fill: none;
  stroke: rgba(255, 255, 255, .26);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cph-email__art-badge { fill: rgba(245, 126, 32, .14); stroke: var(--brand-orange); stroke-width: 2; }
.cph-email__art-at { fill: var(--brand-orange); font-family: var(--font-heading); font-size: 30px; font-weight: 700; }
.cph-email__art-ping { fill: none; stroke: var(--brand-orange); stroke-width: 1.6; }
/* Brief brightness flash overlaid on the badge, timed to the outgoing mail's
   departure and the incoming mail's landing (see the HTML comment above
   .cph-email__art-badge-flash) — a separate element from
   .cph-email__art-badge itself so it can be hidden outright under
   prefers-reduced-motion without touching the badge's own static styling. */
.cph-email__art-badge-flash { stroke: var(--brand-orange); }

/* Small mail glyph shared by the outgoing and incoming groups — a rounded
   rect body plus a simple V flap, both centred on the group's own local
   origin so each glyph's animateMotion path doubles as its on-canvas
   position directly. */
.cph-email__art-mail rect { fill: rgba(245, 126, 32, .85); stroke: var(--brand-orange); stroke-width: 1.4; }
.cph-email__art-mail-flap { fill: none; stroke: #fff; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
.cph-email__art-mail { pointer-events: none; }

/* SMIL animations can't be halted by CSS `animation: none`, so the flying
   mail glyphs and the badge's flash overlay are hidden outright — same
   approach as the Migration packet. */
@media (prefers-reduced-motion: reduce) {
  .cph-email__art-mail-out,
  .cph-email__art-mail-in,
  .cph-email__art-badge-flash,
  .cph-email__art-ping { display: none; }
}

/* ===== cPanel Hosting page: backups ===== */
.cph-backups {
  /* Light section — keeps the page alternating: dark email -> light backups. */
  background: linear-gradient(160deg, #ffffff 0%, #f4f7fb 58%, #eef1f7 100%);
}

.cph-backups__inner { padding: 88px 0; }

.cph-backups__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
  align-items: center;
  gap: 48px;
  margin-bottom: 56px;
}

/* Type scale matches the source template. */
.cph-backups__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  line-height: 46px;
  color: rgb(32, 29, 44);
}

.cph-backups__underline {
  width: 72px;
  height: 3px;
  margin: 18px 0 20px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.cph-backups__desc {
  margin: 0;
  max-width: 540px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 25px;
  color: rgba(32, 29, 44, .82);
}

/* Light "device" frame around the JetBackup dashboard screenshot, like the
   source template. */
.cph-backups__visual { display: flex; justify-content: center; }
.cph-backups__frame {
  width: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #e6e6ec;
  border-radius: 14px;
  box-shadow: 0 18px 44px rgba(50, 61, 65, .12);
  transition: box-shadow .4s ease;
}
/* Shadow deepens along with the flip below, so the card reads as lifting up
   and turning over rather than just rotating in place. */
.cph-backups__frame:hover {
  box-shadow: 0 28px 64px rgba(50, 61, 65, .2);
}
/* Stage holds the screenshot on top of the real JetBackup logo — overflow
   hidden + the shared border-radius live here so the cross-dissolve below
   stays clipped to a clean rounded rect. aspect-ratio matches the
   screenshot's own intrinsic 1195x614 so the box holds its shape now that
   both images are positioned absolutely rather than sizing the box via a
   normal in-flow <img>. */
.cph-backups__stage {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  aspect-ratio: 1195 / 614;
}
/* On hover, the screenshot zooms out slightly and blurs away while the logo
   underneath zooms in from a touch smaller and sharpens into focus — a soft
   cross-dissolve (opacity + scale + blur together), no hard wipe edge or
   flip, both layers transitioning at once. */
.cph-backups__shot,
.cph-backups__logo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: opacity .9s ease, transform .9s ease, filter .9s ease;
}
.cph-backups__shot {
  z-index: 2;
  object-fit: cover;
  transform: scale(1);
  filter: blur(0);
}
.cph-backups__logo {
  z-index: 1;
  box-sizing: border-box;
  padding: 15% 16%;
  object-fit: contain;
  background: #fff;
  opacity: 0;
  transform: scale(.85);
  filter: blur(6px);
}
.cph-backups__frame:hover .cph-backups__shot {
  opacity: 0;
  transform: scale(1.06);
  filter: blur(10px);
}
.cph-backups__frame:hover .cph-backups__logo {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}
@media (prefers-reduced-motion: reduce) {
  .cph-backups__shot,
  .cph-backups__logo { transition: none; }
}

.cph-backups__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 20px;
}

/* icon (col 1, row 1) | title (col 2, row 1) ; description spans row 2 under both */
.cph-backups-card {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 14px;
  row-gap: 14px;
  padding: 22px;
  background: #fff;
  border: 1px solid #e6e6ec;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .04);
  transition: border-color .18s, box-shadow .18s, transform .18s;
}
.cph-backups-card:hover {
  border-color: var(--brand-orange);
  box-shadow: 0 16px 34px rgba(50, 61, 65, .1);
  transform: translateY(-3px);
}

/* Brand-orange glyph (masked external SVG in assets/img/backups/, set per card
   via --backup-icon) inside a soft orange-tinted tile. */
.cph-backups-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(245, 126, 32, .1);
}
.cph-backups-card__icon::before {
  content: "";
  width: 20px;
  height: 20px;
  background-color: var(--brand-orange);
  -webkit-mask: var(--backup-icon) center / contain no-repeat;
  mask: var(--backup-icon) center / contain no-repeat;
}

.cph-backups-card__title {
  align-self: center;
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 17px;
  font-weight: 600;
  line-height: 21px;
  color: rgb(32, 29, 44);
}
.cph-backups-card__desc {
  grid-column: 1 / -1;
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 20px;
  color: rgba(32, 29, 44, .74);
}

@media (max-width: 980px) {
  .cph-backups__top { grid-template-columns: 1fr; gap: 36px; }
  .cph-backups__frame { max-width: 520px; }
}

@media (max-width: 640px) {
  .cph-backups__title { font-size: 30px; line-height: 1.2; }
}

@media (max-width: 900px) {
  .cph-backups__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .cph-backups__inner { padding: 64px 0; }
  .cph-backups__grid { grid-template-columns: 1fr; }
}

/* Type scale matches the source template. */
.cph-email__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  line-height: 46px;
  color: rgb(255, 255, 255);
}

.cph-email__underline {
  width: 72px;
  height: 3px;
  margin: 16px 0 20px;
  border-radius: 2px;
  background: linear-gradient(90deg, #ffb27a, var(--brand-orange));
}

.cph-email__desc {
  margin: 0;
  max-width: 600px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 25px;
  color: rgba(255, 255, 255, .82);
}

.cph-email__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 20px;
}

/* icon (col 1, row 1) | title (col 2, row 1) ; description spans row 2 under both */
.cph-email-card {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 14px;
  row-gap: 14px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 12px;
  background: rgba(255, 255, 255, .04);
  transition: border-color .18s, background .18s, transform .18s;
}
.cph-email-card:hover {
  border-color: rgba(245, 126, 32, .5);
  background: rgba(255, 255, 255, .07);
  transform: translateY(-3px);
}

/* Brand-orange glyph (masked external SVG in assets/img/email/, set per card via
   --email-icon) inside a soft orange-tinted tile. */
.cph-email-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(245, 126, 32, .14);
}
.cph-email-card__icon::before {
  content: "";
  width: 20px;
  height: 20px;
  background-color: var(--brand-orange);
  -webkit-mask: var(--email-icon) center / contain no-repeat;
  mask: var(--email-icon) center / contain no-repeat;
}

.cph-email-card__title {
  align-self: center;
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 17px;
  font-weight: 600;
  line-height: 21px;
  color: rgb(255, 255, 255);
}
.cph-email-card__desc {
  grid-column: 1 / -1;
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 20px;
  color: rgba(255, 255, 255, .75);
}

@media (max-width: 980px) {
  .cph-email__top { grid-template-columns: 1fr; gap: 40px; }
  .cph-email__art { max-width: 300px; }
}

@media (max-width: 640px) {
  .cph-email__title { font-size: 30px; line-height: 1.2; }
}

@media (max-width: 900px) {
  .cph-email__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .cph-email__inner { padding: 64px 0; }
  .cph-email__grid { grid-template-columns: 1fr; }
}

/* ===== cPanel Hosting page: security ===== */
.cph-security {
  position: relative;
  overflow: hidden;
  color: var(--text);
  /* Dark section so the page keeps alternating: light backups -> dark
     security. Same brand-orange-tinted dark gradient as every other dark
     band on this page (.cph-features, .cph-email) — kept consistent with
     the rest of the cpanel-hosting page rather than a one-off accent. */
  background:
    radial-gradient(circle at 15% 12%, rgba(245, 126, 32, .12) 0, transparent 45%),
    radial-gradient(circle at 85% 90%, rgba(245, 126, 32, .08) 0, transparent 45%),
    linear-gradient(135deg, #1b2427 0%, #2b383c 52%, #141b1d 100%);
}

.cph-security__inner { padding: 88px 0; }

.cph-security__head { text-align: center; margin-bottom: 64px; }

.cph-security__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  line-height: 40px;
  letter-spacing: .2px;
}

.cph-security__subtitle {
  margin: 14px auto 0;
  max-width: 620px;
  font-family: "Manrope", var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(245, 245, 247, .72);
}

.cph-security__underline {
  width: 64px;
  height: 3px;
  margin: 36px auto 0;
  border-radius: 2px;
  /* Same red -> orange gradient as .cph-backups__underline (owner's "orange
     and red mixed gradient" colour code) — reads more clearly as a mix than
     the previous accent -> brand-orange pairing, which sat too close in hue
     to show at this bar's width. */
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.cph-security__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 28px;
}

/* Same icon (col 1, row 1) | title (col 2, row 1); description spans both
   cols on row 2 layout as .cph-feature/.cph-backups-card/.cph-email-card. */
.cph-security-card {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 18px;
  row-gap: 14px;
  padding: 30px 28px;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 10px;
  background: rgba(255, 255, 255, .04);
  transition: border-color .18s, background .18s, transform .18s;
}
.cph-security-card:hover {
  border-color: rgba(245, 126, 32, .5);
  background: rgba(255, 255, 255, .07);
  transform: translateY(-3px);
}

/* Icons are external single-colour SVGs in assets/img/security/ (each card
   sets its own file via the --security-icon custom property), masked with
   --brand-orange — same masked-icon technique used throughout the site. */
.cph-security-card__icon {
  display: block;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background-color: var(--brand-orange);
  -webkit-mask: var(--security-icon) center / contain no-repeat;
  mask: var(--security-icon) center / contain no-repeat;
}

.cph-security-card__title {
  align-self: center;
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 25px;
  font-weight: 600;
  line-height: 25px;
  color: #fff;
}

.cph-security-card__desc {
  grid-column: 1 / -1;
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgba(245, 245, 247, .72);
}

@media (max-width: 900px) {
  .cph-security__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .cph-security__inner { padding: 64px 0; }
  .cph-security__grid { grid-template-columns: 1fr; }
  .cph-security-card__title { font-size: 19px; }
  .cph-security-card__icon { width: 30px; height: 30px; }
}

/* ===== cPanel Hosting page: workflow ===== */
.cph-workflow {
  position: relative;
  /* Light section — keeps the page alternating: dark security -> light
     workflow. Same light gradient treatment as .cph-backups. */
  background: linear-gradient(160deg, #ffffff 0%, #f4f7fb 58%, #eef1f7 100%);
}

.cph-workflow__inner { padding: 88px 0; }

.cph-workflow__head { text-align: center; margin-bottom: 56px; }

/* Type scale matches the source template. */
.cph-workflow__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 32px;
  font-weight: 600;
  line-height: 32px;
  color: rgb(45, 42, 53);
}

.cph-workflow__subtitle {
  margin: 14px auto 0;
  max-width: 600px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 24px;
  color: rgb(92, 88, 104);
}

.cph-workflow__underline {
  width: 64px;
  height: 3px;
  margin: 20px auto 0;
  border-radius: 2px;
  /* Same red -> orange gradient as .cph-backups__underline /
     .cph-security__underline (owner's "orange and red mixed gradient"
     colour code) — brand-orange throughout this page, not the teal used in
     the supplied mockup (see .cph-workflow-card__icon below). */
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.cph-workflow__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 28px;
}

/* Centred icon-chip -> title -> description stack (unlike the paired
   icon+title row layout used elsewhere on this page — matches the source
   template's centred card treatment for this section specifically). */
.cph-workflow-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  padding: 40px 30px;
  background: #fff;
  border: 1px solid #e6e6ec;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .04);
  transition: border-color .18s, box-shadow .18s, transform .18s;
}
.cph-workflow-card:hover {
  border-color: var(--brand-orange);
  box-shadow: 0 16px 34px rgba(50, 61, 65, .1);
  transform: translateY(-3px);
}

/* Icon chip: a soft orange-tinted rounded square housing the masked icon —
   same recolour technique as every other section's icons (external
   single-colour SVG in assets/img/workflow/, set per card via
   --workflow-icon, painted with --brand-orange), just larger and centred to
   match this section's own card layout. */
.cph-workflow-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(245, 126, 32, .1);
}
.cph-workflow-card__icon::before {
  content: "";
  width: 30px;
  height: 30px;
  background-color: var(--brand-orange);
  -webkit-mask: var(--workflow-icon) center / contain no-repeat;
  mask: var(--workflow-icon) center / contain no-repeat;
}

.cph-workflow-card__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  color: rgb(45, 42, 53);
}

.cph-workflow-card__desc {
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 300;
  line-height: 22px;
  color: rgb(92, 88, 104);
}

@media (max-width: 900px) {
  .cph-workflow__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .cph-workflow__inner { padding: 64px 0; }
  .cph-workflow__grid { grid-template-columns: 1fr; }
}

/* ===== cPanel Hosting page: technical overview ===== */
.cph-overview {
  /* Light section — keeps the page alternating: dark migration -> light
     overview, right before the (black) footer. */
  background: #f7f7fb;
}

.cph-overview__inner { padding: 88px 0; }

.cph-overview__head { text-align: center; margin-bottom: 56px; }

/* Type scale matches the source template. */
.cph-overview__title {
  margin: 0;
  font-family: "Cairo", var(--font-heading);
  font-size: 32px;
  font-weight: 600;
  line-height: 32px;
  color: rgb(32, 29, 44);
}

.cph-overview__underline {
  width: 64px;
  height: 3px;
  margin: 20px auto 0;
  border-radius: 2px;
  /* Same red -> orange gradient used for every other underline on this page
     (owner's "orange and red mixed gradient" colour code) — brand-orange
     throughout, not the teal used in the supplied mockup. */
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.cph-overview__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 64px;
}

.cph-overview__col { display: flex; flex-direction: column; }

.cph-overview__group { margin-bottom: 36px; }
.cph-overview__group:last-child { margin-bottom: 0; }

.cph-overview__group-title {
  margin: 0 0 16px;
  font-family: "Cairo", var(--font-heading);
  font-size: 21px;
  font-weight: 600;
  line-height: 21px;
  color: rgb(32, 29, 44);
  text-align: center;
}

.cph-overview__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cph-overview__list li {
  font-family: "Manrope", var(--font-body);
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: rgb(32, 29, 44);
  text-align: center;
}

@media (max-width: 760px) {
  .cph-overview__columns { grid-template-columns: 1fr; gap: 0; }
  .cph-overview__col:first-child { margin-bottom: 36px; }
}

@media (max-width: 560px) {
  .cph-overview__inner { padding: 64px 0; }
}

/* ===== discount-programs/index.html: tab switcher =====
   3 numbered tabs (01/02/03), the active one filled solid orange; clicking
   swaps the panel below it — see the click handler in js/main.js. */
.discount-tabs {
  background: #fff;
  border-top: 2px solid #1b1b1f;
}
.discount-tabs__bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.discount-tabs__tab {
  position: relative; /* anchors .is-active's ::after underline bar below */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 32px;
  border: none;
  background: none;
  text-align: center;
  cursor: pointer;
  transition: background .18s ease;
}
.discount-tabs__tab:hover { background: #fafafb; }
/* Selected state used to fill the whole tab solid orange — per owner,
   that's now just a thin underline bar instead, same red -> orange
   gradient as .footer__underline/.cph-backups__underline (owner's "orange
   and red mixed" gradient). The ash-grey column/row borders this used to
   sit against were removed per owner request, so it now sits flush with
   the tab's own bottom edge instead of offsetting for that border. */
.discount-tabs__tab.is-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}
/* Typography matched to an owner-supplied font-inspector spec, colour
   included (same spec given earlier for the section this switcher
   replaced — see the reference-styling rule in README A.3: usually only
   typography/box dimensions are matched and colour is kept as the site's
   own, but this spec explicitly gives a colour too, so it's matched
   exactly). */
.discount-tabs__label {
  font-family: "Cairo", "Manrope", sans-serif;
  font-weight: 600;
  font-size: 40px;
  line-height: 46px;
  color: rgb(32, 29, 44);
  /* Faded by default so the selected tab visibly stands out; the active
     tab's own rule below brings it back to full opacity. */
  opacity: .4;
  transition: opacity .18s ease;
}
.discount-tabs__tab.is-active .discount-tabs__label { opacity: 1; }

.discount-tabs__panel {
  display: none;
  padding: 64px 0;
}
/* Used to be a 2-column grid (a big heading on the left, this body on the
   right) — the heading was removed per owner request, so the body just
   takes the row on its own now, capped to a readable width instead of
   stretching the full container. */
.discount-tabs__panel.is-active { display: block; }
.discount-tabs__panel-body { max-width: 640px; }
/* Per owner: each panel's content aligns differently — panel 1 (Student &
   Academic) left (the default, no override needed), panel 2 (Startup)
   centred, panel 3 (Agency & Freelancer) right. margin-left/right: auto
   moves the whole (max-width-capped) block within the container; text-align
   handles the text itself inside it. */
#discount-panel-2 .discount-tabs__panel-body {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
#discount-panel-3 .discount-tabs__panel-body {
  margin-left: auto;
  text-align: right;
}
/* Per owner: every panel's description column must line up with its own
   criteria grid below it (see .discount-tabs__criteria-grid further down)
   — 50% instead of the shared 640px cap, so the heading/description/
   caption never run past where that panel's boxes start/end. Panel 2's
   own margin-left/right: auto above already centres this 50%-wide block;
   panels 1/3 stay flush left/right via their own rules above. */
#discount-panel-1 .discount-tabs__panel-body,
#discount-panel-2 .discount-tabs__panel-body,
#discount-panel-3 .discount-tabs__panel-body {
  width: 50%;
  max-width: none;
}
/* Typography matched to an owner-supplied font-inspector spec (Cairo 600,
   25px/25px) — see the reference-styling rule in README A.3. That spec's
   colour was white, but this text sits on this section's white background,
   so it's kept at the site's own dark colour instead (white would be
   invisible here) — confirmed with the owner rather than assumed. */
.discount-tabs__panel-subtitle {
  margin: 0 0 16px;
  font-family: "Cairo", var(--font-heading);
  font-size: 25px;
  font-weight: 600;
  line-height: 25px;
  color: rgb(27, 27, 31);
}
/* Typography matched to an owner-supplied font-inspector spec (Manrope 300,
   15px/25px, colour rgba(32,29,44,.82)) — updated spec, colour included
   this time since it's a dark tone that's actually visible on this
   section's white background (unlike the earlier white/translucent-white
   specs given for this element and .discount-tabs__panel-subtitle). */
.discount-tabs__panel-desc {
  margin: 0 0 12px;
  font-family: "Manrope", var(--font-body);
  font-size: 15px;
  font-weight: 300;
  line-height: 25px;
  color: rgba(32, 29, 44, .82);
}
.discount-tabs__panel-desc:last-child { margin-bottom: 0; }

/* Small plain-text caption under each panel's description (not a link —
   was briefly an <a>, corrected to a <span> per owner) — was "Terms &
   Conditions", relabelled "Eligibility Criteria" per owner. Typography
   matched to an owner-supplied font-inspector spec (Manrope 600, 12px/18px)
   — colour deliberately kept as the site's own brand orange rather than
   the spec's green, per explicit owner instruction. */
.discount-tabs__panel-eligibility {
  display: inline-block;
  font-family: "Manrope", var(--font-body);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  /* Owner asked for the normal dark text colour already used elsewhere on
     this panel (subtitle/label), not brand orange or the font-inspector
     spec's green. */
  color: rgb(27, 27, 31);
}

/* Eligibility criteria cards under each panel — same light-card look as
   .cph-why-card (white fill, light border, soft shadow, lifts + orange
   border on hover) since this section sits on a white background, but
   simplified to description-only per owner: no icon, no per-card title.
   Sample placeholder text in the HTML; owner will replace with the real
   criteria. Independent of .discount-tabs__panel-body's own max-width/
   alignment above it — a card grid doesn't need that left/centre/right
   text alignment applied to it. */
.discount-tabs__criteria-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px 24px;
  margin-top: 32px;
}
/* Per owner: panel 1's (Student & Academic) grid starts flush left and
   ends at the horizontal midpoint of the Startup tab above it; panel 3's
   (Agency & Freelancer) grid is the mirror — starts at that same midpoint
   and ends flush right. Panel 2's (Startup) grid is the same 50% width,
   but centred instead of pinned to either edge. All three sit in the same
   .container as .discount-tabs__bar, so 50% width lines up exactly with
   the Startup tab's own centre either way. */
#discount-panel-1 .discount-tabs__criteria-grid {
  width: 50%;
  margin-right: auto;
}
#discount-panel-2 .discount-tabs__criteria-grid {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
#discount-panel-3 .discount-tabs__criteria-grid {
  width: 50%;
  margin-left: auto;
}
.discount-tabs__criteria-card {
  padding: 22px;
  background: #fff;
  border: 1px solid #e6e6ec;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .04);
  transition: border-color .18s, box-shadow .18s, transform .18s;
}
.discount-tabs__criteria-card:hover {
  border-color: var(--brand-orange);
  box-shadow: 0 16px 34px rgba(50, 61, 65, .1);
  transform: translateY(-3px);
}
/* Typography matched to an owner-supplied font-inspector spec (Manrope 400,
   14px/21px) — same recurring situation as the panel subtitle/description
   above: the spec's colour (rgba(255,255,255,.78)) is translucent white,
   which would be invisible on these cards' white background, so kept at
   the site's own dark colour instead. */
.discount-tabs__criteria-desc {
  margin: 0;
  font-family: "Manrope", var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgba(27, 27, 31, .75);
}

@media (max-width: 860px) {
  .discount-tabs__criteria-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  /* The half-width split only makes sense lined up against the
     desktop-width tab bar above — too cramped once the grid itself drops
     to 2 columns, so all three panels go back to full width here. */
  #discount-panel-1 .discount-tabs__criteria-grid,
  #discount-panel-2 .discount-tabs__criteria-grid,
  #discount-panel-3 .discount-tabs__criteria-grid {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
  /* Same reset for the matching description column above it (see
     .discount-tabs__panel-body's own comment). */
  #discount-panel-1 .discount-tabs__panel-body,
  #discount-panel-2 .discount-tabs__panel-body,
  #discount-panel-3 .discount-tabs__panel-body {
    width: auto;
    max-width: 640px;
  }
}

@media (max-width: 560px) {
  .discount-tabs__criteria-grid { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .discount-tabs__tab { padding: 20px 16px; }
  .discount-tabs__label { font-size: 22px; line-height: 26px; }
}
```

### B.2 `js/main.js`
```js
(function () {
  "use strict";

  /* ===== Nav dropdowns + mobile menu =====
     Pulled into a function because the nav markup itself may not exist yet at
     script-load time — it can arrive later via the shared-header fetch below.
     Called either immediately (nav already in the page) or after injection. */
  function initNav() {
    var dropdowns = document.querySelectorAll("[data-dropdown]");

    // Hover-to-open only for real mouse/trackpad input. Touchscreens report CSS
    // `:hover` unreliably (it can get "stuck" after a tap with no mouseleave to
    // clear it), so on touch devices this stays false and the click toggle below
    // is the only way in — exactly the pre-hover behaviour. Checked once at init;
    // that's fine here since a page doesn't switch primary pointer type mid-visit.
    var hoverCapable = window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var closeTimer = null;

    function closeAll(except) {
      dropdowns.forEach(function (d) {
        if (d !== except) d.classList.remove("is-open");
      });
    }

    dropdowns.forEach(function (d) {
      var toggle = d.querySelector(".nav__link");
      if (!toggle) return;

      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = d.classList.contains("is-open");
        closeAll(d);
        d.classList.toggle("is-open", !isOpen);
      });

      if (hoverCapable) {
        // mouseenter/mouseleave on the whole `.nav__item`, not just the link, so
        // moving the cursor down off the link into the open panel below it stays
        // inside the hover region instead of immediately triggering a leave.
        // A short close delay on leave covers the small gap between the link and
        // the panel edge (they're not perfectly flush) so crossing it doesn't
        // close the menu before the cursor reaches the panel.
        d.addEventListener("mouseenter", function () {
          clearTimeout(closeTimer);
          closeAll(d);
          d.classList.add("is-open");
        });
        d.addEventListener("mouseleave", function () {
          closeTimer = setTimeout(function () {
            d.classList.remove("is-open");
          }, 180);
        });
      }
    });

    document.addEventListener("click", function () { closeAll(null); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll(null);
    });

    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("navMenu");

    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        burger.classList.toggle("is-active", open);
        burger.setAttribute("aria-expanded", String(open));
      });
    }
  }

  /* ===== Shared header (topbar + nav) =====
     One copy of the markup lives in partials/header.html; every page that wants
     it just needs `<div id="site-header"></div>` right after <body>. Same
     root-relative-fetch pattern as the shared footer below — see its comment for
     why (works no matter how deep the including page lives). initNav() only runs
     once the real markup is in the DOM, since it queries for nav elements. */
  var headerMount = document.getElementById("site-header");
  if (headerMount) {
    fetch("/server-salad-cloud-services-web/partials/header.html", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("header fetch failed: " + res.status);
        return res.text();
      })
      .then(function (html) {
        headerMount.outerHTML = html;
        initNav();
      })
      .catch(function (err) { console.error("Could not load shared header:", err); });
  } else {
    initNav();
  }

  /* ===== Hero partner-logo carousel =====
     Shows a fixed number of logos at a time, and steps: slide one slot left, hold for
     a pause, slide one slot left, hold, etc. (not a continuous scroll). Loops
     seamlessly because the track's logo list is duplicated once in the HTML — after
     animating exactly one full "original set" width, position resets to 0 instantly
     (transitions off for that one frame) landing on visually identical content.
     Also supports drag/swipe (mouse + touch via Pointer Events); no arrow buttons. */
  var viewport = document.getElementById("logosViewport");
  var track = document.getElementById("heroLogos");

  if (viewport && track) {
    var STEP_MS = 600;    // slide transition duration
    var PAUSE_MS = 1000;  // hold time between slides
    var originalCount = track.children.length / 2; // 2nd half is the duplicate

    var slotWidth = 0;
    var stepIndex = 0;   // whole slots scrolled, wraps at originalCount
    var paused = false;
    var dragging = false;
    var dragStartX = 0;
    var dragBasePx = 0;

    function applyTransform(px, animate) {
      track.style.transition = animate ? ("transform " + STEP_MS + "ms ease") : "none";
      track.style.transform = "translateX(" + (-px) + "px)";
    }

    function measure() {
      var visible = window.innerWidth <= 480 ? 2 : window.innerWidth <= 760 ? 3 : 4;
      slotWidth = viewport.clientWidth / visible;
      track.style.setProperty("--logo-slot", slotWidth + "px");
      applyTransform(stepIndex * slotWidth, false);
    }

    // After sliding forward past the last real slot, snap instantly back to the start
    // (same visual position, thanks to the duplicated set) so the loop never runs out.
    track.addEventListener("transitionend", function () {
      if (stepIndex >= originalCount) {
        stepIndex -= originalCount;
        applyTransform(stepIndex * slotWidth, false);
        void track.offsetWidth; // force reflow so the next transition re-enables cleanly
      }
    });

    function autoStep() {
      if (paused || dragging) return;
      stepIndex += 1;
      applyTransform(stepIndex * slotWidth, true);
    }

    viewport.addEventListener("mouseenter", function () { paused = true; });
    viewport.addEventListener("mouseleave", function () { paused = false; });

    viewport.addEventListener("pointerdown", function (e) {
      dragging = true;
      dragStartX = e.clientX;
      dragBasePx = stepIndex * slotWidth;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(e.pointerId);
      applyTransform(dragBasePx, false);
    });
    viewport.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      applyTransform(dragBasePx - (e.clientX - dragStartX), false);
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove("is-dragging");
      var draggedPx = dragBasePx - (e.clientX - dragStartX);
      stepIndex = Math.round(draggedPx / slotWidth) % originalCount;
      if (stepIndex < 0) stepIndex += originalCount;
      applyTransform(stepIndex * slotWidth, true);
    }
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("dragstart", function (e) { e.preventDefault(); });

    window.addEventListener("resize", measure);

    measure();
    setInterval(autoStep, STEP_MS + PAUSE_MS);
  }

  /* ===== Shared footer =====
     One copy of the footer markup lives in partials/footer.html; every page that
     wants it just needs `<div id="site-footer"></div>` before the closing </body>
     script tag. Root-relative path (/server-salad-cloud-services-web/...) so this works no matter how
     deep the including page lives (e.g. /server-salad-cloud-services-web/pages/about.html). */
  var footerMount = document.getElementById("site-footer");
  if (footerMount) {
    fetch("/server-salad-cloud-services-web/partials/footer.html", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("footer fetch failed: " + res.status);
        return res.text();
      })
      .then(function (html) { footerMount.outerHTML = html; })
      .catch(function (err) { console.error("Could not load shared footer:", err); });
  }

  /* ===== Live pricing + Monthly/Annually toggle =====
     Fetches real MONTHLY prices from api/pricing.php (the one server-side piece
     in this project — see README "Pricing API"). Only touches elements that
     exist, so this is a no-op on pages without any [data-price] element.

     The database only stores a monthly price — there's no separate annual price
     to fetch. Per owner: both figures are CALCULATED here, not looked up:
       - Annually selected: year total = monthly × 10 (paying for 10 months
         covers all 12 — the "2 Months Free" the toggle advertises); /mo
         equivalent shown = (monthly × 10) ÷ 12. The small line under the price
         (.cph-table__pkg-billed / [data-billed]) reads "billed as LKR X/year".
       - Monthly selected: price shown is the real monthly rate as-is; that same
         small line instead reads "LKR X/year (switch to Annual to save)" where
         X = monthly × 12 (no discount) — so a visitor sees what staying on
         monthly costs over a year, with a direct nudge toward the discounted
         Annually option.
     Each [data-price] element keeps a `data-monthly` attribute holding whatever
     the current best-known monthly price is (starts as the HTML fallback value,
     overwritten with the real fetched value on success) — renderPrices() always
     reads from that attribute, so it works correctly whether or not the fetch
     has resolved yet, and whether Monthly or Annually is currently selected.

     Two per-element opt-in attributes let the same fetch+render logic serve
     both pages without a shared toggle:
       - `data-annual-always="true"` — always show the annual-equivalent /mo
         rate, ignoring the (page-local) toggle state entirely. Used by the
         homepage hero's "Order Fresh LKR ..." cPanel Hosting card, which has no
         toggle of its own but should still advertise the discounted rate.
       - `data-format="number"` — write just the bare number (e.g. "458"), not
         "LKR 458" — for elements where the surrounding text already supplies
         "LKR" / "/mo" wording (again, the hero card's span). Defaults to the
         full "LKR X" format used by the cpanel-hosting page's table cells. */
  var priceEls = document.querySelectorAll("[data-price]");
  if (priceEls.length) {
    var toggle = document.getElementById("billingToggle");
    // Annually is the default state on load (matches the HTML: toggle starts
    // aria-checked="true", the "Annually" label starts .is-active).
    var isAnnual = true;

    function renderPrices() {
      priceEls.forEach(function (el) {
        var key = el.getAttribute("data-price");
        var monthly = parseFloat(el.getAttribute("data-monthly"));
        if (isNaN(monthly)) return;

        var showAnnual = isAnnual || el.getAttribute("data-annual-always") === "true";
        var bareNumber = el.getAttribute("data-format") === "number";
        var billedEl = document.querySelector('[data-billed="' + key + '"]');

        if (showAnnual) {
          var yearTotal = monthly * 10;
          var equivMonthly = Math.round(yearTotal / 12);
          el.textContent = bareNumber ? String(equivMonthly) : "LKR " + equivMonthly.toLocaleString("en-US");
          // "(16% Discount)" on its own second line — but only on the
          // cph-hosting table, where the toggle actually exists. An
          // always-annual price (data-annual-always, e.g. the homepage plan
          // card) just gets the plain "billed as .../year" line. innerHTML is
          // safe — the only interpolated value is a formatted number.
          if (billedEl) {
            var discountNote = el.getAttribute("data-annual-always") === "true"
              ? ""
              : "<span class=\"cph-table__pkg-billed-note\">(16% Discount)</span>";
            billedEl.innerHTML = "billed as LKR " + yearTotal.toLocaleString("en-US") + "/year" + discountNote;
          }
        } else {
          el.textContent = bareNumber ? String(monthly) : "LKR " + monthly.toLocaleString("en-US");
          var yearIfMonthly = monthly * 12;
          // "(switch to Annual to save)" goes on its own second line — it's a real
          // <button> so clicking it flips the billing toggle to Annual (handled by
          // the delegated listener below, since this markup is rebuilt each render).
          // innerHTML is safe here: the only interpolated value is a formatted
          // number (digits + commas).
          if (billedEl) billedEl.innerHTML = "LKR " + yearIfMonthly.toLocaleString("en-US") + "/year<button type=\"button\" class=\"cph-table__pkg-billed-note cph-table__pkg-billed-switch\">(switch to Annual to save)</button>";
        }
      });
    }

    // Single source of truth for the Monthly/Annually state — used by the toggle
    // switch AND the "(switch to Annual to save)" links inside each price cell.
    function setAnnual(next) {
      if (next === isAnnual) return;
      isAnnual = next;
      if (toggle) toggle.setAttribute("aria-checked", String(isAnnual));
      document.querySelectorAll("[data-billing-label]").forEach(function (label) {
        var isThisOne = label.getAttribute("data-billing-label") === (isAnnual ? "annual" : "monthly");
        label.classList.toggle("is-active", isThisOne);
      });
      renderPrices();
    }

    if (toggle) {
      toggle.addEventListener("click", function () { setAnnual(!isAnnual); });
    }

    // Delegated: the "(switch to Annual to save)" button is re-created by
    // renderPrices() on every render, so listen on the document instead.
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest(".cph-table__pkg-billed-switch")) setAnnual(true);
    });

    fetch("/server-salad-cloud-services-web/api/pricing.php", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("pricing fetch failed: " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.ok || !data.prices) throw new Error("unexpected pricing response");
        priceEls.forEach(function (el) {
          var key = el.getAttribute("data-price");
          var price = data.prices[key];
          if (typeof price !== "number") return; // leave fallback data-monthly as-is
          el.setAttribute("data-monthly", String(price));
        });
        renderPrices(); // re-render with the real fetched monthly prices
      })
      .catch(function (err) {
        console.error("Could not load live pricing (showing fallback prices):", err);
      });

    renderPrices(); // initial paint from the HTML fallback data-monthly values
  }

  /* ===== Billing toggle: detect its own "stuck" sticky state =====
     .cph-billing-toggle (see css/styles.css) has a wider padding-bottom by
     default — the gap to the table below it looked cramped in normal
     document flow — but that same wider gap wasn't wanted once the toggle
     locks into its sticky spot under the nav (that stuck-state gap was
     already fine). CSS alone can't tell those two states apart (padding is
     part of the box regardless of scroll position), so: watch a 1px
     sentinel placed immediately above the toggle in the markup, and compare
     its own live viewport position against the toggle's sticky `top` (75px)
     on every observer callback. Below that line (sentinel not yet reached
     it, e.g. still off-screen further down the page on first load) -> not
     stuck yet. At or above it (scrolled past, whether entering from below or
     already passed) -> stuck. Using the position directly (not just
     `entry.isIntersecting`) is what makes this work correctly on load, when
     the sentinel starts out below the fold and so isn't "intersecting"
     either way — that alone can't tell the two not-stuck/stuck cases apart. */
  var billingSentinel = document.querySelector(".cph-billing-toggle__sentinel");
  var billingToggleEl = document.querySelector(".cph-billing-toggle");
  if (billingSentinel && billingToggleEl && "IntersectionObserver" in window) {
    var STICKY_TOP = 75; // matches .cph-billing-toggle's own sticky `top`
    var stickyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          billingToggleEl.classList.toggle("is-stuck", entry.boundingClientRect.top < STICKY_TOP);
        });
      },
      { rootMargin: "-" + STICKY_TOP + "px 0px 0px 0px", threshold: [0, 1] }
    );
    stickyObserver.observe(billingSentinel);
  }

  /* ===== Package header row: condense once it locks into its sticky spot =====
     .cph-table__intro / .cph-table__pkg (css/styles.css) pin under the
     billing toggle at top:129px while scrolling the feature rows. Per owner:
     it should shrink further right as that happens — the tagline fades out
     and the package name and price pull closer together — so it takes up
     less of the viewport while browsing the long feature list below.

     Same technique as the billing toggle's own is-stuck detector above: an
     IntersectionObserver watches a 1px sentinel placed immediately before
     this row in the markup and toggles .is-condensed the instant the row's
     own position crosses its 129px sticky offset — see that detector's
     comment for why boundingClientRect.top (not just entry.isIntersecting)
     is what makes this correct on load, when the row can start out below
     the fold.

     An EARLIER version tried to scrub this continuously off live scroll
     position instead (a scroll-event handler recomputing padding/margin/
     max-height every frame via a CSS custom property). That thrashed
     layout on every scroll pixel — a textbook jank source — and it showed:
     stuttery, dropped frames, unreadable mid-scroll. Firing an
     IntersectionObserver callback once and letting a plain CSS transition
     (see .is-condensed in css/styles.css) handle the shrink costs one
     short, browser-optimized transition instead of dozens of forced
     reflows per scroll gesture. */
  var pkgSentinel = document.querySelector(".cph-table__pkg-sentinel");
  var pkgHeaderEls = document.querySelectorAll(".cph-table__intro, .cph-table__pkg");
  if (pkgSentinel && pkgHeaderEls.length && "IntersectionObserver" in window) {
    var PKG_STICKY_TOP = 129; // matches .cph-table__intro / .cph-table__pkg's own sticky `top`
    var pkgStickyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var condensed = entry.boundingClientRect.top < PKG_STICKY_TOP;
          pkgHeaderEls.forEach(function (el) { el.classList.toggle("is-condensed", condensed); });
        });
      },
      { rootMargin: "-" + PKG_STICKY_TOP + "px 0px 0px 0px", threshold: [0, 1] }
    );
    pkgStickyObserver.observe(pkgSentinel);
  }

  /* ===== Pin the top two feature rows (Websites, Storage) under the header =====
     Per owner: once the package header above locks into its sticky spot,
     these two rows should lock in place right beneath it too, instead of
     scrolling away with the rest of the table — see .cph-table__row--pin-1/
     --pin-2 in css/styles.css.

     Those rows' sticky `top` has to sit right at the header's own bottom
     edge, but the header's rendered height isn't fixed — it changes the
     moment it condenses (see the block above) and again whenever the
     Monthly/Annually toggle changes the "billed as..." line's content. A
     ResizeObserver watching the header cell writes its live height into
     --cph-pkg-header-h once per actual size change; unlike a scroll
     handler, it never fires on scroll itself, so this doesn't reintroduce
     the layout-thrashing problem solved above — it only recomputes when the
     header's box genuinely resizes.

     Read the height via getBoundingClientRect() inside the callback rather
     than the ResizeObserverEntry's own contentRect — contentRect reports
     the CONTENT box only (excludes this cell's 26px/8px vertical padding),
     which undercounted the real on-screen row height by that padding and
     let the header visually overlap the top of the pinned Websites row
     below it. getBoundingClientRect() reports the full border-box height
     actually rendered, so it matches the sticky offset the pinned rows need. */
  var pkgHeaderMeasureEl = document.querySelector(".cph-table__pkg");
  var pkgStickyScopeEl = document.querySelector(".cph-plans__sticky-scope");
  if (pkgHeaderMeasureEl && pkgStickyScopeEl && "ResizeObserver" in window) {
    var pkgHeaderResizeObserver = new ResizeObserver(function () {
      var height = pkgHeaderMeasureEl.getBoundingClientRect().height;
      pkgStickyScopeEl.style.setProperty("--cph-pkg-header-h", height + "px");
    });
    pkgHeaderResizeObserver.observe(pkgHeaderMeasureEl);
  }

  /* ===== discount-programs/index.html: tab switcher =====
     3 tabs (.discount-tabs__tab) — clicking one shows its matching
     .discount-tabs__panel (same data-tab/data-panel value) and hides the
     others. Element-existence guard means this safely no-ops on every
     other page. */
  var discountTabs = document.querySelectorAll(".discount-tabs__tab");
  var discountPanels = document.querySelectorAll(".discount-tabs__panel");
  if (discountTabs.length && discountPanels.length) {
    var activateDiscountTab = function (tab) {
      var target = tab.getAttribute("data-tab");
      discountTabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
        t.tabIndex = active ? 0 : -1;
      });
      discountPanels.forEach(function (p) {
        var active = p.getAttribute("data-panel") === target;
        p.classList.toggle("is-active", active);
        p.hidden = !active;
      });
    };
    discountTabs.forEach(function (tab) {
      tab.addEventListener("click", function () { activateDiscountTab(tab); });
    });

    /* Deep-link from the Discount Programs mega-menu cards (see
       partials/header.html): each card's href carries a #hash matching one
       tab's data-hash, so arriving from that card opens straight on its own
       tab instead of always defaulting to the first one.

       Checked on load AND on "hashchange" — clicking one of those mega-menu
       links while ALREADY on this page only changes the URL's hash (same
       path, so the browser doesn't reload/re-run this script); without the
       hashchange listener the tab never switched in that case, only when
       arriving fresh from another page. */
    var applyDiscountHash = function () {
      var discountHash = window.location.hash.replace(/^#/, "");
      if (!discountHash) return;
      var matchedDiscountTab = null;
      discountTabs.forEach(function (t) {
        if (t.getAttribute("data-hash") === discountHash) matchedDiscountTab = t;
      });
      if (matchedDiscountTab) activateDiscountTab(matchedDiscountTab);
    };
    applyDiscountHash();
    window.addEventListener("hashchange", applyDiscountHash);
  }
})();
```

### B.3 `partials/header.html`
Bare fragment — no `<html>/<head>/<body>` wrapper. Mounted by `js/main.js` into
`<div id="site-header"></div>` on every page.
```html
<!-- ===== Top contact bar ===== -->
<div class="topbar">
  <div class="container topbar__inner">
    <div class="topbar__group">
      <a class="topbar__link" href="mailto:info@serversalad.com">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 3.4V18h16V7.4l-8 5-8-5z"/>
        </svg>
        info@serversalad.com
      </a>

      <a class="topbar__link" href="tel:+94712000006">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
        </svg>
        +94 71 200 0006
      </a>
    </div>

    <div class="topbar__group">
      <a class="topbar__link" href="#about">About</a>
      <a class="topbar__link" href="#contact">Contact</a>
      <a class="topbar__link" href="#blog">Blog</a>
    </div>
  </div>
</div>

<!-- ===== Main navigation ===== -->
<header class="nav">
  <div class="container nav__inner">
    <a class="brand" href="/server-salad-cloud-services-web/" aria-label="Server Salad home">
      <img class="brand__logo" src="/server-salad-cloud-services-web/assets/img/brand/serversalad-logo.png" alt="Server Salad" width="46" height="45">
    </a>

    <button class="nav__burger" id="navBurger" type="button" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <nav class="nav__menu" id="navMenu">
      <ul class="nav__list">
        <li class="nav__item has-mega" data-dropdown>
          <button class="nav__link" type="button">Web Hosting <span class="caret"></span></button>
          <div class="nav__mega">
            <!-- Only mega menu with an intro column: the description is real,
                 owner-supplied copy (same "High-speed NVMe Web Hosting..." /
                 "Scale up to business plans..." text used on the hero cards, see
                 Hero notes), not new copy written for this spot. No
                 regions/key-features/apps zones from the reference design: there's
                 no real existing content to fill them with yet. -->
            <div class="nav__mega-inner nav__mega-inner--intro container">
              <!-- Intro + cards grouped into one wrapper (instead of 3 flat grid
                   columns) so the app-logos strip below them can be width-bound
                   to "everything left of the Key Features box", at any viewport
                   width, without a guessed pixel value that could overlap it. -->
              <div class="nav__mega-left">
                <div class="nav__mega-left-top">
                  <div class="nav__mega-intro">
                    <h3 class="nav__mega-intro-title">Web <strong>Hosting</strong></h3>
                    <p class="nav__mega-intro-desc">High-speed NVMe Web Hosting featuring intuitive cPanel control to launch blogs, portfolios, or small online stores with rock-solid reliability and zero technical friction. Scale up to business plans engineered with dedicated RAM, extra compute power, and 24/7 priority support to keep high-traffic sites fast, responsive, and online.</p>
                  </div>
                  <!-- Divider is a flex sibling of the cards (not a separate grid
                       column) so it stretches to the cards' own content height,
                       not the taller Key Features box's height. -->
                  <div class="nav__mega-middle">
                    <div class="nav__mega-intro-divider" aria-hidden="true"></div>
                    <div class="nav__mega-cards">
                      <a class="mega-card" href="/server-salad-cloud-services-web/cpanel-hosting/">
                        <span class="mega-card__row">
                          <span class="mega-card__icon">
                            <span class="mega-card__icon-img" style="--mega-icon: url(/server-salad-cloud-services-web/assets/img/hero/cpanel-hosting-icon.svg)" aria-hidden="true"></span>
                          </span>
                          <span class="mega-card__title">cPanel <strong>Hosting</strong></span>
                        </span>
                        <span class="mega-card__desc">High-speed NVMe Web Hosting featuring intuitive cPanel control. Launch blogs, portfolios, or small online stores in seconds with rock-solid reliability and zero technical friction.</span>
                      </a>
                      <div class="mega-card mega-card--soon">
                        <span class="mega-card__row">
                          <span class="mega-card__icon">
                            <span class="mega-card__icon-img" style="--mega-icon: url(/server-salad-cloud-services-web/assets/img/hero/cpanel-business-hosting-icon.svg)" aria-hidden="true"></span>
                          </span>
                          <span class="mega-card__title">cPanel <strong>Business Hosting</strong></span>
                        </span>
                        <span class="mega-card__desc">Engineered for growth with dedicated RAM, extra compute power, and 24/7 priority support. Keep high-traffic sites and e-commerce stores fast, responsive, and online.</span>
                        <span class="mega-card__soon" aria-hidden="true">Launching Soon</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Left-aligned with the description above; width-capped to this
                     wrapper (never reaches the Key Features box), wraps to a 2nd
                     line instead of overlapping it if it doesn't fit on one. -->
                <div class="nav__mega-apps">
                  <!-- Same traveling-bolt border effect as the WordPress note
                       pill in the Plans section (see .plans__note-beam);
                       rx/ry matches this box's own border-radius (8px). -->
                  <span class="nav__mega-apps-beam" aria-hidden="true">
                    <svg>
                      <rect class="nav__mega-apps-beam-glow" x="0" y="0" width="100%" height="100%" rx="8" ry="8" pathLength="200"/>
                    </svg>
                  </span>
                  <div class="nav__mega-apps-row">
                    <img class="nav__mega-apps-logo" src="/server-salad-cloud-services-web/assets/img/apps/wordpress-logo.svg" alt="WordPress" loading="lazy">
                    <img class="nav__mega-apps-logo" src="/server-salad-cloud-services-web/assets/img/apps/joomla-logo.svg" alt="Joomla" loading="lazy">
                    <img class="nav__mega-apps-logo" src="/server-salad-cloud-services-web/assets/img/apps/drupal-logo.svg" alt="Drupal" loading="lazy">
                    <img class="nav__mega-apps-logo" src="/server-salad-cloud-services-web/assets/img/apps/moodle-logo.svg" alt="Moodle" loading="lazy">
                    <img class="nav__mega-apps-logo" src="/server-salad-cloud-services-web/assets/img/apps/phpmyadmin-logo.svg" alt="phpMyAdmin" loading="lazy">
                    <img class="nav__mega-apps-logo" src="/server-salad-cloud-services-web/assets/img/apps/akaunting-logo.svg" alt="Akaunting" loading="lazy">
                    <img class="nav__mega-apps-logo" src="/server-salad-cloud-services-web/assets/img/apps/orangehrm-logo.svg" alt="OrangeHRM" loading="lazy">
                    <!-- PLACEHOLDER link — no apps catalogue page exists yet, "300+"
                         count is illustrative pending a real figure/page. -->
                    <a class="nav__mega-apps-link" href="#apps">
                      <span class="nav__mega-apps-link-text">See 300+ apps with <span style="white-space: nowrap;">1-click</span> install on cPanel</span>
                      <span class="nav__mega-apps-link-arrow" style="--apps-link-icon: url(/server-salad-cloud-services-web/assets/img/nav/mouse-pointer-icon.svg)" aria-hidden="true"></span>
                    </a>
                  </div>
                </div>
              </div>
              <!-- Both lists below are owner-supplied real plan-spec copy. -->
              <div class="nav__mega-features">
                <h4 class="nav__mega-features-title">Key <strong>Features</strong></h4>
                <ul class="nav__mega-features-list">
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    LiteSpeed Cache Manager
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    cPGuard Security Shield
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Automated JetBackups
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Free SSL Certificates
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Node.js &amp; Python Support
                  </li>
                </ul>
                <h4 class="nav__mega-features-title nav__mega-features-title--sub">cPanel <strong>Business</strong> Hosting Difference</h4>
                <ul class="nav__mega-features-list">
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Boosted CPU &amp; Dedicated RAM
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Unmetered Traffic Bandwidth
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    High-Traffic Optimization
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    24/7 Priority Ticket Support
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Less Contended Hardware
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="nav__item nav__item--soon">
          <span class="nav__link nav__link--soon" tabindex="0">Servers</span>
          <span class="nav__tooltip" role="tooltip">Launching Soon</span>
        </li>
        <li class="nav__item nav__item--soon">
          <span class="nav__link nav__link--soon" tabindex="0">Domains</span>
          <span class="nav__tooltip" role="tooltip">Launching Soon</span>
        </li>
        <li class="nav__item has-mega" data-dropdown>
          <button class="nav__link" type="button">Discount Programs <span class="caret"></span></button>
          <div class="nav__mega">
            <!-- Same intro-column + divider + cards + Key Features box layout as the
                 Web Hosting▾ menu above (see its comment). Unlike that menu, there's
                 no owner-supplied intro/benefits copy for Discount Programs yet, so
                 the text below is short placeholder filler (kept deliberately small
                 and generic) pending real copy from the owner. -->
            <div class="nav__mega-inner nav__mega-inner--intro container">
              <div class="nav__mega-left">
                <div class="nav__mega-left-top">
                  <div class="nav__mega-intro">
                    <h3 class="nav__mega-intro-title nav__mega-intro-title--wrap">Discount <strong>Programs</strong></h3>
                    <p class="nav__mega-intro-desc">Exclusive hosting discounts on select plans for verified students, student organizations, new business launches, and client developers.</p>
                  </div>
                  <div class="nav__mega-middle">
                    <div class="nav__mega-intro-divider" aria-hidden="true"></div>
                    <div class="nav__mega-cards">
                      <!-- All 3 cards point at the discount-programs/ page, each with a
                           #hash matching one tab's data-hash there (see
                           discount-programs/index.html + js/main.js) — landing on the
                           page opens straight on that card's own tab instead of always
                           defaulting to the first one. -->
                      <a class="mega-card" href="/server-salad-cloud-services-web/discount-programs/#student-academic">
                        <span class="mega-card__row">
                          <span class="mega-card__icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M12 3 1 8l11 5 9-4.1V17h2V8z"/>
                              <path d="M5 10.5V15c0 1.7 3.1 3 7 3s7-1.3 7-3v-4.5l-7 3.2z"/>
                            </svg>
                          </span>
                          <span class="mega-card__title">Student &amp; Academic <strong>Program</strong></span>
                        </span>
                        <span class="mega-card__desc">Discounted hosting on select plans for recognized students and university or school clubs.</span>
                      </a>
                      <a class="mega-card" href="/server-salad-cloud-services-web/discount-programs/#startup">
                        <span class="mega-card__row">
                          <span class="mega-card__icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M13 2c3 1 6 4 6 9 0 2-1 4-2 5l-1-3-3 3-2-2 3-3-3-1c1-1 3-2 5-2-1-3-2-5-3-6z"/>
                              <path d="M9 15l-4 4-2-1 4-4zM8 13l3 3-1 3-4-2z"/>
                            </svg>
                          </span>
                          <span class="mega-card__title">Startup <strong>Program</strong></span>
                        </span>
                        <span class="mega-card__desc">Reduced rates on select hosting plans designed to help newly established businesses launch their web presence.</span>
                      </a>
                      <a class="mega-card" href="/server-salad-cloud-services-web/discount-programs/#agency-freelancer">
                        <span class="mega-card__row">
                          <span class="mega-card__icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <rect x="3" y="7" width="18" height="12" rx="1.5"/>
                              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </span>
                          <span class="mega-card__title">Agency &amp; Freelancer <strong>Program</strong></span>
                        </span>
                        <span class="mega-card__desc">Discounted cPanel hosting plans for developers and agencies hosting websites on behalf of their clients.</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nav__mega-features">
                <h4 class="nav__mega-features-title">Why We Built <strong>This:</strong></h4>
                <ul class="nav__mega-features-list">
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Fueling Big Ambitions
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Removing Financial Friction
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Believing in Every Builder
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Backing Student Innovators
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Championing Early Ventures
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Growing Alongside You
                  </li>
                  <li>
                    <svg class="nav__mega-features-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>
                    Keeping Great Ideas Online
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="nav__item">
          <a class="nav__link" href="https://hub.serversalad.com" target="_blank" rel="noopener">Open a Ticket</a>
        </li>
      </ul>

      <a class="btn btn--account" href="https://hub.serversalad.com" target="_blank" rel="noopener">My Account</a>
    </nav>
  </div>
</header>
```

### B.4 `partials/footer.html`
Bare fragment, mounted into `<div id="site-footer"></div>` before the closing
`</body>` script tag on every page.
```html
<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="footer__logo-link" href="/server-salad-cloud-services-web/" aria-label="Server Salad home">
          <img class="footer__logo" src="/server-salad-cloud-services-web/assets/img/brand/serversalad-logo-full.png" alt="Server Salad" width="220" height="54">
        </a>
        <p class="footer__tagline-desc">Server Salad Cloud Services - Reliable hosting and domains since 2021. Now expanding globally with VPS, dedicated servers, email hosting, and more. Based in Sri Lanka, powering the cloud worldwide.</p>
        <p class="footer__tagline">Relish the Cloud!</p>
        <a class="btn footer__cta" href="#about">
          <span class="footer__cta-icon" style="--footer-cta-icon: url(/server-salad-cloud-services-web/assets/img/footer/learn-more-heart-icon.svg)" aria-hidden="true"></span>
          Learn more about us
        </a>
      </div>

      <nav class="footer__col" aria-label="Information">
        <span class="footer__col-title">Information</span>
        <ul class="footer__links">
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#knowledgebase">Knowledgebase</a></li>
          <li><a href="#ticket">Submit a Ticket</a></li>
          <li><a href="#status">System Status</a></li>
          <li><a href="#terms">Terms &amp; Conditions</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#discount-programs">Discount Programs</a></li>
        </ul>
      </nav>

      <nav class="footer__col" aria-label="Products">
        <span class="footer__col-title">Products</span>
        <ul class="footer__links">
          <li><a href="/server-salad-cloud-services-web/cpanel-hosting/">cPanel Hosting</a></li>
          <li class="footer__links-item--soon">
            <span class="footer__links-link--soon" tabindex="0">cPanel Business Hosting</span>
            <span class="footer__tooltip" role="tooltip">Launching Soon</span>
          </li>
          <li class="footer__links-item--soon">
            <span class="footer__links-link--soon" tabindex="0">VPS Hosting</span>
            <span class="footer__tooltip" role="tooltip">Launching Soon</span>
          </li>
          <li class="footer__links-item--soon">
            <span class="footer__links-link--soon" tabindex="0">Domains</span>
            <span class="footer__tooltip" role="tooltip">Launching Soon</span>
          </li>
        </ul>
      </nav>

      <div class="footer__col footer__col--touch">
        <span class="footer__col-title">Get in Touch</span>

        <a class="footer__contact-line" href="tel:+94712000006">
          <span class="footer__contact-line-icon" style="--footer-icon: url(/server-salad-cloud-services-web/assets/img/footer/phone-icon.svg)" aria-hidden="true"></span>
          +94 71 200 0006
        </a>
        <a class="footer__contact-line" href="mailto:info@serversalad.com">
          <span class="footer__contact-line-icon" style="--footer-icon: url(/server-salad-cloud-services-web/assets/img/footer/email-icon.svg)" aria-hidden="true"></span>
          info@serversalad.com
        </a>

        <div class="footer__underline" aria-hidden="true"></div>
        <span class="footer__col-title">Follow Us</span>
        <div class="footer__social">
          <a href="https://www.facebook.com/ServerSaladGlobal/" target="_blank" rel="noopener" aria-label="Server Salad on Facebook">
            <span class="footer__social-icon" style="--social-icon: url(/server-salad-cloud-services-web/assets/img/footer/facebook-icon.svg)" aria-hidden="true"></span>
          </a>
          <a href="https://www.linkedin.com/company/serversalad/" target="_blank" rel="noopener" aria-label="Server Salad on LinkedIn">
            <span class="footer__social-icon" style="--social-icon: url(/server-salad-cloud-services-web/assets/img/footer/linkedin-icon.svg)" aria-hidden="true"></span>
          </a>
          <a href="https://www.instagram.com/server_salad/" target="_blank" rel="noopener" aria-label="Server Salad on Instagram">
            <span class="footer__social-icon" style="--social-icon: url(/server-salad-cloud-services-web/assets/img/footer/instagram-icon.svg)" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; 2026 Server Salad Cloud Services. All rights reserved.</p>
    </div>
  </div>
</footer>
```


### B.5 `index.html` (homepage)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Salad Cloud Services</title>

  <link rel="icon" type="image/svg+xml" href="/server-salad-cloud-services-web/assets/img/brand/serversalad-favicon.svg">

  <!-- Fonts: Poppins (headings) + Inter (body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&family=Inter:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/server-salad-cloud-services-web/css/styles.css?v=319">
</head>
<body>

  <!-- Topbar + nav are a shared partial (partials/header.html), injected by
       js/main.js so every page shares the same markup from one file. -->
  <div id="site-header"></div>

  <main>
    <!-- ===== Hero ===== -->
    <section class="hero">
      <div class="hero__bg" aria-hidden="true"></div>

      <div class="container hero__inner">
        <h1 class="hero__title">
          <span class="hero__title-accent">Sri Lankan Support.</span> European Infrastructure.<br>
          Zero Compromise.
        </h1>

        <div class="hero__cards">
          <a class="hero-card" href="/server-salad-cloud-services-web/cpanel-hosting/">
            <span class="hero-card__badge">Most Popular</span>
            <span class="hero-card__icon">
              <span class="hero-card__icon-img" style="--hero-icon: url(/server-salad-cloud-services-web/assets/img/hero/cpanel-hosting-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="hero-card__title">cPanel Hosting</h3>
            <p class="hero-card__desc">High-speed NVMe Web Hosting featuring intuitive cPanel control. Launch blogs, portfolios, or small online stores in seconds with rock-solid reliability and zero technical friction.</p>
          </a>

          <div class="hero-card hero-card--soon">
            <span class="hero-card__icon">
              <span class="hero-card__icon-img" style="--hero-icon: url(/server-salad-cloud-services-web/assets/img/hero/cpanel-business-hosting-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="hero-card__title">cPanel Business Hosting</h3>
            <p class="hero-card__desc">Engineered for growth with dedicated RAM, extra compute power, and 24/7 priority support. Keep high-traffic sites and e-commerce stores fast, responsive, and online.</p>
            <span class="hero-card__soon" aria-hidden="true">Launching Soon</span>
          </div>

          <div class="hero-card hero-card--soon">
            <span class="hero-card__icon">
              <span class="hero-card__icon-img" style="--hero-icon: url(/server-salad-cloud-services-web/assets/img/hero/vps-hosting-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="hero-card__title">VPS Hosting</h3>
            <p class="hero-card__desc">High-performance Cloud VPS Hosting featuring full root access and dedicated NVMe resources. Built for custom applications, complex workloads, and developers.</p>
            <span class="hero-card__soon" aria-hidden="true">Launching Soon</span>
          </div>

          <div class="hero-card hero-card--soon">
            <span class="hero-card__icon">
              <span class="hero-card__icon-img" style="--hero-icon: url(/server-salad-cloud-services-web/assets/img/hero/domains-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="hero-card__title">Domains</h3>
            <p class="hero-card__desc">Secure your brand instantly with fast domain name registration, free DNS management tools, and built-in privacy protection from one easy dashboard.</p>
            <span class="hero-card__soon" aria-hidden="true">Launching Soon</span>
          </div>
        </div>

        <div class="hero__strip">
          <div class="hero__logos-viewport" id="logosViewport">
            <!-- Shows 4 logos at a time; auto-slides left continuously and loops
                 seamlessly because the list below is duplicated once. Drag/swipe to
                 slide manually too (see js/main.js). -->
            <ul class="hero__logos" id="heroLogos">
              <li><img src="assets/img/partners/partners-jetbackup.png" alt="JetBackup" draggable="false"></li>
              <li><img src="assets/img/partners/partners-cloudlinux.png" alt="CloudLinux OS" draggable="false"></li>
              <li><img src="assets/img/partners/partners-litespeed.png" alt="LiteSpeed" draggable="false"></li>
              <li><img src="assets/img/partners/partners-softaculous.png" alt="Softaculous" draggable="false"></li>
              <li><img src="assets/img/partners/partners-cpanel.png" alt="cPanel" draggable="false"></li>
              <li><img src="assets/img/partners/partners-letsencrypt.png" alt="Let's Encrypt" draggable="false"></li>
              <!-- duplicate set, hidden from assistive tech, needed for the seamless loop -->
              <li aria-hidden="true"><img src="assets/img/partners/partners-jetbackup.png" alt="" draggable="false"></li>
              <li aria-hidden="true"><img src="assets/img/partners/partners-cloudlinux.png" alt="" draggable="false"></li>
              <li aria-hidden="true"><img src="assets/img/partners/partners-litespeed.png" alt="" draggable="false"></li>
              <li aria-hidden="true"><img src="assets/img/partners/partners-softaculous.png" alt="" draggable="false"></li>
              <li aria-hidden="true"><img src="assets/img/partners/partners-cpanel.png" alt="" draggable="false"></li>
              <li aria-hidden="true"><img src="assets/img/partners/partners-letsencrypt.png" alt="" draggable="false"></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== What Makes Us Different ===== -->
    <section class="features">
      <div class="container features__inner">
        <h2 class="features__title">Why Choose Server Salad for High-Performance Hosting?</h2>
        <div class="features__underline" aria-hidden="true"></div>

        <div class="features__grid">
          <div class="feature">
            <span class="feature__icon">
              <span class="feature__icon-img" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-choose/expert-support-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="feature__title">Free 24/7 Expert <span class="feature__title-accent">Support</span></h3>
            <p class="feature__desc">Get free 24/7 technical support via ticket, chat, and phone included with every plan. Never pay extra for the guidance you need.</p>
          </div>

          <div class="feature">
            <span class="feature__icon">
              <span class="feature__icon-img" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-choose/live-help-sessions-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="feature__title">Saturday Live Help <span class="feature__title-accent">Sessions</span></h3>
            <p class="feature__desc">Drop into weekly live virtual sessions for interactive setup assistance and direct, real-time troubleshooting with our senior engineers.</p>
          </div>

          <div class="feature">
            <span class="feature__icon">
              <span class="feature__icon-img" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-choose/licensed-software-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="feature__title">100% Licensed <span class="feature__title-accent">Software</span></h3>
            <p class="feature__desc">Zero nulled or grey-market tools. Every control panel, security tool, and management utility runs on 100% genuine software licenses.</p>
          </div>

          <div class="feature">
            <span class="feature__icon">
              <span class="feature__icon-img" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-choose/community-perks-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="feature__title">Creator &amp; Community <span class="feature__title-accent">Perks</span></h3>
            <p class="feature__desc">Unlock exclusive hosting discounts and extra credits tailored for Sri Lankan students, educators, tech startups, and agency freelancers.</p>
          </div>

          <div class="feature">
            <span class="feature__icon">
              <span class="feature__icon-img" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-choose/cpguard-security-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="feature__title">Advanced CPGuard <span class="feature__title-accent">Security</span></h3>
            <p class="feature__desc">Keep your site safe with automated malware scanning, real-time threat isolation, and proactive 24/7 cleanup at no additional cost.</p>
          </div>

          <div class="feature">
            <span class="feature__icon">
              <span class="feature__icon-img" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-choose/european-power-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="feature__title">Local Care, European <span class="feature__title-accent">Power</span></h3>
            <p class="feature__desc">Experience dedicated 24/7 local support backed by high-speed European enterprise data centers for unbeatable uptime and performance.</p>
          </div>
        </div>

        <div class="features__reviews">
          <a class="review-btn" href="https://share.google/9Emq2d350s95Vys2X" target="_blank" rel="noopener">
            <img class="review-btn__icon" src="/server-salad-cloud-services-web/assets/img/reviews/google-logo.png" alt="" width="18" height="18">
            <span>Reviews on Google</span>
            <span class="review-btn__arrow" aria-hidden="true">&rarr;</span>
          </a>
          <a class="review-btn" href="https://www.trustpilot.com/review/serversalad.com" target="_blank" rel="noopener">
            <img class="review-btn__icon" src="/server-salad-cloud-services-web/assets/img/reviews/trustpilot-logo.png" alt="" width="18" height="18">
            <span>Reviews on Trustpilot</span>
            <span class="review-btn__arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== Sustainability ===== -->
    <section class="eco">
      <div class="eco__photo" aria-hidden="true"></div>
      <div class="eco__bg" aria-hidden="true"></div>
      <div class="container eco__inner">
        <div class="eco__content">
          <span class="eco__label">100% Renewable Energy</span>
          <h2 class="eco__title">Sustainable Hosting Powered by <span class="eco__title-accent">100% Green Energy</span></h2>
          <div class="eco__underline" aria-hidden="true"></div>
          <p class="eco__desc">Power your website on enterprise European infrastructure running on 100% renewable energy. Our infrastructure partners fund tree planting and climate projects through <a class="eco__link" href="https://ecologi.com/" target="_blank" rel="noopener">Ecologi</a>, ensuring every Server Salad account directly supports global reforestation while delivering maximum speed with zero carbon compromise.</p>
        </div>
      </div>
    </section>

    <!-- ===== Plans + Locations: one continuous white-to-light-ash section ===== -->
    <div class="plans-locations">
    <!-- ===== Plans ===== -->
    <section class="plans">
      <div class="container plans__inner">
        <h2 class="plans__title"><span class="plans__title-accent">High-Performance</span> cPanel Hosting <strong>Starting from LKR <span data-price="starter_salad" data-monthly="10000" data-format="number" data-annual-always="true">10000</span>/mo</strong></h2>
        <p class="plans__subtitle">Fast, secure NVMe-powered web hosting with intuitive cPanel control and instant setup.</p>

        <div class="plans__note">
          <span class="plans__note-beam" aria-hidden="true">
            <svg>
              <rect class="plans__note-beam-glow" x="0" y="0" width="100%" height="100%" rx="14" ry="14" pathLength="200"/>
            </svg>
          </span>
          <span class="plans__note-icon">
            <svg width="18" height="18" viewBox="0 0 512 512" aria-hidden="true">
              <path fill="#00aec0" d="M256 8C119.3 8 8 119.2 8 256c0 136.7 111.3 248 248 248s248-111.3 248-248C504 119.2 392.7 8 256 8zM33 256c0-32.3 6.9-63 19.3-90.7l106.4 291.4C84.3 420.5 33 344.2 33 256zm223 223c-21.9 0-43-3.2-63-9.1l66.9-194.4 68.5 187.8c.5 1.1 1 2.1 1.6 3.1-23.1 8.1-48 12.6-74 12.6zm30.7-327.5c13.4-.7 25.5-2.1 25.5-2.1 12-1.4 10.6-19.1-1.4-18.4 0 0-36.1 2.8-59.4 2.8-21.9 0-58.7-2.8-58.7-2.8-12-.7-13.4 17.7-1.4 18.4 0 0 11.4 1.4 23.4 2.1l34.7 95.2L200.6 393l-81.2-241.5c13.4-.7 25.5-2.1 25.5-2.1 12-1.4 10.6-19.1-1.4-18.4 0 0-36.1 2.8-59.4 2.8-4.2 0-9.1-.1-14.4-.3C109.6 73 178.1 33 256 33c58 0 110.9 22.2 150.6 58.5-1-.1-1.9-.2-2.9-.2-21.9 0-37.4 19.1-37.4 39.6 0 18.4 10.6 33.9 21.9 52.3 8.5 14.8 18.4 33.9 18.4 61.5 0 19.1-7.3 41.2-17 72.1l-22.2 74.3-80.7-239.6zm81.4 297.2l68.1-196.9c12.7-31.8 17-57.2 17-79.9 0-8.2-.5-15.8-1.5-22.9 17.4 31.8 27.3 68.2 27.3 107 0 82.3-44.6 154.1-110.9 192.7z"/>
            </svg>
          </span>
          <span>All of our hosting plans are fully optimised for WordPress</span>
        </div>

        <div class="plans__cards">
          <div class="plan-card">
            <span class="plan-card__badge">Most Popular</span>
            <span class="plan-card__icon" style="--plan-icon: url(/server-salad-cloud-services-web/assets/img/hero/cpanel-hosting-icon.svg)" aria-hidden="true"></span>
            <h3 class="plan-card__title">cPanel Hosting</h3>
            <p class="plan-card__price">
              <span class="plan-card__price-label">Starting from</span>
              <span class="plan-card__price-value">LKR&nbsp;<span data-price="starter_salad" data-monthly="10000" data-format="number" data-annual-always="true">10000</span><span class="plan-card__price-period">/ month</span></span>
            </p>
            <p class="plan-card__billed" data-billed="starter_salad"></p>
            <p class="plan-card__desc">High-speed NVMe hosting built for freelancers, personal sites, startups, and small online stores needing fast performance.</p>
            <ul class="plan-card__features">
              <li><strong>1 to 10 Websites</strong> with up to 30 GB NVMe Storage</li>
              <li><strong>2 Cores CPU &amp; 2 GB RAM</strong> guaranteed allocation per plan</li>
              <li><strong>LiteSpeed Web Server</strong> for enterprise page caching</li>
              <li><strong>Node.js &amp; Python Support</strong> via Phusion Passenger</li>
              <li><strong>cPGuard Malware Shield</strong> for automated 24/7 security</li>
              <li><strong>Automated JetBackups</strong> with 1-click disaster recovery</li>
            </ul>
            <a class="btn btn--outline" href="/server-salad-cloud-services-web/cpanel-hosting/">View cPanel Hosting Plans</a>
          </div>

          <div class="plan-card">
            <span class="plan-card__icon" style="--plan-icon: url(/server-salad-cloud-services-web/assets/img/hero/cpanel-business-hosting-icon.svg)" aria-hidden="true"></span>
            <h3 class="plan-card__title">cPanel Business Hosting</h3>
            <p class="plan-card__price plan-card__price--soon">To be announced</p>
            <p class="plan-card__billed" aria-hidden="true"></p>
            <p class="plan-card__desc">Boosted compute power and dedicated RAM paired with priority support for scaling e-commerce stores and high-traffic portals.</p>
            <ul class="plan-card__features">
              <li><strong>All cPanel Features</strong> + Enterprise Upgrades</li>
              <li><strong>Boosted CPU &amp; Dedicated RAM</strong> Allocation</li>
              <li><strong>Unmetered Bandwidth</strong> for Heavy Traffic</li>
              <li><strong>High-Traffic Optimization</strong> for E-Commerce</li>
              <li><strong>24/7 Priority Support</strong> &amp; Express Handling</li>
              <li><strong>21-Day Money-Back Guarantee</strong> Included</li>
            </ul>
            <span class="btn btn--outline btn--soon" tabindex="0">
              <span class="btn--soon-label">View Business Hosting Plans</span>
              <span class="btn--soon-overlay" aria-hidden="true">Launching Soon</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="locations">
      <div class="container">
        <div class="locations__map">
          <img src="assets/img/graphics/world-map-dots.png" alt="World map with a marker over London, United Kingdom" class="locations__map-img">
          <span class="locations__pin" tabindex="0">
            <span class="locations__pin-pulse" aria-hidden="true"></span>
            <span class="locations__pin-dot" aria-hidden="true"></span>
            <span class="sr-only">London, UK — hover or focus for details</span>
            <div class="locations__card" role="tooltip">
              <h3 class="locations__card-title">
                <img src="assets/img/flags/uk-flag-circle.png" alt="" class="locations__card-flag">
                London, UK
              </h3>
              <p>Our primary cPanel infrastructure is hosted in top-tier London data centers.</p>
              <p>Experience ultra-low latency with direct LINX network connectivity and enterprise-grade performance built on 100% NVMe storage.</p>
            </div>
          </span>
        </div>
      </div>
    </section>
    </div>

    <!-- ===== Migration ===== -->
    <section class="migration">
      <div class="container migration__inner">
        <div class="migration__top">
          <div class="migration__content">
            <span class="migration__eyebrow">Hassle-Free Migration</span>
            <h2 class="migration__title">Effortless cPanel Transfer</h2>
            <div class="migration__underline" aria-hidden="true"></div>
            <p class="migration__desc">Switching to Server Salad is completely simple. Our technical team securely transfers your full cPanel account via native system APIs, ensuring total data integrity, complete account accuracy, and zero migration fees.</p>
          </div>

          <div class="migration__visual" aria-hidden="true">
            <div class="migration__box">
              <span class="migration__box-label">Your current host</span>
              <span class="migration__bar"></span>
              <span class="migration__bar migration__bar--mid"></span>
              <span class="migration__bar migration__bar--short"></span>
            </div>

            <svg class="migration__arrow" viewBox="0 0 130 70" fill="none">
              <path id="migrationPath" class="migration__arrow-path" d="M4 46C30 12 78 8 118 26" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round"/>
              <path d="M108 17l12 9-13 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- File "packet" that rides the dashed path from the old host to Server Salad -->
              <g class="migration__packet">
                <rect x="-5" y="-6.5" width="10" height="13" rx="2" fill="#1b2427" stroke="#f57e20" stroke-width="1.5"/>
                <path d="M-2.5-3h5M-2.5 0h5M-2.5 3h3" stroke="#f57e20" stroke-width="1.2" stroke-linecap="round"/>
                <animateMotion dur="2.6s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1" keyTimes="0;1">
                  <mpath href="#migrationPath" xlink:href="#migrationPath"/>
                </animateMotion>
                <animate attributeName="opacity" dur="2.6s" repeatCount="indefinite"
                         values="0;1;1;1;0" keyTimes="0;0.12;0.5;0.85;1"/>
              </g>
            </svg>

            <div class="migration__box migration__box--ours">
              <span class="migration__box-label">Server Salad</span>
              <span class="migration__tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5"/>
                </svg>
              </span>
              <span class="migration__box-note">NVMe cloud</span>
            </div>
          </div>
        </div>

        <div class="migration__grid">
          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/cpanel-account-move-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Free &amp; Complete<br>cPanel Account Move</h3>
            <p class="migration-card__desc">We transfer your entire cPanel account from your previous host at zero additional cost, handling all technical work for you.</p>
          </div>

          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/api-transfers-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Automated &amp; Secure<br>API Transfers</h3>
            <p class="migration-card__desc">Migrations execute directly through secure system APIs, keeping your website files, databases, and DNS configurations intact.</p>
          </div>

          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/quick-request-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Quick &amp; Simple<br>Request Process</h3>
            <p class="migration-card__desc">Submit your migration request in seconds without filling out complicated technical forms or dealing with tedious back-and-forth.</p>
          </div>

          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/email-retention-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Complete Data &amp;<br>Email Retention</h3>
            <p class="migration-card__desc">All mailboxes, saved emails, and account credentials transfer over seamlessly without requiring manual re-configuration.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Cloud infrastructure ===== -->
    <section class="cloud">
      <div class="container">
        <h2 class="cloud__title">Our Cloud Infrastructure</h2>
        <div class="cloud__underline" aria-hidden="true"></div>

        <div class="cloud__grid">
          <div class="cloud-card">
            <span class="cloud-card__icon">
              <span class="cloud-card__icon-img" style="--cloud-icon: url(/server-salad-cloud-services-web/assets/img/cloud/enterprise-infrastructure-icon.svg)" aria-hidden="true"></span>
            </span>
            <div class="cloud-card__body">
              <h3 class="cloud-card__title">Enterprise Cloud<br><strong>Infrastructure</strong></h3>
              <p class="cloud-card__desc">We have invested heavily in enterprise-grade infrastructure, allowing us to build out our incredibly powerful cloud platform.</p>
            </div>
          </div>

          <div class="cloud-card">
            <span class="cloud-card__icon">
              <span class="cloud-card__icon-img" style="--cloud-icon: url(/server-salad-cloud-services-web/assets/img/cloud/nvme-storage-icon.svg)" aria-hidden="true"></span>
            </span>
            <div class="cloud-card__body">
              <h3 class="cloud-card__title">Samsung Enterprise<br><strong>NVMe Storage</strong></h3>
              <p class="cloud-card__desc">Our private cloud environment runs on the latest Samsung NVMe storage, providing pure, uncontended NVMe storage across the entire platform.</p>
            </div>
          </div>

          <div class="cloud-card">
            <span class="cloud-card__icon">
              <span class="cloud-card__icon-img" style="--cloud-icon: url(/server-salad-cloud-services-web/assets/img/cloud/cpguard-protection-icon.svg)" aria-hidden="true"></span>
            </span>
            <div class="cloud-card__body">
              <h3 class="cloud-card__title">Full Protection<br><strong>With cPGuard</strong></h3>
              <p class="cloud-card__desc">cPGuard protects you and your clients from malware, brute force, and exploit attacks on autopilot, with one of the industry's lowest false-positive rates.</p>
            </div>
          </div>

          <div class="cloud-card">
            <span class="cloud-card__icon">
              <span class="cloud-card__icon-img" style="--cloud-icon: url(/server-salad-cloud-services-web/assets/img/cloud/amd-epyc-cpu-icon.svg)" aria-hidden="true"></span>
            </span>
            <div class="cloud-card__body">
              <h3 class="cloud-card__title">Powered By<br><strong>AMD EPYC&trade; CPUs</strong></h3>
              <p class="cloud-card__desc">Our cloud infrastructure is entirely powered by enterprise-grade AMD EPYC&trade; CPUs throughout, boasting an unrivalled level of power and performance per core.</p>
            </div>
          </div>

          <div class="cloud-card">
            <span class="cloud-card__icon">
              <span class="cloud-card__icon-img" style="--cloud-icon: url(/server-salad-cloud-services-web/assets/img/cloud/litespeed-icon.svg)" aria-hidden="true"></span>
            </span>
            <div class="cloud-card__body">
              <h3 class="cloud-card__title">Lightning Fast<br><strong>With LiteSpeed</strong></h3>
              <p class="cloud-card__desc">LiteSpeed Enterprise Web Server brings leading-edge performance, powered by our award-winning cloud NVMe infrastructure.</p>
            </div>
          </div>

          <div class="cloud-card">
            <span class="cloud-card__icon">
              <span class="cloud-card__icon-img" style="--cloud-icon: url(/server-salad-cloud-services-web/assets/img/cloud/cloudlinux-reliability-icon.svg)" aria-hidden="true"></span>
            </span>
            <div class="cloud-card__body">
              <h3 class="cloud-card__title">CloudLinux OS<br><strong>Reliability</strong></h3>
              <p class="cloud-card__desc">CloudLinux OS is a proven solution that provides isolated server environments, bringing maximum stability and performance to our cloud hosting platform.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer is a shared partial (partials/footer.html), injected by js/main.js so
       every page includes the same markup from one file. See README "Footer" notes. -->
  <div id="site-footer"></div>

  <script src="/server-salad-cloud-services-web/js/main.js?v=17"></script>
</body>
</html>
```


### B.6 `cpanel-hosting/index.html`
Second page. Same `<head>` pattern as `index.html` (title/favicon/fonts/
stylesheet, all root-relative), shared header+footer via the same partial
mounts, folder-with-`index.html` so the URL is
`/server-salad-cloud-services-web/cpanel-hosting/`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Salad Cloud Services</title>

  <link rel="icon" type="image/svg+xml" href="/server-salad-cloud-services-web/assets/img/brand/serversalad-favicon.svg">

  <!-- Fonts: Poppins (headings) + Inter (body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&family=Inter:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/server-salad-cloud-services-web/css/styles.css?v=346">
</head>
<body>

  <!-- Topbar + nav are a shared partial (partials/header.html), injected by
       js/main.js. See README "Footer"/shared-header notes. -->
  <div id="site-header"></div>

  <main>
    <!-- ===== Hero ===== -->
    <section class="cph-hero">
      <div class="cph-hero__bg" aria-hidden="true"></div>

      <div class="container cph-hero__inner">
        <div class="cph-hero__content">
          <h1 class="cph-hero__title">cPanel <span class="cph-hero__title-accent">Hosting</span></h1>
          <div class="cph-hero__underline" aria-hidden="true"></div>
          <p class="cph-hero__desc">High-speed, secure NVMe hosting featuring full cPanel control. Purpose-built for freelancers, startups, SMEs, educational institutions, personal blogs, and growing online stores.</p>
          <p class="cph-hero__desc">Every plan is powered by high-performance multi-core CPUs, equipped with LiteSpeed Cache, Python, Node.js, free SSL, proactive cPGuard protection, and a risk-free money-back guarantee.</p>
        </div>

        <div class="cph-hero__visual">
          <img src="/server-salad-cloud-services-web/assets/img/graphics/cpanel-dashboard-devices.webp" alt="The cPanel dashboard shown on a desktop monitor, tablet, and phone" width="1950" height="1184">
        </div>
      </div>
    </section>

    <!-- ===== Plans & feature comparison ===== -->
    <section class="cph-plans">
      <div class="container">
        <!-- Sticky scope: bounds the toggle + BOTH table grids below (nothing
             else), giving the toggle its long stick range through the whole
             table. The black package-header row inside .cph-table--main has
             its OWN, separate (shorter) bound — that grid's own box, which now
             ends right before the CTA row — see the comment above
             .cph-table--cta for why. So the toggle can stay stuck a little
             longer than the header once the header releases first: content
             just keeps scrolling normally underneath the still-pinned toggle,
             same as any ordinary sticky bar — no gap either way. -->
        <div class="cph-plans__sticky-scope">
        <!-- Sentinel js/main.js watches (IntersectionObserver) to detect the exact
             moment the toggle below locks into its sticky position, so its wider
             pre-stick padding-bottom can drop back to the original, already-fine
             stuck-state value — see .cph-billing-toggle.is-stuck. -->
        <div class="cph-billing-toggle__sentinel" aria-hidden="true"></div>
        <!-- Billing toggle: annual figures are calculated client-side from the
             fetched monthly price (10× monthly = year total, "2 months free" vs.
             12× monthly; that total ÷ 12 = the equivalent /mo rate shown here) —
             the DB only stores a monthly price, there's no separate annual price
             to fetch. See js/main.js and README "Pricing API" / billing toggle. -->
        <div class="cph-billing-toggle">
          <span class="cph-billing-toggle__label" data-billing-label="monthly">Monthly</span>
          <button type="button" class="cph-billing-toggle__switch" id="billingToggle" role="switch" aria-checked="true" aria-label="Switch between monthly and annual billing">
            <span class="cph-billing-toggle__knob" aria-hidden="true"></span>
          </button>
          <span class="cph-billing-toggle__label is-active" data-billing-label="annual">Annually <span class="cph-billing-toggle__badge">2 Months Free</span></span>
        </div>

        <!-- Sentinel js/main.js watches (IntersectionObserver) to detect the exact
             moment the package header row below locks into its own sticky
             position, toggling .is-condensed on it right then — see
             .cph-table__pkg.is-condensed in css/styles.css. -->
        <div class="cph-table__pkg-sentinel" aria-hidden="true"></div>
        <div class="cph-table-wrap">
        <div class="cph-table cph-table--main">
          <!-- Package header row -->
          <div class="cph-table__label cph-table__intro">
            <img src="/server-salad-cloud-services-web/assets/img/flags/uk-flag.svg" alt="United Kingdom" width="34" height="26" class="cph-table__flag cph-table__intro-flag">
            Fast, Secure &amp; Reliable Web Hosting
          </div>
          <div class="cph-table__pkg">
            <span class="cph-table__pkg-name">Starter Salad</span>
            <p class="cph-table__pkg-tagline">Light appetizer portion with 2-Core power, prepped for testing and staging.</p>
            <p class="cph-table__pkg-price"><strong data-price="starter_salad" data-monthly="10000">LKR 10,000</strong><span>/month</span></p>
            <p class="cph-table__pkg-billed" data-billed="starter_salad"></p>
          </div>
          <div class="cph-table__pkg">
            <span class="cph-table__pkg-name">Standard Salad</span>
            <p class="cph-table__pkg-tagline">Hearty main course with 2-Core power, prepped for live blogs and freelancers.</p>
            <!-- Fallback value shown until/unless the live pricing API responds
                 (see js/main.js + api/pricing.php) — kept so the page never shows
                 blank pricing if the API is unreachable. -->
            <p class="cph-table__pkg-price"><strong data-price="standard_salad" data-monthly="10000">LKR 10,000</strong><span>/month</span></p>
            <p class="cph-table__pkg-billed" data-billed="standard_salad"></p>
          </div>
          <div class="cph-table__pkg cph-table__pkg--last">
            <span class="cph-table__pkg-name">Premium Salad</span>
            <p class="cph-table__pkg-tagline">Generous banquet platter with 2-Core power, prepped for multi-site creators.</p>
            <!-- Fallback value — see Standard Salad's comment above. -->
            <p class="cph-table__pkg-price"><strong data-price="premium_salad" data-monthly="10000">LKR 10,000</strong><span>/month</span></p>
            <p class="cph-table__pkg-billed" data-billed="premium_salad"></p>
          </div>

          <!-- Feature rows — ordered by how much weight buyers give each when
               comparing shared-hosting tiers (site count > space > traffic >
               DBs > mailboxes > the rest); see git log for the research note. -->
          <!-- Websites + Storage stay pinned under the black header once it locks
               into its sticky spot (owner request) — see .cph-table__row--pin-1/
               --pin-2 in css/styles.css and the ResizeObserver note in js/main.js. -->
          <div class="cph-table__label cph-table__row--pin-1">Websites</div>
          <div class="cph-table__val cph-table__row--pin-1">1</div>
          <div class="cph-table__val cph-table__row--pin-1">3</div>
          <div class="cph-table__val cph-table__row--pin-1">10</div>

          <div class="cph-table__label cph-table__row--pin-2">Storage</div>
          <div class="cph-table__val cph-table__row--pin-2">1 GB NVMe</div>
          <div class="cph-table__val cph-table__row--pin-2">9 GB NVMe</div>
          <div class="cph-table__val cph-table__row--pin-2">30 GB NVMe</div>

          <div class="cph-table__label">Bandwidth</div>
          <div class="cph-table__val">20 GB</div>
          <div class="cph-table__val">500 GB</div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unmetered</span></div>

          <div class="cph-table__label">MySQL Databases</div>
          <div class="cph-table__val">2</div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>

          <div class="cph-table__label">Email Accounts</div>
          <div class="cph-table__val">2</div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>

          <div class="cph-table__label">Sub Domains</div>
          <div class="cph-table__val">2</div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>

          <div class="cph-table__label">FTP Accounts</div>
          <div class="cph-table__val">1</div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>

          <div class="cph-table__label">Passenger Applications</div>
          <div class="cph-table__val">2</div>
          <div class="cph-table__val">3</div>
          <div class="cph-table__val">5</div>

          <div class="cph-table__label">Parked Domains</div>
          <div class="cph-table__val"><svg class="cph-table__cross" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-label="Not included"><path d="M5 5l14 14M19 5L5 19"/></svg></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>

          <div class="cph-table__label">Mailing Lists</div>
          <div class="cph-table__val"><svg class="cph-table__cross" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-label="Not included"><path d="M5 5l14 14M19 5L5 19"/></svg></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>
          <div class="cph-table__val cph-table__val--infinity"><span aria-hidden="true">&#8734;</span><span class="sr-only">Unlimited</span></div>

          <!-- "Included with Every Plan" — rows that don't differ by tier,
               grouped the standard way for a hosting feature list: platform →
               guaranteed resources → performance → security → backups →
               apps/dev stack → site builder → support (see git log). Rows show
               either a spec value (Data Center / CPU / RAM) or a check + "Yes".
               Was the pill list that used to sit below the table. -->
          <div class="cph-table__group">Included with Every Plan</div>

          <div class="cph-table__label">cPanel Control Panel</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">Data Center</div>
          <div class="cph-table__val"><img src="/server-salad-cloud-services-web/assets/img/flags/uk-flag.svg" alt="United Kingdom" width="22" height="16" class="cph-table__flag"></div>
          <div class="cph-table__val"><img src="/server-salad-cloud-services-web/assets/img/flags/uk-flag.svg" alt="United Kingdom" width="22" height="16" class="cph-table__flag"></div>
          <div class="cph-table__val"><img src="/server-salad-cloud-services-web/assets/img/flags/uk-flag.svg" alt="United Kingdom" width="22" height="16" class="cph-table__flag"></div>

          <div class="cph-table__label">CPU</div>
          <div class="cph-table__val">2 Cores</div>
          <div class="cph-table__val">2 Cores</div>
          <div class="cph-table__val">2 Cores</div>

          <div class="cph-table__label">RAM</div>
          <div class="cph-table__val">2 GB</div>
          <div class="cph-table__val">2 GB</div>
          <div class="cph-table__val">2 GB</div>

          <div class="cph-table__label">LiteSpeed Web Cache Manager</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">Free SSL</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">cPGuard Security</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">JetBackup</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">WordPress Support</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">Softaculous 1-Click App Installer</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">Python Support</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">Node.js Support</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">Sitejet Website Builder</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>

          <div class="cph-table__label">24/7 Support</div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
          <div class="cph-table__val cph-table__val--yes"><svg class="cph-table__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-12"/></svg><span class="sr-only">Yes</span></div>
        </div>
        <!-- CTA row lives in its OWN grid, seamlessly stacked right under the one
             above with the same columns (see .cph-table--main/.cph-table--cta in
             styles.css), instead of being one more row inside the grid above.
             The grid a sticky child lives in is what bounds how long it can stay
             stuck — with the CTA row still inside that same grid, its bottom
             edge (= the whole grid's bottom edge) was the release point, so the
             header stayed stuck long enough to fully cover the CTA row first and
             only let go once the row had already scrolled past — the buttons
             were never actually visible, just hidden then skipped over. Ending
             the sticky-bounding grid right BEFORE the CTA row instead means the
             header releases the moment the CTA row's top arrives, so it scrolls
             up into view normally like every other row. -->
        <div class="cph-table cph-table--cta">
          <div class="cph-table__label cph-table__label--last"></div>
          <div class="cph-table__btn-cell">
            <a class="btn cph-table__pkg-btn" href="https://hub.serversalad.com" target="_blank" rel="noopener">Order Starter Salad</a>
            <p class="cph-table__pkg-guarantee">14-Day Money Back Guarantee</p>
          </div>
          <div class="cph-table__btn-cell">
            <a class="btn cph-table__pkg-btn" href="https://hub.serversalad.com" target="_blank" rel="noopener">Order Standard Salad</a>
            <p class="cph-table__pkg-guarantee">14-Day Money Back Guarantee</p>
          </div>
          <div class="cph-table__btn-cell cph-table__btn-cell--last">
            <a class="btn cph-table__pkg-btn" href="https://hub.serversalad.com" target="_blank" rel="noopener">Order Premium Salad</a>
            <p class="cph-table__pkg-guarantee">14-Day Money Back Guarantee</p>
          </div>
        </div>
        </div>
        </div>
      </div>
    </section>

    <!-- ===== Features ===== -->
    <section class="cph-features">
      <div class="container cph-features__inner">
        <div class="cph-features__head">
          <h2 class="cph-features__title">Loaded Web Hosting Features</h2>
          <p class="cph-features__subtitle">High-performance, reliable, and secure web hosting built on enterprise cloud infrastructure.</p>
          <div class="cph-features__underline" aria-hidden="true"></div>
        </div>

        <div class="cph-features__grid">
          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/simple-intuitive.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Simple and Intuitive</h3>
            <p class="cph-feature__desc">User-friendly cPanel dashboard makes managing your website, domains, and files effortless with a clean, streamlined interface.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/lightning-fast-hosting.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Lightning-Fast Hosting</h3>
            <p class="cph-feature__desc">LiteSpeed Web Server with server-level caching delivers peak page loading speeds and ultra-responsive performance for your visitors.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/high-base-resources.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">High Base Resources</h3>
            <p class="cph-feature__desc">Powered by multi-core CPUs and generous memory allocation to ensure your web applications run smoothly without resource throttling.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/wordpress-optimized.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">WordPress Optimized</h3>
            <p class="cph-feature__desc">WP Toolkit simplifies staging, cloning, and automated security updates to maintain your WordPress sites at peak performance.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/multiple-php-versions.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Multiple PHP Versions</h3>
            <p class="cph-feature__desc">Easily customize your execution stack by selecting exact PHP versions and required extension modules for your application.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/professional-email-included.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Professional Email Included</h3>
            <p class="cph-feature__desc">Create custom domain email accounts backed by automated spam filtering to keep your business communications secure.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/free-daily-backups.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Free Daily Backups</h3>
            <p class="cph-feature__desc">Automated JetBackup technology creates regular account snapshots, protecting your data with instant 1-click restoration.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/free-ssl-certificates.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Free SSL Certificates</h3>
            <p class="cph-feature__desc">Automated SSL certificates auto-renew for free across all your domains, ensuring complete HTTPS security and traffic encryption.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/one-click-applications.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">One-Click Applications</h3>
            <p class="cph-feature__desc">Softaculous installer allows you to deploy 300+ web applications instantly without manual setup or complex technical configuration.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/free-site-builder.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Free Site Builder</h3>
            <p class="cph-feature__desc">Build responsive websites visually using Sitejet Builder, integrated directly into cPanel with zero coding required.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/seamless-migration.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">Seamless Migration</h3>
            <p class="cph-feature__desc">Our expert migration team handles transferring your existing cPanel account to our platform with zero downtime or data loss.</p>
          </div>

          <div class="cph-feature">
            <span class="cph-feature__icon" style="--feature-icon: url(/server-salad-cloud-services-web/assets/img/features/expert-support.svg)" aria-hidden="true"></span>
            <h3 class="cph-feature__title">24/7 Expert Support</h3>
            <p class="cph-feature__desc">Our technical team is available 24/7 via tickets, email, and WhatsApp to assist with setup, troubleshooting, and optimization.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Why Server Salad / infrastructure ===== -->
    <section class="cph-why">
      <div class="container cph-why__inner">
        <div class="cph-why__top">
          <div class="cph-why__content">
            <span class="cph-why__eyebrow">Why Server Salad</span>
            <h2 class="cph-why__title">Enterprise Cloud Hosting, Built for Performance</h2>
            <div class="cph-why__underline" aria-hidden="true"></div>
            <p class="cph-why__desc">We build our hosting stack from top to bottom with high-speed Samsung NVMe storage, resilient networking, and cPGuard security, managed directly by the engineers who handle your support tickets.</p>
          </div>

          <div class="cph-why__map">
            <div class="cph-why__map-inner">
              <img class="cph-why__map-img" src="/server-salad-cloud-services-web/assets/img/graphics/world-map-dots.png" alt="World map highlighting the Server Salad data center in London, United Kingdom" width="1920" height="1080">
              <span class="cph-why__pin" aria-hidden="true">
                <span class="cph-why__pin-dot"></span>
                <img class="cph-why__pin-flag" src="/server-salad-cloud-services-web/assets/img/flags/uk-flag-circle.png" alt="">
                <span class="cph-why__pin-label">London, UK</span>
              </span>
            </div>
          </div>
        </div>

        <div class="cph-why__grid">
          <div class="cph-why-card">
            <span class="cph-why-card__icon" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-cpanel/samsung-nvme-storage.svg)" aria-hidden="true"></span>
            <h3 class="cph-why-card__title">Samsung NVMe Storage</h3>
            <p class="cph-why-card__desc">Premium Samsung NVMe SSDs deployed across every server, delivering ultra-fast disk reads and peak application speeds.</p>
          </div>

          <div class="cph-why-card">
            <span class="cph-why-card__icon" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-cpanel/uk-datacenter-location.svg)" aria-hidden="true"></span>
            <h3 class="cph-why-card__title">UK Datacenter Location</h3>
            <p class="cph-why-card__desc">Hosted in top-tier UK facilities, providing rock-solid network stability and low-latency global delivery for every visitor.</p>
          </div>

          <div class="cph-why-card">
            <span class="cph-why-card__icon" style="--why-icon: url(/server-salad-cloud-services-web/assets/img/why-cpanel/hands-on-tech-experts.svg)" aria-hidden="true"></span>
            <h3 class="cph-why-card__title">Hands-On Tech Experts</h3>
            <p class="cph-why-card__desc">Support is handled directly in-house by cPanel-certified technicians and system engineers who actively manage the platform.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Business email ===== -->
    <section class="cph-email">
      <div class="container cph-email__inner">
        <div class="cph-email__top">
          <div class="cph-email__visual">
            <svg class="cph-email__art" viewBox="0 0 260 190" fill="none" aria-hidden="true">
              <rect class="cph-email__art-env" x="10" y="20" width="214" height="150" rx="16"/>
              <path class="cph-email__art-line" d="M22 36 117 110 212 36"/>
              <path class="cph-email__art-line" d="M22 152 94 94M212 152 140 94"/>

              <circle class="cph-email__art-badge" cx="214" cy="146" r="36"/>
              <!-- Brief brightness flash on the badge's ring: one blip right as
                   the outgoing mail departs (~5% into the shared 6s cycle) and
                   a second right as the incoming mail lands (~93%) — a separate
                   overlay (rather than animating .cph-email__art-badge's own
                   stroke-width) so it can be hidden outright under
                   prefers-reduced-motion without touching the badge's own
                   static styling. -->
              <circle class="cph-email__art-badge-flash" cx="214" cy="146" r="36" fill="none">
                <animate attributeName="stroke-width" values="0;0;3;0;0;0;3;0" keyTimes="0;0.02;0.05;0.08;0.9;0.93;0.96;1" dur="6s" repeatCount="indefinite"/>
              </circle>
              <circle class="cph-email__art-ping" cx="214" cy="146" r="34">
                <animate attributeName="r" values="30;52" dur="2.8s" repeatCount="indefinite" keyTimes="0;1" calcMode="spline" keySplines="0.2 0.6 0.2 1"/>
                <animate attributeName="opacity" values="0.5;0" dur="2.8s" repeatCount="indefinite" keyTimes="0;1" calcMode="spline" keySplines="0.2 0.6 0.2 1"/>
              </circle>

              <text class="cph-email__art-at" x="214" y="157" text-anchor="middle">@</text>

              <!-- Outgoing mail: a small envelope departs from the @ badge and
                   arcs up and off-canvas, fading out just before it exits —
                   reads as a message being sent. First half of the shared 6s
                   cycle (0-45%); the badge's departure flash above lines up
                   with it leaving. Glyph geometry is centred on its own local
                   origin so the animateMotion path's coordinates become its
                   on-canvas position directly. -->
              <g class="cph-email__art-mail cph-email__art-mail-out">
                <rect x="-10" y="-7" width="20" height="14" rx="2"/>
                <path class="cph-email__art-mail-flap" d="M-10,-7 0,2 10,-7"/>
                <animateMotion path="M214,146 Q256,70 200,-20" keyPoints="0;0;1;1" keyTimes="0;0.03;0.45;1" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.35;0.45;1" dur="6s" repeatCount="indefinite"/>
              </g>

              <!-- Incoming mail: a second envelope arrives from off-canvas
                   upper-left and flies into the badge, fading out right as it
                   "lands" — reads as a new message arriving. Second half of
                   the cycle (55-95%); the badge's arrival flash above lines up
                   with the landing moment. -->
              <g class="cph-email__art-mail cph-email__art-mail-in">
                <rect x="-10" y="-7" width="20" height="14" rx="2"/>
                <path class="cph-email__art-mail-flap" d="M-10,-7 0,2 10,-7"/>
                <animateMotion path="M180,-20 Q140,60 214,146" keyPoints="0;0;1;1" keyTimes="0;0.55;0.95;1" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;0;1;1;1;0;0" keyTimes="0;0.5;0.58;0.85;0.92;0.96;1" dur="6s" repeatCount="indefinite"/>
              </g>
            </svg>
          </div>

          <div class="cph-email__content">
            <h2 class="cph-email__title">Professional Business Email Hosting</h2>
            <div class="cph-email__underline" aria-hidden="true"></div>
            <p class="cph-email__desc">Included across all hosting plans as a complete mail platform, engineered to deliver reliable, secure communication without clutter.</p>
          </div>
        </div>

        <div class="cph-email__grid">
          <div class="cph-email-card">
            <span class="cph-email-card__icon" style="--email-icon: url(/server-salad-cloud-services-web/assets/img/email/webmail-anywhere.svg)" aria-hidden="true"></span>
            <h3 class="cph-email-card__title">Webmail Anywhere</h3>
            <p class="cph-email-card__desc">Access your inbox securely from any modern web browser, optimized for seamless work on desktop and mobile devices.</p>
          </div>

          <div class="cph-email-card">
            <span class="cph-email-card__icon" style="--email-icon: url(/server-salad-cloud-services-web/assets/img/email/desktop-mobile-apps.svg)" aria-hidden="true"></span>
            <h3 class="cph-email-card__title">Desktop &amp; Mobile Apps</h3>
            <p class="cph-email-card__desc">Connect Outlook, Apple Mail, and mobile apps effortlessly using automatic auto-discover settings for instant configuration.</p>
          </div>

          <div class="cph-email-card">
            <span class="cph-email-card__icon" style="--email-icon: url(/server-salad-cloud-services-web/assets/img/email/spam-abuse-defense.svg)" aria-hidden="true"></span>
            <h3 class="cph-email-card__title">Spam &amp; Abuse Defense</h3>
            <p class="cph-email-card__desc">Advanced multi-layered spam filtering blocks unwanted junk and security threats so only legitimate emails reach your main inbox.</p>
          </div>

          <div class="cph-email-card">
            <span class="cph-email-card__icon" style="--email-icon: url(/server-salad-cloud-services-web/assets/img/email/flexible-mailbox-storage.svg)" aria-hidden="true"></span>
            <h3 class="cph-email-card__title">Flexible Mailbox Storage</h3>
            <p class="cph-email-card__desc">Create custom domain mailboxes with generous space allocations designed to handle all your daily business communications.</p>
          </div>

          <div class="cph-email-card">
            <span class="cph-email-card__icon" style="--email-icon: url(/server-salad-cloud-services-web/assets/img/email/sync-across-devices.svg)" aria-hidden="true"></span>
            <h3 class="cph-email-card__title">Sync Across Devices</h3>
            <p class="cph-email-card__desc">Full IMAP synchronization keeps smartphones, tablets, and desktop clients updated in real time across every device.</p>
          </div>

          <div class="cph-email-card">
            <span class="cph-email-card__icon" style="--email-icon: url(/server-salad-cloud-services-web/assets/img/email/forwarders-aliases.svg)" aria-hidden="true"></span>
            <h3 class="cph-email-card__title">Forwarders &amp; Aliases</h3>
            <p class="cph-email-card__desc">Set up unlimited email aliases, automated autoresponders, and custom routing rules configured to fit your exact workflow.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Backups ===== -->
    <section class="cph-backups">
      <div class="container cph-backups__inner">
        <div class="cph-backups__top">
          <div class="cph-backups__content">
            <h2 class="cph-backups__title">Automated Backups You Can Rely On</h2>
            <div class="cph-backups__underline" aria-hidden="true"></div>
            <p class="cph-backups__desc">Daily snapshots managed with JetBackup, off-site storage, and granular recovery, letting you roll back individual files or entire accounts effortlessly.</p>
          </div>

          <div class="cph-backups__visual">
            <!-- Hover the frame: the dashboard screenshot zooms out and blurs
                 away while the real JetBackup logo zooms in from small and
                 sharpens into focus underneath it — a soft cross-dissolve,
                 no hard edges or flip. -->
            <div class="cph-backups__frame">
              <div class="cph-backups__stage">
                <img class="cph-backups__shot" src="/server-salad-cloud-services-web/assets/img/graphics/jetbackup-illustration.png" alt="The JetBackup dashboard showing total backups, account usage, and restore options" width="1195" height="614">
                <img class="cph-backups__logo" src="/server-salad-cloud-services-web/assets/img/graphics/jetbackup-logo.png" alt="" aria-hidden="true">
              </div>
            </div>
          </div>
        </div>

        <div class="cph-backups__grid">
          <div class="cph-backups-card">
            <span class="cph-backups-card__icon" style="--backup-icon: url(/server-salad-cloud-services-web/assets/img/backups/backed-up-daily.svg)" aria-hidden="true"></span>
            <h3 class="cph-backups-card__title">Automated Daily Backups</h3>
            <p class="cph-backups-card__desc">Your entire account is backed up automatically every day, keeping your site data protected without manual effort.</p>
          </div>

          <div class="cph-backups-card">
            <span class="cph-backups-card__icon" style="--backup-icon: url(/server-salad-cloud-services-web/assets/img/backups/retention-window.svg)" aria-hidden="true"></span>
            <h3 class="cph-backups-card__title">30-Day Retention Window</h3>
            <p class="cph-backups-card__desc">Roll back across a rolling 30-day retention window whenever you need to restore a previous site version.</p>
          </div>

          <div class="cph-backups-card">
            <span class="cph-backups-card__icon" style="--backup-icon: url(/server-salad-cloud-services-web/assets/img/backups/off-site-storage.svg)" aria-hidden="true"></span>
            <h3 class="cph-backups-card__title">Secure Off-Site Storage</h3>
            <p class="cph-backups-card__desc">Backup snapshots are safely stored in off-site cloud vaults, keeping your data isolated from local server issues.</p>
          </div>

          <div class="cph-backups-card">
            <span class="cph-backups-card__icon" style="--backup-icon: url(/server-salad-cloud-services-web/assets/img/backups/granular-restore.svg)" aria-hidden="true"></span>
            <h3 class="cph-backups-card__title">Granular File Restores</h3>
            <p class="cph-backups-card__desc">Perform precise restores for individual files, databases, or mailboxes without disturbing the rest of your site.</p>
          </div>

          <div class="cph-backups-card">
            <span class="cph-backups-card__icon" style="--backup-icon: url(/server-salad-cloud-services-web/assets/img/backups/snapshot-backups.svg)" aria-hidden="true"></span>
            <h3 class="cph-backups-card__title">On-Demand Snapshots</h3>
            <p class="cph-backups-card__desc">Create an instant manual snapshot of your site at any moment before testing updates or making major changes.</p>
          </div>

          <div class="cph-backups-card">
            <span class="cph-backups-card__icon" style="--backup-icon: url(/server-salad-cloud-services-web/assets/img/backups/powered-by-jetbackup.svg)" aria-hidden="true"></span>
            <h3 class="cph-backups-card__title">Powered by JetBackup</h3>
            <p class="cph-backups-card__desc">Driven by industry-standard JetBackup technology to deliver ultra-fast recovery speeds and reliable site restoration.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Security in depth ===== -->
    <section class="cph-security">
      <div class="container cph-security__inner">
        <div class="cph-security__head">
          <h2 class="cph-security__title">Security in Depth</h2>
          <p class="cph-security__subtitle">Layered defense from the network edge to the application layer, protecting your infrastructure at every level.</p>
          <div class="cph-security__underline" aria-hidden="true"></div>
        </div>

        <div class="cph-security__grid">
          <div class="cph-security-card">
            <span class="cph-security-card__icon" style="--security-icon: url(/server-salad-cloud-services-web/assets/img/security/network-level-ddos-mitigation.svg)" aria-hidden="true"></span>
            <h3 class="cph-security-card__title">Network-Level DDoS Mitigation</h3>
            <p class="cph-security-card__desc">Incoming traffic is scrubbed at the network edge to mitigate DDoS attacks before they reach your site.</p>
          </div>

          <div class="cph-security-card">
            <span class="cph-security-card__icon" style="--security-icon: url(/server-salad-cloud-services-web/assets/img/security/cpguard-malware-defence.svg)" aria-hidden="true"></span>
            <h3 class="cph-security-card__title">cPGuard &amp; Malware Defense</h3>
            <p class="cph-security-card__desc">Real-time malware scanning and automated cleanup protect your file system from malicious security threats.</p>
          </div>

          <div class="cph-security-card">
            <span class="cph-security-card__icon" style="--security-icon: url(/server-salad-cloud-services-web/assets/img/security/waf-application-firewall.svg)" aria-hidden="true"></span>
            <h3 class="cph-security-card__title">Web Application Firewall (WAF)</h3>
            <p class="cph-security-card__desc">Layered WAF rules block malicious traffic and common web exploits before they reach your application code.</p>
          </div>

          <div class="cph-security-card">
            <span class="cph-security-card__icon" style="--security-icon: url(/server-salad-cloud-services-web/assets/img/security/cloudlinux-isolation.svg)" aria-hidden="true"></span>
            <h3 class="cph-security-card__title">CloudLinux Account Isolation</h3>
            <p class="cph-security-card__desc">CageFS environment isolation prevents resource contention and insulates your account from adjacent user activity.</p>
          </div>

          <div class="cph-security-card">
            <span class="cph-security-card__icon" style="--security-icon: url(/server-salad-cloud-services-web/assets/img/security/encryption-access-control.svg)" aria-hidden="true"></span>
            <h3 class="cph-security-card__title">Encryption &amp; Access Control</h3>
            <p class="cph-security-card__desc">Features free Let&rsquo;s Encrypt SSL, encrypted cPanel and mail protocols, two-factor authentication (2FA), and IP allowlisting.</p>
          </div>

          <div class="cph-security-card">
            <span class="cph-security-card__icon" style="--security-icon: url(/server-salad-cloud-services-web/assets/img/security/iso-grade-datacentres.svg)" aria-hidden="true"></span>
            <h3 class="cph-security-card__title">ISO-Certified Datacenters</h3>
            <p class="cph-security-card__desc">Hosted in facilities with biometric security, CCTV surveillance, and N+1 power and cooling redundancy.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Works with your workflow ===== -->
    <section class="cph-workflow">
      <div class="container cph-workflow__inner">
        <div class="cph-workflow__head">
          <h2 class="cph-workflow__title">Works With Your Workflow</h2>
          <p class="cph-workflow__subtitle">Connect existing domains, deploy via FTP or Git, and install hundreds of web applications in one click.</p>
          <div class="cph-workflow__underline" aria-hidden="true"></div>
        </div>

        <div class="cph-workflow__grid">
          <div class="cph-workflow-card">
            <span class="cph-workflow-card__icon" style="--workflow-icon: url(/server-salad-cloud-services-web/assets/img/workflow/use-any-domain.svg)" aria-hidden="true"></span>
            <h3 class="cph-workflow-card__title">Flexible Domain Management</h3>
            <p class="cph-workflow-card__desc">Point DNS records from any domain registrar, transfer your domain seamlessly, or keep your registration elsewhere.</p>
          </div>

          <div class="cph-workflow-card">
            <span class="cph-workflow-card__icon" style="--workflow-icon: url(/server-salad-cloud-services-web/assets/img/workflow/ftp-sftp-git.svg)" aria-hidden="true"></span>
            <h3 class="cph-workflow-card__title">FTP, SFTP &amp; Git Access</h3>
            <p class="cph-workflow-card__desc">Upload files via SFTP or FTP, utilize SSH command-line access, and deploy code directly using cPanel Git Version Control.</p>
          </div>

          <div class="cph-workflow-card">
            <span class="cph-workflow-card__icon" style="--workflow-icon: url(/server-salad-cloud-services-web/assets/img/workflow/one-click-apps.svg)" aria-hidden="true"></span>
            <h3 class="cph-workflow-card__title">300+ One-Click Applications</h3>
            <p class="cph-workflow-card__desc">Deploy WordPress, Joomla, OpenCart, and hundreds of scripts instantly using the Softaculous installer.</p>
          </div>

          <div class="cph-workflow-card">
            <span class="cph-workflow-card__icon" style="--workflow-icon: url(/server-salad-cloud-services-web/assets/img/workflow/sitepro-ai-builder.svg)" aria-hidden="true"></span>
            <h3 class="cph-workflow-card__title">Site.pro AI Builder</h3>
            <p class="cph-workflow-card__desc">Build custom websites, landing pages, or online stores effortlessly using Site.pro AI tools, included as standard.</p>
          </div>

          <div class="cph-workflow-card">
            <span class="cph-workflow-card__icon" style="--workflow-icon: url(/server-salad-cloud-services-web/assets/img/workflow/sitejet-ai-builder.svg)" aria-hidden="true"></span>
            <h3 class="cph-workflow-card__title">Sitejet Builder Suite</h3>
            <p class="cph-workflow-card__desc">Create fully responsive, high-performance web pages visually using Sitejet Builder, integrated directly into cPanel.</p>
          </div>

          <div class="cph-workflow-card">
            <span class="cph-workflow-card__icon" style="--workflow-icon: url(/server-salad-cloud-services-web/assets/img/workflow/temporary-preview-url.svg)" aria-hidden="true"></span>
            <h3 class="cph-workflow-card__title">Temporary Preview URLs</h3>
            <p class="cph-workflow-card__desc">Develop and preview your site live on target servers using temporary preview URLs before updating production DNS.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Migration (same section as the homepage's — shared .migration*
         classes in css/styles.css, no page-specific CSS needed) ===== -->
    <section class="migration">
      <div class="container migration__inner">
        <div class="migration__top">
          <div class="migration__content">
            <span class="migration__eyebrow">Hassle-Free Migration</span>
            <h2 class="migration__title">Effortless cPanel Transfer</h2>
            <div class="migration__underline" aria-hidden="true"></div>
            <p class="migration__desc">Switching to Server Salad is completely simple. Our technical team securely transfers your full cPanel account via native system APIs, ensuring total data integrity, complete account accuracy, and zero migration fees.</p>
          </div>

          <div class="migration__visual" aria-hidden="true">
            <div class="migration__box">
              <span class="migration__box-label">Your current host</span>
              <span class="migration__bar"></span>
              <span class="migration__bar migration__bar--mid"></span>
              <span class="migration__bar migration__bar--short"></span>
            </div>

            <svg class="migration__arrow" viewBox="0 0 130 70" fill="none">
              <path id="migrationPathCph" class="migration__arrow-path" d="M4 46C30 12 78 8 118 26" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round"/>
              <path d="M108 17l12 9-13 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- File "packet" that rides the dashed path from the old host to Server Salad -->
              <g class="migration__packet">
                <rect x="-5" y="-6.5" width="10" height="13" rx="2" fill="#1b2427" stroke="#f57e20" stroke-width="1.5"/>
                <path d="M-2.5-3h5M-2.5 0h5M-2.5 3h3" stroke="#f57e20" stroke-width="1.2" stroke-linecap="round"/>
                <animateMotion dur="2.6s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1" keyTimes="0;1">
                  <mpath href="#migrationPathCph" xlink:href="#migrationPathCph"/>
                </animateMotion>
                <animate attributeName="opacity" dur="2.6s" repeatCount="indefinite"
                         values="0;1;1;1;0" keyTimes="0;0.12;0.5;0.85;1"/>
              </g>
            </svg>

            <div class="migration__box migration__box--ours">
              <span class="migration__box-label">Server Salad</span>
              <span class="migration__tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5"/>
                </svg>
              </span>
              <span class="migration__box-note">NVMe cloud</span>
            </div>
          </div>
        </div>

        <div class="migration__grid">
          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/cpanel-account-move-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Free &amp; Complete<br>cPanel Account Move</h3>
            <p class="migration-card__desc">We transfer your entire cPanel account from your previous host at zero additional cost, handling all technical work for you.</p>
          </div>

          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/api-transfers-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Automated &amp; Secure<br>API Transfers</h3>
            <p class="migration-card__desc">Migrations execute directly through secure system APIs, keeping your website files, databases, and DNS configurations intact.</p>
          </div>

          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/quick-request-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Quick &amp; Simple<br>Request Process</h3>
            <p class="migration-card__desc">Submit your migration request in seconds without filling out complicated technical forms or dealing with tedious back-and-forth.</p>
          </div>

          <div class="migration-card">
            <span class="migration-card__icon">
              <span class="migration-card__icon-img" style="--migration-icon: url(/server-salad-cloud-services-web/assets/img/migration/email-retention-icon.svg)" aria-hidden="true"></span>
            </span>
            <h3 class="migration-card__title">Complete Data &amp;<br>Email Retention</h3>
            <p class="migration-card__desc">All mailboxes, saved emails, and account credentials transfer over seamlessly without requiring manual re-configuration.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Technical Overview ===== -->
    <section class="cph-overview">
      <div class="container cph-overview__inner">
        <div class="cph-overview__head">
          <h2 class="cph-overview__title">Technical Overview</h2>
          <div class="cph-overview__underline" aria-hidden="true"></div>
        </div>

        <div class="cph-overview__columns">
          <div class="cph-overview__col">
            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Key Features:</h3>
              <ul class="cph-overview__list">
                <li><span>Samsung NVMe Cloud Storage</span></li>
                <li><span>Free SSL certificates</span></li>
                <li><span>Litespeed with LSCache</span></li>
                <li><span>Free hourly backups for 90 days</span></li>
                <li><span>Cloudflare CDN Integration</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">File Management:</h3>
              <ul class="cph-overview__list">
                <li><span>File Manager</span></li>
                <li><span>FTP / SFTP Access</span></li>
                <li><span>SSH Access</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Domain Management:</h3>
              <ul class="cph-overview__list">
                <li><span>Addon Domains</span></li>
                <li><span>Alias / Reference Domains</span></li>
                <li><span>Redirection Management</span></li>
                <li><span>DNS Zone Editor</span></li>
                <li><span>Temporary Preview URL</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Database Management:</h3>
              <ul class="cph-overview__list">
                <li><span>MySQL / MariaDB 10.3+</span></li>
                <li><span>PHPMyAdmin</span></li>
                <li><span>Remote MySQL Connectivity</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Security and Protection:</h3>
              <ul class="cph-overview__list">
                <li><span>DDoS Protection</span></li>
                <li><span>cpGuard Security / Firewall</span></li>
                <li><span>Whitelist from our Client Area</span></li>
                <li><span>Greylist-first technology</span></li>
                <li><span>Web Application Firewall</span></li>
                <li><span>Free 256-bit SSL Certificates</span></li>
                <li><span>Real-time malware removal</span></li>
                <li><span>Encrypted cPanel and Email Access</span></li>
                <li><span>Cloudlinux OS Isolation / Caging</span></li>
                <li><span>Password Protected Directories</span></li>
                <li><span>Restrict Access by IP Address</span></li>
                <li><span>Two-Factor Authentication</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Server Specification:</h3>
              <ul class="cph-overview__list">
                <li><span>Enterprise-Grade CPUs</span></li>
                <li><span>Cloud Redundant Storage</span></li>
                <li><span>Samsung NVMe Storage</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Technical Support:</h3>
              <ul class="cph-overview__list">
                <li><span>Fully-managed infrastructure</span></li>
                <li><span>Ticket and Email Support - 24/7/365</span></li>
                <li><span>Chat Support (Sri Lankan Working Hours)</span></li>
                <li><span>Extensive Knowledgebase</span></li>
                <li><span>cPanel Certified Engineers</span></li>
                <li><span>WordPress Experts</span></li>
              </ul>
            </div>
          </div>

          <div class="cph-overview__col">
            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Unlimited Features:</h3>
              <ul class="cph-overview__list">
                <li><span>Unlimited 100% NVMe Storage</span></li>
                <li><span>Unlimited Bandwidth</span></li>
                <li><span>Unlimited Free SSL Certificates</span></li>
                <li><span>Unlimited Hosting Packages</span></li>
                <li><span>Unlimited MySQL Databases</span></li>
                <li><span>Unlimited Email Accounts</span></li>
                <li><span>Unlimited Addon and Subdomains</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Email Features:</h3>
              <ul class="cph-overview__list">
                <li><span>Unlimited Mailboxes</span></li>
                <li><span>Multiple Webmail Interfaces</span></li>
                <li><span>Auto-Discover Support</span></li>
                <li><span>Adjustable Mailbox Quota</span></li>
                <li><span>Email Forwarding</span></li>
                <li><span>Remote Email Routing</span></li>
                <li><span>Auto Responders</span></li>
                <li><span>Default Email Addresses / Catch-all</span></li>
                <li><span>Delivery Diagnostics Interface</span></li>
                <li><span>Email Filters (Global and Per-Mailbox)</span></li>
                <li><span>POP3 / IMAP Compatible</span></li>
                <li><span>Optional Mail Encryption</span></li>
                <li><span>Mailbox Disk Usage Management</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Software:</h3>
              <ul class="cph-overview__list">
                <li><span>Free Website Builder (Site.Pro)</span></li>
                <li><span>Softaculous Auto-Installer (300+ Apps)</span></li>
                <li><span>Website Preview / Temporary URL</span></li>
                <li><span>PHP X-Ray for Bottleneck Diagnosis</span></li>
                <li><span>Latest Stable cPanel</span></li>
                <li><span>PHP Version Selector (5.6 - 8.5)</span></li>
                <li><span>Git Integration</span></li>
                <li><span>Ruby, Perl and Python Selector</span></li>
                <li><span>Litespeed and LSCache</span></li>
                <li><span>Scheduled Tasks / Crons</span></li>
                <li><span>Full mod_rewrite Support</span></li>
                <li><span>AWStats Analytics / Visitor Tracking</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Datacentre:</h3>
              <ul class="cph-overview__list">
                <li><span>24/7 CCTV Security</span></li>
                <li><span>Biometric access control</span></li>
                <li><span>N+1 power and cooling</span></li>
              </ul>
            </div>

            <div class="cph-overview__group">
              <h3 class="cph-overview__group-title">Web Applications:</h3>
              <ul class="cph-overview__list">
                <li><span>WordPress</span></li>
                <li><span>Drupal</span></li>
                <li><span>OpenCart</span></li>
                <li><span>Joomla</span></li>
                <li><span>WHMCS</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Sustainability (same section as the homepage's — shared .eco*
         classes in css/styles.css, no page-specific CSS needed) ===== -->
    <section class="eco">
      <div class="eco__photo" aria-hidden="true"></div>
      <div class="eco__bg" aria-hidden="true"></div>
      <div class="container eco__inner">
        <div class="eco__content">
          <span class="eco__label">100% Renewable Energy</span>
          <h2 class="eco__title">Sustainable Hosting Powered by <span class="eco__title-accent">100% Green Energy</span></h2>
          <div class="eco__underline" aria-hidden="true"></div>
          <p class="eco__desc">Power your website on enterprise European infrastructure running on 100% renewable energy. Our infrastructure partners fund tree planting and climate projects through <a class="eco__link" href="https://ecologi.com/" target="_blank" rel="noopener">Ecologi</a>, ensuring every Server Salad account directly supports global reforestation while delivering maximum speed with zero carbon compromise.</p>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer is a shared partial (partials/footer.html), injected by js/main.js. -->
  <div id="site-footer"></div>

  <script src="/server-salad-cloud-services-web/js/main.js?v=22"></script>
</body>
</html>
```

### B.7 `discount-programs/index.html`
Third page. Same `<head>` pattern as the other two pages (title/favicon/
fonts/stylesheet, all root-relative), folder-with-`index.html` so the URL is
`/server-salad-cloud-services-web/discount-programs/`. Reached from the main
nav's **Discount Programs▾** mega-menu (see C.1) — each of its 3 cards links
here with a `#hash` matching one tab's `data-hash` below, so landing on the
page opens straight on that card's own tab (see B.2's `applyDiscountHash`)
instead of always defaulting to the first one.

Structure, top to bottom: a centred hero (duplicated from cpanel-hosting's
`.cph-hero` markup, no product-screenshot visual — see the in-file comment),
then one `.discount-tabs` section holding a 3-tab switcher (Student &
Academic / Startup / Agency & Freelancer) and their 3 panels. Each panel has
a subtitle + description + plain-text "Eligibility Criteria" caption (not a
link — see C.20), then a 6-card grid of eligibility-criteria boxes. The
criteria cards currently hold **sample placeholder text** — the owner will
supply the real eligibility requirements per program; swap the
`.discount-tabs__criteria-desc` text in each card when that copy arrives,
don't restructure the grid. See C.20 for the full design rationale (tab
switcher, per-panel alignment, font-inspector overrides, criteria-grid
geometry).
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Salad Cloud Services</title>

  <link rel="icon" type="image/svg+xml" href="/server-salad-cloud-services-web/assets/img/brand/serversalad-favicon.svg">

  <!-- Fonts: Poppins (headings) + Inter (body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&family=Inter:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/server-salad-cloud-services-web/css/styles.css?v=346">
</head>
<body>

  <!-- Topbar + nav are a shared partial (partials/header.html), injected by
       js/main.js so every page shares the same markup from one file. -->
  <div id="site-header"></div>

  <main>
    <!-- ===== Hero =====
         Duplicated from cpanel-hosting/index.html's hero (same .cph-hero*
         classes) per owner request, as a starting point — copy still says
         "cPanel Hosting" and will need real Discount Programs copy once the
         owner supplies it. No product-screenshot visual for this page (owner
         request), so .cph-hero__inner--centered collapses the two-column
         grid to one centred column instead of leaving an empty, lopsided
         second column — see css/styles.css. -->
    <section class="cph-hero">
      <div class="cph-hero__bg" aria-hidden="true"></div>

      <div class="container cph-hero__inner cph-hero__inner--centered">
        <div class="cph-hero__content">
          <h1 class="cph-hero__title">Discount <span class="cph-hero__title-accent">Programs</span></h1>
          <div class="cph-hero__underline" aria-hidden="true"></div>
          <p class="cph-hero__desc">High-performance cloud hosting engineered for tomorrow's builders. We offer specialized hosting discounts to lower financial barriers for verified students, early-stage startups, and client-focused web agencies. Deploy on enterprise infrastructure with zero long-term commitments.</p>
        </div>
      </div>
    </section>

    <!-- ===== Discount Programs: tab switcher =====
         Per owner reference: 3 tabs, the active one showing a gradient
         underline (see css/styles.css); clicking a tab swaps the panel
         below it (see js/main.js). Started with "01."/"02."/"03." numbering
         prefixes (matching the reference image) — removed per owner
         request, tabs are plain labels now. Panel sub-headings/descriptions
         are owner-supplied real copy (replaced an earlier draft reusing the
         mega-menu's shorter one-line descriptions). -->
    <section class="discount-tabs">
      <div class="container discount-tabs__bar" role="tablist">
        <button class="discount-tabs__tab is-active" type="button" role="tab" id="discount-tab-1" aria-selected="true" aria-controls="discount-panel-1" data-tab="1" data-hash="student-academic">
          <span class="discount-tabs__label">Student &amp; Academic</span>
        </button>
        <button class="discount-tabs__tab" type="button" role="tab" id="discount-tab-2" aria-selected="false" aria-controls="discount-panel-2" data-tab="2" data-hash="startup" tabindex="-1">
          <span class="discount-tabs__label">Startup</span>
        </button>
        <button class="discount-tabs__tab" type="button" role="tab" id="discount-tab-3" aria-selected="false" aria-controls="discount-panel-3" data-tab="3" data-hash="agency-freelancer" tabindex="-1">
          <span class="discount-tabs__label">Agency &amp; Freelancer</span>
        </button>
      </div>

      <div class="container">
        <div class="discount-tabs__panel is-active" id="discount-panel-1" role="tabpanel" aria-labelledby="discount-tab-1" data-panel="1">
          <div class="discount-tabs__panel-body">
            <h3 class="discount-tabs__panel-subtitle">Discounted Hosting for Students &amp; Academic Clubs.</h3>
            <p class="discount-tabs__panel-desc">Subsidized rates on select hosting plans for recognized school and university students, as well as academic clubs and student societies. Build portfolio projects, launch student organization portals, and deploy on reliable cPanel infrastructure with minimal friction.</p>
            <span class="discount-tabs__panel-eligibility">Eligibility Criteria</span>
          </div>
          <!-- Sample placeholder text — owner will replace with the real
               eligibility criteria for this program. -->
          <div class="discount-tabs__criteria-grid">
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 1 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 2 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 3 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 4 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 5 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 6 — replace with a real eligibility requirement.</p></div>
          </div>
        </div>
        <div class="discount-tabs__panel" id="discount-panel-2" role="tabpanel" aria-labelledby="discount-tab-2" data-panel="2" hidden>
          <div class="discount-tabs__panel-body">
            <h3 class="discount-tabs__panel-subtitle">Reduced Infrastructure Costs for New Businesses.</h3>
            <p class="discount-tabs__panel-desc">Special pricing on select hosting plans engineered specifically for newly established businesses. Launch your web presence with lower day-one overhead while maintaining high performance, automated backups, and total stability.</p>
            <span class="discount-tabs__panel-eligibility">Eligibility Criteria</span>
          </div>
          <!-- Sample placeholder text — owner will replace with the real
               eligibility criteria for this program. -->
          <div class="discount-tabs__criteria-grid">
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 1 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 2 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 3 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 4 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 5 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 6 — replace with a real eligibility requirement.</p></div>
          </div>
        </div>
        <div class="discount-tabs__panel" id="discount-panel-3" role="tabpanel" aria-labelledby="discount-tab-3" data-panel="3" hidden>
          <div class="discount-tabs__panel-body">
            <h3 class="discount-tabs__panel-subtitle">Discounted cPanel Plans for Client Developers.</h3>
            <p class="discount-tabs__panel-desc">Purpose-built hosting incentives for freelancers and web agencies managing websites on behalf of their clients. Scale your client portfolio with discounted cPanel packages designed to maximize your profit margins and simplify site management.</p>
            <span class="discount-tabs__panel-eligibility">Eligibility Criteria</span>
          </div>
          <!-- Sample placeholder text — owner will replace with the real
               eligibility criteria for this program. -->
          <div class="discount-tabs__criteria-grid">
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 1 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 2 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 3 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 4 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 5 — replace with a real eligibility requirement.</p></div>
            <div class="discount-tabs__criteria-card"><p class="discount-tabs__criteria-desc">Sample criterion 6 — replace with a real eligibility requirement.</p></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer is a shared partial (partials/footer.html), injected by js/main.js so
       every page includes the same markup from one file. See README "Footer" notes. -->
  <div id="site-footer"></div>

  <script src="/server-salad-cloud-services-web/js/main.js?v=22"></script>
</body>
</html>
```

### B.8 `api/pricing.php`
The one server-side file in the project. Read-only: returns just the 3 plan
prices as JSON, nothing else from the table.

> ⚠️ **Security note on this embed:** the real file on disk has actual
> production DB credentials hardcoded as the `getenv()` fallback (see A.3 —
> Apache executes `.php` rather than serving its source, so this isn't
> downloadable as plain text the way a `.env` would be). The `user`/`pass`/
> `db` values below are **redacted** in this README specifically — even
> though the real file is already tracked in the repo, duplicating a live
> password into a documentation file that's more likely to be shared/read
> casually isn't worth the extra exposure surface. Get the real values from
> the live `api/pricing.php` file itself, never from this document.

```php
<?php
/**
 * Live pricing API for the cPanel Hosting page's plan table.
 *
 * This is the ONLY server-side code in the project — everything else is static
 * HTML/CSS/JS. Exists only because a browser cannot query MySQL directly, and DB
 * credentials must never reach client-side code (see README "Stack" and
 * "Pricing API" for the full reasoning).
 *
 * Read-only. Returns ONLY the 3 plan prices as JSON — nothing else from the
 * `cpanel_package_pricing` table (e.g. `discount`, `edu_support_discount`) is
 * exposed here; their display logic hasn't been confirmed yet (see README
 * "Open items" — don't add them to the SELECT/response until that's settled).
 *
 * Credentials live here, in a .php file, deliberately — Apache executes .php
 * files rather than serving their source, so this is not downloadable as plain
 * text the way a .env/.json config file placed under htdocs would be. Never move
 * these into any file the browser can fetch directly.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store'); // pricing must always be fetched fresh, per "real time" requirement
header('Access-Control-Allow-Origin: https://serversalad.com'); // adjust if the real production domain differs

// This site currently runs locally via XAMPP (not yet deployed to the real
// serversalad.com hosting), so the fallback must point at the DB's real remote
// host — 'serversalad.com' — for local testing to actually reach it (owner
// enabled Remote MySQL access for this dev machine's IP). IMPORTANT: once this
// project is deployed onto serversalad.com itself, MySQL becomes local to that
// same server (per the phpMyAdmin screenshot showing "Server: localhost:3306",
// taken from inside production) — at that point this hardcoded fallback should
// change to 'localhost', or better, set SS_DB_HOST=localhost as a real
// environment variable on that server so this line never needs editing again.
$host    = getenv('SS_DB_HOST') ?: 'serversalad.com';
$user    = getenv('SS_DB_USER') ?: '<REDACTED — see the live api/pricing.php file on disk, not duplicated here>';
$pass    = getenv('SS_DB_PASS') ?: '<REDACTED — see the live api/pricing.php file on disk, not duplicated here>';
$db      = getenv('SS_DB_NAME') ?: '<REDACTED — see the live api/pricing.php file on disk, not duplicated here>';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $stmt = $pdo->query(
        'SELECT package_name, price_in_lkr_month FROM cpanel_package_pricing'
    );

    $byName = [];
    foreach ($stmt as $row) {
        $byName[$row['package_name']] = (float) $row['price_in_lkr_month'];
    }

    echo json_encode([
        'ok' => true,
        'prices' => [
            'starter_salad'  => $byName['starter_salad']  ?? null,
            'standard_salad' => $byName['standard_salad'] ?? null,
            'premium_salad'  => $byName['premium_salad']  ?? null,
        ],
    ]);
} catch (Throwable $e) {
    // Never echo $e->getMessage() here — a PDO exception can include the DSN,
    // hostname, or other schema details that shouldn't reach the client.
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'pricing_unavailable']);
}
```

**Database schema** (table `cpanel_package_pricing`, in DB `serversa_website_data`):

| Column | Type | Used? |
|---|---|---|
| `package_name` | e.g. `starter_salad` / `standard_salad` / `premium_salad` | Yes — the lookup key |
| `price_in_lkr_month` | numeric monthly price in LKR | Yes — the only value the API returns |
| `discount` | — | **Not used.** Display logic unconfirmed — don't wire it in without asking (see Open Items) |
| `edu_support_discount` | — | **Not used.** Same caveat |

**Front-end wiring** (`js/main.js`, see B.2): every `[data-price]` element on
either page fetches from this same endpoint on load, keeps a `data-monthly`
fallback so pricing never goes blank if the API is down, and the Monthly/
Annually toggle on the cpanel-hosting page computes annual figures
client-side (year total = monthly × 10, since the DB only stores one monthly
figure) rather than needing a second DB column.

### B.9 Assets manifest
Every image referenced in B.5/B.6, where it lives, and what it is. Section
icon SVGs (all folders except `apps/`, `brand/`, `flags/`, `graphics/`,
`partners/`, `photos/`, `reviews/`) are single-colour, saved with
`fill="currentColor"`, and recoloured in CSS via `mask` + `background-color`
(see the masked-icon comment repeated throughout B.1's CSS) — never edit the
SVG file to change colour, change the CSS custom property or the class's
`color`/`background-color` instead.

| Path | Purpose |
|---|---|
| `brand/serversalad-logo.png` | Nav logo, icon-only (cloche + servers), 46px, 9px radius |
| `brand/serversalad-logo-full.png` | Footer logo, icon + "SERVERSALAD" wordmark |
| `brand/serversalad-favicon.svg` | Favicon, every page |
| `photos/eco-forest-canopy.jpg` | Sustainability section background photo (~8MB, unoptimised — worth compressing before launch) |
| `graphics/world-map-dots.png` | 1920×1080 dotted world map — homepage Locations (full) + cph Why Server Salad (smaller, same London pin coords `left:46.5%; top:37%`) |
| `graphics/jetbackup-illustration.png` | JetBackup dashboard screenshot, cph Backups section — **must be Server Salad's own panel**, confirm before launch |
| `graphics/jetbackup-logo.png` | The real JetBackup wordmark (orange, transparent bg) — cropped/downscaled from an owner-supplied source via `downloads/` (see A.5). Revealed on hover of the dashboard screenshot in cph Backups (see C.14) |
| `graphics/cpanel-dashboard-devices.webp` | Real cPanel screenshot on desktop/tablet/phone frames, cph hero |
| `partners/partners-{jetbackup,cloudlinux,litespeed,softaculous,cpanel,letsencrypt}.png` | Hero "powered by" carousel, forced white via CSS `filter: brightness(0) invert(1)` |
| `flags/uk-flag.svg` | Flat rect UK flag — cph comparison table (Data Center row ×3, intro-cell badge) |
| `flags/uk-flag-circle.png` | Round UK flag badge — homepage Locations hover card |
| `hero/cpanel-hosting-icon.svg` | Hero card + Plans card + Web Hosting▾ mega-menu card icon (same file, reused everywhere this product appears) |
| `hero/cpanel-business-hosting-icon.svg` | Same reuse pattern as above, Business Hosting |
| `hero/vps-hosting-icon.svg` | Hero card only |
| `hero/domains-icon.svg` | Hero card only |
| `why-choose/expert-support-icon.svg` | "Free 24/7 Expert Support" |
| `why-choose/live-help-sessions-icon.svg` | "Saturday Live Help Sessions" |
| `why-choose/licensed-software-icon.svg` | "100% Licensed Software" |
| `why-choose/community-perks-icon.svg` | "Creator & Community Perks" (stroke-based, the one exception to fill-based icons) |
| `why-choose/cpguard-security-icon.svg` | "Advanced CPGuard Security" |
| `why-choose/european-power-icon.svg` | "Local Care, European Power" |
| `reviews/google-logo.png` / `reviews/trustpilot-logo.png` | Review buttons, plain `<img>` not masked |
| `migration/cpanel-account-move-icon.svg` | "Free & Complete cPanel Account Move" |
| `migration/api-transfers-icon.svg` | "Automated & Secure API Transfers" |
| `migration/quick-request-icon.svg` | "Quick & Simple Request Process" |
| `migration/email-retention-icon.svg` | "Complete Data & Email Retention" |
| `cloud/enterprise-infrastructure-icon.svg` | "Enterprise Cloud Infrastructure" |
| `cloud/nvme-storage-icon.svg` | "Samsung Enterprise NVMe Storage" |
| `cloud/cpguard-protection-icon.svg` | "Full Protection With cPGuard" |
| `cloud/amd-epyc-cpu-icon.svg` | "Powered By AMD EPYC™ CPUs" |
| `cloud/litespeed-icon.svg` | "Lightning Fast With LiteSpeed" |
| `cloud/cloudlinux-reliability-icon.svg` | "CloudLinux OS Reliability" |
| `footer/phone-icon.svg`, `footer/email-icon.svg` | Footer contact lines |
| `footer/facebook-icon.svg`, `footer/linkedin-icon.svg`, `footer/instagram-icon.svg` | Footer social row (Instagram is stroke-based, other two solid-fill — matches each platform's real logo style) |
| `footer/learn-more-heart-icon.svg` | Footer "Learn more about us" button |
| `nav/mouse-pointer-icon.svg` | Web Hosting▾ mega-menu app-logos link |
| `apps/{wordpress,joomla,drupal,moodle,phpmyadmin,akaunting,orangehrm}-logo.svg` | Mega-menu app strip — kept in real brand colours, **not** masked |
| `features/simple-intuitive.svg` | "Simple and Intuitive" |
| `features/lightning-fast-hosting.svg` | "Lightning-Fast Hosting" |
| `features/high-base-resources.svg` | "High Base Resources" |
| `features/wordpress-optimized.svg` | "WordPress Optimized" |
| `features/multiple-php-versions.svg` | "Multiple PHP Versions" |
| `features/professional-email-included.svg` | "Professional Email Included" |
| `features/free-daily-backups.svg` | "Free Daily Backups" (cph Features) |
| `features/free-ssl-certificates.svg` | "Free SSL Certificates" (cph Features) |
| `features/one-click-applications.svg` | "One-Click Applications" |
| `features/free-site-builder.svg` | "Free Site Builder" |
| `features/seamless-migration.svg` | "Seamless Migration" |
| `features/expert-support.svg` | "24/7 Expert Support" |
| `why-cpanel/samsung-nvme-storage.svg` | "Samsung NVMe Storage" (cph Why Server Salad — folder named distinctly from the homepage's `why-choose/`, see A.5) |
| `why-cpanel/uk-datacenter-location.svg` | "UK Datacenter Location" |
| `why-cpanel/hands-on-tech-experts.svg` | "Hands-On Tech Experts" |
| `email/webmail-anywhere.svg` | "Webmail Anywhere" |
| `email/desktop-mobile-apps.svg` | "Desktop & Mobile Apps" |
| `email/spam-abuse-defense.svg` | "Spam & Abuse Defense" |
| `email/flexible-mailbox-storage.svg` | "Flexible Mailbox Storage" |
| `email/sync-across-devices.svg` | "Sync Across Devices" |
| `email/forwarders-aliases.svg` | "Forwarders & Aliases" |
| `backups/backed-up-daily.svg` | "Automated Daily Backups" |
| `backups/retention-window.svg` | "30-Day Retention Window" |
| `backups/off-site-storage.svg` | "Secure Off-Site Storage" |
| `backups/granular-restore.svg` | "Granular File Restores" |
| `backups/snapshot-backups.svg` | "On-Demand Snapshots" |
| `backups/powered-by-jetbackup.svg` | "Powered by JetBackup" |
| `security/network-level-ddos-mitigation.svg` | "Network-Level DDoS Mitigation" (cph Security) |
| `security/cpguard-malware-defence.svg` | "cPGuard & Malware Defense" |
| `security/waf-application-firewall.svg` | "Web Application Firewall (WAF)" |
| `security/cloudlinux-isolation.svg` | "CloudLinux Account Isolation" |
| `security/encryption-access-control.svg` | "Encryption & Access Control" |
| `security/iso-grade-datacentres.svg` | "ISO-Certified Datacenters" |
| `workflow/use-any-domain.svg` | "Flexible Domain Management" (cph Workflow) |
| `workflow/ftp-sftp-git.svg` | "FTP, SFTP & Git Access" |
| `workflow/one-click-apps.svg` | "300+ One-Click Applications" |
| `workflow/sitepro-ai-builder.svg` | "Site.pro AI Builder" |
| `workflow/sitejet-ai-builder.svg` | "Sitejet Builder Suite" |
| `workflow/temporary-preview-url.svg` | "Temporary Preview URLs" |

### B.10 Verification checklist
After building from Parts A/B, confirm:
- [ ] All three pages' `<title>` reads exactly "Server Salad Cloud Services".
- [ ] `.container` is 1240px max-width, 24px gutter (16px ≤600px), on every section.
- [ ] Homepage section order top-to-bottom: Hero → "Why Choose Server Salad" →
      Sustainability → Plans+Locations (one gradient wrapper) → Migration →
      Cloud Infrastructure → Footer.
- [ ] cpanel-hosting page section order: Hero → Plans & comparison table →
      Features → Why Server Salad → Business Email → Backups → Security →
      Workflow → Technical Overview → Sustainability (shared `.eco*` markup,
      same as the homepage's) → Footer.
- [ ] discount-programs page section order: Hero (centred, no product visual) →
      tab switcher (Student & Academic / Startup / Agency & Freelancer, each
      panel = subtitle + description + "Eligibility Criteria" caption + 6-card
      criteria grid) → Footer. Deep-linking a `#student-academic`/`#startup`/
      `#agency-freelancer` hash (from the mega-menu cards) opens straight on
      that tab, both on page load and via same-page `hashchange` (see B.7/C.20).
- [ ] Light/dark alternation holds on the homepage and cpanel-hosting page
      (each band contrasts the one above it); the discount-programs page is
      deliberately all-white/light (see C.20), no dark-band alternation.
- [ ] The hero fills the viewport on load: `min-height: calc(100vh - 108px)`
      (108 = 34px topbar + 74px nav — update this number if the header height changes).
- [ ] `css/styles.css?v=N` and `js/main.js?v=N` query strings match on **all
      three** HTML pages (currently v=346 / v=22) — bump both on every future
      change to that file, in every page's tag.
- [ ] `api/pricing.php` returns `{"ok":true,"prices":{"starter_salad":N,"standard_salad":N,"premium_salad":N}}`
      when curled directly; every `[data-price]` element on both pages shows
      the same live number once the fetch resolves, and falls back to its
      `data-monthly` HTML value if the fetch fails.
  - [ ] cpanel-hosting billing toggle defaults to **Annually** on load
      (`aria-checked="true"`, `isAnnual = true` in JS).
- [ ] Nav dropdowns/mega-menus open on click always, and additionally on
      hover only under `(hover: hover) and (pointer: fine)`; Esc and
      click-away close them; mobile (≤980px) collapses to a stacked hamburger
      menu with mega-menus flattened to plain rows.
- [ ] Hero partner-logo carousel: 4 logos visible desktop / 3 ≤760px / 2 ≤480px,
      steps one slot every 1.6s (600ms slide + 1000ms pause), drag/swipe works,
      loops seamlessly (duplicated logo set).
- [ ] All `prefers-reduced-motion: reduce` rules actually disable their
      animation (plans note beam, nav apps-link bounce, locations pin pulse,
      migration packet/arrow, email send/incoming mail glyphs + badge flash,
      why-map hover-zoom, backups screenshot hover cross-dissolve).
- [ ] Every icon in Part B.9's manifest renders in `--brand-orange` (or its
      section's specified colour) via the masked-SVG technique — not as a raw
      `<img>` with baked-in colour.
- [ ] Brand name reads "Server Salad" (two words) everywhere in visible text;
      "ServerSalad" (one word) anywhere is a bug.

## Part C — Design Rationale & Content Provenance

The *what* is in Part B's embedded source. This part is the *why* — the
reasoning, content flags, and constraints behind it, so future changes stay
consistent with intent rather than just matching pixels.

### C.1 Navigation
- Two rows: black topbar + dark sticky main nav. Topbar splits two groups to
  opposite edges (`justify-content: space-between`): email/phone on the left,
  About / Contact / **Blog** on the right (Blog was moved here from the main
  nav — see below). No VAT toggle, currency switch, status indicator, or
  live-chat — deliberately not present.
- Main nav's whole link group is right-aligned as one unit
  (`justify-content: flex-end`), so the screen-edge→logo gap on the left
  equals the My-Account→screen-edge gap on the right (owner-specified symmetry).
- Main nav items, left to right: **Web Hosting▾** (mega menu) → **Servers**
  (Launching Soon) → **Domains** (Launching Soon) → **Discount Programs▾**
  (mega menu) → **Open a Ticket** (plain link) → **My Account** button.
- Dropdowns open on **click** always, and additionally on **hover** only when
  `matchMedia("(hover: hover) and (pointer: fine)")` matches — touchscreens
  report CSS `:hover` unreliably (can get "stuck" with no `mouseleave` to
  clear it), so they stay click-only, unchanged from before hover was added.
  A ~180ms close delay on `mouseleave` covers the small gap between the link
  and the panel below it so crossing it doesn't close the menu early.
- **Web Hosting▾** and **Discount Programs▾** both use the same 2-column
  intro+cards+divider mega-menu layout (`.nav__mega-inner--intro`), originally
  built for Web Hosting from an owner-supplied reference design and later
  extended to Discount Programs (see the "Launching Soon" pattern note
  below). `.nav__mega-intro-title--wrap` exists only because "Discount
  Programs" doesn't fit the shared 300px intro column on one line the way
  "Web Hosting" does — don't remove it or the title clips/overlaps.
  - **Web Hosting▾**: intro copy is real (same copy as the matching hero
    cards, not invented for this spot); the two product cards (cPanel
    Hosting / cPanel Business Hosting) reuse the exact same icon files as
    the matching hero cards so the glyph stays identical everywhere that
    product appears — cPanel Hosting is a real link, cPanel Business Hosting
    is `.mega-card--soon` (see below). The "Key Features" / "cPanel Business
    Hosting Difference" checklists are real owner-supplied plan-spec copy.
    The app-logos strip's "See 300+ apps..." link and its "300+" figure are
    still **placeholders** — no real apps-catalogue page exists yet, swap
    both once one does. Four of its animations (link bounce, text glow,
    pointer press, ripple wave) are scoped to `.nav__item.is-open`
    specifically because an earlier unconditional version kept running in
    the background while the menu was closed (`visibility:hidden` doesn't
    pause CSS animations) and got caught mid-cycle on open — now they
    restart fresh at 0% every time it opens.
  - **Discount Programs▾**: all 3 cards are real, owner-supplied copy —
    Student & Academic **Program** (singular — an earlier "Programs" plural
    was corrected to match the actual discount-programs page tab), Startup
    Program, Agency & Freelancer Program (titles + descriptions all final).
    Unlike the Web Hosting▾ cards, these are **real `<a>` links**, not
    `.mega-card--soon` — each points at
    `/server-salad-cloud-services-web/discount-programs/` with a `#hash`
    matching that program's tab (`#student-academic`/`#startup`/
    `#agency-freelancer`), so clicking a card lands directly on its own tab
    (see C.20). They started as "Launching Soon" placeholders and were
    converted to live links once the discount-programs page existed — see
    Part E. The right-hand black box's heading ("Why We Built This:") and its
    7-item list are also final, owner-supplied copy, replacing two earlier
    placeholder passes ("Program Benefits" / a shorter 4-item "Why We Built
    This" draft) — if the owner supplies yet another version, replace the
    `<ul class="nav__mega-features-list">` contents wholesale, don't merge.
- **"Launching Soon" placeholder pattern** — see C.18 for the full
  cross-cutting writeup. In this nav specifically: cPanel Business Hosting
  (Web Hosting▾ card), all 3 Discount Programs▾ cards, and the standalone
  **Servers**/**Domains** nav items all use it. Servers/Domains are
  non-shape-matched to a card, so they use the compact tooltip variant
  (`.nav__link--soon` + `.nav__tooltip`, positioned `top:100%` below the
  item) instead of a card overlay, and are `<span tabindex="0">`, not `<a>`
  — there is deliberately no href to go nowhere.
- **Support▾ was removed entirely** (it went through several intermediate
  states first — trimmed to just "Contact Support", then removed) and
  replaced with a single plain nav item, **"Open a Ticket"**, linking to
  `https://hub.serversalad.com` in a new tab. **My Account** also points at
  `https://hub.serversalad.com` (new tab) — both are the first two real,
  non-placeholder destinations added to the main nav.
- **Blog** was first added as its own main-nav item next to Support, then
  moved into the topbar (next to About/Contact) once Support was removed —
  it's a topbar link now, not a `nav__list` item; its href is still the
  `#blog` placeholder anchor.
- The hero's 3rd card is titled "VPS Hosting", but the nav item above it
  still says "Servers" — now less consequential than before, since neither
  leads anywhere yet (both are Launching Soon), but still worth aligning the
  wording once the product is real.

### C.2 Hero
- Fills the screen on load: `min-height: calc(100vh - 108px)` (108 = 34px
  topbar + 74px nav) with vertically-centred content — update the 108 if the
  header's height ever changes.
- Title: "**Sri Lankan Support.** European Infrastructure.\<br>Zero
  Compromise." — first clause gradient-accented, `<br>` forced so line 1 and
  2 split as shown; the `clamp()` font-size is tuned so line 1 fits the
  container at that weight — if the copy changes and wraps wrong, adjust the
  clamp's max px, not the `<br>` placement.
- All 4 hero-card descriptions are **real, owner-approved copy**, no bold
  spans. Only the cPanel Hosting card carries the "Most Popular" badge.
  - cPanel Hosting is a real `<a>` to `/server-salad-cloud-services-web/cpanel-hosting/` (same tab), no price
    shown (live or static).
  - cPanel Business Hosting, VPS Hosting, and Domains are **not links at
    all** — `.hero-card--soon` non-interactive `<div>`s with a full white
    `.hero-card__soon` "Launching Soon" overlay that fades in on hover (see
    C.18). They used to be `<a href="https://example.com/">` dead
    placeholder links; that was replaced with this pattern specifically so
    there's no dead/example.com href left in the markup at all.
- The four hero-card icon files are reused as-is by the matching Plans-card
  and Web Hosting▾ mega-menu card (cPanel Hosting / cPanel Business Hosting
  pair specifically), so that product's glyph stays identical everywhere.
- **Partner-logo carousel**: step-and-pause (not continuous scroll) — slide
  one slot, hold ~1s, repeat. The logo list is duplicated once in the HTML
  (2nd copy `aria-hidden`) so the loop resets to position 0 instantly (no
  transition that one frame) landing on visually identical content. Drag/
  swipe via Pointer Events; no prev/next arrow buttons exist.

### C.3 "Why Choose Server Salad"
- Light section, deliberately **no background photo** — a stock photo
  without known licensing wasn't used; owner can supply a real one later.
- 6 cards state **concrete, real claims** (free 24/7 support via
  ticket/chat/phone, weekly Saturday live sessions, 100% licensed software,
  no-extra-fee malware scanning, Sri Lankan team + European data centers,
  student/educator/startup/agency discounts) — keep in sync with what Server
  Salad actually offers if any of these change.
- Review buttons: real owner-supplied destinations (Google, Trustpilot), both
  new-tab. **No star rating or review count is shown** — deliberately, no
  basis to assert a real rating figure.

### C.4 Sustainability
- Single centred column: label + heading + underline + description — no stat
  cards, no CTA button (both removed per owner).
- Content is owner-supplied: "100% Renewable Energy" label (owner's brief
  calls it a "Pill/Badge" but it renders as plain coloured text, not an
  actual pill — open question whether a chip treatment is wanted), heading
  naming Ecologi as the reforestation partner (owner-supplied claim, not
  independently verified), description naming European infrastructure +
  100% renewable energy.
- The green→red→orange gradient underline is a **deliberate one-off
  exception** to the site's shared flat-orange underline treatment (see the
  Decisions section) — ties into this section's green "sustainability" theme.
- Background photo uses `background-attachment: fixed` for a parallax feel —
  unreliable on mobile Safari/iOS, which falls back to normal scrolling there
  (expected, not a bug). The photo file (~8MB) is unoptimised; worth
  compressing before launch (no image tooling was available to do it here).
- **Reused verbatim on cpanel-hosting**, as the very last section before its
  footer (same `.eco*` classes, no page-specific CSS) — see B.10's section
  order and C.17.

### C.5 Plans + Locations
- Wrapped together in one `<div class="plans-locations">` and treated as one
  continuous visual section (single top-to-bottom gradient background, no
  hard seam) rather than two separately-coloured blocks — the two inner
  `<section>`s have no flat background colour of their own.
- **Plans**: real Server Salad products, no fabricated review badge, no
  invented promo ribbons (a floating "★ 4.2" rating and a "£1 for the first
  month" ribbon existed in an original reference design and were
  deliberately dropped — no basis to assert either).
  - The title's price and both plan cards' prices are **live**, sharing the
    same `starter_salad` pricing key and `renderPrices()` pickup — all three
    always show the identical live number once the API responds. Fallback
    values in the HTML differ slightly between the title (10000) and the
    card (10000, kept in sync as of the last pricing update) — cosmetic only,
    never visible unless the API is down.
  - Only **2** of the hero's 3 hosting products appear here (VPS Hosting is
    hero-only) — Plans and the hero largely overlap in content for the two
    products they share; open question whether both sections should stay.
  - cPanel Hosting card has a "billed as LKR X/year" line under its price
    (annual-equivalent total); the Business Hosting card ("To be announced")
    has no equivalent, so the two cards no longer line up perfectly
    row-for-row — the shared `min-height` on `.plan-card__price` doesn't
    fully compensate. Worth evening out if the misalignment looks wrong.
  - cPanel Business Hosting's description differs slightly from the hero
    card's version of the same product ("cPanel control"/"online stores"
    here vs. "full cPanel control"/"high-volume online stores" on the hero)
    — confirm whether one should be trimmed to match.
  - The cPanel Business Hosting card's price is "To be announced", and its
    "View Business Hosting Plans" button uses the **in-place overlay**
    variant of the "Launching Soon" pattern (`.btn--soon` /
    `.btn--soon-overlay`, a non-interactive `<span tabindex="0">` that swaps
    its label for "Launching Soon" on hover) rather than the full-card
    overlay used elsewhere — see C.18.
- **Locations**: no heading/label (owner removed a placeholder "Our
  Location" eyebrow) — just the map + one marker. Owner's reference image
  showed 3 markers; **owner explicitly asked for only London**. The
  hover/focus info card's copy is real, owner-confirmed content. Pin position
  (`left: 46.5%; top: 37%`) was estimated visually by locating the British
  Isles' dot cluster on this specific stylised map image, not driven by real
  geographic projection math — worth a visual sanity-check, nudge the
  percentages if it looks off.

### C.6 Migration
- Dark section, full content is owner-supplied real copy — eyebrow, heading,
  description, and all 4 card titles/descriptions. No CTA button in this
  section. No "sites migrated" stat pill — no basis to assert a count.
- Copy asserts concrete promises: **free** migration, **zero migration
  fees**, **total data integrity**, mailboxes/credentials need **no manual
  re-configuration** — owner-stated, so not fabrication, but keep accurate to
  what Server Salad actually guarantees if anything changes.
- The illustration is pure CSS/SVG (no image asset): a muted "current host"
  box, a dashed curved arrow, a highlighted "Server Salad" box. The file
  packet's `<mpath>` references the arrow path by `id` rather than
  duplicating its `d` coordinates, so the two can never visually drift apart
  if the curve is edited.

### C.7 Cloud Infrastructure
- Light section, deliberately **larger/airier** sizing than the site's other
  card sections (bigger heading, roomier card padding) — matches an owner
  reference; don't normalise these back to match other sections.
- Samsung NVMe storage and AMD EPYC CPUs are **confirmed genuine** Server
  Salad infrastructure, so those vendors are named directly. No specific
  investment-amount or storage-capacity figure appears anywhere (removed
  when flagged) — copy is deliberately number-free on that front.
- ⚠️ **Two card descriptions carry unverified qualitative claims, kept on
  explicit owner instruction after being flagged**: card 3 ("...one of the
  industry's lowest false-positive rates") and card 5 ("...our award-winning
  cloud NVMe infrastructure"). Not removed — the owner's call — but never add
  a claim like this silently in the future; flag it the same way first.
- No background photo (CSS gradient stands in — owner could supply a real
  one) and no bottom CTA button — both deliberate.

### C.8 Multi-page architecture (why fetch-and-inject, not SSI or copy-paste)
The stack is locked to plain HTML/CSS/JS (no PHP templating, no build tools),
so once a 2nd real page existed, three options were on the table:
1. **Apache SSI** (`<!--#include -->`) — would avoid the JS dependency below,
   but needs an `.htaccess`/`mod_include` change that couldn't be verified
   working without a real browser in this environment.
2. **Hand-copy the header/footer markup into every page** — avoids both
   trade-offs below, but silently drifts out of sync across pages over time.
3. **JS fetch-and-inject** (what's built) — `js/main.js` fetches
   `partials/header.html` / `partials/footer.html` and replaces the
   `<div id="site-header">` / `<div id="site-footer">` placeholders with the
   fetched markup (`mount.outerHTML = html`). Trade-off: the header/footer
   aren't in the page's initial HTML — briefly absent, and requires JS (true
   for essentially all real visitors; a theoretical concern only for very
   old/no-JS crawlers).
Chosen deliberately. If the project later adds a real build step, this is the
first thing worth reconsidering.
- Both fetches pass `{ cache: "no-store" }` — without it, the browser could
  keep serving an already-cached copy of a partial's HTML even after
  `styles.css` is bumped, silently drifting an edited partial out of sync
  with the current CSS until a hard reload. This isn't tied to the `?v=N`
  convention (partial URLs don't carry one) — it forces a fresh fetch every load.
- The nav's dropdown/hamburger JS had to be restructured into `initNav()`
  (rather than running immediately at script load) because that markup may
  not exist yet if it's still arriving via the header fetch — called either
  immediately (if nav markup is already in the page) or right after the
  header fetch injects it, never before.
- Nav anchor links (`#about`, `#cpanel-business-hosting`, etc.) only resolve
  on `index.html`, where those sections exist — clicking "About" from
  `cpanel-hosting/` won't scroll anywhere yet. One exception: the Web
  Hosting▾ mega-menu's "cPanel Hosting" card links to the real
  `/server-salad-cloud-services-web/cpanel-hosting/` page.

### C.9 cpanel-hosting: Hero
- Reuses the exact same gradient + dot-grid background as the homepage hero
  (no stock "person at a laptop" photo was supplied) — keeps this page
  feeling like part of the same site. Shorter (`padding: 96px 0`, not a
  full-viewport `min-height`) since it's a content section, not a landing hero.
- **This copy deliberately does not claim "unlimited" anything** — the Plans
  table right below states the real cPanel Hosting plan is capped (1-10
  websites / 30GB / 2 cores / 2GB RAM). Para 1 is the exact existing cPanel
  Hosting description reused verbatim from the hero card/Plans section; para
  2 states the real spec explicitly, consistent with the Plans feature list.

### C.10 cpanel-hosting: Plans & feature comparison
- Table data is drawn from the owner's real spec spreadsheet ("cPanel
  Hosting Solutions", 3 packages × ~17 features) — a genuine data source, not
  a competitor's pricing claims.
- No section heading/intro, no trust-badge row — opens straight into the
  table. If a badge row is added later, use only what's real and confirmed
  elsewhere on the site (24/7 Support, 14-Day Money Back, Free SSL, cPGuard,
  Softaculous) — never unconfirmed claims like "99.9% Uptime Guarantee" or
  "No Contracts".
- Package header cells are solid black (`.cph-table__pkg`) — **all 3 look
  identical, no per-tier highlight**. An earlier version had a "MOST
  POPULAR" band on Standard Salad and a top accent on Premium Salad; owner
  had both removed (`.cph-table__pkg-badge`, `--popular`, `--featured` are
  fully deleted from the CSS, not just hidden) — no data on which tier
  actually sells best, same reasoning as every other unverified-claim omission.
- **All 3 tiers' prices are live** from the same `cpanel_package_pricing`
  table via `api/pricing.php` (see B.8) — same mechanism as the homepage.
- Feature rows are split into two grid groups: **differentiating rows**
  (ordered by buyer priority — site count > space > traffic > databases >
  mailboxes > the long tail, not the spreadsheet's original order), then
  **"Included with Every Plan"** (rows identical across all 3 tiers: Data
  Center/CPU/RAM moved here from the differentiating group since they don't
  differ; platform → guaranteed resources → performance → security →
  backups → apps/dev stack → site builder → support ordering).
- Parked Domains/Mailing Lists show a **red ✕** instead of "0" on Starter
  Salad — a plain "0" read ambiguously (zero of something you get, vs. a
  literal count); a cross reads unambiguously as "not on this tier".
- Every "Unlimited"/"Unmetered" value renders as an **orange ∞ glyph**
  instead of the word, `aria-hidden`, paired with a `.sr-only` span carrying
  the real word so screen readers still announce it properly.
- **Monthly/Annually billing toggle**, Annually default on load. The DB only
  stores one monthly price per plan — annual figures are calculated
  client-side (year total = monthly × 10, "2 Months Free" since paying 10
  months covers 12; the annual-equivalent /mo = that total ÷ 12, rounded).
  *(2 months free is really ~16.7% off; "16%" shown is the rounded-down
  marketing figure the owner asked for.)* Each price cell's "billed as..."
  line has two states: Annually shows "billed as LKR X/year (16% Discount)";
  Monthly shows "LKR X/year (switch to Annual to save)" where the note
  clause is a real `<button>` that flips the toggle (delegated document
  listener, since `renderPrices()` rebuilds this markup every render).
- The "Order ... Salad" CTA row sits at the **bottom** of the table (moved
  per owner — used to sit directly under each price at the top), matching an
  ordinary row's padding/border rhythm so it reads as one more row, not a
  bolted-on footer. All 3 buttons now point at `https://hub.serversalad.com`
  (new tab) — this used to be an explicit `https://example.com/` placeholder;
  `hub.serversalad.com` is a real destination (the same one "Open a Ticket"
  and "My Account" in the nav now use, see C.1), not a placeholder.
- The spreadsheet's merged "Support" row was removed earlier per owner. The
  merged "Money-Back Guarantee" row lives outside the table as a small
  "14-Day Money Back Guarantee" line — it originally sat inside each black
  package-header cell (`.cph-table__pkg`), but was moved down to sit **under
  each "Order ... Salad" button** in the CTA row instead
  (`.cph-table__pkg-guarantee`, inside `.cph-table__btn-cell`, which switched
  to `flex-direction: column` to stack it under the button). Its colour was
  then matched exactly to an owner-supplied font-inspector spec —
  `rgb(127, 133, 136)` — since it moved from a dark background (where it was
  a light colour) to a white one.
- **Ash-grey `#ececf0` row separators were removed** throughout this table
  (`.cph-table__label`, `.cph-table__val`, `.cph-table__btn-cell`,
  `.cph-table__group` no longer carry a `border-top`) per owner request. That
  left the feature rows looking too loosely spaced with nothing to visually
  separate them, so vertical row padding was tightened afterward (`13px` →
  `8px` on `.cph-table__label`/`.cph-table__val`) to compensate — do both
  together if this table's row density is ever revisited; removing the lines
  without the padding change looks wrong.
- **Sticky billing toggle + sticky package header**, owner-requested so the
  toggle and the black package-header row track the same way down the page as
  you scroll the feature rows, until the CTA row comes into view. Three
  non-obvious CSS fixes were needed to get here, all now baked into the
  structure — see B.1's `.cph-plans__sticky-scope`/`.cph-table--main`/
  `.cph-table--cta` comments for the full "why":
  1. Any ancestor with a non-`visible` `overflow` that never itself scrolls
     silently becomes the "nearest scroll container" for a `position: sticky`
     descendant and prevents it from ever engaging — `.cph-table` lost its
     `overflow: hidden` (corner-rounding moved to explicit per-cell
     `border-radius` instead) and `.cph-table-wrap`'s `overflow-x: auto` is
     now gated behind a `max-width: 860px` media query (mobile-only
     horizontal scroll, kept out of the unconditional rule specifically so it
     doesn't break sticky at desktop widths).
  2. A sticky element's stuck-and-released range is bounded by its own
     containing block, not by any specific child row — the table is split
     into two adjacent grids sharing the same `grid-template-columns`,
     `.cph-table--main` (header + feature rows) and `.cph-table--cta` (just
     the CTA row), so the sticky header's containing block ends right before
     the CTA row and releases there instead of scrolling the CTA row out of
     view underneath it.
  3. `border-radius` is not reliably clipped on a `position: sticky` element
     while it's actively in its stuck/offset state in some browsers — the
     background + radius for the intro cell and the last package cell live on
     `::before` pseudo-elements (plain `position: absolute`, not themselves
     sticky) instead of on the sticky elements directly.
  4. Spacing between the nav, the toggle, and the header had to be `padding`
     (inside each sticky element's own painted background), not `margin`
     (outside it) — a margin gap let scrolled content show through underneath
     once stuck.
- **Package header "condenses" further once it's stuck**, owner-requested
  on top of the plain sticky behaviour above: once `.cph-table__intro` /
  `.cph-table__pkg` lock into their sticky position, the UK-flag icon, the
  tagline paragraph, and the gap above the price all shrink away
  (`.is-condensed` class), so continuing to scroll buys back more of the
  black header's vertical space rather than it just sitting there full-size
  forever. Detected via `IntersectionObserver` watching a dedicated 1px
  `.cph-table__pkg-sentinel` placed in normal flow immediately before
  `.cph-table-wrap` — the same sentinel-based "is this sticky element
  currently stuck" pattern already used for
  `.cph-billing-toggle.is-stuck` above, checking `entry.boundingClientRect.top`
  against the sticky element's own `top` offset (not just `entry.isIntersecting`,
  which alone can't tell "stuck" from "scrolled fully past"). Toggling one
  class fires a short (~150–200ms) native CSS `transition` on `padding` /
  `opacity` / `margin` / `max-height` for the affected elements; a synced
  `transform: scaleY()` on the tagline (same trigger, same duration) keeps
  its text from visibly clipping mid-shrink, since animating `max-height` +
  `overflow:hidden` alone can slice straight through a text line or a raster
  image (the flag icon) — the flag avoids this entirely by fading via
  `opacity`/`margin` only, never `max-height`. `min-height: 0` is required
  everywhere a `max-height: 0` collapse is meant to fully hide something —
  `min-height` always wins the conflict otherwise, so a leftover base
  `min-height` silently defeats the collapse. `@media (prefers-reduced-motion:
  reduce)` disables all of these transitions (the class still toggles, just
  instantly).
  - ⚠️ **This went through three real implementation attempts before landing
    on the IntersectionObserver version above** — worth knowing before
    "improving" it again. Attempt 1 (a scroll-threshold class toggle) had a
    `min-height`/`max-height` conflict bug (tagline wouldn't visually shrink).
    Attempt 2, chasing a "make it scrub smoothly with scroll distance, not
    snap" request, drove a `--cph-condense` CSS custom property continuously
    from a `scroll` + `requestAnimationFrame` handler, consumed via `calc()`
    on `padding`/`margin`/`max-height` — this is a **layout-thrashing
    anti-pattern**: recomputing layout-affecting properties on every scroll
    frame forces a full synchronous browser reflow dozens of times per scroll
    gesture, which is what actually caused the reported "glitchy, can't read
    anything" symptom (not a one-off rendering bug, as it first appeared).
    The fix was **not** a smoother scrub — it was going back to a **single
    binary class toggle fired once** by an efficient, browser-optimized
    `IntersectionObserver`, with a short native CSS transition doing the
    visual work instead of per-frame JS writes. If a future request asks for
    scroll-scrubbed (not snap) condensing again, don't reach for a scroll+rAF
    handler driving layout properties — that path has already been tried and
    reverted for this exact performance reason.

### C.11 cpanel-hosting: Features
- Heading is "Loaded Web Hosting Features" — deliberately **not**
  "Unlimited…", since the plans in the table right above are capped.
- All 12 card titles/descriptions are **owner-supplied real copy**, most
  recently updated to the current wording (see B.6) — states concrete
  specifics not stated elsewhere (WP Toolkit, 300+ web applications, daily
  backup frequency, WhatsApp support, zero-downtime-or-data-loss migration) —
  owner-asserted, keep accurate to what Server Salad actually offers.
- Icon filenames were renamed to tally with their card's current title
  (`wordpress-optimized.svg`, `professional-email-included.svg`,
  `seamless-migration.svg`, `expert-support.svg`) after the copy changed —
  see B.9's asset manifest for the current mapping.

### C.12 cpanel-hosting: Why Server Salad
- ⚠️ **Deliberately single-region.** The homepage Locations section states
  London, UK is *the* data centre (one marker, owner-explicit "only London"),
  and this page's own comparison table shows Data Center = UK for every
  tier. So the heading is "Enterprise Cloud Hosting, Built for Performance"
  and the map shows one London pin (same coordinates as the homepage pin).
  **If Server Salad genuinely adds USA/Germany regions, this section AND the
  homepage Locations section must both be updated** — restore multi-region
  framing (heading, a 2nd card, description) and add pins to both maps so
  the two pages stay consistent.
- The heading and the 3 cards are single-colour (no gradient/accent split)
  and the eyebrow/heading typography were matched to a supplied font-inspector
  spec exactly (Manrope 600 12px/18px eyebrow; Cairo 600 40px/46px heading) —
  colour was kept at the site's own values per the reference-styling rule.
- 3 card titles/descriptions ("Samsung NVMe Storage", "UK Datacenter
  Location", "Hands-On Tech Experts") are plain text, no bold spans, matched
  to an owner-supplied reference table.
- The `.cph-why__grid` uses `align-items: stretch` so all 3 cards match the
  tallest one's height, regardless of description length.
- The map card's "London, UK" pin label typography also matches the
  font-inspector spec (Manrope 600 12px/18px). Hovering the map card zooms
  `.cph-why__map-inner` in on London (`transform-origin: 46.5% 37%`, the same
  coordinates as the pin itself, `transform: scale(2.6)`), and the pin's
  plain orange dot cross-fades into `flags/uk-flag-circle.png` (the same
  circular UK flag image used on the homepage's Locations hover card) —
  `opacity` swap between `.cph-why__pin-dot` and `.cph-why__pin-flag`, not a
  second image loaded on hover. `.cph-why__map` needs `overflow: hidden` for
  the zoom to stay clipped to the card. All of it is disabled under
  `prefers-reduced-motion: reduce` (the `transition`s are removed, not just
  the trigger, since the `:hover` scale rule would otherwise still jump
  instantly).

### C.13 cpanel-hosting: Business Email
- Two-column top: a pure CSS/SVG envelope + `@` badge illustration on the
  left (heading+description on the right), then a 3×2 grid of 6 cards.
  Heading/description type match a supplied font-inspector spec exactly
  (Cairo 600 40px/46px heading; Manrope 300 15px/25px description — colour
  kept at the site's own white/orange per the reference-styling rule), same
  for the 6 card titles/descriptions (Cairo 600 17px/21px; Manrope 300
  13px/20px).
- The illustration went through several concepts (packet-flight, a
  sketch-style draw-in reveal, an orbiting icon, a typing indicator, a
  particle burst, a diagonal light sweep) before landing on the current one:
  a small envelope departs the `@` badge and arcs off-canvas (send), then a
  second arrives from off-canvas into the badge (incoming) — one 6s loop,
  via two `<g>` groups each with an inline-path `<animateMotion>` + an
  `opacity` `<animate>` for fade in/out. The badge's `.cph-email__art-badge-
  flash` ring brightens twice per cycle, timed to the departure (~5%) and the
  landing (~93%), so the badge visually reacts to both moments. A separate,
  independent `<animate>` on `.cph-email__art-ping` gives it a continuous
  ambient pulse unrelated to the send/receive cycle. All of this is SMIL
  (`<animate>`/`<animateMotion>`), which can't be halted by CSS
  `animation: none` — `prefers-reduced-motion: reduce` hides the animated
  elements outright (`display: none`) instead, same pattern as the Migration
  packet.
- All 6 card titles/descriptions are real copy. "Flexible Mailbox Storage"
  deliberately gives no size/number ("ample space" instead) — no confirmed
  figure to state. "Forwarders & Aliases" states "unlimited" aliases/
  autoresponders — owner-supplied, keep accurate.

### C.14 cpanel-hosting: Backups
- Two-column top: heading+description on the left, the JetBackup dashboard
  screenshot in a light "device" frame on the right, then a 3×2 grid of 6
  cards. Heading/description and the 6 card titles/descriptions are type-
  matched to the same font-inspector spec as C.13 (headings dark `rgb(32, 29,
  44)` instead of white, since this section sits on a light background).
  `.cph-backups__underline` deliberately uses the site's red→orange
  `--accent`/`--accent-2` gradient (not a flat `--brand-orange` bar like the
  homepage underlines, see A.3) — owner-requested "our colour code orange and
  red mixed gradient" for this one underline specifically.
- JetBackup is already established as Server Salad's real backup solution
  (appears in the comparison table's "Included with Every Plan" group and on
  the homepage) — the 30-day retention figure is owner-confirmed. Card
  copy: 4 of the 6 titles/bodies were later updated to more formal wording
  ("Automated Daily Backups", "Secure Off-Site Storage", "Granular File
  Restores", "On-Demand Snapshots" — see B.9 for the current title mapping);
  "30-Day Retention Window" and "Powered by JetBackup" kept their titles.
- ⚠️ The screenshot (`graphics/jetbackup-illustration.png`) **must be a
  genuine Server Salad JetBackup panel**, not another host's customer
  session — confirm the file on disk is Server Salad's own before launch.
- **Hover reveal:** hovering `.cph-backups__frame` cross-dissolves the
  screenshot into `graphics/jetbackup-logo.png` — the real JetBackup wordmark
  (owner-supplied via `downloads/`, cropped to its bounding box and
  downscaled; see A.5's `downloads/` workflow). The screenshot zooms out
  slightly and blurs away (`opacity`/`transform: scale()`/`filter: blur()`
  transitioning together) while the logo, stacked underneath at all times,
  zooms in from a touch smaller and sharpens into focus — a soft cross-
  dissolve, not a hard wipe edge. Two earlier attempts (a `clip-path` wipe, a
  3D `rotateY` card flip) were tried and replaced before this landed. The
  frame's box-shadow also deepens on hover, so it reads as lifting up
  slightly while the dissolve plays.

### C.15 cpanel-hosting: Security
- Light section (`.cph-security`), 6-card grid, sits directly after Backups.
  Card copy (DDoS mitigation, cPGuard, WAF, CloudLinux isolation, encryption
  & access control, ISO-certified datacentres) is real, owner-supplied
  security-stack content matching what's independently referenced elsewhere
  on the site (cPGuard already appears in the Features section and the
  feature-comparison table; CloudLinux likewise).
- Icons live in `assets/img/security/` (see A.5/B.9) — same masked
  single-colour SVG pattern as every other icon section.

### C.16 cpanel-hosting: Workflow
- Light section (`.cph-workflow`), 6-card grid, "Works With Your Workflow" —
  domain flexibility, FTP/SFTP/Git/SSH access, the 300+ Softaculous
  one-click apps, Site.pro AI Builder, Sitejet Builder Suite, and temporary
  preview URLs. All real, owner-supplied product capabilities, matching
  claims already made elsewhere (the "300+" one-click app figure also
  appears in the Web Hosting▾ mega-menu app strip and in the Technical
  Overview's Software group — keep these three in sync if the real count
  changes).
- Icons live in `assets/img/workflow/` (see A.5/B.9).

### C.17 cpanel-hosting: Technical Overview
- Light section (`.cph-overview`), two columns of grouped feature lists
  (Key Features, File/Domain/Database Management, Security and Protection,
  Server Specification, Technical Support / Unlimited Features, Email
  Features, Software, Datacentre, Web Applications) — a dense, literal
  spec-sheet dump of the owner's plan spreadsheet, deliberately exhaustive
  rather than curated/marketing-toned like the sections above it.
- Every group heading (`.cph-overview__group-title`) and every list item are
  **centred**, and list items render as **plain text, no bullet/checkmark
  glyph** — both were owner-requested changes from an earlier left-aligned,
  checkmark-bulleted version (`.cph-overview__check` SVGs were fully removed
  from the markup, not just hidden). If more items are added later, keep
  this plain-centred-text style; don't reintroduce bullets without being
  asked.
- Content overlaps in places with other sections lower in specificity
  (e.g. "DDoS Protection"/"cpGuard Security" here vs. the dedicated Security
  section, C.15) — deliberate, this section is meant to be the complete
  reference list, not a de-duplicated summary.

### C.18 "Launching Soon" placeholder pattern (site-wide)
A general UI convention introduced this round for **any product/section
that isn't live yet**, replacing the older approach of leaving a dead or
`https://example.com/` placeholder `href` on the element. The point: a
visitor can still see the card/link and what it's for, but gets an explicit
"not live yet" signal on interaction instead of a link that goes nowhere
real. Three shapes, depending on what the element already looks like —
**don't invent a 4th** without a reason; extend one of these instead:
- **Full-card overlay** (`*--soon` modifier class + a `*__soon` overlay
  span, e.g. `.hero-card--soon`/`.hero-card__soon`,
  `.mega-card--soon`/`.mega-card__soon`): the whole card is converted from
  `<a>` to a non-interactive `<div>`/element, and a full-size overlay
  (`opacity: 0`, white background, centred "Launching Soon" label) fades in
  to `opacity: 1` on `:hover`, covering the card's normal content entirely.
  Used for: the 3 non-live homepage hero cards (cPanel Business Hosting, VPS
  Hosting, Domains — see C.2) and the Web Hosting▾ mega-menu's cPanel
  Business Hosting card. The 3 Discount Programs▾ mega-menu cards used this
  pattern too until the discount-programs page existed; they're now real
  `<a>` links instead (see C.1/C.20).
- **Compact tooltip** (`*--soon` on the link/text + a sibling `*__tooltip`
  pill, `role="tooltip"`, shown on hover/`:focus-visible`): used where the
  element is short, single-word/short-phrase text rather than a card — not
  worth a full overlay. The element itself becomes a non-interactive
  `<span tabindex="0">` (no `href`), keeping it keyboard-focusable so the
  tooltip is reachable without a mouse.
  - **`.nav__tooltip`** (nav bar): positioned `top: 100%`, **below** the
    item, since nav items sit near the top of the viewport. Used for the
    Servers/Domains nav items (see C.1).
  - **`.footer__tooltip`** (footer): positioned `bottom: 100%`, **above**
    the item instead — the opposite direction from the nav tooltip,
    deliberately, since footer items sit at the very bottom of the page and
    a tooltip opening downward would run off-screen. Used for the footer
    Products column's cPanel Business Hosting / VPS Hosting / Domains items
    (see C.19). Needs `.footer__links { align-items: flex-start; }` — that
    `<ul>` is a `flex-direction: column` container, and without
    `align-items: flex-start` each `<li>` stretches to the column's full
    width, which centres the tooltip (`left: 50%`) on the whole stretched
    box rather than on the short text label inside it, landing it far from
    where the label visually is.
- **In-place button overlay** (`.btn--soon` + `.btn--soon-label` +
  `.btn--soon-overlay`): for a plain `<button>`/`<a>`-shaped CTA that isn't a
  card — the label swaps for "Launching Soon" in the same footprint on
  hover, rather than a separate overlay layer on top. Used for the Plans
  section's "View Business Hosting Plans" button (see C.5).
- All three variants share the same non-interactive-element rule: convert
  the original `<a href="...">` to a `<span>`/`<div>` (add `tabindex="0"`
  only where a tooltip needs keyboard reachability) — never leave a
  `href="#"` or a dead `https://example.com/` URL behind once an element
  uses this pattern.

### C.19 Footer (shared partial)
- Solid black (`--bg-topbar`), bookending the equally-black topbar rather
  than one of the site's dark gradients — deliberate.
- Brand column uses the **full** logo (icon + "SERVERSALAD" wordmark),
  different file from the nav's icon-only logo — don't merge or overwrite
  either. That logo is drawn in `--brand-dark`, designed for a *light*
  background, so it needed a genuinely light/solid backing chip
  (`#f5f5f7`) behind it on this pure-black footer — a translucent chip
  wasn't bright enough to make the "SERVER" text legible (a translucent
  overlay can't out-contrast a logo drawn for a light background).
- Brand description states concrete claims: a founding year (2021) and a
  product list that includes **dedicated servers and email hosting, neither
  of which appears anywhere else on the site** (only cPanel Hosting, cPanel
  Business Hosting, VPS Hosting, and Domains are shown elsewhere) —
  owner-asserted (the text does say "now expanding"), but worth confirming
  these are real upcoming products rather than something a visitor can't
  find/order anywhere on the page yet.
- Information column still lists `#about`, `#contact`, `#knowledgebase`,
  `#ticket`, `#status`, `#terms`, `#privacy`, `#discount-programs` —
  originally written to mirror the nav's old Support▾ submenu items
  one-for-one. **That submenu no longer exists in the nav** (see C.1 —
  removed entirely, replaced by a single "Open a Ticket" link to
  `https://hub.serversalad.com`), and this footer column was not touched
  when that happened, so Knowledgebase/Submit a Ticket/System Status now
  exist only here, as `#anchor` placeholders with no matching nav item —
  flagged in Part D; ask before deciding whether to update this column to
  match, leave it, or add real destination pages for these.
- Products column: cPanel Hosting is a real link to
  `/server-salad-cloud-services-web/cpanel-hosting/`; cPanel Business
  Hosting, VPS Hosting, and Domains use the footer "Launching Soon" tooltip
  variant (see C.18) — same non-live products as the homepage hero cards
  and the Web Hosting▾ mega-menu, kept consistent across all three spots.
- Get in Touch column: real contact details (same as the topbar), then
  Facebook/LinkedIn/Instagram — owner asked to "add fb, linkedin, instagram",
  read as the complete intended set, so an original X/Twitter icon was
  removed rather than kept as a 4th (flag if X should stay too). Real
  owner-supplied profile URLs, all new-tab. The social circles and the logo
  backdrop both needed brightening for the same reason (a faint translucent
  fill on pure black barely registers) — now a visible border + full-white
  icon colour so they read clearly at rest, not just on hover.
- **All 4 footer accent bars use the orange→red gradient**, not flat
  `--brand-orange`: each `.footer__col-title`'s `border-top` is a
  `border-image: linear-gradient(90deg, var(--accent), var(--accent-2)) 1`,
  and `.footer__underline` (above "Follow Us") uses the same
  `background: linear-gradient(...)` instead of its old flat orange fill —
  the same "orange and red mixed" gradient convention used for the
  discount-tabs active-tab underline (see C.20).
- **Deliberately not included**: no Company Number/VAT Number block
  (inventing registration numbers would be fabricating legal data — add one
  only with the owner's real numbers), no "® registered trademark" claim, no
  awards/"trusted by" claims.
- Copyright line uses the full legal-style name, matching the `<title>`, no
  trademark assertion.

### C.20 Discount Programs page
- **Created as an empty white page first**, populated section-by-section over
  many owner requests — unlike the homepage/cpanel-hosting pages, there was
  no upfront spec; treat any still-placeholder content here (the criteria
  card text, in particular) as expected, not a bug.
- **Hero is duplicated from cpanel-hosting's `.cph-hero` markup/classes**
  (see B.6), not a new component — same background treatment, title/
  underline/description structure. Two deliberate differences from the
  cpanel-hosting hero: no product-screenshot visual (owner request — this
  page isn't a single product, so no one image fits), and the content is
  centred rather than two-column. `.cph-hero__inner--centered` handles the
  second point by collapsing the two-column grid to one centred column
  instead of leaving an empty, lopsided second column where the screenshot
  would have gone — don't reintroduce a visual without also removing that
  modifier class.
- **Tab switcher** (`.discount-tabs*`, see B.1/B.2): 3 tabs across one
  `.discount-tabs__bar` grid (`role="tablist"`), each with a `data-tab` id,
  a `data-hash` for deep-linking, and full ARIA wiring
  (`aria-selected`/`aria-controls`/`tabindex`). One `activateDiscountTab()`
  function in `js/main.js` drives both a click handler on each tab and
  hash-based activation, reused for two cases: an on-load hash check (for
  someone landing here fresh from a mega-menu card link) **and** a
  `hashchange` listener (for clicking a mega-menu card link while already on
  this page — same path, different hash, which fires `hashchange` but does
  **not** reload the page or re-run on-load scripts). Built from an
  owner-supplied reference (Design/Programming/Support tab screenshots);
  iterated down from that reference in three ways the owner asked for
  explicitly, all final:
  - Removed the reference's "01."/"02."/"03." numbering prefixes
    (`.discount-tabs__num` deleted) — tabs are plain labels now.
  - Removed the reference's ash-grey borders between/under tabs entirely —
    no `.discount-tabs__bar { border-bottom }`, no `border-right` between
    tab buttons.
  - The active tab shows the shared orange→red gradient
    (`linear-gradient(90deg, var(--accent), var(--accent-2))`, same
    convention as the footer bars — see C.19) as a slim 3px underline via
    `.discount-tabs__tab.is-active::after`, **not** the reference's full
    background-colour hover state — that hover colour stays as an actual
    `:hover` background, kept separate from the "is selected" signal.
  - Non-active tab labels are dimmed via `opacity: .4` on
    `.discount-tabs__label` (full `opacity: 1` only on `.is-active`) — the
    owner's framing was "increase transparency of non-selected tab text",
    implemented as inverse: the active tab is fully opaque and the other two
    fade back, rather than each tab having its own independent opacity value.
- **Per-tab content alignment is deliberate and differs by tab**: Student &
  Academic panel content is **left**-aligned, Startup panel is **centre**-
  aligned, Agency & Freelancer panel is **right**-aligned — matching the
  tab's position in the 3-column bar above it (left tab → left content,
  right tab → right content). Implemented via ID selectors on each panel
  (`#discount-panel-1`/`-2`/`-3`) rather than a shared alignment class, since
  each of the 3 needs a different value for the same properties
  (`text-align`, `margin-left`/`margin-right: auto`) — see B.1's
  `.discount-tabs__panel-body` rules.
- **Panel width + criteria-grid geometry is tied to the tab bar's own column
  boundaries**, not an arbitrary width — this was owner-specified with exact
  positioning rules (paraphrased): the Student & Academic content/box-set
  starts flush left and its 3rd box ends at the Startup tab's midpoint; the
  Agency & Freelancer content/box-set starts at the Startup tab's midpoint
  and ends flush right. Since the tab bar is a 3-column grid inside the same
  `.container` as the panels below it, each "half" of that midpoint math
  reduces to **50% of the container width**, anchored to one edge:
  - `#discount-panel-1` (Student & Academic): `width: 50%` with
    `margin-right: auto` (pinned left).
  - `#discount-panel-3` (Agency & Freelancer): `width: 50%` with
    `margin-left: auto` (pinned right).
  - `#discount-panel-2` (Startup): also `width: 50%`, but with **both**
    `margin-left: auto` and `margin-right: auto` — same width as the other
    two, centred instead of pinned to either edge, per explicit owner
    follow-up request ("these content also must have the same width as
    other two, but center aligned").
  - This same 50%-width-anchored-by-margin pattern is applied twice per
    panel: once to `.discount-tabs__panel-body` (subtitle/description/
    eligibility caption) and once to `.discount-tabs__criteria-grid` (the
    6-card grid) — both share the panel's own alignment so the text column
    and the box grid below it line up on the same edge.
  - Reset to full-width, no side-anchoring, under the `860px` breakpoint —
    the left/centre/right split only makes sense at desktop widths where the
    tab bar's columns are wide enough to read as landmarks.
- **"Eligibility Criteria" caption is a plain `<span>`, not a link** — went
  through a naming correction (started as "Terms & Conditions", renamed to
  "Eligibility Criteria" per owner request) and a structural correction
  (first implemented as `<a href="#eligibility">` with an underline/hover
  colour change, then corrected to a non-interactive caption once the owner
  clarified "that's only a caption, not a hyperlink" — `href`, underline, and
  hover-colour rules were all removed, not just the `href`).
- **Font-inspector colour specs that would be invisible were overridden,
  matching only their typography** — this page received several
  font-inspector screenshots specifying an exact colour that, applied
  literally, would put white/near-white text on this page's white section
  backgrounds (unlike A.3's general reference-styling rule, which is about
  *not* copying colour by default, these specific specs were followed for
  everything **except** colour because they'd otherwise be unreadable, not
  just "not asked for"). Confirmed once via `AskUserQuestion` ("keep current
  dark colour" vs. "apply white exactly as given" — owner picked the dark
  option) and applied silently to every later identical case on this same
  page without re-asking:
  - `.discount-tabs__panel-subtitle`: Cairo 600, but `rgb(27, 27, 31)` kept
    instead of the spec's white.
  - `.discount-tabs__panel-desc`: went through two font-inspector revisions
    (a Manrope 400/`rgba(255,255,255,.78)` pass, then a corrected Manrope
    300/`rgba(32,29,44,.82)` pass) — the final spec's colour was already
    dark enough to use as-is, no override needed for this one.
  - `.discount-tabs__criteria-desc`: same invisible-white-spec situation,
    dark colour kept.
  - `.discount-tabs__panel-eligibility`: the given spec's colour
    (`rgb(95,227,154)`, a green) was visible against white, so it wasn't an
    invisibility case — this one was instead corrected on direct owner
    request ("colour should be normal black previously used") from an
    intermediate orange back to `rgb(27, 27, 31)`, matching the panel
    subtitle/label's dark colour. Every such override is documented inline
    in `css/styles.css` at the rule itself, not just here.
- **Eligibility-criteria card grid** (`.discount-tabs__criteria-grid` /
  `.discount-tabs__criteria-card`): light-card component, deliberately reused
  from `.cph-why-card`'s look (white fill, `#e6e6ec` border, soft
  `box-shadow`, lifts + orange border on `:hover`) rather than the
  homepage's dark `.feature` card — this page's sections sit on a white
  background, so the dark card style would invert wrong here. 6 cards per
  panel, all currently **sample placeholder text** ("Sample criterion N —
  replace with a real eligibility requirement.") — see Part D.

## Part D — Open Items (known inconsistencies to revisit)
- **cpanel-hosting "Why Server Salad" is single-region by design** — see C.12.
  If Server Salad now has USA/Germany regions, restore multi-region framing
  and add pins to both this map and the homepage Locations map.
- **cpanel-hosting Backups: JetBackup screenshot** must be confirmed as
  Server Salad's own panel (see C.14).
- **cpanel-hosting card copy asserts several specifics not stated
  elsewhere** — WP Toolkit, "300+" web applications, daily backup frequency,
  WhatsApp support, "zero downtime or data loss", "cPanel-certified
  technicians", "unlimited" aliases/autoresponders. All owner-supplied, so
  implemented verbatim; keep them accurate to what Server Salad actually offers.
- **`discount` and `edu_support_discount` columns exist in
  `cpanel_package_pricing` but aren't used** — the API only reads
  `price_in_lkr_month`. Their exact meaning/display logic (percentage off?
  flat LKR amount? which applies to which visitor?) wasn't specified — ask
  the owner before adding either to the displayed price.
- **Pricing API's DB host/user/pass are hardcoded as a fallback** rather than
  set as real environment variables — matches the owner's own existing
  config pattern for now, but worth moving to real env vars in production.
- **Pricing API's `$host` fallback must be flipped from `'serversalad.com'`
  to `'localhost'` (or an `SS_DB_HOST` env var) once this project is
  deployed onto the real serversalad.com hosting** — currently set for
  *local* testing (site running via XAMPP), which becomes the wrong value
  the moment the site itself runs on that server. Easy to forget.
- **Footer brand description** names "dedicated servers" and "email
  hosting" as products — neither is offered/described anywhere else on the
  site (see C.19). Worth confirming these are real upcoming products.
- **Footer** needs real destination pages for `#terms`, `#privacy`, and
  `#discount-programs`. No Company Number/VAT Number block — add one only
  with the owner's real registration details.
- **Footer Information column is now out of sync with the nav** — it still
  lists Knowledgebase/Submit a Ticket/System Status anchors mirroring the
  nav's old Support▾ submenu, which has since been removed from the nav
  entirely and replaced with "Open a Ticket" → `hub.serversalad.com` (see
  C.1/C.19). Ask whether the footer should be updated to match (e.g. its own
  "Submit a Ticket"/"Open a Ticket" item pointed at the same hub URL) or left
  as-is pending real destination pages for those specific items.
- **cpanel-hosting page**: most nav links won't resolve correctly when
  browsing this page (they're `index.html`-only anchors) — see C.8.
- **cpanel-hosting: three near-identical light card components coexist**
  (`.cph-why-card`, `.cph-backups-card`, plus the dark `.cph-email-card` and
  the bare-icon `.cph-feature`). They share metrics but are separate
  rulesets — a candidate for consolidation if the page grows further.
- **Cloud infrastructure section**: two card descriptions carry unverified
  qualitative claims the owner explicitly chose to keep (see C.7). No
  background photo, no bottom CTA button — both deliberate.
- **Migration section**: worth confirming whether a "sites migrated" stat
  pill should exist once there's a real number to put in it.
- **"Why Choose Server Salad" section**: content is real but states specific
  operational claims (see C.3) — keep in sync if any change. No background
  photo — ask if one is wanted.
- **Plans section title/card price fallback mismatch**: cosmetic only,
  never visible unless the live API is down — worth aligning if noticed.
- **Plans section vs. hero**: Plans shows only 2 of the hero's 3 hosting
  products and largely overlaps the hero cards it kept — worth asking
  whether both sections should stay as-is.
- **Plans cards no longer line up row-for-row** — see C.5's billed-line note.
- **cPanel Business Hosting description** differs slightly between the hero
  card and the Plans card — confirm whether one should be trimmed to match.
- **Sustainability section label**: owner's brief calls it a "Pill/Badge"
  but it's plain text, not an actual pill shape — confirm whether a chip
  treatment is wanted.
- **Web Hosting▾ mega-menu app-logos link is a placeholder** (`#apps`, "See
  300+ apps..." — see C.1) — swap both the link and the "300+" figure once a
  real apps-catalogue page exists. The same "300+" figure is also asserted
  in the cph Workflow section ("300+ One-Click Applications", C.16) and the
  Technical Overview's Software group ("Softaculous Auto-Installer (300+
  Apps)", C.17) — keep all three in sync if the real count changes.
- Topbar's **About** / **Contact** / **Blog** links (`#about`, `#contact`,
  `#blog`) are still placeholder anchors — need real destination pages.
  Blog was moved here from the main nav (see C.1); its target page still
  doesn't exist yet either way.
- Web Hosting▾'s cPanel Business Hosting card and the standalone
  Servers/Domains nav items are still **"Launching Soon"** (see C.18) rather
  than placeholder links — no action needed until each product actually goes
  live, at which point swap that element back to a real `<a href>` and drop
  the `--soon`/`__soon` markup for it specifically (don't blanket-remove the
  pattern from elements that are still genuinely not live). The 3 Discount
  Programs▾ cards already made this transition — they're real links to the
  discount-programs page now (see C.1/C.20).
- **discount-programs page's 6-per-panel eligibility-criteria cards hold
  sample placeholder text** ("Sample criterion N — replace with a real
  eligibility requirement.") for all 3 programs — see C.20. Swap in the
  owner's real per-program eligibility requirements when supplied; keep the
  6-card grid structure unless told the count itself should change.
- **discount-programs page's hero copy is generic/placeholder-style**
  ("engineered for tomorrow's builders" / "zero long-term commitments") —
  it's owner-supplied final copy, not a draft, but worth a pass once the
  programs themselves are live to confirm the framing still fits.
- **discount-programs page has no Sustainability/eco section or any
  homepage-style dark band** — currently ends straight from the tab panels
  into the footer, unlike the other two pages which both end with the
  shared `.eco*` section. Ask whether one should be added for visual
  consistency, or whether this page is meant to stay a focused, single-
  purpose page without it.
- The hero's 3rd card is titled "VPS Hosting" but the nav item above it
  still says "Servers" (see C.1) — worth aligning the wording once the
  product is real; low priority since neither currently links anywhere.
- `.mega-card__icon` (nav mega menus) still uses the general `--accent` red,
  not `--brand-orange` like the hero/Plans cards — no request has targeted
  this yet.
- **cPanel Business Hosting's description text differs slightly across all
  three spots it appears** (hero card, homepage Plans card, Web Hosting▾
  mega-menu card) — never fully reconciled; confirm whether one canonical
  version should be used everywhere.

## Part E — Prior Decisions Log
- Serve locally through XAMPP htdocs; frontend only (HTML/CSS/JS) apart from
  the one live-pricing `api/pricing.php` endpoint.
- One shared `.container` (1240px max, 24/16px gutter) controls left/right
  spacing on every section — standard centred-container pattern.
- Base two-font type system (Poppins + Inter) plus three per-element
  overrides (Cairo, Manrope, Montserrat) — see A.4. Brand colours
  (`--brand-dark`/`--brand-orange`) reserved for genuine brand touchpoints on
  the **homepage** (Plans section, "Why Choose Server Salad" heading/icons,
  eco/hero accents, `.hero-card__badge`), while the hero cards and nav keep
  the rose/red `--accent` palette otherwise. The **cpanel-hosting page uses
  `--brand-orange` throughout**.
- Section card icons are external single-colour SVGs recoloured in CSS via
  `mask` + `background-color: var(--brand-orange)` (per-card file set
  through a `--*-icon` custom property), not inline `<svg>` — keeps the
  colour in one place and the markup lean.
- **Reference-styling rule** (see A.3): match a supplied reference/
  template's typography and box dimensions but not its colours — keep the
  site's own colour unless told otherwise for that specific element. Any
  such override applies only to the element named, never as a new blanket rule.
- **Homepage section underlines are unified**: 150px wide, 4px tall, flat
  solid `--brand-orange`, sharp square corners. `.eco__underline` is the one
  exception (green→red→orange gradient) — a deliberate one-off, not a
  mistake to "fix" back to flat orange.
- Never fabricate unverifiable claims (review scores, stats, promo pricing,
  partnerships) — use neutral placeholders and flag clearly until the owner
  confirms real content. Extends to unverifiable **qualitative** claims too
  (e.g. "award-winning") — flag these the same way as a fabricated number;
  the owner may choose to keep them anyway (their call), but never add them
  silently.
- `css/styles.css?v=N` cache-busting — bump `N` on every CSS change; `js/main.js?v=N`
  is separate — bump on every JS change. Always check the live number in
  both HTML files rather than trusting a figure remembered from earlier in a
  conversation.
- **"Launching Soon" is the standing pattern for any not-yet-live
  product/section** (see C.18) — never leave a dead `#anchor` or
  `https://example.com/` href on an element for something that isn't real
  yet; convert it to one of the three documented variants (full-card
  overlay, compact tooltip, in-place button overlay) instead, matching the
  element's shape. Applied to: 3 homepage hero cards, the Web Hosting▾ and
  Discount Programs▾ mega-menu cards, the Servers/Domains nav items, the
  Plans section's "View Business Hosting Plans" button, and the footer
  Products column — see C.1/C.2/C.5/C.18/C.19.
- **Nav restructuring**: Support▾ dropdown removed entirely (after several
  intermediate trims) and replaced with a single "Open a Ticket" link;
  "My Account" and "Open a Ticket" both point at the real
  `https://hub.serversalad.com` (new tab) — the first genuinely real,
  non-placeholder destinations added to the nav. Blog was added to the main
  nav, then relocated into the topbar next to About/Contact. See C.1.
- **Discount Programs▾ mega-menu was rebuilt to match Web Hosting▾'s
  intro+cards+divider layout** rather than staying a plain flat grid, once
  real card copy existed — see C.1. Its content (card copy, subtitle, and
  the black box's heading/list) went through multiple owner-supplied
  revisions before landing on the final version in Part B; when an owner
  supplies replacement copy for an already-"final" section like this again,
  overwrite the block wholesale rather than trying to merge it in.
- **cpanel-hosting Plans table**: ash-grey `#ececf0` row separators removed
  per owner request, with row padding tightened afterward to compensate for
  rows reading too loosely spaced without them (see C.10) — do both
  together if revisited. The "14-Day Money Back Guarantee" note moved from
  inside the black package header down to under each CTA button, recoloured
  to an owner-supplied exact font-inspector spec (`rgb(127, 133, 136)`) to
  suit its new white background. All 3 "Order ... Salad" buttons now point
  at the real `https://hub.serversalad.com`, replacing the old
  `https://example.com/` placeholder.
- **Sticky package header "condense on scroll" is implemented via
  `IntersectionObserver` + a single CSS class toggle + a short native CSS
  transition — deliberately not a scroll-event handler driving layout
  properties per frame.** That scroll-driven approach was tried, and
  reverted, specifically because it caused real, reported jank (see C.10)
  — recomputing `padding`/`margin`/`max-height` on every scroll frame forces
  a synchronous browser layout reflow that many times per scroll gesture.
  This is the general lesson, not just a one-off fix: **any future
  "something should visually respond continuously to scroll position"
  request should reach for `IntersectionObserver` (or, for genuinely
  continuous scrubbing, a compositor-only property like `transform`/
  `opacity` — never a JS-computed `padding`/`margin`/`width`/`height`/
  `max-height`) before reaching for a `scroll` + `requestAnimationFrame`
  handler that writes layout-affecting inline styles.**
- **Technical Overview section's group headings and list items were
  centred, and its checkmark bullets removed entirely** (plain centred text)
  per owner request — see C.17. A footer/nav thin white separator
  (`.footer { border-top: 1px solid #fff; }`) was also added between the
  footer and whatever section precedes it, after an initial low-opacity
  version wasn't visible enough and was replaced with pure white.
- **cpanel-hosting Plans table: Websites/Storage feature rows now stay
  pinned under the sticky package header while scrolling** (`.cph-table__row
  --pin-1`/`--pin-2`), using a JS-measured `--cph-pkg-header-h` custom
  property (`ResizeObserver`-driven, same pattern as the earlier
  condense-on-scroll header) rather than a hardcoded pixel offset. Hit one
  real bug along the way: `ResizeObserverEntry.contentRect` reports only the
  content box (excludes padding/border), so the header's padding wasn't
  counted and the pinned row rendered ~52px too high, partially hidden
  behind the header — fixed by reading
  `element.getBoundingClientRect().height` inside the observer callback
  instead. A follow-up "small gap above the sticky header" fix (bleeding
  each header cell's background 4px upward) was implemented, then **fully
  reverted** on explicit owner request — that gap is not currently
  "fixed" in the live CSS, on purpose.
- **Discount Programs page** (`discount-programs/index.html`, new this
  round) was built from an empty white page up through many small,
  sequential owner requests rather than one upfront spec — see C.20 for the
  complete design rationale (hero duplication + centring, the tab-switcher
  component and its per-panel left/centre/right alignment, the eligibility-
  criteria-caption naming/link correction, the font-inspector colour
  overrides where the literal spec colour would've been invisible on this
  page's white sections, and the criteria-grid width/alignment geometry
  tied to the tab bar's own column boundaries). Reached from the nav's
  Discount Programs▾ mega-menu, whose 3 cards were converted from
  "Launching Soon" placeholders to real links once this page existed (see
  C.1).
