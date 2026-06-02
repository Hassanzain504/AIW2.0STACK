# Website Factory Brief
Niche: landscaping
Module: 5
Date: 2026-06-01
Student: Hassan

---

## Part A: Niche Identity

```
niche: landscaping
nicheLabel: Landscaping Contractors
nicheCategory: home-services / contractor

endCustomerProfile:
  who: Homeowners aged 28 to 65 planning a yard transformation or seeking reliable weekly lawn care, primarily in US suburban markets
  decisionMoment: After receiving a referral or finding the contractor on Google/Instagram, the homeowner visits the site to answer one question: "Can I trust this person with my property and my deposit?"
  topFears:
    1. Contractor takes deposit and disappears (3 of 4 negative reviews in the corpus describe this)
    2. The finished yard looks nothing like what they imagined
    3. Poor communication during the job; homeowner does not know what is happening on their own property
  topPains:
    1. No way to verify the contractor will follow through before handing over money
    2. No project portfolio with real before/after photos and cost context
    3. Hard to compare contractors because all websites look the same and say the same things

agencyPositioningSentence: "I help landscaping contractors win the trust of homeowners who are imagining what their yard could look like so they choose that contractor over the three others quoting them."

agencyOneLiner: "I build high-converting websites for landscaping contractors."
```

---

## Part B: Niche-Tailoring Directives

### Active template

- Path: `website-factory/templates/landscaping/`
- Source inspiration: sweeneyslandscaping.com (score 350/500), design supplement from iamgreenwise.com
- Visual personality: Earthy and trustworthy. Deep forest green primary, sage green accent, warm off-white surfaces. Playfair Display headings communicate craftsmanship and longevity. Real job photos only, no stock.

---

### Trust stack (top 5 in order)

These are already built into the scaffolded template's component shells. The factory's copy-deck and SOP stages must preserve this priority order.

1. **Before/after project gallery** (filterable by type, labeled with project description and investment range)
   - Implementation: `ProjectGallery.jsx` with filter tabs (All / Lawn Care / Patios + Hardscape / Planting + Beds / Full Transformations / Before + After)
   - Why it ranks first: "Design" appears 124 times, "transform/transformation" 40 times in 484 reviews. The portfolio is the primary conversion mechanism.

2. **Deposit protection statement** (explicit, above the fold in its own section)
   - Implementation: `DepositProtection.jsx` - standalone section with H2 "Your Deposit Is Protected" and plain-language body
   - Why it ranks second: The deposit ghost is the #1 fear. No competitor addresses it. This is the student's primary differentiator.

3. **Google review count and rating** (displayed in hero zone with link)
   - Implementation: `SocialProofStrip.jsx` - 3 pull-quotes + aggregate star rating + Google link
   - Why it ranks third: "Recommend" appears 155 times in reviews. Referral-validated reviews carry the highest conversion weight.

4. **Named project manager / crew profiles with photos**
   - Implementation: `TeamSection.jsx` - owner headshot + 2-3 crew members, first name, role, projects completed count
   - Why it ranks fourth: Project managers are named in 5+ reviews by first name. Homeowners giving ongoing property access need to know who is coming.

5. **License, bonding, and insurance**
   - Implementation: Trust bar below hero + footer license number
   - Why it ranks fifth: Landscaping crews work around children, pets, pools. Liability anxiety is present but not verbalized.

---

### Hero composition (already in template, reference here)

- Subject: Real job photo, exterior daylight, finished yard or active crew on site. Morning or golden-hour light preferred.
- Mood: Aspirational but grounded. The homeowner should see their own yard's potential, not a generic stock backyard.
- Dark overlay: rgba(0,0,0,0.35) to keep white text readable
- H1 format: "[Your Vision]. [Our Work]. [City] Done Right." OR "We'll Bring Your Backyard Vision to Life -- [City]'s Landscape Design Specialists."
- Primary CTA: "See Our Work" (anchors to gallery section)
- Secondary CTA: "Get a Free Estimate" (anchors to contact form)
- Social proof inline: Trust bar below hero -- [Years in business] | [Projects completed] | [City] based | Licensed and insured
- Phone: Present in hero subheadline as tap-to-call link

---

### Copy voice

**Sample hero headlines (use or adapt for each client):**
1. "We'll Bring Your Backyard Vision to Life -- [City]'s Landscape Design Specialists"
2. "Your Yard, Transformed -- [City] Landscaping With Before/After Proof"
3. "Professional Landscaping in [City] -- We Show Up, We Communicate, We Finish"
4. "Your Deposit Is Protected -- We Put Everything in Writing Before We Start"
5. "[Number]+ Completed Projects in [City] -- View Our Before/After Gallery"

**Sample CTAs (use verbatim or adapt):**
1. "See Our Before/After Gallery"
2. "Get a Free Design Consultation"
3. "Schedule Your Free Yard Assessment"
4. "Get an Instant Quote"
5. "Read Our Reviews on Google"

**End-customer phrases to echo verbatim in copy (from 484 reviews):**
1. "bringing our vision to life"
2. "the transformation is amazing"
3. "beautiful" (most aspiration-specific word in corpus)
4. "responsive throughout the entire process"
5. "honest about pricing and gave us a lot of options"
6. "professional and had great communication"
7. "he gave us great ideas for long-term projects"
8. "the project manager explained the materials and the labor"
9. "on time every day"
10. "cleaned up after themselves"

**Section-by-section copy rules (for each client's copy deck):**

| Section | Copy must convey for the end customer |
|---|---|
| Hero | The yard transformation they are imagining is achievable here. This contractor is local, real, and can be trusted. |
| Social proof strip | Other homeowners in this exact city have been through this and are glad they called. |
| Service split | Whether you want weekly maintenance or a full build, this is the right place. Two distinct journeys, two distinct CTAs. |
| Project gallery | Specific projects, similar to what the homeowner is considering, have been done here with real results. Cost ranges are visible. |
| Deposit protection | Your money is safe. There is a written contract before anything starts. |
| Team | Real named people will be on your property. You know who they are before they arrive. |
| How it works | The process is clear, not mysterious. No surprises. |
| FAQ | Every question the homeowner is Googling at 11pm before deciding whether to call gets answered here. |
| Final CTA | One more invitation to take the low-friction first step. |

---

### SEO targets

**Primary keywords (homepage and service pages):**
- `landscape design [city]`
- `landscaping company [city]`
- `lawn care service [city]`
- `patio installation [city]`
- `backyard landscaping [city]`

**Secondary keywords (service detail pages and blog/FAQ content):**
- `landscape design cost [city]`
- `patio installation cost [city]`
- `fire pit installation [city]`
- `synthetic grass installation [city]`
- `raised garden bed installation [city]`
- `artificial turf installation [city]`

**Pages from sitemap:**
- `/` - Homepage
- `/services` - Services overview
- `/gallery` - Project gallery (Our Work)
- `/about` - About us
- `/contact` - Contact
- `/lawn-care` - Lawn Care service page (targets maintenance buyer)
- `/landscape-design` - Landscape Design and Install service page (targets design/install buyer)

**GBP optimization:** Yes. Required for every client. Landscaping contractors win local intent queries via Google Map Pack, not organic 10-blue-links. GBP profile must be claimed, filled, and photo-updated before site launch.

**Aggregator reality:** BBB, Thumbtack, Angi, and Yelp dominate "near me" SERPs. The client site wins by targeting city + service queries (not bare "near me") and by owning GBP for their specific coverage area.

---

### Form pattern

- Already implemented in `FinalCTA.jsx` and `ContactPage.jsx`
- Fields: name, phone, email, project description (optional textarea)
- 3-field minimum (name, phone, email) to reduce friction
- Below-form copy: "We respond within [X] hours. No spam, no pressure."
- On mobile: form collapses into a sticky "Get a Quote" button that scrolls to the form

---

### What the factory should NOT do for landscaping clients

1. Use stock photography. Real job photos only. If the client has no photos, halt the asset stage and request a photo shoot before proceeding.
2. Use a single CTA for both buyer personas. Maintenance and design/install buyers need separate entry points from the first screen.
3. Bury the phone number. Phone must be visible in the hero, in the navbar on mobile, and as a tap-to-call in the sticky mobile bar.
4. Write generic "About Us" copy ("We are a family-owned business dedicated to excellence"). Write specific copy: how long they have been in business, what neighborhoods they serve, what the owner cares about.
5. Skip the deposit protection section. It is non-negotiable. Every client gets it regardless of whether they ask for it.
6. Use em-dashes anywhere in the copy. Not in headlines, body, FAQs, or CTAs.
7. Use buzzwords: seamless, robust, leverage, stunning, cutting-edge, game-changer.

---

## Part C: Brand-DNA Defaults for Landscaping

These are the niche-level defaults. Per-client values override these at Stage 7 (brand-dna extraction).

```
palette:
  primary:         #2D5016   (deep forest green)
  primaryDark:     #1A3009   (hover/footer)
  accent:          #8B9E3A   (sage green)
  accentLight:     #B5C76A   (hover tint)
  surface:         #F7F5F0   (warm off-white)
  neutralDim:      #EDE9E2   (alternate section backgrounds)
  silver:          #C5BFB5   (borders, dividers)
  ink:             #1A1A1A   (body copy)

typography:
  displayFont:  "Playfair Display"
  bodyFont:     "Inter"
  headingWeight: 700
  bodyWeight:    400
  scale:         1.25 (Major Third)

voice_register: family
  (landscaping is relationship-driven; warm but professional, not corporate)

shape_motif: organic
  (8px rounded corners on cards; no sharp geometric shapes)

theme_mode_default: light
  (earthy greens work on light surfaces; dark mode is not standard in this niche)

motion_preset: natural
  (fade-up 240ms on scroll; stagger 60ms between list items; prefers-reduced-motion collapses all)
```

---

## Part D: Missing Fields

The following fields are unknown until a real client is brought into the pipeline. They will be filled at Stage 1 (intake) when `/run-factory` is invoked for a specific client.

| Field | Status | Where it gets filled |
|---|---|---|
| Client business name | [MISSING, needs input from operator] | Stage 1 intake |
| Client website URL | [MISSING, needs input from operator] | Stage 1 intake |
| Client phone number | [MISSING, needs input from operator] | Stage 1 intake |
| Client email | [MISSING, needs input from operator] | Stage 1 intake |
| Client city and state | [MISSING, needs input from operator] | Stage 1 intake |
| Client owner first name | [MISSING, needs input from operator] | Stage 1 intake |
| Client Google Maps URL | [MISSING, needs input from operator] | Stage 2 research |
| Client review count and rating | [MISSING, needs input from operator] | Stage 2 research |
| Client project photos | [MISSING, needs input from operator] | Stage 4 asset harvest |
| Client logo | [MISSING, needs input from operator] | Stage 4 asset harvest |
| Client license number | [MISSING, needs input from operator] | Stage 1 intake or client-provided |
| Client service area (cities/neighborhoods) | [MISSING, needs input from operator] | Stage 1 intake |

None of the above fields are silently blank in this brief. All are explicitly flagged. The brief is valid for locking.

---

## Validation check

Required fields from `research/_structure/Website_Factory_Structure.md`:

| Required field | Status in this brief |
|---|---|
| Niche slug | landscaping - FILLED |
| End customer profile | FILLED |
| Agency positioning sentence | FILLED |
| Trust stack (5 items) | FILLED |
| Hero composition | FILLED |
| Copy voice + sample headlines | FILLED |
| CTA library | FILLED |
| SEO primary keywords | FILLED |
| SEO secondary keywords | FILLED |
| Page/route list | FILLED |
| Form pattern | FILLED |
| Brand-dna palette | FILLED |
| Brand-dna typography | FILLED |
| Voice register | FILLED |
| Shape motif | FILLED |
| Theme mode default | FILLED |
| Motion preset | FILLED |
| Anti-patterns list | FILLED |
| Missing fields inventory | FILLED |

All required fields are filled or explicitly marked [MISSING]. Brief is valid.
