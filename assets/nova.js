/* ===========================================================
   Scentry Box — animații „Nova" (iridescent 2026)
   Bule plutitoare, pulverizare din sferă, stagger pe titlu,
   glow reactiv la cursor. Pur cosmetic. Respectă reduced-motion.
   =========================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* stagger pe cuvintele titlului kinetic */
  document.querySelectorAll(".hero-title .word").forEach(function (w, i) {
    w.style.animationDelay = (0.07 * i) + "s";
  });

  /* scroll-reveal */
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  if (reduce) return;

  /* bule plutitoare iridescente */
  var box = document.querySelector(".bubbles");
  if (box) {
    var N = window.innerWidth < 700 ? 9 : 16;
    for (var i = 0; i < N; i++) {
      var b = document.createElement("span");
      b.className = "bubble";
      var size = 8 + (i % 6) * 7;
      b.style.left = ((i * 41) % 100) + "%";
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.animationDuration = (13 + (i % 8) * 2) + "s";
      b.style.animationDelay = "-" + ((i * 1.7) % 14) + "s";
      box.appendChild(b);
    }
  }

  /* pulverizare de puncte din sferă (evantai, ca în logo) */
  var crystal = document.querySelector(".crystal");
  if (crystal) {
    for (var s = 0; s < 9; s++) {
      var dot = document.createElement("span");
      dot.className = "spritz";
      var angle = (-120 + s * 30) * (Math.PI / 180);
      var dist = 78 + (s % 3) * 22;
      dot.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      dot.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      dot.style.animationDelay = "-" + (s * 0.4) + "s";
      crystal.appendChild(dot);
    }
  }

  /* glow reactiv la cursor în hero */
  var hero = document.querySelector(".hero");
  if (hero && window.matchMedia("(pointer:fine)").matches) {
    var glow = document.createElement("div");
    glow.style.cssText = "position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;transition:opacity .4s;" +
      "background:radial-gradient(300px circle at var(--mx,50%) var(--my,40%),rgba(185,140,255,.2),transparent 70%);";
    hero.appendChild(glow);
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      glow.style.setProperty("--mx", (e.clientX - r.left) + "px");
      glow.style.setProperty("--my", (e.clientY - r.top) + "px");
      glow.style.opacity = "1";
    });
    hero.addEventListener("pointerleave", function () { glow.style.opacity = "0"; });
  }
})();
