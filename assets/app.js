/* ===========================================================
   Scentry Box — formular listă de așteptare (MAILCHIMP)
   -----------------------------------------------------------
   Se trimite direct către Mailchimp, rămânând pe pagină (JSONP),
   cu mesaj de succes/eroare inline. Double opt-in (confirmarea
   pe email) se activează din setările audienței Mailchimp = conform GDPR.

   👉 SINGURUL LUCRU DE FĂCUT:
   1. În Mailchimp: Audience → Signup forms → "Embedded form".
   2. Copiază valoarea atributului action din codul lor, ceva de forma:
        https://scentrybox.us21.list-manage.com/subscribe/post?u=XXXX&id=YYYY&f_id=ZZZZ
   3. Lipește-o mai jos în MAILCHIMP_URL.
   (Atât. Nu trebuie să schimbi nimic altceva.)

   Opțional anti-spam: în același cod Mailchimp există un câmp ascuns
   de forma name="b_XXXX_YYYY". Dacă vrei, copiază acel name și pune-l
   în MAILCHIMP_BOT mai jos.
   =========================================================== */

(function () {
  "use strict";

  var MAILCHIMP_URL = "https://gmail.us19.list-manage.com/subscribe/post?u=f17d311b349e1ca29bd588d43&id=9a92102a62&f_id=0094c2e1f0";
  var MAILCHIMP_BOT = "b_f17d311b349e1ca29bd588d43_9a92102a62";

  // mesaje bilingve, după limba paginii (<html lang="ro"> / "en">)
  var LANG = (document.documentElement.lang || "ro").toLowerCase().indexOf("en") === 0 ? "en" : "ro";
  var T = {
    ro: {
      invalid: "Te rugăm să introduci o adresă de email validă.",
      consent: "Bifează acordul pentru a continua.",
      noconf: "⚠️ Formular neconfigurat încă — adaugă MAILCHIMP_URL în assets/app.js (vezi README).",
      sending: "Se trimite…",
      success: "Gata! Ești pe listă. 🤍 Ți-am trimis un email de bun venit.",
      already: "Ești deja pe listă. 🤍",
      referral: "Ești deja pe listă! 🤍 Dar parfumul e mai frumos împărțit — cheamă o prietenă să descopere și ea:",
      copy: "Copiază linkul 💌",
      copied: "Link copiat! ✨",
      error: "Ceva n-a mers. Mai încearcă o dată în câteva momente."
    },
    en: {
      invalid: "Please enter a valid email address.",
      consent: "Please tick the consent box to continue.",
      noconf: "⚠️ Form not configured yet — add MAILCHIMP_URL in assets/app.js (see README).",
      sending: "Sending…",
      success: "Done! You're on the list. 🤍 We've sent you a welcome email.",
      already: "You're already on the list. 🤍",
      referral: "You're already on the list! 🤍 But scent is better shared — bring a friend to discover it too:",
      copy: "Copy the link 💌",
      copied: "Link copied! ✨",
      error: "Something went wrong. Please try again in a moment."
    }
  };
  var t = T[LANG];

  var form = document.getElementById("waitlist");
  var msg = document.getElementById("formMessage");
  var emailInput = document.getElementById("email");
  var consentInput = document.getElementById("consent");
  var consentLabel = consentInput ? consentInput.closest(".consent") : null;

  // scoate highlight-ul de eroare când bifează acordul
  if (consentInput) consentInput.addEventListener("change", function () {
    if (consentInput.checked && consentLabel) consentLabel.classList.remove("consent-error");
  });

  // anul în footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  if (!form) return;

  function setMessage(text, type) {
    msg.textContent = text;
    msg.className = "form-message" + (type ? " " + type : "");
  }

  // evidențiază câmpul de consimțământ (contur roșu + shake)
  function highlightConsent() {
    if (!consentLabel) return;
    consentLabel.classList.remove("consent-error");
    void consentLabel.offsetWidth; // reflow ca să repornească animația
    consentLabel.classList.add("consent-error");
  }

  // mesaj „deja pe listă" + buton de recomandare (copiază linkul)
  function showReferral() {
    var url = location.href.split("#")[0];
    msg.className = "form-message success";
    msg.innerHTML = "";
    var span = document.createElement("span");
    span.textContent = t.referral + " ";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "share-link";
    btn.textContent = t.copy;
    btn.addEventListener("click", function () {
      var done = function () { btn.textContent = t.copied; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else { done(); }
    });
    msg.appendChild(span);
    msg.appendChild(btn);
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  // Trimitere către Mailchimp prin JSONP (rămâne pe pagină)
  function mailchimpSubscribe(email, onResult) {
    var cbName = "mc_cb_" + Date.now();
    var script = document.createElement("script");

    var timeout = setTimeout(function () {
      cleanup();
      onResult({ result: "error", msg: "timeout" });
    }, 12000);

    function cleanup() {
      clearTimeout(timeout);
      try { delete window[cbName]; } catch (e) { window[cbName] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cbName] = function (data) {
      cleanup();
      onResult(data || { result: "error" });
    };

    // /post -> /post-json + callback JSONP
    var base = MAILCHIMP_URL.replace("/post?", "/post-json?");
    var url = base + "&EMAIL=" + encodeURIComponent(email);
    url += "&LANG=" + LANG.toUpperCase(); // RO / EN — pt. split pe limbă (Customer Journey)
    if (MAILCHIMP_BOT) url += "&" + encodeURIComponent(MAILCHIMP_BOT) + "=";
    url += "&c=" + cbName;

    script.src = url;
    script.onerror = function () { cleanup(); onResult({ result: "error", msg: "network" }); };
    document.body.appendChild(script);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setMessage("", "");

    var email = emailInput.value.trim();
    if (!validEmail(email)) {
      setMessage(t.invalid, "error");
      emailInput.focus();
      return;
    }
    if (!consentInput.checked) {
      setMessage(t.consent, "error");
      highlightConsent();
      return;
    }
    if (consentLabel) consentLabel.classList.remove("consent-error");
    if (!MAILCHIMP_URL) {
      setMessage(t.noconf, "error");
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = t.sending;

    mailchimpSubscribe(email, function (data) {
      btn.disabled = false;
      btn.textContent = original;

      // Mailchimp întoarce result:"success" ȘI pentru email deja înscris
      // (msg conține "already subscribed") — verificăm asta ÎNAINTE de succesul normal.
      var already = data.msg && /already subscribed|already a list member/i.test(data.msg);
      if (already) {
        showReferral();
      } else if (data.result === "success") {
        form.reset();
        setMessage(t.success, "success");
      } else {
        setMessage(t.error, "error");
      }
    });
  });
})();
