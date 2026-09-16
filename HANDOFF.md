# Handoff

Written so a fresh session, in any account and any tool, can pick this up
without the original conversation. Current as of commit `e009eb2` on branch
`claude/practical-ritchie-4rpv7s`.

## Getting the work

Everything is committed and pushed. Nothing of value lives only in a chat log.

```
git clone https://github.com/Hassanzain504/AIW2.0STACK
cd AIW2.0STACK
git checkout claude/practical-ritchie-4rpv7s
```

All of the work below is on that branch. `main` does not have any of it.

### If you are running in Codex rather than Claude Code

The stack is driven by slash commands that only exist in Claude Code. They are
plain markdown and you can read and follow them by hand:

- `.claude/commands/*.md`, one file per command (`/discovery`, `/research`,
  `/pick-niche` and the rest). Each says what the command does, its gate, and
  its output path.
- `.claude/agents/*.md`, the sixteen agent briefs those commands dispatch to.
- `CLAUDE.md` at the root, the operating rules. Read this first and treat it
  as binding. `website-factory/CLAUDE.md` governs work inside that folder.

Nothing is lost by moving tool. The `/command` shortcut disappears; the
instructions behind it are files in the repository.

## What this covers

Two things running at once:

1. **The AIW 2.0 Stack itself.** Every gate in `stack-state.json` is still
   false. Nothing has been run. `history` is empty.
2. **Black Ops Cleaning,** a live client engagement. A growth audit and a
   $3,500 rebuild proposal were delivered on 23 August 2026. The proposal
   covers 57 pages, a Google Business Profile and review system, and 30 to 40
   citations, over 30 days from handover of access.

## The finding that shapes everything

The proposal promises 57 researched, written, built pages in 30 days. That is
not a hand-writing job. The factory is what makes the number honest, and the
factory has no niche template to build against. **So the stack is not a side
project running alongside the client work. It sits on the client work's
critical path and it is the part that is furthest behind.**

The recommended route is to run the stack now with the niche already decided
as commercial and specialty cleaning, compressing Modules 1 to 2C on evidence
that already exists, and spending the real effort on Module 2D. Engagement one
of the proposal, days 1 to 10, needs no template, which is the window Module
2D fits into.

## What exists

### Committed code

- `website-factory/references/section-patterns/hero-split-form/`
  Hero pattern. Component, standalone preview, README. Reads only from the
  brand-dna shape. Carries the spec strip.
- `website-factory/references/page-patterns/`
  Service page and town page patterns. Components, shared blocks, two JSON
  schemas, README. `blocks.jsx` holds `QuoteForm`, the first stateful block.
  `TownPage.jsx` throws at build time when a town has no completed local job
  with a photograph, which is deliberate.
- `website-factory/references/brand-dna.shape.js`
  The 32-key contract every component reads from. Components hold no literal
  hex and no client strings. Carries an optional `registrations` block (UEI,
  CAGE, NAICS, SAM) where every field is nullable, because most local-service
  clients hold none of them.

### Page data

`website-factory/clients/Black Ops Cleaning/Pipeline Data/copy/pages/services/`

Three validated service pages: `unattended-death-cleanup.json`,
`biohazard-remediation.json`, `crime-scene-cleanup.json`. Each validates
against `service-page.schema.json`. `gallery` and `reviews` are omitted on
purpose, and `pricing` carries a heading and a note but no rows.

### Working documents

`website-factory/clients/Black Ops Cleaning/working-docs/`, eighteen documents
plus a README. That README lists every one and gives a reading order for
someone new. Start there, not here.

`service-page-final.html` is the most finished artefact: one complete service
page generated from its JSON rather than written by hand. Published at
https://claude.ai/artifact/2A4ggj7kXJeptPuCiu3FuT

## Rules that must not be broken

These come from `CLAUDE.md` and from decisions taken with the client. They are
not style preferences.

- No em-dashes. No emojis. No buzzwords. Calm, direct, plain sentences.
- **Nothing may be invented.** No reviews, no ratings, no case studies, no
  timescales, no certificate numbers. An empty slot stays an empty slot.
- **Veteran owned, never certified.** Until SBA VetCert completes, never
  "SDVOSB", never "VOSB", never "certified veteran owned".
- **No published prices.**
- **The 24-hour phone claim and the two-hour on-site window are two separate
  claims.** Never "24/7 crews standing by".
- No stock photography.
- Never publish, push, deploy or send without the student's explicit approval.

### One claim to watch

Copy decks 2 and 4 say an answering service **satisfies** the 24-hour promise.
So "a person, not an answering service" is not a claim this client can make. It
was written into a footer during this session and removed in `babec20`. Do not
reintroduce it.

## Decisions already made

| Decision | Made by | What it means |
|---|---|---|
| No published pricing | Client | Price ranges come off every page. Replaced by a block explaining why they do not quote blind, a free assessment, and a written price before work starts. |
| Phone answered 24 hours, on-site window stated separately | Claude, at the user's request | Two claims, stated separately. Needs someone genuinely answering, which an answering service satisfies. |
| No review gating | Claude, declined to build | Routing customers to Google based on a predicted rating is banned by Google and covered by the FTC rule on review suppression. Replaced by a two door capture page: public review and private line to the owner, side by side, no rating question, customer chooses. |
| Review flow runs on QR, text and email | Client | Technician shows a QR at handover, the capture page takes name, mobile and email with a consent tick, and a two message sequence runs on both channels then stops. |
| Veteran owned, not certified | Claude | See the rules above. |
| Field black and brass palette | Claude, approved by user | Built on the name and the veteran status. Black is punctuation, not the ground. Brass is a desaturated metal, never a glow. Supersedes the two options in `palette-direction.html`. |
| Warm off-white ground for the 49 reading pages | Claude, option C in `light-grounds.html` | Applied in full in `service-page-final.html`. Awaiting explicit confirmation. |
| Barlow Condensed and Barlow | User | An earlier serif pass read too premium for a local cleaning business. |

## Open, and blocking

1. **Has the client signed?** The proposal was valid until 23 September 2026.
   The repository has no record either way.
2. **The 24 hour operational commitment.** The copy assumes someone answers.
   If that is a hard no, four specialty pages need rewriting and the emergency
   service page does not get built.
3. **Maryland victim compensation** line on the crime scene page. Verify
   against the current programme or cut the bullet.
4. **Every timescale** in the copy decks. Two hours, one to three days, three
   to five days. These are industry norms, not the client's measured
   performance.
5. **Federal janitorial market figures** on the government facility page.
   Verify against current SAM.gov or USASpending data.
6. **CIMS or Green Seal.** Does the client hold either? Federal and
   institutional solicitations name CIMS specifically, and the answer changes
   two pages.
7. **Four photograph slots** and the Maryland licence number, both waiting on
   the client.

## Known bug, not yet fixed

`website-factory/tools/build-from-template.py` fabricates a rating for a
client with no reviews. Verified at these lines:

- 1392 and 1394, `pick_first(..., 5.0)` falls back to a 5.0 rating
- 1887, `rating = research.get("googleRating") or 5.0`
- 1901, emits `f"{rating}★ on Google ({review_count} Reviews)"`

For Black Ops that renders "5.0★ on Google (0 Reviews)". Line 1040 has the
same 5.0 fallback in `_compose_real_reviews`. The logo strip at 1032 and the
review filter at 1109 and 1127 are correctly guarded, so the fix is local to
these call sites. **Left untouched deliberately**, because it is factory code
and changing it affects every client build, not just this one.

## Slots, and why they are empty

Black Ops has **zero reviews on every platform** and no job photographs
supplied. Every review block, case study and local job proof in the copy decks
is marked as an amber slot rather than written. **None of them may be
invented.** A town page without a real local job and a photograph does not get
built, and the component enforces that. This blocks 16 of the 17 town pages.

## Coverage

- Copy decks cover 15 of the 57 pages, across four batches.
- Page patterns cover 49 of the 57. Home and seven supporting pages have no
  component; `design-prompts.md` carries paste-ready prompts for those eight.
- Three of roughly ten service pages exist as validated JSON. Five more are
  transcribable from the decks: hoarding, sewage, janitorial, medical facility,
  government facility, disinfection. The 24/7 emergency page is blocked on
  open item 2.

## What is next

In order:

1. Confirm the three open design questions: the warm off-white ground, dark
   for the eight marketing pages, and the softened text on dark bands.
2. Transcribe the five unblocked service pages into validated page data.
3. Run `/setup`. It cannot complete in a cloud session: `vercel login` and
   `gh auth login` both open a browser, and anything written to `.env.local`
   dies with the container. Apify is the credential that gates real work.
4. Module 2D, the niche template builder. This is the long pole.
5. The remaining town pages, then the 19 service x town pages, both gated on
   the client supplying job photographs.
