import {
  createContext,
  useContext,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { Icon } from './Icon'
import { cn } from '@/lib/cn'

interface FieldContextValue {
  id: string
  describedBy?: string
  invalid: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

export interface FieldProps {
  label: ReactNode
  required?: boolean
  hint?: ReactNode
  error?: ReactNode
  /** Spans the full width of a 2-column form grid. */
  full?: boolean
  className?: string
  children: ReactNode
}

/**
 * Label + control + hint/error wrapper. Wire-up (ids, aria-describedby,
 * aria-invalid) is handled here so individual controls stay dumb.
 */
export function Field({ label, required, hint, error, full, className, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-msg`
  const message = error ?? hint

  return (
    <FieldContext.Provider
      value={{ id, describedBy: message ? messageId : undefined, invalid: Boolean(error) }}
    >
      <div className={cn('flex flex-col gap-1.5', full && 'sm:col-span-full', className)}>
        <label htmlFor={id} className="text-sm font-semibold text-ink-soft">
          {label}
          {required ? <span className="ml-0.5 text-emergency">*</span> : null}
        </label>
        {children}
        {message ? (
          <p
            id={messageId}
            className={cn('text-xs', error ? 'font-medium text-critical' : 'text-ink-muted')}
          >
            {message}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  )
}

function useFieldProps() {
  const ctx = useContext(FieldContext)
  return {
    id: ctx?.id,
    'aria-describedby': ctx?.describedBy,
    'aria-invalid': ctx?.invalid || undefined,
    invalid: Boolean(ctx?.invalid),
  }
}

const controlBase =
  'w-full rounded-field border-[1.5px] bg-surface px-3 text-base text-ink transition-colors outline-none placeholder:text-ink-subtle disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-subtle'

const controlState = (invalid: boolean) =>
  invalid
    ? 'border-critical focus:border-critical'
    : 'border-hairline hover:border-line-strong focus:border-brand-500'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: 'md' | 'lg'
}

export function Input({ className, inputSize = 'md', ...props }: InputProps) {
  const { invalid, ...field } = useFieldProps()
  return (
    <input
      {...field}
      className={cn(controlBase, controlState(invalid), inputSize === 'lg' ? 'h-[42px]' : 'h-10', className)}
      {...props}
    />
  )
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[]
  selectSize?: 'md' | 'lg'
}

export function Select({ options, className, selectSize = 'md', ...props }: SelectProps) {
  const { invalid, ...field } = useFieldProps()
  return (
    <div className="relative">
      <select
        {...field}
        className={cn(
          controlBase,
          controlState(invalid),
          'cursor-pointer appearance-none pr-9',
          selectSize === 'lg' ? 'h-[42px]' : 'h-10',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        size={13}
        strokeWidth={2.2}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-subtle"
      />
    </div>
  )
}

export function Textarea({ className, rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { invalid, ...field } = useFieldProps()
  return (
    <textarea
      {...field}
      rows={rows}
      className={cn(controlBase, controlState(invalid), 'resize-y py-2.5 leading-relaxed', className)}
      {...props}
    />
  )
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2 text-sm text-ink-muted', className)}>
      <input
        type="checkbox"
        className="size-4 cursor-pointer rounded-[4px] accent-brand-600"
        {...props}
      />
      {label}
    </label>
  )
}

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual width; the control itself is always 34px tall. */
  width?: string
  onClear?: () => void
  /** Forwarded to the inner `<input>` so callers can focus it (e.g. ⌘K). */
  ref?: Ref<HTMLInputElement>
}

/** Compact search box used in the topbar and above tables. */
export function SearchInput({ className, width, onClear, value, ...props }: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex h-[34px] items-center gap-2 rounded-control border border-hairline bg-subtle px-3',
        'transition-colors focus-within:border-brand-500 focus-within:bg-surface',
        className,
      )}
      style={width ? { width } : undefined}
    >
      <Icon name="search" size={13} strokeWidth={2.2} className="text-ink-subtle" />
      <input
        type="search"
        value={value}
        className="w-full min-w-0 border-none bg-transparent text-sm text-ink outline-none [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {onClear && value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="cursor-pointer text-ink-subtle transition-colors hover:text-ink"
        >
          <Icon name="close" size={12} strokeWidth={2.4} />
        </button>
      ) : null}
    </div>
  )
}
