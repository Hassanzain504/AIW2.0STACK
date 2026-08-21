# Client Audit Worksheet (Website + Google Business Profile)

Use this every time you take over a client's website and GBP. Work top to bottom. Do not skip
Section 0, and do not change anything until Section 0 is complete.

Legend: `[ ]` not checked, `[P]` pass, `[F]` fail, `[N]` not applicable.
Every fail gets a severity (Critical / High / Medium / Low), an effort estimate, and an owner.

Client: ______________________  Site: ______________________  Date: ____________

---

## Section 0. Access and baseline (do this first, always)

### 0.1 Access obtained
- [ ] Google Business Profile, primary owner or manager (not "they post for us")
- [ ] Google Search Console, verified by DNS TXT so it survives a host change
- [ ] Google Analytics 4, admin
- [ ] Domain registrar login
- [ ] DNS management
- [ ] Hosting control panel
- [ ] CMS admin (WordPress, Webflow, Shopify, whatever it is)
- [ ] Every review platform login they already hold
- [ ] Social accounts (Facebook, Instagram, LinkedIn, YouTube)
- [ ] Bing Webmaster Tools
- [ ] Previous agency access identified and revoked
- [ ] Email or CRM where leads land, so you can confirm delivery

### 0.2 Baseline captured (screenshot and date everything)
- [ ] Geogrid scan for 5 to 10 money keywords (Local Falcon or BrightLocal)
- [ ] GBP performance: calls, direction requests, website clicks, last 6 months
- [ ] Search Console: clicks, impressions, top queries, top pages, last 12 months
- [ ] Current indexed page count
- [ ] Review count, average rating, and reviews per month for the last 6 months
- [ ] Core Web Vitals (mobile) from PageSpeed Insights, all key page types
- [ ] Top 5 map pack competitors recorded: review count, velocity, primary category,
      page count, referring domains
- [ ] Current lead volume and sources, in the client's own words

### 0.3 Measurement installed before any changes
- [ ] Call tracking with dynamic number insertion
- [ ] Separate tracked numbers for website, GBP, print and vehicles
- [ ] GA4 events: call click, form submit, quote request, chat start
- [ ] Form submissions tested end to end with a live submission
- [ ] Lead log started: date, source, city, service, quoted, won, value

### 0.4 Business facts confirmed with the client
- [ ] Legal business name, exactly as registered
- [ ] Real service area, and the honest maximum drive time
- [ ] Full service list, with margin on each
- [ ] Which services they actually want more of
- [ ] Licence and insurance numbers
- [ ] Certifications and memberships held, and which are verifiable
- [ ] Emergency or after-hours capability, honestly
- [ ] Average job value and close rate
- [ ] Who answers the phone, and how fast

---

## Section 1. Google Business Profile

### 1.1 Foundation
- [ ] Profile claimed and verified
- [ ] Verification method noted (video, postcard, email) and not at risk of re-verification
- [ ] No open suspensions, no pending edits, no "suspended" or "disabled" state
- [ ] Duplicate listings searched for and removed or merged
- [ ] Business name is the exact real name, no keyword stuffing
- [ ] Storefront vs service area business set correctly
- [ ] Address hidden if no customers visit
- [ ] Service area is realistic, not the whole state
- [ ] Opening date set

### 1.2 Categories
- [ ] Primary category is the most specific accurate option
- [ ] Primary category checked against the current top 3 in the map pack
- [ ] Secondary categories are real, 3 to 5 maximum
- [ ] No junk categories diluting relevance

### 1.3 Content
- [ ] Every service added as a separate service item
- [ ] Each service has a 200 to 300 word description
- [ ] Service items mirror the website's service pages
- [ ] Products section used (packages, plans, inspections, financing)
- [ ] Description written, 750 characters, service and city front-loaded
- [ ] Attributes set (licensed, insured, veteran-owned, free estimates, emergency service,
      financing, women-owned, language spoken)
- [ ] Hours correct, including holiday hours
- [ ] Hours match what the offer promises (do not sell emergency with 9 to 5 hours)
- [ ] Messaging enabled only if someone answers within minutes
- [ ] Booking link connected if they use a scheduler
- [ ] Website link UTM-tagged so GA4 separates GBP traffic

### 1.4 Media
- [ ] Logo and cover photo set, correct dimensions
- [ ] Minimum 20 real photos uploaded
- [ ] Zero stock photography
- [ ] Job site, crew, vehicles, equipment, before and after all represented
- [ ] Weekly photo upload cadence agreed and assigned to a person
- [ ] Short vertical video posted
- [ ] Photo capture built into the job close-out SOP

### 1.5 Engagement
- [ ] Weekly Posts scheduled with CTA buttons
- [ ] 8 to 12 Q&A seeded and answered from the business account
- [ ] Q&A monitored for competitor or troll answers
- [ ] Owner responses on every review, within 24 hours

### 1.6 Reviews
- [ ] Current count and rating recorded
- [ ] Monthly velocity recorded for the last 6 months
- [ ] Benchmarked against the 3 businesses currently in the map pack
- [ ] Direct review link created and shortened
- [ ] Ask process built into job close-out: in person, then SMS within 60 minutes,
      then one reminder at day 3
- [ ] Review requests are not gated (asking only happy customers is a policy violation)
- [ ] No purchased or incentivised reviews, past or present
- [ ] Negative review response template written
- [ ] Secondary platforms active: Facebook, Yelp, BBB, industry-specific directories

---

## Section 2. Website technical

### 2.1 Indexation
- [ ] Search Console verified and sitemap submitted
- [ ] robots.txt checked for accidental blocks
- [ ] No stray `noindex` left by a previous developer (check this first, it is common)
- [ ] Index coverage errors reviewed and fixed
- [ ] Indexed page count matches expected page count
- [ ] No manual actions
- [ ] Staging or dev site not indexed

### 2.2 Speed and Core Web Vitals (test on mobile, not desktop)
- [ ] LCP under 2.5s
- [ ] INP under 200ms
- [ ] CLS under 0.1
- [ ] Total page weight under 1.5 MB
- [ ] No single image over 200 KB
- [ ] Photographs served as WebP or AVIF, never PNG
- [ ] Images sized to actual display dimensions
- [ ] Hero LCP image preloaded, everything below the fold lazy loaded
- [ ] Caching enabled and confirmed hitting
- [ ] Carousels and sliders removed or justified
- [ ] Unused plugins, fonts and scripts removed
- [ ] TTFB under 0.6s (if slow, it is hosting, not images)

### 2.3 Mobile and UX
- [ ] Viewport meta tag present
- [ ] Sticky tap-to-call bar on mobile
- [ ] `tel:` link on every phone number
- [ ] Phone number visible above the fold without scrolling
- [ ] Form has 5 fields or fewer above the fold
- [ ] Tap targets large enough, no horizontal scroll
- [ ] Real page tested on a real phone, not just an emulator

### 2.4 Site hygiene
- [ ] HTTPS on every page, no mixed content
- [ ] One canonical hostname (www or non-www, http redirects to https)
- [ ] Canonical tags correct, no cross-page duplication
- [ ] No broken internal links, no 404s in the nav
- [ ] Redirects are 301, not 302, and not chained
- [ ] Custom 404 page with navigation
- [ ] Breadcrumbs present

### 2.5 Structured data
- [ ] `LocalBusiness` with the most specific subtype available
- [ ] `telephone`, `address`, `geo`, `openingHoursSpecification` all populated
- [ ] `areaServed` listing every city and county served
- [ ] `Service` schema on each service page
- [ ] `FAQPage` on pages with a real FAQ
- [ ] `BreadcrumbList`
- [ ] `Organization` with `sameAs` to GBP and every social profile
- [ ] `AggregateRating` only if genuine on-site reviews exist
- [ ] Validated in Google's Rich Results Test with zero errors

---

## Section 3. On-page

### 3.1 Per page
- [ ] Exactly one H1 per page (Elementor and Divi default headings to H2, check every page)
- [ ] H1 states the service and, where relevant, the location
- [ ] H1 is not just a tagline
- [ ] Heading hierarchy is logical, no skipped levels
- [ ] Title tag unique per page, no cannibalisation between home and services
- [ ] Title tag under 60 characters, service and location front-loaded
- [ ] Meta description unique, under 155 characters, contains a reason to click
- [ ] Meta description matches what the page actually offers
- [ ] URL slug short, readable, keyword-relevant, no dates or IDs
- [ ] Every image has descriptive alt text (empty `alt=""` on content images is a fail)
- [ ] Image filenames descriptive, not `IMG_4471.png`
- [ ] Internal links to related services and locations
- [ ] No orphan pages

### 3.2 Positioning consistency (a surprisingly common failure)
- [ ] Titles, meta descriptions, H1s and body copy all describe the same business
- [ ] Residential vs commercial positioning is consistent everywhere
- [ ] Service list on the site matches the service list on the GBP
- [ ] Service area on the site matches the service area on the GBP
- [ ] Claims on the site are ones the business can actually deliver

### 3.3 Trust and legal
- [ ] Licence number displayed
- [ ] Insurance and bonding stated
- [ ] Certifications shown are genuine and verifiable
- [ ] **No government agency logos used as trust badges** (CDC, EPA, OSHA, FDA and similar
      restrict logo use and imply endorsement that does not exist). Replace with text claims.
- [ ] No manufacturer or association logos used without an actual membership
- [ ] Privacy policy and terms present
- [ ] Guarantee or warranty stated clearly
- [ ] Real photos of real work, zero stock photography
- [ ] Team page with real faces and names

---

## Section 4. Content architecture

- [ ] One dedicated page per service (not one shared services page)
- [ ] One page per city or suburb worth targeting
- [ ] City pages pass the swap test: swap the city name and the page stops making sense
- [ ] Each city page has a real local job, a real local photo, a real local detail
- [ ] Service-by-location matrix built and prioritised by
      search volume x population x job margin x competition
- [ ] Publishing cadence set at 2 to 3 real pages a week, never a bulk dump
- [ ] Pricing transparency section on money pages (a real range with what moves it)
- [ ] FAQ block of 8 to 12 real questions on money pages
- [ ] Highest margin services have the deepest pages, not the shallowest
- [ ] Blog plan starts bottom of funnel: cost, versus, how long, signs you need, insurance
- [ ] Direct 40 to 60 word answers under question-shaped headings (for AI answer engines)
- [ ] Pricing and comparison tables, which AI answers cite readily

---

## Section 5. Off-site

### 5.1 Citations and NAP
- [ ] NAP identical across website, GBP, and every directory, character for character
- [ ] Core aggregators submitted
- [ ] 30 to 50 quality directories built
- [ ] Industry-specific directories prioritised over generic ones
- [ ] Manufacturer or association contractor directories claimed
- [ ] Chamber of commerce listing claimed and linked
- [ ] Duplicate and stale listings found and removed (old address, old phone)
- [ ] Bing Places, Apple Business Connect and Yelp claimed
- [ ] Duplicate social profiles merged (check Facebook specifically, it happens constantly)

### 5.2 Links
- [ ] Current referring domains recorded, and compared to the top 3 competitors
- [ ] Toxic or spam links from a previous agency identified
- [ ] Local sponsorship opportunities listed (sports teams, charities, school events)
- [ ] Supplier and manufacturer partner page links pursued
- [ ] Cross-referral partners identified and asked (complementary trades, realtors,
      insurance agents, property managers)
- [ ] One local data or story angle planned for press
- [ ] No paid guest post networks, no PBNs, no bulk link packages

### 5.3 Entity and AI search
- [ ] Consistent brand name and NAP on LinkedIn, YouTube, Facebook, Instagram
- [ ] `sameAs` schema points at every real profile
- [ ] Presence on "best [service] in [city]" third-party lists pursued
- [ ] Monthly check: ask ChatGPT, Gemini and Google AI Mode "best [service] in [city]"
      and record whether the client is named

---

## Section 6. Conversion

- [ ] Phone number visible above the fold on every page
- [ ] Consistent CTA on every page
- [ ] Form fields qualify the lead (service, facility type, size, frequency, timeline, budget)
- [ ] Form submissions confirmed arriving, not in spam
- [ ] Auto-response to form submissions set up
- [ ] Speed to lead measured (how long until someone actually calls back)
- [ ] Thank you page with a GA4 conversion event
- [ ] Reviews and testimonials visible on money pages
- [ ] Trust bar near the top: licence, insurance, years, review count, certifications
- [ ] Process section explaining what happens after they call
- [ ] Financing or payment options shown if relevant

---

## Section 7. Output of the audit

- [ ] Every fail logged with severity, effort and expected impact
- [ ] Findings sorted into: fix this week, fix this month, fix this quarter
- [ ] Quick wins identified (low effort, high impact) and done first
- [ ] Anything requiring client action flagged separately (reviews, photos, decisions)
- [ ] Written expectations delivered: GBP moves in 2 to 6 weeks, pages take 3 to 6 months
- [ ] Baseline screenshots filed for the month 3 comparison
- [ ] Monthly reporting template set up

---

## Quick reference: the ten failures that show up on almost every takeover

1. Photographs saved as PNG, page weight over 5 MB
2. Missing H1 on most pages (page-builder default)
3. Homepage and services page fighting over the same title tag
4. No LocalBusiness schema, or schema with no phone and no address
5. Meta descriptions describing a business the client no longer runs
6. Empty `alt=""` on every content image
7. One shared services page instead of a page per service
8. No city pages, so ranking is capped at the pin's radius
9. Duplicate Facebook, Yelp or GBP listings splitting the entity
10. No call tracking, so nobody can prove any of it worked
