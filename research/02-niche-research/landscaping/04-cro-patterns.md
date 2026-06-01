# 04 - CRO Patterns: Landscaping

Niche: landscaping
Module: 2B, Sub-task 4
Sources: raw/agencies-crawl.json, raw/business-homepages.json; cross-referenced with customer voice from Sub-task 2

---

## Recommended Section Order (top to bottom)

1. **Sticky header** — phone number (tap-to-call), "Get Free Consultation" button, logo.
2. **Hero section** — headline targeting the primary visitor persona (design vs maintenance vs transformation), city named, CTA above fold, hero image should be a real before/after or in-progress project photo.
3. **Social proof bar** — Google rating + count, number of completed projects, any industry badges.
4. **Before/After Gallery preview** — 4-6 images with project type labels (Backyard Transformation, Synthetic Grass, Patio + Fire Pit, Lawn Care). Links to full gallery. This is the highest-converting section in landscaping.
5. **Services split** — Two clear tracks: "Landscape Design and Installation" and "Ongoing Lawn Care." Homeowners self-select their journey.
6. **Process section** — "How It Works": Consultation → Design Proposal → Build → Warranty. Specific to design projects; shows the homeowner what will happen to their deposit.
7. **Trust stack** — Years in business, projects completed, license and insurance, specific guarantees.
8. **Named team section** — Project manager photos, names, tenure. At least the lead designer/PM. Reduces property-access anxiety.
9. **Full project gallery** — Filterable by type (patios, synthetic grass, planting, lawn care). High-volume photo content.
10. **Review section** — 6+ full-text reviews, preferably with homeowner name, city, and project type.
11. **Service areas** — Named neighborhoods and cities.
12. **Maintenance plans section** — If offered; plan tiers, what is included, seasonal schedule.
13. **FAQ** — Addresses: deposit protection, timeline, what happens if I am not satisfied, crew on my property, pet safety.
14. **Final CTA** — Repeat primary CTA with a low-friction framing: "No obligation — just a conversation about your yard."
15. **Footer** — License, address, service areas, phone, social (Instagram especially for landscaping portfolios).

---

## Hero Composition

**Must-haves above the fold:**
- Headline that names the aspiration or transformation (not "professional landscaping services")
- City named
- Before/after photo or stunning completed project photo as background or primary image
- CTA: "Get Free Consultation" or "See Our Projects" (aspiration-journey CTA, not "contact us")
- Social proof line under CTA: "4.9 stars — 187 Google Reviews"

**Avoid above the fold:**
- Green stock imagery with generic lawn photos
- Multiple competing CTAs that fragment intent
- Service list in the hero (belongs below the fold)
- Video backgrounds (slow on mobile; intrusive)

---

## Trust Stack (priority order)

1. **Before/after photo gallery** — In landscaping this outperforms every other trust signal. A homeowner who can see a yard similar to their own transformed into what they want is closer to calling than any credential can achieve.

2. **Google review count and rating** — Landscaping is a referral-driven industry. A homeowner who arrived via word-of-mouth confirms the recommendation on Google; a homeowner who arrived via search uses it as a primary filter.

3. **Named project manager / designer profile** — Homeowners giving contractors ongoing access to their property want to know who is coming. A photo, name, and short bio converts the property-access anxiety into a trust moment.

4. **Deposit protection statement** — "We put the full project scope in writing before we start. Your deposit is protected by a signed contract." Addresses the #1 fear in the corpus directly and explicitly.

5. **License, bonding, and insurance** — With actual license number. Landscaping crews work around children, pets, pools, and irrigation systems. The homeowner's liability concern is real.

---

## Form Patterns

**Landscaping has two distinct buyer intents; the form should reflect this:**

**Design/installation intent:**
- Name
- Phone
- Type of project (dropdown: Backyard Transformation / Patio and Hardscape / Synthetic Grass / Planting / Other)
- Rough budget range (optional; helps qualify)
- "Tell us briefly what you're thinking" (short textarea)

**Lawn maintenance intent:**
- Name
- Phone
- Property address
- Services needed (checkboxes: Mowing / Fertilizing / Clean-up / Other)

**Best practice:** Two separate CTAs leading to two separate forms, or a radio button at the top of one form: "I want a landscape project" vs "I need ongoing lawn care."

**Form trigger text:** "Get Your Free Yard Consultation — No Obligation" outperforms generic "Contact Us."

---

## Sticky and Always-Visible Elements

1. **Sticky header with phone** — tap-to-call; non-negotiable on mobile.
2. **Mobile sticky bottom bar** — "Call" | "Get Consultation" two-button strip.
3. **Instagram feed or gallery widget** — Landscaping is more visual than roofing or HVAC. An Instagram embed showing recent completed projects is a secondary trust signal; homeowners scroll it.
4. **"Projects completed" counter** — Dynamic number in the hero or trust bar. "We have completed 340 projects in Phoenix" is a credibility signal for design-intent buyers.

---

## Seasonal and Portfolio CRO Considerations

**Spring:** "Ready for summer — book your backyard project now." Design projects booked in spring; crews busy through summer.
**Summer:** "Fall planting and hardscape installations — plan now for cooler weather."
**Fall:** "Cleanup and prep for next year." Upsell to maintenance plans.
**Winter (warm climates like Phoenix):** "Best time for landscape installation — cooler temperatures, faster plant establishment."

**Portfolio specificity drives conversions:**
- Label every gallery photo with project type, materials, and city
- Include a project cost range where possible ("Backyard transformation, Phoenix — $8,000-$12,000")
- Include homeowner quotes where available

---

## Mobile-Specific Considerations

- Gallery images must load fast; WebP format, under 150kb per image
- Project type filter must work on touch (large tap targets)
- Form must have large field heights; auto-scroll to next field on completion
- Instagram feed should be lazy-loaded; not in the initial render
- Before/after slider (swipe left/right) is the highest-converting gallery format on mobile for landscaping

---

## Source Traceback
- raw/agencies-crawl.json: Section patterns from thriveagency.com/landscaping-web-design-company/, lawncarewebdesign.com, freshysites.com/landscaping/, landscapeleadership.com
- raw/business-homepages.json: lawnstarter.com (booking flow), lawndoctor.com (guarantee framing), lawnlove.com (review volume), naturalawn.com (service differentiation)
- raw/maps-reviews.json: Deposit protection fear and crew access concerns from negative reviews; gallery and portfolio preferences inferred from "design," "beautiful," "transform" frequency
