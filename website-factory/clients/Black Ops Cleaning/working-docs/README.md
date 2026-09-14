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
| `review-system.html` | The review engine: QR flow, capture page, text and email sequences, reply templates, pace and channels. |

## Reading order for someone new

1. `project-plan.html`, for the state of play and the two routes
2. `cleaning-teardown.html`, for what the competition actually does
3. `page-blueprint.html`, for the structure all 57 pages follow
4. The three copy decks, for the voice and the finished pages
5. `citations-runbook.html` and `review-system.html`, for workstreams 2 and 3

## Related code

The page patterns these decks are written against live in the factory
references, not here:

- `website-factory/references/section-patterns/hero-split-form/`
- `website-factory/references/page-patterns/`
