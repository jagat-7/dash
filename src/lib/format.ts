/** Formatting helpers shared by tables, cards and detail panels. */

export const CURRENCY = 'Rs'

/** `Rs 48,200` — Indian digit grouping, matching the prototype. */
export function money(amount: number, currency = CURRENCY) {
  return `${currency} ${amount.toLocaleString('en-IN')}`
}

/** Compact lakh notation used in the reports header, e.g. `Rs 52.3L`. */
export function lakh(amount: number, currency = CURRENCY) {
  return `${currency} ${(amount / 100_000).toFixed(1)}L`
}

/** `Kamala Tamang` -> `KT` */
export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Signed percentage with a directional arrow, e.g. `▲ 8%`. */
export function delta(value: number, suffix = '%') {
  return `${value >= 0 ? '▲' : '▼'} ${Math.abs(value)}${suffix}`
}

/** URL-safe slug for a patient id used in routes. */
export function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function pct(part: number, whole: number) {
  if (!whole) return 0
  return Math.round((part / whole) * 100)
}
