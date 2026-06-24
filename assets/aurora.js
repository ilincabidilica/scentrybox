/* ===========================================================
   Scentry Box — animații „Aurora 2026"
   Scroll-reveal, particule de parfum, pulverizare din cutie,
   glow care urmărește pointerul în hero. Pur cosmetic — fără
   dependențe externe. Respectă prefers-reduced-motion.
   =========================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- scroll reveal ---- */
  var revealables = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }

  if (reduce) return;

  /* ---- particule de parfum care plutesc în fundal ---- */
  var pBox = document.querySelector(".particles");
  if (pBox) {
    var N = window.innerWidth < 700 ? 9 : 16;
    for (var i = 0; i < N; i++) {
      var p = document.createElement("span");
      p.className = "particle";
      var size = 3 + (i % 5);
      p.style.left = ((i * 37) % 100) + "%";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.animationDuration = (10 + (i % 9) * 1.6) + "s";
      p.style.animationDelay = "-" + ((i * 1.3) % 12) + "s";
      p.style.opacity = (0.3 + (i % 4) * 0.15).toFixed(2);
      pBox.appendChild(p);
    }
  }

  /* ---- pulverizare de puncte din cutie (evantai, ca în logo) ---- */
  var orb = document.querySelector(".orb-wrap");
  if (orb) {
    for (var s = 0; s < 9; s++) {
      var dot = document.createElement("span");
      dot.className = "spritz";
      var angle = (-120 + s * 30) * (Math.PI / 180); // evantai în sus
      var dist = 70 + (s % 3) * 22;
      dot.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      dot.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      dot.style.animationDelay = "-" + (s * 0.38) + "s";
      orb.appendChild(dot);
    }
  }

  /* ---- glow care urmărește pointerul în hero ---- */
  var hero = document.querySelector(".hero");
  if (hero && window.matchMedia("(pointer:fine)").matches) {
    var glow = document.createElement("div");
    glow.style.cssText = "position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;transition:opacity .4s;" +
      "background:radial-gradient(280px circle at var(--mx,50%) var(--my,40%),rgba(138,92,255,.22),transparent 70%);";
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
