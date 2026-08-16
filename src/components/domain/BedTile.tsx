import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { CapacityBay, CapacityState } from '@/data/types'

const STATE_STYLE: Record<CapacityState, { tile: string; text: string; swatch: string; label: string }> = {
  occupied: {
    tile: 'bg-info-soft border-info/25',
    text: 'text-info',
    swatch: 'bg-info-soft border-info',
    label: 'In Operation',
  },
  available: {
    tile: 'bg-success-soft border-success/30',
    text: 'text-success',
    swatch: 'bg-success-soft border-success',
    label: 'Available',
  },
  maintenance: {
    tile: 'bg-neutral-soft border-dashed border-ink-subtle/50',
    text: 'text-ink-subtle',
    swatch: 'bg-neutral-soft border-dashed border-ink-subtle',
    label: 'Maintenance',
  },
}

export function BedTile({
  bed,
  selected,
  onSelect,
}: {
  bed: CapacityBay
  selected: boolean
  onSelect: (bed: CapacityBay) => void
}) {
  const style = STATE_STYLE[bed.state]
  const occupantLabel = bed.state === 'occupied' ? (bed.project || bed.patient || 'Active Project') : style.label

  return (
    <button
      type="button"
      onClick={() => onSelect(bed)}
      aria-pressed={selected}
      aria-label={`Bay ${bed.id}, ${style.label}${bed.project ? `, ${bed.project}` : ''}`}
      className={cn(
        'cursor-pointer rounded-tile border-[1.5px] px-3 py-2.5 text-left transition-shadow hover:shadow-lift',
        style.tile,
        selected && 'border-solid border-brand-600 ring-2 ring-brand-600/25',
      )}
    >
      <div className="flex items-center justify-between">
        <span data-numeric className={cn('block text-2xs font-semibold', style.text)}>
          {bed.id}
        </span>
        <span className="text-[10px] font-mono text-ink-subtle">{bed.utilization}</span>
      </div>
      <span className={cn('mt-1 flex items-center gap-1 text-xs font-medium', style.text)}>
        {bed.state === 'maintenance' ? <Icon name="settings" size={10} strokeWidth={2.2} /> : null}
        <span className="truncate">{occupantLabel}</span>
      </span>
    </button>
  )
}

export const CapacityTile = BedTile
export const ResourceTile = BedTile

export function BedLegend({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-4', className)}>
      {(Object.keys(STATE_STYLE) as CapacityState[]).map((state) => (
        <li key={state} className="flex items-center gap-1.5 text-xs text-ink-muted">
          <span
            aria-hidden
            className={cn('size-3 rounded-[3px] border-[1.5px]', STATE_STYLE[state].swatch)}
          />
          {STATE_STYLE[state].label}
        </li>
      ))}
    </ul>
  )
}

export const CapacityLegend = BedLegend
