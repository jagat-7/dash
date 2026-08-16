import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnchoredPanel } from './Anchored'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
  /** Optional grouping header, Select2 style. */
  group?: string
  icon?: IconName
  hint?: string
  disabled?: boolean
}

/** Accepts plain strings for the common case. */
export type OptionInput = SelectOption | string

function normalise(options: readonly OptionInput[]): SelectOption[] {
  return options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  )
}

/** Groups the filtered list while preserving the original option order. */
function groupOptions(options: SelectOption[]) {
  const groups = new Map<string, SelectOption[]>()
  for (const option of options) {
    const key = option.group ?? ''
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(option)
  }
  return [...groups.entries()]
}

const controlBase =
  'flex w-full items-center gap-2 rounded-field border-[1.5px] bg-surface px-3 text-base text-ink transition-colors'

/* --------------------------------------------------------- SearchSelect */

export interface SearchSelectProps {
  options: readonly OptionInput[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  clearable?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  emptyMessage?: string
  className?: string
  id?: string
}

/**
 * Single-select with a type-ahead filter — the Select2 pattern.
 *
 * The trigger is a button (not a text input) so the chosen value is never
 * ambiguous; the search box lives inside the popup. Arrow keys move the
 * active option, Enter picks it, Escape closes.
 */
export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  clearable = true,
  disabled = false,
  size = 'md',
  emptyMessage = 'No matches',
  className,
  id,
}: SearchSelectProps) {
  const generatedId = useId()
  const listId = `${id ?? generatedId}-list`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const close = useCallback(() => setOpen(false), [])

  const all = useMemo(() => normalise(options), [options])
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return all
    return all.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) ||
        option.group?.toLowerCase().includes(needle),
    )
  }, [all, query])

  const selected = all.find((option) => option.value === value)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(Math.max(0, matches.findIndex((option) => option.value === value)))
      window.setTimeout(() => inputRef.current?.focus(), 0)
    }
    // `matches` intentionally excluded — reset only when the popup opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function commit(option: SelectOption) {
    if (option.disabled) return
    onChange(option.value)
    setOpen(false)
  }

  const heights = { sm: 'h-8 text-sm', md: 'h-10', lg: 'h-[42px]' }

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          controlBase,
          heights[size],
          'cursor-pointer justify-between text-left',
          open ? 'border-brand-500' : 'border-hairline hover:border-line-strong',
          disabled && 'cursor-not-allowed bg-subtle text-ink-subtle',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon ? <Icon name={selected.icon} size={14} className="text-ink-muted" /> : null}
          <span className={cn('truncate', selected ? 'text-ink' : 'text-ink-subtle')}>
            {selected?.label ?? placeholder}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && selected && !disabled ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear selection"
              onClick={(event) => {
                event.stopPropagation()
                onChange('')
              }}
              className="cursor-pointer rounded p-0.5 text-ink-subtle hover:text-ink"
            >
              <Icon name="close" size={12} strokeWidth={2.4} />
            </span>
          ) : null}
          <Icon
            name="chevronDown"
            size={13}
            strokeWidth={2.2}
            className={cn('text-ink-subtle transition-transform', open && 'rotate-180')}
          />
        </span>
      </button>

      <AnchoredPanel
        open={open}
        anchorRef={triggerRef}
        onDismiss={close}
        matchWidth
        minWidth={180}
      >
          <div className="flex shrink-0 items-center gap-2 border-b border-hairline-teal px-3 py-2">
            <Icon name="search" size={13} strokeWidth={2.2} className="text-ink-subtle" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  setActiveIndex((index) => Math.min(index + 1, matches.length - 1))
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  setActiveIndex((index) => Math.max(index - 1, 0))
                } else if (event.key === 'Enter') {
                  event.preventDefault()
                  const option = matches[activeIndex]
                  if (option) commit(option)
                } else if (event.key === 'Escape') {
                  event.preventDefault()
                  setOpen(false)
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full border-none bg-transparent text-sm text-ink outline-none"
            />
          </div>

          <ul id={listId} role="listbox" className="scrollbar-slim min-h-0 flex-1 overflow-y-auto py-1">
            {matches.length === 0 ? (
              <li className="px-3 py-3 text-sm text-ink-subtle">{emptyMessage}</li>
            ) : (
              groupOptions(matches).map(([group, entries]) => (
                <li key={group || '_'}>
                  {group ? (
                    <p className="px-3 pt-2 pb-1 text-2xs font-bold tracking-[0.06em] text-ink-subtle uppercase">
                      {group}
                    </p>
                  ) : null}
                  <ul>
                    {entries.map((option) => {
                      const index = matches.indexOf(option)
                      return (
                        <li key={option.value}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            disabled={option.disabled}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => commit(option)}
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                              'disabled:pointer-events-none disabled:opacity-45',
                              index === activeIndex ? 'bg-subtle' : '',
                              option.value === value ? 'font-semibold text-brand-600' : 'text-ink-soft',
                            )}
                          >
                            {option.icon ? <Icon name={option.icon} size={14} className="shrink-0 opacity-70" /> : null}
                            <span className="min-w-0 flex-1 truncate">
                              {option.label}
                              {option.hint ? (
                                <span className="ml-1.5 text-xs text-ink-subtle">{option.hint}</span>
                              ) : null}
                            </span>
                            {option.value === value ? (
                              <Icon name="check" size={13} strokeWidth={2.6} className="shrink-0" />
                            ) : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>
      </AnchoredPanel>
    </div>
  )
}

/* ---------------------------------------------------------- MultiSelect */

export interface MultiSelectProps {
  options: readonly OptionInput[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  /** Tags beyond this collapse into a "+N" chip. */
  maxTags?: number
  disabled?: boolean
  emptyMessage?: string
  className?: string
}

/**
 * Multi-select with tag chips and a type-ahead filter — Select2's other mode.
 * Backspace on an empty query removes the last tag.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  maxTags = 3,
  disabled = false,
  emptyMessage = 'No matches',
  className,
}: MultiSelectProps) {
  const listId = useId()
  const controlRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const close = useCallback(() => setOpen(false), [])

  const all = useMemo(() => normalise(options), [options])
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return all
    return all.filter((option) => option.label.toLowerCase().includes(needle))
  }, [all, query])

  const selected = all.filter((option) => value.includes(option.value))
  const shown = selected.slice(0, maxTags)
  const overflow = selected.length - shown.length

  function toggle(option: SelectOption) {
    if (option.disabled) return
    onChange(
      value.includes(option.value)
        ? value.filter((entry) => entry !== option.value)
        : [...value, option.value],
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={controlRef}
        onClick={() => {
          if (disabled) return
          setOpen(true)
          window.setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className={cn(
          'flex min-h-10 w-full cursor-text flex-wrap items-center gap-1.5 rounded-field border-[1.5px] bg-surface px-2 py-1.5 transition-colors',
          open ? 'border-brand-500' : 'border-hairline hover:border-line-strong',
          disabled && 'cursor-not-allowed bg-subtle',
        )}
      >
        {shown.map((option) => (
          <span
            key={option.value}
            className="inline-flex h-6 max-w-full items-center gap-1 rounded-md bg-brand-50 pr-1 pl-2 text-xs font-medium text-brand-600"
          >
            <span className="truncate">{option.label}</span>
            <button
              type="button"
              aria-label={`Remove ${option.label}`}
              onClick={(event) => {
                event.stopPropagation()
                onChange(value.filter((entry) => entry !== option.value))
              }}
              className="cursor-pointer rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
            >
              <Icon name="close" size={10} strokeWidth={2.8} />
            </button>
          </span>
        ))}

        {overflow > 0 ? (
          <span className="inline-flex h-6 items-center rounded-md bg-subtle px-2 text-xs font-medium text-ink-muted">
            +{overflow}
          </span>
        ) : null}

        <input
          ref={inputRef}
          value={query}
          disabled={disabled}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !query && value.length) {
              onChange(value.slice(0, -1))
            } else if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
              setActiveIndex((index) => Math.min(index + 1, matches.length - 1))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((index) => Math.max(index - 1, 0))
            } else if (event.key === 'Enter') {
              event.preventDefault()
              const option = matches[activeIndex]
              if (option) toggle(option)
            } else if (event.key === 'Escape') {
              setOpen(false)
            }
          }}
          placeholder={selected.length === 0 ? placeholder : searchPlaceholder}
          aria-controls={listId}
          aria-expanded={open}
          role="combobox"
          className="min-w-24 flex-1 border-none bg-transparent text-base text-ink outline-none placeholder:text-ink-subtle"
        />

        <Icon
          name="chevronDown"
          size={13}
          strokeWidth={2.2}
          className={cn('ml-auto shrink-0 text-ink-subtle transition-transform', open && 'rotate-180')}
        />
      </div>

      <AnchoredPanel open={open} anchorRef={controlRef} onDismiss={close} matchWidth minWidth={200}>
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable
          className="scrollbar-slim min-h-0 flex-1 overflow-y-auto py-1"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-3 text-sm text-ink-subtle">{emptyMessage}</li>
          ) : (
            matches.map((option, index) => {
              const checked = value.includes(option.value)
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={checked}
                    disabled={option.disabled}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => toggle(option)}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                      'disabled:pointer-events-none disabled:opacity-45',
                      index === activeIndex ? 'bg-subtle' : '',
                      checked ? 'font-semibold text-brand-600' : 'text-ink-soft',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-4 shrink-0 place-items-center rounded-[4px] border',
                        checked ? 'border-brand-600 bg-brand-600 text-on-brand' : 'border-line-strong',
                      )}
                    >
                      {checked ? <Icon name="check" size={10} strokeWidth={3.2} /> : null}
                    </span>
                    {option.icon ? <Icon name={option.icon} size={14} className="shrink-0 opacity-70" /> : null}
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </AnchoredPanel>
    </div>
  )
}
