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

  var MAILCHIMP_URL = ""; // <-- lipește aici URL-ul "action" din embed-ul Mailchimp
  var MAILCHIMP_BOT = ""; // <-- opțional: name-ul câmpului ascuns b_XXXX_YYYY

  var form = document.getElementById("waitlist");
  var msg = document.getElementById("formMessage");
  var emailInput = document.getElementById("email");
  var consentInput = document.getElementById("consent");

  // anul în footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  if (!form) return;

  function setMessage(text, type) {
    msg.textContent = text;
    msg.className = "form-message" + (type ? " " + type : "");
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
      setMessage("Te rugăm să introduci o adresă de email validă.", "error");
      emailInput.focus();
      return;
    }
    if (!consentInput.checked) {
      setMessage("Bifează acordul pentru a continua.", "error");
      return;
    }
    if (!MAILCHIMP_URL) {
      setMessage("⚠️ Formular neconfigurat încă — adaugă MAILCHIMP_URL în assets/app.js (vezi README).", "error");
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Se trimite…";

    mailchimpSubscribe(email, function (data) {
      btn.disabled = false;
      btn.textContent = original;

      if (data.result === "success") {
        form.reset();
        setMessage("Gata! Ești pe listă. 🤍 Verifică-ți emailul pentru confirmare.", "success");
      } else if (data.msg && /already subscribed/i.test(data.msg)) {
        setMessage("Ești deja pe listă. 🤍", "success");
      } else {
        setMessage("Ceva n-a mers. Mai încearcă o dată în câteva momente.", "error");
      }
    });
  });
})();
