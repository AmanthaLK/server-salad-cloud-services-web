# Server Salad — Hosting Business Website
_Describes the site as it currently exists — not a change history. Read this top to bottom to understand what's built and why, then continue from here._

## Purpose
Website for a web hosting business. Built and served locally via XAMPP (Apache) from
`c:\xampp\htdocs\serversalad`. Local URL: http://localhost/serversalad/

## How this project is being built
The owner provides a **step-by-step guide**; each step is implemented one at a time —
don't jump ahead to unrequested steps. This README is kept as a **current-state
reference**, not a log — any AI or developer should be able to read it and understand
the site exactly as it exists right now, and continue work, without needing history.

## Conventions (how to work on this repo)
- **Only update this README when the owner explicitly asks.** Make code changes
  without also editing README.md by default. When an update *is*
  requested, update the relevant section in place (Component notes, Open items,
  Decisions, etc.) rather than appending a dated log entry — this file describes
  *what the site is*, not *what was done to it*, so keep it a current-state
  reference even when doing a full pass.
- Standing rules (stack, layout, type, brand) live in their own section below — treat
  them as settled, don't re-litigate them.
- **Narrow scope by default.** When a screenshot/instruction shows one specific
  element, change only that element — don't assume it applies to lookalike elements
  elsewhere (e.g. the hero cards and the Web Hosting▾ mega-menu cards look similar but
  are separate; edits to one don't auto-propagate — see "Open items"). If broadening
  scope seems necessary to avoid visual inconsistency, it's fine to do so, but flag
  that decision to the owner.
- **Never invent unverified factual claims** (fake review scores, fake pricing,
  fabricated statistics/partnerships/logos) — use neutral placeholders and flag them
  clearly as such until the owner supplies real content.
- **Image rule — every image, every time, without being asked:** place it under
  `assets/img/` (its own subfolder for a distinct group, e.g. `partners/`), and rename
  it to a lowercase-hyphenated SEO-friendly filename — never keep an upload's original
  name (camera/export names, "(1)" suffixes, stock-photo IDs, spaces).
- `css/styles.css` is linked from every page with a cache-busting query string
  (`css/styles.css?v=N`, currently **v=252**). **`js/main.js` has its own separate
  `?v=N`** (currently **v=13**) on its `<script>` tag. **Bump the relevant one any
  time that file changes**, so browsers fetch the latest version instead of
  serving a stale cached copy — this caused real confusion once already (see
  Plans section notes below). **Both pages** (`index.html` and
  `cpanel-hosting/index.html`) link both files with these same version numbers —
  bump it in **every** page's tag, not just one, whenever either file changes.

---

## Standing rules (apply site-wide, current state)

### Stack
- **HTML + CSS + JavaScript only.** No PHP, no build tools, no frameworks unless the
  owner's guide says otherwise. Static files served from XAMPP htdocs.
- **One explicit, deliberate exception: a single small PHP API endpoint for live
  pricing.** Owner wants the cpanel-hosting Plans table's prices
  pulled from a real MySQL database in real time, rather than hardcoded. A browser
  can't speak MySQL directly, and DB credentials must never reach client-side
  code (they'd be fully exposed to any site visitor via view-source) — so this
  requires a server-side layer. Owner explicitly chose to add one minimal PHP
  endpoint for this rather than keep prices static. **This is the only PHP in the
  project** — everything else stays HTML/CSS/JS. See "Pricing API" in Component
  notes for the endpoint itself, credential-handling rules, and current status.

### Layout
- **Consistent left/right gutter everywhere.** Every full-width band (topbar, nav,
  hero, sections, future footer) puts its content inside `<div class="container">`.
- `.container` = `max-width: var(--container)` (1240px), centred, `padding: 0 var(--gutter)`.
- `--gutter` = 24px desktop, 16px on ≤600px. Both tokens live in `:root` — change once.
- Full-bleed backgrounds: colour the **outer** section element, keep the inner
  `.container` for content. Never add ad-hoc left/right margins/padding on components.

### Type system
- **Base two families**, the site-wide default for anything not explicitly overridden:
  - **Poppins** (600/700/800) — headings and emphasis via `--font-heading`.
  - **Inter** (400/500/600/700) — body/UI text via `--font-body`.
  - Tokens: `--font-heading`, `--font-body` in `:root` (`css/styles.css`); both fall back
    to the system sans-serif stack if the webfont fails to load.
- **Three more families are layered on top, per-element, not site-wide** (per the
  reference-styling rule — see Decisions — where a specific element's font family/
  weight/size/line-height is matched to a supplied template):
  - **Cairo** (400/600/900) — used on most headings/titles across the homepage and
    footer instead of Poppins: section titles (`.features__title`, `.cloud__title`),
    card titles (`.hero-card__title`, `.cloud-card__title`, `.migration-card__title`),
    the `.hero-card__badge`, `.plans__title`/`.plans__note`, `.footer__col-title`,
    `.footer__cta`. Two-line card titles generally follow a **600 (line 1) / 900 (line
    2, via a `<strong>` or `.feature__title-accent`)** split.
  - **Manrope** (300/400/500/600) — used on most body/description text instead of
    Inter: `.hero-card__desc`, `.feature__desc`, `.eco__label`/`.eco__desc`,
    `.plans__subtitle`, `.migration__box-label`/`.migration__box-note`/
    `.migration-card__desc`, `.cloud-card__desc`, `.review-btn`, the whole footer
    (`.footer__tagline`, `.footer__tagline-desc`, `.footer__links a`,
    `.footer__contact-line`, `.footer__bottom p`), and the topbar (`.topbar`, weight 500).
  - **Montserrat** (600/800) — used narrowly on the hero title (`.hero__title` 800 /
    `.hero__title-accent` 600) and the main nav links (`.nav__link`, weight 600).
  - All three are pinned to specific weights in the Google Fonts `<link>` in both
    pages' `<head>` — add a new weight there before using it in CSS, or the browser
    falls back to a synthetic (fake-bolded) weight instead of the real font file.
  - `--font-heading`/`--font-body` are the *base*, not the whole story: when matching
    a new element's typography, check whether it already has an explicit
    `font-family` override before assuming it still inherits Poppins/Inter.

### Brand name
- The brand name is **two words: "Server Salad"** (owner's instruction). Use this
  spelling in **all human-readable text** — page copy, headings, `alt`/`aria-label`
  text, future page titles. The tab title is already "Server Salad Cloud Services".
- **Machine-readable slugs stay one lowercase word `serversalad`** and must NOT be
  changed: the project folder (`c:\xampp\htdocs\serversalad`), the local URL, image
  filenames (`serversalad-logo.png`, `serversalad-favicon.svg`), CSS classes, and the
  `info@serversalad.com` / `+94 71 200 0006` contact details.
- If you see the one-word "ServerSalad" in visible text anywhere, it's a bug — fix it
  to the two-word form.

### Brand colours
- Official brand colours (from the logo): **dark slate `#323D41`**, **orange `#F57E20`**.
  Tokens: `--brand-dark`, `--brand-orange` in `:root` (`css/styles.css`).
- Usage rule (owner's instruction): these don't need to appear everywhere. Use them at
  genuine brand touchpoints; elsewhere prefer a broader, more visually attractive UI
  accent palette (the site currently uses an orange→red gradient, `--accent`/`--accent-2`,
  for the hero cards/nav/buttons that haven't been switched to brand colours) rather than
  restricting the whole site to just these two colours.
- The Plans section (see Component notes) uses brand orange throughout (badge, hover
  border, buttons); the hero cards and nav use the rose/red `--accent` palette. This
  split is intentional, not an inconsistency to fix.

---

## Browser tab title
- Every page's `<title>` must read **"Server Salad Cloud Services"** (owner's
  instruction — use this exact title everywhere, not a per-page variant). Currently
  set on `index.html`; carry it forward verbatim to any new page added later.

## Project structure
```
serversalad/
  README.md                        <- this file (current-state reference)
  index.html                       <- the whole page: topbar, nav, hero, features,
                                       sustainability, plans, locations, migration,
                                       cloud infrastructure, then <div id="site-footer">
  css/
    styles.css                     <- all styles (design tokens in :root at top)
  js/
    main.js                        <- nav dropdowns/mega menu, mobile hamburger,
                                       hero logo carousel, shared header+footer
                                       fetch/inject, live pricing + billing toggle
  partials/
    header.html                    <- the ONE copy of the topbar+nav markup
    footer.html                    <- the ONE copy of the footer markup — every page
                                       includes both via a fetch, not by pasting them in
  cpanel-hosting/
    index.html                     <- 2nd page, URL /serversalad/cpanel-hosting/ —
                                       Hero, Plans/comparison, Features, Why Server
                                       Salad, Business Email, Backups (see below)
  api/
    pricing.php                    <- the ONE server-side file in the project —
                                       live pricing for the cpanel-hosting Plans
                                       table (see "Pricing API" in Component notes)
  downloads/                       <- staging folder, not part of the live site.
                                       Owner drops newly-downloaded image files here;
                                       once asked to use one, it gets renamed and moved
                                       into the right assets/img/ subfolder, and this
                                       folder is emptied out again. Tracked in git via
                                       downloads/.gitkeep, but its CONTENTS are
                                       git-ignored (see .gitignore) so raw downloads
                                       never get committed.
  assets/
    img/
      brand/                        <- serversalad-logo.png (nav logo, icon only),
                                       serversalad-logo-full.png (footer logo, icon +
                                       wordmark), serversalad-favicon.svg
      photos/                       <- eco-forest-canopy.jpg (sustainability section
                                       background photo)
      graphics/                     <- world-map-dots.png (Locations + cph Why-section
                                       map), jetbackup-illustration.png (cph Backups
                                       screenshot), cpanel-dashboard-devices.webp
                                       (cph Hero device mockup)
      partners/                    <- 6 hero "powered by" carousel logos (partners-*.png)
      flags/                       <- uk-flag.svg (rect, used in the cph comparison
                                      table's Data Center row AND above its top-left
                                      intro cell), uk-flag-circle.png (round badge,
                                      homepage Locations card)
      hero/                         <- 4 homepage hero-card icons, reused by the
                                       matching Plans-card and Web Hosting▾ mega-menu
                                       cards (see Hero notes)
      why-choose/                   <- 6 homepage "Why Choose Server Salad" card icons
      migration/                    <- 4 homepage "Effortless cPanel Transfer" card icons
      cloud/                        <- 6 homepage "Our Cloud Infrastructure" card icons
      reviews/                      <- google-logo.png / trustpilot-logo.png, homepage
                                       review-button logos
      features/                    <- 12 cph "Features" card icons (SEO-named by card)
      why/                         <- 3 cph "Why Server Salad" card icons
      email/                       <- 6 cph "Business Email" card icons
      backups/                     <- 6 cph "Backups" card icons
      apps/                        <- 7 one-click-install app logos, real brand
                                       colours (not masked/recoloured), used in the
                                       Web Hosting▾ mega-menu's app-logos strip
      nav/                         <- small nav-only UI icons not tied to a card
                                       grid (currently: the mega-menu app-logos
                                       link's mouse-pointer icon)
```
(Every `assets/img/<section>/` icon is a single-colour SVG with `fill="currentColor"`;
they're recoloured to `--brand-orange` in CSS via `mask` — see Assets.)

## Assets
**Standing rule (applies to every image, always — see Conventions above).**

- **`assets/img/brand/`** — the site's own identity marks, kept together in one
  subfolder since they're a distinct group of files (see Conventions above): the nav
  logo, the footer's full logo, and the favicon.
  - **Logo:** `brand/serversalad-logo.png` — icon-only mark (cloche + servers on a
    plate, dark rounded-square bg). Nav shows the icon **only** (no text wordmark, per
    owner), rendered at 46px with a 9px border-radius; link has
    `aria-label="Server Salad home"` for accessibility. To swap the logo later, replace
    this file (keep the name) or update the `src` in `index.html`.
  - **Favicon:** `brand/serversalad-favicon.svg`, wired up via
    `<link rel="icon" type="image/svg+xml" href="assets/img/brand/serversalad-favicon.svg">`
    in `index.html`'s `<head>` — carry this same tag to any new page added later. Note:
    the file is a large (~227KB) SVG that wraps embedded base64 raster images rather
    than pure vector paths — works fine in modern browsers, but if favicon load time
    ever matters, consider re-exporting a lighter true-vector or small PNG version.
- **Partner/tech logos:** `assets/img/partners/` — cpanel, litespeed, cloudlinux,
  softaculous, jetbackup, letsencrypt. Used in the hero's "powered by" carousel (see
  Hero notes) — pre-coloured white/light PNGs, further forced solid white via CSS
  `filter: brightness(0) invert(1)` for a consistent look regardless of source colour.
  DirectAdmin is not part of the carousel and **its file
  (`partners-directadmin.png`) is not on disk** — if it needs to come back, it'll
  need to be re-supplied by the owner, not just re-added to the HTML.
- **Sustainability background photo:** `assets/img/photos/eco-forest-canopy.jpg` — aerial
  forest/canopy shot, used as a backdrop layer behind the sustainability section's dark
  green gradient (see Component notes for the layering approach). **File is ~8MB**
  (5272×3948) — no image-optimisation tooling available in this environment to
  resize/compress it, so it's being served at full size. Worth compressing (e.g. to a
  ~1600px-wide JPG at moderate quality) before launch.
- **World map graphic:** `assets/img/graphics/world-map-dots.png` — a dotted-pattern world
  map, 1920×1080, SEO-friendly slug. Used full-width in the homepage Locations
  section, **and** (smaller, inside a bordered card, same London pin coordinates
  `left:46.5%; top:37%`) in the cpanel-hosting "Why Server Salad" section — see
  Component notes.
- **UK flags — `assets/img/flags/`:**
  - `flags/uk-flag.svg` — flat rectangular UK flag, no rounded corners (open-source
    "flag-icons" library, MIT-licensed, `id="flag-icons-gb"`). **Used** twice on the
    cpanel-hosting comparison table, both via `.cph-table__flag` (2px radius +
    `box-shadow` hairline outline so the flag's white areas don't vanish against the
    white cells):
    - a 22×16px icon in the "Data Center" row (×3, one per column), replacing plain
      "UK" text;
    - a 34px-wide badge above the heading in the table's top-left intro cell (see
      "Plans & feature comparison" — `.cph-table__intro` / `.cph-table__intro-flag`).
  - `flags/uk-flag-circle.png` — 512×512, ~22KB circular Union Jack with a grey
    ring. **Used** as a 26px round badge left of the "London, UK" heading in the
    homepage Locations hover card (`.locations__card-flag`).
- **JetBackup dashboard screenshot:** `assets/img/graphics/jetbackup-illustration.png`
  (same `graphics/` folder as the world map above and the device mockup below —
  screenshots/illustrations, as distinct from `photos/`'s actual photography) —
  1195×614, owner-supplied. Used in the cpanel-hosting "Backups" section's right
  column, inside a light rounded "device" frame (`.cph-backups__frame`). ⚠️ Should
  be Server Salad's **own** JetBackup panel, not another host's customer session —
  confirm the file on disk is a genuine Server Salad one (see "Open items").
- **Homepage section card icons — `assets/img/hero/`, `why-choose/`, `migration/`,
  `cloud/`.** Same idea and technique as the cpanel-hosting icon folders below, just
  for the homepage's Hero cards, "Why Choose Server Salad" grid, "Effortless cPanel
  Transfer" (migration) grid, and "Our Cloud Infrastructure" grid respectively —
  owner-supplied SVGs, one per card, filename = the card's meaning as a
  lowercase-hyphenated slug (e.g. `hero/cpanel-hosting-icon.svg`,
  `migration/api-transfers-icon.svg`, `cloud/litespeed-icon.svg`), saved with
  `fill="currentColor"` (or `stroke="currentColor"` for the one stroke-based icon,
  `why-choose/community-perks-icon.svg`) and masked via CSS the same way (see
  below). The two hero-card icons for **cPanel Hosting** and **cPanel Business
  Hosting** are deliberately reused as-is (same file, same `url(...)`) by the
  matching Plans-section plan card and Web Hosting▾ mega-menu card, so that product's
  icon glyph stays identical everywhere it appears (see Hero and Navigation notes).
  Separately, `assets/img/reviews/` holds `google-logo.png` / `trustpilot-logo.png` —
  the two homepage review-button logos, plain `<img>`s rather than masked SVGs
  (see "Why Choose Server Salad" notes).
- **cpanel-hosting section card icons — `assets/img/features/`, `why/`, `email/`,
  `backups/`.** Each section's feature-card icons live in its own subfolder, one
  SVG per card, filename = the card's meaning as a lowercase-hyphenated slug
  (e.g. `features/lightning-fast-hosting.svg`, `backups/off-site-storage.svg`).
  All are **single-colour SVGs saved with `fill="currentColor"`** (the source
  files, mostly Noun Project exports, arrive as `fill="#00aec0"` — always swap that
  for `currentColor` before saving). They are **not** `<img>`-embedded: each card's
  `<span class="...-card__icon" style="--<set>-icon: url(...)">` points at the file,
  and CSS paints it with `background-color: var(--brand-orange)` + `mask: var(--…-icon)`
  so the brand colour stays defined once in CSS (same idea as the partner-logo
  `filter` recolour). To swap an icon, replace the file (keep the name) or point
  the `--…-icon` custom property at a new one.
- **Full logo (icon + wordmark):** `assets/img/brand/serversalad-logo-full.png` —
  owner supplied as `ServerSalad_ (1).png`, renamed per the standing rule. 9361×2283,
  the complete Server Salad mark (cloche/servers icon + "SERVERSALAD" wordmark in
  `--brand-dark`/`--brand-orange`), used in the footer's brand column. Same `brand/`
  folder as the other two identity marks above, but different file from
  `brand/serversalad-logo.png` (icon only, used in the nav) — **don't merge or
  overwrite either**, they serve different spots.
  - Note: the wordmark reads "SERVERSALAD" as one word — it's baked into the
    logo's pixels as a designed brand mark (like "FedEx" or "PayPal" wordmarks),
    not text I wrote, so it doesn't violate the "Server Salad" two-word rule under
    "Brand name" above, which governs text I author.
- **cPanel dashboard device mockup:** `assets/img/graphics/cpanel-dashboard-devices.webp`
  — owner supplied as `cpanel_responsive2.webp` (underscore, not hyphenated), renamed
  per the standing rule. 1950×1184, a real cPanel interface screenshot shown across
  desktop/tablet/phone device frames (transparent background, no separate lifestyle
  photo baked in). Used in the `cpanel-hosting/` page's hero — see Component notes.
- Other images (icons, hero art, etc.) also go under `assets/img/`, named with
  hyphenated lowercase SEO-friendly slugs.

---

## Component notes (current state)

**Pages.** `index.html` (home, everything below) and `cpanel-hosting/index.html`
(2nd page — Hero, Plans/comparison, Features, Why Server Salad, Business Email,
Backups; see "cpanel-hosting page" below). Both share the header/footer partials —
see "Multi-page architecture".

**`index.html` page order (top to bottom).** New sections are appended at the end
unless the owner says otherwise — update this list when that happens:
1. Topbar + main nav (sticky)
2. Hero (dark)
3. "Why Choose Server Salad" (light grey)
4. Sustainability (dark green)
5. Plans (white → ash gradient, shared wrapper) …
6. … Locations (same wrapper/gradient)
7. Migration (dark)
8. Cloud infrastructure (light "sky")
9. Footer (solid black) — currently last, closes the page
- The light/dark alternation is deliberate: each new full-width band should contrast
  with the one above it.

### Navigation
- Two rows: black **topbar** (`.topbar`) + dark **main nav** (`.nav`, sticky).
- **Topbar:** two groups, spread to opposite edges of the container via
  `.topbar__inner { justify-content: space-between }`:
  - Left: email `info@serversalad.com` (mailto:) and phone `+94 71 200 0006`
    (tel:+94712000006), each with a small icon.
  - Right: **"About" and "Contact"** — right-aligned so their right edge lines up
    with "My Account" in the row below.
  - Whole topbar text is `Manrope` weight 500, 13px, `line-height:20px`, colour
    `--text-muted`.
  - No VAT toggle / currency / status / live-chat.
- **Main nav:** brand = logo icon only, then the whole link group flows together,
  right-aligned as one unit (`.nav__menu { justify-content: flex-end }`):
  - **Web Hosting ▾** (mega menu — see below)
  - **Servers** (plain link, no dropdown, `#servers`) — *not yet renamed to match the
    hero's "VPS Hosting" card, see "Open items"*
  - **Domains** (plain link, no dropdown)
  - **Discount Programs ▾** (mega menu — see below): Student & Academic Programs,
    Startup & Business Programs, Agency & Freelancer Programs
  - **Support ▾**: Knowledgebase, Submit a Ticket, System Status, Contact Support
    (placeholder items, real names still needed)
  - **My Account** (white pill button)
  - *(About / Contact live in the topbar, not here — see above.)*
  - `.nav__link` (Web Hosting▾/Servers/Domains/Discount Programs▾/Support▾) is
    `Montserrat` weight 600, 12px, `line-height:18px`, `rgba(255,255,255,.9)`;
    hover colour is `--brand-orange`.
  - **My Account** (`.btn.btn--account`) is `Montserrat`, `rgb(54,51,65)` text,
    weight 700/14px. On hover, the **background** turns `--brand-orange`, text stays
    its normal dark colour.
  - The whole group is pushed flush to the container's right edge via `.nav__menu`'s
    `justify-content: flex-end`, so the screen-edge→logo gap on the left equals the
    My-Account→screen-edge gap on the right (owner-specified symmetry).
- All submenu links use placeholder `#anchor` hrefs — swap for real pages later.
- Dropdowns open both ways: **click** (`[data-dropdown]` + `.is-open` on the `<li>`,
  toggled in `initNav()`, `js/main.js`) and, on real mouse/trackpad input, **hover**
  (`mouseenter` opens, `mouseleave` closes after a ~180ms delay so crossing the small
  gap between the link and the panel below it doesn't close it early). Hover is gated
  behind `matchMedia("(hover: hover) and (pointer: fine)")` — on touchscreens, where
  CSS/DOM hover behaves unreliably, only the click toggle applies, unchanged from
  before. Click-away or Esc closes any open dropdown either way. `.nav__item {
  position: relative }` so a normal `.nav__sub` list anchors under its own link.
- **Web Hosting ▾ and Discount Programs ▾ are mega menus**, not simple lists
  (`.nav__item.has-mega` + `.nav__mega`): full-width panels spanning the entire `.nav`
  header edge-to-edge, with an inner `.container` so the content lines up with the
  site gutter. Panel background is white (`.nav__mega`), with a **2px solid
  `--brand-orange` bottom border** (was a plain grey `#e3e3e8` hairline — changed so
  the panel's lower edge reads as an intentional brand accent rather than blending
  into whatever's behind it on the page).
  - How the full width works: `.has-mega` forces `position: static` on that `<li>`
    (undoing the `position: relative` normal items get), so `.nav__mega`'s
    `position: absolute; left:0; right:0` resolves against `.nav` itself instead of the
    `<li>` — that's what makes it span edge-to-edge instead of a narrow dropdown box.
  - **Discount Programs▾** is the plain kind: a simple auto-fit grid of `.mega-card`s
    (`.nav__mega-inner`), no intro column. Cards: **Student & Academic Programs**,
    **Startup & Business Programs**, **Agency & Freelancer Programs** — real titles
    (shared "Programs" suffix bolded on all 3), placeholder descriptions (owner only
    supplied the 3 names so far). Icons are hand-drawn inline SVGs, `--accent`/
    `--accent-2` gradient icon tile — not changed since no request has targeted this
    menu.
  - **Web Hosting▾ is the one mega menu with a 3-column layout**
    (`.nav__mega-inner--intro`, `grid-template-columns: 1fr 260px` — the left `1fr`
    itself contains a nested `300px 1fr` split for the intro/cards, see below), built
    from an owner-supplied reference design:
    1. **Intro column** (`.nav__mega-intro`, 300px): `<h3>` "**Web** <strong>Hosting</strong>"
       — Montserrat 700, 33px/33px, uppercase, `rgb(40,39,39)` base + the accent word
       in the site's red→orange gradient (`linear-gradient(90deg, var(--accent),
       var(--accent-2))`, `background-clip:text` — same gradient as `.hero__title-accent`,
       see Hero notes), `white-space:nowrap` so it stays one line. Then a description
       (`.nav__mega-intro-desc`, Cairo 500, 16px/24px, `rgb(122,122,122)`) — this is
       **real, owner-supplied copy**, the same "High-speed NVMe Web Hosting..." text
       used on the hero cards, not new copy written for this spot.
    2. **Vertical divider** (`.nav__mega-intro-divider`, 1px, `#e3e3e8`) — a flex
       sibling of the cards inside `.nav__mega-middle` (not a separate grid column),
       so it stretches to match the *cards'* content height specifically, not the
       taller Key Features box's height (that would need the whole `1fr`/`260px` grid
       row to `align-items:stretch`, which was tried and reverted — see below).
    3. **Cards** (`.nav__mega-cards`, stacked top-to-bottom, not side-by-side —
       matches the reference's product-row layout): **cPanel Hosting**, **cPanel
       Business Hosting**. Each card is icon (masked SVG, same files as the matching
       hero card, see Hero notes) + title (`.mega-card__title`, Montserrat 500,
       22px/26px, `rgb(40,39,39)`, no bold accent on either word) + **real
       description text copied verbatim from the matching hero card** (this resolves
       the earlier placeholder-copy gap — see "Open items" for what's still open).
       No "Learn more →" link and no "Most Popular" badge on either card (both
       removed per owner; their `.mega-card__cta`/`.mega-card__badge` CSS rules
       have since been deleted too).
    4. **"Key Features" / "cPanel Business Hosting Difference" box**
       (`.nav__mega-features`, 260px column, solid black `var(--bg-topbar)` —
       stretches via `align-items:stretch` on the outer 2-column grid to match
       `.nav__mega-left`'s full height, so its bottom edge lines up with the app-logos
       strip's bottom, not just the cards'): two checklists, white text
       (`Manrope` 300, 13px/20px), brand-orange checkmarks, heading accent word in the
       same red→orange gradient (Montserrat 600, 18px/18px). **Both lists are real,
       owner-supplied plan-spec copy** (not placeholder) — "Key Features": LiteSpeed
       Cache Manager, cPGuard Security Shield, Automated JetBackups, Free SSL
       Certificates, Node.js & Python Support. "cPanel Business Hosting Difference":
       Boosted CPU & Dedicated RAM, Unmetered Traffic Bandwidth, High-Traffic
       Optimization, 24/7 Priority Ticket Support, Less Contended Hardware.
    5. **App-install logos strip** (`.nav__mega-apps`), starting under the intro
       description (left-aligned with it) but kept to one line even though that
       overflows the 300px intro column's own width and runs past the divider into
       the cards column — the owner explicitly confirmed that's acceptable, and the
       box is width-capped (`max-width: calc(100% - 28px)`) so it still can't reach
       the Key Features box. Light grey box (`#f8f8fa`, matching the card tiles) with
       the same **travelling-bolt border animation** as `.plans__note-beam` (see
       Plans notes) — single stroke, blurred for a hazy-glow look, not the pill's
       two-stroke glow+core version. Contents: 7 app-install logos (WordPress,
       Joomla, Drupal, Moodle, phpMyAdmin, Akaunting, OrangeHRM —
       `assets/img/apps/`, kept in their real brand colours, **not** masked to
       `currentColor` like the site's other icons, since these are recognisable
       third-party logos) then a "See 300+ apps with **1-click** install on cPanel"
       link (Cairo 700, 14px/14px, brand-orange) with a mouse-pointer icon
       (`assets/img/nav/mouse-pointer-icon.svg`) that only animates — a shared
       bounce on the whole link, a glow pulse on the text, plus its own press-squash
       and a two-ring click-ripple — while `.nav__item.is-open`; unconditionally
       infinite animations kept running in the background while the menu was closed
       (`visibility:hidden` doesn't pause CSS animations) and got caught mid-cycle on
       open, so all 4 are now scoped to the open state and restart fresh at 0% every
       time it opens. Both the icon and the "300+" figure are placeholders — see
       "Open items".
  - `.mega-card__icon` tile (both mega menus) still uses the general
    `--accent`/`--accent-2` gradient tile background — only the icon *glyph* inside it
    is masked per-card.
- **Support ▾** is still a simple `.nav__sub` list dropdown (not a mega menu) with
  placeholder items.
- Mobile (≤980px): hamburger (`#navBurger`) toggles `.nav__menu.is-open`; both simple
  dropdowns and mega menus collapse to a stacked-list look. The Web Hosting▾ intro
  column stacks above the card list (divider dropped, app-logos row wraps instead of
  overflowing), matching the general "mega menus hide their description/CTA text and
  show plain rows" collapse the other, introless mega menu (Discount Programs▾) uses.

### Hero
- `<section class="hero">`, right after the nav, full-bleed dark gradient (purple →
  navy → teal) background with a faint dot-grid overlay.
- **Fills the screen on load**: `.hero { min-height: calc(100vh - 108px); display:
  flex; align-items: center; }` — 108px = topbar (34px) + main nav (74px) height, so
  the hero fills exactly the remaining viewport on load with its content vertically
  centred. `.hero__inner` has an explicit `width: 100%` to keep behaving like a normal
  centred `.container` as a flex item. If the header's height ever changes, update the
  `108px` here to match.
- Content inside `.hero__inner.container`:
  - `.hero__title` — "**Sri Lankan Support.** European Infrastructure.<br>Zero
    Compromise." First clause is `.hero__title-accent` (red→orange gradient,
    `linear-gradient(90deg, var(--accent), var(--accent-2))`, `background-clip:text`
    — was a solid `--brand-orange` fill originally), rest white. Font-family
    `Montserrat`: base text weight 800, accent weight 600. This same gradient is
    reused on the Web Hosting▾ mega-menu title and the cpanel-hosting hero title's
    accent word (see their notes) for a consistent "gradient accent word" look.
    Uppercase via CSS. The `<br>` is forced so "Sri Lankan Support. European
    Infrastructure." sits on line 1 and "Zero Compromise." on line 2 —
    `font-size: clamp(26px,3.6vw,40px)` is tuned so line 1 actually fits the 1240px
    container at that weight; if the copy changes and wraps wrong, the fix is almost
    always the clamp's max px, not the `<br>` placement.
  - `.hero__cards` — 4 white cards (`.hero-card`), all with **real, owner-approved
    copy**:
    - **cPanel Hosting** — *only card with a badge*, "Most Popular" —
      "High-speed NVMe Web Hosting featuring intuitive cPanel control. Launch blogs,
      portfolios, or small online stores in seconds with rock-solid reliability and
      zero technical friction."
    - **cPanel Business Hosting** — no badge —
      "Engineered for growth with dedicated RAM, extra compute power, and 24/7
      priority support. Keep high-traffic sites and e-commerce stores fast,
      responsive, and online."
    - **VPS Hosting** (renamed from "Servers") — no badge —
      "High-performance Cloud VPS Hosting featuring full root access and dedicated
      NVMe resources. Built for custom applications, complex workloads, and
      developers."
    - **Domains** — no badge —
      "Secure your brand instantly with fast domain name registration, free DNS
      management tools, and built-in privacy protection from one easy dashboard."
    - None of these four descriptions carry any bold spans — plain text throughout.
  - Icons (`.hero-card__icon`) are **`--brand-orange`**. The glyph itself is an
    owner-supplied SVG file per card (`assets/img/hero/cpanel-hosting-icon.svg`,
    `cpanel-business-hosting-icon.svg`, `vps-hosting-icon.svg`, `domains-icon.svg`)
    rather than hand-drawn inline markup, painted via the same masked-external-SVG
    technique used across the site (see the cpanel-hosting Features notes'
    `.cph-feature__icon` for the original version of this pattern):
    `.hero-card__icon-img` sets
    `background-color: currentColor` and masks it with the file referenced through a
    per-card `--hero-icon` custom property, so recolouring only ever means changing
    `.hero-card__icon`'s `color`, never editing the SVGs. These same four files are
    reused for the matching Web Hosting▾ mega-menu cards and Plans-section plan cards
    (see their notes) so the icon glyph stays identical everywhere the same
    product is represented.
  - `.hero-card__title` is `Cairo` 600, 26px, `rgb(40,39,39)`. `.hero-card__desc` is
    `Manrope` 400, 15px/23px, `rgb(40,39,39)`.
  - **Each card is a whole-tile `<a class="hero-card" href="...">`** — there is no
    separate price/CTA button on the hero cards; no price is shown here at all
    (live or static). Destinations:
    - cPanel Hosting → `/serversalad/cpanel-hosting/` (same tab)
    - cPanel Business Hosting → `https://example.com/` (new tab, placeholder)
    - VPS Hosting → `https://example.com/` (new tab, placeholder)
    - Domains → `https://example.com/` (new tab, placeholder)
    - Live pricing (`data-price="starter_salad"`) is **not** wired into the hero at
      all — it still works elsewhere (Plans section title/card, cpanel-hosting
      table).
  - **`.hero-card__badge`** ("Most Popular", cPanel Hosting only) is an outlined pill
    (`#fff` background, `1.5px solid var(--brand-orange)` border, orange text)
    floating **half in/half out of the card's top edge, centred**
    (`top:-14px; left:50%; transform:translateX(-50%)`).
    `.hero-card` does not have `overflow:hidden` — the floating badge needs to
    render *outside* the card bounds, so adding `overflow:hidden` back would clip
    it.
- **`.hero__strip`** — "powered by" partner-logo carousel below the cards: JetBackup,
  CloudLinux OS, LiteSpeed, Softaculous, cPanel, Let's Encrypt (DirectAdmin removed,
  file kept on disk unused).
  - **Step-and-pause carousel** (show 4 at a time, slide one step left, hold ~1s, slide
    again — not continuous scroll — plus drag support):
    `.hero__logos-viewport` (`#logosViewport`, `overflow:hidden`) is a fixed "window";
    inside it, `.hero__logos` (`#heroLogos`) is a track holding the 6 logos **twice**
    (2nd copy `aria-hidden`) so it loops seamlessly — after animating exactly one full
    original-set width, position resets to 0 instantly (transition off for that one
    frame) landing on visually identical content.
  - `js/main.js`: `setInterval(autoStep, STEP_MS + PAUSE_MS)` where `STEP_MS = 600`
    (CSS-transitioned slide duration) and `PAUSE_MS = 1000` (hold time) — each tick
    advances `stepIndex` by one slot and animates `translateX` via inline
    `transition`. Each logo slot's width = viewport width ÷ visible-count (4 desktop /
    3 ≤760px / 2 ≤480px), recomputed on resize via `measure()`, set as the
    `--logo-slot` CSS custom property.
  - **Drag/swipe**: Pointer Events on `#logosViewport` — `pointerdown` starts a drag
    (captures the pointer, tracks 1:1 with no transition), `pointermove` follows the
    pointer freely, `pointerup`/`pointercancel` snaps to the nearest slot and resumes
    the step timer. Also pauses on `mouseenter` (resumes on `mouseleave`).
  - No prev/next arrow buttons — auto-step + drag are the only ways to move it.
- Mobile (≤600px): cards stack to a single column; logo strip gap tightens.

### "Why Choose Server Salad" (light section, after the hero)
- `<section class="features">`, light grey background (`#f7f7f9`). Centred heading
  **"Why Choose Server Salad for High-Performance Hosting?"** — `Cairo` 400,
  `clamp(26px,3vw,36px)`, `line-height:1`, `rgb(40,39,39)`. Underline bar
  (`.features__underline`) is **150px × 4px, flat solid `--brand-orange`, sharp
  square corners** (`border-radius:0`). **This flat-150×4-solid-orange treatment is
  the shared underline style** — see also Sustainability, Migration, and Cloud
  infrastructure sections below, all using the same look for visual consistency
  across the homepage.
- 3-column × 2-row grid (`.features__grid`) of 6 items (`.feature`): icon
  (**`--brand-orange`**), then a **two-line title** (`.feature__title`) — `Cairo`,
  28px/28px (unitless `line-height:1` so it holds at any size), `rgb(40,39,39)`,
  uppercase. The **last word of each title is wrapped in
  `<span class="feature__title-accent">`** (`display:block`, so it wraps to its own
  line automatically — no `<br>` needed) at **weight 900**, while the rest of the
  title stays **weight 600**. Description (`.feature__desc`) is `Manrope` 400,
  16px/24px, `rgb(122,122,122)` — plain text, no bold spans.
  - The 6 cards (states concrete claims, keep in sync with what Server Salad
    actually offers): **Free 24/7 Expert / Support** (live-chat bubble icon),
    **Saturday Live Help / Sessions** (headset icon), **100% Licensed / Software**
    (verified checkmark badge), **Creator & Community / Perks** (gift-box icon),
    **Advanced CPGuard / Security** (shield icon), **Local Care, European / Power**
    (lightning-bolt icon). Full description text is in the HTML; the `/` above marks
    the line-1/line-2 (600/900) split, not a literal slash in the copy.
  - Icons (`.feature__icon-img`, owner-supplied SVG files under
    `assets/img/why-choose/`) use the same masked-external-SVG technique as the hero
    cards (see Hero notes) — `background-color: currentColor` masked through each
    card's own `--why-icon` custom property, inheriting `.feature__icon`'s
    `--brand-orange`.
  - Deliberately **no background photo** — plain light-grey background instead of a
    stock photo without known licensing; owner can supply a real one later.
  - Responsive: 3 columns → 2 (≤860px) → 1 (≤560px).
  - `.features__reviews` — 2 pill buttons centred below the grid: "Reviews on
    Google" and "Reviews on Trustpilot", each with the brand's real logo as a plain
    18×18px `<img>` (`assets/img/reviews/google-logo.png` /
    `trustpilot-logo.png`, owner-supplied files — not hand-drawn SVG
    approximations), and an orange arrow (`→`) that nudges right on hover. White
    background with an **8px corner radius** (was a full pill — squared to match
    the Plans-card and cph "Order …" buttons), subtle border/shadow, lifts
    slightly on hover. Text is `Manrope` 600, 14px/20px,
    `rgb(76,73,96)`. Spacing is deliberately roomy
    (`gap: 28px` between the two pills, `margin-top: 76px` under the grid,
    plus a small `padding-bottom` so the hover-lift doesn't crowd the section edge).
    **Real owner-supplied destinations**, both opening in a new tab
    (`target="_blank" rel="noopener"`):
    - Google → `https://share.google/9Emq2d350s95Vys2X`
    - Trustpilot → `https://www.trustpilot.com/review/serversalad.com`

    No star rating or review count is shown (deliberately — no unverified rating
    figure). Stacks to full-width buttons on ≤560px.

### Sustainability (dark green section, after "Why Choose Server Salad")
- `<section class="eco">`, full-bleed dark green gradient background (`.eco__bg`,
  separate from the hero's purple/navy one).
- Single centred column (`.eco__inner`, flex-column, `text-align:center`): label +
  heading + orange underline bar + description. No stat cards, no CTA button (both
  removed per owner) — this is the full content of the section.
- **Content (owner-supplied):**
  - Label (`.eco__label`): **"100% Renewable Energy"**. Style: `Manrope` 600,
    12px/18px, colour is the `--eco-green-light` token, `rgb(95,227,154)`. Owner's
    brief calls this a "Pill/Badge" but it renders as plain coloured text, not an
    actual pill shape — see "Open items".
  - Heading (`.eco__title`): **"Sustainable Hosting Powered by"** (white) + **"100%
    Green Energy"** (`.eco__title-accent`, `--brand-orange`). Style: `Cairo` 600, up
    to 35px (responsive), `line-height:1.2` (≈42px at max size), base text
    `rgb(255,255,255)` — the accent phrase keeps `--brand-orange` rather than a
    uniform dark colour, per the standing reference-styling rule (match sizing, not
    colour).
  - Description (`.eco__desc`): "Power your website on enterprise European
    infrastructure running on 100% renewable energy. Our infrastructure partners fund
    tree planting and climate projects through Ecologi, ensuring every Server Salad
    account directly supports global reforestation while delivering maximum speed with
    zero carbon compromise." (Names **Ecologi** — owner-supplied claim, not verified
    independently.) Style: `Manrope` 300, 15px/24px, `rgba(255,255,255,.78)`.
  - Underline (`.eco__underline`) — same **150px × 4px** box as the other section
    underlines, but **not** their shared flat-solid-orange fill: this one is a
    3-stop gradient, `linear-gradient(90deg, #2f9e44, var(--accent), var(--accent-2))`
    (green → red → orange) — a deliberate one-off exception for this section only,
    tying into its green "sustainability" theme. See "Decisions" for the underline
    unification rule this is an exception to.
  - **"Ecologi" is a link** (`.eco__link`) to `https://ecologi.com/`, opening in a new
    tab (`target="_blank" rel="noopener"`). It needs its own CSS because the site's
    global `a { color: inherit; text-decoration: none }` reset would otherwise make it
    look identical to the surrounding text: white + semibold + underlined, turning
    `--brand-orange` on hover/focus. Underlined rather than colour-only so it reads as
    a link without relying on colour perception. **This is the only inline text link
    in the page body so far** — reuse this pattern (or promote `.eco__link` to a
    shared class) if another one is added.
- Uses the `--eco-green-light` token (this section only — not part of the site's
  brand-colour or general accent palette).
- **Background photo:** `.eco__photo` — a layer behind `.eco__bg`
  (`z-index: -1` vs `.eco__bg`'s `0`; `.eco` itself has `z-index: 0` to contain that —
  without it the `-1` would escape past the page's white body background instead of
  staying confined) showing `assets/img/photos/eco-forest-canopy.jpg` at full strength.
  `.eco__bg`'s gradient is `rgba(...)` at ~68–80% alpha (translucent, not opaque) so it
  tints over the photo rather than hiding it completely. `background-position: center
  center`, `background-size: cover`, `background-attachment: fixed` — the photo stays
  fixed relative to the viewport while the page scrolls past (a parallax effect).
  `background-attachment: fixed` is unreliable on mobile Safari/iOS, which falls back
  to normal scrolling there — expected, not a bug. See "Assets" for the file's size
  caveat.

### Plans + Locations (one continuous section, after Sustainability)
- `<section class="plans">` and `<section class="locations">` are wrapped together in
  `<div class="plans-locations">` and treated as **one continuous visual section**
  rather than two separately-coloured blocks: the wrapper carries a single top-to-
  bottom gradient background, `linear-gradient(to bottom, #ffffff 0%, #f5f5f7 35%,
  #e2e2e8 100%)` — pure white at the top of Plans, fading to a clearly visible
  ash-grey by the bottom of the map (owner asked for stronger contrast than the
  first attempt, `#f0f0f2`, gave) — and the two inner `<section>`s no longer have
  their own flat background
  colours (removed `.plans`'s `#fff` and `.locations`'s `#f7f7f9`), so there's no
  hard seam where one used to end and the other begin. Padding/layout inside each
  section is unchanged — only the background handling moved up to the wrapper.

### Plans
- `<section class="plans">`, Server Salad's real products (no fabricated numeric
  review badge, no invented promo ribbons — see below).
- `.plans__title` — **"High-Performance" (`.plans__title-accent`) + "cPanel Hosting "
  (regular) + "Starting from LKR " + a live price + "/mo" (bold)**. Style: `Cairo`,
  `clamp(22px,3vw,33px)`, `line-height:1`; the plain text and the accent span are
  both **weight 600**, the bold `<strong>` portion is **weight 900**. **Colour is
  deliberately uniform** — the whole heading (accent included) is `rgb(40,39,39)`,
  no orange — the owner asked for this one heading to match a reference exactly,
  including its colour, which **overrides** the general "match sizing, not colour"
  rule for this specific element only; don't apply that override elsewhere without
  being asked.
  - **The price is live**, not static text: the number is
    `<span data-price="starter_salad" data-monthly="458" data-format="number"
    data-annual-always="true">458</span>` inside the `<strong>` — same `starter_salad`
    key, same `renderPrices()` pickup (`js/main.js`) as the hero card's price and the
    Plans card's price below, so all three always show the identical live number once
    the API responds; `458` is only the fallback shown if the fetch fails.
  `.plans__subtitle` — **"Fast, secure NVMe-powered web hosting with intuitive cPanel
  control and instant setup."** Style: `Manrope` 300, 14px/14px, `rgb(122,122,122)`.
- `.plans__note` — a bordered pill box with an inline WordPress logo (its own brand
  teal, see Assets; sized 34px via `.plans__note-icon svg`, which overrides the inline
  SVG's own `width`/`height` attributes — CSS beats presentational HTML attributes)
  and text: **"All of our hosting plans are fully optimised for WordPress."** Style:
  `Cairo` 600, 16px/24px, `rgb(122,122,122)`. Has a **travelling lightning-bolt**
  animation instead of a literal on/off blink (blinking is a WCAG accessibility
  concern — content that blinks with no way to stop it — and tends to read as broken
  rather than intentional): `.plans__note-beam` is an absolutely-positioned `<svg>`
  (inset: 0) holding a single `<rect>` stroke (`.plans__note-beam-glow`,
  `--brand-orange`, 3px) that traces the pill's rounded-rect border
  (`pathLength="200"`) — **single stroke, not a two-stroke glow+core pair** (an
  earlier version layered a thin near-white core on top for a hot-bolt look; the
  owner asked for one line instead, softened by an actual `blur()` in
  `.plans__note-beam`'s `filter` for a hazy-glow feel rather than a crisp line). Its
  `stroke-dasharray` runs `@keyframes plans-note-length` (5.6s, ease-in-out) so the
  bolt's length pulses over time, and `@keyframes plans-note-travel` (4.2s, linear)
  moves the dash offset around the perimeter at one constant speed — no dart/stall
  pacing, which read as jarring rather than electric. Length and travel run on
  deliberately different, non-aligning durations so the bolt visibly grows and
  shrinks as it glides, instead of pulsing and moving in lockstep. A third animation,
  `@keyframes plans-note-flicker`, varies the beam's `drop-shadow` glow intensity for
  a soft crackle. All are disabled — the whole `.plans__note-beam` is hidden via
  `display: none` — under `@media (prefers-reduced-motion: reduce)` for users who've
  asked their OS/browser to minimise motion. The same single-stroke-plus-blur
  treatment (reusing these same keyframes) is applied to the Web Hosting▾ mega-menu's
  app-logos box border — see Navigation notes.
- `.plans__cards` — **2 cards** (`.plan-card`; VPS Hosting is not shown here — the
  hero section has its own VPS Hosting card, see "Open items"), reusing the same
  real descriptions/prices established on the hero cards, with one
  exception (see below). Both cards share this layout:
  - **Order:** icon → title → price → description → feature bullets → button. Icons
    (`.plan-card__icon`) reuse the exact same SVG files as the matching hero cards
    (`assets/img/hero/cpanel-hosting-icon.svg` / `cpanel-business-hosting-icon.svg`,
    see Hero notes) via the same masked-SVG technique, so the glyph is identical
    across hero, Plans, and the Web Hosting▾ mega-menu cards. Card is
    a flex column with the button pinned to the bottom (`margin-top: auto`);
    `.plan-card__price` has a shared `min-height` so the two cards' price blocks
    (see below) reserve equal space — title/price/description/features/button line up
    row-for-row between the two cards regardless of small content-length differences.
  - `.plan-card__title` font-size 19px → 22px (owner asked for a standard, modest
    size bump — bigger than the hero cards' 18px titles, still below the 30px price
    value so the hierarchy price > title > description holds).
  - Owner said the content felt cramped; opened up the internal spacing: card padding
    36/26/30px → 40/30/34px, icon margin-bottom 16px → 20px, title margin-bottom 6px →
    10px, price block margin-bottom 18px → 26px (internal gap 2px → 4px), description
    margin-bottom 20px → 28px, feature-list gap 10px → 14px and margin-bottom 22px →
    30px.
  - **cPanel Hosting** — only card with a "Most Popular" ribbon badge (red→orange
    gradient, `linear-gradient(135deg, var(--accent), var(--accent-2))` — was a
    solid-orange gradient originally, changed to match the same red/orange mix used
    on the hero title and Web Hosting▾ mega-menu accent). Highlighted price block: small uppercase label
    "Starting from" + big **`--brand-orange`** price (`.plan-card__price-value`,
    30px/800) + muted "/ month" unit. **The number is now live**, not hardcoded —
    the "500" is wrapped in `<span data-price="starter_salad" data-monthly="500"
    data-format="number" data-annual-always="true">`, the same pattern and the
    same shared `renderPrices()` function (`js/main.js`) as the homepage hero
    card's price and the cpanel-hosting page's table (see Hero notes and Pricing
    API notes) — `data-annual-always` means this always shows the
    annual-equivalent rate (`monthly × 10 ÷ 12`), same as the hero card, so the
    two stay in sync and show the identical number. No new JS was needed;
    `renderPrices()` already finds every `[data-price]` element on the page.
    - Directly under the price sits a **"billed as LKR X/year" line**
      (`.plan-card__billed`, `Manrope` 300, 14px/14px, `rgb(122,122,122)`, pulled
      up tight under the price with a `-18px` top margin) — `X = monthly × 10`,
      the annual total that backs the per-month figure above it. It's populated by
      the same `renderPrices()` `[data-billed="starter_salad"]` mechanism as the
      cpanel-hosting table's billed lines, so the number is live. Because this
      card has **no Monthly/Annually toggle** (`data-annual-always`), the line
      shows only "billed as LKR X/year" — `renderPrices()` skips the
      "(16% Discount)" sub-clause for `data-annual-always` elements (that clause
      is table-only). **Only the cPanel Hosting card has this line** — the
      Business Hosting card shows "To be announced" — so that card's
      description/features now start ~22px lower than the Business card's; the
      row-for-row alignment between the two cards (via `.plan-card__price`'s shared
      `min-height`) is slightly off as a result. See "Open items".
    Description: "Fast, secure NVMe hosting served
    hot with full cPanel control. Prepped to perfection for freelancers, startups,
    SMEs, educational institutions, personal blogs, and growing online stores."
    `.plan-card__features` (6 checkmark bullets, `--brand-orange` checks, bold
    lead-in + short detail): "**2 Cores & 2GB RAM** included per plan", "**1 to 10
    Websites** on 30GB storage", "**Fast NVMe Storage** served hot daily",
    "**LiteSpeed Cache** with Python & Node.js", "**Free SSL** & 1-click site
    builders", "**14-Day Money Back** & cPGuard security". Button "View cPanel
    Hosting Plans".
  - **cPanel Business Hosting** — no badge. Price shows **"To be announced"**
    (`.plan-card__price--soon`: dark `#1b1b1f`, bold, non-italic — not a pill/gradient
    like cPanel Hosting's, since there's no number to highlight). Description: "Extra
    compute power and dedicated RAM served hot with cPanel control. Prepped with
    priority support for scaling startups, expanding SMEs, educational portals, and
    online stores." *(Trimmed vs. the hero card's version of this description — the
    hero card still says "full cPanel control" / "high-volume online stores"; the two
    now intentionally differ, see "Open items".)* `.plan-card__features` (6 bullets,
    same style): "**All cPanel Features** plus extra upgrades", "**Unmetered
    Bandwidth** for heavy traffic", "**Extra CPU & RAM** for high workloads",
    "**High-Traffic Ready** for active portals", "**Priority Support** with express
    handling", "**21-Day Money Back** guarantee included". Button "View Business
    Hosting Plans".
  - Both buttons (`.btn--outline`) are a compact centred button (`width: auto;
    align-self: center`, not full-width; **8px corner radius**, overriding the
    base `.btn` pill) styled in `--brand-orange` (border/text, filling solid
    orange with white text on hover). **cPanel Hosting's button now
    points at the real page** `/serversalad/cpanel-hosting/`; Business Hosting's
    still points at the `#cpanel-business-hosting` placeholder anchor — not a real
    page yet.
  - Resting border is `1px solid #c9c9d2` — a darker ash than the site's usual
    `#e3e3e8` hairline, deliberately: the wrapper gradient behind these cards ends at
    `#e2e2e8`, so the lighter border was invisible against it. Keep it at least this
    dark if the gradient's end colour changes.
  - The card's hover border and the "Most Popular" badge also use `--brand-orange`
    (this section was switched from the site's rose/red `--accent` palette to brand
    orange; the hero cards and nav still use `--accent` — see "Brand colours" above).
  - Grid: `repeat(2, minmax(0, 480px))` with `justify-content: center` — 2 cards sit
    centred at a sensible width instead of stretching full-width.
- Deliberately **not included** from the original reference: a floating "★ 4.2" rating
  badge (would imply a real, unverified third-party review score) and invented promo
  ribbons like "£1 for the first month" (no basis to assert either for Server Salad).
- Responsive: 2 columns → 1 column on ≤860px.

### Locations (after Plans, shares a background with it — see above)
- `<section class="locations">`, centred content, built from an owner-supplied world
  map image.
- No heading/label — owner removed the placeholder "Our Location" eyebrow text
  (`.locations__label` CSS rule deleted as dead code); section is just the map +
  marker, nothing else.
- `.locations__map` — the full map image (`assets/img/graphics/world-map-dots.png`,
  1920×1080 dotted-pattern world map) at `width: 100%` inside a `max-width: 900px`
  centred wrapper.
- **One marker only**, over **London, UK** (owner's reference image showed 3
  markers; owner explicitly asked for only London) — a small `--brand-orange` dot
  (`.locations__pin-dot`) with an expanding/fading ring animation
  (`.locations__pin-pulse`, `@keyframes locations-pulse`, 2s loop, same
  reduced-motion treatment as the Plans note pill: `@media
  (prefers-reduced-motion: reduce)` turns it off).
- **Hover/focus info card** (`.locations__card`): hidden by default, revealed when
  the pin (`.locations__pin`, `tabindex="0"` so keyboard users can reach it too) is
  hovered or focused — white rounded card, title + two short paragraphs. The box's
  look/interaction was based on an owner-supplied reference screenshot (design
  reference only, not real content at first); owner then supplied the **real copy**
  to use:
  - Title: "London, UK", preceded by a 26px round UK flag badge
    (`.locations__card-flag`, see Assets) — the title is a flex row so the flag sits
    vertically centred beside the text. `alt=""` because the adjacent text already
    says "London, UK", so announcing the flag again would be redundant for screen
    readers.
  - Para 1: "Our primary cPanel hosting data center is based right in London, UK."
  - Para 2: "Enjoy lightning-fast LINX network connectivity and enterprise cloud
    infrastructure prepped on 100% NVMe storage."
  - This is now real, owner-confirmed content — no longer flagged as placeholder.
  - Positioned to the right of the pin on desktop (`left: calc(100% + 18px)`,
    vertically centred); on ≤700px it repositions below the pin, centred, capped at
    `min(280px, 80vw)` so it doesn't overflow the viewport.
  - New `.sr-only` utility class added (visually hidden but screen-reader-visible
    text) — used here for a short "hover or focus for details" hint on the pin;
    reusable for future accessibility labels elsewhere.
- **Pin position (`left: 46.5%; top: 37%`) was estimated visually** by cropping and
  zooming into the map image to locate the British Isles' dot cluster and picking a
  point toward its south-east (where London sits within Great Britain) — not driven
  by real geographic coordinates/projection math, since this is a stylised dot-art
  map, not a real projection. Close enough to read correctly at a glance, but
  worth a visual sanity-check by the owner; nudge the `left`/`top` percentages on
  `.locations__pin` and `.locations__pin-label` if it looks off.

### Pricing API (server-side — the one PHP file in the project)
- **What it's for**: the cpanel-hosting Plans table's 3 prices (Starter/Standard/
  Premium Salad) are pulled live from a real MySQL database instead of being
  hardcoded, per explicit owner request. See "Stack" above for why this required
  breaking the HTML/CSS/JS-only rule — this is the one deliberate exception.
- **`api/pricing.php`** — the only server-side code in the project.
  - Connects via PDO, runs one read-only query
    (`SELECT package_name, price_in_lkr_month FROM cpanel_package_pricing`), and
    returns just `{ ok: true, prices: { starter_salad, standard_salad,
    premium_salad } }` as JSON. Nothing else — no other DB columns, no table/
    schema details — is ever exposed to the client.
  - **Credentials live inside this `.php` file, deliberately**, not in a separate
    config/`.env` file: Apache executes `.php` files rather than serving their
    source, so this isn't downloadable as plain text the way a `.env`/`.json`
    file placed under `htdocs` would be. **These credentials must never be moved
    into any file the browser can fetch directly** (i.e. never into `js/main.js`,
    never into any `.html`/`.json`/`.js` file).
  - `getenv('SS_DB_HOST')` etc. checked first, with a hardcoded fallback. Ideally
    production sets real env vars rather than relying on the hardcoded fallback
    long-term.
  - **Working, verified live**: `curl http://localhost/serversalad/api/pricing.php`
    returns `{"ok":true,"prices":{"starter_salad":549,"standard_salad":649,"premium_salad":829}}`
    (exact numbers fluctuate as the DB is edited directly — that's expected of a
    live fetch).
  - **⚠️ The correct fallback host depends on where this file is actually running.**
    Right now (site running locally via XAMPP, not yet deployed) it must be
    `'serversalad.com'` — that's what's live in the file. **The moment this project
    is deployed onto the real serversalad.com hosting, this must change to
    `'localhost'`** (or, better, leave the code as-is and set a real
    `SS_DB_HOST=localhost` environment variable on that server, which `getenv()`
    already checks first — that way this line never needs manual editing again).
    Don't "fix" this back to `'localhost'` without first checking which environment
    the file is actually being served from — this exact host/environment mismatch
    is the most likely cause if pricing suddenly stops loading after a deploy.
  - CORS header currently hardcoded to `Access-Control-Allow-Origin:
    https://serversalad.com` — adjust if the real production domain differs.
  - Errors return a generic `{ ok: false, error: 'pricing_unavailable' }` with
    HTTP 500 — the actual PDO exception message is deliberately never echoed to
    the client (it can contain hostnames/DSN details that shouldn't be exposed).
    To debug a failure, check the real exception via the PHP CLI directly
    (`php -r '...'`) rather than the browser response, and don't leave any
    temporary debug script reachable from the web root, even briefly.
- **Front-end wiring** (`js/main.js`): shared across **both pages** — any
  `[data-price="..."]` element anywhere fetches from the same `api/pricing.php` on
  load. Each element carries `data-monthly` (current best-known price — HTML
  fallback until the fetch resolves, then the real value), and optionally
  `data-annual-always`/`data-format` to customise how it's displayed (see the big
  comment above `renderPrices()` in `js/main.js`).
  - A `[data-price]` element may be paired with a `[data-billed="<same key>"]`
    element elsewhere on the page — `renderPrices()` writes the "billed as LKR
    X/year" text into it. In the **annual** view it appends a block-level
    `<span class="cph-table__pkg-billed-note">(16% Discount)</span>` sub-clause,
    **except** when the price element is `data-annual-always="true"` (no toggle to
    switch back from), where it's just the plain "billed as LKR X/year" — that's
    the homepage cPanel Hosting plan card's `.plan-card__billed` line; the
    cpanel-hosting table's three `.cph-table__pkg-billed` lines get the full
    two-clause treatment (see the billing-toggle notes below).
  **Every price element keeps a fallback value in the HTML** as a safety net — on
  any failure (network error, API down, DB unreachable, unexpected response shape)
  the fetch's `.catch` deliberately leaves that fallback alone rather than showing
  blank or broken pricing. **The DB values
  change frequently during this build/testing phase** (seen 549/649/829, then
  509/609/8290, then 100/200/300 across different checks — someone editing the
  table directly in phpMyAdmin) — that's expected of a genuinely live fetch, not
  a bug; don't be alarmed if the displayed numbers don't match an earlier
  screenshot in this file. The fallback values in the
  HTML are now stale relative to these real prices; not worth updating them to
  match, since their only purpose is to cover the (currently rare) case where
  the API fails.
- **`js/main.js` and both pages' `<script>` tags now have their own `?v=N`
  cache-buster** (separate from the CSS one), added alongside this feature since
  it was the first time `main.js` changed after the multi-page/root-relative-path
  work — bump it whenever `main.js` changes, same discipline as `styles.css`.
- **Monthly/Annually billing toggle** (`.cph-billing-toggle`, above the table).
  **Annually is the default on load** — the toggle button ships
  `aria-checked="true"`, the "Annually" label ships `.is-active`, and
  `js/main.js` initialises `isAnnual = true`. The database
  only stores **one monthly price per plan** — there's no separate annual price
  column — so the annual figures are **calculated client-side**, not fetched:
  - Year total = monthly price × 10 (paying for 10 months covers all 12 — this is
    where the toggle's "2 Months Free" label comes from).
  - The per-month figure shown when Annually is selected = (monthly × 10) ÷ 12,
    rounded to the nearest whole LKR — the annual total spread back out per
    month, for comparison against the Monthly view. This is necessarily a bit
    lower than the real monthly price.
  - Each plan card also shows a small line under the price
    (`.cph-table__pkg-billed`, Manrope 400, 14px/21px, `#fff`) that changes text
    depending on the toggle. Each state's **second clause sits on its own line** —
    it's wrapped in a block-level `<span class="cph-table__pkg-billed-note">`
    (`display: block`) that `renderPrices()` writes via `innerHTML` (safe — the
    only interpolated value is a comma-formatted number):
    - Annually selected: "billed as LKR X/year" + "(16% Discount)", `X = monthly
      × 10` (the discounted total). *(Note: 2 months free is really ~16.7% off;
      "16%" is the rounded-down marketing figure the owner asked for.)*
    - Monthly selected: "LKR X/year" + "(switch to Annual to save)",
      `X = monthly × 12` (no discount). Here the note clause is a real
      **`<button class="cph-table__pkg-billed-note cph-table__pkg-billed-switch">`**
      — clicking any of the three flips the whole table to Annually. Because
      `renderPrices()` rebuilds this markup every render, the click is handled by
      a **delegated** `document` listener, not a per-button one; both it and the
      toggle switch call one shared `setAnnual(next)` helper.
  - Below that, a static "14-Day Money Back Guarantee" line
    (`.cph-table__pkg-guarantee`, Manrope 400, 11px/13px, `#fff`) sits under
    every plan's price block, always visible regardless of Monthly/Annually.
  - **Spacing inside each package cell is deliberately uneven, not uniform** —
    `.cph-table__pkg`'s flex `gap` is 16px, with each element's own margin tuned on
    top: tagline→price ≈20px, guarantee-line spacing ≈22px, while price and the
    "billed as..." line stay intentionally tight (≈6px) so they read as one paired
    unit rather than two separately-spaced lines — don't "fix" this to a uniform
    gap. Both toggle states now render the billed line as 2 lines (the note
    clause wraps under the "…/year" clause), so switching Monthly/Annually no
    longer changes the block's height.
  - Implementation (`js/main.js`): every `[data-price]` element also carries a
    `data-monthly` attribute — the current best-known monthly price, starting as
    the HTML fallback value and overwritten with the real fetched value once
    `api/pricing.php` resolves. A `renderPrices()` function always reads from
    `data-monthly` and redraws based on the current toggle state, so it works
    correctly regardless of whether the fetch has completed yet or which mode is
    selected — called on initial page load, again when the fetch resolves, and
    again on every state change. `setAnnual(next)` is the single place that flips
    `isAnnual`, updates the toggle's `aria-checked`, swaps the labels' `.is-active`,
    and re-renders — the toggle click and the in-cell "switch to Annual" buttons
    both go through it.
  - The toggle itself is a `<button role="switch" aria-checked="...">` (not a
    checkbox) with an inner knob that slides via CSS `transform`, styled in
    `--brand-orange`. The two labels ("Monthly" / "Annually") get an `.is-active`
    class reflecting the current state, for visual emphasis on whichever one is
    selected. Label style: Montserrat 600, 14px/21px, `rgba(40,39,39,.55)` at rest
    (the inactive look), `#1b1b1f` when `.is-active`.
- **CTA row** — the 3 "Order ... Salad" buttons sit in their own row
  (`.cph-table__btn-cell`, empty label cell + 3 button cells), the very last row
  (below the "Included with Every Plan" group). Each button cell matches the
  padding/border-top rhythm of an ordinary `.cph-table__val` row, so it reads as
  one more table row rather than a bolted-on footer. Buttons (`.cph-table__pkg-btn`)
  are outlined `--brand-orange`, **8px corner radius** (overriding the base
  `.btn` pill — the shared squared-button look, also on `.plan-card .btn--outline`
  and `.review-btn`), label Manrope 400 15px, filling solid orange on hover. All 3 point
  at `https://example.com/` in a new tab (`target="_blank" rel="noopener"`) — an
  explicit temporary placeholder until real order-flow/checkout pages exist.

### Migration (dark section, after Locations)
- `<section class="migration">`, full-bleed dark background — a `--brand-dark`-family
  gradient (`#1b2427 → #2b383c → #141b1d`) plus two soft radial glows (orange
  top-left, red bottom-right). Deliberately dark so the page keeps alternating:
  dark hero → light features → dark eco → light Plans/Locations → dark migration.
- **Top row** (`.migration__top`, 2-column grid, collapses to 1 column ≤980px):
  - Left (`.migration__content`): orange uppercase eyebrow **"Hassle-Free
    Migration"** (14px, weight 600, 2px letter-spacing, `#ffa45c` — a lighter tint
    than full `--brand-orange` since the saturated orange visually vibrates against
    this dark background at small uppercase sizes; this is deliberately more open
    than the site's other eyebrow labels, e.g. `.eco__label`'s 12px/700/1px). Then
    `<h2 class="migration__title">` **"Effortless cPanel Transfer"**, then the
    underline bar — the shared **150px × 4px flat solid `--brand-orange`** treatment
    (see "Why Choose Server Salad" section above) — then the description. **No CTA
    button** in this section.
  - Description: **"Switching to Server Salad is completely simple. Our technical
    team securely transfers your full cPanel account via native system APIs,
    ensuring total data integrity, complete account accuracy, and zero migration
    fees."** Plain text, no `<strong>` emphasis.
  - Note this copy asserts **"zero migration fees"** and "total data integrity" as
    owner-stated promises — owner-supplied, so not fabrication, but keep them
    accurate to what Server Salad actually guarantees.
  - Right (`.migration__visual`): a pure CSS/SVG illustration — a muted "Your current
    host" box (grey placeholder bars), a dashed curved SVG arrow, and a highlighted
    "Server Salad" box (orange border/tint, orange tick circle, "NVMe cloud" note).
    No image asset needed. `aria-hidden` since it's decorative. `.migration__box-label`
    ("Your current host" / "Server Salad") is `Cairo` 600, 14px, `line-height:1.3` —
    the muted-vs-white colour distinction (current host dimmer, destination full
    white) does real work here, so keep it. `.migration__box-note` ("NVMe cloud") is
    `Manrope` 300, 12px.
  - **File-transfer animation** on that illustration, three synced parts:
    1. `.migration__arrow-path` — dashes flow toward the destination via
       `stroke-dashoffset: -12` (`@keyframes migration-flow`, 1s linear). `-12` is
       exactly one `6 6` dash+gap cycle, which is what makes the loop seamless — if
       the `stroke-dasharray` changes, this number must change to match.
    2. `.migration__packet` — a small file/document glyph that rides the curve, via
       SVG `<animateMotion>` + `<mpath href="#migrationPath">` (2.6s loop), with an
       `<animate>` on opacity so it fades in/out at the ends instead of popping.
       `<mpath>` **references the arrow path by id rather than duplicating its `d`**,
       so the packet can never drift off the line if the curve is edited. (Both
       `href` and `xlink:href` are set for older Safari.) The arrow SVG needs
       `overflow: visible` so the packet isn't clipped at the viewBox edge.
    3. `.migration__box--ours` — a soft orange ring glow that peaks at ~80% of the
       same 2.6s cycle, so the destination "receives" the packet as it lands.
    All three are disabled under `@media (prefers-reduced-motion: reduce)` (the
    packet is `display: none`'d, since SMIL can't be stopped by CSS `animation`) —
    same accessibility treatment as the Plans note beam and the Locations pin.
- **`.migration__grid`** — 4 cards (`.migration-card`), each a translucent
  white-on-dark panel with a rounded-square orange icon tile, title, and description:
  **Free & Complete / cPanel Account Move** (move/transfer-arrows icon), **Automated &
  Secure / API Transfers** (API/connection icon), **Quick & Simple / Request Process**
  (fast-forward icon), **Complete Data & / Email Retention** (checklist icon) — full
  text in the HTML; the `/` marks the `<br>` line break in each two-line title. Icons
  are owner-supplied SVG files (`assets/img/migration/`), masked the same way as the
  hero-card icons (`.migration-card__icon-img` + `--migration-icon`, see Hero notes).
  4 columns → 2 (≤980px) → 1 (≤560px).
  - `.migration-card__title` is `Cairo` 600, 17px/21px. `.migration-card__desc` is
    `Manrope` 300, 13px/20px, `rgba(255,255,255,.76)`.
  - These state concrete operational promises — migration is **free**, data transfers
    **complete**, mailboxes/credentials need **no manual re-configuration** — owner-
    asserted, so keep them accurate to what Server Salad actually does.
- No "sites migrated" stat pill or count is shown — no basis to assert a migration
  count for Server Salad (same reasoning as the omitted rating badge and uptime
  badge elsewhere).
- Copy status: eyebrow, `<h2>`, description, and all 4 card titles/descriptions are
  owner-supplied real content — no placeholder wording remains in this section.

### Cloud infrastructure (light section, after Migration)
- `<section class="cloud">`, light "sky" wash background
  (`#ffffff → #eef3f8 → #e7eef6`). Left-aligned `<h2 class="cloud__title">` "Our Cloud
  Infrastructure" over an orange underline bar.
- **Sizing is deliberately larger/airier than the site's other card sections — don't
  normalise these back:** heading is `Cairo` 400, `clamp(26px, 3.4vw, 36px)`,
  `line-height:1`, `rgb(40,39,39)`. Underline is the shared **150px × 4px flat solid
  `--brand-orange`** treatment (see "Why Choose Server Salad" section above). Cards
  use **30/32px padding** with a **22px** icon-to-text gap and a tighter **9px**
  radius. Icons are owner-supplied SVG files (`assets/img/cloud/`), rendered at
  **32px** (28px at ≤560px) via `.cloud-card__icon-img` — the same masked-external-SVG
  technique used across the site (`background-color: currentColor` masked through
  each card's own `--cloud-icon` custom property; see Hero notes), not hand-drawn
  inline markup. Scaled down at ≤560px.
- **`.cloud__grid`** — 6 cards (`.cloud-card`) in 2 columns × 3 rows (1 column
  ≤860px). Each card: orange icon on the left, then a **two-line uppercase
  title** and a muted description. White cards with a soft orange border that deepens
  and lifts on hover.
  - `.cloud-card__title` is `Cairo`, 28px/36px, `rgb(40,39,39)`, with **line 1 at
    weight 600 and line 2 (wrapped in `<strong>`) at weight 900** — same 600/900
    two-weight split used on the "Why Choose Server Salad" and Plans-title elements.
    `.cloud-card__desc` is `Manrope` 400, 16px/24px, `rgb(122,122,122)`.
- Titles are split across the two lines as:
  1. Enterprise Cloud / **Infrastructure** (`enterprise-infrastructure-icon.svg`)
  2. Samsung Enterprise / **NVMe Storage** (`nvme-storage-icon.svg`)
  3. Full Protection / **With cPGuard** (`cpguard-protection-icon.svg`, shield+check)
  4. Powered By / **AMD EPYC™ CPUs** (`amd-epyc-cpu-icon.svg`, CPU chip)
  5. Lightning Fast / **With LiteSpeed** (`litespeed-icon.svg`, bolt)
  6. CloudLinux OS / **Reliability** (`cloudlinux-reliability-icon.svg`)
  - Card 4's title is **"AMD EPYC™ CPUs"** — plural, with the trademark symbol
    (`&trade;`).
  - ⚠️ **Card 3 and card 5 carry unverified qualitative claims, kept on explicit
    owner instruction** after being flagged: card 3 says "...one of the industry's
    lowest false-positive rates"; card 5 says "...our award-winning cloud NVMe
    infrastructure" — see "Open items". No specific investment-amount or
    storage-capacity figure is stated anywhere in this section — the owner had any
    such numbers removed when flagged, so this copy is deliberately number-free.
- Samsung NVMe storage and AMD EPYC CPUs are confirmed as genuinely Server Salad's,
  so those vendors are named. Not present in this section: any specific
  investment-amount or storage-capacity figure (see above); a background photo (a
  CSS gradient stands in; owner can supply a real photo); a bottom CTA button.
- These cards state concrete hardware/vendor claims (Samsung NVMe, AMD EPYC,
  cPGuard, LiteSpeed Enterprise, CloudLinux) plus the two qualitative claims flagged
  above — owner-asserted, so keep them accurate if the stack changes.

### Multi-page architecture (header + footer are shared partials)
- Owner asked how to avoid duplicating the footer once more pages exist. Stack is
  locked to plain HTML/CSS/JS (no PHP, no build tools), so server-side includes or
  a templating build step were off the table — solved with a **JS fetch-and-inject
  partial system**, applied to **both** the topbar+nav and the footer (the header
  got the same treatment pre-emptively once a real 2nd page — `cpanel-hosting/` —
  needed it too, to avoid immediately re-creating the same duplication problem):
  - **One copy of each shared block**: `partials/header.html` (topbar +
    `<header class="nav">`) and `partials/footer.html` (`<footer class="footer">`)
    — bare fragments, no `<html>/<head>/<body>` wrapper.
  - Any page that wants them includes two placeholder divs:
    `<div id="site-header"></div>` right after `<body>`, and
    `<div id="site-footer"></div>` right before `<script src=".../js/main.js">`.
  - `js/main.js` fetches both (root-relative URLs —
    `/serversalad/partials/header.html` / `.../footer.html` — so it works no matter
    how deep the including page lives, e.g. `/serversalad/cpanel-hosting/`) and
    replaces each placeholder div with the fetched markup (`mount.outerHTML =
    html`). Each fetch logs to the console and leaves that part of the page absent
    (not broken) if it fails. **Both fetches pass `{ cache: "no-store" }`** — without
    it, the browser could serve an already-cached copy of the partial's HTML even
    after `styles.css` is bumped, so an edited partial and the current CSS could get
    out of sync until a hard reload. This isn't tied to the `?v=N` query-string
    convention (partial URLs don't carry one) — it forces a fresh fetch every load.
  - **Nav's dropdown/hamburger JS had to be restructured** for this: it used to run
    immediately at script load, querying `[data-dropdown]` etc. directly — but that
    markup may not exist yet if it's still arriving via the header fetch. Pulled
    into an `initNav()` function that's called either immediately (if nav markup is
    already in the page) or right after the header fetch injects it — never before.
  - **Trade-off, chosen deliberately over Apache SSI or hand-copying:** header/footer
    aren't in the page's initial HTML — they're added by JS after load, so there's a
    brief instant without them, and it requires JS (true for essentially all real
    visitors; a theoretical concern only for very old/no-JS crawlers). SSI would
    avoid that but needs an `.htaccess`/`mod_include` change that couldn't be
    verified working without a real browser in this environment; hand-copying avoids
    both but silently drifts out of sync across pages over time. If the project
    later adds a real build step, this is the first thing worth reconsidering.
  - Each partial's own asset paths (the header's logo `<img>`, the footer's logo
    `<img>`) are **root-relative** for the same reason as the fetch URLs — a
    relative path would resolve against whichever page injected the partial, not
    against the partial file's own location.
  - **`index.html`'s and `cpanel-hosting/index.html`'s own `<link>`/`<script>` tags
    are both root-relative** (`/serversalad/css/styles.css?v=N`,
    `/serversalad/js/main.js?v=N`, favicon too). `js/main.js` has its own `?v=N`
    cache-buster, same rule as the stylesheet: **bump it in every page's
    `<script>` tag whenever `main.js` changes.** Any future page should follow the
    same root-relative pattern in its `<head>` and before `</body>`, whatever depth
    it lives at.
  - **Nav anchor links** (e.g. `#about`, `#cpanel-business-hosting`) only make
    sense on `index.html`, where those sections actually exist — clicking "About"
    from `cpanel-hosting/` won't scroll anywhere, since there's no `#about` there.
    Worth addressing once more real pages exist and some nav items should point at
    other pages instead of in-page anchors. One exception: the Web Hosting▾
    mega-menu's "cPanel Hosting" card links to `/serversalad/cpanel-hosting/` — a
    **real** page.

### cpanel-hosting page (2nd page — `/serversalad/cpanel-hosting/`)
- `cpanel-hosting/index.html` — same `<head>` as `index.html` (title, favicon,
  fonts, stylesheet — all root-relative, see above), shared header + footer wired
  up via the partial system.
- **Page order (top to bottom), with the deliberate dark/light alternation:**
  1. Hero (`.cph-hero`) — dark
  2. Plans & feature comparison (`.cph-plans`) — light grey
  3. Features (`.cph-features`) — dark
  4. Why Server Salad (`.cph-why`) — light
  5. Business Email (`.cph-email`) — dark
  6. Backups (`.cph-backups`) — light
  Then the shared footer. New sections are appended before `</main>` unless the
  owner says otherwise — update this list when that happens.
- **Reference-styling rule:** when a section is built from a source template, match
  the template's **fonts, font sizes, weights, line-heights, and box dimensions**
  (card padding, icon size, gaps, underline width, heading scale) as closely as
  possible — but **not its colours**, keep the site palette. Sections 4/5/6's
  cards deliberately share one compact metric set (22px padding, 12px radius, 38px
  icon tile / 20px glyph, 17px title, 13px desc, 20px grid gap).

#### cpanel-hosting: Hero
- `<section class="cph-hero">`: two-column layout, headline + description on the
  left, device-mockup screenshot on the right.
- **Background**: reuses the exact same gradient + dot-grid treatment as the
  homepage hero (`.hero__bg`'s values, copied into `.cph-hero__bg`) rather than a
  stock photo — keeps this page feeling like part of the same site. Shorter than
  the homepage hero (`padding: 96px 0`, not a full-viewport `min-height`), since
  this is a content section, not a landing hero.
- **Left column**: `<h1>` "cPanel **Hosting**" — Montserrat, 54px/59px, uppercase;
  "cPanel" weight 800, "**Hosting**" weight 600 in the same red→orange gradient
  accent as the homepage `<h1>` (`linear-gradient(90deg, var(--accent),
  var(--accent-2))`, see Hero notes) — matches the product's name as used everywhere
  else on the site. (These two weights were swapped once from an initial 600/800
  pairing — 800 is now on the base word, 600 on the accent word.) Then the site's
  standard orange underline bar, then two description paragraphs
  (`.cph-hero__desc`, Manrope 400, 17px/29px, `rgba(255,255,255,.85)`).
- **⚠️ This copy deliberately does not claim "unlimited" anything.** The Plans
  section (and hero cards) already state the real cPanel Hosting plan is
  **capped**: "1 to 10 Websites on 30GB storage", "2 Cores &
  2GB RAM". Claiming "unlimited" here would directly contradict that real content
  on the same site, not just be an unverified claim. Uses real, already-established
  copy instead:
  - Para 1 is the **exact existing** cPanel Hosting description (verbatim from the
    hero card / Plans section): "Fast, secure NVMe hosting served hot with full
    cPanel control. Prepped to perfection for freelancers, startups, SMEs,
    educational institutions, personal blogs, and growing online stores."
  - Para 2: "Every recipe is prepped with 2 Cores CPU, 2GB RAM, LiteSpeed Cache,
    Python, Node.js, free SSL, cPGuard protection, and a 14-day money-back
    guarantee." — states the real 2-core/2GB-RAM spec explicitly, consistent with
    the Plans section's feature list.
  - Headline: **"cPanel Hosting"**.
- **Right column** (`.cph-hero__visual`): `assets/img/graphics/cpanel-dashboard-devices.webp`
  — a real cPanel screenshot on desktop/tablet/phone frames (see Assets). Full
  width of its grid column, no cropping/effects.
- Responsive: 2-column → 1-column at ≤980px (image moves above the text via
  `order: -1`, so it's seen first on mobile).

#### cpanel-hosting: Plans & feature comparison
- `<section class="cph-plans">`, light grey background, after the Hero. The data
  in the comparison table is drawn from the owner's real spec spreadsheet ("cPanel
  Hosting Solutions" — 3 packages × ~17 features) — a genuine data source, not a
  competitor's own pricing/promo claims.
- No section heading/intro and no trust-badge row — the section opens straight
  into the comparison table.
  - If a badge row is wanted again, use only what's real and confirmed elsewhere on
    this site: 24/7 Support, **14-Day** Money Back Guarantee (not 30-day), Free SSL
    Certificates, cPGuard Protection, Softaculous 1-Click Installs. Don't add
    unconfirmed claims like "99.9% Uptime Guarantee", "Free Setup & No Hidden
    Fees", or "No Contracts - Cancel Any Time".
- **`.cph-table`** — a single CSS Grid comparison table (`grid-template-columns:
  minmax(160px,1.2fr) repeat(3, minmax(150px,1fr))`), populated directly from the
  owner's spreadsheet, one grid child per cell in row order (label, then 3 values)
  — Grid auto-placement wraps rows on its own, no wrapper `<div>` per row needed.
  Wrapped in `.cph-table-wrap { overflow-x: auto }` with a `min-width: 680px` on
  the table itself, so it scrolls horizontally on narrow screens rather than
  crushing 4 columns illegibly.
  - **Package header row**: **Starter Salad**, **Standard Salad**, **Premium
    Salad** — real product names from the spreadsheet, on a **solid black**
    background (`.cph-table__pkg`, `var(--bg-topbar)` — was white originally). The
    label-column cell to their left stays white, not black, and carries an intro
    line: a 34px UK flag (`assets/img/flags/uk-flag.svg`, see Assets) stacked above
    the heading **"Fast, Secure & Reliable Web Hosting"**. `.cph-table__intro` (a
    modifier alongside `.cph-table__label` on that one cell) makes it a centred
    column — `flex-direction: column; align-items: center; justify-content: center;
    text-align: center` — so the flag + wrapped heading sit centred both ways in the
    tall cell; type is Cairo 500, 24px/24px, `rgb(40,39,39)` (same spec as
    `.cph-table__pkg-name`). `.cph-table__intro-flag` sets the flag's 34px width.
    Per-element type in each header cell (all owner-matched to supplied
    references):
    - **Name** (`.cph-table__pkg-name`): Cairo 500, 24px/24px, white.
    - **Tagline** (`.cph-table__pkg-tagline`): Manrope 500, 13px/16px, `#fff`.
    - **Price** (`.cph-table__pkg-price`): a centred baseline-aligned flex row —
      the amount (Manrope 700, 24px/36px, `--brand-orange`) and the "/month" unit
      (Manrope 400, 14px/21px, muted) share one line rather than stacking.
    - **"billed as..." line** (`.cph-table__pkg-billed`): Manrope 400, 14px/21px,
      `#fff` — see the billing-toggle notes for its two-line text.
    - **Guarantee line** (`.cph-table__pkg-guarantee`): Manrope 400, 11px/13px,
      `#fff`.
    Taglines, food-pun voice: **Starter Salad** "Light appetizer portion with
    2-Core power, prepped for testing and staging.", **Standard Salad** "Hearty
    main course with 2-Core power, prepped for live blogs and freelancers.",
    **Premium Salad** "Generous banquet platter with 2-Core power, prepped for
    multi-site creators."
  - **All 3 header cells look identical — no per-tier highlight.** Standard Salad
    once had a flush "MOST POPULAR" orange band and Premium Salad a 3px orange
    top accent line; the owner had both removed. `.cph-table__pkg-badge`,
    `.cph-table__pkg--popular`, and `.cph-table__pkg--featured` (rule + class)
    are all deleted; the base `.cph-table__pkg` top padding is `26px` (the extra
    room only existed to clear the band). No "Most Popular" text anywhere — no
    data on which tier actually is, same reasoning as every other
    unverified-claim omission. The feature-comparison rows below the header, and
    the "Order ... Salad" button row at the very bottom, are **not** part of this
    black treatment — they stay on their original white/light backgrounds.
  - **Pricing — all 3 tiers are LIVE**, fetched from the same
    `cpanel_package_pricing` database table via `api/pricing.php` (see "Pricing
    API" below): each `<strong>` carries `data-price="starter_salad" /
    "standard_salad" / "premium_salad"` plus a `data-monthly` fallback value
    (500 / 1,200 / 2,500 respectively) that only ever displays if the live fetch
    fails. (The "Order ... Salad" buttons are documented in the CTA row bullet
    below.)
  - **Feature rows are split into two groups inside the same grid:**
    1. **Differentiating rows** (values differ by tier), ordered by how much
       weight buyers give each feature when comparing shared-hosting plans (site
       count > space > traffic > databases > mailboxes > the long-tail), not the
       spreadsheet's original order:
       **Websites, Storage** (shown as "N GB NVMe" — the spreadsheet's separate
       GB/MB rows collapsed into one), **Bandwidth, MySQL Databases, Email
       Accounts, Sub Domains, FTP Accounts, Passenger Applications, Parked
       Domains, Mailing Lists**.
    2. **"Included with Every Plan"** — see the `.cph-table__group` bullet below.
    - Row **labels** (`.cph-table__label`): Manrope 400, 13px/20px,
      `rgb(23,25,26)`. Cell **values** (`.cph-table__val`): Manrope 700, 13px/20px,
      `rgb(23,25,26)` — the ∞ glyph keeps `--brand-orange` and the ✕ cross keeps
      `#d3382e` via more-specific rules.
    - There are no **WordPress** or **SSL** rows in the differentiating group —
      identical across all three tiers, so they sit in the "Included with Every
      Plan" group instead (as "WordPress Support" and "Free SSL").
  - **Parked Domains and Mailing Lists show a red ✕** (`.cph-table__cross`,
    `#d3382e`) **instead of "0" on Starter Salad** — a plain "0" read ambiguously
    (zero of something you get, vs. a literal count); a cross reads unambiguously
    as "not included on this tier", matching the checkmark/cross convention
    comparison tables normally use.
  - **Every "Unlimited"/"Unmetered" value is shown as an orange ∞ symbol**
    (`.cph-table__val--infinity`, 19px/700, `--brand-orange`) instead of the word —
    13 cells in total (Bandwidth's "Unmetered", plus "Unlimited" on Email
    Accounts/FTP Accounts/MySQL Databases/Sub Domains/Parked Domains/Mailing
    Lists for Standard + Premium Salad). The glyph itself is `aria-hidden="true"`,
    paired with a `.sr-only` span carrying the real word ("Unlimited" or
    "Unmetered", matching what that specific cell actually meant) — so screen
    readers still announce the real word instead of an ambiguous bare symbol.
  - The spreadsheet's "Support" row (merged, "Tickets/ Emails/ WhatsApp") was
    removed earlier per owner. The "Money-Back Guarantee" row (merged, "14-Day
    Money Back Guarantee") lives outside the table entirely — it's a small line
    (`.cph-table__pkg-guarantee`) under each plan's price block instead (see the
    billing-toggle notes), positioned per-column near the price rather than as a
    shared table row.
- **`.cph-table__group` — the "Included with Every Plan" group**, a second block
  of rows inside the same comparison grid (it *replaced* the old `.cph-included`
  white-pill-chip list that used to sit below the table — that markup and CSS are
  gone). Modelled on an owner-supplied comparison template.
  - The heading is one full-width row: `<div class="cph-table__group">Included
    with Every Plan</div>`, `grid-column: 1 / -1`, Manrope 700 13px/20px,
    `rgb(23,25,26)`, underlined, on the same `#fafafb` as the label column.
  - Rows below it are ordered the standard way for a hosting feature list —
    **platform → guaranteed resources → performance → security → backups →
    apps/dev stack → site builder → support**:
    cPanel Control Panel, **Data Center**, **CPU** (2 Cores), **RAM** (2 GB),
    LiteSpeed Web Cache Manager, Free SSL, cPGuard Security, JetBackup, WordPress
    Support, Softaculous 1-Click App Installer, Python Support, Node.js Support,
    Sitejet Website Builder, 24/7 Support.
  - **Data Center, CPU and RAM moved here from the differentiating group** — all
    three are the same for every tier (UK / 2 Cores / 2 GB), so they weren't
    telling the reader anything up top. Data Center still shows the UK flag
    (`.cph-table__flag`, `alt="United Kingdom"`) ×3 — consistent with, not
    contradicting, the homepage Locations section's "London, UK" claim; CPU/RAM
    show their spec text.
  - Every other row shows a **brand-orange check + "Yes"** in all 3 columns:
    `.cph-table__val--yes` cells, each with an inline `.cph-table__check` SVG
    (same build as `.cph-table__cross`, `color: var(--brand-orange)`).
- Folder-with-`index.html` structure (not `cpanel-hosting.html`) so the URL is
  clean: `/serversalad/cpanel-hosting/` rather than
  `/serversalad/cpanel-hosting.html`. Apache serves `index.html` automatically for
  a directory request — no `.htaccess`/rewrite config needed (the flat-file
  alternative would need an `.htaccess` rewrite rule to strip `.html`, which is the
  same category of "server config that can't be visually verified here" already
  avoided for the header/footer partial system above).
  - **This is the standing convention for every future page** —
    `<page-name>/index.html`, not `<page-name>.html`. Apply it automatically to
    new pages without asking again.

#### cpanel-hosting: Features (`.cph-features`, dark)
- Centred heading + subtitle + short underline, then a **3-column grid of 12
  cards** — bare orange icon left of a one-line title, description spanning full
  width below (icon col 1 / title col 2 / desc spans both on row 2). Dark
  `--brand-dark`-family gradient + soft orange glows, same "dark content band" as
  the homepage Migration section. Responsive 3→2 (≤900) →1 (≤560).
- **Heading: "Loaded Web Hosting Features"** — deliberately not "Unlimited…",
  since the plans shown in the table right above are capped, not unlimited.
  Subtitle: "High-performance, reliable, and secure web hosting built on
  enterprise cloud infrastructure."
- **All 12 card titles + descriptions are owner-supplied real copy.** Titles:
  Simple and Intuitive, Lightning-Fast Hosting, High Base Resources, WordPress
  Optimized, Multiple PHP Versions, Professional Email Included, Free Daily
  Backups, Free SSL Certificates, One-Click Applications, Free Site Builder,
  Seamless Migration, 24/7 Expert Support. This copy states concrete specifics
  that don't appear elsewhere on the site (WP Toolkit, "300+" web applications,
  daily backups, WhatsApp support, "zero downtime or data loss") —
  owner-asserted, keep accurate.
- Icons: `assets/img/features/` (12 files, owner-supplied Noun Project SVGs,
  `fill="currentColor"`, masked to `--brand-orange` — see Assets).

#### cpanel-hosting: Why Server Salad (`.cph-why`, light)
- Two-column top — eyebrow "Why Server Salad" + `<h2>` + underline + description
  on the left, a **world-map card with a single London pin** on the right
  (`assets/img/graphics/world-map-dots.png`, same pin coords as the homepage
  Locations pin). Then a **3-card row** (tiled orange icon + title + desc). Light
  gradient wash.
  - **Eyebrow** (`.cph-why__eyebrow`): Manrope 600, 12px/18px, `--brand-orange`
    (matched to a font-inspector spec; colour kept per the reference-styling rule
    below).
  - **Heading** (`.cph-why__title`): Cairo 600, 40px/46px, single colour
    `#1b1b1f` — matched to a font-inspector spec including its **single-colour**
    treatment, so (unlike most homepage/cpanel-hosting headings) this one has
    **no accent-word gradient split**; the old `.cph-why__title-accent` markup/CSS
    was removed.
- **⚠️ Deliberately single-region.** The homepage Locations section states
  London, UK is *the* data centre (one marker, owner-explicit "only London"), and
  this page's own table shows Data Center = UK for every tier. So the heading is
  **"Enterprise Cloud Hosting, Built for Performance"**, and the map shows one
  London pin. **If Server Salad genuinely adds USA/Germany regions, this section
  AND the homepage Locations section must both be updated** — see "Open items".
- 3 cards: **Samsung NVMe Storage** ("Premium **Samsung NVMe SSDs** deployed
  across every server…"), **UK Datacenter Location** ("Hosted in top-tier **UK
  facilities**…"), **Hands-On Tech Experts** ("…**cPanel-certified technicians**
  and system engineers who actively manage the platform."). Each description has
  one bold-emphasised phrase (`<strong>`), matched to an owner-supplied
  reference. Section description: "We prep our hosting stack from top to bottom with
  enterprise Samsung NVMe storage, resilient networking, and cPGuard security
  managed directly by the engineers who handle your support tickets."
- Icons: `assets/img/why/` (3 files). Card classes `.cph-why-card*`; icon custom
  property `--why-icon`.

#### cpanel-hosting: Business Email (`.cph-email`, dark)
- Two-column top — a **CSS/inline-SVG envelope illustration** with an orange `@`
  badge on the left, heading + underline + description on the right. Then a **3×2
  grid of 6 cards**. Dark band, same treatment as Features.
- **The envelope has an animated send/receive** (`.cph-email__art*`): a small
  orange "message" packet drops *into* the envelope (receiving) and another leaves
  toward the `@` badge (sending), riding curved paths via SMIL `<animateMotion>` +
  `<mpath href="#id">` (same technique as the Migration packet); the two guide
  paths have flowing dashes (CSS `@keyframes cph-email-flow`); the `@` badge has an
  expanding-ring ping (SMIL `<animate>` on `r`/`opacity`). All disabled under
  `@media (prefers-reduced-motion: reduce)` — the SMIL elements are `display:none`'d
  since CSS `animation:none` can't stop SMIL.
- Heading **"Business Email Served Fresh"**, intro and all 6 card titles/descriptions:
  **Webmail Anywhere**, **Desktop & Mobile Apps**, **Spam & Abuse Defense**,
  **Flexible Mailbox Storage** (deliberately gives no size/number — "ample space"),
  **Sync Across Devices**, **Forwarders & Aliases** ("Set up unlimited aliases,
  autoresponders…").
- Icons: `assets/img/email/` (6 files, owner-supplied). Card classes
  `.cph-email-card*`; icon custom property `--email-icon`.

#### cpanel-hosting: Backups (`.cph-backups`, light)
- Two-column top — heading + underline + description on the left, the **JetBackup
  dashboard screenshot** (`assets/img/graphics/jetbackup-illustration.png`) in a light
  rounded "device" frame (`.cph-backups__frame`) on the right. Then a **3×2 grid
  of 6 cards**. Light gradient wash, same card metrics as the Why/Email sections.
- Heading **"Fresh Backups You Can Rely On"**; description **"Daily snapshots
  prepped with JetBackup, off-site storage, and granular restores, letting you roll
  back a single file or an entire account with total ease."** JetBackup is already
  established as Server Salad's backup solution (it's a row in the comparison
  table's "Included with Every Plan" group and appears on the homepage).
- 6 cards: Backed Up Daily, **30-Day Retention Window**, Off-Site Storage,
  Granular Restore, Snapshot Backups, Powered by JetBackup — the 30-day retention
  figure is owner-confirmed.
- Icons: `assets/img/backups/` (6 files, owner-supplied). Card classes
  `.cph-backups-card*`; icon custom property `--backup-icon`.

### Footer (shared partial — appears on every page)
- 4-column dark footer (brand+CTA / Information links / Products links / Get in
  Touch).
- `background: var(--bg-topbar)` — **solid black**, same token as `.topbar`, so the
  page is bookended by two matching black bars (header/footer) rather than using
  one of the site's existing dark gradients. Deliberate choice, not an oversight.
- **Brand column** (`.footer__brand`): the **complete Server Salad logo** — icon +
  "SERVERSALAD" wordmark — via `assets/img/brand/serversalad-logo-full.png` (see Assets;
  different file from the icon-only `serversalad-logo.png` used in the nav). Both
  the icon's square backdrop **and** the "SERVER" half of the wordmark are drawn in
  `--brand-dark` (`#323D41`) — this logo was designed for a light background, so
  it's nearly invisible directly on this footer's pure black. First attempt used a
  translucent-white chip (`rgba(255,255,255,.08)`, matching the footer's buttons)
  behind it, which fixed the icon square but the "SERVER" text was still too dark
  against it — an 8%-white-over-black chip composites to near-black, not
  meaningfully lighter. Fixed with a **solid light chip** instead
  (`.footer__logo-link { background: #f5f5f7 }`) — genuinely light, not just "less
  black", since a translucent overlay was never going to out-contrast a
  purpose-built-for-light-backgrounds logo. Owner asked for a fix "without
  changing the footer background" — this keeps the section itself pure black and
  only adds a local light backdrop behind the logo.
  Then a description:
  "Server Salad Cloud Services - Reliable hosting and domains since 2021. Now
  expanding globally with VPS, dedicated servers, email hosting, and more. Based in
  Sri Lanka, powering the cloud worldwide." States concrete claims — a founding
  year (2021) and a product list that includes **dedicated servers and email
  hosting, neither of which appears anywhere else on the site** (only cPanel
  Hosting, cPanel Business Hosting, VPS Hosting, and Domains are shown elsewhere) —
  owner-asserted, so implemented verbatim, but flagged under "Open items" since it
  may read as offering products a visitor can't actually find/order anywhere on
  the page yet. Then the owner's official tagline, **"Relish the Cloud!"**
  (food-pun-themed, matches the site's "Server Salad"/menu-pun voice — not a
  factual claim), and a "Learn more about us" pill button (`#about`, matching the
  nav's About anchor).
- **Information column**: About, Contact, Knowledgebase, Submit a Ticket, System
  Status (all reuse the **exact same anchors** already used in the nav's Support▾
  submenu — `#about`, `#contact`, `#knowledgebase`, `#ticket`, `#status` — so the
  footer and nav point at the same eventual pages instead of drifting), Terms &
  Conditions (`#terms`) and Privacy Policy (`#privacy`, two **new placeholder
  anchors** not used elsewhere yet — neither page exists), and **Discount Programs**
  (`#discount-programs`) — moved here from Products per owner, since it's a pricing
  program/policy rather than a hosting product.
- **Products column**: cPanel Hosting (now the real page,
  `/serversalad/cpanel-hosting/`), cPanel Business Hosting, VPS Hosting, Domains —
  the other three still reuse existing placeholder anchors
  (`#cpanel-business-hosting`, `#servers`, `#domains`).
- **Get in Touch column**: the site's **real, already-established contact details**
  as clickable lines —
  `tel:+94712000006` and `mailto:info@serversalad.com` (same numbers as the
  topbar) — then a small "Follow Us" social row: **Facebook, LinkedIn, Instagram**
  (inline SVG icons, circular hover fill in `--brand-orange`). Owner asked to "add
  fb, linkedin, instagram" — read as the complete intended set, so the original
  X/Twitter icon was removed rather than kept as a 4th icon; flag if X should stay
  too. Instagram's icon is stroke-outline (rounded square + circle, matching its
  real current logo) while Facebook/LinkedIn are solid-fill glyphs — a deliberate
  mismatch in *rendering technique*, not appearance quality, since that's how each
  platform's mark actually looks. **Real owner-supplied profile URLs**, all opening
  in a new tab (`target="_blank" rel="noopener"`, same pattern as the review
  buttons and the Ecologi link): Facebook →
  `https://www.facebook.com/ServerSaladGlobal/`, LinkedIn →
  `https://www.linkedin.com/company/serversalad/`, Instagram →
  `https://www.instagram.com/server_salad/`. The circles themselves needed brightening for the
  same reason the logo backdrop did (see above) — `rgba(255,255,255,.06)` fill with
  a 70%-opacity icon colour barely registered on pure black; now
  `rgba(255,255,255,.14)` with a visible border and a full-white icon colour, so
  they're clearly readable at rest, not only on hover.
- The Get in Touch column opens straight into the phone/email lines, with no
  "Customer Support" / "Contact Us" pill buttons above them.
- The "Follow Us" title sat too far from the social icons below it — `.footer__col-title`'s
  22px `margin-bottom` and the column's own 14px flex `gap` were stacking (36px
  total). Fixed by zeroing that title's margin specifically
  (`.footer__col--touch .footer__col-title:last-of-type`), leaving the `gap` as the
  only source of spacing there.
- **Deliberately not included:**
  - **No "Company Number" / "VAT Number" block** — inventing registration numbers
    for Server Salad would be fabricating legal/financial data. Add only with the
    owner's real numbers (if Server Salad has them) — see "Open items".
  - **No "® is a registered trademark" claim** — unverified.
  - **No awards/"trusted by" marketing claims.**
  - Social icons **do** have real profile URLs — see the Get in Touch column notes
    above.
- Copyright line: "© 2026 Server Salad Cloud Services. All rights reserved." —
  full legal-style name (matches the `<title>`), generic, no trademark assertion.
- Responsive: 4 columns → 2 (≤980px, brand column spans full width) → 1 (≤560px).
- **Footer typography** — most footer text uses Cairo/Manrope instead of the base
  Poppins/Inter (see Type system):
  - `.footer__tagline-desc` (the brand description paragraph): `Manrope` 300,
    14px/21px, `rgb(247,251,250)`.
  - `.footer__tagline` ("Relish the Cloud!"): `Manrope` 300, 14px/21px,
    `rgb(247,251,250)` — sits above the "Learn more about us" button.
  - `.footer__cta` ("Learn more about us"): `Cairo` 600, 13px/20px,
    `rgb(255,255,255)`.
  - `.footer__col-title` ("INFORMATION" / "PRODUCTS" / "GET IN TOUCH" / "Follow Us"):
    `Cairo` 600, 17px/17px. Its `border-top` accent bar is **3px**, `--brand-orange`,
    spanning the full column width (this is a `border-top`, not a short centred
    underline like the others).
  - `.footer__links a` (all the link-list items — About, Contact, cPanel Hosting,
    etc.): `Manrope` 300, 13px/13px, colour `rgba(245,245,247,.68)` (white/light-grey
    at rest).
  - `.footer__contact-line` (phone/email in Get in Touch): same treatment as
    `.footer__links a` — `Manrope` 300, 13px/13px.
  - `.footer__bottom p` (copyright line): `Manrope` 300, 11px/11px,
    `rgb(247,251,250)`.
  - `.footer__underline` (the small divider between the contact lines and "Follow
    Us"): **60px × 3px** — scaled down from the 150px main-section-underline
    treatment since it sits in a narrow footer column.

---

## Open items (known inconsistencies to revisit)
- **cpanel-hosting "Why Server Salad" is single-region by design.** Built around
  London-only because that's the owner-confirmed real fact on the homepage
  Locations section. If Server Salad
  now has USA/Germany regions: restore the multi-region framing here (heading, card
  2, description) **and** add USA/Germany pins to both this map and the homepage
  Locations map so the two pages stay consistent.
- **cpanel-hosting Backups: JetBackup screenshot.** `assets/img/graphics/jetbackup-illustration.png`
  must be a genuine Server Salad JetBackup panel, not another host's customer
  session. Confirm the file on disk is Server Salad's own.
- **cpanel-hosting card copy now asserts several specifics not stated elsewhere** —
  WP Toolkit, "300+" web applications, daily backup frequency, WhatsApp support,
  "zero downtime or data loss", "cPanel-certified technicians", "unlimited" aliases/autoresponders.
  All owner-supplied, so implemented verbatim; keep them accurate to what Server
  Salad actually offers.
- **`discount` and `edu_support_discount` columns exist in `cpanel_package_pricing`
  but aren't used** — the API only reads `price_in_lkr_month`. Their exact
  meaning/display logic (percentage off? flat LKR amount? which one applies to
  which visitor?) wasn't specified — ask the owner before adding either to the
  displayed price, rather than guessing and risking an inaccurate price shown to
  real customers.
- **Pricing API's DB host/user/pass are hardcoded as a fallback** inside
  `api/pricing.php` rather than set as real environment variables — matches the
  owner's own existing config pattern for now, but worth moving to real env vars
  in production if that hosting supports setting them (keeps credentials out of
  the file entirely, not just out of client-reachable files).
- **Pricing API's `$host` fallback must be flipped from `'serversalad.com'` to
  `'localhost'` (or an `SS_DB_HOST` env var) once this project is actually
  deployed onto the real serversalad.com hosting** — it's currently set for
  *local* testing (site running via XAMPP), which will be the wrong value once
  the site itself is running on that server. Easy to forget; see "Pricing API"
  Component notes for the full reasoning.
- **Footer brand description** names "dedicated servers" and "email hosting" as
  products — neither is offered/described anywhere else on the site (hero/Plans
  only cover cPanel Hosting, cPanel Business Hosting, VPS Hosting, Domains). Worth
  confirming these are real upcoming products (the text does say "now expanding")
  rather than something a visitor will be confused not to find elsewhere.
- **Footer**: needs real destination pages for `#terms`, `#privacy`, and
  `#discount-programs` (new placeholders, not used elsewhere). No Company Number /
  VAT Number block — add one only if the owner supplies real registration details.
  Social icons now link to real profiles (Facebook/LinkedIn/Instagram — see
  Component notes).
- **cpanel-hosting page**: has Hero, Plans/comparison, Features, Why Server Salad,
  Business Email, and Backups sections (see Component notes for each). More may
  still be added step by step (owner's plan). Also: most nav links won't resolve
  correctly when browsing this page (they're `index.html`-only anchors) — see
  "Multi-page architecture" notes.
- **cpanel-hosting: three near-identical light card components now coexist**
  (`.cph-why-card`, `.cph-backups-card`, plus the dark `.cph-email-card` and the
  bare-icon `.cph-feature`). They share metrics but are separate rulesets — a
  candidate for consolidation into one shared card component if the page grows
  further.
- **cpanel-hosting Plans section CTAs**: all 3 "Order ... Salad" buttons point at
  `https://example.com/` in a new tab — an explicit temporary placeholder. Replace
  with real order-flow/checkout pages once they exist.
- **Cloud infrastructure section**: ⚠️ Two card descriptions carry **unverified
  qualitative claims the owner explicitly chose to keep** after being flagged:
  card 3 ("...one of the industry's lowest false-positive rates") and card 5
  ("...our award-winning cloud NVMe infrastructure"). Still open — no background
  photo (a CSS gradient stands in; owner could supply a real one) and no bottom
  CTA button, both deliberate; see Component notes.
- **Migration section**: worth confirming whether a "sites migrated" stat pill
  should exist once there's a real number to put in it — none is shown currently.
- **"Why Choose Server Salad" section**: content is owner-supplied real copy, but
  it states specific operational claims (free 24/7 support, weekly Saturday live
  sessions, 100% licensed software, no-extra-fee malware scanning, Sri Lankan team
  + European data centers). Keep this in sync if any of those change. No
  background photo — ask if one is wanted.
- **Plans section title/card price fallback mismatch**: the two elements'
  **fallback** values (shown only if the live API fetch fails) differ — the title
  falls back to `458`, the plan card falls back to `500`. Cosmetic only, never
  visible unless the API is down, but worth aligning if it's ever noticed.
- **Plans section vs. hero**: Plans shows only 2 of the hero's 3 hosting products (VPS
  Hosting removed from Plans, still on the hero) and largely overlaps the hero cards it
  kept (same products, similar prices/descriptions) in a more detailed layout with CTA
  buttons — worth asking whether both sections should stay as-is.
- **Plans cards no longer line up row-for-row**: the cPanel Hosting card gained a
  "billed as LKR X/year" line (`.plan-card__billed`) under its price; the Business
  Hosting card ("To be announced") has no equivalent, so its
  description/features/button now sit ~22px higher than the cPanel Hosting card's.
  The shared `.plan-card__price` `min-height` no longer fully compensates. Even it
  out (e.g. reserve matching space on the Business card) if the misalignment
  looks wrong.
- **Plans section: README's quoted cPanel Hosting card description is stale.** This
  file quotes it as "Fast, secure NVMe hosting served hot with full cPanel
  control…"; the actual `index.html` card reads "High-speed NVMe hosting built for
  freelancers, personal sites, startups, and small online stores needing fast
  performance." (present since the first commit). Confirm which is intended, then
  align the other.
- **cPanel Business Hosting description** now differs slightly between the hero card
  ("full cPanel control" / "high-volume online stores") and the Plans card ("cPanel
  control" / "online stores") — confirm whether the hero card should be trimmed to
  match, or the difference is fine.
- **Sustainability section label**: owner's brief calls it a "Pill/Badge" but it's
  currently plain text, not an actual pill shape — confirm whether a rounded-chip
  visual treatment is wanted.
- **Web Hosting▾ mega-menu app-logos link is a placeholder**: "See 300+ apps with
  1-click install on cPanel" points at `href="#apps"` (no real apps-catalogue page
  exists yet) and the "300+" figure is illustrative, not a confirmed real count —
  swap both once real numbers/a real page exist. The mouse-pointer icon next to it
  is also a first-pass choice, open to change.
- **Discount Programs▾ mega-menu cards** have real titles but placeholder
  descriptions — need real copy for each.
- **Support▾** submenu items are still placeholder guesses — need the owner's real list.
- All nav submenu links (`#anchors`) and the "My Account" link point nowhere real yet —
  need real destination pages/URLs once those exist.
- **Hero cards: cPanel Business Hosting, VPS Hosting, and Domains all link to
  `https://example.com/`** (whole tile — see Hero notes) — a deliberate temporary
  placeholder; replace once those products have their own real pages (cPanel
  Hosting already points at the real `/serversalad/cpanel-hosting/`). There's no
  separate "coming soon" UI state to maintain — a card not yet launched just keeps
  its `href` at `https://example.com/` until it has a real page.
- The hero's 3rd card is titled **"VPS Hosting"**, but the main nav link right above
  the hero still says **"Servers"** (`href="#servers"`) — worth asking whether the nav
  label should also become "VPS Hosting".
- `.mega-card__icon` (nav mega menus) still uses the general `--accent` red, not
  `--brand-orange` like the hero/Plans cards — no request has targeted this yet.

## Decisions
- Serve locally through XAMPP htdocs; frontend only (HTML/CSS/JS) apart from the one
  live-pricing `api/pricing.php` endpoint (see Stack / Pricing API).
- One shared `.container` (1240px max, 24/16px gutter) controls left/right spacing on
  every section — standard centred-container pattern.
- Base two-font type system (Poppins + Inter) **plus three per-element overrides**
  (Cairo, Manrope, Montserrat) — see "Type system" above for the full breakdown of
  which elements use which. Brand colours (`--brand-dark`/`--brand-orange`)
  reserved for genuine brand touchpoints on the **homepage** — the Plans section,
  "Why Choose Server Salad" heading/icons, eco/hero accents, `.hero-card__badge` —
  while the hero cards and nav keep the rose/red `--accent` palette otherwise. The
  **cpanel-hosting page uses `--brand-orange` throughout** (table, toggle, buttons,
  and every Features / Why / Email / Backups card icon).
- Section card icons are external single-colour SVGs recoloured in CSS via `mask` +
  `background-color: var(--brand-orange)` (per-card file set through a `--*-icon`
  custom property), not inline `<svg>` — keeps the colour in one place and the markup
  lean. Source SVGs are saved with `fill="currentColor"`.
- **Reference-styling rule:** when implementing or restyling an element from a
  supplied reference/template, match its typography and box dimensions but **not**
  its colours — keep the site's own colour for that element unless the owner
  explicitly says otherwise for that specific request. Any such override applies
  **only** to the element named in that request, not as a new blanket rule.
- **Homepage section underlines are unified**: `.features__underline`,
  `.migration__underline`, and `.cloud__underline` all share one
  look — **150px wide, 4px tall, flat solid `var(--brand-orange)`, sharp square
  corners** (`border-radius:0`). Match this treatment if another section-heading
  underline is added, unless told otherwise. **`.eco__underline` is the one
  exception** — same 150×4px box, but a green→red→orange gradient fill instead of
  flat orange (see Sustainability notes) — a deliberate one-off, not a mistake to
  "fix" back to flat orange.
- Never fabricate unverifiable claims (review scores, stats, promo pricing,
  partnerships) — use neutral placeholders and flag clearly until the owner confirms
  real content. This extends to **qualitative** unverifiable claims too (e.g.
  "award-winning", "industry's lowest false-positive rate") — flag these the same way
  as a fabricated number; the owner may choose to keep them anyway (their call), but
  they should never be added silently.
- `css/styles.css?v=N` cache-busting — bump `N` on every CSS change (see
  Conventions); currently **v=252** (and `js/main.js?v=13`). Always check the live
  number in both HTML files rather than trusting a figure remembered from earlier
  in a conversation.
