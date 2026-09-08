# Page patterns

Two page templates for local-service niches: one service page, one town page.
Together they are the pages that carry a local-service site. On the Black Ops
sitemap they account for 49 of the 57 pages.

These are **patterns**, not niche decisions. Module 2D copies them into
`templates/{niche-slug}/src/components/` only when that niche's wireframe
selects them.

## Files

| File | What it is |
|---|---|
| `preview.html` | Standalone, tabbed. Both page types with every content slot labelled. Open it to judge structure before wiring data. |
| `blocks.jsx` | The blocks both pages share: banner, section, process list, gallery, reviews, FAQ, link pills, closing CTA. |
| `service-page/ServicePage.jsx` | The service page component. |
| `service-page/service-page.schema.json` | Its data contract. |
| `town-page/TownPage.jsx` | The town page component. |
| `town-page/town-page.schema.json` | Its data contract. |

## Where the data comes from

Stage 6 (copy deck) writes one JSON document per page:

```
Pipeline Data/copy/pages/
  services/{slug}.json     validates against service-page.schema.json
  towns/{slug}.json        validates against town-page.schema.json
```

The components read that document plus `brand-dna`. No client strings, no
niche words and no literal colours live in the components. A new client is a
data change.

## Service page, block by block

Ordered as the end customer's questions arrive, not as the business would
like to talk about itself.

1. **Banner.** Breadcrumb, H1 naming the service AND the area, subhead, proof
   pills, two CTAs. An H1 that is a slogan is an audit failure.
2. **The problem, in their words.** Verbatim phrasing pulled from research,
   each quote carrying its source so it stays traceable. This is the block
   that makes a page feel written for one person.
3. **What the work covers.** Four or more items. Everything included, so
   nothing reads as an upsell added later.
4. **Process with real timescales.** Three to seven steps. A genuine sequence,
   which is the only reason the steps are numbered. Every step carries a
   timescale taken from completed jobs.
5. **Credentials.** What licences the business to do this work. Optional
   disclaimer slot for niches with a common false-authority pattern to
   distance from.
6. **Pricing.** Optional but strongly preferred. Published ranges stop the
   visitor phoning three competitors just to get a number.
7. **Own work.** Client photographs, town named on each. Stock photography is
   an audit failure.
8. **Reviews.** From `brand-dna.reviews`, optionally filtered.
9. **FAQ, 8 to 12 questions.** The floor is 8 because this is the block AI
   answers pull from.
10. **Towns.** Internal links out to the town pages.
11. **Closing CTA.**

## Town page, and the one rule that matters

A town page works only if it names a real job completed in that town, with a
photograph from it. Without that, it is filler, and Google treats it as
filler. `TownPage.jsx` **throws at build time** when `proof.job.filename` is
missing, rather than rendering a page that cannot rank.

That is deliberate. It converts a content rule into a build error, so a
missing photograph stops the build instead of quietly shipping 17 pages that
never rank.

Blocks:

1. **Banner.** Breadcrumb, H1 naming service and town, a subhead that says
   something true only about this town.
2. **Proof.** Required. Completed job, photograph, what the problem was, what
   was done, what the outcome was.
3. **Services here.** Links back to each service page, each blurb written for
   this town. Naming local roads, districts or facilities is what separates
   this from boilerplate.
4. **Local context.** Address, zip codes covered, response time, districts,
   active contracts. Specifics that prove the business works here.
5. **Reviews.** Filtered to the town, falling back to nearest when empty.
6. **FAQ, 4 to 8.** Lower floor than a service page on purpose. A town page
   carries less, and padding it is worse than omitting it.
7. **Nearby towns.**
8. **Closing CTA.**

## Internal linking

Service pages link down to towns. Town pages link back up to services and
sideways to neighbouring towns. That mesh is what makes a large sitemap
behave like a structure rather than a pile of pages, and both directions are
required by the schemas.

## Structured data

- Service pages emit `Service` with `areaServed` from the town list, plus
  `FAQPage` entities from the FAQ block.
- Town pages emit `LocalBusiness` with `areaServed` set to the town, plus
  `aggregateRating` when the client has reviews.

## Rolling release

Publishing 57 pages in one month reads as spam. The same 57 published two or
three a week reads as a business that is growing. These patterns build all
pages at once; the release schedule is a deploy concern, not a build concern.
