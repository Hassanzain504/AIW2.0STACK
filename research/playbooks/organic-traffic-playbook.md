# Organic Traffic Playbook (Trades / Home Services)

Scope: what to do after a client hands you their website and their Google Business Profile,
and you own organic lead generation for them. Ordered by leverage, not by ease.

Audience note: every decision here is judged by one question. Does it get the end customer
(the homeowner with a problem) to call this business instead of the other three in the map pack.

Reality check on weights: the percentages people quote for local ranking factors
(GBP ~32%, on-page ~19%, reviews ~16%, links ~15%) come from practitioner opinion surveys
(Whitespark, BrightLocal), not measured algorithm weights. Use them for prioritisation only.

---

## Phase 0. Access and baseline (Days 1 to 3)

Do not touch anything until you own the accounts and have a before-picture. Without a baseline
you cannot prove value at month 3, and proving value is how you keep the retainer.

### Access checklist
- Google Business Profile: primary owner or manager access, not "I'll post for you on WhatsApp"
- Google Search Console: verify via DNS so you keep access if hosting changes
- Google Analytics 4: admin
- Domain registrar and DNS
- Hosting / CMS admin
- Call tracking account (CallRail or similar) in your name, ported later if they leave
- Every review platform login they already have
- Any old agency's accounts, and revoke that agency's access

### Baseline snapshot (screenshot everything, date it)
- Geogrid scan for the 5 to 10 highest-value keywords (Local Falcon or BrightLocal). This is the
  single best before/after asset for reporting.
- GBP performance: calls, direction requests, website clicks, last 6 months
- Search Console: clicks, impressions, top queries, top pages, last 12 months
- Current review count, average rating, and reviews-per-month for the last 6 months
- Top 5 competitors in the map pack for the money keyword in the core city. Record their
  review count, velocity, category, page count, and referring domains.
- Current lead volume and where leads come from, in the client's own words

### Set up measurement before you change anything
- Unique tracked number for: website, GBP, print/vehicles
- Dynamic number insertion on the website so you can separate organic from GBP from paid
- GA4 events for: call click, form submit, quote request, chat start
- One shared spreadsheet or CRM view: lead date, source, city, service, quoted, won, value

If leads are not tracked to source, all SEO work becomes an argument. Track first.

---

## Phase 1. Google Business Profile (Week 1 to 2)

Highest leverage item on the list. For a service area business, the map pack is where the
lead actually happens, and AI answer boxes have made the map pack relatively more valuable
because they eat classic organic clicks, not map results.

### Category
- Primary category is the strongest single field on the profile. Be exact.
  "Roofing contractor", not "Contractor". "HVAC contractor", not "Air conditioning repair
  service" if the majority of revenue is install.
- Test it: search the money keyword in the target city, check what primary category the top 3
  are using (via a GBP checker extension). Match the winners.
- Secondary categories: only ones they genuinely do, 3 to 5 max. Junk categories dilute relevance.
- Revisit primary category if a new service line becomes the revenue driver.

### Business type and service area
- Storefront vs service area business (SAB). If customers do not visit, hide the address.
  A fake or shared address is the fastest way to a suspension.
- Service area: list real cities they serve. Do not paint the whole state. A sensible rule is
  the area they will actually drive to for a job, roughly a 1 to 2 hour radius maximum.
- Proximity to the searcher still drives a lot of map pack ordering, so a single profile will
  not rank city-wide. That gap is what location pages and, eventually, second locations solve.

### Name
- Exact real-world business name. Keyword stuffing the name works until a competitor reports it
  and the profile gets suspended, and reinstatements can take weeks with revenue at zero.
- If the legal name genuinely contains the keyword, that is fine and it is a real advantage.

### Services
- Add every service as a separate service item, not one blob. Each gets a 200 to 300 word
  description written for the homeowner, mentioning the service and the city naturally.
- Mirror these service items with real pages on the website. Consistency between the two is
  a relevance signal and a conversion aid.

### Products
- Underused. Products render as visual cards with an image, price, description and CTA.
  Use them for packages, financing, inspections, maintenance plans, seasonal offers.

### Description
- 750 characters. Front-load service plus primary city plus the differentiator.
  No fluff, no adjective piles. This field is weak for ranking but read by real people.

### Photos and video
- Geotagging photos is a myth. Volume, recency and realness are what matter.
- Upload weekly. Real job sites, real crew, real trucks, before and after, team faces.
  Stock photography reads as fake to homeowners in the trades.
- Ask the crew for 5 photos per job. Build it into the job-close SOP or it will not happen.
- Short vertical videos of a finished job perform well and almost nobody in the trades posts them.

### Posts
- Weekly, minimum. Offers, completed jobs, seasonal warnings (storm season, freeze season),
  new certifications. Each with a CTA button.
- Posts have limited direct ranking effect but they feed engagement signals and give the
  profile a live look to a homeowner comparing three options.

### Q and A
- Seed 8 to 12 real customer questions and answer them from the business account.
  Cost questions, warranty, insurance claims, timelines, licensing.
- Monitor for competitor or troll answers. Anyone can answer, and the top-voted one shows.

### Everything else
- Hours, holiday hours, opening date, attributes (licensed, veteran-owned, free estimates,
  emergency service, financing available). Attributes show as filters in Maps.
- Messaging on only if someone actually answers within minutes. A dead inbox is worse than none.
- Booking link if they use a scheduler.
- UTM-tag the website link on the profile so GA4 attributes GBP traffic correctly.
- Adjacent but paid: Local Services Ads and the Google Guaranteed badge. Not organic, but the
  badge lifts trust across the whole listing. Worth flagging to the client.

---

## Phase 2. Technical foundation (Week 2 to 4)

Not glamorous, but a slow or uncrawlable site caps everything downstream.

- Search Console: verify, submit XML sitemap, fix index coverage errors, check for a stray
  noindex or a robots.txt block left by the previous developer. Check this first, always.
- Core Web Vitals on mobile: LCP under 2.5s, INP under 200ms, CLS under 0.1. In trades sites the
  killer is almost always an uncompressed hero image and a bloated slider. Serve WebP or AVIF,
  preload the LCP image, lazy load everything below the fold, drop the carousel.
- Mobile first. Most of this traffic is a homeowner on a phone. Sticky tap-to-call bar,
  thumb-reachable CTA, form that is 4 fields not 11.
- HTTPS, one canonical hostname, correct canonicals, no duplicate content between city pages.
- Footer NAP exactly matching GBP, character for character.
- Structured data:
  - `LocalBusiness` with the most specific subtype available (`RoofingContractor`, `Plumber`,
    `HVACBusiness`, `Electrician`), plus `areaServed`, `geo`, `openingHours`, `telephone`
  - `Service` schema on each service page
  - `FAQPage` on pages with a real FAQ block
  - `BreadcrumbList`
  - `Organization` with `sameAs` pointing at the GBP, Facebook, Instagram, YouTube, LinkedIn
  - `AggregateRating` only if there are genuine on-site reviews. Faking it is a manual action risk.
- Internal linking: every service page links to its related city pages and back. Blog posts link
  up to the money page they support. Orphan pages do not rank.

---

## Phase 3. Content architecture (Week 3 onward, continuous)

This is where organic traffic actually comes from. Structure beats volume.

### Money pages
One page per service. Not a single "Services" page listing eight things. If they do roof
replacement, roof repair, storm damage, gutters and siding, that is five pages minimum.

### Location pages
One page per city or suburb worth having. This is how you rank outside the pin's proximity radius.

The failure mode is doorway pages: same text with the city swapped. Google devalues those and
they convert badly. Make each one genuinely local:
- Real jobs completed in that city, with photos and street-level detail
- A review from a customer in that city, quoted with their suburb
- Local specifics: common housing stock and age, local weather damage patterns, permit
  requirements, HOA rules, typical price band in that area
- Local landmarks and neighbourhoods listed naturally, not stuffed
- Embedded map, driving time from the depot, service radius statement

Rule of thumb: if you could swap the city name and the page would still make sense, it is not
ready to publish.

### Prioritisation
Do not build 200 pages in month one. Score each service-by-city combination on
search volume x population x job margin x current competition, then ship 1 to 3 pages a week.
Slow and real beats a bulk dump that gets ignored or filtered.

### The page template that ranks and converts
1. H1: service plus city, in plain language
2. Above the fold: phone number, short form, one-line value promise
3. Trust bar: licence number, insurance, years in business, review count and rating, manufacturer
   certifications, warranty length
4. The problem, in the homeowner's words. Symptoms they are actually googling.
5. What the service includes, plainly
6. Process, 3 to 5 steps, with timescales. Removes fear of the unknown.
7. Pricing transparency: a real range with what moves it up and down. Most competitors hide
   this. Publishing it wins both trust and a large volume of "cost" search traffic.
8. Gallery of local jobs, before and after
9. Reviews, filtered to that city or service where possible
10. FAQ, 8 to 12 real questions with direct answers
11. Financing or insurance-claim help if relevant
12. Final CTA with the same phone number and a second form

### Blog, bottom of funnel first
Ignore top-funnel traffic for the first six months. Write what a buyer types days before buying:
- "how much does [service] cost in [city]"
- "[option A] vs [option B]"
- "how long does [thing] last"
- "signs you need [service]"
- "does home insurance cover [damage]"
- "how to choose a [trade] in [city]"
- "[trade] licensing and permit requirements in [state or city]"

Cost content is the highest-value cluster in the trades. It ranks, it converts, and it is the
kind of page AI answers cite.

---

## Phase 4. Review engine (starts week 1, never stops)

Reviews are both a ranking factor and the single biggest conversion lever on the listing.

- Velocity beats total count. A steady 4 to 10 new reviews a month outperforms 40 reviews
  dumped in one week, and the dump looks manipulated.
- Target: match or exceed the current review count and monthly velocity of the three businesses
  in the map pack you are trying to displace. That is the real benchmark, not a round number.
- Ask process, built into the job-close SOP:
  1. Technician asks in person at completion, while the customer is happy
  2. Automated SMS within 60 minutes with the direct GBP review link (short link, one tap)
  3. One reminder after 3 days, then stop
- Prompt the content without scripting it: "if you can, mention which suburb you're in and what
  we did". Reviews naturally containing service and city language help relevance.
- Reply to every review within 24 hours. In the reply, name the service and the city naturally.
- Negative reviews: reply calm, factual, take it offline, never argue. A well-handled 3-star
  reply reassures buyers more than a wall of 5 stars.
- Photo reviews carry more weight and more persuasion. Ask for one.
- Never buy reviews, never gate them (asking only happy customers to review is against policy
  and gets rating filtered).
- Diversify: Facebook, Yelp, BBB, Angi, Nextdoor, Houzz for remodel, plus manufacturer
  contractor directories (GAF, Owens Corning, Trane, Carrier and similar).

---

## Phase 5. Citations and entity (Week 4 to 8, then quarterly audit)

- Core data aggregators plus 30 to 50 quality directories, NAP identical everywhere.
- Industry-specific beats generic: trade associations, manufacturer certified-contractor
  directories, local chamber of commerce, supplier "find a contractor" pages.
- Duplicate and stale listings are a real ranking problem. Audit for old addresses, old phone
  numbers, and duplicate GBP profiles. Clean these before building new ones.
- Entity building: same brand name and NAP on LinkedIn, YouTube, Facebook, Instagram,
  Apple Business Connect and Bing Places. Google builds a picture of the business from
  consistent mentions across the open web.

---

## Phase 6. Links (Month 2 onward, slow and local)

For local, a handful of genuinely local links beats a hundred generic ones.

- Chamber of commerce and local business associations
- Sponsorships: youth sports team, local charity, school event, community festival.
  Small money, real link, real goodwill, and photo content.
- Supplier and manufacturer partner pages
- Local news and local blogs, with a story angle: storm damage response, a free roof for a
  veteran, hiring apprentices, data on local claim volumes
- Cross-referral partners who will link: realtors, insurance agents, property managers,
  and complementary trades (a plumber links an electrician)
- Local subreddits, community Facebook groups and Nextdoor, participating honestly rather
  than dropping links
- A data or map asset: "we replaced 412 roofs after the June hail storm, here is the damage map
  by suburb" is the kind of thing local press picks up

Skip: paid guest post networks, generic blog comments, PBNs, and anything sold per-link in bulk.

---

## Phase 7. AI search and the wider surface (2026 reality)

AI Overviews and AI Mode have cut classic organic click-through on informational queries. Two
consequences.

1. The map pack matters more, because it is less displaced by AI answers. Everything in Phase 1
   gets more important, not less.
2. To be cited by AI answers and by ChatGPT-style assistants, you need:
   - Direct answers: a 40 to 60 word plain answer immediately under a question-shaped heading,
     then the detail below
   - Clean structured data and clear headings
   - Tables for pricing, comparisons and specifications
   - A strong, consistent entity across the web (Phase 5 feeds this directly)
   - Third-party mentions: assistants often pull names from "best [trade] in [city]" listicles
     and from review platforms. Getting on those lists is now a distribution channel.
3. YouTube: job walkthroughs, "here is what a bad install looks like", cost explainers. These
   rank in Google, embed on service pages, and feed the client's own trust.

Track it: once a month, ask ChatGPT, Gemini and Google AI Mode "best [trade] in [city]" and
record whether the client is named. It is a crude metric but clients understand it instantly.

---

## Phase 8. Reporting and expectations

### Set expectations on day one, in writing
- GBP optimisation shows movement in 2 to 6 weeks
- New service and location pages take 3 to 6 months to mature
- Links and reviews compound and never really finish
- A client who expects leads in week 3 will fire you in month 2. Say the timeline out loud
  before you take the money.

### Monthly report, one page
- Geogrid before vs now for the money keywords
- Number of keywords in the top 3 of the map pack
- GBP: calls, direction requests, website clicks, trend
- Search Console: clicks, impressions, new ranking pages
- Reviews added, current average
- Leads by source, and if the client shares it, quotes and jobs won
- What shipped this month, what ships next month

Only one number really matters to the client: booked jobs. Report on rankings, but always
close with revenue.

---

## The 80/20

If you can only do four things:
1. Fully optimise and actively maintain the Google Business Profile
2. Build a review-generation system into their job-close process
3. Ship real service pages and real city pages, slowly and properly
4. Earn a handful of genuinely local links

## Common ways agencies lose this account
- Keyword stuffing the GBP name, then a suspension takes the client offline
- Thin, templated city pages that never rank and make the site look spammy
- Reporting Domain Authority and traffic instead of leads and jobs
- Blogging top-of-funnel topics for six months while money pages sit unbuilt
- No call tracking, so the client credits every lead to word of mouth
- Inconsistent NAP after the client changes their phone number and nobody updates 40 listings
- Bought reviews, followed by a rating wipe

## What this sells as
A build fee for the website (the factory output), then a monthly retainer covering:
GBP management and posting, review generation, 2 to 4 new pages a month, technical
maintenance, link and citation work, and one reporting call. Deliverables are visible every
month, which is what makes the retainer stick.
