# Wolf Contractor site: deploy guide

This folder is a production-ready, SEO-complete static homepage. Unlike the standalone
bundle export, all content is in the HTML source, so Google, Bing, and AI answer engines can
read it without running JavaScript. It works fully with JavaScript disabled.

## What is in here

- `index.html` - the full homepage. Real HTML content, SEO head (title, meta, Open Graph,
  Twitter, canonical, robots), JSON-LD schema (ProfessionalService + FAQPage), semantic
  headings, one H1, mobile responsive, no em-dashes.
- `robots.txt` - allows search and AI crawlers, points to the sitemap.
- `sitemap.xml` - one URL for now (homepage). Add a line per page as you build them.

## Before you go live (10-minute checklist)

1. Buy the domain and set it. Replace every `https://www.wolfcontractor.com/` in
   `index.html`, `robots.txt`, and `sitemap.xml` with your real domain.
2. Real phone number: replace `(555) 014-2040` and `tel:+15550142040`.
3. Real email: `hello@wolfcontractor.com` is used in the FAQ and schema. Set a real inbox.
4. Social links: update the `sameAs` URLs in the JSON-LD to your real profiles (or remove
   the ones you do not have).
5. Wire the form: the CTA form `action` points to `https://formspree.io/f/your-form-id`.
   Create a free Formspree form (or use Netlify Forms) and paste your real endpoint. Test a
   submission.
6. Add a real social share image at `/og-image.jpg` (1200x630). The tags already point to it.
7. Numbers: the site claims "312 sites launched" and "3.8x lead lift". Make sure these are
   true. If not, change them. Do not ship claims you cannot back, it is a trust and (for
   reviews) a Google policy risk.

## How to deploy (pick one, all free)

Netlify drop (easiest, no account tools needed):
1. Go to app.netlify.com/drop
2. Drag this `site` folder onto the page. It goes live on a temporary URL in seconds.
3. Add your custom domain in Site settings.

Vercel:
1. `npm i -g vercel` then run `vercel` inside this folder, follow prompts.
2. Add your domain in the Vercel dashboard.

Cloudflare Pages / GitHub Pages also work. It is plain static files, any host serves it.

## Right after launch (do these, from the SEO playbook)

1. Add the site to Google Search Console and Bing Webmaster Tools. Submit `sitemap.xml`.
2. Test the page in Google Rich Results Test (confirm FAQ + Organization schema pass).
3. Run PageSpeed Insights, confirm Core Web Vitals pass.
4. Create and complete the Google Business Profile.
5. Then start the money-page and content build from the playbook Section 3 and 12.

## Important: this is the homepage, phase 1

To rank for every money keyword (window cleaning website design, contractor SEO, pressure
washing website design, and so on) you still need one page per keyword, as mapped in
`../Wolf-Contractor-SEO-Playbook.md` Section 3. This homepage is built to the same standard
so those pages can be cloned from it. Keep the same head structure, schema pattern, and
semantic layout on each new page.
