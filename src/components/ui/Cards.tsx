import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import { ProgressBar } from './Misc'
import { cn } from '@/lib/cn'
import type { Tone } from './Badge'

/* -------------------------------------------------------------- CardGrid */

/** Auto-filling responsive grid — the default container for card sets. */
export function CardGrid({
  min = 240,
  gap = 12,
  children,
  className,
}: {
  min?: number
  gap?: number
  children: ReactNode
  className?: string
}) {
  return (
    <div
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap }}
      className={cn('grid items-start', className)}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------- StatCard */

const toneRing: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  critical: 'bg-critical-soft text-critical',
  info: 'bg-info-soft text-info',
  neutral: 'bg-neutral-soft text-ink-muted',
  violet: 'bg-violet-soft text-accent-violet',
}

export interface StatCardProps {
  label: string
  value: ReactNode
  icon?: IconName
  tone?: Tone
  trend?: { value: string; direction: 'up' | 'down' | 'flat'; caption?: string }
  /** Rendered under the value — typically a Sparkline or Sparkbars. */
  visual?: ReactNode
  to?: string
  className?: string
}

/**
 * The richest metric card: icon chip, large value, trend line and an optional
 * inline visual. Becomes a link when `to` is supplied.
 */
export function StatCard({ label, value, icon, tone = 'brand', trend, visual, to, className }: StatCardProps) {
  const trendClass =
    trend?.direction === 'up'
      ? 'text-success'
      : trend?.direction === 'down'
        ? 'text-critical'
        : 'text-ink-muted'

  const body = (
    <>
      <div className="flex items-start gap-3">
        {icon ? (
          <span className={cn('grid size-9 shrink-0 place-items-center rounded-tile', toneRing[tone])}>
            <Icon name={icon} size={17} />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-2xs font-bold tracking-[0.06em] text-ink-subtle uppercase">{label}</p>
          <p data-numeric className="mt-1.5 text-2xl leading-none font-bold tracking-tight text-ink">
            {value}
          </p>
        </div>
        {to ? (
          <Icon name="arrowRight" size={14} className="mt-1 shrink-0 text-ink-subtle" />
        ) : null}
      </div>

      {visual ? <div className="mt-3">{visual}</div> : null}

      {trend ? (
        <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className={cn('font-semibold', trendClass)}>
            {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '—'} {trend.value}
          </span>
          {trend.caption ? <span className="text-ink-muted">{trend.caption}</span> : null}
        </p>
      ) : null}
    </>
  )

  const shell = cn(
    'block rounded-card border border-hairline bg-surface p-4 shadow-card transition-[box-shadow,border-color] duration-150',
    to && 'hover:border-brand-600/40 hover:shadow-lift',
    className,
  )

  return to ? (
    <Link to={to} className={shell}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
  )
}

/* ---------------------------------------------------------- ProgressCard */

export function ProgressCard({
  label,
  value,
  total,
  unit,
  tone = 'brand',
  caption,
  className,
}: {
  label: string
  value: number
  total: number
  unit?: string
  tone?: 'brand' | 'success' | 'warning' | 'critical'
  caption?: ReactNode
  className?: string
}) {
  const percent = total ? Math.round((value / total) * 100) : 0
  return (
    <div className={cn('rounded-card border border-hairline bg-surface p-4 shadow-card', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-2xs font-bold tracking-[0.06em] text-ink-subtle uppercase">{label}</p>
        <p data-numeric className="shrink-0 text-sm font-semibold text-ink">
          {percent}%
        </p>
      </div>
      <p data-numeric className="mt-2 text-xl font-bold tracking-tight text-ink">
        {value.toLocaleString('en-IN')}
        <span className="text-sm font-medium text-ink-subtle">
          {' / '}
          {total.toLocaleString('en-IN')} {unit}
        </span>
      </p>
      <ProgressBar value={percent} tone={tone} label={`${label} ${percent}%`} className="mt-3" height={6} />
      {caption ? <p className="mt-2 text-xs text-ink-muted">{caption}</p> : null}
    </div>
  )
}

/* ------------------------------------------------------------ ActionCard */

export function ActionCard({
  icon,
  title,
  description,
  tone = 'brand',
  to,
  onClick,
  className,
}: {
  icon: IconName
  title: string
  description: string
  tone?: Tone
  to?: string
  onClick?: () => void
  className?: string
}) {
  const inner = (
    <>
      <span className={cn('grid size-10 shrink-0 place-items-center rounded-tile', toneRing[tone])}>
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-xs text-ink-muted">{description}</span>
      </span>
      <Icon name="chevronRight" size={14} className="shrink-0 text-ink-subtle" />
    </>
  )

  const shell = cn(
    'flex w-full cursor-pointer items-center gap-3 rounded-card border border-hairline bg-surface p-4 text-left shadow-hairline transition-[box-shadow,border-color] duration-150 hover:border-brand-600/40 hover:shadow-lift',
    className,
  )

  return to ? (
    <Link to={to} className={shell}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={shell}>
      {inner}
    </button>
  )
}

/* -------------------------------------------------------------- InfoCard */

/** Titled container for arbitrary content, with an optional footer link. */
export function InfoCard({
  title,
  icon,
  action,
  footer,
  children,
  className,
}: {
  title: ReactNode
  icon?: IconName
  action?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn('overflow-hidden rounded-card border border-hairline bg-surface shadow-card', className)}
    >
      <header className="flex items-center gap-2.5 border-b border-hairline-teal px-4 py-3">
        {icon ? <Icon name={icon} size={15} className="text-ink-muted" /> : null}
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{title}</h3>
        {action}
      </header>
      <div className="p-4">{children}</div>
      {footer ? (
        <footer className="border-t border-hairline-teal bg-subtle px-4 py-2.5 text-xs">{footer}</footer>
      ) : null}
    </section>
  )
}
