---
description: Research LinkedIn prospects in the student's own browser and draft connection notes and DMs. Never sends anything.
---

No gate. Works at any stage. Setup steps are in `research/linkedin/README.md`.

Uses the `linkedin-browser` MCP server from `.mcp.json` (Playwright, separate Chromium profile at `.browser-profiles/linkedin`). The student logs in to LinkedIn themselves in that window. Never type, request, or store their password.

## Hard rules (LinkedIn bans automated activity)

- Never click Connect, Follow, Send, Message send, Like, Comment, Endorse, or any button that acts on the student's behalf. Research and drafting only. The student sends everything by hand.
- Never fill the connection note or message box. Drafts go in the output file only.
- At most 25 profile views per run. Stop early if LinkedIn shows a CAPTCHA, a "restricted" notice, a security check, or a commercial use limit warning, and tell the student.
- Open profiles one at a time. Wait for each page to load before reading it. No scraping of search result pages beyond what is needed to pick profiles.
- If the student is not logged in, open linkedin.com/login, ask them to log in in the browser window, and wait.

## Steps

1. Ask the student, if not given: target niche and role (default: `stack-state.json.niche`, owner or founder), US state or city, and how many prospects (max 25).
2. Read `research/03-offer-pack.md` if it exists, for positioning and DM style. Otherwise ask for a one-line offer.
3. Navigate to LinkedIn people search with the filters, pick matching profiles, open each one, and note: name, headline, company, location, company website if shown, one specific detail worth mentioning (recent post, years in business, service area, hiring).
4. Skip profiles that are clearly not a fit (employees instead of owners, wrong niche, outside the US) and say why in the file.
5. For each fit, draft:
   - Connection note, under 280 characters, one specific detail, no pitch.
   - Follow-up DM for after they accept, 2 to 4 short sentences, one soft question, no links.
6. Write `research/linkedin/prospects-YYYY-MM-DD.md` with a table (name, profile URL, company, location, fit reason) and the drafts under each name.
7. Tell the student the file path and remind them: send by hand, 15 to 20 requests a day, about 100 a week at most.

Operator rules apply: no em-dashes, no emojis, no buzzwords, plain US English in drafts.
