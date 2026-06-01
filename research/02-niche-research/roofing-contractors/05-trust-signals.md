# 05 - Trust Signals: Roofing Contractors

Niche: roofing-contractors
Module: 2B, Sub-task 5
Sources: Cross-referenced from Sub-tasks 1-4; raw/maps-reviews.json, raw/agencies-crawl.json

---

## Top 5 Trust Signals (priority order)

### 1. Google Review Count and Star Rating

**Why it ranks first:**
The SERP for "best roofer near me" and "roofing contractor near me" is dominated by BBB, Thumbtack, Angi, and Yelp — all aggregators whose primary value to homeowners is verified review volume. A contractor site that displays its Google review count and star rating is borrowing authority from the same mental model homeowners already use on those aggregators.

**Frequency:** "Recommend" appears 273 times in 663 reviews. The act of leaving a review is the end-state of the trust journey.
**Intensity:** High. Negative reviews about lack of follow-through, damage, or deception are the highest-intensity entries in the corpus.
**Addressability:** High. Review count and rating can be displayed in the hero, with a link to the Google profile for independent verification.

**Implementation:** Display as "4.9 stars — 347 Google Reviews" with a Google logo and a live link. Update dynamically if possible.

---

### 2. Manufacturer Certification (GAF, Owens Corning, CertainTeed)

**Why it ranks second:**
Roofing manufacturer certifications (GAF Master Elite, Owens Corning Preferred Contractor, CertainTeed SELECT ShingleMaster) are the roofing-specific credential that homeowners recognize from manufacturer brand advertising. These certifications also extend warranty coverage to homeowners — a concrete, addressable benefit.

**Frequency:** [inferred] Certifications mentioned in agency copy across roofingwebmasters.com and kingcontractor.com portfolios.
**Intensity:** Medium. Homeowners who have done research specifically look for these badges.
**Addressability:** High. Contractor needs the certification; the website only needs to display it prominently with a short explanation of what it means for the homeowner ("Your warranty is backed by the manufacturer, not just us").

---

### 3. License Number and Insurance Statement

**Why it ranks third:**
"Fully licensed, bonded, and insured" is a baseline expectation. Its absence is a red flag. Displaying the actual state license number — rather than just claiming to be licensed — is a differentiator because it is verifiable.

**Frequency:** Implied in review language about professionalism and "trusted" contractors. The fear of hiring an unlicensed contractor is present in negative reviews about shoddy workmanship.
**Intensity:** High when absent (homeowners who discover post-job that a contractor was unlicensed are the most publicly vocal critics).
**Addressability:** High. License number in footer. Optional: link to state licensing board verification page to make verification frictionless.

---

### 4. Before/After Photo Gallery

**Why it ranks fourth:**
Roofing is a visual trade. The homeowner cannot see the work being done (it is on the roof) and cannot easily evaluate quality before it starts. Real job photos — specific to the type of roof, visible materials, and actual crew — serve as proof of capability and quality that generic text cannot replicate.

**Frequency:** "Crew" 152 times in reviews. Homeowners notice and describe the physical crew on their property. Photos of real crews doing real work extend this credibility into the pre-purchase phase.
**Intensity:** Medium. Positive reviews frequently mention specific crew members by name; photos humanize this.
**Addressability:** High. Requires only that the contractor photographs jobs. The factory template should include a gallery with 12+ slots and encourage photo upload during onboarding.

---

### 5. Insurance Claim Assistance Language

**Why it ranks fifth:**
98 mentions of "insurance" in 663 reviews. Insurance navigation is not a side service; it is a primary decision driver in storm-damage markets (which includes Dallas, Chicago, Phoenix, and most other major US markets). A website that explicitly offers to handle the claim process — and explains what that means step by step — converts at a higher rate than one that mentions it only in passing.

**Frequency:** 98 direct mentions. High for a single topic in a general review corpus.
**Intensity:** High. The one-star review from the woman navigating the process alone is the highest-intensity negative entry in the corpus.
**Addressability:** High. A dedicated "Insurance Claims" section or service page, with a 3-step explanation and a specific CTA ("We'll meet your adjuster — call us first"), directly addresses this fear.

---

## Niche-Specific Certifications and Badges

| Credential | Issuer | What it means for the homeowner |
|---|---|---|
| GAF Master Elite | GAF (roofing manufacturer) | Extends factory warranty to 50 years; contractor is in top 3% of GAF contractors |
| Owens Corning Preferred Contractor | Owens Corning | Access to enhanced warranty; contractor met training and insurance requirements |
| CertainTeed SELECT ShingleMaster | CertainTeed | SureStart PLUS warranty available; contractor passed quality audit |
| BBB Accreditation | Better Business Bureau | Complaint history is public; BBB ranks for roofing searches |
| NRCA Member | National Roofing Contractors Association | Trade membership; signals established business, not a storm-chaser |
| HAAG Certified Inspector | HAAG Engineering | Hail damage assessment certification; valuable in storm markets |

---

## What Competitors Miss

1. **Displaying the license number, not just claiming to be licensed.** Most contractor sites say "fully licensed and insured" without providing the number. Providing it is a verifiable signal that competitors typically skip.

2. **Explaining what certifications mean for the homeowner.** Most sites display the GAF badge without explaining that it extends the homeowner's warranty. The explanation is the conversion element; the badge alone is decorative.

3. **Putting social proof in the hero, not the footer.** Review counts typically appear below the fold or in the footer. Moving the Google rating to the hero zone immediately below the headline is a CRO improvement most competitor sites have not made.

---

## Source Traceback
- raw/maps-reviews.json: Frequency and intensity scores derived from 663 review texts
- raw/agencies-crawl.json: Competitor trust signal placement observed across hookagency.com, kingcontractor.com, roofingwebmasters.com
- Certification details cross-referenced with manufacturer program public documentation [inferred from industry knowledge; verify with client's actual certifications]
