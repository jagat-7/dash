import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

/**
 * A panel anchored to a trigger, rendered in a portal.
 *
 * Absolutely-positioned dropdowns are clipped the moment an ancestor sets
 * `overflow: hidden` — which `Card`, `InfoCard`, `DataTable` and the app shell
 * all do — and they drift out of alignment inside a scrolling well. Every
 * dropdown in the library goes through this instead: measured against the
 * trigger's viewport rect, positioned `fixed`, re-measured on scroll and
 * resize, flipped above the trigger when the space below runs out, and clamped
 * so it can never hang off-screen.
 */

export type PanelAlign = 'start' | 'end' | 'center'

export interface AnchoredPanelProps {
  open: boolean
  anchorRef: React.RefObject<HTMLElement | null>
  onDismiss: () => void
  align?: PanelAlign
  /** Panel matches the trigger's width — right for select-likes, wrong for menus. */
  matchWidth?: boolean
  width?: number
  minWidth?: number
  /** Gap between trigger and panel, in px. */
  offset?: number
  className?: string
  children: ReactNode
}

interface Position {
  top: number
  left: number
  width?: number
  maxHeight: number
  placement: 'top' | 'bottom'
}

const MARGIN = 8

export function AnchoredPanel({
  open,
  anchorRef,
  onDismiss,
  align = 'start',
  matchWidth = false,
  width,
  minWidth,
  offset = 6,
  className,
  children,
}: AnchoredPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position | null>(null)

  const measure = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    const panelHeight = panelRef.current?.offsetHeight ?? 0
    const below = window.innerHeight - rect.bottom - offset - MARGIN
    const above = rect.top - offset - MARGIN
    // Flip only when below is genuinely too tight *and* above is roomier.
    const placement = panelHeight > below && above > below ? 'top' : 'bottom'
    const maxHeight = Math.max(140, placement === 'bottom' ? below : above)

    const panelWidth = matchWidth ? rect.width : (width ?? panelRef.current?.offsetWidth ?? 0)
    let left = rect.left
    if (align === 'end') left = rect.right - panelWidth
    else if (align === 'center') left = rect.left + rect.width / 2 - panelWidth / 2
    left = Math.min(Math.max(MARGIN, left), Math.max(MARGIN, window.innerWidth - panelWidth - MARGIN))

    setPosition({
      top: placement === 'bottom' ? rect.bottom + offset : rect.top - offset - panelHeight,
      left,
      width: matchWidth ? rect.width : width,
      maxHeight,
      placement,
    })
  }, [align, anchorRef, matchWidth, offset, width])

  // Measure before paint so the panel never shows up in the wrong place first.
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    measure()
    // A second pass once the panel has real height, for the flip calculation.
    const raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [open, measure])

  useEffect(() => {
    if (!open) return
    const onScroll = () => measure()
    // Capture phase: catches scrolling in any ancestor well, not just the page.
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, measure])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return
      onDismiss()
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, anchorRef, onDismiss])

  if (!open) return null

  return createPortal(
    <div
      ref={panelRef}
      data-placement={position?.placement}
      style={{
        position: 'fixed',
        top: position?.top ?? -9999,
        left: position?.left ?? -9999,
        width: position?.width,
        minWidth,
        maxHeight: position?.maxHeight,
        // Hidden until measured, so it can never flash at the wrong coordinates.
        visibility: position ? 'visible' : 'hidden',
      }}
      className={cn(
        'z-70 flex flex-col overflow-hidden rounded-field border border-hairline bg-surface shadow-panel',
        position?.placement === 'top' ? 'origin-bottom' : 'origin-top',
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  )
}
