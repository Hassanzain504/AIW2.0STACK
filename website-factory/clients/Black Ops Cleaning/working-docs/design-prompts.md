# Claude Design prompts, Black Ops Cleaning

Everything this session settled, compressed into something you can paste.

## Which pages to use this for

| Pages | Component exists | Use Claude Design |
|---|---|---|
| 13 service, 17 town, 19 service x town | Yes, `references/page-patterns/` | **No** |
| Home, About, Contact, Government Contracting, Reviews, Our Work, Careers, Legal | **No** | **Yes** |

Forty nine of the fifty seven pages build from React components with JSON
schemas. `build-from-template.py` reads those, not a design. A prettier
version of a service page is a fork the build ignores.

The other eight have no component at all. That is where a visual pass is
worth doing, and Home matters most because it is the page everyone sees.

---

## Block A, paste this first, every time

```
You are designing one page for Black Ops Cleaning, a veteran owned
commercial and biohazard cleaning company at 121 Talbott St, Rockville,
MD 20852. Phone (301) 000 0000 is a placeholder.

THREE READERS, ONE PAGE
A facility manager comparing three janitorial firms. A family who found
the site at 2am after a death. A federal buyer checking the company is
real. None should have to scroll past the other two.

WHAT THE NAME MEANS
Black Ops means discretion, not combat. It is already in the copy:
unmarked vehicles, no signage on site, neighbours see a plain van,
technicians change on site. Do not design tactical, camouflage, military
gear or night vision green. The hoarding and trauma pages are read by
people in distress and a tactical look makes them feel judged.

PALETTE, use exactly these
  primary        #16181A   field black
  primary_dark   #0B0D0E
  primary_slate  #4A4F55   secondary text on light
  accent         #A8792C   brass, the primary button
  accent_light   #C89A45   brass on black
  accent_dark    #7E5A1D   brass as text on light
  neutral        #F4F3EF   the page ground, most of the site
  neutral_dim    #E4E1D9
  silver         #EDEBE5   card and form fills
  ink            #101214   body text

Two rules that are not taste:
  1. Black is punctuation, not the ground. Header, footer, one or two
     bands. The page itself stays warm off-white.
  2. Brass is a desaturated metal, never a glow. No gradients on it.
All twelve contrast pairings pass WCAG AA. Do not change the values.

TYPE
Barlow Condensed for headings, uppercase, bold. Barlow for body. IBM Plex
Mono only where it carries actual codes. This is a local contractor, not
a fashion brand: do not reach for an editorial serif, it reads premium
and it is the wrong signal.

THE SPEC STRIP, use instead of proof pills
A row of four label and value pairs, identical on every page:
  Based in  Rockville MD 20852
  UEI       PMPPFTB7CCX4
  NAICS     561720
  Licence   [empty, mark it visibly]
Label in plain words, value in mono. Never a row of rounded tags joined
by middots. No competitor in this market publishes a UEI anywhere, so
this is the strongest single element on the page.

CONVERSION FLOOR, this is a high converting local service site
  - Quote form above the fold, four fields maximum on a first ask
  - Two CTAs reachable above the fold, form and tel link
  - Phone visible in the utility bar, the nav, and the hero
  - Trust strip under the hero, each credential with room for its number
  - A second conversion point mid page and a third at the close
  - Sticky call and quote bar on mobile
  - Emergency pages lead on the phone. Contract pages lead on the form.

HONESTY RULES, these are hard
  - No stock photography, ever. Draw photograph slots and label them.
  - Zero reviews exist on every platform. Leave review blocks empty and
    marked. Never invent a rating, a count or a testimonial.
  - Veteran owned, never SDVOSB, never VOSB, never certified veteran
    owned. Those are certifications the company does not hold.
  - No published prices. Replace with a free assessment and a written
    price before work starts.
  - The phone is answered 24 hours and the on site window is two hours.
    State them as two separate claims. Never "24/7 crews standing by".

WRITING
No em-dashes. No emoji. Plain words, short sentences, one idea each. No
buzzwords: no leverage, seamless, robust, game-changer, cutting-edge.

AVOID, these read as AI generated
  - Middot joined meta strings
  - Identical rounded cards with one shadow on everything
  - Generic line icons: shield, clock, tick in circles
  - Tracked out all caps eyebrow labels above every heading
  - Everything centered, gradient washes, glassmorphism
  - Fade and slide up on every section, hover transitions on every card
  - Numbered markers 01 02 03 where the content is not a real sequence
```

---

## Block B, the Home page

Paste Block A, then this.

```
Design the HOME page. URL /. Target 1,200 to 1,800 words.

Its job is to ROUTE, not to sell. The services grid is the fork in the
road: everything above it is common ground, everything below is
reassurance for whoever did not click.

Home does NOT target "commercial cleaning Rockville MD". That belongs to
the service page and the two currently compete on the live site, which
is one of the audit faults. Home targets the company.

H1: Commercial and Biohazard Cleaning in Montgomery County
Subhead: Veteran owned, based in Rockville, and the phone is answered any
hour. From nightly office janitorial to biohazard and trauma cleanup,
handled in house by the same company. Our vehicles carry no signage.

Sections in this order:
  1  Utility bar. Phone, 24 hour line, service region.
  2  Nav. Logo, links, phone, quote button.
  3  Hero. H1, subhead, four field form, tel link, photograph slot.
  4  Spec strip.
  5  Trust bar. Veteran owned, GBAC trained, ISSA member, insured,
     licence, SAM.gov registered. Each with room for its number.
  6  Services grid. Two columns of equal visual weight:
     Commercial and recurring: janitorial, medical facility, government
     facility, disinfection.
     Specialty and emergency: biohazard remediation, crime scene and
     trauma, unattended death, sewage backup, hoarding, 24/7 emergency.
     Specialty must NOT be buried. It is the highest margin work and it
     is currently a bullet point on the live site.
  7  Reviews. Build it, leave it empty, mark it.
  8  Why Black Ops. Five checkable things, not adjectives.
  9  How it works. Split: commercial walkthrough path, emergency path.
 10  Service area. Named towns, not a radius: Rockville, North Bethesda,
     Bethesda, Gaithersburg, Potomac, Kensington, Derwood, Wheaton,
     Silver Spring.
 11  Recent work. Photograph slots, marked.
 12  Meet the team. Amilcar Ayala, owner. Photograph slot.
 13  FAQ, ten questions.
 14  Closing CTA with the form again.
 15  Footer. Name, address, phone identical to the Google listing.

An emergency route must sit above the form, visually distinct: "If this
is an emergency, call. Do not use this form." Someone arriving at 2am
should never meet a form.
```

---

## Block C, Government Contracting

Paste Block A, then this. This is the uncontested one.

```
Design /government-contracting/. Target 1,100 to 1,500 words.

This is the company's procurement dossier, NOT a service page. The
service page answers "can you clean my federal building". This page
answers "are you a company I can put on a contract". If a block would
make sense on the service page, it does not belong here.

Not one cleaning site in this market has this page. A contracting
officer searches for exactly this.

H1: Government Contracting with Black Ops Cleaning

Sections:
  1  Banner with the spec strip.
  2  Capability statement, on the page as a table, not only as a PDF.
     Legal name, UEI, CAGE [slot], primary NAICS 561720, secondary NAICS
     [slot], business size small, socioeconomic status veteran owned,
     SAM.gov active, insurance [slot], bonding [slot], place of
     performance, point of contact [slot].
  3  How to actually contract with us. Purchase card, simplified
     acquisition, full solicitations, subcontracting to a prime.
     Print NO dollar thresholds. They are inflation adjusted and a stale
     figure here costs credibility in one glance.
  4  Past performance. [Slot, and it must be answered honestly.
     Contracting officers verify it.]
  5  Capability statement PDF download. No email gate.
  6  Contracting line. A named person and a direct number, not the
     general form. Primes do not fill in contact forms.
  7  FAQ, eight questions.
```

---

## What to hand back

Whatever Claude Design produces for these eight pages is a **visual
direction**, not a build artifact. To ship it, the layout has to become a
React component with a JSON schema, the same shape as
`references/page-patterns/`. Keep the design and the data separate, as
those two patterns do: no client strings and no literal hex in the
component.

## Still blocking, and no design fixes them

1. Four photograph slots. Awwwards business service winners are carried
   by photography and this client has supplied none.
2. The 24 hour decision. It sets the hours on all 41 citation listings
   and decides whether the emergency page exists at all.
3. Whether the client signed. The proposal was valid to 23 September 2026.
