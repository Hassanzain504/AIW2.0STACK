# Black Ops Cleaning, working documents

Every deliverable produced before the factory pipeline was run. Each file is a
standalone HTML page. Open it in a browser, or publish it as an artifact from
any Claude account to get a shareable link.

These were built during a session that did not have the stack gates passed, so
they sit here rather than in `Pipeline Data/`. When Stage 1 intake runs, the
copy decks feed `Pipeline Data/copy/` and the rest become inputs to Stage 3
strategy and Stage 6 copy.

## The files

| File | What it is |
|---|---|
| `project-plan.html` | Where the stack and the client engagement actually stand, the two routes, the gate chain, the merged 30 day critical path, and the citations list. Start here. |
| `citations-runbook.html` | What to collect from the client, the eight phase filing order, how each listing completes, and the failure modes. |
| `citations-sheets.html` | Two working sheets: the locked reference sheet every listing copies from, and the 41 row tracker. Published with the `artifact` capability so edits save into the page itself. |
| `cleaning-teardown.html` | Eight US sites read page by page. Which town, service and service x town pages are worth copying and which are boilerplate. Carries the Module 2D capture list. |
| `page-blueprint.html` | Every section on every one of the 57 pages, by page type, with a live example under each block and the rule that stops service x town pages cannibalising their parents. |
| `copy-deck-batch1.html` | Unattended death cleanup, Commercial Cleaning Rockville MD, Biohazard Cleanup Rockville MD. One of each page type. |
| `copy-deck-batch2.html` | The specialty set: biohazard remediation, crime scene and trauma, hoarding, sewage backup. |
| `copy-deck-batch3.html` | The commercial set: janitorial, medical facility, government facility, disinfection. |
| `copy-deck-batch4.html` | The supporting set: Home, About and Team, Contact, and Government Contracting. Carries the consolidated verification queue and the list of what Amilcar still needs to supply. |
| `palette-direction.html` | Two candidate colour palettes, each shown on a commercial page and a specialty page, with every contrast pairing measured. Pre Stage 7 direction only, the factory rebuilds the palette from the logo. |
| `hero-rework.html` | The Home hero before and after, replacing the middot pill row with a spec strip. Carries the field black and brass palette, built on the name and the veteran status, which supersedes the two options in `palette-direction.html`. |
| `page-previews.html` | The service page and the town page rendered with Black Ops' own copy, in the field black and brass palette with the spec strip. Shows the empty states as they actually stand, including the town page build gate. |
| `page-previews-v2.html` | Second pass at both page types. Newsreader serif display, asymmetric banner with depth, marginalia column, process figures as display type, full-bleed dark bands. Supersedes `page-previews.html`, which stays as the first pass for comparison. |
| `page-previews-v3.html` | Both page types built to convert. Four-field form above the fold, phone in three places, trust strip, mid-page conversion band, mobile sticky call bar. Back to Barlow Condensed and Barlow. This is the current one; v1 and v2 stay for comparison. |
| `design-prompts.md` | Paste-ready Claude Design prompts for the eight pages that have no component: Home, Government Contracting and the rest of the supporting set. Carries the palette, type, spec strip, conversion floor and honesty rules in one block. |
| `light-grounds.html` | Five candidate light grounds for the 49 reading pages, shown as touching blocks and as the same page section rendered on each. The decision surface for the warm versus cool question. |
| `service-page-final.html` | One complete service page, generated from `Pipeline Data/copy/pages/services/unattended-death-cleanup.json` rather than written by hand. Warm off-white ground, black as punctuation, softened text on the dark bands. |
| `review-system.html` | The review engine: QR flow, capture page, text and email sequences, reply templates, pace and channels. |

## Reading order for someone new

1. `project-plan.html`, for the state of play and the two routes
2. `cleaning-teardown.html`, for what the competition actually does
3. `page-blueprint.html`, for the structure all 57 pages follow
4. The four copy decks, for the voice and the finished pages
5. `citations-runbook.html` and `review-system.html`, for workstreams 2 and 3
6. `palette-direction.html`, for the colour direction ahead of Stage 7, then
   `hero-rework.html` for the palette that replaced it and the spec strip pattern
7. `page-previews.html`, for both page types built out of that decision, then
   `page-previews-v2.html` for the craft pass, then `page-previews-v3.html`,
   which is the current shape and the one to judge
8. `light-grounds.html`, to settle the ground colour for the reading pages,
   then `service-page-final.html` for that decision applied to a whole page
9. `design-prompts.md`, if you are taking the eight uncovered pages into
   Claude Design yourself

## Related code

The page patterns these decks are written against live in the factory
references, not here:

- `website-factory/references/section-patterns/hero-split-form/`
- `website-factory/references/page-patterns/`
