/* Jiaru Li — site behaviour. Progressive enhancement only. */
(function () {
  "use strict";

  /* Mobile navigation toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Publication topic filter */
  var filters = document.querySelector(".filters");
  if (filters) {
    var pubs = Array.prototype.slice.call(document.querySelectorAll(".pub"));
    var groups = Array.prototype.slice.call(document.querySelectorAll(".year-group"));

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var want = btn.dataset.filter;

      filters.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      pubs.forEach(function (p) {
        var topics = (p.dataset.topic || "").split(/\s+/);
        p.hidden = !(want === "all" || topics.indexOf(want) !== -1);
      });

      /* Hide year headings that no longer have visible entries */
      groups.forEach(function (g) {
        var any = g.querySelector(".pub:not([hidden])");
        g.hidden = !any;
      });
    });
  }

  /* Home page looping simulation: respect reduced-motion, click to pause/play */
  var loops = document.querySelectorAll("video.hero-loop");
  if (loops.length) {
    var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    var reduce = mq && mq.matches;
    Array.prototype.forEach.call(loops, function (v) {
      if (reduce) {
        v.removeAttribute("autoplay");
        v.pause();
        v.setAttribute("controls", "");
      }
      v.addEventListener("click", function () {
        if (v.paused) { v.play(); } else { v.pause(); }
      });
    });
  }

  /* Research page tabs: highlight the section currently in view */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".theme-tabs a"));
  if (tabs.length) {
    var secs = tabs.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    var current = -1;
    var update = function () {
      var k = -1, line = Math.max(140, window.innerHeight * 0.4);   // a section is current once its top passes this line
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) k = i; });
      if (k === current) return;
      current = k;
      tabs.forEach(function (a, i) {
        if (i === k) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
      var bar = tabs[0].parentNode;
      if (k >= 0 && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = tabs[k].offsetLeft - 16;  // keep it visible on phones
    };
    window.addEventListener("scroll", update, { passive: true });   // cheap: four rects per scroll
    update();
  }

  /* Notes photos and research figures: click to magnify; click anywhere or press Esc to close */
  var photos = document.querySelectorAll(".photo > img, .photo > .photo-ph, figure.fig > img");
  if (photos.length) {
    var zoom = document.createElement("div");
    zoom.className = "photo-zoom";
    zoom.hidden = true;
    zoom.setAttribute("role", "dialog");
    zoom.setAttribute("aria-modal", "true");
    zoom.setAttribute("aria-label", "Magnified image (click or press Esc to close)");
    document.body.appendChild(zoom);
    var opener = null;

    var close = function () {
      zoom.hidden = true;
      zoom.textContent = "";
      document.documentElement.classList.remove("zoom-open");
      if (opener) opener.focus();
    };
    var open = function (el) {
      opener = el;
      var big = el.cloneNode(true);
      big.removeAttribute("tabindex");
      big.removeAttribute("role");
      if (big.dataset && big.dataset.full) big.src = big.dataset.full;  // optional larger file
      zoom.appendChild(big);
      var cap = el.parentNode.querySelector("figcaption");
      if (cap) {
        var c = document.createElement("p");
        c.textContent = cap.textContent;
        zoom.appendChild(c);
      }
      zoom.hidden = false;
      document.documentElement.classList.add("zoom-open");
      zoom.tabIndex = -1;
      zoom.focus();
    };

    Array.prototype.forEach.call(photos, function (el) {
      el.classList.add("zoomable");
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Magnify image");
      el.addEventListener("click", function () { open(el); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(el); }
      });
    });
    zoom.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !zoom.hidden) close();
    });
  }
})();
