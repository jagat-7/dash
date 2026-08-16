import { useId, useState } from 'react'
import { AXIS_INK, SERIES, SURFACE } from './palette'
import { cn } from '@/lib/cn'

export interface LinePoint {
  label: string
  value: number
}

interface Geometry {
  x: number
  y: number
}

/** Maps values onto the plot box, padding the range so the line never hugs an edge. */
function project(points: readonly LinePoint[], width: number, height: number, pad: number): Geometry[] {
  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = points.length > 1 ? width / (points.length - 1) : 0
  return points.map((point, index) => ({
    x: Math.round(index * step),
    y: Math.round(height - pad - ((point.value - min) / range) * (height - pad * 2)),
  }))
}

export interface TrendLineProps {
  points: readonly LinePoint[]
  /** Label of the point to emphasise — typically the current, partial period. */
  highlight?: string
  /** Formats the tooltip value. */
  format?: (point: LinePoint) => string
  height?: number
  showAxis?: boolean
  className?: string
}

/**
 * Single-series trend line with an area wash. One series, so no legend — the
 * card title names it. Every point carries a full-height hover target that
 * raises a crosshair and tooltip.
 */
export function TrendLine({
  points,
  highlight,
  format = (point) => String(point.value),
  height = 150,
  showAxis = true,
  className,
}: TrendLineProps) {
  const gradientId = useId()
  const [active, setActive] = useState<number | null>(null)
  const width = 760
  const geometry = project(points, width, height, 12)
  const line = geometry.map((point) => `${point.x},${point.y}`).join(' ')
  const area = `${line} ${width},${height} 0,${height}`
  const slot = points.length > 1 ? width / (points.length - 1) : width

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Trend from ${points[0]?.label} to ${points.at(-1)?.label}`}
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES} stopOpacity="0.12" />
            <stop offset="100%" stopColor={SERIES} stopOpacity="0" />
          </linearGradient>
        </defs>

        <polyline points={area} fill={`url(#${gradientId})`} stroke="none" />
        <polyline
          points={line}
          fill="none"
          stroke={SERIES}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {active !== null && geometry[active] ? (
          <line
            x1={geometry[active].x}
            x2={geometry[active].x}
            y1={0}
            y2={height}
            stroke={AXIS_INK}
            strokeWidth={1}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}

        {geometry.map((point, index) => {
          const item = points[index]!
          const emphasised = item.label === highlight || active === index
          return (
            <circle
              key={item.label}
              cx={point.x}
              cy={point.y}
              r={emphasised ? 5 : 3}
              fill={emphasised ? SERIES : '#BFDBFE'}
              stroke={SURFACE}
              strokeWidth={emphasised ? 2 : 1.5}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        {/* Invisible hit targets — wider than the marks, per point. */}
        {geometry.map((point, index) => (
          <rect
            key={`hit-${points[index]!.label}`}
            x={point.x - slot / 2}
            y={0}
            width={slot}
            height={height}
            fill="transparent"
            onMouseEnter={() => setActive(index)}
          />
        ))}
      </svg>

      {active !== null && geometry[active] ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2 py-1 text-2xs font-medium whitespace-nowrap text-white shadow-lift"
          style={{
            left: `${(geometry[active].x / width) * 100}%`,
            top: `${(geometry[active].y / height) * 100}%`,
            marginTop: -8,
          }}
        >
          {points[active]!.label} · {format(points[active]!)}
        </div>
      ) : null}

      {showAxis ? (
        // justify-between (not flex-1 slots) so each label sits under its point:
        // the first point is at x=0 and the last at x=width.
        <div className="mt-1.5 flex justify-between">
          {points.map((point) => (
            <span
              key={point.label}
              className={cn(
                'text-3xs',
                point.label === highlight ? 'font-semibold text-brand-500' : 'text-ink-subtle',
              )}
            >
              {point.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export interface SparklineProps {
  points: readonly LinePoint[]
  format?: (point: LinePoint) => string
  height?: number
  className?: string
}

/** Compact 7-point trend for a card. Same interaction contract as TrendLine. */
export function Sparkline({ points, format = (point) => String(point.value), height = 70, className }: SparklineProps) {
  const gradientId = useId()
  const [active, setActive] = useState<number | null>(null)
  const width = 240
  const geometry = project(points, width, height, 6)
  const line = geometry.map((point) => `${point.x},${point.y}`).join(' ')
  const area = `${line} ${width},${height} 0,${height}`
  const slot = points.length > 1 ? width / (points.length - 1) : width

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Trend across ${points.length} periods`}
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES} stopOpacity="0.12" />
            <stop offset="100%" stopColor={SERIES} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={area} fill={`url(#${gradientId})`} stroke="none" />
        <polyline
          points={line}
          fill="none"
          stroke={SERIES}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {active !== null && geometry[active] ? (
          <circle
            cx={geometry[active].x}
            cy={geometry[active].y}
            r={4.5}
            fill={SERIES}
            stroke={SURFACE}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
        {geometry.map((point, index) => (
          <rect
            key={`hit-${points[index]!.label}`}
            x={point.x - slot / 2}
            y={0}
            width={slot}
            height={height}
            fill="transparent"
            onMouseEnter={() => setActive(index)}
          />
        ))}
      </svg>

      {active !== null && geometry[active] ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2 py-1 text-2xs font-medium whitespace-nowrap text-white shadow-lift"
          style={{
            left: `${(geometry[active].x / width) * 100}%`,
            top: `${(geometry[active].y / height) * 100}%`,
            marginTop: -8,
          }}
        >
          {points[active]!.label} · {format(points[active]!)}
        </div>
      ) : null}

      <div className="mt-1.5 flex justify-between">
        {points.map((point) => (
          <span key={point.label} className="text-3xs text-ink-subtle">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  )
}
