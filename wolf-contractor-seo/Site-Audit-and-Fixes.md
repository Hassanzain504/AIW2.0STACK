# Wolf Contractor Site Audit and Fixes

Audit of the actual website file you uploaded (`Wolf_Contractor_standalone.html`), checked
against the SEO playbook. This is the real, file-specific audit that goes with the plan.

Audited: 2026-07-01
File: Wolf_Contractor_standalone.html (1.7 MB standalone export)

---

## 1. What this file actually is

It is a single standalone HTML file that boots a React app in the browser. The real page
content is packed inside two script blocks (a gzip+base64 JavaScript bundle) and is only
drawn after the browser runs JavaScript. It is an export from a website builder (the
`__bundler` and `EDITMODE` markers), not a deployed website. There is no domain, no server,
no separate pages, no sitemap, and no analytics attached to it yet.

That single fact drives most of the findings below. Search engines and AI answer engines
have to see your content in the HTML that comes back from the server. This file gives them
almost nothing until JavaScript runs, and AI crawlers in particular often do not run it.

---

## 2. Critical findings (ranked by impact)

Severity: BLOCKER = the page basically cannot rank until fixed. HIGH = large ranking loss.
MEDIUM = meaningful. LOW = polish.

### F1. BLOCKER — Content is invisible without JavaScript

The pre-render HTML body is empty. The only thing in the raw body before JavaScript runs is
an edit-mode config comment. The file even carries a `<noscript>` line that reads "This page
requires JavaScript to display."

Why it matters: Google can sometimes render JavaScript, but it is slower, unreliable for
large single-page bundles, and it is not guaranteed. Bing is worse at it. AI answer engines
(ChatGPT, Perplexity, Claude, Google AI Overviews) mostly read the raw HTML and will see a
blank page, so you cannot be cited by them at all in this state. This is the single biggest
blocker to "every page ranks."

Fix: The site must serve real HTML content in the page source. Options, best first:
- Rebuild/export as a static multi-page site where each page's text is in the HTML source
  (static-site generation / pre-rendering). This is the correct path for an agency site.
- Or server-side render (SSR) the app.
- Do not ship this client-only bundle as the production site. It is fine as a design mockup,
  not as the thing Google indexes.

### F2. BLOCKER — It is one page, so it can only rank for one thing

The playbook maps a separate URL to each money keyword (window cleaning website design,
window cleaning SEO, window cleaning marketing, pressure washing, and so on). This file is a
single page. A single page realistically ranks for one primary topic, not ten. You are
leaving every other money keyword on the table.

Fix: Build the page set from Section 3 of the playbook. One page per money keyword, each
with its own URL, title, and focused content. This is non-negotiable for "every page ranks,"
because you need pages to exist first.

### F3. HIGH — The head is almost empty (no meta description, OG, canonical, robots)

The rendered head contains only a `<title>`. There is no meta description, no Open Graph or
Twitter tags (so shared links look bare), no canonical tag, and no robots directive.

Fix: Add to every page: a unique meta description (140 to 155 chars, with the keyword and a
reason to click), Open Graph and Twitter card tags, and a self-referencing canonical.
Appendix A of the playbook has ready title and meta drafts.

### F4. HIGH — No structured data (schema) anywhere

There is no JSON-LD on the page. No Organization, no LocalBusiness, no Service, no FAQPage,
no Review schema.

Fix: Implement the schema set from playbook Section 4.4. Schema is what earns rich results
and helps AI engines understand who you are and what you offer. FAQPage schema in particular
is one of the highest-leverage things for both "People also ask" and AI answers.

### F5. HIGH — The title tag is generic and off-keyword

Current title: "Wolf Contractor — Websites that book jobs".

Two problems. First, it contains no target keyword. Nobody searches "websites that book
jobs." They search "contractor website design" or "window cleaning website design." Second,
it uses an em-dash, which also breaks your own brand rule (no em-dashes) and looks slightly
off in results.

Fix: Rewrite to lead with the primary keyword and use a plain separator. Example for the
homepage if you stay broad: "Contractor Website Design That Books Jobs | Wolf Contractor".
For each money page use the Appendix A drafts.

### F6. HIGH — Strategic mismatch: the site is broad, your outreach is niche

The site positions broad: the copy reads "We build high-converting websites for
electricians, plumbers, roofers, HVAC, and every trade in between." That is a head-on
Contractor Gorilla clone position. But your outreach engine (the other zip) targets only
window cleaning businesses. The two halves of your business are pointed at different markets.

Why it matters for SEO: broad means you compete directly with an 18-year, 3,800-project
incumbent for the hardest head terms, which is slow and expensive. Niche (window and
exterior cleaning) is where you can actually rank in months, and it matches the leads your
outreach already brings in. Right now your SEO and your outreach would not reinforce each
other.

Fix: Decide the position deliberately. Recommended: lead with window and exterior cleaning
(matches your outreach, faster to rank, defensible), and keep a broad "all trades" hub page
for the wider net. Then the homepage H1, title, and copy should say window/exterior cleaning
first. If you deliberately want to stay broad, that is a valid choice, but then update the
outreach engine to match, and know the SEO timeline is longer. This is your call; flag it
and I will re-cut the plan to whichever you pick.

### F7. MEDIUM — Em-dashes in body copy

The body copy uses em-dashes ("books your next job — and we keep it running", "leak money —
slow load times"). This breaks your own operator rule and is easy to clean up.

Fix: Replace em-dashes with periods or plain hyphens with spaces, per your brand rule.

### F8. MEDIUM — No off-page foundation exists yet

Because nothing is deployed, there is no Google Business Profile, no Search Console, no
analytics, no sitemap, no robots.txt, no citations, and no backlinks. None of the off-page
work in the playbook can start until the site is live on a real domain.

Fix: Ship to a real domain, then run playbook Sections 5, 6, 7, and 11 (technical setup,
Google Business Profile, backlinks, and measurement).

### F9. LOW — Confirm image alt text and heading structure after rebuild

Because content is JS-rendered, I could not fully verify every image has alt text or that
there is exactly one H1 with a clean H2/H3 outline. The hero and section copy do exist in
the bundle (trades, quote, book, revenue-leak messaging), so the raw material is there.

Fix: During the rebuild, apply the universal on-page checklist (playbook Section 4.1) to
each page: one H1, logical H2/H3, descriptive alt text, internal links.

---

## 3. What is actually good here

- The design and hero concept ("Websites that book jobs", the revenue-leak angle) are
  strong and on-message. The revenue-leak framing matches your audit tool. Keep it.
- There is real, specific copy in the bundle (trades served, free-mockup-in-48-hours offer,
  guarantee before invoice). That is good conversion raw material to carry into the rebuilt,
  crawlable pages.
- The offer ("free mockup in 48 hours before any invoice") is a genuine hook and a great
  lead-magnet page in its own right.

You are not starting from zero on content or design. You are starting from zero on
crawlability and site structure, which is the part that makes pages rank.

---

## 4. Fix map (finding to playbook section)

| Finding | Severity | Fix lives in |
|---|---|---|
| F1 JS-only, empty HTML | BLOCKER | Playbook 5.3 (crawlable content, SSR/static render) |
| F2 Single page | BLOCKER | Playbook 3 (site architecture / page map) |
| F3 Empty head / no meta | HIGH | Playbook 4.1, Appendix A |
| F4 No schema | HIGH | Playbook 4.4 |
| F5 Generic off-keyword title | HIGH | Playbook 4.1, Appendix A |
| F6 Broad vs niche mismatch | HIGH | Playbook 1 (positioning) |
| F7 Em-dashes | MEDIUM | Brand rule |
| F8 No off-page foundation | MEDIUM | Playbook 5, 6, 7, 11 |
| F9 Alt text / heading outline | LOW | Playbook 4.1 |

---

## 5. Do this next (in order)

1. Decide positioning: window/exterior cleaning first (recommended, matches outreach) or
   stay broad. Everything downstream depends on this one choice.
2. Stop treating this standalone bundle as the production site. It is a good mockup. The
   production site must render real HTML per page (static export or SSR).
3. Build the page set from playbook Section 3, one URL per money keyword, using the titles
   and metas in Appendix A.
4. On every page apply the on-page checklist and add schema (playbook Section 4).
5. Deploy to a real domain, then run the technical, local, backlink, and measurement
   sections (5, 6, 7, 11). Nothing off-page can start until it is live.
6. Send me the live domain once deployed and I will re-audit the rendered pages in Search
   Console and confirm each one is indexed and ranking-ready.

---

## 6. Honest bottom line

The design is good and the copy is usable, but as an SEO asset this file cannot rank in its
current form, because search engines and AI engines see a blank page and there is only one
page anyway. This is not a tuning job, it is a structure job: rebuild as a real multi-page,
server-rendered or statically rendered site, one page per keyword, then layer on the on-page,
technical, local, and off-page work in the playbook. Do that and "every page ranks" becomes
a realistic 3 to 6 month outcome for the niche cluster. Skip the structure fix and no amount
of keywords or backlinks will help.
