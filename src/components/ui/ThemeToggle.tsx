import { Icon } from './Icon'
import { cn } from '@/lib/cn'
import { useResolvedTheme, useThemeStore, type ThemeMode } from '@/store/useTheme'

/** One-click light/dark switch for the topbar. */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = useThemeStore((state) => state.toggle)
  const resolved = useResolvedTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn(
        'relative grid size-[34px] cursor-pointer place-items-center rounded-control border border-hairline bg-surface text-ink-muted transition-colors hover:bg-subtle hover:text-ink',
        className,
      )}
    >
      <Icon name={resolved === 'dark' ? 'moon' : 'sun'} size={16} strokeWidth={1.9} />
    </button>
  )
}

const MODES: { value: ThemeMode; label: string; icon: 'sun' | 'moon' | 'settings' }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'settings' },
]

/** Three-way selector, including following the OS preference. */
export function ThemeSelect({ className }: { className?: string }) {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn('inline-flex rounded-control bg-subtle p-0.5 ring-1 ring-hairline', className)}
    >
      {MODES.map((entry) => (
        <button
          key={entry.value}
          type="button"
          role="radio"
          aria-checked={mode === entry.value}
          onClick={() => setMode(entry.value)}
          className={cn(
            'flex h-7 cursor-pointer items-center gap-1.5 rounded-[5px] px-2.5 text-xs font-semibold transition-all',
            mode === entry.value
              ? 'bg-surface text-ink shadow-hairline'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          <Icon name={entry.icon} size={12} />
          {entry.label}
        </button>
      ))}
    </div>
  )
}
