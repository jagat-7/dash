import { Badge, Button, Icon, ProgressBar } from '@/components/ui'
import { cn } from '@/lib/cn'

/**
 * A slice of real chrome — rail, primary action, badge, link, meter, tinted
 * surface. Rendered from the live components, so whatever the accent does to
 * the app it does here first.
 */
export function AccentPreview({ className }: { className?: string }) {
  return (
    <div className={cn('flex overflow-hidden rounded-card border border-hairline', className)}>
      <div className="hidden w-12 shrink-0 flex-col items-center gap-3 bg-rail py-3.5 sm:flex">
        <Icon name="logo" size={16} className="text-white/90" />
        <span className="grid size-7 place-items-center rounded-tile bg-white/15 text-white">
          <Icon name="dashboard" size={14} />
        </span>
        <Icon name="patients" size={14} className="text-white/55" />
        <Icon name="billing" size={14} className="text-white/55" />
      </div>

      <div className="min-w-0 flex-1 bg-surface p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Admit patient</Button>
          <Button variant="secondary" size="sm">
            Discharge
          </Button>
          <Badge tone="brand">Active</Badge>
          <a href="#preview" className="text-sm font-semibold text-brand-600 hover:underline">
            View record
          </a>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs text-ink-muted sm:w-24">Bed occupancy</span>
          <ProgressBar value={72} label="Bed occupancy 72%" />
          <span className="w-9 shrink-0 text-right text-xs font-semibold text-ink" data-numeric>
            72%
          </span>
        </div>

        <div className="mt-4 rounded-tile bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
          Brand-tinted surfaces — banners, active nav items and hover states — follow too.
        </div>
      </div>
    </div>
  )
}
