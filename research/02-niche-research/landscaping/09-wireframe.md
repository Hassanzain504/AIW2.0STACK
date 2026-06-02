# 09 - Wireframe
Niche: landscaping
Template: sweeneyslandscaping.com winner + 08-starter-template.md structure

---

## Section order (homepage)

The homepage handles both buyer journeys (maintenance and design/install) via a single page. Section order follows the conversion logic from 08-starter-template.md.

---

## Section 1: Hero

**Component:** `Hero.jsx`
**Layout variant:** Full-bleed background image, centered content, dark overlay

Content slots:
- `brandDNA.hero.heading` - H1 text (e.g. "Your Vision. Our Work. [City]'s Landscaping Specialists.")
- `brandDNA.hero.subheading` - Subhead with phone embedded as tap-to-call link
- Primary CTA button - "See Our Work" - anchors to `#gallery`
- Secondary CTA button - "Get a Free Estimate" - anchors to `#lead-form`
- Trust bar row below buttons: Years in business | Projects completed | City-based | Licensed and insured

CTA placement: centered, stacked on mobile (full-width buttons), side-by-side on md+

Above-fold requirement: trust bar must be visible above 900px desktop fold.

---

## Section 2: Social Proof Strip

**Component:** `SocialProofStrip.jsx`
**Layout variant:** 3-column grid on desktop, vertical stack on mobile

Content slots:
- 3 review pull-quotes: `brandDNA.reviews[0..2]` (name, rating, text)
- Aggregate badge: `brandDNA.reviews.googleAggregate` (stars count, total)
- Optional video embed: `brandDNA.reviews.videoEmbedUrl`

Note: strip uses a muted neutral background (#F7F5F0) to separate from hero.

---

## Section 3: What We Do (ServiceSplit)

**Component:** `ServiceSplit.jsx`
**Layout variant:** Two equal cards, side-by-side on md+, stacked on mobile

Card 1 - Weekly Lawn Care:
- Icon (grass/leaf SVG)
- Heading: "Weekly Lawn Care"
- Price anchor: `brandDNA.services.lawnCare.priceAnchor` ("Starting at $X/visit")
- 4-item bullet list: mowing, edging, fertilizing, seasonal cleanup
- CTA button: "Get a Maintenance Quote" anchors to `#lead-form`

Card 2 - Landscape Design + Install:
- Icon (shovel/garden SVG)
- Heading: "Landscape Design + Install"
- Project type list: patios, planting beds, outdoor lighting, full transformations
- CTA button: "Start a Project" anchors to `#lead-form`

This section is the primary buyer-journey split. It appears before the gallery so visitors self-select before they scroll.

---

## Section 4: Project Gallery

**Component:** `ProjectGallery.jsx`
**Layout variant:** Filterable grid with tabs above, 3 columns desktop, 2 columns tablet, 1 column mobile

Content slots:
- Filter tabs: All | Lawn Care | Patios + Hardscape | Planting + Beds | Full Transformations | Before + After
- Gallery items from `brandDNA.gallery` array: each item has `src`, `alt`, `category`, `label`, `investmentRange`, `area`
- Swipeable on mobile (touch scroll)

Section anchor: `id="gallery"`

Note: gallery images are the primary conversion driver. Each card shows project type label, investment range, and area label.

---

## Section 5: Deposit Protection

**Component:** `DepositProtection.jsx`
**Layout variant:** Centered single column, max-width 720px, light green background tint

Content slots:
- H2: "Your Deposit Is Protected"
- Body: `brandDNA.depositProtection.body` (3 sentences about written contract, scope, payment schedule)
- Optional trust badge image: `brandDNA.depositProtection.badgeUrl`

This section addresses the #1 homeowner fear. It stands alone, not buried in footer.

---

## Section 6: Meet the Team

**Component:** `TeamSection.jsx`
**Layout variant:** Owner card (full-width accent) + 2-3 crew cards below in a row

Content slots:
- Owner card: `brandDNA.team.founder` (name, title, photo, bio, years experience)
- Crew cards: `brandDNA.team.crew` array (firstName, role, photo)

Real photos required. Stock photos disqualify this section.

---

## Section 7: How It Works

**Component:** `HowItWorks.jsx`
**Layout variant:** Two parallel 3-step tracks (one per buyer journey), tabs to switch on mobile

Track 1 - Maintenance:
1. Free quote - "Tell us about your yard. We give you a firm price."
2. Schedule your first visit - "Pick a day that works. We show up on time."
3. Consistent service every week - "Same crew, same standard, every visit."

Track 2 - Design + Install:
1. Free yard assessment - "We walk your property and listen to your vision."
2. Design proposal with visuals - "You approve the plan before any work begins."
3. Build on your timeline - "We install on the schedule we agreed to."

Each step: icon + heading + one-line body.

---

## Section 8: Service Area

**Component:** `ServiceAreaSection.jsx`
**Layout variant:** City/neighborhood tag list on left, optional map embed on right (md+ two-column)

Content slots:
- `brandDNA.serviceArea.cities` array of city/neighborhood names
- `brandDNA.contact.mapsEmbedUrl` for the iframe (optional, hides if null)

---

## Section 9: FAQ

**Component:** `FAQSection.jsx`
**Layout variant:** Accordion list, single column, max-width 800px centered

8 questions from the homeowner's decision moment. See niche-playbook/faq-bank.json for Q+A pairs.

Accordion: one open at a time. First item open by default.

---

## Section 10: Final CTA

**Component:** `FinalCTA.jsx`
**Layout variant:** Full-width green background, centered content, inline form

Content slots:
- H2: "Ready to See What Your Yard Could Look Like?"
- Lead form fields: name, phone, email, project description (optional textarea)
- Submit button: `brandDNA.copy.ctaPrimary`
- Below-form note: "We respond within [X] hours. No spam, no pressure."

Section anchor: `id="lead-form"`

---

## Section 11: Footer

**Component:** `Footer.jsx`
**Layout variant:** 3-column desktop (brand + nav + contact), stacked mobile

Content slots:
- Company name and tagline
- License number: `brandDNA.company.licenseNumber`
- Insurance statement: "Fully insured. Certificate available on request."
- Nav links: Home, Services, Gallery, About, Contact, Privacy
- Google review link
- Social links: Instagram, Facebook only

---

## Persistent elements

**Component:** `Navbar.jsx` - sticky top, logo left, nav links center, phone + CTA button right. Collapses to hamburger on mobile.

**Component:** `StickyMobileBar.jsx` - fixed bottom on mobile only. Two buttons: "Call Now" (tel link) and "Get a Quote" (anchors to #lead-form). Hidden on md+.

---

## Composition notes

- Total sections: 11 (Hero through Footer) + Navbar + StickyMobileBar
- Above fold: Hero section only. Trust bar within hero clears fold at 900px.
- Primary CTA flow: Hero -> Gallery -> ServiceSplit -> FinalCTA (multiple entry points to form)
- All primary CTAs anchor to `#lead-form` or are telephone links
- Section alternation: neutral background (#F7F5F0) and white (#FFFFFF) alternate for visual separation
