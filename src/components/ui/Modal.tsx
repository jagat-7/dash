import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import { cn } from '@/lib/cn'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  footer?: ReactNode
  width?: number
  children: ReactNode
}

/**
 * Accessible dialog: portalled, scroll-locked, Escape to dismiss,
 * click-outside to dismiss, focus trapped inside and restored on close.
 */
export function Modal({ open, onClose, title, description, footer, width = 520, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = `${titleId}-description`

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (nodes.length === 0) return
      const first = nodes[0]!
      const last = nodes[nodes.length - 1]!

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return

    restoreRef.current = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    }, 0)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      restoreRef.current?.focus()
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-60 grid animate-fade-in place-items-center bg-black/40 p-4 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        style={{ width }}
        className="scrollbar-slim max-h-[calc(100vh-60px)] w-full max-w-full animate-fade-up overflow-auto rounded-panel bg-surface shadow-modal"
      >
        <div className="flex items-start gap-3 border-b border-hairline-teal px-6 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold text-ink">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-0.5 text-xs text-ink-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto cursor-pointer rounded p-1 text-ink-subtle transition-colors hover:text-ink"
          >
            <Icon name="close" size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2.5 border-t border-hairline-teal px-6 py-3.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

export interface DetailPanelProps {
  title: ReactNode
  subtitle?: ReactNode
  onClose?: () => void
  width?: number
  className?: string
  children: ReactNode
}

/**
 * Contextual right-hand panel (selected bed, selected invoice). Docks beside
 * the content on desktop and stacks underneath it on narrow screens.
 */
export function DetailPanel({
  title,
  subtitle,
  onClose,
  width = 270,
  className,
  children,
}: DetailPanelProps) {
  return (
    <aside
      style={{ width: `min(100%, ${width}px)` }}
      className={cn(
        'w-full shrink-0 animate-slide-in self-start rounded-card border border-hairline bg-surface p-5 shadow-panel',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-md font-bold text-ink">{title}</h3>
          {subtitle ? <p className="mt-0.5 truncate text-xs text-ink-muted">{subtitle}</p> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="ml-auto cursor-pointer rounded p-1 text-ink-subtle transition-colors hover:text-ink"
          >
            <Icon name="close" size={14} strokeWidth={2.2} />
          </button>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </aside>
  )
}

/** Label/value row used inside detail panels and summary lists. */
export function DetailRow({
  label,
  value,
  className,
}: {
  label: ReactNode
  value: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3 text-sm', className)}>
      <span className="shrink-0 text-ink-muted">{label}</span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  )
}
