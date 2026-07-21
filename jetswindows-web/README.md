# Jet's Window Cleaning & Pressure Washing — Website

Static, SEO-optimized marketing site for jetswindows.com (Richmond, VA).
Pure HTML/CSS/JS — no build step. Just upload the folder to any static host.

## Pages
- `index.html` — Home
- `services.html` — Services + FAQ
- `results.html` — Before/After + reviews
- `about.html` — Founders story + crew + video
- `blog.html` — Blog index (6 posts)
- `blog/*.html` — Blog articles

## SEO built in
- Per-page <title> + meta description + canonical + Open Graph/Twitter
- LocalBusiness (HomeAndConstructionBusiness) JSON-LD on home
- FAQPage JSON-LD on Services, BlogPosting JSON-LD on articles
- Semantic HTML (one h1/page, nav/main/article/footer, image alt text)
- sitemap.xml + robots.txt
- Self-hosted fonts (font-display: swap), compressed WebP images, lazy-loading

## Before launch (owner to provide)
1. Replace low-res service/before-after images with high-res originals (export as sized WebP).
2. Confirm exact street address for JSON-LD (currently Richmond, VA locality only).
3. Wire both quote forms to a real endpoint (CRM / email / Formspree). They currently show an inline success message only.
4. Add real crew photos to the carousel.
5. Point the video embed to an unlisted YouTube/Vimeo or compressed MP4.

## Deploy
Any of: Vercel, Netlify, Cloudflare Pages, or GitHub Pages. Drag-drop the folder or connect the repo.
