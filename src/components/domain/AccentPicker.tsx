import { useCallback, useEffect, useRef, useState } from 'react'
import { AnchoredPanel, Badge, Icon } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  ACCENTS,
  DEFAULT_ACCENT,
  SWATCH_LIGHTNESS,
  accentFromHex,
  accentSwatch,
  chromaFor,
  oklchToHex,
  type AccentId,
} from '@/data/accents'
import { useResolvedTheme, useThemeStore } from '@/store/useTheme'

/**
 * Accent chooser: six curated presets, plus a picker for any colour at all.
 *
 * The picker is built on hue and intensity rather than a generic RGB square,
 * because those are the only two things the theme actually consumes — the
 * lightness curve is fixed (see `data/accents.ts`). Dragging the hue rail
 * therefore previews exactly what the console will become, with no step where a
 * chosen colour is silently altered. The system colour well is still there for
 * an eyedropper or a brand hex off a spec sheet.
 */
export function AccentPicker({ className }: { className?: string }) {
  const theme = useResolvedTheme()
  const accent = useThemeStore((state) => state.accent)
  const setAccent = useThemeStore((state) => state.setAccent)
  const customColor = useThemeStore((state) => state.customColor)
  const setCustomColor = useThemeStore((state) => state.setCustomColor)

  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-label="Accent colour"
        className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ACCENTS.map((option) => (
          <AccentOption
            key={option.id}
            id={option.id}
            name={option.name}
            note={option.note}
            swatch={accentSwatch(option, theme)}
            selected={accent === option.id}
            onSelect={setAccent}
          />
        ))}
      </div>

      <button
        ref={triggerRef}
        type="button"
        role="radio"
        aria-checked={accent === 'custom'}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'mt-2.5 flex w-full cursor-pointer items-center gap-3 rounded-card border p-3 text-left transition-[border-color,box-shadow]',
          accent === 'custom'
            ? 'border-brand-500 ring-1 ring-brand-500'
            : 'border-hairline hover:border-line-strong',
        )}
      >
        <span
          aria-hidden
          style={{ background: customColor }}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline shadow-hairline"
        >
          {accent === 'custom' ? (
            <Icon name="check" size={15} strokeWidth={2.6} className="text-white mix-blend-difference" />
          ) : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">Pick any colour</span>
          <span className="mt-0.5 block text-xs text-ink-muted">
            Hue and intensity are yours; the lightness curve stays fixed so contrast holds.
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2 rounded-control border border-hairline bg-subtle px-2.5 py-1.5">
          <span data-numeric className="font-mono text-xs font-semibold text-ink-body">
            {customColor.toUpperCase()}
          </span>
          <Icon
            name="chevronDown"
            size={12}
            strokeWidth={2.4}
            className={cn('text-ink-subtle transition-transform', open && 'rotate-180')}
          />
        </span>
      </button>

      <AnchoredPanel
        open={open}
        anchorRef={triggerRef}
        onDismiss={close}
        align="end"
        width={340}
        className="p-3.5"
      >
        <ColorPickerBody value={customColor} onChange={setCustomColor} />
      </AnchoredPanel>
    </div>
  )
}

/* ------------------------------------------------------------------ picker */

/** Twelve hues at the reference step — one click, no dragging. */
const QUICK_HUES = Array.from({ length: 12 }, (_, index) => index * 30)
const QUICK_CHROMA = [0.6, 1, 1.4]

function ColorPickerBody({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const parsed = accentFromHex(value)
  const [hue, setHue] = useState(parsed?.hue ?? 250)
  const [chroma, setChroma] = useState(parsed?.chroma ?? 1)
  const [draft, setDraft] = useState(value)
  const typingRef = useRef(false)

  // Follow the store only when the change came from outside this field, so a
  // half-typed hex is never rewritten under the caret.
  useEffect(() => {
    if (typingRef.current) return
    setDraft(value)
    const next = accentFromHex(value)
    if (next) {
      setHue(next.hue)
      setChroma(next.chroma)
    }
  }, [value])

  const emit = (nextHue: number, nextChroma: number) => {
    setHue(nextHue)
    setChroma(nextChroma)
    onChange(oklchToHex(SWATCH_LIGHTNESS, chromaFor(nextChroma), nextHue))
  }

  const hueRail = `linear-gradient(to right, ${Array.from({ length: 13 }, (_, index) =>
    oklchToHex(SWATCH_LIGHTNESS, chromaFor(chroma), index * 30),
  ).join(', ')})`

  const chromaRail = `linear-gradient(to right, ${oklchToHex(
    SWATCH_LIGHTNESS,
    chromaFor(0.15),
    hue,
  )}, ${oklchToHex(SWATCH_LIGHTNESS, chromaFor(1.6), hue)})`

  const draftValid = accentFromHex(draft) !== null

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <label htmlFor="accent-hue" className="text-2xs font-bold tracking-widest text-ink-subtle uppercase">
          Hue
        </label>
        <input
          id="accent-hue"
          type="range"
          min={0}
          max={359}
          value={Math.round(hue)}
          onChange={(event) => emit(Number(event.target.value), chroma)}
          style={{ background: hueRail }}
          className="accent-rail mt-1.5"
        />
      </div>

      <div>
        <label
          htmlFor="accent-chroma"
          className="text-2xs font-bold tracking-widest text-ink-subtle uppercase"
        >
          Intensity
        </label>
        <input
          id="accent-chroma"
          type="range"
          min={15}
          max={160}
          value={Math.round(chroma * 100)}
          onChange={(event) => emit(hue, Number(event.target.value) / 100)}
          style={{ background: chromaRail }}
          className="accent-rail mt-1.5"
        />
      </div>

      <div>
        <p className="text-2xs font-bold tracking-widest text-ink-subtle uppercase">Swatches</p>
        <div className="mt-1.5 grid grid-cols-12 gap-1">
          {QUICK_CHROMA.map((quickChroma) =>
            QUICK_HUES.map((quickHue) => {
              const hex = oklchToHex(SWATCH_LIGHTNESS, chromaFor(quickChroma), quickHue)
              const selected = hex.toLowerCase() === value.toLowerCase()
              return (
                <button
                  key={`${quickChroma}-${quickHue}`}
                  type="button"
                  title={hex}
                  aria-label={`Use ${hex}`}
                  onClick={() => emit(quickHue, quickChroma)}
                  style={{ background: hex }}
                  className={cn(
                    'aspect-square w-full cursor-pointer rounded-[5px] transition-transform hover:scale-110',
                    selected && 'ring-2 ring-ink ring-offset-1 ring-offset-surface',
                  )}
                />
              )
            }),
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-hairline-teal pt-3">
        {/* The system well: eyedropper, OS palettes and recents, for free. */}
        <label
          className="relative grid size-8.5 shrink-0 cursor-pointer place-items-center rounded-control border border-hairline bg-subtle text-ink-muted transition-colors hover:text-ink"
          title="System colour picker"
        >
          <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label="System colour picker"
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
          <Icon name="droplet" size={15} />
        </label>

        <input
          value={draft}
          onFocus={() => (typingRef.current = true)}
          onBlur={() => {
            typingRef.current = false
            if (!accentFromHex(draft)) setDraft(value)
          }}
          onChange={(event) => {
            setDraft(event.target.value)
            if (accentFromHex(event.target.value)) onChange(event.target.value)
          }}
          spellCheck={false}
          aria-label="Accent colour hex"
          aria-invalid={!draftValid}
          className={cn(
            'h-8.5 min-w-0 flex-1 rounded-control border bg-subtle px-2.5 font-mono text-sm text-ink uppercase outline-none transition-colors',
            draftValid ? 'border-hairline focus:border-brand-500' : 'border-critical',
          )}
        />

        <span
          aria-hidden
          style={{ background: value }}
          className="size-8.5 shrink-0 rounded-control border border-hairline"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ preset */

interface AccentOptionProps {
  id: AccentId
  name: string
  note: string
  swatch: string
  selected: boolean
  onSelect: (id: AccentId) => void
}

function AccentOption({ id, name, note, swatch, selected, onSelect }: AccentOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(id)}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-card border p-3 text-left transition-[border-color,box-shadow]',
        selected
          ? 'border-brand-500 shadow-hairline ring-1 ring-brand-500'
          : 'border-hairline hover:border-line-strong',
      )}
    >
      <span
        aria-hidden
        style={{ background: swatch }}
        className="grid size-8 shrink-0 place-items-center rounded-full"
      >
        {selected ? <Icon name="check" size={14} strokeWidth={2.6} className="text-white" /> : null}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-ink">{name}</span>
          {id === DEFAULT_ACCENT ? (
            <Badge tone="neutral" className="shrink-0">
              Default
            </Badge>
          ) : null}
        </span>
        <span className="block truncate text-xs text-ink-muted">{note}</span>
      </span>
    </button>
  )
}
