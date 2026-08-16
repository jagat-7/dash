import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, type IconName } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

const HANDLE_HEIGHT = 92
const EDGE_MARGIN = 12
/** Pointer travel beyond this counts as a drag, not a click. */
const DRAG_THRESHOLD = 4

interface Shortcut {
  id: string
  label: string
  hint: string
  icon: IconName
  tone?: 'primary' | 'default'
  run: (helpers: { go: (path: string) => void; openRegistration: () => void }) => void
}

const SHORTCUTS: Shortcut[] = [
  {
    id: 'order',
    label: 'Order',
    hint: 'Sales order register & verification',
    icon: 'cart',
    tone: 'primary',
    run: ({ go }) => go('/orders'),
  },
  {
    id: 'collection',
    label: 'Collection',
    hint: 'Money collection & financial overview',
    icon: 'wallet',
    run: ({ go }) => go('/launcher'),
  },
  {
    id: 'attendance',
    label: 'Attendance',
    hint: 'Daily check-in & shift rosters',
    icon: 'calendar',
    run: ({ go }) => go('/attendance'),
  },
]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * Sticky shortcut drawer, welded to the right edge.
 *
 * The handle is a vertical tab: click it to slide the drawer out, drag it to
 * move it **up and down only** — the horizontal position is fixed to the right
 * edge by design, so the control can never end up somewhere unreachable.
 * The vertical offset persists.
 */
export function ShortcutDock() {
  const navigate = useNavigate()
  const dock = useAppStore((state) => state.dock)
  const setDock = useAppStore((state) => state.setDock)
  const openRegistration = useAppStore((state) => state.setRegistrationOpen)

  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [top, setTop] = useState<number | null>(dock?.y ?? null)
  const gesture = useRef({ offset: 0, moved: false })

  // Default to vertically centred until the user drags it.
  useEffect(() => {
    if (top !== null) return
    setTop(Math.round(window.innerHeight / 2 - HANDLE_HEIGHT / 2))
  }, [top])

  useEffect(() => {
    function onResize() {
      setTop((current) =>
        current === null
          ? current
          : clamp(current, EDGE_MARGIN + 58, window.innerHeight - HANDLE_HEIGHT - EDGE_MARGIN),
      )
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (top === null) return
      event.currentTarget.setPointerCapture(event.pointerId)
      gesture.current = { offset: event.clientY - top, moved: false }
      setDragging(true)
    },
    [top],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragging) return
      const next = clamp(
        event.clientY - gesture.current.offset,
        EDGE_MARGIN + 58,
        window.innerHeight - HANDLE_HEIGHT - EDGE_MARGIN,
      )
      if (Math.abs(next - (top ?? 0)) > DRAG_THRESHOLD) gesture.current.moved = true
      setTop(next)
    },
    [dragging, top],
  )

  const onPointerUp = useCallback(() => {
    if (!dragging) return
    setDragging(false)
    if (gesture.current.moved) {
      if (top !== null) setDock({ x: 0, y: top })
    } else {
      setOpen((value) => !value)
    }
  }, [dragging, top, setDock])

  if (top === null) return null

  const helpers = {
    go: (path: string) => navigate(path),
    openRegistration: () => openRegistration(true),
  }

  return (
    <>
      {/* Scrim only while open, so the page stays usable when it is closed. */}
      {open ? (
        <button
          type="button"
          aria-label="Close shortcuts"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 animate-fade-in bg-black/20"
        />
      ) : null}

      {/* Handle — pinned to the right edge; only `top` is user-controlled. */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDragging(false)}
        aria-expanded={open}
        aria-controls="shortcut-drawer"
        aria-label={open ? 'Close shortcuts' : 'Open shortcuts. Drag up or down to reposition.'}
        title="Click for shortcuts · drag up/down to move"
        style={{ top, height: HANDLE_HEIGHT }}
        className={cn(
          // Hidden on phones: a drag-to-move edge tab competes with the OS back
          // gesture, and every action it holds is reachable from the nav drawer.
          'fixed z-50 hidden w-7 touch-none flex-col items-center justify-center gap-1.5 rounded-l-xl bg-brand-600 text-on-brand shadow-panel transition-[background-color,width,right] duration-200 lg:flex',
          dragging ? 'w-8 cursor-grabbing' : 'cursor-grab hover:w-8 hover:bg-brand-500',
          open ? 'right-[min(92vw,320px)]' : 'right-0',
        )}
      >
        <Icon name="dragVertical" size={13} className="opacity-70" />
        <Icon
          name="chevronLeft"
          size={13}
          strokeWidth={2.6}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Drawer — always the right side, full height. */}
      <aside
        id="shortcut-drawer"
        aria-hidden={!open}
        className={cn(
          'fixed top-0 right-0 z-50 flex h-dvh w-[min(92vw,320px)] flex-col border-l border-hairline bg-surface shadow-modal transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center gap-2.5 border-b border-hairline-teal px-4 py-3.5">
          <span className="grid size-7 place-items-center rounded-control bg-brand-50 text-brand-600">
            <Icon name="spark" size={14} />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-ink">Quick actions</h2>
            <p className="text-2xs text-ink-subtle">Available on every screen</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close shortcuts"
            className="ml-auto cursor-pointer rounded p-1 text-ink-subtle transition-colors hover:text-ink"
          >
            <Icon name="close" size={15} strokeWidth={2.2} />
          </button>
        </header>

        <div className="scrollbar-slim flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1.5">
            {SHORTCUTS.map((shortcut) => (
              <li key={shortcut.id}>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  title={`${shortcut.label} — ${shortcut.hint}`}
                  onClick={() => {
                    shortcut.run(helpers)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-field border px-3 py-2.5 text-left transition-colors',
                    shortcut.tone === 'primary'
                      ? 'border-brand-600 bg-brand-50 hover:bg-brand-100'
                      : 'border-hairline bg-surface hover:border-line-strong hover:bg-subtle',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-tile',
                      shortcut.tone === 'primary'
                        ? 'bg-brand-600 text-on-brand'
                        : 'bg-subtle text-ink-muted',
                    )}
                  >
                    <Icon name={shortcut.icon} size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{shortcut.label}</span>
                    <span className="block truncate text-2xs text-ink-muted">{shortcut.hint}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-hairline-teal px-4 py-2.5">
          <p className="text-2xs text-ink-subtle">Drag the tab up or down to move it.</p>
        </footer>
      </aside>
    </>
  )
}
