import type { ReactNode } from 'react'
import { Avatar, Badge, CopyButton, Icon, type IconName } from '@/components/ui'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/cn'
import type { CustomerRecord } from '@/data/types'

function healthBand(score: number) {
  if (score >= 90)
    return {
      label: 'Optimal Health',
      next: 'Account in prime standing',
      pill: 'bg-success-soft text-success border-success/30',
    } as const
  if (score >= 75)
    return {
      label: 'Good Health',
      next: 'Standard monitoring',
      pill: 'bg-brand-50 text-brand-600 border-brand-200',
    } as const
  if (score >= 60)
    return {
      label: 'Watchlist',
      next: 'Executive touchpoint needed',
      pill: 'bg-warning-soft text-warning border-warning/30',
    } as const
  return {
    label: 'Churn Risk',
    next: 'Immediate escalation',
    pill: 'bg-critical-soft text-critical border-critical/30',
  } as const
}

function Fact({ icon, label, value }: { icon: IconName; label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid size-7 shrink-0 place-items-center rounded-tile bg-subtle text-ink-muted">
        <Icon name={icon} size={13} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] leading-tight font-semibold tracking-wider text-ink-subtle uppercase">
          {label}
        </span>
        <span className="block truncate text-xs font-semibold text-ink">{value}</span>
      </span>
    </div>
  )
}

function deltaFor(record: CustomerRecord, label: string): number | null {
  const series = record.trends?.find(
    (trend) => trend.label === label || trend.label.startsWith(label),
  )
  if (!series || series.points.length < 2) return null
  const last = series.points[series.points.length - 1]!.value
  const previous = series.points[series.points.length - 2]!.value
  return Math.round((last - previous) * 10) / 10
}

/**
 * Enterprise Account 360 Identity Banner
 */
export function PatientBanner({
  record,
  actions,
  className,
}: {
  record: CustomerRecord
  actions?: ReactNode
  className?: string
}) {
  const band = healthBand(record.health?.total ?? 94)
  const tags = record.tags ?? ['SOC 2 Type II', 'Enterprise SLA', 'Auto-Renew']

  return (
    <section
      aria-label={`Account banner for ${record.name}`}
      className={cn(
        'overflow-hidden rounded-card border border-hairline bg-surface shadow-card',
        className,
      )}
    >
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3 p-4 sm:px-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Avatar name={record.name} size={46} tone="brand" className="shrink-0" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="truncate text-lg leading-tight font-bold tracking-tight text-ink">
                {record.name}
              </h2>
              <span className="text-sm font-medium text-ink-muted">
                {record.industry || 'Enterprise Technology'} · {record.location || 'Global'}
              </span>
              <Badge tone="brand" className="font-bold">
                <Icon name="badge" size={10} /> {record.tier || 'Enterprise'}
              </Badge>
              <StatusBadge status={record.status} />
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span data-numeric className="font-mono text-xs text-ink-muted">
                {record.id}
              </span>
              <CopyButton value={record.id} label="Copy Account ID" />
              {record.primaryContact?.email ? (
                <a
                  href={`mailto:${record.primaryContact.email}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-ink-body hover:text-brand-600"
                >
                  <Icon name="userCheck" size={12} />
                  {record.primaryContact.name} ({record.primaryContact.role})
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Health Score Pill */}
        <div
          className={cn(
            'flex shrink-0 items-center gap-2.5 rounded-card border px-3.5 py-2',
            band.pill,
          )}
        >
          <span data-numeric className="text-2xl leading-none font-bold">
            {record.health?.total ?? 94}
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-bold tracking-wider uppercase opacity-80">
              Account Health · {band.label}
            </span>
            <span className="block text-xs font-semibold">{band.next}</span>
          </span>
        </div>

        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">{actions}</div>
        ) : null}
      </div>

      {/* Compliance & Security Strip */}
      <div
        className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-y border-hairline-teal bg-subtle px-4 py-2 sm:px-5"
      >
        <Icon
          name="shield"
          size={14}
          strokeWidth={2.4}
          className="shrink-0 text-brand-600"
        />
        <span className="text-[10px] font-bold tracking-widest text-ink-subtle uppercase">
          Key Attributes
        </span>
        <span className="text-sm font-semibold text-ink-body">
          {tags.join(' · ')}
        </span>
        <span className="ml-auto text-2xs text-ink-subtle">
          Contract Active · {record.branch}
        </span>
      </div>

      {/* Standing facts */}
      <div className="grid gap-x-5 gap-y-3 px-4 py-3.5 sm:grid-cols-2 sm:px-5 lg:grid-cols-3 xl:grid-cols-6">
        <Fact icon="coins" label="Annual Run Rate (ARR)" value={`$${((record.arr || 640000) / 1000).toFixed(0)}k/yr`} />
        <Fact icon="clock" label="Contract Length" value={record.profile?.contractLength || '24 Months'} />
        <Fact icon="userCheck" label="Executive Lead" value={record.profile?.executiveSponsor || 'Jagat Chaudhary'} />
        <Fact
          icon="receipt"
          label="Billing Cadence"
          value={
            <span className="text-ink font-semibold">
              {record.profile?.billingCadence || 'Annual Upfront'}
            </span>
          }
        />
        <Fact icon="shield" label="SLA Guarantee" value={record.sla?.uptime || '99.98%'} />
        <Fact icon="briefcase" label="Account Tier" value={record.tier || 'Enterprise'} />
      </div>

      {/* Latest observations / Live Key Telemetry */}
      <div className="scrollbar-slim flex gap-2 overflow-x-auto border-t border-hairline-teal bg-subtle px-4 py-2.5 sm:px-5">
        {(record.vitals || []).slice(0, 6).map((vital) => {
          const delta = deltaFor(record, vital.label)
          return (
            <div
              key={vital.label}
              className={cn(
                'flex shrink-0 items-baseline gap-1.5 rounded-tile border px-2.5 py-1.5',
                vital.abnormal ? 'border-critical/30 bg-critical-soft' : 'border-hairline bg-surface',
              )}
            >
              <span className="text-[10px] font-semibold tracking-wider text-ink-subtle uppercase">
                {vital.label}
              </span>
              <span
                data-numeric
                className={cn('text-sm font-bold', vital.abnormal ? 'text-critical' : 'text-ink')}
              >
                {vital.value}
              </span>
              <span className="text-[10px] text-ink-subtle">{vital.unit}</span>
              {delta !== null && delta !== 0 ? (
                <span
                  data-numeric
                  title={`${delta > 0 ? 'Up' : 'Down'} ${Math.abs(delta)}`}
                  className={cn(
                    'text-[10px] font-bold',
                    vital.abnormal ? 'text-critical' : 'text-ink-muted',
                  )}
                >
                  {delta > 0 ? '▲' : '▼'}
                  {Math.abs(delta)}
                </span>
              ) : null}
            </div>
          )
        })}
        <span className="ml-auto shrink-0 self-center pl-2 text-2xs whitespace-nowrap text-ink-subtle">
          Telemetry live · {record.branch}
        </span>
      </div>
    </section>
  )
}

export const OrderBanner = PatientBanner
export const AccountBanner = PatientBanner
export const CustomerBanner = PatientBanner
