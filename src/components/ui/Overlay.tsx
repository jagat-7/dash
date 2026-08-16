import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnchoredPanel } from './Anchored'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------ Menu */

export interface MenuItem {
  id: string
  label: string
  icon?: IconName
  tone?: 'default' | 'danger'
  disabled?: boolean
  onSelect?: () => void
  /** Renders a divider above this item. */
  separated?: boolean
}

export interface MenuProps {
  trigger: ReactNode
  items: MenuItem[]
  align?: 'start' | 'end'
  label?: string
  className?: string
}

/** Dropdown action menu with arrow-key navigation. */
export function Menu({ trigger, items, align = 'end', label = 'Actions', className }: MenuProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <div ref={anchorRef} className={cn('relative', className)}>
      <span onClick={() => setOpen((value) => !value)} className="contents">
        {trigger}
      </span>

      <AnchoredPanel open={open} anchorRef={anchorRef} onDismiss={close} align={align} minWidth={192}>
        <ul
          role="menu"
          aria-label={label}
          onKeyDown={(event) => {
            const buttons = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
            )
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              buttons[(index + 1) % buttons.length]?.focus()
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              buttons[(index - 1 + buttons.length) % buttons.length]?.focus()
            }
          }}
          className="scrollbar-slim min-h-0 flex-1 overflow-y-auto py-1"
        >
          {items.map((item) => (
            <li key={item.id} role="none" className={cn(item.separated && 'mt-1 border-t border-hairline pt-1')}>
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect?.()
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                  'disabled:pointer-events-none disabled:opacity-45',
                  item.tone === 'danger'
                    ? 'text-critical hover:bg-critical-soft'
                    : 'text-ink-soft hover:bg-subtle hover:text-ink',
                )}
              >
                {item.icon ? <Icon name={item.icon} size={14} /> : null}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </AnchoredPanel>
    </div>
  )
}

/* --------------------------------------------------------------- Popover */

export function Popover({
  trigger,
  children,
  align = 'start',
  width = 260,
  className,
}: {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end'
  width?: number
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <div ref={anchorRef} className={cn('relative', className)}>
      <span onClick={() => setOpen((value) => !value)} className="contents">
        {trigger}
      </span>
      <AnchoredPanel open={open} anchorRef={anchorRef} onDismiss={close} align={align} width={width}>
        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto p-3.5">{children}</div>
      </AnchoredPanel>
    </div>
  )
}

/* ---------------------------------------------------------------- Drawer */

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  side?: 'right' | 'left'
  width?: number
  footer?: ReactNode
  children: ReactNode
}

/** Side sheet — for secondary flows too large for a popover, too small for a page. */
export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  width = 420,
  footer,
  children,
}: DrawerProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-60 flex">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className={cn('absolute inset-0 animate-fade-in bg-black/40', side === 'right' ? 'order-1' : 'order-2')}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ width: `min(100%, ${width}px)` }}
        className={cn(
          'relative flex h-full animate-slide-in flex-col bg-surface shadow-modal',
          side === 'right' ? 'order-2 ml-auto' : 'order-1 mr-auto',
        )}
      >
        <header className="flex items-start gap-3 border-b border-hairline-teal px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-md font-bold text-ink">
              {title}
            </h2>
            {description ? <p className="mt-0.5 text-xs text-ink-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="ml-auto cursor-pointer rounded p-1 text-ink-subtle transition-colors hover:text-ink"
          >
            <Icon name="close" size={16} strokeWidth={2.2} />
          </button>
        </header>
        <div className="scrollbar-slim flex-1 overflow-y-auto p-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2.5 border-t border-hairline-teal px-5 py-3.5">{footer}</footer>
        ) : null}
      </aside>
    </div>,
    document.body,
  )
}

/* ------------------------------------------------------------- Accordion */

export interface AccordionItem {
  id: string
  title: ReactNode
  icon?: IconName
  content: ReactNode
}

export function Accordion({
  items,
  defaultOpen,
  multiple = false,
  className,
}: {
  items: AccordionItem[]
  defaultOpen?: string[]
  multiple?: boolean
  className?: string
}) {
  const [open, setOpen] = useState<string[]>(defaultOpen ?? [])

  function toggle(id: string) {
    setOpen((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id)
      return multiple ? [...current, id] : [id]
    })
  }

  return (
    <div className={cn('divide-y divide-hairline overflow-hidden rounded-card border border-hairline', className)}>
      {items.map((item) => {
        const expanded = open.includes(item.id)
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={expanded}
              className="flex w-full cursor-pointer items-center gap-2.5 bg-surface px-4 py-3 text-left transition-colors hover:bg-subtle"
            >
              {item.icon ? <Icon name={item.icon} size={15} className="text-ink-muted" /> : null}
              <span className="flex-1 text-sm font-semibold text-ink">{item.title}</span>
              <Icon
                name="chevronDown"
                size={13}
                strokeWidth={2.4}
                className={cn('text-ink-subtle transition-transform', expanded && 'rotate-180')}
              />
            </button>
            {expanded ? (
              <div className="animate-fade-up bg-subtle px-4 py-3.5 text-sm text-ink-body">{item.content}</div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

/* ----------------------------------------------------------- Collapsible */

export function Collapsible({
  label,
  children,
  defaultOpen = false,
}: {
  label: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500"
      >
        <Icon
          name="chevronRight"
          size={12}
          strokeWidth={2.4}
          className={cn('transition-transform', open && 'rotate-90')}
        />
        {label}
      </button>
      {open ? <div className="mt-2.5 animate-fade-up">{children}</div> : null}
    </div>
  )
}
