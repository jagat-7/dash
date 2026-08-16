import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { Button } from './Button'
import { SearchSelect } from './SearchSelect'
import { cn } from '@/lib/cn'

/** `1 2 3 … 42` — keeps the control a fixed width regardless of page count. */
export function pageWindow(page: number, total: number, span = 1): (number | null)[] {
  if (total <= 5 + span * 2) return Array.from({ length: total }, (_, index) => index + 1)
  const out: (number | null)[] = [1]
  const start = Math.max(2, page - span)
  const end = Math.min(total - 1, page + span)
  if (start > 2) out.push(null)
  for (let index = start; index <= end; index += 1) out.push(index)
  if (end < total - 1) out.push(null)
  out.push(total)
  return out
}

export interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  summary?: ReactNode
  /** Renders the page-size chooser when supplied. */
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  /** `compact` drops the numbered buttons — for tight side panels. */
  variant?: 'full' | 'compact'
  className?: string
}

export function Pagination({
  page,
  totalPages,
  onChange,
  summary,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  variant = 'full',
  className,
}: PaginationProps) {
  const pages = pageWindow(page, totalPages)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3',
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
        {summary ? <span className="truncate text-xs text-ink-subtle">{summary}</span> : null}

        {pageSize && onPageSizeChange ? (
          <label className="flex shrink-0 items-center gap-1.5 text-xs text-ink-subtle">
            Rows
            <SearchSelect
              size="sm"
              clearable={false}
              className="w-18"
              options={pageSizeOptions.map((size) => String(size))}
              value={String(pageSize)}
              onChange={(next) => onPageSizeChange(Number(next))}
              searchPlaceholder="Rows…"
            />
          </label>
        ) : null}
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(1)}
          disabled={page <= 1}
          aria-label="First page"
          className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevronLeft" size={13} strokeWidth={2.4} className="-mr-1.5" />
          <Icon name="chevronLeft" size={13} strokeWidth={2.4} className="-ml-1.5" />
        </button>
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevronLeft" size={13} strokeWidth={2.4} />
        </button>

        {/* Numbered pages need room; below `sm` they collapse to a counter. */}
        {variant === 'full' ? (
          <span className="hidden items-center gap-1 sm:flex">
            {pages.map((entry, index) =>
              entry === null ? (
                <span key={`gap-${index}`} className="px-1 text-xs text-ink-subtle">
                  …
                </span>
              ) : (
                <button
                  key={entry}
                  type="button"
                  onClick={() => onChange(entry)}
                  aria-current={entry === page ? 'page' : undefined}
                  className={cn(
                    'h-7 min-w-7 shrink-0 cursor-pointer rounded-md px-2 text-xs transition-colors',
                    entry === page
                      ? 'bg-brand-600 font-semibold text-on-brand'
                      : 'text-ink-muted hover:bg-surface hover:text-ink',
                  )}
                >
                  {entry}
                </button>
              ),
            )}
          </span>
        ) : null}

        <span
          data-numeric
          className={cn(
            'px-2 text-xs font-medium whitespace-nowrap text-ink-soft',
            variant === 'full' && 'sm:hidden',
          )}
        >
          {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevronRight" size={13} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          onClick={() => onChange(totalPages)}
          disabled={page >= totalPages}
          aria-label="Last page"
          className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevronRight" size={13} strokeWidth={2.4} className="-mr-1.5" />
          <Icon name="chevronRight" size={13} strokeWidth={2.4} className="-ml-1.5" />
        </button>
      </nav>
    </div>
  )
}

/** Progressive-disclosure alternative for feeds and long scrolling lists. */
export function LoadMore({
  loaded,
  total,
  onLoadMore,
  loading = false,
  className,
}: {
  loaded: number
  total: number
  onLoadMore: () => void
  loading?: boolean
  className?: string
}) {
  const done = loaded >= total
  return (
    <div className={cn('flex flex-col items-center gap-2 border-t border-hairline-teal px-4 py-4', className)}>
      <p className="text-xs text-ink-subtle">
        Showing <b className="text-ink-body">{loaded}</b> of {total}
      </p>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-hairline">
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
          style={{ width: `${Math.min(100, (loaded / (total || 1)) * 100)}%` }}
        />
      </div>
      {!done ? (
        <Button size="sm" variant="secondary" loading={loading} onClick={onLoadMore} className="mt-1">
          Load more
        </Button>
      ) : null}
    </div>
  )
}
