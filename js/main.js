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
    fetch("/serversalad/partials/header.html", { cache: "no-store" })
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
     script tag. Root-relative path (/serversalad/...) so this works no matter how
     deep the including page lives (e.g. /serversalad/pages/about.html). */
  var footerMount = document.getElementById("site-footer");
  if (footerMount) {
    fetch("/serversalad/partials/footer.html", { cache: "no-store" })
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
          // "16% Discount" on its own second line, same block-level span as the
          // Monthly-state note below. innerHTML is safe — the only interpolated
          // value is a formatted number (digits + commas).
          if (billedEl) billedEl.innerHTML = "billed as LKR " + yearTotal.toLocaleString("en-US") + "/year<span class=\"cph-table__pkg-billed-note\">(16% Discount)</span>";
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

    fetch("/serversalad/api/pricing.php", { cache: "no-store" })
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
})();
