/* =========================================================================
   Wilson Innovations — interactions
   Mobile nav · header state · scroll reveals · dashboard lightbox
   All motion respects prefers-reduced-motion.
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- header scrolled state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- scroll reveals ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px 12% 0px", threshold: 0 });
    reveals.forEach(function (el) { io.observe(el); });

    /* safety net: mobile momentum scrolling can outrun the observer —
       anything already above the fold gets revealed on the next scroll tick */
    var sweepTimer = null;
    var sweep = function () {
      sweepTimer = null;
      var vh = window.innerHeight;
      reveals = reveals.filter(function (el) {
        if (el.classList.contains("is-visible")) return false;
        if (el.getBoundingClientRect().top < vh) {
          el.classList.add("is-visible");
          io.unobserve(el);
          return false;
        }
        return true;
      });
    };
    window.addEventListener("scroll", function () {
      if (!sweepTimer) sweepTimer = setTimeout(sweep, 90);
    }, { passive: true });
  }

  /* ---------- before/after comparison slider ---------- */
  var ba = document.getElementById("ba");
  if (ba) {
    var baRange = ba.querySelector(".ba__range");
    var clipOk = window.CSS && CSS.supports && CSS.supports("clip-path", "inset(0 50% 0 0)");
    if (baRange && clipOk) {
      ba.classList.add("is-ready");
      var setBaPos = function () {
        ba.style.setProperty("--pos", baRange.value + "%");
      };
      baRange.addEventListener("input", setBaPos);
      setBaPos();

      /* intro state: stage starts dimmed with a "slide me" prompt; the handle
         auto-teases once so the mechanic is obvious. Ends ~2s after the section
         scrolls into view, or on the first interaction — and never returns. */
      var introDone = false;
      var teaseRaf = 0;
      var endIntro = function () {
        if (introDone) return;
        introDone = true;
        if (teaseRaf) cancelAnimationFrame(teaseRaf);
        ba.classList.add("is-intro-done");
        setBaPos();
      };
      var tease = function () {
        var start = null;
        var dur = 1100;
        var step = function (ts) {
          if (introDone) return;
          if (start === null) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          /* 50 → 44 → 50, eased by the sine itself */
          ba.style.setProperty("--pos", (50 - 6 * Math.sin(Math.PI * t)) + "%");
          if (t < 1) teaseRaf = requestAnimationFrame(step);
        };
        teaseRaf = requestAnimationFrame(step);
      };
      var startIntro = function () {
        if (introDone) return;
        if (!reduceMotion) tease();
        setTimeout(endIntro, 2200);
      };
      ["pointerdown", "touchstart", "focus", "input"].forEach(function (evt) {
        baRange.addEventListener(evt, endIntro, { passive: true });
      });
      if ("IntersectionObserver" in window) {
        var baIo = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) {
            baIo.disconnect();
            startIntro();
          }
        }, { threshold: 0.3 });
        baIo.observe(ba);
      } else {
        startIntro();
      }
    }
  }

  /* ---------- dashboard lightbox ---------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var lbUrl = document.getElementById("lb-url");
  var lbClose = document.getElementById("lb-close");
  var lbPrev = document.getElementById("lb-prev");
  var lbNext = document.getElementById("lb-next");
  var current = 0;
  var lastFocus = null;

  var items = shots.map(function (btn) {
    var img = btn.querySelector("img");
    var url = btn.querySelector(".browser__url");
    return {
      src: img ? img.getAttribute("src") : "",
      alt: img ? img.getAttribute("alt") : "",
      cap: btn.getAttribute("data-cap") || "",
      url: url ? url.textContent.trim() : ""
    };
  });

  function show(i) {
    if (!lb || !items.length) return;
    current = (i + items.length) % items.length;
    var it = items[current];
    lbImg.setAttribute("src", it.src);
    lbImg.setAttribute("alt", it.alt);
    lbCap.textContent = it.cap;
    if (lbUrl) lbUrl.textContent = it.url;
  }

  function openLb(i) {
    if (!lb) return;
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }

  function closeLb() {
    if (!lb) return;
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  shots.forEach(function (btn, i) {
    btn.addEventListener("click", function () { openLb(i); });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lbPrev) lbPrev.addEventListener("click", function () { show(current - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { show(current + 1); });
  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target === lb.querySelector(".lightbox__inner")) closeLb();
    });
    window.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }
})();
