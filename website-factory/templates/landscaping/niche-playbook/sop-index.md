# SOP Index - Landscaping Niche Template

All SOPs for the landscaping niche are in `.claude/sops/`. This index lists each file with its purpose and the pipeline stage it covers.

---

## Stage SOPs

| File | Stage | Purpose |
|------|-------|---------|
| `10-intake.sop.md` | Stage 1 | Client intake checklist for landscaping clients. Includes photo requirements, service area confirmation, and contract preferences. |
| `20-research.sop.md` | Stage 2 | GBP and social research for a landscaping contractor. What to look for in reviews, competitor analysis, and service area signals. |
| `30-seo.sop.md` | Stage 3 | Local SEO for landscaping. Keyword targets, page structure, schema markup for LocalBusiness and Service types. |
| `40-assets.sop.md` | Stage 4 | Asset harvesting for landscaping clients. Priority order: project photos, owner photo, crew photos, trust badges. Halt conditions if no real photos exist. |
| `50-strategy.sop.md` | Stage 5 | Strategy for landscaping sites. Buyer journey split decision (maintenance vs design/install emphasis), gallery prioritization, deposit protection placement. |
| `60-copy.sop.md` | Stage 6 | Copywriting for landscaping. Voice rules, CTA selection from cta-library.json, FAQ population from faq-bank.json, social proof formatting. |
| `70-brand-dna.sop.md` | Stage 7 | Brand DNA extraction for landscaping. Color pull from logo, photography style assessment, tone calibration. |
| `90-hero.sop.md` | Stage 9 | Hero image generation for landscaping. Composition rules: finished yard, daylight, real project feel. |
| `101-build.sop.md` | Stage 10.1 | Build from niche template. Token injection, gallery population, route configuration. |
| `102-personalize.sop.md` | Stage 10.2 | SEO injection specific to landscaping: city modifier patterns, service-area schema, FAQ schema. |
| `103-uplift.sop.md` | Stage 10.3 | Niche polish: confirm deposit protection section is visible and on-message, confirm gallery has real project photos, confirm trust bar is accurate. |

---

## QA Checklists

| File | Purpose |
|------|---------|
| `.claude/checklists/sop-compliance.md` | Section-by-section SOP compliance checks specific to the landscaping wireframe. |
| `.claude/checklists/design-fidelity.md` | Region SSIM thresholds and composition checks for the landscaping template. |

---

## Playbook files

| File | Read by |
|------|---------|
| `trust-stack.json` | Strategy agent, copy agent |
| `cta-library.json` | Copy agent, build agent |
| `copy-deck.json` | Copy agent |
| `faq-bank.json` | Copy agent, build agent |
| `service-definitions.json` | Copy agent, strategy agent |
| `photo-brief.md` | Asset agent, intake agent |
| `pricing-anchors.json` | Copy agent, strategy agent |
| `objection-handlers.json` | Proposal agent |
| `design-tokens.md` | Build agent, design QA agent |
