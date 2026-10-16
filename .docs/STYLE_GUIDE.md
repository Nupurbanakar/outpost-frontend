# Outpost Design System

Style guide extracted from Figma/Replit designs for the T-Hub Founders platform.

> This combines elements from two design exports. The primary design follows the "field-notes editorial" aesthetic from Founder-Compass.

---

## Design Philosophy

- **Editorial, not app-like** — Feels like a curated publication, not a dashboard
- **Warm, not cold** — Cream papers, gold accents, handcrafted feel
- **Calm, not busy** — Generous whitespace, clear hierarchy
- **Trustworthy** — Professional typography, subtle details

---

## Colors

### Base Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Ink (Primary Text) | `#202c3d` | `--ink` | Headings, body text, buttons |
| Paper | `#f7f4ec` | `--paper` | Page backgrounds |
| Paper Light | `#fbf9f3` | `--paper-light` | Cards, inputs, elevated surfaces |
| Line | `#ded7ca` | `--line` | Borders, dividers |
| Gold | `#d69b42` | `--gold` | Primary accent, CTAs |
| Green | `#467c68` | `--green` | Success, challenges category |
| Rose | `#b86a64` | `--rose` | Mentors category, warnings |

### Extended Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Gold Dark | `#94651f` | Gold text on light backgrounds |
| Gold Hover | `#a56f28` | Hover states |
| Gold Light | `#f2e5cc` | Gold badge backgrounds |
| Green Light | `#deebe4` | Green badge backgrounds |
| Green Dark | `#376c59` | Green text |
| Rose Light | `#f0dfdc` | Rose badge backgrounds |
| Rose Dark | `#9a5550` | Rose text |
| Muted Text | `#72777b` | Secondary text, descriptions |
| Placeholder | `#9a9b97` | Input placeholders |

### Sidebar (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| Sidebar BG | `#202c3d` | Dark sidebar, auth pages |
| Sidebar Text | `#f7f4ec` | Text on dark |
| Sidebar Accent | `#e5b45d` | Gold on dark |
| Sidebar Muted | `#c3c8c9` | Muted text on dark |

### Category Colors

| Category | Badge BG | Badge Text | Dot Color |
|----------|----------|------------|-----------|
| Grant/Funding | `#f1e6d2` | `#80591f` | `#d2a351` |
| Challenge | `#e2ece5` | `#376b58` | `#57826c` |
| Mentor | `#f0e2df` | `#925651` | `#bc7369` |

---

## Typography

### Font Families

```css
--app-font-sans: 'DM Sans', sans-serif;      /* Body text */
--app-font-serif: 'Manrope', sans-serif;     /* Headings */
--app-font-mono: 'IBM Plex Mono', monospace; /* Labels, numbers */
```

Import via Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
```

### Type Scale

| Element | Font | Size | Weight | Letter Spacing | Line Height |
|---------|------|------|--------|----------------|-------------|
| Hero H1 | Manrope | 79px (clamp 54-79px) | 700 | -0.07em | 0.99 |
| Page H1 | Manrope | 61px (clamp 42-61px) | 700 | -0.075em | 0.97 |
| Section H2 | Manrope | 49px (clamp 34-49px) | 700 | -0.06em | 1.05 |
| Card H3 | Manrope | 18px | 700 | -0.035em | 1.2 |
| Body | DM Sans | 15px | 400 | 0 | 1.75 |
| Body Small | DM Sans | 13px | 400 | 0 | 1.75 |
| Description | DM Sans | 11-12px | 400 | 0 | 1.65 |
| Mono Label | IBM Plex Mono | 9-10px | 500 | 0.12em | 1.4 |
| Button | DM Sans | 13px | 600 | 0 | 1 |

### Mono Label Utility

```css
.mono-label {
  font-family: var(--app-font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## Spacing

Based on 4px units with generous whitespace:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Icon gaps |
| `space-3` | 12px | Small padding |
| `space-4` | 16px | Card padding |
| `space-5` | 20px | Section gaps |
| `space-6` | 24px | Large padding |
| `space-8` | 32px | Section spacing |
| `space-10` | 40px | Page padding |
| `space-16` | 64px | Major sections |
| `space-24` | 96px | Hero spacing |

### Container

```css
max-width: 1100px;  /* Content areas */
max-width: 1500px;  /* Full layouts */
padding: max(5.7vw, 24px);  /* Responsive padding */
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius` | 0 | Default (sharp corners) |
| `radius-sm` | 0 | Badges, small elements |
| `radius-md` | 0 | Buttons, inputs |
| `radius-lg` | 0 | Cards |
| `radius-full` | 50% | Avatars, dots |

> Note: This design uses sharp corners throughout for an editorial feel. Only circular elements (avatars, dots) are rounded.

---

## Shadows

Minimal shadows — the design relies on borders and color:

```css
/* Card hover */
box-shadow: 0 8px 22px rgba(32, 44, 61, 0.06);

/* Hero aside */
box-shadow: 9px 12px 0 rgba(41, 51, 66, 0.035);

/* Auth card */
box-shadow: 0 15px 50px rgba(31, 43, 57, 0.07);
```

---

## Components

### Brand / Logo

```css
.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font: 700 15px/1 var(--app-font-serif);
  letter-spacing: -0.045em;
  color: var(--ink);
}

.brand-symbol {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: var(--ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Inner dot */
.brand-symbol > span {
  width: 10px;
  height: 10px;
  border: 1.5px solid #e9b75f;
  border-radius: 50%;
  position: relative;
}

.brand-symbol > span:after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: #e9b75f;
  border-radius: 50%;
  top: 2px;
  left: 2px;
}
```

### Buttons

#### Primary Button
```css
.button-primary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
  border: 1px solid var(--ink);
  background: var(--ink);
  color: var(--paper-light);
  font-weight: 600;
  font-size: 13px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.button-primary:hover {
  transform: translateY(-2px);
  background: #304258;
}

.button-primary-large {
  min-height: 54px;
  padding-inline: 23px;
}
```

#### Secondary Button
```css
.button-secondary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
  background: transparent;
  color: var(--ink);
  border: 1px solid #bfb7a9;
  font-weight: 600;
  font-size: 13px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.button-secondary:hover {
  transform: translateY(-2px);
  background: #eee9de;
  border-color: var(--ink);
}
```

#### Text Button / Link
```css
.text-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: none;
  color: #875e24;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 0;
}

.text-button:hover {
  color: var(--ink);
}
```

### Cards

#### Resource Card
```css
.resource-card {
  min-height: 273px;
  display: flex;
  flex-direction: column;
  padding: 19px;
  border: 1px solid #ded8cc;
  background: #fffdf8;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.resource-card:hover {
  transform: translateY(-3px);
  border-color: #c7b89c;
  box-shadow: 0 8px 22px rgba(32, 44, 61, 0.06);
}
```

### Badges / Pills

#### Category Badge
```css
.category-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  color: #80591f;
  background: #f1e6d2;
  font: 9px var(--app-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

/* Variants */
.category-challenge { color: #376b58; background: #e2ece5; }
.category-mentor { color: #925651; background: #f0e2df; }
```

#### Focus Tag
```css
.focus-list span {
  padding: 4px 7px;
  color: #6f7478;
  background: #f2efe8;
  font-size: 9px;
}
```

### Inputs

#### Search Field
```css
.search-field {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 46px;
  padding: 0 12px;
  background: #fffdf8;
  border: 1px solid #ddd6c9;
  color: #9b7137;
}

.search-field:focus-within {
  border-color: #b58c4f;
  box-shadow: 0 0 0 2px rgba(214, 155, 66, 0.12);
}

.search-field input {
  border: 0;
  outline: 0;
  flex: 1;
  background: transparent;
  color: var(--ink);
  font-size: 12px;
}

.search-field input::placeholder {
  color: #9a9b97;
}
```

### Navigation

#### Top Bar
```css
.app-topbar {
  height: 63px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4.7vw;
  background: #fbf9f3;
  border-bottom: 1px solid #e2dccc;
}
```

#### Private Pill (Member Indicator)
```css
.private-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #777b7d;
  font: 9px var(--app-font-mono);
  letter-spacing: 0.08em;
}

.private-pill i {
  width: 6px;
  height: 6px;
  background: #56846d;
  border-radius: 50%;
}
```

### Sidebar Rail

```css
.directory-rail {
  display: flex;
  flex-direction: column;
  padding: 39px 24px 24px max(30px, 4vw);
  border-right: 1px solid #e0dacd;
  background: #f0ede4;
}
```

### Note Box

```css
.rail-note {
  margin-top: auto;
  padding: 14px 12px;
  border-left: 2px solid #d2a351;
  background: #e8e4da;
}
```

### Empty / Error States

```css
.state-panel, .empty-results {
  min-height: 300px;
  border: 1px dashed #d5cebf;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px;
  background: rgba(251, 249, 243, 0.45);
}

.state-icon {
  color: #a87531;
  width: 42px;
  height: 42px;
  border: 1px solid #dfd4c0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  margin-bottom: 17px;
}
```

### Pagination

```css
.pagination {
  min-height: 63px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ded8cc;
  margin-top: 22px;
  color: #81847f;
  font-size: 10px;
}

.pagination-actions button {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  background: transparent;
  border: 1px solid #d5cec0;
  color: var(--ink);
}

.pagination-actions button:hover:not(:disabled) {
  color: #fff;
  background: var(--ink);
}
```

---

## Layouts

### Two-Column with Sidebar

```css
.directory-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  max-width: 1500px;
  margin: 0 auto;
  min-height: calc(100dvh - 63px);
}
```

### Hero Section with Grid Background

```css
.hero-section {
  position: relative;
  min-height: 550px;
  padding: 86px max(9.7vw, 32px) 46px;
  background-color: #f3f0e7;
}

.paper-grid {
  background-image: 
    linear-gradient(to right, hsl(213 29% 17% / 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(213 29% 17% / 0.035) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

### Auth Page Split Layout

```css
.clerk-page {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(320px, 0.8fr) 1.2fr;
  background: #f2efe6;
}

.clerk-page-story {
  min-height: 100dvh;
  padding: 44px clamp(30px, 7vw, 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #202c3d;
  color: #f7f4ec;
}
```

---

## Animations

### Rise In (Staggered Entry)

```css
@keyframes rise-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.rise-in {
  animation: rise-in 0.55s cubic-bezier(0.2, 0.75, 0.25, 1) both;
}

.rise-delay-1 { animation-delay: 0.08s; }
.rise-delay-2 { animation-delay: 0.16s; }
.rise-delay-3 { animation-delay: 0.24s; }
```

### Skeleton Pulse

```css
@keyframes pulse {
  50% { opacity: 0.5; }
}

.skeleton {
  animation: pulse 1.4s infinite ease-in-out;
}
```

### Hover Lift

```css
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-3px);
}
```

---

## Responsive Breakpoints

```css
/* Desktop */
@media (max-width: 1100px) {
  .directory-layout { grid-template-columns: 230px minmax(0, 1fr); }
  .directory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Tablet/Mobile */
@media (max-width: 760px) {
  .directory-layout { display: block; }
  .directory-grid { grid-template-columns: 1fr; }
  .clerk-page { display: block; }
  .hero-inner { grid-template-columns: 1fr; }
}
```

---

## Accessibility

- Focus visible outline: `box-shadow: 0 0 0 2px rgba(214, 155, 66, 0.12)`
- Color contrast meets WCAG AA
- Interactive elements have visible hover/focus states
- Reduced motion support:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icons

Using Lucide React icons with these defaults:

```tsx
<Icon size={16} strokeWidth={1.5} />
```

Common icons:
- `ArrowRight`, `ArrowUpRight`, `ArrowDownRight` — CTAs, links
- `Search` — Search input
- `Sparkles` — Featured/AI indicator
- `CalendarDays` — Deadlines
- `Compass` — Navigation, location
- `LockKeyhole` — Private/member indicator
- `Bookmark` — Save
- `ExternalLink` — External links
- `X` — Close, clear
- `SlidersHorizontal` — Filters
