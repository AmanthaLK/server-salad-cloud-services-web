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
    /* The active-tab underline is one shared element that slides between tabs
       — see .discount-tabs__indicator in css/styles.css.

       Its width and offset are MEASURED off the active tab and written as
       plain pixel styles. An earlier version drove the transform through CSS
       custom properties instead (translateX(calc(var(--tab-index) * 100%))),
       which didn't animate: an unregistered custom property has no type, so
       browsers treat changes to it as discrete and a transition on a property
       whose value merely derives from it doesn't reliably interpolate — the
       bar jumped instead of sliding. Setting `transform` directly on the
       element transitions the way any ordinary property change does.

       Measured with getBoundingClientRect, NOT offsetLeft/offsetWidth: those
       round to whole pixels, and each tab is 397.33px wide at the container's
       max width. Rounding made the bar a fraction narrower than its tab, put
       it up to a pixel out of line, and - because width is transitioned too -
       made it visibly jitter wider and narrower as it travelled. Rects are
       fractional, so the bar now matches its tab exactly and only moves.

       Measuring at all means the bar doesn't have to reason about the tab
       bar's .container padding or assume the tabs are equal thirds. */
    var discountBar = document.querySelector(".discount-tabs__bar");
    var discountIndicator = document.querySelector(".discount-tabs__indicator");

    /* Where the bar currently sits, tracked rather than read back off the
       element — reading computed style would force a layout and can return a
       matrix mid-animation. */
    var discountIndicatorX = null;

    var moveDiscountIndicator = function (tab, animate) {
      if (!discountIndicator || !discountBar || !tab) return;
      var barRect = discountBar.getBoundingClientRect();
      var tabRect = tab.getBoundingClientRect();
      var x = tabRect.left - barRect.left;

      /* Width is set instantly, never animated: tabs differ by fractions of a
         pixel, and animating a layout property repaints every frame. */
      discountIndicator.style.width = tabRect.width + "px";

      var from = discountIndicatorX;
      discountIndicatorX = x;
      var to = "translate3d(" + x + "px, 0, 0)";

      /* Animated explicitly with element.animate() rather than by leaving a
         CSS transition to notice the change. The final inline style is set
         as well, so the bar stays put once the animation ends without
         needing a fill mode.

         Historical note, because the code above was written on a wrong
         assumption: this was switched to element.animate() while chasing a
         bar that looked like it never moved. That turned out to have nothing
         to do with how it was animated — .discount-tabs__tab was still
         position:relative, so the tabs painted over the bar and a hovered
         tab's background hid it exactly when it travelled. A plain CSS
         transition would be perfectly fine here. This stays because it works
         and is explicit, not because transitions were found wanting. */
      var still = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (animate && !still && from !== null && from !== x && discountIndicator.animate) {
        discountIndicator.animate(
          [{ transform: "translate3d(" + from + "px, 0, 0)" }, { transform: to }],
          { duration: 280, easing: "cubic-bezier(.4, 0, .2, 1)" }
        );
      }
      discountIndicator.style.transform = to;
    };

    var activateDiscountTab = function (tab) {
      var target = tab.getAttribute("data-tab");
      moveDiscountIndicator(tab, true);
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

    /* Place the bar under whichever tab starts active. The `animate` flag is
       false here and on resize, so it lands in place rather than sliding in
       from the left edge. Re-measured on resize because the tabs change width
       with the viewport. */
    var initialDiscountTab = null;
    discountTabs.forEach(function (t) {
      if (!initialDiscountTab && t.classList.contains("is-active")) initialDiscountTab = t;
    });
    moveDiscountIndicator(initialDiscountTab || discountTabs[0], false);
    window.addEventListener("resize", function () {
      var current = null;
      discountTabs.forEach(function (t) {
        if (!current && t.classList.contains("is-active")) current = t;
      });
      moveDiscountIndicator(current || discountTabs[0], false);
    });

    /* Deep-link from the Discount Programs mega-menu cards (see
       partials/header.html): each card's href carries a #hash matching one
       tab's data-hash, so arriving from that card opens straight on its own
       tab instead of always defaulting to the first one.

       Checked on load AND on "hashchange" — clicking one of those mega-menu
       links while ALREADY on this page only changes the URL's hash (same
       path, so the browser doesn't reload/re-run this script); without the
       hashchange listener the tab never switched in that case, only when
       arriving fresh from another page.

       Opening the tab is deliberately ALL this does: an auto-scroll down to
       the tab bar was built here and then removed at the owner's request —
       arriving on this page leaves the visitor at the top of the hero. */
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
