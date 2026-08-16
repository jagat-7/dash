import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: ReactNode
  count?: number
}

export interface TabsProps {
  items: readonly TabItem[]
  value: string
  onChange: (id: string) => void
  /** Accessible name for the tab strip, e.g. "Billing sections". */
  label: string
  className?: string
}

/**
 * Underlined tab strip with roving-focus keyboard support
 * (â†/â†’ to move, Home/End to jump), per the WAI-ARIA tabs pattern.
 */
export function Tabs({ items, value, onChange, label, className }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  function focusTab(index: number) {
    const next = items[(index + items.length) % items.length]
    if (!next) return
    onChange(next.id)
    listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${next.id}"]`)?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      className={cn(
        'scrollbar-none flex gap-5 overflow-x-auto border-b border-hairline-teal',
        className,
      )}
      onKeyDown={(event) => {
        const current = items.findIndex((item) => item.id === value)
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          focusTab(current + 1)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          focusTab(current - 1)
        } else if (event.key === 'Home') {
          event.preventDefault()
          focusTab(0)
        } else if (event.key === 'End') {
          event.preventDefault()
          focusTab(items.length - 1)
        }
      }}
    >
      {items.map((item) => {
        const active = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            data-tab-id={item.id}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex cursor-pointer items-center gap-2 border-b-2 pb-2.5 text-base whitespace-nowrap transition-colors',
              active
                ? 'border-brand-600 font-semibold text-brand-600'
                : 'border-transparent font-medium text-ink-muted hover:text-brand-600',
            )}
          >
            {item.label}
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'rounded-full px-1.5 py-px text-2xs font-semibold',
                  active ? 'bg-brand-50 text-brand-600' : 'bg-neutral-soft text-ink-subtle',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export interface FilterChipsProps {
  options: readonly string[]
  value: string
  onChange: (option: string) => void
  label: string
  /** Optional per-option count suffix. */
  counts?: Record<string, number>
  className?: string
}

/** Pill-shaped single-select filter row (ward, stock and lab worklists). */
export function FilterChips({ options, value, onChange, label, counts, className }: FilterChipsProps) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {options.map((option) => {
        const active = option === value
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={cn(
              'flex h-[30px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors',
              active
                ? 'border-brand-600 bg-brand-50 text-brand-600'
                : 'border-hairline bg-surface text-ink-muted hover:border-line-strong hover:text-ink',
            )}
          >
            {option}
            {counts?.[option] !== undefined ? (
              <span className={cn('text-2xs', active ? 'text-brand-500' : 'text-ink-subtle')}>
                {counts[option]}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
