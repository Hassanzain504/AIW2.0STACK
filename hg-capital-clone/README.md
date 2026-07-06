# HG Capital demo site

A single-file static website that recreates the design language of a modern private equity firm homepage (reference: hgcapital.com). All copy, statistics, article titles, and brand names are original placeholder demo content. Fonts are free substitutes (Hanken Grotesk and IBM Plex Mono via Google Fonts, with system fallbacks).

## Run it

Open `index.html` in any browser. No build step, no dependencies.

## What is inside

The page mirrors the reference homepage section by section:

- Loader screen, then staggered hero line reveal
- Fixed header that switches from light-on-dark to dark-on-light on scroll, hides on scroll down, returns on scroll up
- Full-viewport hero with animated gradient background, mouse parallax, small brand line, and a frosted subscribe pill bottom right
- News and Insights strip: header cell inline with three cards, image wipe reveals, tag pills over the images
- Dark stats section: intro column left, three count-up stat items right
- Four full-bleed video-style sections with numbered kickers and small play cards
- Footer with newsletter banner, dot-matrix decorations, link columns, scroll-to-top, and copyright row
- Custom cursor dot that eases after the mouse and grows over interactive elements
- Scroll reveals driven by IntersectionObserver

## Motion system

Timings and easing curves were measured from the reference site's rendered CSS:

- Scroll reveals: opacity plus translateY(2rem), 1.5s, cubic-bezier(0.19, 1, 0.22, 1)
- Media reveals: scale 1.1 to 1, 1.2s, cubic-bezier(0.28, 0.35, 0.06, 0.99)
- Hover zooms: 0.8s, cubic-bezier(0.19, 1, 0.22, 1)
- Micro interactions: 0.15s to 0.2s, cubic-bezier(1, 0, 0, 1)

Reduced-motion preferences are respected.
