import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'
import type { Tone } from './Badge'

/* ----------------------------------------------------------------- Alert */

const alertStyle: Record<Tone, { wrap: string; icon: IconName; iconClass: string }> = {
  brand: { wrap: 'bg-brand-50 border-brand-600/25 text-brand-700', icon: 'inbox', iconClass: 'text-brand-600' },
  success: { wrap: 'bg-success-soft border-success/25 text-success-deep', icon: 'check', iconClass: 'text-success' },
  warning: { wrap: 'bg-warning-soft border-warning/25 text-warning-deep', icon: 'alert', iconClass: 'text-warning' },
  critical: { wrap: 'bg-critical-soft border-critical/25 text-critical-deep', icon: 'alert', iconClass: 'text-critical' },
  info: { wrap: 'bg-info-soft border-info/25 text-info', icon: 'inbox', iconClass: 'text-info' },
  neutral: { wrap: 'bg-neutral-soft border-hairline text-ink-body', icon: 'inbox', iconClass: 'text-ink-muted' },
  violet: { wrap: 'bg-violet-soft border-accent-violet/25 text-accent-violet', icon: 'spark', iconClass: 'text-accent-violet' },
}

export interface AlertProps {
  tone?: Tone
  title: ReactNode
  children?: ReactNode
  icon?: IconName
  action?: ReactNode
  onDismiss?: () => void
  className?: string
}

/** Inline message block. Always pairs its tone with an icon and a heading. */
export function Alert({ tone = 'info', title, children, icon, action, onDismiss, className }: AlertProps) {
  const style = alertStyle[tone]
  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-field border px-3.5 py-3', style.wrap, className)}
    >
      <Icon name={icon ?? style.icon} size={16} strokeWidth={2.2} className={cn('mt-0.5', style.iconClass)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {children ? <div className="mt-1 text-xs opacity-90">{children}</div> : null}
        {action ? <div className="mt-2.5 flex gap-2">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="cursor-pointer self-start rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
        >
          <Icon name="close" size={13} strokeWidth={2.4} />
        </button>
      ) : null}
    </div>
  )
}

/** Full-width banner for page- or app-level notices. */
export function Banner({ tone = 'brand', title, children, action, onDismiss, className }: AlertProps) {
  const style = alertStyle[tone]
  return (
    <div className={cn('flex flex-wrap items-center gap-3 rounded-card border px-4 py-3', style.wrap, className)}>
      <Icon name={style.icon} size={16} strokeWidth={2.2} className={style.iconClass} />
      <p className="text-sm font-semibold">{title}</p>
      {children ? <p className="text-xs opacity-90">{children}</p> : null}
      <div className="ml-auto flex items-center gap-2">
        {action}
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="cursor-pointer rounded p-1 opacity-60 transition-opacity hover:opacity-100"
          >
            <Icon name="close" size={13} strokeWidth={2.4} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- Spinner */

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 8) }}
      className={cn('inline-block animate-spin rounded-full border-current border-t-transparent', className)}
    />
  )
}

/** Centred loading block for a card or panel that is still fetching. */
export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 py-14 text-ink-muted">
      <Spinner size={22} className="text-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

/* ----------------------------------------------------------------- Toast */

export interface Toast {
  id: number
  tone: Tone
  title: string
  description?: string
}

interface ToastContextValue {
  push: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/** Transient notifications. Wrap the app once, then call `useToast()`. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = nextId.current++
    setToasts((current) => [...current, { ...toast, id }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((entry) => entry.id !== id))
    }, 4200)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-5 left-1/2 z-70 flex w-max max-w-[92vw] -translate-x-1/2 flex-col gap-2"
        >
          {toasts.map((toast) => {
            const style = alertStyle[toast.tone]
            return (
              <div
                key={toast.id}
                className="pointer-events-auto flex animate-fade-up items-start gap-2.5 rounded-field border border-hairline bg-surface px-3.5 py-2.5 shadow-panel"
              >
                <Icon name={style.icon} size={15} strokeWidth={2.2} className={cn('mt-0.5', style.iconClass)} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-0.5 text-xs text-ink-muted">{toast.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setToasts((current) => current.filter((entry) => entry.id !== toast.id))}
                  aria-label="Dismiss notification"
                  className="ml-2 cursor-pointer text-ink-subtle transition-colors hover:text-ink"
                >
                  <Icon name="close" size={12} strokeWidth={2.4} />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside a <ToastProvider>')
  return context
}
