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
  var loop = document.getElementById("hero-loop");
  if (loop) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce && reduce.matches) {
      loop.removeAttribute("autoplay");
      loop.pause();
      loop.setAttribute("controls", "");
    }
    loop.addEventListener("click", function () {
      if (loop.paused) { loop.play(); } else { loop.pause(); }
    });
  }
})();
