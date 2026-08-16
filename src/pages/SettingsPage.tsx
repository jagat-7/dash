import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Icon,
  Input,
  SearchSelect,
  Switch,
  Textarea,
  ThemeSelect,
  type IconName,
} from '@/components/ui'
import { AccentPicker } from '@/components/domain'
import { PageHeader } from '@/components/layout'
import { cn } from '@/lib/cn'
import { DEFAULT_ACCENT } from '@/data/accents'
import { BRANCHES } from '@/data/branches'
import { BRAND } from '@/data/brand'
import { useAppStore } from '@/store/useAppStore'
import { useThemeStore } from '@/store/useTheme'

const SETTINGS_TABS: { label: string; path: string; icon: IconName }[] = [
  { label: 'Company Settings', path: '/settings/company', icon: 'companySettings' },
  { label: 'Theme Setting', path: '/settings/theme', icon: 'palette' },
  { label: 'Buttons and actions', path: '/settings/buttons-and-actions', icon: 'zap' },
]

export function SettingsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const validTab = SETTINGS_TABS.some((tab) => tab.path === location.pathname)
  const currentPath = validTab ? location.pathname : '/settings/theme'

  // Theme Store
  const accent = useThemeStore((state) => state.accent)
  const mode = useThemeStore((state) => state.mode)
  const resetAppearance = useThemeStore((state) => state.resetAppearance)

  // App Store
  const branchId = useAppStore((state) => state.branchId)
  const setBranch = useAppStore((state) => state.setBranch)
  const sidebarPinned = useAppStore((state) => state.sidebarPinned)
  const toggleSidebarPin = useAppStore((state) => state.toggleSidebarPin)
  const dock = useAppStore((state) => state.dock)
  const resetDock = useAppStore((state) => state.resetDock)

  const isDefaultTheme = accent === DEFAULT_ACCENT && mode === 'system'
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-4xl pb-12">
      {/* Settings Sub-Navigation Bar */}
      <div className="mb-5 flex items-center gap-1.5 overflow-x-auto rounded-xl border border-hairline-teal bg-surface p-1.5 shadow-2xs">
        {SETTINGS_TABS.map((tab) => {
          const active = currentPath === tab.path
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-all duration-150',
                active
                  ? 'bg-brand-50 text-brand-700 shadow-2xs'
                  : 'text-ink-muted hover:bg-subtle hover:text-ink',
              )}
            >
              <Icon
                name={tab.icon}
                size={14}
                strokeWidth={active ? 2.3 : 2}
                className={cn('shrink-0', active ? 'text-brand-600' : 'text-ink-subtle')}
              />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 1. Theme Setting Page (Linked Theme Panel) */}
      {(currentPath === '/settings/theme' || currentPath === '/settings') && (
        <div className="animate-fade-up">
          <PageHeader
            title="Theme Setting"
            description="Customize theme appearance, light and dark mode, and corporate brand accent color palette."
            actions={
              <Button variant="secondary" icon="refresh" onClick={resetAppearance} disabled={isDefaultTheme}>
                Reset appearance
              </Button>
            }
          />

          <div className="flex flex-col gap-4">
            {/* Theme & Palette Panel */}
            <Card>
              <CardHeader
                title="Theme & Appearance"
                description="Select theme surface mode and the primary accent colour that themes the whole application."
              />
              <CardBody className="flex flex-col gap-6 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">Theme Mode</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      Choose between light, dark, or system preference matching your OS.
                    </p>
                  </div>
                  <ThemeSelect className="sm:ml-auto" />
                </div>

                <div className="border-t border-hairline-teal pt-5">
                  <p className="text-sm font-medium text-ink">Accent Colour</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Repaints buttons, badges, navigation highlights, active states and brand surfaces.
                  </p>
                  <AccentPicker className="mt-3.5" />
                </div>

              </CardBody>
            </Card>

            {/* Workspace Defaults */}
            <Card>
              <CardHeader
                title="Workspace & Navigation"
                description="Default branch scope and interface behavior for this terminal."
              />
              <CardBody className="flex flex-col gap-5 p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Default Branch" hint="Branch context applied on startup.">
                    <SearchSelect
                      clearable={false}
                      options={BRANCHES.map((branch) => ({ value: branch.id, label: branch.name }))}
                      value={branchId}
                      onChange={setBranch}
                      searchPlaceholder="Find a branch…"
                    />
                  </Field>
                </div>

                <Switch
                  checked={sidebarPinned}
                  onChange={toggleSidebarPin}
                  label="Keep navigation sidebar expanded"
                  description="When unchecked, the rail stays compact and expands smoothly on hover."
                />

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline-teal pt-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">Shortcut dock position</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {dock ? 'Custom docked position on screen.' : 'Standard right-corner dock position.'}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="refresh"
                    className="sm:ml-auto"
                    onClick={resetDock}
                    disabled={!dock}
                  >
                    Reset position
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* 2. Company Settings Page */}
      {currentPath === '/settings/company' && (
        <div className="animate-fade-up">
          <PageHeader
            title="Company Settings"
            description="Enterprise identity, legal registration, corporate headquarters, and billing parameters."
            actions={
              <Button variant="primary" icon="check" onClick={handleSave}>
                {savedSuccess ? 'Saved!' : 'Save changes'}
              </Button>
            }
          />

          <Card>
            <CardHeader
              title="Corporate Profile"
              description="Official company registration details displayed on customer invoices and vouchers."
            />
            <CardBody className="flex flex-col gap-5 p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company Legal Name" required>
                  <Input defaultValue={BRAND.owner} />
                </Field>

                <Field label="Trade / Brand Name" required>
                  <Input defaultValue={BRAND.fullName} />
                </Field>

                <Field label="PAN / VAT Number" required>
                  <Input defaultValue="601234567" />
                </Field>

                <Field label="Company Registration No">
                  <Input defaultValue="REG-2080-9941" />
                </Field>

                <Field label="Support Extension / Hotline">
                  <Input defaultValue={BRAND.supportExtension} />
                </Field>

                <Field label="Default Billing Currency">
                  <Input defaultValue="NPR (Rs.)" />
                </Field>
              </div>

              <Field label="Head Office Address" full>
                <Textarea defaultValue="Main Road, Ward No. 04, Biratnagar, Koshi Province, Nepal" rows={2} />
              </Field>
            </CardBody>
          </Card>
        </div>
      )}

      {/* 3. Buttons and Actions Showcase Page */}
      {currentPath === '/settings/buttons-and-actions' && (
        <div className="animate-fade-up flex flex-col gap-5">
          <PageHeader
            title="Buttons and Actions"
            description="System workflow action buttons (Delete, Decline, Verify, Hold, Approve) across multiple sizes, interaction states, and variants."
            actions={
              lastAction ? (
                <div className="flex items-center gap-2 rounded-lg border border-hairline-teal bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800 animate-fade-in">
                  <Icon name="check" size={14} className="text-brand-600" />
                  <span>Triggered Action: <strong>{lastAction}</strong></span>
                  <button
                    type="button"
                    onClick={() => setLastAction(null)}
                    className="ml-1 cursor-pointer text-brand-600 hover:text-brand-900"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <Button variant="secondary" size="sm" icon="refresh" onClick={() => setLastAction(null)}>
                  Reset action demo
                </Button>
              )
            }
          />

          {/* 1. Master Action Bar (Matching User Image) */}
          <Card className="border border-hairline-teal shadow-xs">
            <CardHeader
              title="Primary Action Bar"
              description="Standardized color-coded action buttons with solid high-contrast backgrounds for critical ERP workflows."
            />
            <CardBody className="flex flex-col gap-4 p-5">
              <p className="text-xs font-medium text-ink-subtle">
                Click any action to simulate interactive execution:
              </p>

              {/* Exact user layout container */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-hairline-teal bg-canvas/70 p-3.5 shadow-2xs">
                <Button
                  variant="delete"
                  size="md"
                  onClick={() => setLastAction('DELETE')}
                  className="w-[108px] justify-center"
                >
                  DELETE
                </Button>
                <Button
                  variant="decline"
                  size="md"
                  onClick={() => setLastAction('DECLINE')}
                  className="w-[108px] justify-center"
                >
                  DECLINE
                </Button>
                <Button
                  variant="verify"
                  size="md"
                  onClick={() => setLastAction('VERIFY')}
                  className="w-[108px] justify-center"
                >
                  VERIFY
                </Button>
                <Button
                  variant="hold"
                  size="md"
                  onClick={() => setLastAction('HOLD')}
                  className="w-[108px] justify-center"
                >
                  HOLD
                </Button>
                <Button
                  variant="approve"
                  size="md"
                  onClick={() => setLastAction('APPROVE')}
                  className="w-[108px] justify-center"
                >
                  APPROVE
                </Button>
              </div>

              {lastAction && (
                <div className="flex items-center gap-2 rounded-md bg-subtle p-2.5 text-xs text-ink">
                  <span className="font-semibold text-brand-700">Live Feedback:</span>
                  <span>Action <code className="font-mono font-bold text-ink">"{lastAction}"</code> dispatched successfully.</span>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 2. All Available Sizes Matrix */}
          <Card className="border border-hairline-teal shadow-xs">
            <CardHeader
              title="Button Sizes Scale"
              description="5 standard responsive size scales available across all button variants."
            />
            <CardBody className="flex flex-col gap-6 p-5">
              {/* Extra Small (xs) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    1. Extra Small (<code className="font-mono text-brand-700">size="xs"</code> — Height: 28px)
                  </span>
                  <span className="text-2xs text-ink-subtle">Dense data tables & inline row actions</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-hairline-teal bg-subtle/50 p-2.5">
                  <Button variant="delete" size="xs" className="w-[84px] justify-center" onClick={() => setLastAction('DELETE (xs)')}>DELETE</Button>
                  <Button variant="decline" size="xs" className="w-[84px] justify-center" onClick={() => setLastAction('DECLINE (xs)')}>DECLINE</Button>
                  <Button variant="verify" size="xs" className="w-[84px] justify-center" onClick={() => setLastAction('VERIFY (xs)')}>VERIFY</Button>
                  <Button variant="hold" size="xs" className="w-[84px] justify-center" onClick={() => setLastAction('HOLD (xs)')}>HOLD</Button>
                  <Button variant="approve" size="xs" className="w-[84px] justify-center" onClick={() => setLastAction('APPROVE (xs)')}>APPROVE</Button>
                </div>
              </div>

              {/* Small (sm) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    2. Small (<code className="font-mono text-brand-700">size="sm"</code> — Height: 32px)
                  </span>
                  <span className="text-2xs text-ink-subtle">Table footer actions & standard compact toolbars</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-hairline-teal bg-subtle/50 p-2.5">
                  <Button variant="delete" size="sm" className="w-[96px] justify-center" onClick={() => setLastAction('DELETE (sm)')}>DELETE</Button>
                  <Button variant="decline" size="sm" className="w-[96px] justify-center" onClick={() => setLastAction('DECLINE (sm)')}>DECLINE</Button>
                  <Button variant="verify" size="sm" className="w-[96px] justify-center" onClick={() => setLastAction('VERIFY (sm)')}>VERIFY</Button>
                  <Button variant="hold" size="sm" className="w-[96px] justify-center" onClick={() => setLastAction('HOLD (sm)')}>HOLD</Button>
                  <Button variant="approve" size="sm" className="w-[96px] justify-center" onClick={() => setLastAction('APPROVE (sm)')}>APPROVE</Button>
                </div>
              </div>

              {/* Medium (md - Default) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    3. Medium (<code className="font-mono text-brand-700">size="md"</code> — Height: 34px)
                  </span>
                  <span className="text-2xs text-ink-subtle">Standard dialogs, forms, filter panels & master bars</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-hairline-teal bg-subtle/50 p-2.5">
                  <Button variant="delete" size="md" className="w-[108px] justify-center" onClick={() => setLastAction('DELETE (md)')}>DELETE</Button>
                  <Button variant="decline" size="md" className="w-[108px] justify-center" onClick={() => setLastAction('DECLINE (md)')}>DECLINE</Button>
                  <Button variant="verify" size="md" className="w-[108px] justify-center" onClick={() => setLastAction('VERIFY (md)')}>VERIFY</Button>
                  <Button variant="hold" size="md" className="w-[108px] justify-center" onClick={() => setLastAction('HOLD (md)')}>HOLD</Button>
                  <Button variant="approve" size="md" className="w-[108px] justify-center" onClick={() => setLastAction('APPROVE (md)')}>APPROVE</Button>
                </div>
              </div>

              {/* Large (lg) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    4. Large (<code className="font-mono text-brand-700">size="lg"</code> — Height: 38px)
                  </span>
                  <span className="text-2xs text-ink-subtle">Modal primary CTAs & prominent page headers</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-hairline-teal bg-subtle/50 p-3">
                  <Button variant="delete" size="lg" className="w-[120px] justify-center" onClick={() => setLastAction('DELETE (lg)')}>DELETE</Button>
                  <Button variant="decline" size="lg" className="w-[120px] justify-center" onClick={() => setLastAction('DECLINE (lg)')}>DECLINE</Button>
                  <Button variant="verify" size="lg" className="w-[120px] justify-center" onClick={() => setLastAction('VERIFY (lg)')}>VERIFY</Button>
                  <Button variant="hold" size="lg" className="w-[120px] justify-center" onClick={() => setLastAction('HOLD (lg)')}>HOLD</Button>
                  <Button variant="approve" size="lg" className="w-[120px] justify-center" onClick={() => setLastAction('APPROVE (lg)')}>APPROVE</Button>
                </div>
              </div>

              {/* Extra Large (xl) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    5. Extra Large (<code className="font-mono text-brand-700">size="xl"</code> — Height: 44px)
                  </span>
                  <span className="text-2xs text-ink-subtle">Hero landing actions & touch-friendly POS checkpoints</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 rounded-lg border border-hairline-teal bg-subtle/50 p-3.5">
                  <Button variant="delete" size="xl" className="w-[136px] justify-center" onClick={() => setLastAction('DELETE (xl)')}>DELETE</Button>
                  <Button variant="decline" size="xl" className="w-[136px] justify-center" onClick={() => setLastAction('DECLINE (xl)')}>DECLINE</Button>
                  <Button variant="verify" size="xl" className="w-[136px] justify-center" onClick={() => setLastAction('VERIFY (xl)')}>VERIFY</Button>
                  <Button variant="hold" size="xl" className="w-[136px] justify-center" onClick={() => setLastAction('HOLD (xl)')}>HOLD</Button>
                  <Button variant="approve" size="xl" className="w-[136px] justify-center" onClick={() => setLastAction('APPROVE (xl)')}>APPROVE</Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 3. Action Buttons with Icons */}
          <Card className="border border-hairline-teal shadow-xs">
            <CardHeader
              title="Action Buttons with Glyph Icons"
              description="Visual icons enhance action recognizability during high-volume operations."
            />
            <CardBody className="flex flex-col gap-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="delete" size="md" icon="trash" onClick={() => setLastAction('DELETE (icon)')}>
                  Delete Order
                </Button>
                <Button variant="decline" size="md" icon="x" onClick={() => setLastAction('DECLINE (icon)')}>
                  Decline Order
                </Button>
                <Button variant="verify" size="md" icon="check" onClick={() => setLastAction('VERIFY (icon)')}>
                  Verify Order
                </Button>
                <Button variant="hold" size="md" icon="clock" onClick={() => setLastAction('HOLD (icon)')}>
                  Hold Order
                </Button>
                <Button variant="approve" size="md" icon="check" onClick={() => setLastAction('APPROVE (icon)')}>
                  Approve Order
                </Button>
              </div>

              <div className="border-t border-hairline-teal pt-4">
                <p className="mb-2.5 text-2xs font-bold tracking-wider text-ink-subtle uppercase">
                  Pill Rounded Shape (<code className="font-mono text-brand-700">pill=&#123;true&#125;</code>)
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="delete" size="sm" pill icon="trash">DELETE</Button>
                  <Button variant="decline" size="sm" pill icon="x">DECLINE</Button>
                  <Button variant="verify" size="sm" pill icon="check">VERIFY</Button>
                  <Button variant="hold" size="sm" pill icon="clock">HOLD</Button>
                  <Button variant="approve" size="sm" pill icon="check">APPROVE</Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 4. States & Processing Showcase */}
          <Card className="border border-hairline-teal shadow-xs">
            <CardHeader
              title="Interactive States & Processing"
              description="Disabled, loading, and busy states for asynchronous ERP transactions."
            />
            <CardBody className="flex flex-col gap-4 p-5">
              <div>
                <p className="mb-2 text-2xs font-bold tracking-wider text-ink-subtle uppercase">
                  Disabled States (<code className="font-mono text-brand-700">disabled=&#123;true&#125;</code>)
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button variant="delete" size="sm" disabled>DELETE</Button>
                  <Button variant="decline" size="sm" disabled>DECLINE</Button>
                  <Button variant="verify" size="sm" disabled>VERIFY</Button>
                  <Button variant="hold" size="sm" disabled>HOLD</Button>
                  <Button variant="approve" size="sm" disabled>APPROVE</Button>
                </div>
              </div>

              <div className="border-t border-hairline-teal pt-4">
                <p className="mb-2 text-2xs font-bold tracking-wider text-ink-subtle uppercase">
                  Loading / Busy States (<code className="font-mono text-brand-700">loading=&#123;true&#125;</code>)
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button variant="delete" size="sm" loading>Deleting...</Button>
                  <Button variant="decline" size="sm" loading>Declining...</Button>
                  <Button variant="verify" size="sm" loading>Verifying...</Button>
                  <Button variant="hold" size="sm" loading>Holding...</Button>
                  <Button variant="approve" size="sm" loading>Approving...</Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 5. Core System Variants Reference */}
          <Card className="border border-hairline-teal shadow-xs">
            <CardHeader
              title="All Core System Button Variants"
              description="Complete button design system taxonomy available across all application modules."
            />
            <CardBody className="flex flex-col gap-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" size="md">Primary</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="quiet" size="md">Quiet</Button>
                <Button variant="ghost" size="md">Ghost</Button>
                <Button variant="danger" size="md">Danger</Button>
                <Button variant="success" size="md">Success</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
