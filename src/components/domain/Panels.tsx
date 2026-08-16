import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Card, Icon, type IconName } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Alert, AlertLevel, Encounter, SoapNote, Vital } from '@/data/types'

/* ------------------------------------------------------------- KPI card */

export interface KpiCardProps {
  label: string
  value: ReactNode
  /** Supporting line under the value — a delta, a ratio, a count. */
  detail: ReactNode
  tone?: 'success' | 'critical' | 'brand' | 'muted'
  /** 3px gradient strip along the card's top edge. */
  accent: string
}

const detailTone = {
  success: 'text-success',
  critical: 'text-critical',
  brand: 'text-brand-600',
  muted: 'text-ink-muted',
} as const

export function KpiCard({ label, value, detail, tone = 'muted', accent }: KpiCardProps) {
  return (
    <Card accent={accent}>
      <div className="px-5 pt-4 pb-4.5">
        <p className="mb-2.5 text-2xs font-bold tracking-[0.07em] text-ink-subtle uppercase">{label}</p>
        <p data-numeric className="text-[28px] leading-none font-bold tracking-tight text-ink">
          {value}
        </p>
        <p className={cn('mt-2 text-xs font-semibold', detailTone[tone])}>{detail}</p>
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------------- Alerts */

const alertStyles: Record<AlertLevel, { bar: string; bg: string; text: string; icon: IconName }> = {
  critical: { bar: 'bg-critical', bg: 'bg-critical-soft', text: 'text-critical-deep', icon: 'alert' },
  warning: { bar: 'bg-warning', bg: 'bg-warning-soft', text: 'text-warning-deep', icon: 'alert' },
  info: { bar: 'bg-brand-600', bg: 'bg-brand-50', text: 'text-brand-600', icon: 'inbox' },
}

/** Alert rows carry an icon plus a word — never level-by-color alone. */
export function AlertList({ alerts, className }: { alerts: readonly Alert[]; className?: string }) {
  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {alerts.map((alert) => {
        const style = alertStyles[alert.level]
        return (
          <li
            key={alert.id}
            className={cn('flex gap-2.5 overflow-hidden rounded-field', style.bg)}
          >
            <span aria-hidden className={cn('w-1 shrink-0', style.bar)} />
            <span className={cn('flex items-start gap-2 py-2.5 pr-3', style.text)}>
              <Icon name={style.icon} size={13} strokeWidth={2.2} className="mt-0.5" />
              <span className="min-w-0">
                <span className="block text-xs font-semibold">{alert.title}</span>
                <span className="mt-0.5 block text-2xs opacity-80">{alert.detail}</span>
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------------------------------------------------------------- Vitals */

export function VitalCard({ vital, size = 'sm' }: { vital: Vital; size?: 'sm' | 'lg' }) {
  return (
    <div
      className={cn(
        'rounded-tile border border-hairline',
        size === 'sm' ? 'px-3 py-2.5' : 'p-3.5',
        vital.abnormal ? 'bg-critical-soft' : 'bg-neutral-soft',
      )}
    >
      <p className={cn('text-ink-muted', size === 'sm' ? 'text-2xs' : 'text-xs')}>{vital.label}</p>
      <p
        data-numeric
        className={cn(
          'mt-1 font-bold',
          size === 'sm' ? 'text-lg' : 'text-[22px]',
          vital.abnormal ? 'text-critical' : 'text-ink',
        )}
      >
        {vital.value}
        {vital.unit ? (
          <span className="ml-1 text-3xs font-normal text-ink-subtle">{vital.unit}</span>
        ) : null}
      </p>
      {vital.abnormal ? (
        <p className="mt-0.5 flex items-center gap-1 text-3xs font-semibold text-critical">
          <Icon name="alert" size={9} strokeWidth={2.6} />
          abnormal
        </p>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------- Timeline */

export function Timeline({ items }: { items: readonly Encounter[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => (
        <li key={`${item.date}-${item.title}`} className="flex gap-3 pb-4 last:pb-0">
          <div className="flex flex-col items-center" aria-hidden>
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />
            {index < items.length - 1 ? <span className="mt-1 w-px flex-1 bg-hairline" /> : null}
          </div>
          <div className="min-w-0">
            <p className="text-sm">
              <span className="font-bold text-ink">{item.title}</span>
              <span className="text-xs text-ink-muted"> · {item.where} · {item.date}</span>
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">{item.note}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------ SOAP notes */

const SOAP_SECTIONS = [
  { key: 'subjective', letter: 'S', className: 'text-brand-600' },
  { key: 'objective', letter: 'O', className: 'text-success' },
  { key: 'assessment', letter: 'A', className: 'text-accent-violet' },
  { key: 'plan', letter: 'P', className: 'text-warning' },
] as const

export function NoteCard({ note, muted = false }: { note: SoapNote; muted?: boolean }) {
  return (
    <article
      className={cn('overflow-hidden rounded-tile border border-hairline', muted && 'opacity-75')}
    >
      <header className="flex flex-wrap items-center gap-2 border-b border-hairline-teal bg-subtle px-4 py-3">
        <p className="min-w-0">
          <span className="text-sm font-bold text-ink">
            {note.title} · {note.date}
          </span>
          <span className="text-xs text-ink-muted">
            {' '}
            · {note.author} · {note.where} · {note.time}
          </span>
        </p>
        <span className="ml-auto inline-flex h-5 items-center rounded-full bg-brand-50 px-2.5 text-2xs font-semibold text-brand-600">
          {note.kind}
        </span>
      </header>

      {note.body ? (
        <p className="px-4 py-3.5 text-sm leading-relaxed text-ink-body">{note.body}</p>
      ) : (
        <dl className="flex flex-col gap-3 px-4 py-3.5">
          {SOAP_SECTIONS.map((section) => {
            const text = note[section.key]
            if (!text) return null
            return (
              <div key={section.key} className="grid grid-cols-[24px_1fr] gap-2 text-sm leading-relaxed">
                <dt className={cn('font-bold', section.className)} title={section.key}>
                  {section.letter}
                </dt>
                <dd className="text-ink-soft">{text}</dd>
              </div>
            )
          })}
        </dl>
      )}
    </article>
  )
}

/* --------------------------------------------------------- Order / Patient cell */

/** Avatar + name, linking through to the Order / Customer 360 view. */
export function OrderLink({
  id,
  name,
  showAvatar = true,
}: {
  id: string
  name: string
  showAvatar?: boolean
}) {
  return (
    <Link
      to={`/orders/${id}`}
      className="flex min-w-0 items-center gap-2.5 font-medium text-ink hover:text-brand-600 hover:underline"
      onClick={(event) => event.stopPropagation()}
    >
      {showAvatar ? <Avatar name={name} size={26} /> : null}
      <span className="truncate">{name}</span>
    </Link>
  )
}

export const PatientLink = OrderLink
export const AccountLink = OrderLink
export const CustomerLink = OrderLink
