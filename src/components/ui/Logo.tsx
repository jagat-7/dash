import { cn } from '@/lib/cn'
import { BRAND } from '@/data/brand'

export interface LogoMarkProps {
  size?: number
  className?: string
}

/**
 * Forward mark — modern forward motion double-chevron brand mark.
 * Drawn with `currentColor` so it inherits whatever ink it sits on;
 * no image asset, no network request.
 */
export function LogoMark({ size = 28, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <rect x="2" y="2" width="28" height="28" rx="7.5" fill="currentColor" fillOpacity="0.14" />
      <path
        d="M9 8.5L17 16L9 23.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 8.5L24.5 16L16.5 23.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    </svg>
  )
}

export interface LogoProps {
  /** `tile` puts the mark on a brand-filled square, `bare` draws it inline. */
  variant?: 'tile' | 'bare'
  size?: number
  showName?: boolean
  /** Use the long product name instead of the short one. */
  full?: boolean
  className?: string
  nameClassName?: string
}

export function Logo({
  variant = 'tile',
  size = 28,
  showName = true,
  full = false,
  className,
  nameClassName,
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {variant === 'tile' ? (
        <span
          style={{ width: size, height: size }}
          className="grid shrink-0 place-items-center rounded-control bg-brand-600 text-on-brand"
        >
          <LogoMark size={Math.round(size * 0.68)} />
        </span>
      ) : (
        <LogoMark size={size} />
      )}
      {showName ? (
        <span className={cn('text-md font-bold tracking-tight whitespace-nowrap', nameClassName)}>
          {full ? BRAND.fullName : BRAND.name}
        </span>
      ) : null}
    </span>
  )
}
