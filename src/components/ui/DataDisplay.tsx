import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import { Avatar } from './Misc'
import { cn } from '@/lib/cn'

/* ----------------------------------------------------------- Breadcrumbs */

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-xs">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link to={item.to} className="text-ink-muted transition-colors hover:text-brand-600">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'font-semibold text-ink' : 'text-ink-muted'}>{item.label}</span>
              )}
              {!last ? (
                <Icon name="chevronRight" size={11} strokeWidth={2.2} className="text-ink-subtle" />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* -------------------------------------------------------------- Toolbar */

export function Toolbar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="toolbar"
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-card border border-hairline bg-surface px-3 py-2 shadow-hairline',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Divider({
  orientation = 'horizontal',
  label,
  className,
}: {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}) {
  if (orientation === 'vertical') {
    return <span aria-hidden className={cn('mx-1 h-5 w-px shrink-0 bg-hairline', className)} />
  }
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-2xs font-semibold tracking-[0.06em] text-ink-subtle uppercase">{label}</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>
    )
  }
  return <hr className={cn('border-0 border-t border-hairline', className)} />
}

/* ------------------------------------------------------- DescriptionList */

export interface DescriptionItem {
  label: ReactNode
  value: ReactNode
  /** Spans the full width in a multi-column list. */
  full?: boolean
}

export function DescriptionList({
  items,
  columns = 2,
  className,
}: {
  items: DescriptionItem[]
  columns?: 1 | 2 | 3
  className?: string
}) {
  return (
    <dl
      className={cn(
        'grid gap-x-6 gap-y-3.5',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-3',
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={index} className={cn('min-w-0', item.full && 'sm:col-span-full')}>
          <dt className="text-2xs font-semibold tracking-[0.05em] text-ink-subtle uppercase">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ------------------------------------------------------------- StatTile */

export interface StatTileProps {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: IconName
  trend?: { value: string; direction: 'up' | 'down' | 'flat' }
  className?: string
}

/** Compact metric block for dense KPI rows — smaller than a KpiCard. */
export function StatTile({ label, value, hint, icon, trend, className }: StatTileProps) {
  const trendClass =
    trend?.direction === 'up'
      ? 'text-success'
      : trend?.direction === 'down'
        ? 'text-critical'
        : 'text-ink-muted'

  return (
    <div className={cn('rounded-field border border-hairline bg-surface p-3.5', className)}>
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="grid size-6 place-items-center rounded-md bg-brand-50 text-brand-600">
            <Icon name={icon} size={12} />
          </span>
        ) : null}
        <span className="text-2xs font-semibold tracking-[0.05em] text-ink-subtle uppercase">{label}</span>
      </div>
      <p data-numeric className="mt-2 text-xl leading-none font-bold tracking-tight text-ink">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5">
        {trend ? (
          <span className={cn('flex items-center gap-0.5 text-xs font-semibold', trendClass)}>
            {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '—'} {trend.value}
          </span>
        ) : null}
        {hint ? <span className="truncate text-xs text-ink-muted">{hint}</span> : null}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- AvatarGroup */

export function AvatarGroup({
  names,
  max = 4,
  size = 28,
  className,
}: {
  names: string[]
  max?: number
  size?: number
  className?: string
}) {
  const shown = names.slice(0, max)
  const overflow = names.length - shown.length
  return (
    <div className={cn('flex items-center', className)}>
      {shown.map((name) => (
        <Avatar key={name} name={name} size={size} className="-ml-2 ring-2 ring-surface first:ml-0" />
      ))}
      {overflow > 0 ? (
        <span
          style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
          className="-ml-2 inline-flex items-center justify-center rounded-full bg-neutral-soft font-bold text-ink-muted ring-2 ring-surface"
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------- Presence */

export function StatusDot({
  tone = 'success',
  label,
  pulse = false,
}: {
  tone?: 'success' | 'warning' | 'critical' | 'neutral'
  label: string
  pulse?: boolean
}) {
  const toneClass = {
    success: 'bg-success',
    warning: 'bg-warning',
    critical: 'bg-critical',
    neutral: 'bg-ink-subtle',
  }[tone]

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <span className="relative flex size-2">
        {pulse ? (
          <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', toneClass)} />
        ) : null}
        <span className={cn('relative inline-flex size-2 rounded-full', toneClass)} />
      </span>
      {label}
    </span>
  )
}

/* ------------------------------------------------------- Vertical steps */

export interface TimelineStep {
  title: string
  detail?: string
  meta?: string
  state: 'done' | 'current' | 'todo'
}

/** Vertical process tracker — distinct from the horizontal wizard Stepper. */
export function StepTrail({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn('flex flex-col', className)}>
      {steps.map((step, index) => {
        const last = index === steps.length - 1
        return (
          <li key={step.title} className="flex gap-3 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold',
                  step.state === 'done' && 'bg-brand-600 text-on-brand',
                  step.state === 'current' && 'bg-brand-50 text-brand-600 ring-2 ring-brand-600',
                  step.state === 'todo' && 'bg-neutral-soft text-ink-subtle',
                )}
              >
                {step.state === 'done' ? <Icon name="check" size={11} strokeWidth={3} /> : index + 1}
              </span>
              {!last ? (
                <span className={cn('mt-1 w-px flex-1', step.state === 'done' ? 'bg-brand-600/40' : 'bg-hairline')} />
              ) : null}
            </div>
            <div className="min-w-0 pb-1">
              <p
                className={cn(
                  'text-sm',
                  step.state === 'todo' ? 'font-medium text-ink-muted' : 'font-semibold text-ink',
                )}
              >
                {step.title}
                {step.meta ? <span className="ml-2 text-xs font-normal text-ink-subtle">{step.meta}</span> : null}
              </p>
              {step.detail ? <p className="mt-0.5 text-xs text-ink-muted">{step.detail}</p> : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
