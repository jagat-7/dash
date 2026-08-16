import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

export interface ResizablePane {
  id: string
  content: ReactNode
  /** Minimum share of the row, in percent. */
  min?: number
  /** Starting share of the row, in percent. Shares should total 100. */
  initial: number
}

export interface ResizableProps {
  /** Stable id — column sizes are persisted under this key. */
  id: string
  panes: ResizablePane[]
  /** Below this breakpoint the panes stack and the handles disappear. */
  stackBelow?: 'md' | 'lg' | 'xl'
  gap?: number
  className?: string
}

const stackClass = {
  md: 'md:flex-row',
  lg: 'lg:flex-row',
  xl: 'xl:flex-row',
} as const

const handleShow = {
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
  xl: 'hidden xl:flex',
} as const

/**
 * Multi-column layout with draggable dividers.
 *
 * Sizes are percentages so the layout stays fluid, are clamped to each pane's
 * minimum, and persist per `id`. Handles are keyboard-operable (←/→ nudge,
 * Home/End jump) and stack out of the way on small screens.
 */
export function Resizable({ id, panes, stackBelow = 'lg', gap = 14, className }: ResizableProps) {
  const stored = useAppStore((state) => state.splits[id])
  const setSplit = useAppStore((state) => state.setSplit)
  const rowRef = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<number[]>(
    stored && stored.length === panes.length ? stored : panes.map((pane) => pane.initial),
  )
  const [activeHandle, setActiveHandle] = useState<number | null>(null)

  // Mirror of `sizes` readable from pointer handlers without a state update.
  const sizesRef = useRef(sizes)
  useEffect(() => {
    sizesRef.current = sizes
  }, [sizes])

  const applyDelta = useCallback(
    (index: number, deltaPercent: number) => {
      setSizes((current) => {
        const next = [...current]
        const leftMin = panes[index]?.min ?? 15
        const rightMin = panes[index + 1]?.min ?? 15
        const left = next[index]!
        const right = next[index + 1]!
        const total = left + right
        // Clamp so neither neighbour drops below its minimum.
        const proposed = Math.min(Math.max(left + deltaPercent, leftMin), total - rightMin)
        next[index] = proposed
        next[index + 1] = total - proposed
        return next
      })
    },
    [panes],
  )

  const startDrag = useCallback(
    (index: number) => (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      const row = rowRef.current
      if (!row) return
      const width = row.getBoundingClientRect().width
      let lastX = event.clientX
      setActiveHandle(index)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      function onMove(moveEvent: PointerEvent) {
        const deltaPx = moveEvent.clientX - lastX
        lastX = moveEvent.clientX
        applyDelta(index, (deltaPx / width) * 100)
      }
      function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        setActiveHandle(null)
        // Read from the ref — updating the store inside a setState updater
        // would be a side effect during render.
        setSplit(id, sizesRef.current)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [applyDelta, id, setSplit],
  )

  return (
    <div
      ref={rowRef}
      style={{ gap }}
      className={cn('flex flex-col items-stretch', stackClass[stackBelow], className)}
    >
      {panes.map((pane, index) => (
        <div key={pane.id} className="contents">
          <section
            style={{ flexBasis: `${sizes[index]}%` }}
            className="min-w-0 flex-1 lg:flex-none"
          >
            {pane.content}
          </section>

          {index < panes.length - 1 ? (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label={`Resize ${pane.id} panel`}
              aria-valuenow={Math.round(sizes[index]!)}
              aria-valuemin={pane.min ?? 15}
              aria-valuemax={100 - (panes[index + 1]?.min ?? 15)}
              tabIndex={0}
              onPointerDown={startDrag(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  applyDelta(index, -2)
                } else if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  applyDelta(index, 2)
                } else if (event.key === 'Home') {
                  event.preventDefault()
                  applyDelta(index, -100)
                } else if (event.key === 'End') {
                  event.preventDefault()
                  applyDelta(index, 100)
                }
              }}
              className={cn(
                'group relative -mx-1 w-2 shrink-0 cursor-col-resize items-center justify-center',
                handleShow[stackBelow],
              )}
            >
              <span
                className={cn(
                  'h-12 w-1 rounded-full transition-colors',
                  activeHandle === index
                    ? 'bg-brand-600'
                    : 'bg-hairline group-hover:bg-brand-400 group-focus:bg-brand-600',
                )}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export type LayoutVariant = 'single' | 'split' | 'triple'

export interface PageLayoutProps {
  variant?: LayoutVariant
  id?: string
  primary: ReactNode
  secondary?: ReactNode
  tertiary?: ReactNode
  /** Fixed (non-resizable) single column max width, e.g. forms. */
  maxWidth?: number
  className?: string
}

/**
 * The three page shapes used across the app:
 *  - `single` — one column, optionally width-capped for readability
 *  - `split`  — content + contextual panel, divider draggable
 *  - `triple` — nav/list/detail, both dividers draggable
 */
export function PageLayout({
  variant = 'single',
  id = 'layout',
  primary,
  secondary,
  tertiary,
  maxWidth,
  className,
}: PageLayoutProps) {
  if (variant === 'single' || !secondary) {
    return (
      <div style={maxWidth ? { maxWidth } : undefined} className={className}>
        {primary}
      </div>
    )
  }

  if (variant === 'triple' && tertiary) {
    return (
      <Resizable
        id={id}
        className={className}
        panes={[
          { id: 'primary', content: primary, initial: 40, min: 20 },
          { id: 'secondary', content: secondary, initial: 35, min: 20 },
          { id: 'tertiary', content: tertiary, initial: 25, min: 15 },
        ]}
      />
    )
  }

  return (
    <Resizable
      id={id}
      className={className}
      panes={[
        { id: 'primary', content: primary, initial: 68, min: 35 },
        { id: 'secondary', content: secondary, initial: 32, min: 20 },
      ]}
    />
  )
}
