/**
 * Accent themes — the product's primary colour, swappable at runtime.
 *
 * The shipped teal ramp is the reference. Measured in OKLCH it sits at a
 * near-constant hue (~180°) with a specific lightness/chroma curve; every other
 * accent reuses that exact curve and only rotates the hue. Because OKLCH
 * lightness is perceptual, a rotated ramp keeps the same text/background
 * contrast the teal was designed around — no accent can quietly break legibility.
 *
 * `teal` is the default and deliberately carries no overrides at all: choosing
 * it strips the inline custom properties and the stylesheet in `index.css`
 * takes over, so the default is the original hexes, not a re-derivation of them.
 */

export type AccentId = 'teal' | 'indigo' | 'blue' | 'violet' | 'rose' | 'emerald' | 'custom'

export interface Accent {
  id: AccentId
  name: string
  /** What this accent reads as, one line, for the settings list. */
  note: string
  /** OKLCH hue in degrees. Unused by the default. */
  hue: number
  /** Multiplies the reference chroma curve — hues differ in how saturated they read. */
  chroma: number
}

export const ACCENTS: Accent[] = [
  { id: 'teal', name: 'Clinical teal', note: 'The Forward default', hue: 181, chroma: 1 },
  { id: 'emerald', name: 'Emerald', note: 'Greener, softer', hue: 163, chroma: 1.05 },
  { id: 'blue', name: 'Deep blue', note: 'Institutional', hue: 250, chroma: 1.25 },
  { id: 'indigo', name: 'Indigo', note: 'Cooler, higher contrast', hue: 275, chroma: 1.3 },
  { id: 'violet', name: 'Violet', note: 'Distinct from status colours', hue: 300, chroma: 1.25 },
  { id: 'rose', name: 'Rose', note: 'Warm — reads close to critical', hue: 15, chroma: 1.2 },
]

export const DEFAULT_ACCENT: AccentId = 'teal'

/** Presets only — `custom` is derived from a hex, never listed here. */
export const ACCENTS_BY_ID = Object.fromEntries(ACCENTS.map((a) => [a.id, a])) as Record<
  string,
  Accent | undefined
> & { teal: Accent }

/** [lightness, chroma] pairs read off the shipped teal tokens. */
type Step = readonly [number, number]

const LIGHT: Record<string, Step> = {
  'brand-50': [0.956, 0.015],
  'brand-100': [0.948, 0.019],
  'brand-200': [0.871, 0.047],
  'brand-300': [0.79, 0.096],
  'brand-400': [0.656, 0.107],
  'brand-500': [0.566, 0.101],
  'brand-600': [0.467, 0.085],
  'brand-700': [0.406, 0.074],
  'brand-800': [0.327, 0.052],
  rail: [0.467, 0.085],
  canvas: [0.939, 0.01],
  subtle: [0.981, 0.006],
  'hairline-soft': [0.955, 0.009],
  'hairline-teal': [0.945, 0.01],
  'hairline-top': [0.917, 0.024],
}

const DARK: Record<string, Step> = {
  'brand-50': [0.287, 0.04],
  'brand-100': [0.322, 0.046],
  'brand-200': [0.428, 0.066],
  'brand-300': [0.583, 0.093],
  'brand-400': [0.634, 0.111],
  'brand-500': [0.703, 0.124],
  'brand-600': [0.634, 0.111],
  'brand-700': [0.527, 0.093],
  'brand-800': [0.424, 0.073],
  'on-brand': [0.236, 0.037],
  rail: [0.205, 0.019],
  canvas: [0.181, 0.014],
  surface: [0.216, 0.015],
  subtle: [0.248, 0.017],
  hairline: [0.303, 0.02],
  'hairline-soft': [0.276, 0.019],
  'hairline-teal': [0.295, 0.02],
  'hairline-top': [0.295, 0.02],
  'line-strong': [0.382, 0.023],
}

/**
 * The tint on surfaces is deliberately damped: at full chroma a strongly hued
 * accent turns the whole canvas into a colour wash. Brand steps take the
 * accent's chroma as-is; surfaces take a fraction of it.
 */
const SURFACE_TOKENS = new Set([
  'canvas',
  'surface',
  'subtle',
  'hairline',
  'hairline-soft',
  'hairline-teal',
  'hairline-top',
  'line-strong',
  'rail',
])

function css(step: Step, hue: number, chroma: number, damp: boolean) {
  const [lightness, base] = step
  const c = (base * (damp ? 1 + (chroma - 1) * 0.35 : chroma)).toFixed(4)
  return `oklch(${lightness} ${c} ${hue})`
}

/**
 * The custom properties that express `accent` on the given theme. Empty for the
 * default, which is what the stylesheet already says.
 */
export function accentVars(accent: Accent, theme: 'light' | 'dark'): Record<string, string> {
  if (accent.id === DEFAULT_ACCENT) return {}

  const steps = theme === 'dark' ? DARK : LIGHT
  const vars: Record<string, string> = {}
  for (const [token, step] of Object.entries(steps)) {
    vars[`--color-${token}`] = css(step, accent.hue, accent.chroma, SURFACE_TOKENS.has(token))
  }
  // The topbar's shadow is brand-tinted too, or it reads as a grey seam.
  vars['--shadow-topbar'] = `0 1px 6px oklch(0.467 0.085 ${accent.hue} / 0.06)`
  return vars
}

/** A single representative colour, for swatches and previews. */
export function accentSwatch(accent: Accent, theme: 'light' | 'dark' = 'light') {
  const steps = theme === 'dark' ? DARK : LIGHT
  return css(steps['brand-600']!, accent.hue, accent.chroma, false)
}

/* ------------------------------------------------------- Arbitrary colours */

const REFERENCE_CHROMA = LIGHT['brand-600']![1]

/** sRGB hex → OKLCH. The ramp only needs the hue and chroma. */
export function hexToOklch(hex: string): { l: number; c: number; h: number } | null {
  const clean = hex.trim().replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((char) => char + char)
          .join('')
      : clean
  if (!/^[0-9a-f]{6}$/i.test(full)) return null

  const toLinear = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  const value = parseInt(full, 16)
  const r = toLinear(((value >> 16) & 255) / 255)
  const g = toLinear(((value >> 8) & 255) / 255)
  const b = toLinear((value & 255) / 255)

  const lp = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const mp = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const sp = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const l = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp
  const a = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp
  const bb = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp
  let h = (Math.atan2(bb, a) * 180) / Math.PI
  if (h < 0) h += 360

  return { l, c: Math.hypot(a, bb), h }
}

/**
 * OKLCH → sRGB hex. Chroma is walked down until the colour is inside the
 * gamut, which keeps the hue exact and only gives up saturation — the same
 * trade-off browsers make for out-of-range `oklch()`.
 */
export function oklchToHex(lightness: number, chroma: number, hue: number): string {
  const encode = (channel: number) =>
    channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055

  const toRgb = (c: number) => {
    const rad = (hue * Math.PI) / 180
    const a = c * Math.cos(rad)
    const b = c * Math.sin(rad)

    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3

    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
  }

  let c = chroma
  for (let step = 0; step < 40; step += 1) {
    const rgb = toRgb(c)
    if (rgb.every((channel) => channel >= -0.0002 && channel <= 1.0002)) break
    c -= chroma / 40
    if (c < 0) c = 0
  }

  return `#${toRgb(c)
    .map((channel) => {
      const value = Math.round(Math.min(1, Math.max(0, encode(channel))) * 255)
      return value.toString(16).padStart(2, '0')
    })
    .join('')}`.toUpperCase()
}

/** The reference lightness a swatch is drawn at — the `brand-600` step. */
export const SWATCH_LIGHTNESS = LIGHT['brand-600']![0]

/** Chroma multiplier → absolute chroma at the reference step. */
export function chromaFor(multiplier: number) {
  return REFERENCE_CHROMA * multiplier
}

/**
 * Any colour the user picks, mapped onto the reference ramp.
 *
 * Only the hue and the *relative* saturation survive: the lightness curve is
 * always the shipped one, so a near-white or near-black pick still produces a
 * usable ramp instead of an unreadable console. Chroma is capped at 1.6× the
 * reference so a neon pick cannot blow past what the surfaces can carry.
 */
export function accentFromHex(hex: string): Accent | null {
  const oklch = hexToOklch(hex)
  if (!oklch) return null
  const chroma = Math.min(1.6, Math.max(0.15, oklch.c / REFERENCE_CHROMA))
  return {
    id: 'custom',
    name: 'Custom',
    note: hex.toUpperCase(),
    hue: Math.round(oklch.h * 10) / 10,
    chroma: Math.round(chroma * 100) / 100,
  }
}

/** Resolves a stored selection — preset id, or the custom hex — to one Accent. */
export function resolveAccent(id: AccentId, customColor: string): Accent {
  if (id === 'custom') return accentFromHex(customColor) ?? ACCENTS_BY_ID.teal
  return ACCENTS_BY_ID[id] ?? ACCENTS_BY_ID.teal
}

export const DEFAULT_CUSTOM_COLOR = '#3B82F6'
