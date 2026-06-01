# 06 - SEO Landscape: Roofing Contractors

Niche: roofing-contractors
Module: 2B, Sub-task 6
Sources: raw/serp-rankings.json, raw/business-homepages.json

---

## Who Owns the SERPs

For "roof replacement near me" and "best roofer near me," the top organic positions are dominated by:
- **bbb.org/near-me/roofing-contractors** — ranks for both navigational and transactional queries
- **angi.com/nearme/roof-repair** and **angi.com/nearme/roofing** — Angi has multiple roofing SERPs
- **thumbtack.com/k/roofing/near-me** and **thumbtack.com/k/roof-repair/near-me** — category pages
- **yelp.com/nearme/roofers** — review aggregator
- **gaf.com/en-us/roofing-contractors/residential** — manufacturer contractor finder
- **homeguide.com/roofing** — comparison aggregator

Individual contractor sites almost never rank for bare "near me" queries. They rank for:
- **City + service** queries: "roof replacement Dallas," "Phoenix roofing contractor," "Chicago emergency roof repair"
- **Cost/research** queries: "roofing contractor cost," "how much does a roof replacement cost"
- **Long-tail local** queries: neighborhood or suburb + service

---

## Primary Keyword Cluster

| Keyword | Intent | Difficulty | Notes |
|---|---|---|---|
| roof replacement [city] | Transactional | Medium-High | Primary target; city-specific pages |
| roofing contractor [city] | Transactional | Medium | Homepage target |
| emergency roof repair [city] | Urgent transactional | Lower | Dedicated service page |
| storm damage roof repair [city] | Urgent transactional | Lower | Dedicated service page |
| roof leak repair [city] | Transactional | Medium | High-volume; repair intent |
| best roofer near me | Navigational | High | Aggregators dominate; GBP is the play |
| roof replacement near me | Navigational | High | Aggregators dominate; GBP is the play |

---

## Secondary Keyword Clusters

**Cost and research intent (informational):**
- roofing contractor cost
- how much does a roof replacement cost [city/state]
- average cost to replace a roof
- roof repair cost vs replacement

These queries rank for roofingcalculator.com, nerdwallet.com, cobexcg.com, and local contractor blog posts. A contractor who publishes a genuine local cost guide has a path to ranking here.

**Insurance and storm:**
- storm damage roof repair [city]
- does insurance cover roof replacement
- how to file a roof insurance claim
- hail damage roof repair [city]

Lower competition. High commercial intent in storm-season markets.

**Material-specific:**
- asphalt shingle roof replacement cost
- metal roof installation [city]
- flat roof repair [city]

Useful for service pages on specific roof types.

---

## People Also Ask (from raw/serp-rankings.json)

Questions that appear repeatedly across roofing queries — high-value FAQ content:

1. "Is $30,000 too much for a roof?" — price anchor question; opportunity to explain regional variance
2. "What is the 25% rule for roofing?" — appears in 3 of 5 SERP pages; explains when insurance mandates full replacement
3. "How much does 2,000 sq ft of shingles cost?" — specific calculator query
4. "Is there a difference between a roofer and a roofing contractor?" — trust/credentialing question
5. "What time of year is the cheapest to replace a roof?" — seasonal planning question
6. "How can I get my roof fixed if I have no money?" — financing question; opportunity to address payment options

---

## Title and H1 Patterns (from top-ranking pages)

**Effective title patterns:**
- "[City] Roof Replacement — Licensed Roofers — Free Inspection"
- "Roof Replacement Cost in [City] | Get a Free Estimate"
- "Emergency Roof Repair in [City] | 24/7 — [Company Name]"
- "Best Roofing Contractors in [City] | [X]+ Reviews — [Company Name]"

**H1 patterns:**
- "Roof Replacement in [City] — Done Right the First Time"
- "Licensed [City] Roofers — Free Inspection, Honest Estimates"
- "Storm Damage Roof Repair in [City] — We Work With Your Insurance"

---

## Schema Markup Recommendations

1. **LocalBusiness schema** — NAP (name, address, phone), business hours, service area, rating. Required.
2. **Service schema** — One per service page (Roof Replacement, Roof Repair, Storm Damage, Emergency). Enables rich snippets.
3. **FAQPage schema** — On the FAQ section; enables expanded SERP display for PAA-matching content.
4. **Review/AggregateRating schema** — Displays star rating in organic results; increases CTR.
5. **BreadcrumbList schema** — For multi-page sites with service sub-pages.

---

## Content Gaps (what top-ranking pages are missing)

1. **Genuine local cost guides.** roofingcalculator.com dominates cost queries with national averages. A contractor who publishes "Average Roof Replacement Cost in [City] — 2026, Based on Our Last 100 Jobs" has a strong angle.

2. **Insurance claim walkthrough content.** No top-ranking contractor page provides a step-by-step homeowner guide to the insurance claim process. This is a high-value, low-competition content opportunity given the frequency of insurance mentions in reviews.

3. **Neighborhood or suburb pages.** Most contractor sites have a single city page. Hyper-local suburb pages (e.g., "Roofing Contractor in Scottsdale, AZ" vs "Roofing Contractor in Phoenix, AZ") target lower-competition searches with higher local relevance.

4. **Before/after project pages with schema.** Individual project pages with address (anonymized), photos, materials used, and timeline give local content signals and long-tail visibility.

---

## GBP (Google Business Profile) Priority

For "near me" queries, GBP is the primary ranking surface, not the website. The factory website should:
- Include GBP verification instructions in the client handoff
- Provide a checklist for GBP optimization (categories, services, photo uploads, Q&A)
- Note that GBP reviews drive the local pack more than website content

---

## Source Traceback
- raw/serp-rankings.json: 5 SERP result sets for queries: "roofing contractor cost," "roof replacement near me," "best roofer near me," "roof installation company," "emergency roof repair"
- raw/business-homepages.json: Page content from roofingcalculator.com (multiple pages), cobexcg.com, bondocroofing.com, nerdwallet.com, exteriorsbypremier.com, martiniroofing.com, bbb.org/near-me/roofing-contractors
