import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'
import type {
  CareTeamMember,
  EwsScore,
  FluidBalance,
  MarRow,
  VitalSeries,
} from '@/data/types'

/* ------------------------------------------------------------- Account Health Score */

function healthBand(total: number) {
  if (total >= 90) return { label: 'Optimal Standing', tone: 'success', action: 'Prime health · standard quarterly touchpoints' } as const
  if (total >= 75) return { label: 'Good Standing', tone: 'brand', action: 'Healthy adoption · expansion potential' } as const
  if (total >= 60) return { label: 'Watchlist', tone: 'warning', action: 'Active engagement · CSM review required' } as const
  return { label: 'At Risk', tone: 'critical', action: 'Executive intervention · churn risk mitigation' } as const
}

const SCORE_FILL = ['bg-success', 'bg-brand-500', 'bg-warning', 'bg-critical']

export function EwsCard({ ews, className }: { ews?: EwsScore; className?: string }) {
  if (!ews) return null
  const band = healthBand(ews.total)
  const worst = [...(ews.parameters || [])].sort((a, b) => b.score - a.score)[0]

  return (
    <div className={cn('rounded-card border border-hairline bg-surface p-4', className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="text-sm font-semibold text-ink">Account Health Breakdown</h3>
        <span data-numeric className="text-2xs text-ink-muted">
          {ews.total}/100 index score · {ews.parameters?.length || 0} telemetry metrics
        </span>
      </div>
      {worst && worst.score > 0 ? (
        <p className="mt-1 text-xs text-ink-muted">
          Lead driver:{' '}
          <b className="font-semibold text-ink-body">{worst.label}</b> ·{' '}
          {band.action}
        </p>
      ) : (
        <p className="mt-1 text-xs text-ink-muted">{band.action}</p>
      )}

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {(ews.parameters || []).map((param) => (
          <li
            key={param.label}
            className="flex items-center justify-between gap-2 rounded-tile border border-hairline bg-subtle px-2.5 py-1.5"
          >
            <span className="flex items-center gap-1.5 text-xs text-ink-body">
              <Icon name={param.icon} size={13} className="text-ink-subtle" />
              {param.label}
            </span>
            <div className="flex items-center gap-2">
              <span data-numeric className="text-xs font-semibold text-ink">
                {param.value}
              </span>
              <span className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'size-1.5 rounded-full',
                      i <= param.score ? SCORE_FILL[param.score] : 'bg-hairline',
                    )}
                  />
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const HealthScoreCard = EwsCard

/* ------------------------------------------------------------- Real-time Telemetry Monitor */

export function VitalsMonitor({
  rate = 74,
  label = 'Real-time API Ingestion Throughput',
  pulse,
  spo2,
  respiration,
  className,
}: {
  rate?: number
  label?: string
  pulse?: string
  spo2?: string
  respiration?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-between gap-4 overflow-hidden rounded-card border border-hairline bg-[#0F172A] p-4 text-white shadow-card',
        className,
      )}
    >
      <div className="relative z-10 min-w-0">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <h3 className="truncate text-xs font-bold tracking-wider text-slate-300 uppercase">
            {label}
          </h3>
        </div>
        <p className="mt-1 text-2xs text-slate-400">
          {pulse || spo2 || respiration ? `Telemetry: ${pulse || '74'} ms latency · ${spo2 || '99.9%'} SLA` : 'Zero packet drop · 99.99% uptime across production clusters'}
        </p>
      </div>

      <div className="relative z-10 flex shrink-0 items-baseline gap-1.5">
        <span data-numeric className="text-3xl font-black tracking-tight text-emerald-400">
          {rate}
        </span>
        <span className="text-xs font-bold text-slate-400">req/s</span>
      </div>

      {/* Decorative waveform */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 600 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 L120 40 L140 20 L160 60 L180 30 L200 40 L340 40 L360 15 L380 65 L400 35 L420 40 L600 40"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  )
}

export const TelemetryMonitor = VitalsMonitor

/* ------------------------------------------------------------- Metric Trends */

export function VitalTrend({ series, className }: { series: VitalSeries; className?: string }) {
  const points = series.points || []
  const current = points[points.length - 1] || { label: 'Aug', value: 0 }
  const previous = points[points.length - 2]
  const delta = previous ? Math.round((current.value - previous.value) * 10) / 10 : null

  return (
    <div className={cn('rounded-card border border-hairline bg-surface p-4', className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <Icon name={series.icon} size={14} className="text-brand-600" />
            <h4 className="text-xs font-bold tracking-wider text-ink-muted uppercase">
              {series.label}
            </h4>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span data-numeric className="text-2xl font-bold text-ink">
              {current.value}
            </span>
            <span className="text-xs text-ink-subtle">{series.unit}</span>
            {delta !== null && (
              <span
                data-numeric
                className={cn(
                  'text-xs font-bold',
                  delta > 0 ? 'text-success' : delta < 0 ? 'text-critical' : 'text-ink-muted',
                )}
              >
                {delta > 0 ? `+${delta}` : delta}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sparkline track */}
      <div className="mt-4 flex items-end gap-1.5 h-12">
        {points.map((pt, i) => (
          <div key={pt.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div
              style={{ height: `${Math.min(100, Math.max(15, (pt.value / (series.high || 100)) * 100))}%` }}
              className={cn(
                'w-full rounded-xs transition-all',
                i === points.length - 1 ? 'bg-brand-600' : 'bg-brand-200 dark:bg-brand-800',
              )}
            />
            <span className="text-[9px] font-mono text-ink-subtle">{pt.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const MetricTrend = VitalTrend

/* ------------------------------------------------------------- Delivery & Service Schedule */

const STATE_DOT: Record<string, string> = {
  given: 'bg-success',
  due: 'bg-warning',
  missed: 'bg-critical',
  held: 'bg-neutral',
  scheduled: 'border border-hairline bg-surface',
}

export function MedicationSchedule({ rows, className }: { rows: MarRow[]; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-card border border-hairline bg-surface', className)}>
      <div className="border-b border-hairline bg-subtle px-4 py-2.5">
        <h3 className="text-xs font-bold tracking-wider text-ink-muted uppercase">
          SLA Delivery Schedule & Milestones
        </h3>
      </div>
      <div className="divide-y divide-hairline">
        {rows.map((row) => (
          <div key={row.medication} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4">
            <div className="min-w-0">
              <span className="block text-sm font-semibold text-ink">{row.medication}</span>
              <span className="text-xs text-ink-subtle">{row.dose} · {row.route}</span>
            </div>
            <div className="flex items-center gap-2">
              {(row.doses || []).map((dose, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-ink-subtle">{dose.time}</span>
                  <span className={cn('size-3 rounded-full', STATE_DOT[dose.state] || 'bg-brand-500')} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const ServiceSchedule = MedicationSchedule

/* ------------------------------------------------------------- Benchmark Reference */

export function ReferenceRange({
  value,
  min = 0,
  max = 100,
  low,
  high,
  label,
  test,
  unit = '',
  className,
}: {
  value: number
  min?: number
  max?: number
  low?: number
  high?: number
  label?: string
  test?: string
  unit?: string
  flag?: string
  className?: string
}) {
  const minVal = low ?? min
  const maxVal = high ?? max
  const title = label || test || 'Benchmark'
  const pct = Math.min(100, Math.max(0, ((value - minVal) / Math.max(1, (maxVal - minVal))) * 100))

  return (
    <div className={cn('rounded-card border border-hairline bg-surface p-3', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink-muted">{title}</span>
        <span data-numeric className="font-bold text-ink">
          {value} {unit}
        </span>
      </div>
      <div className="relative mt-2 h-2 w-full rounded-full bg-subtle">
        <div
          style={{ left: `${pct}%` }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full border-2 border-surface bg-brand-600"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Stakeholder Team */

export function CareTeam({ members = [], className }: { members: CareTeamMember[]; className?: string }) {
  return (
    <div className={cn('rounded-card border border-hairline bg-surface p-4', className)}>
      <h3 className="text-xs font-bold tracking-wider text-ink-muted uppercase">
        Assigned Account & Engineering Team
      </h3>
      <ul className="mt-3 divide-y divide-hairline">
        {members.map((member) => (
          <li key={member.name} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon name={member.icon || 'userCheck'} size={13} />
              </span>
              <div>
                <span className="block text-xs font-semibold text-ink">{member.name}</span>
                <span className="block text-[10px] text-ink-subtle">{member.role}</span>
              </div>
            </div>
            <a
              href={`mailto:${member.contact}`}
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Contact
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const AccountTeam = CareTeam

/* ------------------------------------------------------------- Revenue Balance Card */

export function FluidBalanceCard({ fluids, className }: { fluids?: FluidBalance; className?: string }) {
  const intake = fluids?.intake ?? fluids?.subscription ?? 480000
  const output = fluids?.output ?? fluids?.professionalServices ?? 110000

  return (
    <div className={cn('rounded-card border border-hairline bg-surface p-4', className)}>
      <h3 className="text-xs font-bold tracking-wider text-ink-muted uppercase">
        Contract Revenue Run-Rate
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-tile bg-subtle p-2.5">
          <span className="block text-[10px] text-ink-subtle uppercase">Contract Inflows</span>
          <span data-numeric className="text-lg font-bold text-success">
            ${(intake / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="rounded-tile bg-subtle p-2.5">
          <span className="block text-[10px] text-ink-subtle uppercase">Delivery Outflows</span>
          <span data-numeric className="text-lg font-bold text-ink">
            ${(output / 1000).toFixed(0)}k
          </span>
        </div>
      </div>
    </div>
  )
}

export const RevenueBalanceCard = FluidBalanceCard
