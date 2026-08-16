# Forward — React design build

The `Dashbard.dc.html` prototype recreated as a real React application:
a reusable component library, an app shell, and all 11 screens — plus a settings
screen that retints the whole console. **No backend** —
every screen renders from typed mock data in `src/data/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle
```

Sign in with any credentials — the login form is a gate, not an auth system.

## Stack

| Concern | Choice |
|---|---|
| Build | Vite 8 + React 19 + TypeScript 6 (`strict`) |
| Styling | Tailwind CSS v4 — tokens declared in `@theme`, no config file |
| Routing | React Router 7 |
| State | Zustand, persisted to `sessionStorage` |
| Icons | Inline SVG registry (`components/ui/Icon.tsx`) — no icon package |
| Charts | Hand-built SVG primitives — no charting package |

Runtime dependencies total five packages. Charts and icons are first-party so
they inherit the design tokens directly and add nothing to the bundle beyond
their own markup.

## Layout

```
src/
├── components/
│   ├── ui/          Design-system primitives — know nothing about HMIS
│   ├── charts/      DonutChart · Gauge · TrendLine · Sparkline · palette
│   ├── domain/      HMIS-aware composites (StatusBadge, BedTile, VitalCard…)
│   └── layout/      AppShell · Sidebar · Topbar · QuickActions · PageHeader
├── data/            Typed mock data + domain types
├── pages/           One file per screen; EMR tabs in pages/emr/
├── store/           Zustand store (session, branch scope, UI prefs)
└── lib/             cn() class merger, formatters
```

The dependency rule is one-directional: `ui` → nothing, `charts` → `ui`,
`domain` → `ui`/`charts`, `pages` → all of the above. A primitive never
imports a domain type.

## Component library

Everything below is rendered live at **`/design`** — open it to browse, poke and
compare without signing in. Coverage is checked, not assumed: every name
exported from `ui/`, `charts/`, `domain/` and `layout/` appears there.

**Actions** — `Button` (6 variants × 5 sizes, icon/loading/pill/block) ·
`IconButton` · `ButtonGroup` · `Menu` · `CopyButton` · `Kbd`

**Forms** — `Field` · `Input` · `Select` · **`SearchSelect`** · **`MultiSelect`** ·
`Textarea` · `Checkbox` · `Switch` · `RadioGroup` · `Slider` · `Combobox` ·
`SearchInput` · `FileDrop` · `SegmentedControl` · `FilterChips` · `Stepper` · `Tabs`

`SearchSelect` / `MultiSelect` are the Select2 pattern — type-ahead filter,
option groups, icons, disabled options, and (for multi) removable tag chips with
backspace-to-remove. Used in both filter panels and forms.

**Filtering** — `FilterPanel` (show/hide drawer with live filter chips) ·
`ColumnVisibility` (show/hide columns)

**Pagination** — `Pagination` (numbered, first/last jumps, optional page-size
chooser, `compact` variant) · `LoadMore` (progressive disclosure) · `pageWindow`

**Branding & theme** — `Logo` · `LogoMark` · `ThemeToggle` · `ThemeSelect` ·
`AccentPicker` · `AccentPreview`

**Anchored layers** — `AnchoredPanel` is the one positioning primitive behind
every dropdown: `SearchSelect`, `MultiSelect`, `Menu`, `Popover`,
`BranchSwitcher` and the pagination row-size chooser all render through it.

**Data display** — `DataTable` (+ `Cell`, `IdCell`, `AmountCell`) ·
`Badge` · `CountBadge` · `Avatar` · `AvatarGroup` · `StatusDot` · `Breadcrumbs` ·
`Toolbar` · `Divider` · `DescriptionList` · `StatTile` · `StepTrail` ·
`SectionLabel` · `Skeleton` · `EmptyState` · `Tooltip`

**Feedback** — `Alert` · `Banner` · `ToastProvider` + `useToast` · `Spinner` ·
`LoadingState` · `ProgressBar`

**Overlays** — `Modal` · `Drawer` · `Popover` · `Menu` · `Accordion` ·
`Collapsible` · `DetailPanel` + `DetailRow`

**Cards** — `Card` / `CardHeader` / `CardBody` / `CardFooter` · `StatCard` ·
`ProgressCard` · `ActionCard` · `InfoCard` · `CardGrid`

**Charts** (`@/components/charts`) — `TrendLine` · `Sparkline` · `Sparkbars` ·
`DonutChart` · `Gauge` · `BarChart` · `StackedBarChart` · `HorizontalBarChart` ·
`Heatmap` · `Legend` · `ChartCard`

Every one of them is on **`/dashboard`**, on real figures rather than filler:
revenue trend (`TrendLine`), OPD by day against the weekly mean (`BarChart` with
a reference line), admissions by source (`StackedBarChart` + `Legend`), bed
occupancy (`Gauge`), payer mix (`DonutChart`), OPD load by weekday × hour
(`Heatmap`), top departments (`HorizontalBarChart`), the 7-day series
(`Sparkline`), and the stat-card visuals (`Sparkbars`) — all wrapped in
`ChartCard`.

**Layout** (`@/components/layout`) — `AppShell` · `Sidebar` · `Topbar` ·
`ShortcutDock` · `PageHeader` · `Resizable` · `PageLayout`

**Domain** (`@/components/domain`) — `StatusBadge` · `PriorityLabel` · `KpiCard` ·
`AlertList` · `VitalCard` · `Timeline` · `NoteCard` · `PatientLink` · `BedTile` ·
`BedLegend` · `BranchSwitcher` · `RegistrationModal`

**Icons** — 54 inline glyphs in one registry, no icon package. The gallery
renders them from `iconNames`, so the page cannot fall behind the registry.

Every status colour in the app resolves through the single map in
`domain/StatusBadge.tsx`, so a status can never be teal on one screen and amber
on another.

## Layout system

Three page shapes, all driven by one primitive:

```tsx
<PageLayout variant="single" primary={…} />
<PageLayout variant="split"  primary={…} secondary={…} id="billing-invoices" />
<PageLayout variant="triple" primary={…} secondary={…} tertiary={…} />
```

Dividers are drag-to-resize (and keyboard-operable: ←/→ nudge, Home/End jump).
Column sizes are clamped to each pane's minimum and persisted per `id`, and the
panes stack below `lg` where a divider makes no sense. `Resizable` underneath
takes any number of panes. The **dashboard**, billing and the IPD bed board all
use `split` live — the dashboard keeps figures on the left and the situational
panel (alerts, today's counts) on the right.

## Responsiveness

Every screen is built from 390px up, and the sweep is mechanical: each route is
loaded at 390 and 1440 and asserted to have **no horizontal overflow** and no
console errors.

What changes at the small end:

- **Login** re-orders to headline → form → feature list, so signing in never
  starts a screen and a half down. On `lg` the two dark blocks stack back into
  one panel via explicit grid placement.
- **Topbar** drops to the search trigger, the emergency action and the avatar.
  Branch scope, theme, settings, notifications and sign-out reappear at the foot
  of the **nav drawer** — hiding controls is only defensible if they land
  somewhere. The drawer also has an explicit close button, closes on Escape,
  and locks the page behind it.
- **Pagination** collapses its numbered window to a `page / total` counter.
- **The shortcut dock is hidden below `lg`** — a drag-to-move edge tab competes
  with the OS back gesture, and everything it holds is reachable elsewhere.
- Tables keep their real column widths and scroll horizontally rather than
  squashing to unreadable.

## Theming

Light and dark, switched by the topbar toggle (or the three-way `ThemeSelect`,
which can follow the OS). The choice is stamped as `data-theme` on `<html>` and
persisted.

No component knows the theme exists — dark mode redefines the same tokens in a
`[data-theme='dark']` block in `index.css`. Two tokens exist purely so dark mode
works without special cases:

- `--color-on-brand` — ink that sits *on* a brand/status fill. White in light,
  near-black in dark, because the brand and status hues lighten there.
- `--color-rail` — the sidebar surface, separate from `brand-600` so the rail can
  darken without dragging every brand-coloured button with it.

The categorical chart palette is **unchanged between themes**: it was re-run
against the dark surface and passes all six checks there. Only the recessive
chrome switches, via `--chart-track` / `--chart-surface`.

### Accent colour

`/settings` (and the Theming section of `/design`) swaps the product's primary
colour at runtime — six presets plus **a colour well that accepts any hex**.
`src/data/accents.ts` holds the mechanism.

Measured in OKLCH, the teal ramp sits at a near-constant hue with a specific
lightness/chroma curve. Every other accent **reuses that exact curve and only
rotates the hue**, so contrast is carried over rather than re-guessed: no accent
can quietly make a button's label unreadable. Surfaces (`canvas`, `subtle`, the
hairlines, the rail) take a damped fraction of the accent's chroma, or a strongly
hued accent turns the whole console into a colour wash.

A hand-picked colour is held to the same rule: only its hue and *relative*
saturation survive (chroma capped at 1.6× the reference), so a near-white,
near-black or neon pick still yields a legible console instead of an unreadable
one.

`AccentPicker` therefore offers **hue** and **intensity** rails rather than a
generic RGB square — those are the only two channels the theme consumes, so
dragging a rail previews exactly what the console becomes, with no step where
the chosen colour is silently altered. Alongside them: 36 one-click swatches, a
hex field, and the system colour well (for an eyedropper or a brand hex off a
spec sheet). `oklchToHex()` walks chroma down until the colour is in gamut, so
the hue stays exact and only saturation gives way.

The accent is applied as inline custom properties on `<html>`, recomputed when
the light/dark resolution changes. **Teal writes nothing at all** — picking it
strips the overrides and the `index.css` block takes back over, so the default is
the original hexes rather than a re-derivation of them.

## Branding

Name, tagline and version live in `src/data/brand.ts`; the logomark is a single
`currentColor` SVG in `components/ui/Logo.tsx`. Editing those two files rebrands
the console.

## Shortcut dock

A sticky tab welded to the **right edge** that opens a full-height drawer.
Dragging moves it **vertically only** — the horizontal position is fixed by
design, so the control can never end up somewhere unreachable. A press that
travels under 4px counts as a click, so dragging and toggling never fight. The
vertical offset is clamped to the viewport, survives a resize, and persists.


## Modules & the launcher

`src/data/navigation.ts` holds a single registry of **17 modules**. It feeds both
the launcher grid and the sidebar rail, so the two can never disagree.

The launcher is a pure module index — no KPIs, no alert widgets, no figures, and
no grouping: one flat, uniform grid in registry order, with that position
printed on each card so a module always sits where you last saw it.

Its dropdowns are **CSS-only** (`group-hover` / `group-focus-within`): there is
no chevron to click and no React state. Each panel is absolutely positioned, so
opening one never reflows the grid — verified by
`node scripts/launcher-check.mjs`, which asserts that zero cards move while a
dropdown is open.

## Search

`⌘K` (or the topbar trigger, which sits on the right) opens a **dialog**, not an
inline dropdown. Inline, the results panel had to be laid out inside the topbar,
competing with the branch switcher for width and with the page for stacking
order, and it was unusable on a phone. As a dialog it owns the screen and is the
same control at every width. It indexes modules, their sub-pages and the patient
directory; ↑/↓ move, ↵ opens, esc closes.

Modules flagged `implemented: false` in the registry render
`ModulePlaceholderPage` — they appear in navigation and list their planned
sections rather than 404ing. Eight modules have full designs; the rest are
registered placeholders.

## Design tokens

All of them live in the `@theme` block of `src/index.css` — colours, the type
scale, radii, elevation, rails, motion. Nothing hard-codes a hex value, so
retheming means editing that one block.

Two scale overrides worth knowing: `text-sm` is **13px** and `text-base` is
**14px**, because those are this design's body and form sizes.

## Chart palette

`components/charts/palette.ts` is validated, not eyeballed — it passes the
lightness-band, chroma-floor, CVD-separation, normal-vision and contrast checks.
Two deliberate departures from the brand sheet, both forced by that validation:

1. Charts use **brand-500 `#00897B`**, not brand-600. The 600 step fails the
   chroma floor — as a data mark it reads grey. Chrome still uses 600.
2. The categorical slot order is teal → amber → violet → green. The brand order
   puts amber next to green, a pair only ΔE 6.2 apart under protanopia.

Donut segments additionally carry a 2px surface gap and a direct-labelled
legend, so series identity never rests on colour alone.

## Accessibility

- Real focus-visible rings on every interactive element, defined once in base CSS.
- `Modal` traps focus, restores it on close, locks body scroll, closes on Escape.
- `Tabs` implements the WAI-ARIA roving-focus pattern (←/→, Home/End).
- `DataTable` carries explicit ARIA table roles; clickable rows are keyboard-operable.
- Status, lab flags, bed states and alert levels each pair colour with a word or icon.
- `prefers-reduced-motion` disables all animation.

## Responsive behaviour

The rail collapses to a drawer below `lg`; tables scroll horizontally inside
their card rather than squashing; card grids reflow at `sm`/`lg`/`xl`. The
prototype was desktop-only — this build is not.

## Screenshot harness

`node scripts/shots.mjs` drives a running dev server through every screen with
puppeteer-core and writes PNGs to `shots/`, failing on any console error. It
uses the locally installed Chrome (no browser download). Dev-only — delete
`scripts/` and the `puppeteer-core` devDependency if you don't want it.

## Known gaps

Design build, so by construction: no API layer, no form validation library, no
auth, no tests. Buttons that would mutate server state (Transfer, Submit batch,
Add medication, Record payment) are present and styled but inert.
