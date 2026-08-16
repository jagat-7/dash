import { useState, type ReactNode } from 'react'
import { Icon } from './Icon'
import { Button } from './Button'
import { cn } from '@/lib/cn'

export interface ActiveFilter {
  id: string
  label: string
  value: string
  onClear: () => void
}

export interface FilterPanelProps {
  /** The filter controls themselves; laid out on a responsive grid. */
  children: ReactNode
  /** Chips summarising what is currently applied. */
  active?: ActiveFilter[]
  onClearAll?: () => void
  /** Start expanded — useful when arriving with filters already applied. */
  defaultOpen?: boolean
  /** Extra controls that stay on the bar even when the panel is collapsed. */
  toolbar?: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

/**
 * Show/hide filter drawer above a list.
 *
 * Collapsed by default so the table gets the vertical space; the toggle keeps
 * a live count, and applied filters stay visible as removable chips whether
 * the panel is open or shut — so nothing is ever silently filtering the data.
 */
export function FilterPanel({
  children,
  active = [],
  onClearAll,
  defaultOpen = false,
  toolbar,
  columns = 3,
  className,
}: FilterPanelProps) {
  const [open, setOpen] = useState(defaultOpen || active.length > 0)

  return (
    <section
      className={cn('overflow-hidden rounded-card border border-hairline bg-surface shadow-hairline', className)}
    >
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className={cn(
            'flex h-8 cursor-pointer items-center gap-2 rounded-control border px-3 text-sm font-semibold transition-colors',
            open || active.length
              ? 'border-brand-600 bg-brand-50 text-brand-600'
              : 'border-hairline bg-surface text-ink-soft hover:bg-subtle',
          )}
        >
          <Icon name="sliders" size={14} />
          Filters
          {active.length ? (
            <span className="grid size-4.5 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-on-brand">
              {active.length}
            </span>
          ) : null}
          <Icon
            name="chevronDown"
            size={12}
            strokeWidth={2.4}
            className={cn('transition-transform', open && 'rotate-180')}
          />
        </button>

        {toolbar}

        {active.length > 0 && onClearAll ? (
          <Button size="sm" variant="ghost" icon="close" className="ml-auto" onClick={onClearAll}>
            Clear all
          </Button>
        ) : null}
      </div>

      {active.length > 0 ? (
        <ul className="flex flex-wrap items-center gap-1.5 border-t border-hairline-teal bg-subtle px-3 py-2">
          {active.map((filter) => (
            <li key={filter.id}>
              <span className="inline-flex h-6.5 items-center gap-1.5 rounded-full border border-hairline bg-surface pr-1 pl-2.5 text-xs">
                <span className="text-ink-muted">{filter.label}:</span>
                <span className="font-semibold text-ink">{filter.value}</span>
                <button
                  type="button"
                  aria-label={`Remove ${filter.label} filter`}
                  onClick={filter.onClear}
                  className="cursor-pointer rounded-full p-0.5 text-ink-subtle transition-colors hover:text-ink"
                >
                  <Icon name="close" size={11} strokeWidth={2.6} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <div
          className={cn(
            'grid animate-fade-up gap-3.5 border-t border-hairline-teal p-3.5',
            columns === 2 && 'sm:grid-cols-2',
            columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {children}
        </div>
      ) : null}
    </section>
  )
}

export interface ColumnToggle {
  id: string
  label: string
  visible: boolean
  /** Always-on columns cannot be hidden. */
  locked?: boolean
}

/**
 * Show/hide column control. Pair with `DataTable` by filtering the column
 * array on `visible` before passing it in.
 */
export function ColumnVisibility({
  columns,
  onToggle,
  className,
}: {
  columns: ColumnToggle[]
  onToggle: (id: string, visible: boolean) => void
  className?: string
}) {
  const hidden = columns.filter((column) => !column.visible).length

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {columns.map((column) => (
        <label
          key={column.id}
          className={cn(
            'flex cursor-pointer items-center gap-2.5 rounded px-1 py-1 text-sm',
            column.locked && 'cursor-not-allowed opacity-55',
          )}
        >
          <input
            type="checkbox"
            checked={column.visible}
            disabled={column.locked}
            onChange={(event) => onToggle(column.id, event.target.checked)}
            className="size-4 cursor-pointer rounded-[4px] accent-brand-600"
          />
          <span className="flex-1 text-ink-soft">{column.label}</span>
          <Icon
            name={column.visible ? 'eye' : 'eyeOff'}
            size={13}
            className={column.visible ? 'text-ink-subtle' : 'text-ink-subtle/60'}
          />
        </label>
      ))}
      {hidden > 0 ? (
        <p className="mt-1 border-t border-hairline pt-2 text-2xs text-ink-subtle">
          {hidden} column{hidden === 1 ? '' : 's'} hidden
        </p>
      ) : null}
    </div>
  )
}
