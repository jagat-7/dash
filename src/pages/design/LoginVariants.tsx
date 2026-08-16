import { Button, Checkbox, Field, Icon, Input, Select } from '@/components/ui'
import { cn } from '@/lib/cn'

/**
 * Four candidate login designs for Forward CRM + ERP
 */

const BRANCHES = [
  'Biratnagar',
  'Kathmandu',
  'Dhangadi',
  'Birtamod',
  'Hetauda',
  'Rajbiraj',
  'Rangeli',
]

function Credentials({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <div className={cn('flex flex-col', compact ? 'gap-3' : 'gap-4')}>
      <Field label={<span className={dark ? 'text-white/80' : undefined}>Corporate email or SSO ID</span>}>
        <Input
          inputSize="lg"
          placeholder="jagat.chaudhary@forward.io"
          className={dark ? 'border-white/20 bg-white/10 text-white placeholder:text-white/40' : undefined}
        />
      </Field>
      <Field label={<span className={dark ? 'text-white/80' : undefined}>Password</span>}>
        <Input
          type="password"
          inputSize="lg"
          placeholder="••••••••"
          className={dark ? 'border-white/20 bg-white/10 text-white placeholder:text-white/40' : undefined}
        />
      </Field>
      <Field label={<span className={dark ? 'text-white/80' : undefined}>Business Unit</span>}>
        <Select
          selectSize="lg"
          options={BRANCHES}
          className={dark ? 'border-white/20 bg-white/10 text-white' : undefined}
        />
      </Field>
    </div>
  )
}

/* ------------------------------------------------- A · Split hero (current) */

export function LoginSplitHero() {
  return (
    <div className="grid h-full min-h-[640px] lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-deep p-12 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(600px 400px at 15% 15%, rgba(14,165,233,.28), transparent 70%), radial-gradient(500px 400px at 90% 90%, rgba(0,137,123,.35), transparent 70%)',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-field bg-sky-500">
            <Icon name="logo" size={16} strokeWidth={2.8} className="text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Forward</span>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-4xl leading-[1.15] font-bold tracking-[-0.02em] text-white">
            Unified CRM &amp; Intelligent ERP for modern global enterprises.
          </h2>
          <p className="mt-5 max-w-md text-md leading-relaxed text-deep-soft">
            Pipeline · Capacity · Work Orders · Supply Chain · Invoicing across every entity in real time.
          </p>
          <ul className="mt-9 grid grid-cols-3 gap-3">
            {[
              ['$42.8M', 'ARR managed'],
              ['99.99%', 'Cloud SLA'],
              ['4', 'global hubs'],
            ].map(([value, label]) => (
              <li key={label} className="rounded-field bg-white/10 px-4 py-3.5 backdrop-blur-sm">
                <p data-numeric className="text-[22px] font-bold text-white">
                  {value}
                </p>
                <p className="mt-0.5 text-xs text-deep-soft">{label}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-sky-300/60">© 2026 Forward Global Technologies · v2.4</p>
      </div>

      <div className="grid place-items-center bg-surface p-8">
        <div className="w-full max-w-[380px]">
          <h3 className="text-2xl font-bold tracking-tight text-ink">Sign in to your account</h3>
          <p className="mt-1.5 text-base text-ink-muted">Use your enterprise SSO credentials</p>
          <div className="mt-8">
            <Credentials />
            <Button size="xl" pill block className="mt-5">
              Sign in to Console →
            </Button>
            <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
              <Checkbox label="Keep me signed in" defaultChecked />
              <a href="#reset" className="font-medium text-brand-600">
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------ B · Centered card */

export function LoginCentered() {
  return (
    <div className="relative grid h-full min-h-[640px] place-items-center overflow-hidden bg-canvas p-6">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 500px at 20% 0%, rgba(0,137,123,.16), transparent 65%), radial-gradient(600px 500px at 85% 100%, rgba(14,165,233,.14), transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-panel bg-brand-600 shadow-fab">
            <Icon name="logo" size={22} strokeWidth={2.8} className="text-white" />
          </span>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink">Welcome back</h3>
          <p className="mt-1.5 text-base text-ink-muted">Sign in to Forward Enterprise</p>
        </div>

        <div className="rounded-panel border border-hairline bg-surface p-7 shadow-modal">
          <Credentials compact />
          <Button size="xl" block className="mt-5">
            Sign in
          </Button>
          <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
            <Checkbox label="Keep me signed in" defaultChecked />
            <a href="#reset" className="font-medium text-brand-600">
              Forgot password?
            </a>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-ink-subtle">
          Protected by Enterprise SSO · © 2026 Forward
        </p>
      </div>
    </div>
  )
}

/* --------------------------------------------------------- C · Glass card */

export function LoginGlass() {
  return (
    <div className="relative grid h-full min-h-[640px] place-items-center overflow-hidden bg-brand-800 p-6">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(800px 600px at 10% 20%, #00695C 0%, transparent 60%), radial-gradient(700px 600px at 90% 80%, #0C4A6E 0%, transparent 60%), linear-gradient(140deg,#062f2b,#0b3d38 60%,#0c4a6e)',
        }}
      />
      <svg aria-hidden className="absolute inset-x-0 top-1/3 h-40 w-full opacity-[0.13]" viewBox="0 0 1200 160" preserveAspectRatio="none">
        <path
          d="M0 120 L180 120 L210 60 L240 140 L270 100 L320 100 L360 40 L400 150 L440 100 L620 100 L650 55 L680 145 L710 100 L900 100 L940 30 L980 155 L1020 100 L1200 100"
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="2.5"
        />
      </svg>

      <div className="relative w-full max-w-[400px]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-field border border-white/25 bg-white/10 backdrop-blur">
            <Icon name="logo" size={17} strokeWidth={2.8} className="text-white" />
          </span>
          <span className="text-md font-bold tracking-tight text-white">Forward</span>
        </div>

        <div className="rounded-panel border border-white/15 bg-white/10 p-7 shadow-modal backdrop-blur-xl">
          <h3 className="text-xl font-bold tracking-tight text-white">Enterprise Sign In</h3>
          <p className="mt-1 text-sm text-white/60">Global access · All business units</p>

          <div className="mt-6">
            <Credentials compact dark />
          </div>

          <Button size="xl" block className="mt-5 bg-white text-brand-700 hover:bg-white/90">
            Sign in to Console →
          </Button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-white/70">
              <input type="checkbox" defaultChecked className="size-4 accent-sky-400" />
              Keep me signed in
            </label>
            <a href="#reset" className="font-medium text-sky-300 hover:text-sky-200">
              Forgot?
            </a>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-white/40">© 2026 Forward Global Technologies · v2.4</p>
      </div>
    </div>
  )
}

/* --------------------------------------------------------- D · Editorial */

export function LoginEditorial() {
  return (
    <div className="grid h-full min-h-[640px] lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col justify-center bg-surface px-8 py-12 sm:px-14">
        <div className="mb-9 flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-control bg-brand-600">
            <Icon name="logo" size={15} strokeWidth={3} className="text-white" />
          </span>
          <span className="text-md font-bold tracking-tight text-ink">Forward</span>
        </div>

        <div className="w-full max-w-[400px]">
          <h3 className="text-[26px] leading-tight font-bold tracking-tight text-ink">
            Sign in to continue
          </h3>
          <p className="mt-2 text-base text-ink-muted">
            Every business unit, one unified ledger. Pick up exactly where you left off.
          </p>

          <div className="mt-7">
            <Credentials />
          </div>

          <Button size="xl" block className="mt-5">
            Sign in
          </Button>

          <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
            <Checkbox label="Keep me signed in" defaultChecked />
            <a href="#reset" className="font-medium text-brand-600">
              Forgot password?
            </a>
          </div>

          <p className="mt-8 border-t border-hairline pt-5 text-xs text-ink-subtle">
            Trouble signing in? Contact Enterprise IT on <b className="text-ink-body">ext. 4120</b>.
          </p>
        </div>
      </div>

      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-50 p-12 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(500px 400px at 80% 10%, rgba(0,105,92,.14), transparent 70%), radial-gradient(500px 400px at 10% 90%, rgba(124,58,237,.10), transparent 70%)',
          }}
        />

        <figure className="relative">
          <blockquote className="text-2xl leading-[1.35] font-semibold tracking-tight text-brand-800">
            “Forward unified our multi-entity operations and automated $14M in recurring ARR billing across 3 global regions with zero manual overhead.”
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
              ER
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Elena Rostova</span>
              <span className="block text-xs text-ink-muted">VP of Global Operations · Apex Logistics</span>
            </span>
          </figcaption>
        </figure>

        <div className="relative grid grid-cols-3 gap-3">
          {[
            ['$42.8M', 'ARR managed'],
            ['4', 'global hubs'],
            ['99.99%', 'SLA uptime'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-field border border-brand-600/15 bg-surface/70 px-4 py-3.5">
              <p data-numeric className="text-xl font-bold text-brand-700">
                {value}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const LOGIN_VARIANTS = [
  {
    id: 'split',
    name: 'A · Split hero',
    note: 'Marketing panel + form. Most brand presence; needs a wide screen to shine.',
    Component: LoginSplitHero,
  },
  {
    id: 'centered',
    name: 'B · Centered card',
    note: 'Calm and product-like. Fastest to read, works identically on every screen size.',
    Component: LoginCentered,
  },
  {
    id: 'glass',
    name: 'C · Glass on gradient',
    note: 'Most striking. Frosted card over an enterprise gradient; darkest of the four.',
    Component: LoginGlass,
  },
  {
    id: 'editorial',
    name: 'D · Editorial',
    note: 'Form first, social proof second. Warmest and most human of the set.',
    Component: LoginEditorial,
  },
] as const
