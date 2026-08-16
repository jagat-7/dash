import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Icon, Kbd, type IconName } from '@/components/ui'
import { cn } from '@/lib/cn'
import { MODULES } from '@/data/navigation'
import { PATIENTS } from '@/data/patients'

interface Entry {
  id: string
  label: string
  /** Where the entry sits — the module it belongs to. */
  context: string
  icon: IconName
  to: string
  kind: 'Module' | 'Menu' | 'Patient' | 'Account'
}

/** Flattened index: every module, every sub-menu item, every patient. */
function buildIndex(): Entry[] {
  const entries: Entry[] = []

  for (const module of MODULES) {
    entries.push({
      id: `module:${module.key}`,
      label: module.label,
      context: module.description,
      icon: module.icon,
      to: module.path,
      kind: 'Module',
    })
    for (const link of module.links) {
      entries.push({
        id: `link:${module.key}:${link.label}`,
        label: link.label,
        context: module.label,
        icon: link.icon,
        to: link.to,
        kind: 'Menu',
      })
    }
  }

  for (const patient of PATIENTS) {
    entries.push({
      id: `account:${patient.id}`,
      label: patient.name,
      context: `${patient.id} · ${patient.industry || 'Enterprise'} · $${((patient.arr || 480000) / 1000).toFixed(0)}k ARR`,
      icon: 'users',
      to: `/orders`,
      kind: 'Account',
    })
  }

  return entries
}

const KIND_TONE: Record<string, string> = {
  Module: 'bg-brand-50 text-brand-600',
  Menu: 'bg-subtle text-ink-muted',
  Account: 'bg-info-soft text-info',
  Order: 'bg-emerald-50 text-emerald-600',
}

/** Opens the palette from anywhere: ⌘K / Ctrl-K, and the topbar trigger. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return { open, setOpen }
}

/**
 * Search over modules, their sub-menus and the patient directory — as an
 * overlay, not an inline dropdown.
 *
 * An inline popup has to be laid out inside the topbar, where it competes with
 * the branch switcher and the page beneath it for space and stacking order. As
 * a dialog it owns the screen, is always centred and legible on a phone, and
 * the topbar keeps only a compact trigger on the right.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const index = useMemo(buildIndex, [])
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return index.filter((entry) => entry.kind === 'Module').slice(0, 8)
    return index
      .filter(
        (entry) =>
          entry.label.toLowerCase().includes(needle) ||
          entry.context.toLowerCase().includes(needle),
      )
      // Exact prefix matches first, then modules before menus before patients.
      .sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(needle) ? 0 : 1
        const bStarts = b.label.toLowerCase().startsWith(needle) ? 0 : 1
        if (aStarts !== bStarts) return aStarts - bStarts
        const order: Record<string, number> = { Module: 0, Menu: 1, Patient: 2, Account: 2 }
        return (order[a.kind] ?? 3) - (order[b.kind] ?? 3)
      })
      .slice(0, 12)
  }, [index, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => {
      window.clearTimeout(timer)
      window.setTimeout(() => document.body.style.removeProperty('overflow'), 0)
      document.body.style.overflow = overflow
    }
  }, [open])

  // Keep the highlighted row inside the scroll well when arrowing past its edge.
  useEffect(() => {
    listRef.current?.querySelectorAll('li')[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  function go(entry: Entry) {
    navigate(entry.to)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-60 flex animate-fade-in justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search modules, menus, customers and orders"
        className="flex max-h-[70vh] w-full max-w-[560px] animate-fade-up flex-col overflow-hidden rounded-panel border border-hairline bg-surface shadow-modal"
      >
        <div className="flex shrink-0 items-center gap-2.5 border-b border-hairline-teal px-4">
          <Icon name="search" size={15} strokeWidth={2.2} className="shrink-0 text-ink-subtle" />
          <input
            ref={inputRef}
            value={query}
            role="combobox"
            aria-expanded
            aria-controls="command-palette-results"
            placeholder="Search modules, menus, customers, orders…"
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActive((current) => (current + 1) % Math.max(1, matches.length))
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActive((current) => (current - 1 + matches.length) % Math.max(1, matches.length))
              } else if (event.key === 'Enter') {
                event.preventDefault()
                const entry = matches[active]
                if (entry) go(entry)
              } else if (event.key === 'Escape') {
                event.preventDefault()
                onClose()
              }
            }}
            className="h-13 w-full min-w-0 border-none bg-transparent text-md text-ink outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 cursor-pointer rounded p-1 text-ink-subtle transition-colors hover:text-ink"
          >
            <Icon name="close" size={15} strokeWidth={2.2} />
          </button>
        </div>

        <ul
          ref={listRef}
          id="command-palette-results"
          role="listbox"
          /* No `flex-1`: the dialog hugs its results instead of holding open a
             half-empty well when only a few things match. */
          className="scrollbar-slim min-h-0 shrink overflow-y-auto py-1.5"
        >
          {matches.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-ink-subtle">
              Nothing matches “{query}”
            </li>
          ) : (
            matches.map((entry, index) => (
              <li key={entry.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(entry)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors',
                    index === active ? 'bg-subtle' : '',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-tile',
                      KIND_TONE[entry.kind],
                    )}
                  >
                    <Icon name={entry.icon} size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {entry.label}
                    </span>
                    <span className="block truncate text-xs text-ink-subtle">{entry.context}</span>
                  </span>
                  <span className="shrink-0 text-2xs text-ink-subtle">{entry.kind}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-hairline-teal bg-subtle px-4 py-2 text-2xs text-ink-subtle">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> move
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> open
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>esc</Kbd> close
          </span>
          <span className="ml-auto hidden sm:block">{matches.length} results</span>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

/** Topbar trigger — prominent search bar that opens the command palette dialog. */
export function CommandTrigger({
  onOpen,
  className,
}: {
  onOpen: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search modules, menus and patients"
      className={cn(
        'group flex h-9.5 cursor-pointer items-center gap-2.5 rounded-field border border-hairline-teal bg-subtle/80 px-3.5 text-xs text-ink-subtle shadow-2xs transition-all hover:border-brand-300 hover:bg-surface hover:text-ink hover:shadow-xs',
        className,
      )}
    >
      <Icon name="search" size={15} strokeWidth={2.2} className="shrink-0 text-ink-subtle transition-colors group-hover:text-brand-600" />
      <span className="truncate text-sm font-normal text-ink-muted group-hover:text-ink">
        Search modules, records, actions…
      </span>
      <span className="ml-auto hidden shrink-0 items-center gap-0.5 sm:flex">
        <Kbd>⌘K</Kbd>
      </span>
    </button>
  )
}
