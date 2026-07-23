# Wolf Contractor — Next.js Site

The Wolf Contractor marketing site, migrated from a single client-side React
bundle to **Next.js 14 (App Router) with static export**, so every word of
content is present in the served HTML and Google can crawl it.

## Why this exists

The old site shipped as one JavaScript bundle. `view-source` on the live page
showed only a loading SVG — the hero, services, pricing, FAQ, everything was
locked inside JS. Google crawled an empty page, so nothing could rank. This
project fixes that: all body copy now renders on the server.

## Stack

- Next.js 14, App Router, `output: 'export'` (static HTML in `out/`)
- React 18, TypeScript
- Fonts self-hosted via `next/font` (Space Grotesk, JetBrains Mono, Inter)

## Structure

```
app/
  layout.tsx     SEO metadata, JSON-LD @graph, fonts, lang="en"
  page.tsx       Assembles the homepage sections
  globals.css    Design tokens (--accent, --ink, --bone, --line) + CSS hover states
components/
  Nav.tsx        'use client' — dropdown menus, scroll behavior
  Hero.tsx       Server — headline, marquee (CSS animation)
  Services.tsx   Server — hover handled in CSS
  Process.tsx    Server
  Work.tsx       Server — hover handled in CSS
  Principles.tsx 'use client' — rotating "What we stand for" block
  Pricing.tsx    Server
  FAQ.tsx        'use client' — accordion
  CTA.tsx        'use client' — 3-step lead form (submits to WhatsApp)
  Footer.tsx     Server
  ui.tsx         Shared server-safe primitives (icons, Logo, SectionLabel)
lib/
  site.ts        Contact details + wa.me link builder
public/          robots.txt, sitemap.xml, llms.txt, og-image.png
```

Only the four genuinely interactive pieces are client components (nav menus,
principles rotator, FAQ accordion, contact form). Everything carrying body copy
renders on the server. Hover effects that were React state in the source are now
plain CSS, so those sections stayed server-rendered without losing any visuals.

## Lead form → WhatsApp

The "get a free mockup" form is the site's only lead capture. On submit it opens
WhatsApp to the business number (`wa.me/12135754650`) with a pre-filled message
containing the visitor's trade, name, business, existing site, and phone. Change
the number in `lib/site.ts`.

## Commands

```bash
npm install
npm run dev        # local dev at http://localhost:3000
npm run build      # static export to out/
```

## Verify the migration worked

After `npm run build`, the served HTML must contain the real content:

```bash
grep -o "WEBSITES" out/index.html            # H1
grep -o "Launchpad" out/index.html           # pricing copy
grep -o "ProfessionalService" out/index.html # JSON-LD schema
```

All three return matches. If body copy is missing from `out/index.html`, the
migration has failed its only purpose.

## Deploy (Vercel)

1. Push this folder to a Git repo (or use the Vercel CLI from inside it).
2. In Vercel, import the project. Framework preset: **Next.js**. Vercel detects
   `output: 'export'` and serves the static build — no extra config needed.
3. Point `wolfcontractor.com` at the Vercel project in the domain settings.

The free (Hobby) tier is sufficient for a static export.

## Ground rules carried over from the source

No fabricated content. No invented stats, testimonials, review counts, client
names, or `AggregateRating`/`Review` schema. The only contact points are
`hello@wolfcontractor.com` and the WhatsApp number above. Real case studies get
added later. See the migration brief (`CLAUDE.md` in the original package) for
the full rationale.

## What comes next (not built yet)

Per-trade landing pages under `/{trade}-marketing/` (window cleaning and pressure
washing first). The route structure and shared components make these easy to add.
Keyword maps and page anatomy live in the SEO plan docs from the original package.
