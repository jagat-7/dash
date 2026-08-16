import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Field, Icon, Input, SearchSelect, type IconName } from '@/components/ui'
import { BRANCHES, CURRENT_USER } from '@/data/branches'
import { BRAND } from '@/data/brand'
import { useAppStore } from '@/store/useAppStore'

/** Core capabilities of Forward CRM + ERP */
const FEATURES: { icon: IconName; title: string; detail: string }[] = [
  {
    icon: 'deal',
    title: 'Enterprise CRM & Pipeline',
    detail: 'Capture, qualify and route high-value enterprise leads with automated territory assignments.',
  },
  {
    icon: 'layers',
    title: 'Cloud ERP & Operations Board',
    detail: 'Real-time resource capacity, compute cluster allocation, and multi-facility workload queues.',
  },
  {
    icon: 'activity',
    title: 'QA Work Orders & Dispatch',
    detail: 'End-to-end task tracking, quality inspection protocols, and high-priority SLA escalations.',
  },
  {
    icon: 'warehouse',
    title: 'Global Supply Chain & SKUs',
    detail: 'Safety stock thresholds, automatic PO reorders, and multi-warehouse component tracking.',
  },
  {
    icon: 'receipt',
    title: 'B2B Invoicing & AR Ledger',
    detail: 'Recurring ARR contracts, milestone invoicing, and automated clearing reconciliation.',
  },
  {
    icon: 'chartBar',
    title: 'Executive Financial Intelligence',
    detail: 'Consolidated ARR run-rates, customer tier mix, and business unit profitability analytics.',
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const signIn = useAppStore((state) => state.signIn)
  const branchId = useAppStore((state) => state.branchId)
  const setBranch = useAppStore((state) => state.setBranch)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    window.setTimeout(() => {
      signIn()
      navigate('/', { replace: true })
    }, 450)
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(420px,44%)] lg:grid-rows-[auto_1fr]">
      <div className="order-1 bg-deep px-5 pt-7 pb-8 sm:px-10 sm:pt-10 lg:col-start-1 lg:row-start-1 lg:px-13 lg:pt-13 lg:pb-0">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-field bg-sky-500">
            <Icon name="logo" size={16} strokeWidth={2.8} className="text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">{BRAND.fullName}</span>
        </div>

        <h1 className="mt-7 max-w-xl text-[26px] leading-[1.15] font-bold tracking-[-0.02em] text-white sm:text-[32px] lg:mt-12 lg:text-4xl">
          Unified CRM &amp; Intelligent ERP for modern global enterprises.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-deep-soft sm:text-md">
          One consolidated console for every business unit — from pipeline deal qualification to automated ledger accounting.
        </p>
      </div>

      <div className="order-3 flex flex-col justify-between gap-8 bg-deep px-5 pb-8 sm:px-10 sm:pb-10 lg:col-start-1 lg:row-start-2 lg:px-13 lg:pb-13">
        <ul className="grid gap-x-6 gap-y-4 pt-2 sm:grid-cols-2 lg:pt-9">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-tile bg-white/10 text-sky-300">
                <Icon name={feature.icon} size={14} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{feature.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-deep-soft/85">
                  {feature.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-sky-400/60">© 2026 {BRAND.owner} · {BRAND.version}</p>
      </div>

      {/* Credentials */}
      <div className="order-2 grid place-items-center bg-surface px-5 py-9 sm:p-10 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <form onSubmit={handleSubmit} className="w-full max-w-95">
          <div className="mb-7">
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Sign in to Forward Enterprise
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
              Use your corporate SSO or executive credentials
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Field label="Corporate email or SSO ID">
              <Input
                type="email"
                inputSize="lg"
                autoComplete="username"
                placeholder={CURRENT_USER.email}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>

            <Field label="Password">
              <span className="relative block">
                <Input
                  type={revealed ? 'text' : 'password'}
                  inputSize="lg"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-11"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setRevealed((value) => !value)}
                  aria-label={revealed ? 'Hide password' : 'Show password'}
                  aria-pressed={revealed}
                  className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-control text-ink-subtle transition-colors hover:bg-subtle hover:text-ink"
                >
                  <Icon name={revealed ? 'eyeOff' : 'eye'} size={16} />
                </button>
              </span>
            </Field>

            <Field label="Business Unit / Entity" hint="Global admins can switch business units anytime.">
              <SearchSelect
                size="lg"
                clearable={false}
                value={branchId}
                onChange={setBranch}
                searchPlaceholder="Select Business Unit…"
                options={BRANCHES.map((branch) => ({
                  value: branch.id,
                  label: branch.id === 'all' ? 'All Business Units (Enterprise Admin)' : branch.name,
                  hint: branch.code,
                }))}
              />
            </Field>

            <Button type="submit" size="xl" pill block loading={submitting} className="mt-1">
              Sign in to Console →
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-muted">
              <Checkbox label="Keep me signed in" defaultChecked />
              <a href="#reset" className="font-medium text-brand-600 hover:text-brand-500">
                Forgot password?
              </a>
            </div>

            <p className="mt-1 flex items-start gap-2 rounded-field bg-subtle px-3 py-2.5 text-xs text-ink-muted">
              <Icon name="help" size={14} className="mt-px shrink-0 text-ink-subtle" />
              Interactive Prototype — any credentials grant enterprise access.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
