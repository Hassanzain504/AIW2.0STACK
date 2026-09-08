# Momentum Tree Experts, technical audit

- Site: https://momentumtree.com
- Contact: Mounir Fahim, Owner, ISA Certified Arborist
- Market: Southeast Michigan, based Novi (42.4765, -83.4755)
- Audit date: 25 August 2026
- Auditor: Hassan

All findings below were verified by direct request against the live site on the
audit date. Every number is reproducible with curl. Nothing here is estimated.

---

## Build timeline

| Date | Event | How it was established |
|---|---|---|
| 05 Apr 2023 | Domain registered | RDAP, registrar Squarespace Domains LLC |
| 06 Feb 2024 18:47 UTC | Webflow site created | Webflow site id `65c27ead891d81b4904af766` decodes to this timestamp |
| 06 Feb 2024 19:11 UTC | Logo asset uploaded | Asset id `65c284579dc1be641e417194` decodes to this timestamp |
| 14 Jan 2026 | Site live on `www` | Wayback snapshot exists at that date |
| 21 Mar 2026 | Domain record changed | RDAP `last changed` event |
| 08 Apr 2026 13:49 UTC | base44 app created | App id `69d65cfa3c9708e055888f34` decodes to this timestamp |
| 22 Aug 2026 12:16 UTC | Current JS bundle compiled | `last-modified` on `/assets/index-Be_B9i38.js` |
| 24 Aug 2026 06:36 UTC | Current HTML deployed | `last-modified` on `/` |

The site ran on Webflow from Feb 2024 for roughly two years, then moved to a
base44-generated React SPA hosted on Vercel. The current build went live the day
before this audit.

Note on sequence: the cold outreach email was sent 20 Aug 2026 and replied to the
same evening. The rebuild followed on 22 to 24 Aug. The phrase "Free Estimate",
which the outreach email noted was absent, now appears twice in the JS bundle.

---

## Finding 1, the site serves no content to crawlers

Severity: critical. This is the reason the other 59 pages do not rank.

The site is a client-side rendered React SPA. The server returns a 5,558 byte
shell containing `<div id="root"></div>` and nothing else. All content is
assembled in the visitor's browser.

Readable text in the raw HTML response is **81 characters**, and those 81
characters are the `<title>` tag text:

```
Tree Service Southeast Michigan | ISA Certified Arborists | Momentum Tree Experts
```

Every page returns a byte-identical file. Verified by MD5:

```
f456d4870562bd26c1d769340810edc0  /
f456d4870562bd26c1d769340810edc0  /tree-service/novi
f456d4870562bd26c1d769340810edc0  /services/stump-grinding
f456d4870562bd26c1d769340810edc0  /contact
```

Same title, same meta description, same empty body across all of them. To a
crawler on first pass the 60 pages in the sitemap are one page repeated 60 times.

Requesting with a Googlebot user-agent returns the same shell, so there is no
prerender or dynamic rendering fallback in place.

### Competitor comparison, same test

| Site | Raw HTML | Readable text | H1 | JSON-LD | Canonical |
|---|---|---|---|---|---|
| **Momentum Tree** | 5,558 B | **81** | **0** | **0** | **0** |
| Arbor Man | 38,996 B | 4,316 | 1 | 0 | 0 |
| American Made | 53,643 B | 8,260 | 1 | 0 | 0 |
| Owen Tree | 166,316 B | 7,238 | 2 | 0 | 1 |
| Clean Cut | 290,965 B | 13,686 | 1 | 2 | 1 |

### Accuracy note

Google can execute JavaScript, so do not claim the site is invisible to Google.
The defensible statements are:

- Rendering happens in a second, deferred pass with a limited budget. On a
  low-authority domain many pages do not reliably get through it.
- Most AI answer engines do not execute JavaScript, so the site is effectively
  absent from that surface entirely.
- Before rendering, all 60 URLs are duplicates of each other, and there is no
  canonical tag anywhere to disambiguate them.

---

## Finding 2, the rebuild orphaned the old URLs

Severity: critical, and actively losing value while it sits.

Google still holds URLs from the Webflow build. None appear in the new sitemap.
All return HTTP 200 with zero redirects, serving the same empty shell.

| Indexed URL | HTTP | Redirects | In new sitemap |
|---|---|---|---|
| `/reviews` | 200 | 1 (to `/`) | no |
| `/projects` | 200 | 0 | no |
| `/blog/the-gold-standard-in-tree-care-why-less-than-1-of-tree-services-qualify-for-tcia-accreditation` | 200 | 0 | no |
| `/blog/the-hidden-costs-of-hiring-the-wrong-tree-service---why-certification-matters` | 200 | 0 | no |
| `/blog/dangerous-or-just-misunderstood-how-to-tell-if-your-tree-is-really-a-threat` | 200 | 0 | no |

The new sitemap carries short slugs for what appears to be the same articles, for
example `/blog/tcia-accreditation-gold-standard`. So the same content now exists
at two addresses, and the address holding the accumulated authority is the one
returning nothing.

Because the SPA answers 200 for every path, Google receives no signal that
anything moved. No 301, no 404.

---

## Finding 3, soft 404s on every invalid path

Severity: high.

Any path returns HTTP 200 with the standard shell. Verified:

```
200  /this-page-does-not-exist-hassan-test
200  /tree-service/atlantis-underwater-city
200  /services/unicorn-grooming
```

The site presents an unbounded set of valid-looking URLs. This wastes crawl
budget and makes it impossible for Google to retire dead paths.

---

## Finding 4, no canonical tags

Severity: high.

Zero `rel="canonical"` tags on any page. Combined with Findings 1, 2 and 3, and
with both `www` and non-`www` resolving, there is nothing telling Google which
address is authoritative for any piece of content.

Owen Tree and Clean Cut both ship canonical tags.

---

## Finding 5, split nameserver delegation

Severity: high, needs confirmation with the owner before raising.

The domain delegates to eight nameservers across two providers at once:

```
dns1.p05.nsone.net.        ns01.squarespacedns.com.
dns2.p05.nsone.net.        ns02.squarespacedns.com.
dns3.p05.nsone.net.        ns03.squarespacedns.com.
dns4.p05.nsone.net.        ns04.squarespacedns.com.
```

NS1 is the Vercel side, Squarespace is left over from the previous setup. A
resolver may query either set. If the two sets do not hold identical records,
resolution is inconsistent.

Several requests during this audit timed out or reset against
`www.momentumtree.com` and some subpages while competitor sites responded on
every attempt. That is consistent with split delegation but was not measured
under controlled conditions, so treat it as a lead to confirm, not a finding to
present as fact.

A record currently resolves to `216.150.1.1` (Vercel).

---

## Finding 6, migration leftovers and dead meta

Severity: low, but they signal how the site was assembled.

The current homepage head references three separate CDNs:

- `media.base44.com` for the hero image
- `cdn.prod.website-files.com` for the favicon, a leftover from the Webflow build
- `res.cloudinary.com` for the Open Graph image

It also ships `<meta name="keywords">` with 25 stuffed phrases and
`<meta name="revisit-after">`. Google has ignored both for well over a decade.

The JS bundle is a single 546 KB file, which is heavy for LCP on mobile.

Positives worth keeping: GA4 is installed (`G-672RBHV8R0`), CallRail call
tracking is installed, `robots.txt` is clean and points at the sitemap.

---

## What is genuinely strong here

Do not lead with problems only. The content and positioning are better than every
competitor checked.

- 60 pages: 19 town pages, 16 service pages, 6 dedicated credential pages
- TCIA accreditation plus ISA certification, with TRAQ and CTSP named
- 4.9 rating from 368 reviews
- A preservation-first angle that pre-empts the main objection to tree companies,
  that the person quoting removal profits from removal
- Services competitors do not list: air spading, radial trenching, vertical
  mulching, cabling, bracing, tree guying

The asset is real. The delivery layer is what is broken.

---

## Fix order

1. Server-render or prerender every route. Nothing else matters until a crawler
   receives real HTML. This alone unlocks the 60 pages already written.
2. Map every old Webflow URL to its new equivalent with a 301. Do this before
   more of the accumulated authority decays.
3. Return a real 404 for invalid paths.
4. Add self-referencing canonical tags and pick one host, `www` or bare.
5. Add LocalBusiness, Service and FAQPage JSON-LD.
6. Collapse the nameserver delegation to one provider.
7. Split the 546 KB bundle, drop the dead meta tags, consolidate the CDNs.

---

## Before presenting

- Open the site in a browser and confirm what the rendered page actually shows.
  Every finding above concerns the raw response, which is the correct target, but
  claims about on-page copy need the rendered view.
- `view-source:https://momentumtree.com/` is the demo. The whole file fits on one
  screen and proves Finding 1 without explanation.
- Confirm with the owner who built and controls the current site before
  describing it as a mistake.

---

## CORRECTION to Finding 1, issued 26 August 2026

The first version of this audit implied the client-side rendering was preventing
the pages from being indexed. That was wrong and must not be repeated in a
meeting.

Google does render the site and the pages are in the index with their own unique
titles. Verified by search:

- `momentumtree.com/tree-service/novi` is indexed as "Tree Service in Novi, MI | Certified Arborists"
- `momentumtree.com/tree-service/northville` is indexed as "Tree Service in Northville, MI | Certified Arborists | Momentum Tree Experts"
- `/services/tree-trimming`, `/services/municipal-tree-services`, `/services/tree-risk-assessment`,
  `/about-us`, `/services`, `/faq`, `/projects`, `/reviews` are all indexed

So the rendering pass is working. The empty raw HTML is still a real weakness, but
for narrower reasons than first stated:

- Most AI answer engines do not execute JavaScript, so the site is largely absent there
- There is still no schema, no canonical tag, and soft 404s on every invalid path
- Rendering is a deferred, budget-limited pass, which slows discovery of new pages

The problem is not indexation. It is ranking.

---

## Finding 7, where the town pages actually rank

Measured 26 August 2026 on live search.

| Query | Momentum position | Ranking above them |
|---|---|---|
| tree service Novi MI tree removal arborist | **5** | Owen Tree, Yelp, Lotus Gardenscapes, Clean Cut |
| tree service Northville MI certified arborist tree removal | **5** | Lotus Gardenscapes, Clean Cut, Get Tree Removal Service, Miller Tree |
| tree service Ann Arbor MI certified arborist tree removal | **not in top 10** | Davey, LawnStarter, Monster Tree, Yelp, Guardian Tree Experts |

The pattern: they place mid-first-page in the two towns closest to their Novi base
and disappear entirely further out. Ann Arbor is in their sitemap and in their
service-area meta, but they do not compete there.

Note for the meeting: Owen Tree Service, which outranks them in Novi, describes
itself as the first tree care company in the United States to earn TCIA
accreditation. Momentum's strongest differentiator, the "less than 1% hold TCIA"
line, is therefore weaker in this specific market than it looks nationally. Do not
build the pitch on that line without checking it.

Map pack positions were not measured. Doing that properly needs geolocated
queries per town, which was not possible from this environment. Do not state map
pack rankings without running those checks.

---

## Finding 8, the Google Ads conversion event has nowhere to go

Severity: high, and directly about money rather than rankings.

The contact form handler in the current build runs:

```js
await fs.functions.invoke("sendContactForm", t)
window.gtag("event", "ads_conversion_Form_1")
```

`ads_conversion_Form_1` is the event name Google Ads generates when a conversion
action is created, so a Google Ads account exists and ads are presumably running.

There is no Google Ads tag on the site. Checked in both the page source and the
compiled JS bundle on the live build:

| Looked for | Found |
|---|---|
| `AW-` conversion tag | 0 |
| `send_to` parameter | 0 |
| `gclid` / conversion linker | 0 |
| Tag actually loaded | `G-672RBHV8R0`, which is GA4, not Ads |

So the event fires into GA4 and stops there.

The caveat that must be stated: conversions can still reach Google Ads if GA4 is
linked to the Ads account and this event has been imported as a conversion. That
is not visible from outside. So the correct framing is a question, not an
accusation.

If that link is not in place, Google Ads cannot tell which clicks produce form
submissions, Smart Bidding has no signal to optimise against, and cost per lead
cannot be calculated. CallRail is installed and handling call attribution, which
makes the form side an odd gap.

How the owner checks it in about a minute: Google Ads, Goals, Conversions, then
look at whether the form action has recorded anything in the last thirty days.

---

## Finding 9, no financing and no booking system

The compiled bundle contains no mention of financing or payment plans, and no
booking or scheduling integration of any kind. No Calendly, Jobber, HousecallPro,
ServiceTitan or Arborgold. The only conversion path is a form and a phone number.

Removals routinely run into thousands of dollars. On a paid-traffic site with no
finance messaging, some share of qualified visitors leave on price alone without
ever asking.
