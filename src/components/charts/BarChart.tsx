import { useState, type ReactNode } from 'react'
import { CATEGORICAL, SERIES, SURFACE, TRACK } from './palette'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------ Chart card */

export interface ChartCardProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  /** Rendered under the plot; omit for single-series charts. */
  legend?: ReactNode
  children: ReactNode
  className?: string
}

/** Consistent frame for every chart: title block, plot, optional legend. */
export function ChartCard({ title, description, actions, legend, children, className }: ChartCardProps) {
  return (
    <section
      className={cn('overflow-hidden rounded-card border border-hairline bg-surface shadow-card', className)}
    >
      <header className="flex flex-wrap items-start gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">{title}</h3>
          {description ? <p className="mt-0.5 truncate text-xs text-ink-muted">{description}</p> : null}
        </div>
        {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
      </header>
      <div className="px-5 pb-4">{children}</div>
      {legend ? <div className="border-t border-hairline-teal px-5 py-3">{legend}</div> : null}
    </section>
  )
}

/* ---------------------------------------------------------------- Legend */

export interface LegendEntry {
  label: string
  color: string
  value?: string
}

export function Legend({ entries, className }: { entries: LegendEntry[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {entries.map((entry) => (
        <li key={entry.label} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-[3px]"
            style={{ background: entry.color, boxShadow: `0 0 0 1px ${SURFACE}` }}
          />
          <span className="text-xs text-ink-soft">{entry.label}</span>
          {entry.value ? (
            <span data-numeric className="text-xs font-semibold text-ink">
              {entry.value}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------------- BarChart */

export interface BarDatum {
  label: string
  value: number
  /** Overrides the series colour — use for status-coded bars only. */
  color?: string
}

export interface BarChartProps {
  data: readonly BarDatum[]
  height?: number
  format?: (value: number) => string
  /** Draws a dashed reference line, e.g. a target or reorder level. */
  reference?: { value: number; label: string }
  className?: string
}

/**
 * Vertical bars for comparing magnitude across a handful of categories.
 * Bars are thin with rounded data-ends anchored to the baseline, and each
 * carries a hover tooltip.
 */
export function BarChart({ data, height = 170, format = String, reference, className }: BarChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value), reference?.value ?? 0) || 1

  return (
    <div className={className}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((datum, index) => {
          const ratio = datum.value / max
          return (
            <div
              key={datum.label}
              className="group relative flex h-full flex-1 flex-col justify-end"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {active === index ? (
                <div className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2 py-1 text-2xs font-medium whitespace-nowrap text-white shadow-lift">
                  {datum.label} · {format(datum.value)}
                </div>
              ) : null}
              {/* Thin mark: capped width, centred, rounded data-end on top. */}
              <div
                style={{
                  height: `${Math.max(ratio * 100, 1.5)}%`,
                  background: datum.color ?? SERIES,
                }}
                className="mx-auto w-full max-w-11 rounded-t-[4px] transition-[height,opacity] duration-300 group-hover:opacity-85"
              />
            </div>
          )
        })}
      </div>

      {reference ? (
        <div className="relative">
          <div
            className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-ink-subtle"
            style={{ bottom: (reference.value / max) * height }}
          />
        </div>
      ) : null}

      <div className="mt-2 flex gap-1.5">
        {data.map((datum) => (
          <span key={datum.label} className="flex-1 truncate text-center text-3xs text-ink-subtle">
            {datum.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------- HorizontalBarChart */

/**
 * Ranking list — labels stay readable however long they are.
 *
 * This encodes magnitude, not identity, so every bar uses the single series
 * hue by default. Cycling categorical colours here would imply the rows are
 * different series and would repaint them whenever the ranking changed.
 */
export function HorizontalBarChart({
  data,
  format = String,
  className,
}: {
  data: readonly BarDatum[]
  format?: (value: number) => string
  className?: string
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <ul className={cn('flex flex-col gap-2.5', className)}>
      {data.map((datum) => (
        <li key={datum.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="truncate text-xs text-ink-soft">{datum.label}</span>
            <span data-numeric className="shrink-0 text-xs font-semibold text-ink">
              {format(datum.value)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: TRACK }}>
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${(datum.value / max) * 100}%`,
                background: datum.color ?? SERIES,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------ StackedBarChart */

export interface StackedSeries {
  label: string
  color?: string
}

export interface StackedDatum {
  label: string
  /** One value per series, in the same order as `series`. */
  values: number[]
}

/**
 * Composition over categories. Segments carry a 2px surface gap so adjacent
 * fills stay separable, and the legend names every series.
 */
export function StackedBarChart({
  series,
  data,
  height = 170,
  format = String,
  className,
}: {
  series: StackedSeries[]
  data: StackedDatum[]
  height?: number
  format?: (value: number) => string
  className?: string
}) {
  const [active, setActive] = useState<string | null>(null)
  const totals = data.map((datum) => datum.values.reduce((sum, value) => sum + value, 0))
  const max = Math.max(...totals) || 1

  return (
    <div className={className}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((datum, columnIndex) => {
          const total = totals[columnIndex]!
          return (
            <div
              key={datum.label}
              className="relative flex h-full flex-1 flex-col justify-end gap-0.5"
              onMouseEnter={() => setActive(datum.label)}
              onMouseLeave={() => setActive(null)}
            >
              {active === datum.label ? (
                <div className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2 py-1.5 text-2xs whitespace-nowrap text-white shadow-lift">
                  <p className="font-semibold">{datum.label}</p>
                  {series.map((entry, index) => (
                    <p key={entry.label} className="mt-0.5 opacity-90">
                      {entry.label}: {format(datum.values[index] ?? 0)}
                    </p>
                  ))}
                </div>
              ) : null}

              {[...datum.values].reverse().map((value, reversedIndex) => {
                const index = datum.values.length - 1 - reversedIndex
                const entry = series[index]!
                return (
                  <div
                    key={entry.label}
                    style={{
                      height: `${(value / max) * 100}%`,
                      background: entry.color ?? CATEGORICAL[index % CATEGORICAL.length],
                    }}
                    className={cn(
                      'w-full transition-[height] duration-300',
                      reversedIndex === 0 && 'rounded-t-[4px]',
                    )}
                  />
                )
              })}
              <span className="sr-only">{`${datum.label}: ${format(total)}`}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex gap-2">
        {data.map((datum) => (
          <span key={datum.label} className="flex-1 truncate text-center text-3xs text-ink-subtle">
            {datum.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- Sparkbar */

/** Tiny inline bar series for table cells and stat tiles. */
export function Sparkbars({
  values,
  height = 26,
  className,
}: {
  values: number[]
  height?: number
  className?: string
}) {
  const max = Math.max(...values) || 1
  return (
    <span className={cn('inline-flex items-end gap-0.5', className)} style={{ height }}>
      {values.map((value, index) => (
        <span
          key={index}
          style={{ height: `${Math.max((value / max) * 100, 8)}%`, background: SERIES }}
          className="w-1 rounded-t-[2px] opacity-80"
        />
      ))}
    </span>
  )
}

/* --------------------------------------------------------------- Heatmap */

/**
 * Density grid — one hue, light to dark. Intensity is also exposed in the
 * cell title so the value never depends on colour alone.
 */
export function Heatmap({
  rows,
  columns,
  values,
  format = String,
  className,
}: {
  rows: string[]
  columns: string[]
  /** values[rowIndex][columnIndex] */
  values: number[][]
  format?: (value: number) => string
  className?: string
}) {
  const flat = values.flat()
  const max = Math.max(...flat) || 1

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-0.5">
        <thead>
          <tr>
            <th />
            {columns.map((column) => (
              <th key={column} className="pb-1 text-3xs font-medium text-ink-subtle">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row}>
              <th className="pr-2 text-right text-3xs font-medium whitespace-nowrap text-ink-subtle">{row}</th>
              {columns.map((column, columnIndex) => {
                const value = values[rowIndex]?.[columnIndex] ?? 0
                const intensity = value / max
                return (
                  <td key={column} className="p-0">
                    <div
                      title={`${row} · ${column}: ${format(value)}`}
                      style={{
                        background:
                          intensity === 0
                            ? TRACK
                            : `color-mix(in srgb, ${SERIES} ${Math.round(12 + intensity * 88)}%, white)`,
                      }}
                      className="h-7 w-full rounded-[3px] transition-transform hover:scale-105"
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
