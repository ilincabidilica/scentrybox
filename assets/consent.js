/* ===========================================================
   Scentry Box — consimțământ cookies (GDPR / ePrivacy 506/2004)
   -----------------------------------------------------------
   Principiu: cookie-urile NE-esențiale (analiză, marketing) NU
   se încarcă până când utilizatorul NU apasă "Accept". "Refuz"
   e la fel de ușor ca "Accept". Alegerea se reține în
   localStorage. Linkul "Setări cookies" din footer redeschide
   bannerul ca să poată schimba opțiunea oricând.

   👉 CE TREBUIE SĂ FACI: pune codul real de tracking (Meta Pixel,
   TikTok Pixel, GA4) DOAR în funcția loadNonEssential() de mai
   jos. Așa se încarcă exclusiv după consimțământ.
   =========================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "scentry_consent";
  var CONSENT_VERSION = "1"; // crește numărul dacă schimbi ce cookie-uri folosești → re-cere consimțământul

  function getStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (obj.v !== CONSENT_VERSION) return null; // versiune veche → re-întreabă
      return obj;
    } catch (e) { return null; }
  }

  function store(status) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: status, v: CONSENT_VERSION, t: new Date().toISOString() }));
    } catch (e) {}
  }

  /* ---- Scripturile NE-esențiale: rulează DOAR la accept ---- */
  function loadNonEssential() {
    // ====== META (Facebook/Instagram) PIXEL — decomentează & pune ID-ul ======
    // !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    // n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    // n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    // t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    // (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    // fbq('init','PIXEL_ID_AICI'); fbq('track','PageView');

    // ====== TIKTOK PIXEL — decomentează & pune ID-ul ======
    // !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[]; /* ... */ }
    // (window,document,'ttq'); ttq.load('PIXEL_ID_AICI'); ttq.page();

    // ====== GOOGLE ANALYTICS 4 — decomentează & pune ID-ul ======
    // var s=document.createElement('script'); s.async=true;
    // s.src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    // document.head.appendChild(s);
    // window.dataLayer=window.dataLayer||[]; function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date()); gtag('config','G-XXXXXXX');

    // (lăsat gol intenționat — nimic nu se încarcă până nu adaugi codul de mai sus)
  }

  /* ---- UI banner ---- */
  function buildBanner() {
    var b = document.createElement("div");
    b.className = "cookie-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Consimțământ cookies");
    b.innerHTML =
      '<p>Folosim cookie-uri strict necesare pentru funcționarea site-ului și, doar cu acordul tău, ' +
      'cookie-uri de analiză și marketing. Detalii în <a href="cookies.html">Politica de cookies</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn-reject" id="ckReject">Refuz</button>' +
      '<button type="button" class="btn-accept" id="ckAccept">Accept</button>' +
      "</div>";
    document.body.appendChild(b);

    document.getElementById("ckAccept").addEventListener("click", function () {
      store("accepted"); remove(b); loadNonEssential();
    });
    document.getElementById("ckReject").addEventListener("click", function () {
      store("rejected"); remove(b);
    });
    return b;
  }

  function remove(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  function init() {
    var saved = getStored();
    if (saved && saved.status === "accepted") {
      loadNonEssential();            // a acceptat anterior → încarcă
    } else if (!saved) {
      buildBanner();                 // nicio alegere → arată bannerul
    }
    // dacă a refuzat anterior → nu facem nimic

    // Linkul "Setări cookies" din footer redeschide bannerul
    var btn = document.getElementById("cookieSettingsBtn");
    if (btn) btn.addEventListener("click", function () {
      if (!document.querySelector(".cookie-banner")) buildBanner();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
