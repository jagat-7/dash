import type { HTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { Button } from './Button'
import { cn } from '@/lib/cn'
import { initials as toInitials } from '@/lib/format'

/* ---------------------------------------------------------------- Avatar */

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name: string
  size?: number
  tone?: 'brand' | 'blue'
  shape?: 'circle' | 'rounded'
}

export function Avatar({
  name,
  size = 30,
  tone = 'brand',
  shape = 'circle',
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.36)) }}
      title={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center font-bold select-none',
        shape === 'circle' ? 'rounded-full' : 'rounded-tile',
        tone === 'brand' ? 'bg-brand-100 text-brand-600' : 'bg-info-soft text-info',
        className,
      )}
      {...props}
    >
      {toInitials(name)}
    </span>
  )
}

/* --------------------------------------------------------------- Stepper */

export interface StepperProps {
  steps: readonly string[]
  /** 1-based index of the active step. */
  current: number
  className?: string
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-y-2', className)}>
      {steps.map((step, index) => {
        const number = index + 1
        const reached = current >= number
        const complete = current > number
        const isLast = index === steps.length - 1
        return (
          <li
            key={step}
            className={cn('flex min-w-0 items-center gap-2', !isLast && 'flex-1')}
            aria-current={current === number ? 'step' : undefined}
          >
            <span
              className={cn(
                'grid size-6.5 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors',
                reached ? 'bg-brand-600 text-on-brand' : 'bg-hairline text-ink-subtle',
              )}
            >
              {complete ? <Icon name="check" size={12} strokeWidth={3} /> : number}
            </span>
            <span
              className={cn(
                'truncate text-sm whitespace-nowrap',
                reached ? 'font-semibold text-ink' : 'font-medium text-ink-muted',
              )}
            >
              {step}
            </span>
            {!isLast ? (
              <span
                aria-hidden
                className={cn('mx-2 hidden h-[1.5px] flex-1 sm:block', complete ? 'bg-brand-600' : 'bg-hairline')}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

/* ----------------------------------------------------------- ProgressBar */

export interface ProgressBarProps {
  /** 0–100. */
  value: number
  tone?: 'success' | 'warning' | 'critical' | 'brand'
  height?: number
  label?: string
  className?: string
}

const progressTone = {
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
  brand: 'bg-brand-600',
} as const

export function ProgressBar({ value, tone = 'brand', height = 5, label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <span
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{ height }}
      className={cn('block w-full overflow-hidden rounded-full bg-canvas', className)}
    >
      <span
        style={{ width: `${clamped}%` }}
        className={cn('block h-full rounded-full transition-[width] duration-300', progressTone[tone])}
      />
    </span>
  )
}

/* ------------------------------------------------------------ EmptyState */

export interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({ icon = 'inbox', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-6 py-14 text-center', className)}>
      <span className="grid size-11 place-items-center rounded-full bg-subtle text-ink-subtle">
        <Icon name={icon} size={19} />
      </span>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-muted">{description}</p> : null}
      {action ? (
        <Button size="sm" variant="secondary" className="mt-2" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}

/* --------------------------------------------------------------- Tooltip */

export function Tooltip({
  content,
  side = 'top',
  children,
}: {
  content: ReactNode
  side?: 'top' | 'bottom' | 'right'
  children: ReactNode
}) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 hidden rounded-md bg-ink px-2 py-1 text-2xs font-medium whitespace-nowrap text-white opacity-0 shadow-lift transition-opacity',
          'group-hover/tooltip:block group-hover/tooltip:opacity-100 group-focus-within/tooltip:block group-focus-within/tooltip:opacity-100',
          side === 'top' && 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
          side === 'bottom' && 'top-full left-1/2 mt-1.5 -translate-x-1/2',
          side === 'right' && 'top-1/2 left-full ml-2 -translate-y-1/2',
        )}
      >
        {content}
      </span>
    </span>
  )
}

/* -------------------------------------------------------------- Skeleton */

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-hairline/70', className)} {...props} />
}
