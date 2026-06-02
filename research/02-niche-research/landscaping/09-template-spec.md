# 09 - Template Design Spec
Niche: landscaping
Source winner: sweeneyslandscaping.com (score 350/500)
Visual reference supplement: iamgreenwise.com (gallery composition), marktessier.com (portfolio quality)

---

## Color system

Primary brand palette for residential landscaping. Earthy, trustworthy, professional. Draws from the organic greens and warm neutrals seen in iamgreenwise.com and the photographic composition standards of marktessier.com.

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #2D5016 | Deep forest green. Headlines, buttons, nav active states |
| primaryDark | #1A3009 | Hover states on primary buttons, footer background |
| primarySlate | #3D6B2A | Mid-tone green for section dividers and borders |
| accent | #8B9E3A | Sage green. Secondary buttons, badge fills, icon fills |
| accentLight | #B5C76A | Hover tint on accent elements, tag backgrounds |
| accentDark | #6B7A2B | Pressed state on accent buttons |
| neutral | #F7F5F0 | Warm off-white. Section backgrounds, card surfaces |
| neutralDim | #EDE9E2 | Alternate section backgrounds, input fills |
| silver | #C5BFB5 | Borders, dividers, muted labels |
| ink | #1A1A1A | Body copy, headings on light backgrounds |

## Typography

Headings: Playfair Display. A classical serif that communicates craftsmanship and longevity. Used by high-end landscaping and home-services brands. Weight 700.

Body: Inter. Clean, readable sans-serif. Matches the professional tone without competing with the serif headings. Weight 400 regular, 500 medium for labels and captions.

Scale: 1.25 (Major Third). Heading sizes step 1.25x from base 16px. This gives clear visual hierarchy without oversized headings on mobile.

Font URLs:
- https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap

## Spacing system

Base unit: 4px (Tailwind default). Section vertical padding: 80px desktop, 48px mobile. Card gap: 24px. Component inner padding: 24px desktop, 16px mobile.

## Imagery style

From the winner analysis:
- Real job photos only. No stock. Homeowners can tell immediately.
- Exterior daylight shots preferred. Morning or golden-hour light for hero images.
- Before/after pairs must be from the exact same angle and distance.
- Gallery images: 4:3 ratio for consistent grid cells.
- Hero background: 16:9 or full-bleed with a slight dark overlay (rgba 0,0,0,0.35) to keep white text readable.
- Team photos: outdoor, natural light, working gear acceptable. Headshots should feel real not posed.

## Component patterns derived from winner

### Guarantee/protection callout
sweeneyslandscaping.com features its guarantee as a standalone section with a badge image and a direct headline. In our template this becomes the Deposit Protection section. Bold H2, 2-3 sentence body, no buried fine print.

### Phone CTA in hero
sweeneyslandscaping.com wraps the phone number in a tel: link and puts it in the hero subheadline copy. We preserve this: phone appears in hero subhead as a tap-to-call link alongside the primary CTA button.

### Dual CTA structure
sweeneyslandscaping.com has "Get Estimate Fast" as primary and a phone number as secondary in the hero. We extend this to a two-button layout: "See Our Work" (anchors to gallery) and "Get a Free Estimate" (opens/anchors to form).

### Social proof strip
iamgreenwise.com shows real project photos as a strip. sweeneyslandscaping.com implies reviews via the guarantee. We combine: 3 pull-quotes with reviewer names and stars, plus a "4.9 stars on Google" aggregate badge.

### Gallery grid
iamgreenwise.com shows a multi-row photo grid with labeled sections. We implement as a filterable grid with tabs (All / Lawn Care / Patios + Hardscape / Planting + Beds / Full Transformations / Before + After).

## Tone and copy rules

- First-person plural: "we build", "our crew", "our work"
- Homeowner-facing nouns: "your yard", "your project", "your budget"
- Specific over generic: "natural stone patio" not "outdoor space"
- Short sentences. One idea per sentence.
- No em-dashes. No buzzwords. No "seamless", "stunning", "robust".

## Motion preset

Natural. Gentle entrance transitions on scroll (fade-up, 240ms). Stagger 60ms between list items. No flashy motion. Prefers-reduced-motion collapses all transitions to near-zero.

## Shape motif

Organic. Subtle rounded corners on cards (8px). No sharp geometric shapes. Section dividers use gentle diagonal cuts (clip-path) where used at all.
