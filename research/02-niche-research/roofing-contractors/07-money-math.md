# 07 - Money Math: Roofing Contractors

Niche: roofing-contractors
Module: 2B, Sub-task 7
Sources: raw/business-homepages.json (cost data), raw/serp-rankings.json (SERP snippets), raw/maps-reviews.json (job types)

---

## Average Ticket (what homeowners pay)

**Roof replacement (asphalt shingle, residential):**
- National average: $9,500-$12,000 (Angi / NerdWallet data, confirmed in raw/business-homepages.json)
- Per-sqft range: $3.50-$6.00 for asphalt; $6.30-$12.30 including labor (roofingcalculator.com)
- Typical 1,700 sqft home: $6,000-$9,000 (roofingcalculator.com)
- Michigan average: $12,000 (exteriorsbypremier.com/mi)
- Pennsylvania range: $7,000-$15,000 (martiniroofing.com)
- California: higher due to labor costs; $15,000+ common

**For the factory pricing section, use:** $9,500 as a conservative national anchor; market-specific pages should adjust.

**Roof repair (single leak, limited damage):**
- Average repair: $1,150 (from conversation summary cross-referenced with SERP snippet data)
- Range: $400-$1,900 depending on scope
- Emergency repair premium: typically 20-30% above standard pricing [inferred]

**Storm damage / insurance-covered replacement:**
- Full replacement at insurance cost (homeowner pays deductible only): $0-$2,500 out of pocket
- Deductible range: typically $500-$2,500 for homeowner policies

**Premium materials:**
- Metal roof: ~$41,000 average (roofingcalculator.com/news/best-metal-roof-options)
- Clay tile: $16,901-$20,055 average (roofingcalculator.com/news/clay-tile-roofing-pros-cons-cost)
- Slate: $20,000+ [inferred from premium material pricing]

---

## Revenue Model for the Roofing Contractor Client

**What a small roofing contractor looks like:**
- 2-3 crews
- 2-5 replacements per week in peak season (spring-fall)
- 10-15 repair jobs per month year-round
- Revenue range: $800K-$2.5M annually for a 5-10 person operation [inferred from industry benchmarks]

**Job value distribution:**
- Replacements: ~80% of revenue, ~40% of job count
- Repairs: ~20% of revenue, ~60% of job count (but repairs become replacements)
- Storm work: variable; can double revenue in a good hail/wind year

---

## Lead Economics

**What a replacement lead is worth:**
- Average replacement: $10,000
- [inferred] Gross margin: 35-45% on replacement after labor and materials
- Gross profit per replacement: ~$3,500-$4,500
- Close rate from website lead (homeowner fills out form): [inferred] 25-35%

**What that means per lead:**
- 100 website leads → 25-35 closed replacements
- 30 replacements × $10,000 = $300,000 revenue
- 30 replacements × $4,000 gross profit = $120,000 gross profit from 100 leads

**Lead cost context:**
- Angi / HomeAdvisor leads: $50-$150 per roofing lead (shared leads, low exclusivity)
- Google LSA leads: $30-$80 per lead (exclusive, pay-per-lead)
- Organic website leads: $0 marginal cost after SEO investment

**A good roofing website + SEO investment** that generates 50 additional exclusive leads per month at a 30% close rate yields 15 additional jobs/month = $150,000/month additional revenue. This is the contractor's perspective on why a quality website matters.

---

## Selling the Website to the Contractor

**What the contractor cares about:**
- Cost per lead
- Close rate
- Revenue per job
- Whether they have to share leads (aggregators) or own them (own website)

**The student's pitch framing:**
Aggregators (Angi, Thumbtack, HomeAdvisor) charge $50-$150 per shared lead. A website that ranks organically generates exclusive leads at zero marginal cost. The break-even on a $3,000-$5,000 website build is one or two extra jobs.

---

## The One Pitch Sentence

"A roofing contractor closing two extra replacement jobs per month from their own website covers the site cost in the first week — and every job after that is pure margin."

---

## Source Traceback
- raw/business-homepages.json: Cost data from roofingcalculator.com (national averages, material-specific pages), cobexcg.com (average roof replacement cost 2026), nerdwallet.com (total cost range $5,800-$46,000), exteriorsbypremier.com/mi ($12,000 Michigan average), martiniroofing.com ($7,000-$15,000 PA range)
- raw/serp-rankings.json: Cost snippets from "roofing contractor cost" SERP
- Margin percentages, lead volumes, and close rates marked [inferred]; verify with contractor clients in onboarding
