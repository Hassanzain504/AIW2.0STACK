# 07 - Money Math: HVAC

Niche: hvac
Module: 2B, Sub-task 7
Sources: raw/business-homepages.json, raw/serp-rankings.json (PAA data)

---

## Average Ticket (what homeowners pay)

**AC repair:**
- Average service call + repair: $250-$600 for minor repairs
- Refrigerant recharge: $150-$400 depending on type
- Compressor replacement: $1,200-$2,800
- Average repair across all types: ~$400-$600 [inferred from PAA data: "How much is the average HVAC service call?"]

**Furnace repair:**
- Similar range to AC repair; $200-$800 for most repairs
- Heat exchanger replacement: $1,500-$3,000 (often triggers replacement decision)

**Full HVAC system replacement (AC + furnace):**
- National range: $5,000-$12,500 for standard split system
- High-efficiency or premium systems: $10,000-$20,000+
- Labor alone: $1,000-$3,000 depending on complexity
- [inferred from SERP PAA: "What's the average cost to replace an HVAC unit?"]

**Furnace only:**
- $2,500-$7,500 installed depending on size and efficiency

**AC unit only:**
- $3,000-$7,000 installed for central air

**Maintenance plans:**
- Typical range: $150-$400/year (one visit) or $250-$600/year (two visits, heating + cooling)
- Per-month framing: $15-$50/month

---

## Revenue Model for the HVAC Contractor Client

**What a small HVAC contractor looks like:**
- 2-5 technicians
- 5-15 service calls per technician per week in season
- 3-8 system replacements per month
- Revenue range: $500K-$2M annually for a 5-8 person operation [inferred]

**Revenue mix:**
- Service/repair: ~40% of revenue, ~70% of job count (high volume, lower ticket)
- Replacement installs: ~50% of revenue, ~20% of job count (lower volume, high ticket)
- Maintenance plans: ~10% of revenue, high lifetime value and predictability

**Seasonal concentration risk:**
- AC season (May-August): ~50% of annual AC revenue
- Heating season (November-February): ~50% of annual heating revenue
- Shoulder months: maintenance, tune-ups, proactive replacements — lowest urgency but most margin-friendly

---

## Lead Economics

**What a replacement lead is worth:**
- Average replacement ticket: $7,000-$10,000
- [inferred] Gross margin: 35-45% on installed system
- Gross profit per replacement: $2,500-$4,500
- Close rate from website lead: [inferred] 30-40% (higher than roofing because the homeowner calling from a HVAC site is often in breakdown mode)

**Service call as a lead-in:**
A $150-$300 service call that becomes a replacement recommendation is a common HVAC conversion path. A website that captures the service call converts 20-30% of those into replacement jobs.

**Maintenance plan lifetime value:**
- Average maintenance customer: 5-10 years before replacement
- Annual plan: $300/year
- Lifetime value per maintenance customer: $1,500-$3,000 in plan fees plus one replacement job at $7,000+ = $8,500-$10,000 LTV

---

## Selling the Website to the Contractor

**What the contractor cares about:**
- Filling the schedule in shoulder months
- Not competing with Angi and Thumbtack for shared leads
- Replacement jobs (high margin) vs service calls (lower margin, higher volume)
- Retaining customers long-term via maintenance plans

**The student's pitch framing:**
Angi and Thumbtack sell HVAC leads for $40-$100 each and share them with 3-5 competitors. A website that generates 20 exclusive replacement leads per month at a 35% close rate is 7 additional replacements at $7,000 each = $49,000/month in additional revenue. The website pays for itself in the first week of its first replacement season.

---

## The One Pitch Sentence

"An HVAC contractor who closes one extra system replacement per month from their own website recovers the entire site investment in the first job — and builds a customer for 10 years of maintenance plans on top of that."

---

## Source Traceback
- raw/serp-rankings.json: PAA data: "How much is the average HVAC service call?", "What's the average cost to replace an HVAC unit?", "How much does it typically cost to install a furnace?"
- raw/business-homepages.json: onehourheatandair.com (service categories and plan pricing structure), reliableair.com, lennox.com, carrier.com
- Ticket ranges, margin percentages, and close rates marked [inferred]; verify with contractor clients in onboarding
