import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

/* ---------------------------------------------------------------- Switch */

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onChange, label, description, disabled, className }: SwitchProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3',
        disabled && 'cursor-not-allowed opacity-55',
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
          checked ? 'bg-brand-600' : 'bg-line-strong',
          disabled && 'cursor-not-allowed',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-[left] duration-150',
            checked ? 'left-4.5' : 'left-0.5',
          )}
        />
      </button>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-ink-muted">{description}</span> : null}
      </span>
    </label>
  )
}

/* ------------------------------------------------------------ RadioGroup */

export interface RadioOption {
  value: string
  label: string
  description?: string
}

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  columns = 1,
  className,
}: {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  label: string
  columns?: 1 | 2 | 3
  className?: string
}) {
  const name = useId()
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'grid gap-2',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-3',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer gap-2.5 rounded-field border p-3 transition-colors',
              active ? 'border-brand-600 bg-brand-50' : 'border-hairline bg-surface hover:border-line-strong',
            )}
          >
            <input
              type="radio"
              name={name}
              checked={active}
              onChange={() => onChange(option.value)}
              className="mt-0.5 size-4 cursor-pointer accent-brand-600"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">{option.label}</span>
              {option.description ? (
                <span className="mt-0.5 block text-xs text-ink-muted">{option.description}</span>
              ) : null}
            </span>
          </label>
        )
      })}
    </div>
  )
}

/* ----------------------------------------------------- SegmentedControl */

export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: {
  options: readonly { value: string; label: string; icon?: IconName }[]
  value: string
  onChange: (value: string) => void
  label: string
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('inline-flex max-w-full overflow-x-auto rounded-control bg-subtle p-0.5 ring-1 ring-hairline', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-[5px] font-semibold whitespace-nowrap transition-all',
              size === 'sm' ? 'h-6.5 px-2.5 text-2xs' : 'h-8 px-3.5 text-sm',
              active ? 'bg-surface text-ink shadow-hairline' : 'text-ink-muted hover:text-ink',
            )}
          >
            {option.icon ? <Icon name={option.icon} size={12} /> : null}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- Slider */

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  format = (v: number) => String(v),
  className,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
  format?: (value: number) => string
  className?: string
}) {
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-soft">{label}</span>
        <span data-numeric className="text-sm font-semibold text-ink">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(to right, var(--color-brand-600) ${percent}%, var(--color-hairline) ${percent}%)`,
        }}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:shadow-sm"
      />
    </div>
  )
}

/* -------------------------------------------------------------- Combobox */

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search…',
  emptyMessage = 'No matches',
  className,
}: {
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const matches = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  )

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <div className="flex h-10 items-center gap-2 rounded-field border-[1.5px] border-hairline bg-surface px-3 transition-colors focus-within:border-brand-500">
        <Icon name="search" size={13} strokeWidth={2.2} className="text-ink-subtle" />
        <input
          value={open ? query : value || query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls="combobox-list"
          className="w-full border-none bg-transparent text-base text-ink outline-none"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              onChange('')
              setQuery('')
            }}
            className="cursor-pointer text-ink-subtle hover:text-ink"
          >
            <Icon name="close" size={12} strokeWidth={2.4} />
          </button>
        ) : null}
      </div>

      {open ? (
        <ul
          id="combobox-list"
          role="listbox"
          className="scrollbar-slim absolute top-full z-50 mt-1.5 max-h-56 w-full animate-fade-up overflow-y-auto rounded-field border border-hairline bg-surface py-1 shadow-panel"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-ink-subtle">{emptyMessage}</li>
          ) : (
            matches.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  onClick={() => {
                    onChange(option)
                    setQuery('')
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-subtle',
                    option === value ? 'font-semibold text-brand-600' : 'text-ink-soft',
                  )}
                >
                  {option}
                  {option === value ? <Icon name="check" size={13} strokeWidth={2.6} /> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------- FileDrop */

export function FileDrop({
  onFiles,
  hint = 'PDF, JPG or PNG · up to 10 MB',
  className,
}: {
  onFiles?: (files: FileList) => void
  hint?: string
  className?: string
}) {
  const [over, setOver] = useState(false)
  const [names, setNames] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function accept(files: FileList | null) {
    if (!files?.length) return
    setNames(Array.from(files).map((file) => file.name))
    onFiles?.(files)
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setOver(false)
          accept(event.dataTransfer.files)
        }}
        className={cn(
          'flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-field border-[1.5px] border-dashed px-4 py-7 transition-colors',
          over ? 'border-brand-600 bg-brand-50' : 'border-hairline bg-subtle hover:border-line-strong',
        )}
      >
        <Icon name="download" size={20} className="rotate-180 text-ink-subtle" />
        <span className="text-sm font-semibold text-ink">Drop files or click to upload</span>
        <span className="text-xs text-ink-muted">{hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => accept(event.target.files)}
      />
      {names.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-1">
          {names.map((name) => (
            <li key={name} className="flex items-center gap-2 text-xs text-ink-body">
              <Icon name="check" size={12} strokeWidth={2.6} className="text-success" />
              {name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/* ----------------------------------------------------- Button groupings */

export function ButtonGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex overflow-hidden rounded-control border border-hairline',
        '[&>button]:rounded-none [&>button]:border-0 [&>button]:border-r [&>button]:border-hairline [&>button:last-child]:border-r-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Keyboard shortcut hint. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-hairline bg-subtle px-1.5 font-mono text-[10px] font-medium text-ink-muted">
      {children}
    </kbd>
  )
}

/** Copies text and confirms inline. */
export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      }}
      className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-control border border-hairline bg-surface px-2.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
    >
      <Icon name={copied ? 'check' : 'clipboard'} size={12} strokeWidth={2.2} className={copied ? 'text-success' : ''} />
      {copied ? 'Copied' : label}
    </button>
  )
}
