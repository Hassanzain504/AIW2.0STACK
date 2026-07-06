# HG Capital demo site

A single-file static website that recreates the design language of a modern private equity firm homepage (reference: hgcapital.com). All copy, statistics, article titles, and brand names are original placeholder demo content. Fonts are free substitutes (Hanken Grotesk and IBM Plex Mono via Google Fonts, with system fallbacks).

## Run it

Open `index.html` in any browser. No build step, no dependencies.

## What is inside

- Loader screen with progress bar, then staggered hero line reveal
- Fixed header that switches from light-on-dark to dark-on-light on scroll, hides on scroll down, returns on scroll up
- Full-viewport hero with animated gradient blobs, grid overlay, and mouse parallax
- Marquee ticker strip
- Large intro statement, News and Insights card grid, dark stats section with count-up numbers, three alternating content modules, culture band, and full footer with demo subscribe form
- Scroll reveals driven by IntersectionObserver

## Motion system

Timings and easing curves were measured from the reference site's rendered CSS:

- Scroll reveals: opacity plus translateY(2rem), 1.5s, cubic-bezier(0.19, 1, 0.22, 1)
- Media reveals: scale 1.1 to 1, 1.2s, cubic-bezier(0.28, 0.35, 0.06, 0.99)
- Hover zooms: 0.8s, cubic-bezier(0.19, 1, 0.22, 1)
- Micro interactions: 0.15s to 0.2s, cubic-bezier(1, 0, 0, 1)

Reduced-motion preferences are respected.
