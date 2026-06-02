# Design Tokens - Landscaping Niche
Human-readable reference for the values in `niche-design-tokens.json`.

---

## Color palette

| CSS variable | Hex | Tailwind usage | When to use |
|---|---|---|---|
| `--primary` | #2D5016 | `bg-[rgb(var(--primary))]` | Main buttons, nav active state, headings on light background |
| `--primary-dark` | #1A3009 | `bg-[rgb(var(--primary-dark))]` | Hover state for primary buttons, footer background |
| `--primary-slate` | #3D6B2A | `border-[rgb(var(--primary-slate))]` | Borders, dividers, section accents |
| `--accent` | #8B9E3A | `bg-[rgb(var(--accent))]` | Secondary buttons, tag fills, icon fills |
| `--accent-light` | #B5C76A | `bg-[rgb(var(--accent-light))]` | Hover tints on accent elements |
| `--accent-dark` | #6B7A2B | `bg-[rgb(var(--accent-dark))]` | Hover state for accent buttons |
| `--neutral` | #F7F5F0 | `bg-[rgb(var(--neutral))]` | Section backgrounds, card surfaces |
| `--neutral-dim` | #EDE9E2 | `bg-[rgb(var(--neutral-dim))]` | Alternate section backgrounds, input fills |
| `--silver` | #C5BFB5 | `border-[rgb(var(--silver))]` | Borders, dividers, muted labels |
| `--ink` | #1A1A1A | `text-[rgb(var(--ink))]` | All body copy, headings on light backgrounds |

### Alpha usage
All colors are stored as RGB triplets to enable Tailwind's opacity modifier syntax:
- `text-[rgb(var(--ink))/70]` for 70% opacity body text
- `bg-[rgb(var(--primary))/10]` for 10% primary tint backgrounds

---

## Typography

| Use | Family | Weight | Notes |
|---|---|---|---|
| Headings (H1-H3) | Playfair Display | 700 | Loaded via Google Fonts |
| Body, UI, labels | Inter | 400, 500, 600 | System fallback: ui-sans-serif |

Heading scale: 1.25 (Major Third)
- H1: ~48px desktop, ~36px mobile
- H2: ~38px desktop, ~30px mobile
- H3: ~30px desktop, ~24px mobile
- Body: 16px, line-height 1.6

Font load URL:
`https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap`

---

## Spacing

Base unit: 4px (Tailwind default)

Section padding: `py-16` (64px) mobile, `sm:py-20` (80px) desktop
Card padding: `p-6` (24px) desktop, `p-4` (16px) mobile
Gap between cards: `gap-6` (24px)
Max content width: `max-w-6xl` (1152px) for most sections

---

## Shape

Border radius: `rounded-lg` (8px) cards, `rounded-xl` (12px) feature cards, `rounded-full` for badges and avatars
No sharp geometric decorations. No aggressive diagonal cuts.

---

## Motion

Duration: 240ms
Stagger: 60ms between list items
Easing: cubic-bezier(0.16, 1, 0.3, 1) (spring-like ease-out)
Prefers-reduced-motion: collapses all transitions to 0.01ms (see index.css)

---

## Dark overlay for hero

Hero background image uses `bg-black/40` (rgba 0,0,0,0.4) overlay to keep white text readable without washing out the photo. Adjust up to `/50` if the hero photo is bright, down to `/30` if dark.
