import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional 3px gradient strip along the top edge (KPI cards). */
  accent?: string
  /** Lifts on hover — for cards that are themselves clickable. */
  interactive?: boolean
  elevation?: 'flat' | 'card'
}

export function Card({
  accent,
  interactive = false,
  elevation = 'card',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border border-hairline bg-surface',
        elevation === 'card' ? 'shadow-card' : 'shadow-hairline',
        interactive &&
          'transition-[box-shadow,border-color] duration-150 hover:border-line-strong hover:shadow-lift',
        className,
      )}
      {...props}
    >
      {accent ? <div className="h-[3px] w-full" style={{ background: accent }} /> : null}
      {children}
    </div>
  )
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  /** Removes the bottom hairline when the header floats above padded content. */
  bare?: boolean
}

export function CardHeader({
  title,
  description,
  actions,
  bare = false,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-5 py-3.5',
        !bare && 'border-b border-hairline-teal',
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-0.5 truncate text-xs text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-t border-hairline-teal bg-subtle px-5 py-2.5',
        className,
      )}
      {...props}
    />
  )
}

/** Small all-caps eyebrow used above groups inside a card. */
export function SectionLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-2.5 text-2xs font-bold tracking-[0.06em] text-ink-subtle uppercase', className)}
      {...props}
    />
  )
}
