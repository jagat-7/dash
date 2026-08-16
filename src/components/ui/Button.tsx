import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'quiet'
  | 'danger'
  | 'success'
  | 'delete'
  | 'decline'
  | 'verify'
  | 'hold'
  | 'approve'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-on-brand hover:bg-brand-500 active:bg-brand-700',
  secondary:
    'bg-surface text-ink-soft border border-hairline hover:bg-subtle hover:text-ink hover:border-brand-600/40',
  ghost: 'bg-transparent text-ink-muted hover:bg-subtle hover:text-ink',
  quiet: 'bg-surface text-brand-600 border border-hairline hover:bg-brand-50 hover:border-brand-600',
  danger: 'bg-emergency text-on-brand hover:bg-critical active:bg-critical-deep',
  success: 'bg-success text-on-brand hover:bg-success-deep',
  // Specific Workflow Action Buttons
  delete:
    'bg-[#800000] text-white hover:bg-[#680000] active:bg-[#4d0000] shadow-2xs border border-black/15 font-bold tracking-wider uppercase active:scale-[0.98]',
  decline:
    'bg-[#EB5757] text-white hover:bg-[#d94343] active:bg-[#c53232] shadow-2xs border border-black/10 font-bold tracking-wider uppercase active:scale-[0.98]',
  verify:
    'bg-[#701A75] text-white hover:bg-[#58135c] active:bg-[#430e46] shadow-2xs border border-black/15 font-bold tracking-wider uppercase active:scale-[0.98]',
  hold:
    'bg-[#00BCD4] text-white hover:bg-[#00acc1] active:bg-[#0097a7] shadow-2xs border border-black/10 font-bold tracking-wider uppercase active:scale-[0.98]',
  approve:
    'bg-[#4CAF50] text-white hover:bg-[#43a047] active:bg-[#388e3c] shadow-2xs border border-black/10 font-bold tracking-wider uppercase active:scale-[0.98]',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1.5',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-[34px] px-3.5 text-sm gap-2',
  lg: 'h-[38px] px-5 text-sm gap-2',
  xl: 'h-11 px-5 text-md gap-2',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Fully rounded — used for the FAB and the login CTA. */
  pill?: boolean
  block?: boolean
  icon?: IconName
  iconRight?: IconName
  loading?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  block = false,
  icon,
  iconRight,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const iconSize = size === 'xs' || size === 'sm' ? 12 : 13

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center font-semibold whitespace-nowrap',
        'transition-[background-color,color,border-color,box-shadow] duration-150',
        'disabled:pointer-events-none disabled:opacity-55',
        pill ? 'rounded-full' : 'rounded-control',
        block && 'w-full',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : icon ? (
        <Icon name={icon} size={iconSize} strokeWidth={2.4} />
      ) : null}
      {children}
      {iconRight && !loading ? <Icon name={iconRight} size={iconSize} strokeWidth={2.4} /> : null}
    </button>
  )
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  label: string
  size?: number
  variant?: 'bordered' | 'ghost'
}

/** Square icon-only control — always carries an accessible name. */
export function IconButton({
  icon,
  label,
  size = 34,
  variant = 'bordered',
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      style={{ width: size, height: size }}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center rounded-control text-ink-muted transition-colors',
        variant === 'bordered' ? 'border border-hairline bg-surface hover:bg-subtle' : 'hover:bg-subtle',
        'hover:text-ink',
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={Math.round(size * 0.44)} strokeWidth={1.9} />
    </button>
  )
}
