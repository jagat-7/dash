import type { HTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

export type Tone = 'brand' | 'success' | 'warning' | 'critical' | 'info' | 'neutral' | 'violet'

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  critical: 'bg-critical-soft text-critical',
  info: 'bg-info-soft text-info',
  neutral: 'bg-neutral-soft text-neutral',
  violet: 'bg-violet-soft text-accent-violet',
}

/**
 * Solid fills use `text-on-brand`, not `text-white`: in dark mode the status
 * hues lighten, so the ink on top has to darken with them.
 */
const solidToneClasses: Record<Tone, string> = {
  brand: 'bg-brand-600 text-on-brand',
  success: 'bg-success text-on-brand',
  warning: 'bg-warning text-on-brand',
  critical: 'bg-critical text-on-brand',
  info: 'bg-info text-on-brand',
  neutral: 'bg-neutral text-on-brand',
  violet: 'bg-accent-violet text-on-brand',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  /** Filled treatment — reserved for hard stops such as allergy alerts. */
  solid?: boolean
  icon?: IconName
  /** `square` is used for problem-list chips inside the EMR. */
  shape?: 'pill' | 'square'
  size?: 'sm' | 'md'
  children: ReactNode
}

export function Badge({
  tone = 'neutral',
  solid = false,
  icon,
  shape = 'pill',
  size = 'sm',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold whitespace-nowrap',
        shape === 'pill' ? 'rounded-full' : 'rounded-md',
        size === 'sm' ? 'h-5 px-2.5 text-2xs' : 'h-6.5 px-3 text-xs',
        solid ? solidToneClasses[tone] : toneClasses[tone],
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 10 : 12} strokeWidth={2.6} /> : null}
      {children}
    </span>
  )
}

/** Coloured count bubble used on sidebar nav items. */
export function CountBadge({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emergency px-1 text-[9px] font-bold text-white',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
