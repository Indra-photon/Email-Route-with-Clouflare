# Dashboard Design System

Reference standard extracted from `/dashboard/tickets/mine` and the dashboard card components.
All other dashboard pages must conform to these tokens.

---

## Font Family

All text uses `font-schibsted` (Schibsted Grotesk). No other font family should appear in dashboard UI.

---

## Typography Scale

Organised by component role. Sizes, weights, tracking, and leading are all listed explicitly.

### Page Header (breadcrumb bar)

| Element | File | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|---|
| Section group label (e.g. "Manage") | `DashboardBreadcrumb.tsx` | `text-[11px]` | `font-medium` | `tracking-[0.055em]` uppercase | — | `text-neutral-400` |
| Current page label | `DashboardBreadcrumb.tsx` | `text-sm` | `font-semibold` | `tracking-tight` | — | `text-neutral-800` |

### Card Header

| Element | File | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|---|
| Card title | `MyTicketsClient.tsx` `CardTitle` | `text-lg` | `font-semibold` | — | — | `text-neutral-900` |
| Stat card label (uppercase) | `StatCards.tsx` `TotalHeroCard` | `text-[10.5px]` | `font-semibold` | `tracking-[0.07em]` uppercase | — | `text-neutral-700` |

### Card Subheader / Section Label

| Element | File | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|---|
| Filter label ("Filter by:") | `FilterBar.tsx` | `text-base` | `font-semibold` | — | — | `text-neutral-500` |
| Empty state heading | `MyTicketsClient.tsx` | `text-lg` | `font-semibold` | — | — | `text-neutral-900` |
| Empty state body | `MyTicketsClient.tsx` | `text-sm` | `font-normal` | — | — | `text-neutral-600` |

### Ticket Card (list row)

| Element | File | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|---|
| Sender name (primary) | `MyTicketsClient.tsx` | `text-sm` | `font-medium` | — | — | `text-neutral-900` |
| Subject line | `MyTicketsClient.tsx` | `text-sm` | `font-normal` | — | `leading-snug` | `text-neutral-600` |
| Timestamp / meta | `MyTicketsClient.tsx` | `text-xs` | `font-normal` | — | — | `text-neutral-500` |
| Claimed label | `MyTicketsClient.tsx` | `text-xs` | `font-normal` | — | — | `text-neutral-600` |

### Status Badge

| Element | File | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|---|
| Badge text | `MyTicketsClient.tsx` `StatCards.tsx` | `text-[10px]` | `font-semibold` | — | — | varies (see Status Colors) |

### Filter Tab Bar

| Element | File | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|---|
| Tab label (inactive) | `MyTicketsClient.tsx` | `text-sm` | `font-medium` | — | — | `text-neutral-600` |
| Tab label (active) | `MyTicketsClient.tsx` | `text-sm` | `font-semibold` | — | — | `text-sky-800` |
| Count inside tab | `MyTicketsClient.tsx` | `text-xs` | inherits | — | — | inherits |

### Inline Toggle / Segment Control

| Element | File | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|---|
| Segment label (inactive) | `StatCards.tsx` | `text-[11px]` | `font-semibold` | — | — | `text-neutral-400` |
| Segment label (active) | `StatCards.tsx` | `text-[11px]` | `font-semibold` | — | — | `text-sky-800` |

---

## Color Palette

### Neutrals (surfaces, text, borders)

| Token | Usage |
|---|---|
| `text-neutral-900` | Primary content, sender names, card titles, active labels |
| `text-neutral-800` | Page label in breadcrumb, dark secondary text |
| `text-neutral-700` | Stat card uppercase labels, column headers |
| `text-neutral-600` | Subject lines, subheaders, empty body text, filter label |
| `text-neutral-500` | Timestamps, muted meta, inactive filter label |
| `text-neutral-400` | Icons (arrow, breadcrumb icon), placeholders, segment inactive |
| `text-neutral-300` | Breadcrumb section icon |
| `bg-white` | Card surfaces |
| `bg-neutral-50` | Breadcrumb bar background, page background, hover row |
| `bg-neutral-100` | Segment control track, skeleton, icon well |
| `bg-neutral-200` | Divider line, filter bar separator (`w-px h-6`) |
| `border-neutral-200` | Card border, filter tab divider, breadcrumb bar border |
| `border-neutral-300` | Hover border on utility buttons |

### Primary — Sky

| Token | Usage |
|---|---|
| `bg-sky-100` | Active filter tab background |
| `text-sky-800` | Active filter tab text, active segment control text |
| `text-sky-500` | Spinner icon (loading state) |
| `border-sky-400` | Input focus border |
| `ring-sky-500/10` | Input focus ring |

### Status Semantic Colors

All four statuses follow the same three-token pattern: `bg-*-100 text-*-700 bg-*-400` (badge bg / badge text / dot).

| Status | Badge bg | Badge text | Dot | Source file |
|---|---|---|---|---|
| open | `bg-amber-100` | `text-amber-700` | `bg-amber-400` | `MyTicketsClient.tsx` |
| in_progress | `bg-sky-100` | `text-sky-700` | `bg-sky-400` | `MyTicketsClient.tsx` |
| waiting | `bg-purple-100` | `text-purple-700` | `bg-purple-400` | `MyTicketsClient.tsx` |
| resolved | `bg-green-100` | `text-green-700` | `bg-green-400` | `MyTicketsClient.tsx` |

> **Note:** `StatCards.tsx` currently uses `bg-amber-50 / bg-emerald-50` variants instead of the `*-100` tokens above. The `MyTicketsClient.tsx` pattern is the standard — StatCards must be updated.

---

## Spacing

### Padding rhythm

| Context | Classes | Source |
|---|---|---|
| Card content area | `p-4` or `p-5` | `MyTicketsClient.tsx` / `StatCards.tsx` |
| Ticket list row | `py-4` | `MyTicketsClient.tsx` |
| Filter tab button | `px-4 py-2` | `MyTicketsClient.tsx` |
| Status badge | `px-2 py-0.5` | `StatCards.tsx` |
| Utility icon button (breadcrumb refresh) | `size-7` (square), no extra padding | `DashboardBreadcrumb.tsx` |
| Breadcrumb bar height | `h-14` | `DashboardBreadcrumb.tsx` |
| Breadcrumb bar horizontal | `px-6` | `DashboardBreadcrumb.tsx` |

### Gap rhythm

| Context | Gap | Source |
|---|---|---|
| Filter bar items | `gap-4` | `FilterBar.tsx` |
| Breadcrumb icon + text | `gap-2.5` | `DashboardBreadcrumb.tsx` |
| Breadcrumb separator + label | `gap-2` | `DashboardBreadcrumb.tsx` |
| Badge dot + label | `gap-1` | `StatCards.tsx` |
| Ticket meta row | `gap-3` | `MyTicketsClient.tsx` |
| Filter tab bar | `gap-2` | `MyTicketsClient.tsx` |
| Segment control buttons | `gap-0.5` | `StatCards.tsx` |
| Card header flex row | `gap-4` | `MyTicketsClient.tsx` |

### Margin

| Context | Margin | Source |
|---|---|---|
| Filter tab bar bottom | `mb-6 pb-4` | `MyTicketsClient.tsx` |
| Refresh button row | `mb-6` | `MyTicketsClient.tsx` |
| Sender → Subject | `mt-1` | `MyTicketsClient.tsx` |
| Subject → Meta row | `mt-2` | `MyTicketsClient.tsx` |
| Empty state icon well → heading | `mb-4` | `MyTicketsClient.tsx` |
| Empty state heading → body | `mb-1` | `MyTicketsClient.tsx` |

---

## Border Radius

| Token | Usage |
|---|---|
| `rounded-full` | Status badge dots, empty state icon well |
| `rounded-xl` | Skeleton loaders inside cards |
| `rounded-lg` | Filter tab buttons, segment control track |
| `rounded-md` | Segment control individual buttons |
| `rounded-4xl` | Stat card outer container (`StatCards.tsx`) |

> `rounded-4xl` is a custom Tailwind extension (defined in `tailwind.config.ts`). Cards outside `StatCards.tsx` should use `rounded-xl` unless explicitly matching that card style.

---

## Border

| Token | Usage |
|---|---|
| `border border-neutral-200` | Card outer border, filter tab bottom divider |
| `border-b border-neutral-200` | Breadcrumb bar bottom, filter tab bar bottom |
| `divide-y divide-neutral-200` | Ticket list row dividers |
| `border border-neutral-200` + hover `border-neutral-300` | Utility icon buttons |

---

## Interactive States

### Hover

| Element | Class | Source |
|---|---|---|
| Ticket list row | `hover:bg-neutral-50` | `MyTicketsClient.tsx` |
| Filter tab (inactive) | `hover:bg-neutral-100 hover:text-neutral-900` | `MyTicketsClient.tsx` |
| Utility icon button | `hover:bg-neutral-100 hover:border-neutral-300` | `DashboardBreadcrumb.tsx` |
| Segment button (inactive) | `hover:text-neutral-600` | `StatCards.tsx` |

### Active / Selected

| Element | Class | Source |
|---|---|---|
| Filter tab (active) | `bg-sky-100 text-sky-800 font-semibold` | `MyTicketsClient.tsx` |
| Segment control (active) | `bg-white text-sky-800 shadow-sm` | `StatCards.tsx` |

### Focus (inputs)

| Element | Class | Source |
|---|---|---|
| Input border | `focus-within:border-sky-400` | `AnimatedDropdown` (inferred) |
| Input ring | `focus-within:ring-2 focus-within:ring-sky-500/10` | `AnimatedDropdown` (inferred) |

### Disabled

| Element | Class | Source |
|---|---|---|
| Utility button | `disabled:opacity-40` | `DashboardBreadcrumb.tsx` |
| Refresh button | `disabled:opacity-50` | `MyTicketsClient.tsx` |

### Transition

All interactive elements use `transition-all duration-150` or `transition-colors duration-150`.
No element should use a duration longer than `200` without motion justification.

---

## Shadows

| Token | Usage |
|---|---|
| `shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]` | Utility icon button (breadcrumb refresh) |
| `shadow-sm` | Active segment control button |

Avoid `shadow-lg` or larger on inline card elements — reserve for dropdowns and modals.

---

## Icon Sizing

| Size | Token | Usage |
|---|---|---|
| 11px | `size={11}` | Breadcrumb chevron separator |
| 13px | `size={13}` | Breadcrumb refresh icon |
| 14px | `size={14}` | Breadcrumb route icon |
| 20px | `size-5` | Ticket row chevron arrow |
| 32px | `size={32}` | Empty state icon well |

Icons inside buttons are always `shrink-0` and `pointer-events-none`.

---

## Violations to Fix in Other Pages

The following patterns exist in other dashboard files and must be replaced with the tokens above.

| Violation | Incorrect value | Correct token |
|---|---|---|
| Font size (too small) | `text-[9px]` | `text-[10px]` (badge minimum) |
| Font size (non-standard) | `text-[10.5px]`, `text-[12px]`, `text-[14px]`, `text-[18.5px]` | Map to scale above |
| Hardcoded hex in inline style | `#0ea5e9`, `#fbbf24`, `#4ade80`, etc. | Use semantic Tailwind tokens |
| Chart hex colors | `#ef4444`, `#8b5cf6`, `#10b981`, etc. | Use `text-red-500`, `text-purple-500`, `text-green-500` as CSS var references |
| Status badge bg (wrong shade) | `bg-amber-50`, `bg-emerald-50` | `bg-amber-100`, `bg-green-100` |
| Non-standard padding | `px-7`, `px-3.5`, `px-2.5` (arbitrary) | Align to `px-2`, `px-3`, `px-4`, `px-6` |
| Non-standard font class | `font-regular` | `font-normal` |
| Arbitrary height | `h-[calc(100dvh-56px-48px)]` | Use layout tokens; document as exception if unavoidable |
| Dropdown width chaos | `w-36`, `w-40`, `w-44`, `w-48` ad-hoc | Standardise per context: `w-40` (short), `w-52` (medium), `w-64` (long) |
