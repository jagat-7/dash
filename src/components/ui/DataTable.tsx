import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Column<T> {
  id: string
  header: ReactNode
  /** A CSS grid track: `90px`, `1.4fr`, `minmax(0,1fr)` … */
  width: string
  align?: 'left' | 'right' | 'center'
  cell: (row: T, index: number) => ReactNode
  headClassName?: string
  cellClassName?: string
}

export interface DataTableProps<T> {
  columns: readonly Column<T>[]
  rows: readonly T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  selectedId?: string | null
  rowClassName?: (row: T, index: number) => string | undefined
  /** Alternates row background colors (zebra striping) for enhanced readability */
  striped?: boolean
  /** Below this width the table scrolls horizontally instead of squashing. */
  minWidth?: number
  emptyState?: ReactNode
  rowHeight?: number
  className?: string
}

const alignClass = {
  left: 'justify-start text-left',
  right: 'justify-end text-right',
  center: 'justify-center text-center',
} as const

/**
 * Grid-based table. A real `<table>` cannot express the `1.4fr` style tracks
 * this design uses, so the grid carries explicit ARIA table roles instead —
 * assistive tech still announces rows, columns and headers correctly.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  selectedId,
  rowClassName,
  striped = true,
  minWidth = 760,
  emptyState,
  rowHeight = 44,
  className,
}: DataTableProps<T>) {
  const template = columns.map((column) => column.width).join(' ')
  const interactive = Boolean(onRowClick)

  return (
    <div className={cn('scrollbar-slim overflow-x-auto', className)}>
      <div role="table" style={{ minWidth }}>
        <div role="rowgroup" className="sticky top-0 z-10 shadow-2xs">
          <div
            role="row"
            className="grid items-center border-b border-hairline-teal bg-subtle px-5"
            style={{ gridTemplateColumns: template }}
          >
            {columns.map((column) => (
              <div
                key={column.id}
                role="columnheader"
                className={cn(
                  'flex items-center py-2.5 text-2xs font-semibold tracking-[0.05em] text-ink-subtle uppercase',
                  alignClass[column.align ?? 'left'],
                  column.headClassName,
                )}
              >
                {column.header}
              </div>
            ))}
          </div>
        </div>

        <div role="rowgroup">
          {rows.map((row, index) => {
            const id = getRowId(row)
            const selected = selectedId === id
            const isOdd = index % 2 === 1
            return (
              <div
                key={id}
                role="row"
                aria-selected={interactive ? selected : undefined}
                tabIndex={interactive ? 0 : undefined}
                onClick={interactive ? () => onRowClick?.(row) : undefined}
                onKeyDown={
                  interactive
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          onRowClick?.(row)
                        }
                      }
                    : undefined
                }
                className={cn(
                  'grid items-center border-b border-hairline-soft px-5 text-sm transition-colors',
                  striped ? (isOdd ? 'bg-[#F9FBFC] dark:bg-white/[0.02]' : 'bg-surface') : 'bg-surface',
                  interactive && 'cursor-pointer hover:bg-brand-50/60',
                  !interactive && 'hover:bg-subtle/80',
                  selected && '!bg-brand-50/80',
                  rowClassName?.(row, index),
                )}
                style={{ gridTemplateColumns: template, minHeight: rowHeight }}
              >
                {columns.map((column) => (
                  <div
                    key={column.id}
                    role="cell"
                    className={cn(
                      'flex min-w-0 items-center py-1.5',
                      alignClass[column.align ?? 'left'],
                      column.cellClassName,
                    )}
                  >
                    {column.cell(row, index)}
                  </div>
                ))}
              </div>
            )
          })}

          {rows.length === 0 ? (
            <div role="row">
              <div role="cell" className="px-5 py-14 text-center text-sm text-ink-subtle">
                {emptyState ?? 'Nothing to show here yet.'}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Truncating text cell — the default for most string columns. */
export function Cell({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('truncate text-ink-body', className)}>{children}</span>
}

/** Monospaced identifier cell (patient IDs, invoice numbers, order numbers). */
export function IdCell({ children }: { children: ReactNode }) {
  return <span className="truncate font-mono text-xs text-ink-subtle">{children}</span>
}

/** Right-aligned currency cell. */
export function AmountCell({ children }: { children: ReactNode }) {
  return (
    <span data-numeric className="truncate font-semibold text-ink">
      {children}
    </span>
  )
}
