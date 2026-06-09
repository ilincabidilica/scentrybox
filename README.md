# Scentry Box — landing page (listă de așteptare)

Pagină statică, în română, mobile-first, conformă GDPR/ePrivacy. Zero request extern înainte de consimțământ (fonturi de sistem, fără Google Fonts CDN). Gata de publicat gratuit.

## Structura

```
scentrybox/
├── index.html        # landing page
├── privacy.html      # Politica de confidențialitate (GDPR)
├── cookies.html      # Politica de cookies
├── terms.html        # Termeni de utilizare
├── assets/
│   ├── styles.css    # stiluri
│   ├── consent.js    # banner cookies (blochează tracking-ul până la accept)
│   └── app.js        # formularul listei de așteptare
└── README.md
```

## 1. Vezi-o local

Deschide `index.html` direct în browser, SAU pornește un server simplu:

```bash
cd scentrybox
python3 -m http.server 8000
# apoi deschide http://localhost:8000
```

## 2. Conectează formularul la Mailchimp (ca să strângi emailuri)

Formularul e deja gata pentru **Mailchimp** și rămâne pe pagină (fără redirect urât). Trebuie să lipești UN singur lucru:

1. Cont gratuit pe mailchimp.com (până la 500 de contacte gratis).
2. **Audience → Signup forms → „Embedded form".**
3. Din codul afișat, copiază valoarea atributului `action`, ceva de forma:
   `https://scentrybox.us21.list-manage.com/subscribe/post?u=XXXX&id=YYYY&f_id=ZZZZ`
4. Lipește-o în `assets/app.js` la `var MAILCHIMP_URL = "..."`. Gata.
5. (Recomandat GDPR) În Mailchimp: Audience → Settings → activează **double opt-in** (confirmare pe email).
6. (Opțional anti-spam) În același cod Mailchimp există un câmp ascuns `name="b_XXXX_YYYY"`. Copiază acel `name` în `MAILCHIMP_BOT`.

> Cât timp `MAILCHIMP_URL` e gol, formularul afișează un mesaj-ghid în loc să trimită.
>
> Nu vrei Mailchimp? **Formspree** sau **Tally** merg și ele — îmi spui și schimb integrarea în câteva minute.

## 3. Publică gratuit

- **Netlify** (cel mai simplu): intră pe netlify.com → „Add new site" → „Deploy manually" → trage folderul `scentrybox`. Primești un URL live în secunde. (Bonus: dacă folosești Netlify Forms, adaugi `netlify` pe tag-ul `<form>` și nu mai ai nevoie de Formspree.)
- **Vercel** sau **GitHub Pages**: la fel de bune, gratuite.
- Conectează domeniul `scentrybox.ro` (de cumpărat la un registrar .ro, ex. RoTLD/registrarii lor).

## 4. ⚠️ OBLIGATORIU înainte de a trimite trafic — completează placeholderele legale

Caută în `privacy.html`, `cookies.html`, `terms.html` textele evidențiate (`[...]`) și completează:

- [ ] Numele operatorului (numele tău în faza de validare, sau PFA/SRL când îl ai)
- [ ] Adresa
- [ ] CUI/CIF (când există firmă)
- [ ] Email de contact (ex. `contact@scentrybox.ro`)
- [ ] Data ultimei actualizări (`[ZZ.LL.AAAA]`)
- [ ] Numele furnizorilor reali (Mailchimp/Formspree, Netlify/Vercel, Meta/TikTok/Google dacă adaugi pixeli)
- [ ] Perioada de păstrare a datelor (ex. 24 luni)
- [ ] Actualizează `og:url` și `og:image` în `index.html` cu domeniul tău + o imagine 1200×630

## 5. Adaugă pixeli de tracking (pentru reclame) — DOAR în consent.js

Codul Meta Pixel / TikTok Pixel / GA4 se pune **exclusiv** în funcția `loadNonEssential()` din `assets/consent.js`. Așa se încarcă doar după ce userul apasă „Accept" → conform GDPR. Nu pune coduri de tracking direct în `index.html`.

## 6. Font custom (opțional)

Pagina folosește fonturi de sistem ca să evite problema GDPR cu Google Fonts CDN. Dacă vrei un font de brand (ex. Cormorant), **auto-găzduiește-l**: descarcă fișierele `.woff2`, pune-le în `assets/fonts/`, declară `@font-face` în `styles.css` și schimbă `--serif`. Astfel nu se mai face niciun request către servere terțe.

---

### Notă legală
Aceste pagini acoperă cerințele standard GDPR/ePrivacy pentru o pagină de listă de așteptare și sunt un punct de plecare solid — **nu** sunt consultanță juridică. Înainte de a începe să vinzi efectiv (abonamente, plăți), completează datele reale și ideal cere o verificare scurtă de la un avocat (vezi și secțiunea 7 din brief-ul de proiect).
