# Naya Blog Kaise Add Karein — Jet's Website

Yeh site static HTML hai. Ek naya blog add karne ke liye 3 chhote kaam hote hain:
1. Naya article file banao (template se)
2. `blog.html` par ek card add karo
3. `sitemap.xml` mein ek line add karo

Phir site upload/deploy kar do. Bas.

Time: 10-15 minute per blog.

---

## STEP 1 — Naya article file banao

1. `blog/_TEMPLATE.html` file ko **copy** karo.
2. Copy ko naya naam do. Naam **chhote letters** mein, spaces ki jagah **hyphen (-)**, aur `.html` se end.
   - Achha: `fall-gutter-cleaning-tips.html`
   - Ghalat: `Fall Gutter Cleaning.html` (spaces aur capital letters se bacho)
3. File ko text editor (Notepad, VS Code, kuch bhi) mein kholo.
4. Har `[[ ... ]]` marker ko apne text se replace karo. List neeche hai.

### Kya-kya badalna hai (`[[ ... ]]` markers)

| Marker | Kya daalein | Example |
|---|---|---|
| `[[SLUG]]` | File ka naam bina `.html` ke. **3 jagah aata hai**, teeno same rakho. | `fall-gutter-cleaning-tips` |
| `[[TITLE]]` | Blog ka title. **6 jagah aata hai**, sab same. | `Fall gutter cleaning tips for Richmond homes` |
| `[[DESCRIPTION]]` | 1-2 line summary (Google search mein dikhta hai). **4 jagah**, sab same. | `Clogged gutters cause roof and foundation damage. Here's when and why to clean them before winter.` |
| `[[DATE_ISO]]` | Aaj ki date is format mein: YYYY-MM-DD | `2026-07-22` |
| `[[DATE_TEXT]]` | Wahi date padhne wale format mein | `July 22, 2026` |
| `[[CATEGORY]]` | Topic. Inmein se ek: Window Cleaning / Pressure Washing / Soft Washing / Home Tips | `Home Tips` |
| `[[IMAGE]]` | Kaun si tasveer upar dikhe. **4 jagah**, sab same. Neeche list se ek chuno. | `svc-window.webp` |

**Available images (assets folder mein already hain):**
- `svc-window.webp` — window cleaning
- `svc-pressure.webp` — pressure washing
- `svc-house.webp` — house / soft washing
- `ba-house-after.webp` — clean home exterior

(Nayi tasveer chahiye to WebP format mein `assets/` folder mein daal do, phir uska naam yahan likho.)

### Article ka content (bich wala hissa)

File mein yeh section dhoondo:
`<!-- ===== WRITE YOUR ARTICLE BELOW ===== -->`

Wahan:
- `[[INTRO_PARAGRAPH]]` — pehla paragraph (2-3 lines).
- `[[SUBHEADING_1]]` + `[[PARAGRAPH_1]]` — ek heading aur uska paragraph.
- Yeh heading+paragraph jodi jitni baar chahiye **copy-paste** kar sakte ho.
- `<ul>` list aur `pro-tip` box optional hain. Na chahiye to poora block delete kar do.
- Aakhri call-to-action paragraph (Get a free quote wala) **hamesha rehne do**.

**SEO tip:** Title aur pehle paragraph mein woh keyword zaroor daalo jispe rank karna hai, aur city ka naam (jaise "Richmond" ya "Short Pump").

---

## STEP 2 — `blog.html` par card add karo

`blog.html` file kholo. `<div class="posts-grid">` dhoondo. Uske andar yeh block **paste** karo (upar values apni blog ke hisaab se badlo):

```html
<article class="post-card reveal">
  <img src="assets/svc-window.webp" alt="YOUR TITLE HERE" loading="lazy" style="aspect-ratio:16/10;object-fit:cover;width:100%" />
  <div class="p-body"><div class="post-meta">CATEGORY <span class="date">· DATE</span></div><h3>YOUR TITLE HERE</h3><p>ONE LINE SUMMARY.</p><a class="card-link" href="blog/YOUR-SLUG.html">Read More →</a></div>
</article>
```

Badlo: image naam, `alt` title, `CATEGORY`, `DATE`, `<h3>` title, summary, aur `href` mein `YOUR-SLUG`.

---

## STEP 3 — `sitemap.xml` mein line add karo

`sitemap.xml` file kholo. Baaki blog `<url>` lines ke saath yeh add karo:

```xml
<url><loc>https://jetswindows.com/blog/YOUR-SLUG.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
```

`YOUR-SLUG` ko apni file ke naam se badlo.

---

## STEP 4 — Live karo

- **Agar hosting Git se judi hai (Netlify / Vercel):**
  ```
  git add .
  git commit -m "New blog: your title"
  git push
  ```
  Site khud 1-2 minute mein update ho jaati hai.

- **Agar manual hosting hai:** teen cheezein upload karo:
  1. Nayi `blog/your-slug.html`
  2. Updated `blog.html`
  3. Updated `sitemap.xml`

- **Deploy ke baad:** Google Search Console mein jaao aur naye blog ka URL "Request Indexing" kar do. Isse Google jaldi crawl karta hai.

---

## Checklist (har blog ke liye)

- [ ] File ka naam chhote-letters + hyphens + `.html`
- [ ] Saare `[[ ... ]]` markers replace ho gaye
- [ ] `[[SLUG]]` teeno jagah same
- [ ] `[[TITLE]]` sab jagah same
- [ ] Title + intro mein keyword aur city daala
- [ ] `blog.html` par card add kiya
- [ ] `sitemap.xml` par line add ki
- [ ] Upload / push kiya
- [ ] Search Console mein indexing request ki

---

## Yaad rahe (SEO)

- Naye blogs SEO ke liye **faida** dete hain. Google fresh, useful content pasand karta hai.
- Poori site wapas upload karne ki zaroorat nahi — sirf nayi file + 2 choti edits.
- Quality > quantity. Mahine mein 1-2 asli, madadgar blog kaafi hain.
- Har blog kisi ek keyword/topic par focus rakhe, keyword stuffing na karo.

Koi confusion ho to blog ka title + content mujhe bhej do, main poora bana ke daal dunga.
