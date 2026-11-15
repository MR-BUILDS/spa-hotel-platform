# Design System — MINERAL FLOW (working codename)

The final brand name, logo, and public identity are not approved yet. MINERAL FLOW is the internal design direction only.

## Design thesis

A distinctive digital expression of Sarein's thermal water, mineral textures, mountain atmosphere, and hospitality. Avoid generic hotel-template patterns, stock dashboard cards, and repetitive centered hero layouts.

## Visual principles

1. **Editorial composition:** asymmetric grids, strong typographic hierarchy, generous negative space.
2. **Immersive imagery:** large, carefully art-directed photography; images must be real and rights-cleared before publication.
3. **Mineral palette:** deep mineral green/charcoal, thermal teal, restrained warm stone, and mist/off-white.
4. **Fluid signature:** water-inspired interactions used sparingly as a brand signature, not as decoration everywhere.
5. **Quiet interface:** clear booking actions, legible content, and predictable interaction states.

## Initial color tokens (exploratory)

| Token | Value | Intended use |
|---|---|---|
| `mineral-950` | `#101E22` | Deep surfaces / text on light |
| `mineral-800` | `#1B4548` | Primary dark brand surface |
| `thermal-400` | `#4CB9B1` | Accent / interactive states |
| `stone-300` | `#D7C6A5` | Warm secondary accent |
| `mist-50` | `#F4F0E8` | Light canvas |

These are starting tokens, not a final contrast-certified palette. Every text/background pair must pass contrast checks before release.

## Component principles

- Design semantic primitives first: Button, Link, Field, Select, Dialog, Badge, Price, Rating, DateRange, Quantity, Gallery, VenueCard, AvailabilityCalendar, BookingSummary.
- Components must expose keyboard, focus, disabled, loading, error, and success states where relevant.
- Avoid building every page from a generic card grid. Use purpose-specific compositions.
- Shared UI components contain presentation and accessibility behavior; business rules stay in feature modules.

## Motion and water interaction

- Respect `prefers-reduced-motion` and provide a non-animated equivalent.
- Pause animation when off-screen or when the document is hidden.
- Use a shared animation scheduler; avoid one permanent `requestAnimationFrame` loop per component.
- Cap frame rate and pixel ratio on constrained devices; avoid expensive full-screen blur/filter effects.
- Water interaction must never block navigation, form submission, or booking actions.
- Canvas is progressive enhancement; content and controls must work if Canvas is unavailable.

## Responsive and accessibility rules

- Mobile-first layouts and touch targets.
- Keyboard-operable navigation and dialogs.
- Visible focus indicators.
- WCAG 2.2 AA is the target.
- Validate Persian RTL and English/Turkish LTR independently.
