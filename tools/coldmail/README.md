# Cold-email verification and generation pipeline

Rebuilt 22 Sep 2026 after the previous session's container was reclaimed and
every working file was lost. Committed here so that does not happen again.

Nothing in this folder contains leads, credentials or prospect data. The API
key lives at `/home/user/.secrets/instantly_key` (chmod 600) and is never
echoed or written here.

## Corrections to the previous HANDOVER

The old handover was wrong on four points. All four were verified today.

1. **`POST /leads/delete` does not exist, but `DELETE /api/v2/leads/{id}` does.**
   There is no need to delete and recreate a campaign to clear it. Returns 200
   and the lead is gone.
2. **Uploading leads uses `campaign_id`, not `campaign`.** Listing them uses
   `campaign`. Sending `campaign` to `/leads/add` returns
   `"Either campaign_id or list_id must be provided."` and uploads nothing.
3. **`PATCH /api/v2/leads/{id}` works and merges `custom_variables`.** This is
   how you correct copy on a queued lead without restarting its sequence.
   Never delete and re-add a lead that has already been emailed: it starts the
   sequence over and the prospect gets email 1 twice.
4. **The no-form claim was wrong far more often than the handover estimated.**
   It said 341 of 421 were unverified. A live scan of all 367 US leads found a
   contact form on the large majority. Only 41 sites genuinely had none.

## Why counting form fields cannot settle the no-form question

`castlecleanandseal.com` is the case that proves it, and it is why Chance was
right and we were wrong.

- His form is at `/get-a-fast-quote`. That path is in no guess-list.
- Even on that page the DOM holds **zero** input fields.
- The fields only mount after clicking a "LET'S GO" button.
- The page itself says "Takes about 60 seconds to fill out."

So `formscan2.py` does three things instead of guessing paths:

1. follows the site's own CTA links rather than trying a fixed path list
2. counts fields inside iframes as well as the main frame
3. when a page advertises a fill-in flow but shows no fields, it clicks the
   obvious start button and counts again

Validated against the three sites that burned us: 4abetterview.com (form
found), windowsguttersetc.com (38 fields on /instant-quotes/), and
castlecleanandseal.com (form found behind the wizard button).

## Pipeline

    sitemap_all.py      sitemap crawl, all domains (curl, threaded)
    formscan2.py        browser scan: form truth, real title, real H1
    enrich.py           browser scan: services, founding year, address, page text
    resolve_city.py     work out the prospect's town from the page text
    townindex.py        build the same-trade competitor town-page index
    gen_v3.py           write the three emails from verified facts only
    run_gen.py          run the generator over every lead, then QA sweep
    add_to_campaign.py  push newly approved leads, prune ones no longer approved
    refresh_queued.py   update copy on queued leads, never on contacted ones
    retry_blocked.py    patient second pass at bot-challenged sites

`city_overrides.json` holds towns confirmed by hand, with the evidence for each.
It takes priority over the resolver, because the resolver rebuilds from scratch
on every run and would otherwise lose them.

## What the generator refuses to do

Every one of these was a real defect caught by reading the output, not by a
regex sweep:

- no claim about a form unless the scan proved there is none
- no "no headline on the page", no page-title talk, nothing from the technical
  side. A roofer does not care. Every email leads on the town search, insurance
  and storm work, or a commercial low-slope job
- no hail framing outside hail states. Riverside, California does not get hail
- no criticising a town page they already have
- no town name that fails validation. "Book Now", "Contact Us", "Scroll",
  "Storm Damage", "Has Served" and "Bill Lives In Danville" all reached the
  candidate list before the filters went in
- no bare "Louis" or "Petersburg"; those are always St. something
- no single-word read-back, and no material read back on one stray mention
- no acronym written as "Epdm" or "Tpo". In the trade they are EPDM and TPO
- no page count stated twice, no paragraph or sentence repeated between
  email 1, 2 and 3, no distinctive phrase used twice in one email
- no franchise or national brand

## Running it

    python3 sitemap_all.py
    python3 formscan2.py domains.txt scan_all.jsonl 6
    python3 enrich.py
    python3 resolve_city.py
    python3 townindex.py
    python3 run_gen.py          # writes rebuilt.json and dropped.json, then QA
    python3 add_to_campaign.py

Read the towns by eye before every send. That check caught something every
single time it was run.
