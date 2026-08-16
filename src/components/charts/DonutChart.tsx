import type { ReactNode } from 'react'
import { CATEGORICAL, SURFACE, TRACK } from './palette'
import { cn } from '@/lib/cn'

export interface DonutSegment {
  label: string
  /** Any positive number — shares are computed from the total. */
  value: number
  /** Overrides the palette slot. Use only for status-coded data. */
  color?: string
  /** Displayed in the legend instead of the computed percentage. */
  display?: string
}

export interface DonutChartProps {
  segments: readonly DonutSegment[]
  size?: number
  thickness?: number
  /** Big number in the hole — omit for a pure category breakdown. */
  centerValue?: ReactNode
  centerLabel?: ReactNode
  legend?: boolean
  className?: string
}

/**
 * Ring chart for part-to-whole. Segments carry a 2px surface gap so adjacent
 * fills stay separable for colorblind readers, and the legend direct-labels
 * every series — identity is never conveyed by color alone.
 */
export function DonutChart({
  segments,
  size = 90,
  thickness = 12,
  centerValue,
  centerLabel,
  legend = true,
  className,
}: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  // 2px of surface between fills, expressed on the circumference.
  const gap = segments.length > 1 ? 2 : 0

  let offset = 0
  const arcs = segments.map((segment, index) => {
    const share = segment.value / total
    const length = Math.max(share * circumference - gap, 0)
    const arc = {
      key: segment.label,
      color: segment.color ?? CATEGORICAL[index % CATEGORICAL.length]!,
      dash: `${length} ${circumference - length}`,
      offset: -offset,
      percent: Math.round(share * 100),
    }
    offset += share * circumference
    return arc
  })

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="presentation">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={TRACK}
            strokeWidth={thickness}
          />
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeDasharray={arc.dash}
              strokeDashoffset={arc.offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              // A surface-colored ring keeps overlapping ends readable.
              paintOrder="stroke"
              style={{ transition: 'stroke-dasharray .35s ease' }}
            />
          ))}
        </svg>
        {centerValue !== undefined ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span data-numeric className="text-md font-bold text-ink">
              {centerValue}
            </span>
            {centerLabel ? <span className="text-3xs text-ink-subtle">{centerLabel}</span> : null}
          </div>
        ) : null}
      </div>

      {legend ? (
        <ul className="flex min-w-0 flex-1 flex-col gap-1.5">
          {segments.map((segment, index) => (
            <li key={segment.label} className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-[7px] shrink-0 rounded-[2px]"
                style={{
                  background: segment.color ?? CATEGORICAL[index % CATEGORICAL.length],
                  boxShadow: `0 0 0 1px ${SURFACE}`,
                }}
              />
              <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">{segment.label}</span>
              <span data-numeric className="text-xs font-semibold text-ink">
                {segment.display ?? `${Math.round((segment.value / total) * 100)}%`}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export interface GaugeProps {
  /** 0–100. */
  percent: number
  size?: number
  thickness?: number
  color?: string
  label?: ReactNode
  className?: string
}

/** Single-value ring meter — one number, so no legend and no categorical hues. */
export function Gauge({
  percent,
  size = 90,
  thickness = 12,
  color = CATEGORICAL[0],
  label = 'in use',
  className,
}: GaugeProps) {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const filled = (Math.max(0, Math.min(100, percent)) / 100) * circumference

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${percent}% ${typeof label === 'string' ? label : ''}`}
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={TRACK} strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray .4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span data-numeric className="text-md font-bold text-ink">
          {percent}%
        </span>
        <span className="text-3xs text-ink-subtle">{label}</span>
      </div>
    </div>
  )
}
