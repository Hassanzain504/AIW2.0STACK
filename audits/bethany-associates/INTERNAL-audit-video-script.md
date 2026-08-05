# Bethany Associates, Internal Audit and Video Script

**Site:** https://bethanyassociates.com
**Business:** Exterior cleaning, window cleaning, pressure washing, gutter cleaning, Christmas lights
**Location:** 3001 S White Horse Pike, Hammonton, NJ 08037
**Platform:** WordPress 6.8.6, Elementor 3.21.8, All in One SEO 4.9.7.2, Cloudflare
**Audit date:** 5 August 2026
**Audited by:** live crawl of the homepage, contact page, 5 location pages, robots.txt, and all 8 sitemaps

This document is for you only. Do not send it to the client. Every number in here was measured, not guessed. The client-facing version is `CLIENT-website-review.md`.

---

## How to use this document

Findings are ordered by how much money they cost, not by how technical they are. Each one has:

- **What it is**, in plain words
- **Evidence**, the exact measurement so you can show it on screen
- **What it costs them**, the business consequence
- **On camera**, how to say it without sounding like a tech person
- **The fix**, so you know what you are selling

Recommended video structure is at the bottom.

---

## Scale of the problem, in one table

| Area | Finding | Severity |
|---|---|---|
| Lead capture | No form on the homepage. One form on the whole site, in a 210 KB third-party iframe, 12+ fields | Critical |
| Trust | Team page lists 9 people, zero photos. Zero mentions of insured or licensed on homepage | Critical |
| SEO | Roughly 539 near-duplicate location pages. Two measured at 96.6% identical | Critical |
| SEO | Three separate pages compete for the same "window cleaning Hammonton NJ" query | Critical |
| Speed | 561 KB of HTML, of which 405 KB is inline CSS in the head. 48 JS files. Around 1.25 MB page weight | Critical |
| Local SEO | Two phone numbers, two addresses, toll-free number used as the primary | High |
| Schema | Two conflicting business entities. No review rating markup despite a 4.9 shown on the page | High |
| Copy | Homepage title tag has no brand and no city. 8 identical "Learn More" buttons | High |

---

# SECTION 1: LEAD CAPTURE

This is where the money is. Lead with this.

## 1.1 There is no quote form on the homepage

**What it is**
The homepage has zero `<form>` elements. Not one. The only way to request a quote is to click a button, land on `/contact`, and fill in a form there.

**Evidence**
Parsed the homepage HTML for form elements. Result: `0`. The homepage has 691 visible words and 12 buttons, and not one of them captures a lead in place.

**What it costs them**
Every extra click between the visitor and the quote request loses people. A visitor who is ready to ask for a price has to click, wait for a new page to load, wait for a third-party iframe to load inside that page, and then start typing. Most drop out before they finish.

**On camera**
"I opened your homepage and scrolled the whole thing. There is no place to ask for a price. Every button sends me to another page first. Some of those people never make it."

**The fix**
A short form in the hero, above the fold. Name, phone, postcode. Three fields. Plus the same form repeated once more near the bottom.

---

## 1.2 The one form on the site is behind a third-party iframe

**What it is**
The `/contact` form is not part of the website. It is an iframe pulling from `api.leadconnectorhq.com/widget/form/1qqRMpe9g3DaodLWejLL`. That is GoHighLevel.

**Evidence**
- The `/contact` page HTML contains **zero form fields**. The form does not exist in the page source at all.
- It loads from an external domain. The iframe payload is **210 KB** and took **1.5 seconds** to respond on its own, before the parent page even finishes.
- The page says "Fill out your info and we'll be in touch shortly!" but if the iframe fails to load, the visitor sees that sentence with nothing underneath it.

**What it costs them**
Three separate problems. It is slow. It has no fallback if it fails. And iframe forms on mobile are notorious for height and scrolling problems, where the submit button ends up unreachable.

**On camera**
"Your contact form is not actually on your website. It is loaded in from another company's server. It weighs 210 kilobytes on its own. If that server is slow, your visitor sees the words 'fill out your info' with an empty box underneath."

**The fix**
Native form on the site. Keep the GoHighLevel integration on the back end via webhook if they want the leads in that CRM, but the form itself should be part of the page.

---

## 1.3 The form has 12+ fields, and asks for the wrong things

**What it is**
Field list pulled directly from the form:

| Field | Required |
|---|---|
| First Name | Yes |
| Last Name | Yes |
| Email | Yes |
| **Phone** | **No** |
| Which services (4 checkboxes) | Yes |
| Address search | No |
| Street Address | No |
| City | No |
| State | No |
| Country | No |
| Postal Code | No |
| Project notes (textarea) | No |
| Consent checkbox 1 (non-marketing SMS) | Yes |
| Consent checkbox 2 (marketing SMS) | No |

**What it costs them**
Two things stand out.

First, **phone is optional and email is required.** That is backwards for a home service business. A homeowner who wants their windows cleaned wants a phone call. Making email mandatory and phone optional means the highest-value contact detail is the one you might not get.

Second, the address is split into **five separate fields** plus a search box. On a phone, that is five taps and five keyboard sessions. Nobody needs city, state and country from a business that only serves South Jersey.

Then two blocks of SMS consent legal text sit at the bottom of the form. One is required. That is the last thing a visitor reads before deciding whether to submit.

**On camera**
"Your form asks for first name, last name, email, which services, street, city, state, country, postal code, and project notes. Then two blocks of legal text about text messages. And here is the part that matters: phone number is optional, email is required. A homeowner who wants their windows done wants you to ring them."

**The fix**
Three fields to start. Name, phone, postcode. Make phone required. Ask everything else on the call. If they want service type, use the four checkboxes, that is fine, but nothing else.

---

# SECTION 2: TRUST

## 2.1 The team page has 9 people and not a single photo

**What it is**
`/meet-the-team` lists nine people with names and job titles. President/CEO, VP Finance, Office Manager, Operations Manager, three sales people, an area supervisor. No photos. No bios. Just names and titles on a page.

**Evidence**
Fetched and read the page. Nine names, nine titles, zero images of people, zero bio text.

**What it costs them**
This is the single cheapest fix on the entire site with the biggest trust return. A homeowner is deciding whether to let a stranger put a ladder against their house and walk around their property. A page called "Meet the Team" that shows no faces does the opposite of what the name promises. It actually reads worse than having no page at all, because the visitor clicked expecting faces.

**On camera**
"You have a page called Meet the Team. I clicked it. Nine names, nine job titles, and not one photograph. Your customer is deciding whether to let a stranger onto their property. That page is the moment they decide, and right now it shows them nothing."

**The fix**
Nine headshots. Phone camera is fine. One sentence each. Owner first, at the top, with a line about how long they have been doing this.

---

## 2.2 The homepage never says insured or licensed

**What it is**
Searched the entire visible homepage text for trust words. Results:

| Word | Times it appears |
|---|---|
| insur | **0** |
| licens | **0** |
| bond | **0** |
| satisfaction | 0 |
| safety | 0 |
| background | 0 |
| guarant | 4 |
| certified | 1 |

**What it costs them**
This business works at height. Ladders, roofs, facades, gutters. The single loudest unasked question in a homeowner's head is "what happens if they fall, or if they break my window, or if they damage my siding." The homepage does not answer it once.

**On camera**
"I searched your homepage for the word 'insured'. It does not appear. Not once. Your crews work on ladders and roofs. That is the first thing a nervous homeowner wants to know, and your site never says it."

**The fix**
"Fully insured" in the header, near the phone number. A short trust row under the hero: years in business, insured, number of customers, rating. It is a one-line change with an outsized effect.

---

## 2.3 Testimonials use initials only

**What it is**
The homepage does show testimonials, which is good. But the attributions are "F.B., Current Client" and "G.W., Current Client".

**What it costs them**
Initials read as invented. A real first name, a real town, and ideally a photo of the actual job is what makes a review believable. "Sarah M., Haddonfield" beats "G.W." by a distance.

**On camera**
"You have real reviews on the page, which is more than most. But they are signed F.B. and G.W. Initials look made up, even when they are not. First name and town would fix that in an afternoon."

**The fix**
Go back to the reviewers for permission to use a first name and town. Pull live Google reviews in via a widget so they update themselves and visibly come from Google.

---

## 2.4 They display a 4.9 rating but Google cannot see it

Covered in detail in section 4.3. Mention it here on camera as a trust point and again later as an SEO point.

---

# SECTION 3: THE BIG SEO PROBLEM

This is the finding that separates you from every other person who has audited this site. Take your time on it.

## 3.1 There are roughly 539 near-duplicate location pages

**What it is**
The site publishes location pages from four separate WordPress custom post types:

| Sitemap | Page count | URL pattern |
|---|---|---|
| `page-sitemap.xml` | 38 | normal pages plus `/hammonton-nj/window-cleaning` style |
| `window_cleaning-sitemap.xml` | 61 | `/window-cleaning/{town}-nj` |
| `window_washing-sitemap.xml` | 60 | `/window-washing/{town}-nj` |
| `window_cleaning_nj-sitemap.xml` | **356** | `/window-cleaning-nj/{town}` |
| `christmas_lights-sitemap.xml` | 62 | `/christmas-lights/{town}-nj` |

That is **539 location pages** for a company operating out of one location in Hammonton.

**Evidence, and this is the number to put on screen**

I downloaded two of these pages and compared the visible text word by word:

```
/window-cleaning/hammonton-nj   vs   /window-cleaning-nj/mount-laurel
                                                  96.6% IDENTICAL

/window-cleaning/hammonton-nj   vs   /window-washing/hammonton-nj
                                                    71% IDENTICAL
```

Here is the opening line of each, side by side. Put this on screen.

> **/window-cleaning/hammonton-nj**
> "Are you looking for expert window cleaning in **Hammonton, NJ**? Bethany Associates provides trusted window cleaning services for residential and commercial properties. With over 25 years of experience, we help homes and businesses enjoy sparkling, streak-free windows with no stress and no mess."

> **/window-cleaning-nj/mount-laurel**
> "Are you looking for expert window cleaning in **Mount Laurel, NJ**? Bethany Associates provides trusted window cleaning services for residential and commercial properties. With over 25 years of experience, we help homes and businesses enjoy sparkling, streak-free windows with no stress and no mess."

Same sentence. Town name swapped. That is the entire difference across roughly 400 pages.

**What it costs them**
Google has a name for this and it is not a good one. Pages generated at scale with the location swapped and nothing else are treated as low-value. The effect is not neutral. It can drag down the pages that actually deserve to rank, because the whole site starts to look automated.

**On camera**
"You have around 539 location pages. I pulled two of them, one for Hammonton and one for Mount Laurel, and compared them word for word. They are 96.6% identical. The only real difference is the town name. Google is very good at spotting that, and it does not reward it."

**The fix**
Cut to the towns they actually serve. Twenty to thirty real pages. Each one with genuinely local content: a job they did in that town, a photo from that job, the specific housing stock, drive time from Hammonton. Everything else gets consolidated with 301 redirects.

---

## 3.2 Three of their own pages compete for the same search

**What it is**
For a homeowner searching "window cleaning Hammonton NJ", Bethany Associates has these pages live, each one telling Google it is the correct one:

| URL | Title tag | Canonical |
|---|---|---|
| `/window-cleaning/hammonton-nj` | Window Cleaning Hammonton, NJ - Bethany Associates | points to itself |
| `/window-washing/hammonton-nj` | Window Washing Hammonton, NJ - Bethany Associates | points to itself |
| `/hammonton-nj/window-cleaning` | Window Cleaning Service in Hammonton, NJ \| Schedule Now | points to itself |

Plus `/residential/window-cleaning` and `/window-cleaning-company-in-new-jersey` in the background.

**What it costs them**
Window cleaning and window washing are the same service. Two of these pages are the same thing with a synonym. All three self-canonicalise, which means each one says "I am the original, index me." Google has to pick. When a site gives three answers to the same question, the ranking strength splits three ways instead of stacking on one page.

**On camera**
"Search 'window cleaning Hammonton'. You have three separate pages on your own site fighting each other for that. Two of them are the same service with a different word. You are competing against yourself, and every one of those three is weaker than one strong page would be."

**The fix**
One page per service per town. Pick the strongest URL, 301 the others into it, merge the best content. The window washing set is the easiest call, it is a pure synonym duplicate of window cleaning.

---

## 3.3 They publish pages for towns they do not serve

**What it is**
The 356-page `window_cleaning_nj` set covers the whole state. Sample of what is in there: Morristown, Mahwah, Montvale, Lodi, Leonia, Little Ferry, Lake Hopatcong, Midland Park.

Those are North Jersey. Hammonton is South Jersey. That is a 100-plus mile drive.

There is also `/window-cleaning-nj/lower-makefield`. Lower Makefield is in **Pennsylvania**, filed under a New Jersey post type.

**What it costs them**
Two ways this hurts. Google's local ranking works on proximity and relevance, and a Hammonton business claiming Mahwah looks wrong. And on the rare occasion one of those pages does get a visitor, that visitor is 100 miles outside the service area, so the lead is worthless and the bounce is instant.

**On camera**
"You have a page for window cleaning in Mahwah. That is a two hour drive from your office. You also have one for Lower Makefield, which is in Pennsylvania, filed under your New Jersey pages. These are not bringing you customers, and they are telling Google you are less local than you are."

**The fix**
Cut them. Keep the genuine service radius. 301 the rest to the nearest real service area page.

---

# SECTION 4: TECHNICAL SEO

## 4.1 The homepage title tag has no business name and no city

**What it is**

```
Actual title tag:
  "Exterior Cleaning & Pressure Washing | Professional Services"

Their own og:title on the same page:
  "Exterior Cleaning & Pressure Washing Experts in New Jersey | Bethany Associates"
```

**What it costs them**
The title tag is the blue clickable line in Google. Theirs contains no brand and no location. "Professional Services" is filler that does no work at all. What makes this worse is that the better version already exists on the page as the social sharing title, so somebody wrote it and then it was not used where it counts.

**On camera**
"This is the line Google shows people. Yours says 'Exterior Cleaning and Pressure Washing, Professional Services'. Your name is not in it. Hammonton is not in it. New Jersey is not in it. And the strange part is you already have a better version written into the page, it is just being used for Facebook instead of Google."

**The fix**
`Window Cleaning & Pressure Washing in Hammonton, NJ | Bethany Associates`

---

## 4.2 The two business entity blocks contradict each other

**What it is**
The homepage carries three JSON-LD blocks. Two of them describe the business, and they disagree.

| | Block A (All in One SEO) | Block B (manual) |
|---|---|---|
| Type | `Organization` | `LocalBusiness`, `ProfessionalService` |
| Name | Bethany Associates Exterior Cleaning Specialists | Bethany Associates |
| Address | **missing** | 3001 S White Horse Pike, Hammonton NJ |
| Geo coordinates | **missing** | present |
| Opening hours | **missing** | Mon-Fri 08:00-16:30 |
| Phone | +18886014257 | 888-601-4257 |
| Linked to each other | **no** | **no** |

**What it costs them**
Google reads both and sees two businesses with different names, one of which has no address. They are not connected by a shared `@id`, so nothing tells Google they are the same company. For a local business, the entity data is what feeds the map pack. Handing over two conflicting versions is worse than handing over one clean one.

**On camera**
"There are two blocks of business information buried in your code, and they do not match. Different name, and one of them has no address at all. Google reads both. You want it reading one clean answer, not two that disagree."

**The fix**
One `LocalBusiness` block. Delete the duplicate. Full NAP, geo, hours, real image.

---

## 4.3 They show a 4.9 rating but there is no review markup

**What it is**
The homepage displays "4.9" and "Over 15,000 Satisfied Customers", with links out to Facebook, Google and Angi reviews. There is **no `AggregateRating` and no `Review` schema anywhere on the site.**

**What it costs them**
This is free money left on the table. Star ratings in Google search results lift click-through rate noticeably. This business has earned a 4.9 across thousands of customers and cannot show a single star in search, because the data is on the page as a picture and not as markup.

**On camera**
"You have a 4.9 rating from 15,000 customers. That is genuinely hard to earn. But it is sitting on your page as a graphic. Google cannot read it. That is why you have no stars next to your listing when someone searches for you, and your competitors do."

**The fix**
`AggregateRating` in the LocalBusiness schema, backed by real reviews with `Review` markup. Rating value, review count, both matching what is actually on the page.

---

## 4.4 Smaller technical items, all confirmed

| Item | Finding | Why it matters |
|---|---|---|
| Canonical | `https://bethanyassociates.com` with no trailing slash, page URL has one | Small inconsistency, easy fix |
| og:type | `article` on the homepage | Should be `website` |
| og:image | The logo at **138x110 px** | Needs 1200x630. Every social share of this site looks broken |
| Schema image | Also the 138x110 logo, in both blocks | Google needs 1200px+ images for rich results. A logo will not qualify |
| Service schema | **None on any service page** | No service markup anywhere on a services business |
| Alt text | 1 homepage image missing alt | Minor, but it is there |
| Heading structure | **21 H2s** on the homepage, used as styling | H2 "4.9", H2 "888-601-4257", H2 "Professional", H2 "Caring", H2 "Thorough". These are design labels wearing heading tags |
| Elementor | 3.21.8, released 2024 | Behind on updates, which is a security point as much as a speed one |
| Redirects | http to https and www to non-www both 301 correctly | This one is fine, say so |

---

# SECTION 5: SPEED

## 5.1 405 KB of CSS is pasted into the top of every page

**What it is**

```
Total homepage HTML         561 KB
Of which, the <head>        419 KB
Of which, inline CSS        405 KB  in 10 separate <style> blocks
External stylesheets            0
JavaScript files               48   including jQuery at 85 KB
Total images                  604 KB
Rough page weight            1.25 MB
Actual visible words on page   691
```

**What it costs them**
The browser cannot draw anything until it has read the head. Their head is 419 KB. So every single visitor, on every single page, waits while 405 KB of styling is parsed before one pixel appears. And because it is inline rather than a separate file, the browser cannot cache it. The visitor downloads all 405 KB again on the next page.

That last line in the table is the one to sit on. **1.25 megabytes to deliver 691 words.**

**On camera**
"Your homepage is about 1.25 megabytes. The words on it, all of them, would fit on two sides of A4. Most of that weight is 405 kilobytes of styling code pasted into the top of the page. Your visitor's phone has to read all of it before it can show them anything. And because it is pasted in rather than saved as a file, they download it again on the next page, and the page after that."

**The fix**
Elementor is already configured for external CSS in its settings but is not delivering it. Turn on proper CSS file output, purge unused CSS, cut the plugin count. Realistically this is a rebuild conversation, and that is the honest answer.

---

## 5.2 Photographs saved in the wrong format

**What it is**

| File | Size | Served as |
|---|---|---|
| `Stucco-Side-Before-copy.png` | **104.5 KB** | image/png |
| `Stucco-Side-After-copy.png` | **95.3 KB** | image/png |
| `Rust_Reduction_Contrast-1-copy.webp` | 78.1 KB | image/jpeg |
| `Rust_Stain_before-copy.webp` | 68.0 KB | image/jpeg |
| `3-Guys-2.webp` | 59.6 KB | image/png |
| `Pat-Window-Blue-Sky.png` | 59.0 KB | image/png |

**What it costs them**
PNG is for logos and graphics with flat colour. For photographs it produces files several times larger than they need to be. Their before and after shots, which are the most persuasive images on the whole site, are the two heaviest files on the page.

Note the mismatch too. Files named `.webp` are being served as `image/png` and `image/jpeg`. The image pipeline is not actually converting anything, it is just renaming.

**On camera**
"Your before and after photos are the best selling tool you have. They are also the two heaviest files on your homepage, about 200 kilobytes for the pair, because they were saved in the wrong format. Converted properly those are maybe 40 kilobytes together, and they would look the same."

**The fix**
Real WebP conversion with JPEG fallback. Correct sizing. That alone takes a meaningful chunk off the page.

---

## 5.3 Layout shift and LCP

**What it is**
- The hero image `Pat-Window-Blue-Sky.png` has **no width or height attributes.** Neither do several others.
- No `fetchpriority="high"` on the main hero image.
- Cloudflare returns `cf-cache-status: BYPASS` on the HTML, so the page is not cached at the edge.

**What it costs them**
No dimensions means the browser does not know how much space to reserve. Content jumps around as images load. On a phone, that is the effect where you go to tap something and the page moves and you tap the wrong thing. Google measures it directly and it is a ranking factor.

**On camera**
"Load this on your phone and watch the page jump as the pictures come in. That happens because the code does not tell the browser how big the images are, so it guesses, then corrects itself. Google measures that jumping and it counts against you."

**The fix**
Width and height on every image, `fetchpriority="high"` on the hero, edge caching for the HTML.

---

# SECTION 6: LOCAL SEO AND NAP

## 6.1 Two phone numbers, and the wrong one is primary

**What it is**

| Where | Number |
|---|---|
| Header, sitewide | 888-601-4257 (toll-free) |
| Schema markup | 888-601-4257 |
| Homepage | 888-601-4257 only |
| Contact page, "office" | **609-561-3353 (local)** |
| Contact page, "scheduling" | 888-601-4257 |

**What it costs them**
Two problems in one.

The local 609 number is the Hammonton area code. Homeowners in South Jersey recognise it as local. A toll-free 888 number reads as a call centre, and for a family-feeling local trade business that quietly costs trust. It also weakens the consistency signal Google uses to tie the website to the Google Business Profile.

And having two numbers at all means whichever one is not in their Google Business Profile is now a NAP inconsistency across every directory they are listed on.

**On camera**
"You have a local Hammonton number, 609-561-3353. It appears once, on your contact page, labelled 'office'. Everywhere else you show an 888 number. People in South Jersey trust the 609. The 888 sounds like a call centre in another state."

**The fix**
Pick one number. Recommend the 609 as the public-facing one everywhere, with the 888 kept for existing customers if they need it. Then match it across the site, the schema, and every directory listing.

---

## 6.2 Two different addresses

**What it is**

| Where | Address |
|---|---|
| Schema markup | 3001 S White Horse Pike, Hammonton, NJ 08037 |
| Google Maps embed on contact page | 3001 S White Horse Pike |
| **Footer and contact page text** | **PO Box 986, Hammonton, NJ 08037** |

**What it costs them**
A PO Box is not a business location. Google Business Profile does not accept one. The visible address on the site is the PO Box while the structured data says the real street address, so the human sees one thing and the machine reads another. That is exactly the inconsistency that holds a business back in the map pack.

**On camera**
"Your footer shows a PO Box. Your code shows 3001 South White Horse Pike. Your map shows the White Horse Pike address. Google cross-checks all of that against your Business Profile, and right now it does not line up."

**The fix**
Street address everywhere, visible in the footer and on the contact page, matching schema and Google Business Profile exactly.

---

## 6.3 Business hours say closed all weekend

**What it is**
Schema: Monday to Friday, 08:00 to 16:30. No Saturday, no Sunday. And the hours are only in the code, they are not shown on the contact page at all.

**What it costs them**
Homeowners are at home on the weekend. That is when they look at their windows and decide to do something about it. If the hours say closed and there is no form on the homepage, a Saturday visitor has no route in at all.

**On camera**
"Your hours say Monday to Friday, closing at half four. Your customer is at work then. They are home on Saturday morning looking at their dirty windows. And on Saturday morning your site gives them a phone number to an office that is shut and no form to fill in."

**The fix**
Show the hours on the contact page. Add a line saying quote requests are answered on weekends even if the office is closed. And put the form on the homepage, which fixes this and 1.1 at the same time.

---

# SECTION 7: COPY AND MESSAGING

## 7.1 Eight buttons that all say "Learn More"

Pulled from the homepage: `Get Started Today`, then `Learn More` eight times, then `see more work`, `Contact Us here`, `Schedule`.

"Learn More" asks for nothing and promises nothing. Replace with the actual outcome: "See window cleaning prices", "Get my free quote", "See this month's availability".

## 7.2 The H1 does no selling

`Exterior Cleaning Specialists in New Jersey`

No town, no benefit, no offer, no reason to keep reading. Compare with something like "Streak-free windows in Hammonton, cleaned by an insured local crew. Free quote in 24 hours."

## 7.3 No pricing anywhere

Searched the homepage for any currency figure. Zero. Not one "from $X". Homeowners hesitate hardest on unknown cost. A starting price filters out tyre-kickers and gives serious buyers confidence to enquire.

## 7.4 The homepage is thin

691 visible words. For a business with five service lines, 25 years of history and 15,000 customers, that is not much to work with, and it gives Google very little to rank.

---

# RECOMMENDED VIDEO STRUCTURE

Keep it to 8 to 12 minutes. Screen recording with your voice. Do not use the word "audit" on camera, it sounds like an accountant.

**0:00 to 0:30, open on their strength**
Say the true thing first. 25 years, 4.9 rating, 15,000 customers, real testimonials on the page. Then: "Which is why what I am about to show you is frustrating."

**0:30 to 2:30, the form problem**
Scroll the homepage live, all the way down. Point out there is nowhere to ask for a price. Click through to contact. Show the 12-field form. Land hard on phone being optional while email is required.

**2:30 to 4:00, trust**
Open Meet the Team. Nine names, no faces. Then the search for "insured" on the homepage returning nothing.

**4:00 to 6:30, the duplicate pages. This is your centrepiece.**
Show the sitemap. Show the counts, 61 and 60 and 356. Then put the Hammonton page and the Mount Laurel page side by side and read both opening lines out loud. Then say 96.6%. Then show the three pages competing for the same Hammonton search.

**6:30 to 8:00, speed**
Show the 1.25 MB against the 691 words. Load it on a phone and let them watch the page jump.

**8:00 to 9:00, the local details**
The two phone numbers. The two addresses. The 4.9 that Google cannot see.

**9:00 to 10:00, close**
Do not pitch a price. Say: "There are about twenty things on this list. Four of them are costing you money every week. I have written them up in order. Want me to send it over?"

---

# RULES FOR THE VIDEO

- Never say the site is bad. Say it is costing them money. Those are different sentences and they land completely differently.
- Show, do not describe. Every claim in this document has a thing you can put on screen. Use it.
- Say the numbers out loud. 96.6%. 539 pages. 405 kilobytes. 1.25 megabytes. Nine names, zero photos. Numbers are what make it real.
- Do not use the words canonical, schema, LCP, CLS, or cannibalisation on camera. Every one of those has a plain English version in this document. Use those.
- Credit what is good. The redirects are set up correctly. They have real testimonials. They have a 4.9. Saying so makes the criticism believable.
- End on a question, not an offer.

---

# WHAT TO SELL, IN ORDER

If they say yes, this is the order of work by return on effort.

| Priority | Job | Effort | Return |
|---|---|---|---|
| 1 | Three-field form in the hero, phone required | Low | Highest |
| 2 | Team photos and "fully insured" on the homepage | Low | High |
| 3 | Fix the title tag and merge the schema | Low | Medium |
| 4 | Consolidate the duplicate location pages with 301s | High | Highest, over time |
| 5 | One phone number, one address, everywhere | Low | High for local |
| 6 | Add review markup for the 4.9 | Low | Medium |
| 7 | Image formats and dimensions | Medium | Medium |
| 8 | The 405 KB CSS problem | High | High, but this is a rebuild |

Items 1, 2, 3 and 5 are all low effort and cover most of the immediate revenue. That is your foot in the door. Item 8 is where the rebuild conversation lives.

---

# EVIDENCE APPENDIX

Everything above was measured on 5 August 2026 from these sources:

- `https://bethanyassociates.com/` homepage HTML, 574,901 bytes
- `https://bethanyassociates.com/contact`
- `https://bethanyassociates.com/meet-the-team`
- `https://bethanyassociates.com/window-cleaning/hammonton-nj`
- `https://bethanyassociates.com/window-washing/hammonton-nj`
- `https://bethanyassociates.com/hammonton-nj/window-cleaning`
- `https://bethanyassociates.com/window-cleaning-nj/mount-laurel`
- `https://bethanyassociates.com/residential/window-cleaning`
- `https://bethanyassociates.com/robots.txt`
- All 8 XML sitemaps
- `https://api.leadconnectorhq.com/widget/form/1qqRMpe9g3DaodLWejLL`

Similarity percentages were calculated by stripping all HTML, script and style content, then comparing the remaining visible words with a sequence matcher. Page weights are from HTTP content-length headers.

One caveat to hold in mind. This is an outside-in audit. There is no access to their analytics, their Google Search Console, or their Google Business Profile. So the findings are all facts about the site itself, which is solid ground, but any revenue figure you quote is an estimate built on assumed traffic. Always say "estimate" out loud. If they push back on a number and you have already called it an estimate, you keep your credibility.
