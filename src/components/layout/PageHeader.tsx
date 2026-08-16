import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  /** Renders a back affordance above the title. */
  backTo?: { to: string; label: string }
  className?: string
}

/** In-content header for screens that need a title row above their cards. */
export function PageHeader({ title, description, actions, backTo, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-end gap-3', className)}>
      <div className="min-w-0">
        {backTo ? (
          <Link
            to={backTo.to}
            className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-brand-600"
          >
            <Icon name="arrowLeft" size={12} strokeWidth={2.2} />
            {backTo.label}
          </Link>
        ) : null}
        <h2 className="truncate text-[22px] leading-tight font-bold tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
