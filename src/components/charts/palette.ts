/**
 * Chart palette — validated, not eyeballed.
 *
 * Checked with the dataviz validator (light surface, categorical scope):
 *   node scripts/validate_palette.js "#00897B,#D97706,#7C3AED,#16A34A" --mode light
 *   → lightness band PASS · chroma floor PASS · CVD separation PASS
 *     normal-vision floor PASS · contrast vs surface PASS
 *
 * Two deliberate deviations from the brand sheet, both forced by that run:
 *  1. Charts use brand-500 (#00897B) rather than brand-600 (#00695C). The
 *     600 step fails the chroma floor — as a data mark it reads gray.
 *     Chrome (sidebar, buttons, links) still uses 600.
 *  2. Amber takes slot 2 and violet slot 3. In the brand order violet/amber/green
 *     put amber next to green, whose protan separation is only ΔE 6.2. Each
 *     series keeps one fixed color; only the slot order changed.
 *
 * Assign in order. Never cycle: a 9th series folds into "Other".
 */
export const CATEGORICAL = ['#00897B', '#D97706', '#7C3AED', '#16A34A'] as const

/** Single-series marks (sparkline, trend line, occupancy meter). */
export const SERIES = '#00897B'

/**
 * Chart chrome follows the theme; the series hues do not. The categorical set
 * above was re-run against the dark surface and passes all six checks there,
 * so it is shared by both modes. Only the recessive parts switch.
 */
export const TRACK = 'var(--chart-track)'
export const AXIS_INK = 'var(--color-ink-subtle)'

/** Surface color — the 2px gap between adjacent fills is painted with this. */
export const SURFACE = 'var(--chart-surface)'

/** Status ink, reserved for state. Never reused as a series color. */
export const STATUS = {
  good: '#16A34A',
  warning: '#D97706',
  critical: '#DC2626',
  neutral: '#94A3B8',
} as const

/** Occupancy/utilisation thresholds shared by the bed board and dashboard. */
export function loadTone(percent: number): keyof typeof STATUS {
  if (percent > 85) return 'critical'
  if (percent > 70) return 'warning'
  return 'good'
}
