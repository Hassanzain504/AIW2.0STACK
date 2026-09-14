# Handoff

Written so a fresh session, in any account, can pick this up without the
original conversation.

## What this covers

Two things running at once:

1. **The AIW 2.0 Stack itself.** Every gate in `stack-state.json` is still
   false. Nothing has been run.
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
  brand-dna shape.
- `website-factory/references/page-patterns/`
  Service page and town page patterns. Components, shared blocks, two JSON
  schemas, README. `TownPage.jsx` throws at build time when a town has no
  completed local job with a photograph, which is deliberate.

### Working documents

`website-factory/clients/Black Ops Cleaning/working-docs/`, nine HTML pages.
See the README in that folder for what each one is and the reading order.

## Decisions already made

| Decision | Made by | What it means |
|---|---|---|
| No published pricing | Client | Price ranges come off every page. Replaced by a block explaining why they do not quote blind, a free assessment, and a written price before work starts. |
| Phone answered 24 hours, on-site window stated separately | Claude, at the user's request | Never write "24/7 crews standing by". Two claims, stated separately. Needs someone genuinely answering, which an answering service satisfies. |
| No review gating | Claude, declined to build | Routing customers to Google based on a predicted rating is banned by Google and covered by the FTC rule on review suppression. Replaced by a two door capture page: public review and private line to the owner, side by side, no rating question, customer chooses. |
| Review flow runs on QR, text and email | Client | Technician shows a QR at handover, the capture page takes name, mobile and email with a consent tick, and a two message sequence runs on both channels then stops. |
| Veteran owned, not certified | Claude | Until SBA VetCert completes, every page says "veteran owned". Never "SDVOSB", never "certified veteran owned". |

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

## Slots, and why they are empty

Black Ops has **zero reviews on every platform** and no job photographs
supplied. Every review block, case study and local job proof in the copy decks
is marked as an amber slot rather than written. **None of them may be
invented.** A town page without a real local job and a photograph does not get
built, and the component enforces that.

## What is next

Batch four of the copy decks: Home, About and Team, Contact, and Government
Contracting. Then the remaining town pages, then the 19 service x town pages.

Before any of that, `/setup` needs running on a machine with a browser, because
it cannot complete in a cloud session: `vercel login` and `gh auth login` both
open a browser, and anything written to `.env.local` dies with the container.
Apify is the credential that gates real work.
