# BacLang — Design System (MVP)

## Brand principles

1. **Exam hall, not playground** — Calm, authoritative, uncluttered.
2. **Paper and ink** — Warm neutrals + deep blue; gold/bronze accent for “mark” moments.
3. **Score is the hero** — The /20 result gets the strongest visual weight on result screens.

## Tokens (CSS variables)

Defined in `src/app/globals.css` under `:root`.

| Token | Role |
|-------|------|
| `--font-sans` | Body UI, forms |
| `--font-display` | Headlines, marketing H1–H2 |
| `--ink` | Primary text |
| `--muted` | Secondary text |
| `--primary` / `--primary-strong` | CTAs, key links |
| `--accent` / `--accent-soft` | Highlights, eyebrow labels, score emphasis |
| `--success` | Positive states, streaks |
| `--danger` | Errors |
| `--surface` | Cards |
| `--line` | Borders |
| `--radius-xl` / `--lg` / `--md` / `--sm` | Corners |
| `--shadow-lg` / `--shadow-md` | Elevation |
| `--max-width` | Content width (~1180px) |

## Typography

- **Marketing headlines:** `font-family: var(--font-display)` (serif = authority).
- **App UI:** `var(--font-sans)` for readability.
- **Scale (approx):** eyebrow `0.78rem` uppercase tracked; H1 `clamp(2.2rem, 7vw, 4rem)`; body `1rem` / line-height 1.6.

## Components

- **Primary button:** Pill shape, gradient primary, shadow.
- **Secondary:** White fill, primary border.
- **Cards:** `--radius-lg`, `--surface`, subtle border.
- **Pills:** Rounded full, accent or success tint for status.

## Motion

- Transitions **180ms ease** on hovers; no flashy animation on core study flows.
- Optional: score reveal count-up on result panel (future).

## Accessibility

- Maintain contrast for `--ink` on `--bg-soft`.
- Focus rings on inputs (see `globals.css` focus styles).
- Semantic landmarks: `header`, `main`, `nav[aria-label]`, `footer`.

## Content voice

- Short sentences. **Encouraging but examiner-fair.**
- Avoid slang in product copy; students can use informal tone in their essays.
