import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_ACCENT,
  DEFAULT_CUSTOM_COLOR,
  accentVars,
  resolveAccent,
  type AccentId,
} from '@/data/accents'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  /** Primary colour. `teal` is the shipped default and applies no overrides. */
  accent: AccentId
  /** The hex behind `accent: 'custom'` — any colour the user picks. */
  customColor: string
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentId) => void
  setCustomColor: (hex: string) => void
  resetAppearance: () => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      accent: DEFAULT_ACCENT,
      customColor: DEFAULT_CUSTOM_COLOR,
      setMode: (mode) => set({ mode }),
      setAccent: (accent) => set({ accent }),
      // Picking a colour selects it too — a swatch you set but don't get is a trap.
      setCustomColor: (customColor) => set({ customColor, accent: 'custom' }),
      resetAppearance: () =>
        set({ mode: 'system', accent: DEFAULT_ACCENT, customColor: DEFAULT_CUSTOM_COLOR }),
      // Cycling light -> dark -> light keeps the toggle button predictable;
      // "system" is reachable from the menu, not the one-click toggle.
      toggle: () =>
        set((state) => ({ mode: resolve(state.mode) === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'forward-theme' },
  ),
)

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

export function resolve(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode
}

/** Tracks every token this module may have written, so switching back cleans up. */
let applied: string[] = []

function applyAccent(accent: AccentId, customColor: string, theme: 'light' | 'dark') {
  const root = document.documentElement
  const vars = accentVars(resolveAccent(accent, customColor), theme)

  for (const name of applied) {
    if (!(name in vars)) root.style.removeProperty(name)
  }
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value)
  applied = Object.keys(vars)
}

/**
 * Stamps `data-theme` on <html> and paints the accent's custom properties over
 * it. Mount once, near the root. Every component reads both through CSS tokens,
 * so nothing else needs to know.
 */
export function useApplyTheme() {
  const mode = useThemeStore((state) => state.mode)
  const accent = useThemeStore((state) => state.accent)
  const customColor = useThemeStore((state) => state.customColor)

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const theme = resolve(mode)
      root.setAttribute('data-theme', theme)
      // Accent values differ per theme, so this has to follow the resolution.
      applyAccent(accent, customColor, theme)
    }
    apply()

    if (mode !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [mode, accent, customColor])
}

/** The Accent object currently in force — presets and custom alike. */
export function useAccent() {
  const accent = useThemeStore((state) => state.accent)
  const customColor = useThemeStore((state) => state.customColor)
  return resolveAccent(accent, customColor)
}

export function useResolvedTheme(): 'light' | 'dark' {
  const mode = useThemeStore((state) => state.mode)
  return resolve(mode)
}
