# Section pattern: `hero-split-form`

A hero composition for local-service niches where the end customer arrives
mid-problem and wants a human, a price and a next step without scrolling.

This is a **pattern**, not a niche decision. Module 2D copies it into
`templates/{niche-slug}/src/components/Hero.jsx` only when the niche
wireframe (`09-wireframe.md`) selects `hero-split-form`. A niche whose
research points elsewhere gets a different hero.

## Files

| File | What it is |
|---|---|
| `preview.html` | Standalone, no build step. Open it to judge the layout before wiring data. Placeholder art, labelled as such. |
| `Hero.jsx` | The real component. React, Tailwind, framer-motion. Reads only from the brand-dna shape. |

## Anatomy, top to bottom

1. **Utility bar.** Urgency line, open/closed state, service region, tel link.
   Reads from `copy.topBar.cta`, `copy.availableNow`, `company.serviceRegion`,
   `contact.phone`.
2. **Nav.** Logo, links, phone, primary CTA button.
3. **Photo stage.** Stage 9 hero render, plus a diagonal scrim so the left
   40 percent stays readable. The scrim is why the hero-composition contract
   reserves that zone.
4. **Headline.** Condensed uppercase, capped at 15ch, `text-wrap: balance`.
   No eyebrow chip above it: small uppercase wide-tracked labels stacked on a
   display H1 are flagged by `impeccable` as an antipattern.
5. **Proof chips.** Exactly three, from `copy.heroTrustChips[]`. Each string
   splits on the first comma into claim plus qualifier, so the copy stays one
   locked string per chip.
6. **Owner cutout.** Optional. Only for niches whose `hero-composition.md`
   puts a person in frame. Name card overlaps the photo so the face reads as
   a person, not stock.
7. **Quote form.** Four fields maximum, the universal CRO floor. Field set
   comes from the niche playbook's `cro-rules.md`, never hardcoded.
8. **Trust badge strip.** From `trust_badges[]`, files under `public/badges/`.
9. **Marquee.** Optional. Cheap way to state guarantees without another
   section. Honours `prefers-reduced-motion`.
10. **Mobile sticky bar.** Call plus quote. The universal persistent CTA path.

## Why this shape converts

The end customer of a local service is comparing three businesses in about
four seconds. This hero answers their four questions in their order:

- Do you do my thing, near me? Headline plus service region.
- Are you real? Owner face, review count, badges.
- What is the risk? Warranty and guarantee chips, privacy line.
- What happens if I act? A four-field form and a phone number, both above
  the fold.

Everything else on the page is elaboration. If the hero fails, the rest of
the site never gets read.

## Universal CRO checks this pattern satisfies

- [x] Two CTAs above the fold: form (primary) and tel link (secondary)
- [x] First-ask form has 4 fields or fewer
- [x] Persistent CTA path on mobile
- [x] Trust signals above the fold

Still owed by the page, not by this section: email magnet, footer contact
path, process surface, GA4 and CallRail tagging.

## Data contract

Every string and colour resolves from `references/brand-dna.shape.js`. The
component contains no client names, no niche words and no literal hex values.
Swapping niche or client is a data change, never a code change.

## Adapting it

- **No owner photo for this niche?** Pass `ownerImage={null}`. The grid
  collapses to a single column and the headline widens.
- **Niche needs a different field set?** Pass `formFields` from the playbook.
  The component slices to 4 regardless.
- **Niche has no badges?** Leave `trust_badges` empty. The strip does not render.
