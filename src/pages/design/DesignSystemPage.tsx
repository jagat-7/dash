import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Accordion,
  ActionCard,
  AmountCell,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardGrid,
  CardHeader,
  Cell,
  Checkbox,
  Collapsible,
  Combobox,
  CopyButton,
  CountBadge,
  DataTable,
  DescriptionList,
  DetailPanel,
  DetailRow,
  Divider,
  Drawer,
  EmptyState,
  Field,
  FileDrop,
  FilterChips,
  FilterPanel,
  ColumnVisibility,
  Icon,
  IconButton,
  iconNames,
  IdCell,
  InfoCard,
  Input,
  Kbd,
  LoadingState,
  Menu,
  Modal,
  LoadMore,
  Logo,
  LogoMark,
  MultiSelect,
  Pagination,
  Popover,
  ProgressBar,
  ProgressCard,
  RadioGroup,
  SearchInput,
  SearchSelect,
  SectionLabel,
  SegmentedControl,
  Select,
  Skeleton,
  Slider,
  Spinner,
  StatCard,
  StatTile,
  StatusDot,
  StepTrail,
  Stepper,
  Switch,
  Tabs,
  Textarea,
  ThemeSelect,
  ThemeToggle,
  Toolbar,
  Tooltip,
  useToast,
  type Column,
} from '@/components/ui'
import {
  BarChart,
  ChartCard,
  DonutChart,
  Gauge,
  Heatmap,
  HorizontalBarChart,
  Legend,
  Sparkbars,
  Sparkline,
  StackedBarChart,
  TrendLine,
  CATEGORICAL,
} from '@/components/charts'
import {
  AccentPicker,
  AccentPreview,
  AlertList,
  BedLegend,
  BedTile,
  BranchSwitcher,
  CareTeam,
  EwsCard,
  FluidBalanceCard,
  KpiCard,
  MedicationSchedule,
  NoteCard,
  PatientBanner,
  PatientLink,
  PriorityLabel,
  ReferenceRange,
  StatusBadge,
  Timeline,
  VitalCard,
  VitalsMonitor,
  VitalTrend,
} from '@/components/domain'
import {
  CommandPalette,
  CommandTrigger,
  PageHeader,
  PageLayout,
  Resizable,
} from '@/components/layout'
import { LOGIN_VARIANTS } from './LoginVariants'
import { ALERTS } from '@/data/branches'
import { BEDS } from '@/data/clinical'
import { OPD_LAST_7_DAYS, PAYER_MIX, REVENUE_BY_MONTH, TOP_DEPARTMENTS } from '@/data/finance'
import { getPatientRecord } from '@/data/patients'
import { money } from '@/lib/format'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------- scaffolding */

const SECTIONS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'theming', label: 'Theming' },
  { id: 'buttons', label: 'Buttons & actions' },
  { id: 'forms', label: 'Forms & inputs' },
  { id: 'data', label: 'Data display' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'cards', label: 'Cards' },
  { id: 'charts', label: 'Charts' },
  { id: 'clinical', label: 'Clinical' },
  { id: 'layouts', label: 'Layouts' },
  { id: 'login', label: 'Login options' },
]

function Section({ id, title, count, children }: { id: string; title: string; count: string; children: ReactNode }) {
  return (
    /* Clears the sticky header + its section nav when an anchor is followed. */
    <section id={id} className="scroll-mt-32">
      <div className="mb-3 flex flex-wrap items-baseline gap-3 border-b border-hairline pb-2">
        <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
        <span className="text-xs text-ink-subtle">{count}</span>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Demo({ name, hint, children }: { name: string; hint?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-card border border-hairline bg-surface">
      <div className="flex flex-wrap items-baseline gap-2 border-b border-hairline-teal bg-subtle px-4 py-2">
        <code className="font-mono text-xs font-semibold text-brand-700">{name}</code>
        {hint ? <span className="text-xs text-ink-muted">{hint}</span> : null}
      </div>
      {/* The gallery shows components at natural size; anything wider than a
          phone scrolls here rather than stretching the page. */}
      <div className="scrollbar-slim overflow-x-auto p-4">{children}</div>
    </div>
  )
}

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center gap-2.5', className)}>{children}</div>
}

/* ------------------------------------------------------------------ page */

export function DesignSystemPage() {
  // ToastProvider is mounted at the app root; this page just consumes it.
  return <DesignSystemInner />
}

function DesignSystemInner() {
  const toast = useToast()
  const record = getPatientRecord('ACC-2026-04417')!

  const [chip, setChip] = useState('All')
  const [tab, setTab] = useState('overview')
  const [segment, setSegment] = useState('week')
  const [switchOn, setSwitchOn] = useState(true)
  const [radio, setRadio] = useState('self')
  const [slider, setSlider] = useState(40)
  const [combo, setCombo] = useState('')
  const [page, setPage] = useState(2)
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [doctor, setDoctor] = useState('')
  const [departments, setDepartments] = useState<string[]>(['Cardiology'])
  const [hiddenCols, setHiddenCols] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(25)
  const [loaded, setLoaded] = useState(20)
  const [loginVariant, setLoginVariant] = useState<string>(LOGIN_VARIANTS[0].id)
  const [anchoredDoctor, setAnchoredDoctor] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)

  const ActiveLogin = LOGIN_VARIANTS.find((entry) => entry.id === loginVariant)!

  type DemoRow = { id: string; name: string; dept: string; amount: number }
  const demoRows: DemoRow[] = [
    { id: 'INV-2417', name: 'Ramesh Shrestha', dept: 'Cardiology', amount: 48200 },
    { id: 'INV-2416', name: 'Sita Gurung', dept: 'Orthopedics', amount: 112500 },
    { id: 'INV-2415', name: 'Mohan Rai', dept: 'OPD General', amount: 1800 },
  ]
  const demoColumns: Column<DemoRow>[] = [
    // The real cell helpers, so the demo matches what pages actually write.
    { id: 'id', header: 'Invoice', width: '110px', cell: (r) => <IdCell>{r.id}</IdCell> },
    { id: 'name', header: 'Patient', width: 'minmax(140px,1.4fr)', cell: (r) => <Cell className="font-medium text-ink">{r.name}</Cell> },
    { id: 'dept', header: 'Dept', width: 'minmax(110px,1fr)', cell: (r) => <Cell>{r.dept}</Cell> },
    { id: 'amount', header: 'Amount', width: '120px', align: 'right', cell: (r) => <AmountCell>{money(r.amount)}</AmountCell> },
  ]

  return (
    <div className="min-h-dvh bg-canvas">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-hairline-top bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3 px-5 py-3">
          <span className="grid size-7 place-items-center rounded-control bg-brand-600">
            <Icon name="logo" size={13} strokeWidth={3} className="text-white" />
          </span>
          <div>
            <h1 className="text-md font-bold tracking-tight text-ink">Forward design system</h1>
            <p className="text-2xs text-ink-subtle">Every component in the library, live</p>
          </div>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            <Icon name="arrowLeft" size={13} strokeWidth={2.2} />
            Back to app
          </Link>
        </div>
        <nav className="scrollbar-none mx-auto flex max-w-[1180px] gap-1 overflow-x-auto px-5 pb-2">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap text-ink-muted transition-colors hover:bg-subtle hover:text-brand-600"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-[1180px] flex-col gap-10 px-5 py-8">
        {/* ------------------------------------------------------ foundations */}
        <Section id="foundations" title="Foundations" count="colour · type · elevation · icons">
          <Demo name="Logo · ThemeSelect" hint="brand in one config; theme flips every token">
            <Row className="gap-6">
              <Logo full size={32} nameClassName="text-ink text-lg" />
              <Logo variant="bare" size={30} showName={false} className="text-brand-600" />
              <Divider orientation="vertical" />
              <ThemeSelect />
            </Row>
          </Demo>

          <Demo name="Colour tokens" hint="declared once in index.css @theme">
            <div className="flex flex-wrap gap-2">
              {[
                ['brand-600', 'bg-brand-600'],
                ['brand-500', 'bg-brand-500'],
                ['brand-50', 'bg-brand-50'],
                ['canvas', 'bg-canvas'],
                ['success', 'bg-success'],
                ['warning', 'bg-warning'],
                ['critical', 'bg-critical'],
                ['info', 'bg-info'],
                ['violet', 'bg-accent-violet'],
                ['ink', 'bg-ink'],
              ].map(([name, className]) => (
                <div key={name} className="w-24">
                  <div className={cn('h-11 rounded-field border border-hairline', className)} />
                  <p className="mt-1 font-mono text-[10px] text-ink-muted">{name}</p>
                </div>
              ))}
            </div>
          </Demo>

          <Demo name="Type scale" hint="body is 13px, forms are 14px">
            <div className="flex flex-col gap-1.5">
              <p className="text-[28px] font-bold tracking-tight text-ink">28 · KPI value</p>
              <p className="text-[22px] font-bold tracking-tight text-ink">22 · Page title</p>
              <p className="text-lg font-bold text-ink">16 · Section title</p>
              <p className="text-base text-ink-body">14 · Form & base copy</p>
              <p className="text-sm text-ink-body">13 · Body / table cell</p>
              <p className="text-xs text-ink-muted">12 · Caption</p>
              <p className="text-2xs font-bold tracking-[0.06em] text-ink-subtle uppercase">11 · Overline label</p>
              <p className="font-mono text-sm text-ink">DM Mono · PT-2026-04417 · Rs 48,200</p>
            </div>
          </Demo>

          <Demo name="Elevation">
            <Row>
              {['shadow-hairline', 'shadow-card', 'shadow-lift', 'shadow-panel', 'shadow-modal'].map((shadow) => (
                <div key={shadow} className={cn('grid h-16 w-32 place-items-center rounded-card bg-surface', shadow)}>
                  <span className="font-mono text-[10px] text-ink-muted">{shadow.replace('shadow-', '')}</span>
                </div>
              ))}
            </Row>
          </Demo>

          <Demo name="Icon" hint="the whole registry, rendered from `iconNames` so it cannot drift">
            <Row>
              {iconNames.map((name) => (
                <Tooltip key={name} content={name}>
                  <span className="grid size-9 place-items-center rounded-field border border-hairline text-ink-body">
                    <Icon name={name} size={16} />
                  </span>
                </Tooltip>
              ))}
            </Row>
          </Demo>

          <Demo name="Logo · LogoMark · ThemeToggle · CountBadge · SectionLabel">
            <Row className="gap-5">
              <Logo full size={28} nameClassName="text-ink" />
              <LogoMark size={28} className="text-brand-600" />
              <Divider orientation="vertical" />
              <ThemeToggle />
              <CountBadge>12</CountBadge>
              <CountBadge>99+</CountBadge>
              <Divider orientation="vertical" />
              <SectionLabel>Section label</SectionLabel>
            </Row>
          </Demo>
        </Section>

        {/* ---------------------------------------------------------- theming */}
        <Section id="theming" title="Theming" count="AccentPicker · AccentPreview · any colour">
          <Demo
            name="AccentPicker"
            hint="six presets + a free colour well — repaints this page live"
          >
            <AccentPicker className="w-full" />
          </Demo>

          <Demo name="AccentPreview" hint="the same components the console uses">
            <AccentPreview className="w-full" />
          </Demo>

          <Demo name="Derived ramp" hint="hue rotates, the lightness curve never moves">
            <div className="flex w-full flex-wrap gap-2">
              {(
                ['brand-50', 'brand-100', 'brand-200', 'brand-300', 'brand-400', 'brand-500', 'brand-600', 'brand-700', 'brand-800'] as const
              ).map((step) => (
                <div key={step} className="w-20">
                  <div
                    className={cn(
                      'h-11 rounded-field border border-hairline',
                      {
                        'brand-50': 'bg-brand-50',
                        'brand-100': 'bg-brand-100',
                        'brand-200': 'bg-brand-200',
                        'brand-300': 'bg-brand-300',
                        'brand-400': 'bg-brand-400',
                        'brand-500': 'bg-brand-500',
                        'brand-600': 'bg-brand-600',
                        'brand-700': 'bg-brand-700',
                        'brand-800': 'bg-brand-800',
                      }[step],
                    )}
                  />
                  <p className="mt-1 font-mono text-[10px] text-ink-muted">{step.replace('brand-', '')}</p>
                </div>
              ))}
            </div>
          </Demo>
        </Section>

        {/* ---------------------------------------------------------- buttons */}
        <Section id="buttons" title="Buttons & actions" count="Button · IconButton · ButtonGroup · Menu · CopyButton">
          <Demo name="Button" hint="6 variants × 5 sizes">
            <div className="flex flex-col gap-3">
              <Row>
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="quiet">Quiet</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
              </Row>
              <Row>
                <Button size="xs">Extra small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl" pill>Extra large pill</Button>
              </Row>
              <Row>
                <Button icon="plus">With icon</Button>
                <Button iconRight="arrowRight" variant="secondary">Icon right</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </Row>
            </div>
          </Demo>

          <Demo name="IconButton · ButtonGroup · Kbd · CopyButton">
            <Row>
              <IconButton icon="search" label="Search" />
              <IconButton icon="bell" label="Notifications" />
              <IconButton icon="settings" label="Settings" variant="ghost" />
              <ButtonGroup>
                <Button variant="secondary" size="sm">Day</Button>
                <Button variant="secondary" size="sm">Week</Button>
                <Button variant="secondary" size="sm">Month</Button>
              </ButtonGroup>
              <CopyButton value="PT-2026-04417" label="Copy ID" />
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
              </span>
            </Row>
          </Demo>

          <Demo name="Menu" hint="arrow-key navigable">
            <Menu
              trigger={<Button variant="secondary" iconRight="chevronDown">Row actions</Button>}
              items={[
                { id: 'view', label: 'Open record', icon: 'badge' },
                { id: 'print', label: 'Print invoice', icon: 'printer' },
                { id: 'export', label: 'Export CSV', icon: 'download' },
                { id: 'delete', label: 'Delete', icon: 'close', tone: 'danger', separated: true },
              ]}
            />
          </Demo>
        </Section>

        {/* ------------------------------------------------------------ forms */}
        <Section id="forms" title="Forms & inputs" count="Field · Input · Select · Textarea · Checkbox · Switch · Radio · Slider · Combobox · FileDrop · Search">
          <Demo name="Field · Input · Select · Textarea">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Customer / Company name" required>
                <Input placeholder="e.g. Acme Global Technologies" />
              </Field>
              <Field label="Phone" hint="Nepali mobile, 10 digits">
                <Input placeholder="98XXXXXXXX" />
              </Field>
              <Field label="Product Suite">
                <Select options={['Enterprise Cloud ERP', 'Supply Chain Engine', 'Dedicated Cluster']} />
              </Field>
              <Field label="Contract Tier" error="This field is required">
                <Select options={['Tier 1 Global', 'Enterprise Platinum', 'Mid-Market', 'Growth']} />
              </Field>
              <Field label="Order & Account Notes" full>
                <Textarea placeholder="Deployment specifications, custom integrations, and SLA schedule…" />
              </Field>
            </div>
          </Demo>

          <Demo name="Switch · RadioGroup · Slider">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Switch checked={switchOn} onChange={setSwitchOn} label="Order dispatch SMS" description="Send customer instant SMS and WhatsApp order dispatch notification." />
                <Switch checked={!switchOn} onChange={(v) => setSwitchOn(!v)} label="Notify regional sales supervisor" />
                <Slider value={slider} onChange={setSlider} label="Reorder threshold" format={(v) => `${v}%`} />
              </div>
              <RadioGroup
                label="Payment mode"
                value={radio}
                onChange={setRadio}
                options={[
                  { value: 'wire', label: 'Bank Wire / Clearing', description: 'Settled via corporate bank clearance' },
                  { value: 'cash', label: 'Cash Voucher', description: 'Immediate counter voucher' },
                  { value: 'credit', label: 'Corporate Net-30' },
                ]}
              />
            </div>
          </Demo>

          <Demo name="SearchInput · Combobox · Checkbox · FileDrop">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <SearchInput placeholder="Search customers & orders…" aria-label="Search" />
                <Combobox
                  options={['Jagat Chaudhary (CRO)', 'Marcus Bennett (VP)', 'Sanjay Yadav (Sales)', 'Rajesh Karki (Lead)']}
                  value={combo}
                  onChange={setCombo}
                  placeholder="Assign sales rep…"
                />
                <Checkbox label="Customer verified & tax cleared (VAT 13%)" defaultChecked />
              </div>
              <FileDrop />
            </div>
          </Demo>

          <Demo name="SearchSelect · MultiSelect" hint="Select2 pattern — type-ahead, groups, tags">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Sales Representative" hint="Single select with search and grouping">
                <SearchSelect
                  value={doctor}
                  onChange={setDoctor}
                  placeholder="Choose an account executive"
                  options={[
                    { value: 'jagat', label: 'Jagat Chaudhary', group: 'Executive', icon: 'badge' },
                    { value: 'marcus', label: 'Marcus Bennett', group: 'Enterprise', icon: 'userCheck' },
                    { value: 'sanjay', label: 'Sanjay Yadav', group: 'Regional Sales', icon: 'cart' },
                    { value: 'rajesh', label: 'Rajesh Karki', group: 'Regional Sales', icon: 'cart' },
                    { value: 'anita', label: 'Anita Thapa', group: 'Regional Sales', disabled: true, hint: '(on leave)' },
                  ]}
                />
              </Field>
              <Field label="Product Lines" hint="Multi select with removable tags">
                <MultiSelect
                  value={departments}
                  onChange={setDepartments}
                  placeholder="Any product suite"
                  options={['ERP Core', 'Cloud Infrastructure', 'Edge IoT Hardware', 'Supply Chain', 'Analytics Suite']}
                />
              </Field>
            </div>
          </Demo>

          <Demo name="FilterPanel · ColumnVisibility" hint="show/hide filters with live chips">
            <FilterPanel
              defaultOpen
              columns={3}
              active={
                departments.length
                  ? [
                      {
                        id: 'dept',
                        label: 'Department',
                        value: departments.join(', '),
                        onClear: () => setDepartments([]),
                      },
                    ]
                  : []
              }
              onClearAll={() => setDepartments([])}
              toolbar={<SearchInput placeholder="Search rows…" width="200px" />}
            >
              <Field label="Department">
                <MultiSelect
                  options={['Cardiology', 'Orthopedics', 'ICU', 'Maternity']}
                  value={departments}
                  onChange={setDepartments}
                  placeholder="Any"
                />
              </Field>
              <Field label="Status">
                <SearchSelect options={['Paid', 'Unpaid', 'Partial']} value="" onChange={() => {}} placeholder="Any" />
              </Field>
              <Field label="Branch">
                <SearchSelect options={['Birat Central', 'Birat East', 'City Clinic']} value="" onChange={() => {}} placeholder="All" />
              </Field>
            </FilterPanel>

            <div className="mt-3 max-w-xs rounded-card border border-hairline p-3">
              <p className="mb-2 text-2xs font-bold tracking-[0.06em] text-ink-subtle uppercase">
                Show / hide columns
              </p>
              <ColumnVisibility
                columns={[
                  { id: 'patient', label: 'Customer', visible: true, locked: true },
                  { id: 'branch', label: 'Branch', visible: !hiddenCols.includes('branch') },
                  { id: 'dept', label: 'Product Suite', visible: !hiddenCols.includes('dept') },
                  { id: 'amount', label: 'Amount', visible: !hiddenCols.includes('amount') },
                ]}
                onToggle={(id, visible) =>
                  setHiddenCols((current) =>
                    visible ? current.filter((entry) => entry !== id) : [...current, id],
                  )
                }
              />
            </div>
          </Demo>

          <Demo name="Stepper · SegmentedControl · FilterChips · Tabs">
            <div className="flex flex-col gap-5">
              <Stepper steps={['Customer info', 'Order items', 'Confirm & Authorize']} current={2} />
              <Row>
                <SegmentedControl
                  label="Range"
                  value={segment}
                  onChange={setSegment}
                  options={[
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                  ]}
                />
                <FilterChips
                  label="Status"
                  value={chip}
                  onChange={setChip}
                  options={['All', 'Approved', 'Verified', 'Pending']}
                  counts={{ All: 12, Approved: 5, Verified: 4, Pending: 3 }}
                />
              </Row>
              <Tabs
                label="Demo tabs"
                value={tab}
                onChange={setTab}
                items={[
                  { id: 'overview', label: 'Overview' },
                  { id: 'orders', label: 'Orders', count: 8 },
                  { id: 'notes', label: 'Notes', count: 2 },
                ]}
              />
            </div>
          </Demo>
        </Section>

        {/* ------------------------------------------------------------- data */}
        <Section id="data" title="Data display" count="DataTable · Pagination · Badge · Avatar · Breadcrumbs · DescriptionList · StatTile · StepTrail · Toolbar">
          <Demo name="DataTable · Pagination" hint="page-size chooser, first/last jumps">
            <div className="overflow-hidden rounded-card border border-hairline">
              <DataTable columns={demoColumns} rows={demoRows} getRowId={(r) => r.id} minWidth={560} onRowClick={() => {}} />
              <Pagination
                page={page}
                totalPages={8}
                onChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                summary="Showing 6–10 of 42 invoices"
              />
            </div>
          </Demo>

          <Demo name="Pagination variant='compact' · LoadMore">
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="overflow-hidden rounded-card border border-hairline">
                <p className="px-4 py-6 text-center text-sm text-ink-muted">Narrow panel content</p>
                <Pagination page={page} totalPages={8} onChange={setPage} variant="compact" />
              </div>
              <div className="overflow-hidden rounded-card border border-hairline">
                <p className="px-4 py-6 text-center text-sm text-ink-muted">Feed-style list</p>
                <LoadMore loaded={loaded} total={120} onLoadMore={() => setLoaded((n) => Math.min(120, n + 20))} />
              </div>
            </div>
          </Demo>

          <Demo name="Badge · StatusBadge · PriorityLabel · StatusDot">
            <div className="flex flex-col gap-3">
              <Row>
                <Badge tone="brand">Brand</Badge>
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="critical">Critical</Badge>
                <Badge tone="info">Info</Badge>
                <Badge tone="neutral">Neutral</Badge>
                <Badge tone="violet">Violet</Badge>
                <Badge tone="critical" solid icon="alert" size="md">ALLERGY: Penicillin</Badge>
                <Badge tone="brand" shape="square" size="md">Problem chip</Badge>
              </Row>
              <Row>
                <StatusBadge status="Admitted" />
                <StatusBadge status="Paid" />
                <StatusBadge status="Unpaid" />
                <StatusBadge status="Processing" />
                <PriorityLabel priority="STAT" />
                <PriorityLabel priority="Urgent" />
                <PriorityLabel priority="Routine" />
                <StatusDot tone="success" label="All systems live" pulse />
                <StatusDot tone="warning" label="Sync delayed" />
              </Row>
            </div>
          </Demo>

          <Demo name="Avatar · AvatarGroup · Breadcrumbs · Toolbar">
            <div className="flex flex-col gap-3">
              <Row>
                <Avatar name="Kamala Tamang" size={26} />
                <Avatar name="Ramesh Shrestha" size={34} tone="blue" />
                <Avatar name="Sita Gurung" size={44} shape="rounded" />
                <AvatarGroup names={['Kamala Tamang', 'Ramesh Shrestha', 'Sita Gurung', 'Mohan Rai', 'Bina Thapa']} />
              </Row>
              <Breadcrumbs items={[{ label: 'Orders', to: '/orders' }, { label: 'Aaryan Stha' }, { label: 'Order #819' }]} />
              <Toolbar>
                <SearchInput placeholder="Filter…" width="180px" />
                <Divider orientation="vertical" />
                <Button size="sm" variant="ghost" icon="filter">Filters</Button>
                <Button size="sm" variant="ghost" icon="download">Export</Button>
                <Button size="sm" className="ml-auto" icon="plus">New</Button>
              </Toolbar>
            </div>
          </Demo>

          <Demo name="DescriptionList · StatTile · StepTrail">
            <div className="grid gap-5 lg:grid-cols-2">
              <DescriptionList
                items={[
                  { label: 'Customer ID', value: 'CUST-2083-04417' },
                  { label: 'Location', value: 'Dharan Central' },
                  { label: 'Salesman', value: 'Jagat Yadav' },
                  { label: 'Dispatch Facility', value: 'Biratnagar Hub · Bay 02' },
                  { label: 'Tax Status', value: 'VAT Registered (13%) · PAN 60124982', full: true },
                ]}
              />
              <StepTrail
                steps={[
                  { title: 'Order Placed', meta: '2083-04-29', state: 'done' },
                  { title: 'Payment Verified', meta: 'Rs 8,000.00', state: 'done' },
                  { title: 'In Verification', detail: 'Supervisor Review · Approved', state: 'current' },
                  { title: 'Warehouse Dispatch', state: 'todo' },
                  { title: 'Delivered', state: 'todo' },
                ]}
              />
            </div>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile label="Orders Approved" value="128" icon="cart" trend={{ value: '12%', direction: 'up' }} />
              <StatTile label="Avg Turnaround" value="3.4h" icon="clock" trend={{ value: '4%', direction: 'down' }} />
              <StatTile label="Hold / Returns" value="6" icon="refresh" trend={{ value: '0%', direction: 'flat' }} hint="Monthly" />
              <StatTile label="Warehouse Capacity" value="64%" icon="truck" />
            </div>
          </Demo>

          <Demo name="Skeleton · EmptyState · LoadingState">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="rounded-card border border-hairline">
                <EmptyState icon="inbox" title="No results" description="Try a different filter." action={{ label: 'Reset', onClick: () => {} }} />
              </div>
              <div className="rounded-card border border-hairline">
                <LoadingState />
              </div>
            </div>
          </Demo>
        </Section>

        {/* --------------------------------------------------------- feedback */}
        <Section id="feedback" title="Feedback" count="Alert · Banner · Toast · Tooltip · ProgressBar · Spinner">
          <Demo name="Alert">
            <div className="flex flex-col gap-2.5">
              <Alert tone="critical" title="ICU at 88% capacity">Birat Central has 1 free ICU bed.</Alert>
              <Alert tone="warning" title="3 drugs below reorder level">Paracetamol, Insulin, Salbutamol.</Alert>
              <Alert tone="success" title="Claim batch submitted">42 NHIS claims sent for review.</Alert>
              <Alert tone="info" title="Scheduled maintenance" onDismiss={() => {}} action={<Button size="xs" variant="secondary">Details</Button>}>
                The lab module will be read-only on Sunday 02:00–04:00.
              </Alert>
            </div>
          </Demo>

          <Demo name="Banner · Toast · ProgressBar · Spinner">
            <div className="flex flex-col gap-3.5">
              <Banner tone="brand" title="New: NHIS batch submission" action={<Button size="xs">Try it</Button>} onDismiss={() => {}}>
                Submit up to 200 claims at once.
              </Banner>
              <Row>
                <Button size="sm" onClick={() => toast.push({ tone: 'success', title: 'Payment recorded', description: 'Receipt PAY-9918 issued.' })}>
                  Success toast
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toast.push({ tone: 'critical', title: 'Could not reach the lab server' })}>
                  Error toast
                </Button>
                <Spinner className="text-brand-600" size={20} />
              </Row>
              <div className="grid gap-2.5 sm:grid-cols-3">
                <ProgressBar value={82} tone="success" label="Stock" />
                <ProgressBar value={38} tone="warning" label="Stock" />
                <ProgressBar value={12} tone="critical" label="Stock" />
              </div>
            </div>
          </Demo>
        </Section>

        {/* --------------------------------------------------------- overlays */}
        <Section
          id="overlays"
          title="Overlays"
          count="AnchoredPanel · CommandPalette · Modal · Drawer · Popover · Menu · Accordion · Collapsible · DetailPanel"
        >
          <Demo
            name="AnchoredPanel"
            hint="every dropdown routes through this — portalled, so `overflow: hidden` cannot clip it"
          >
            {/* This card clips its children on purpose. An absolutely-positioned
                panel would be cut off here; the portalled one is not. */}
            <div className="w-full overflow-hidden rounded-card border border-dashed border-critical/40 bg-critical-soft/40 p-4">
              <p className="mb-3 text-xs text-ink-muted">
                This container sets <code className="font-mono">overflow: hidden</code> — the trap that
                broke the old dropdowns.
              </p>
              <Row>
                <span className="w-52">
                  <SearchSelect
                    options={['Jagat Chaudhary', 'Marcus Bennett', 'Sanjay Yadav', 'Rajesh Karki']}
                    value={anchoredDoctor}
                    onChange={setAnchoredDoctor}
                    placeholder="Select sales rep…"
                  />
                </span>
                <Menu
                  trigger={<Button variant="secondary" icon="menu">Menu</Button>}
                  items={[
                    { id: 'a', label: 'Still reaches outside', icon: 'check' },
                    { id: 'b', label: 'Flips up near the edge', icon: 'arrowUp' },
                  ]}
                />
                <Popover
                  trigger={<Button variant="secondary" icon="help">Popover</Button>}
                  align="start"
                >
                  <p className="text-sm text-ink-body">
                    Measured against the trigger's viewport rect and re-measured on scroll.
                  </p>
                </Popover>
              </Row>
            </div>
          </Demo>

          <Demo name="CommandTrigger · CommandPalette" hint="⌘K anywhere, or the trigger — search as a dialog">
            <Row>
              <CommandTrigger onOpen={() => setPaletteOpen(true)} className="w-56" />
              <span className="text-xs text-ink-muted">
                Indexes modules, sub-menus and accounts. ↑/↓ move, ↵ opens, esc closes.
              </span>
            </Row>
            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
          </Demo>

          <Demo name="Modal · Drawer · Popover">
            <Row>
              <Button onClick={() => setModalOpen(true)}>Open modal</Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
              <Popover trigger={<Button variant="secondary" iconRight="chevronDown">Popover</Button>}>
                <p className="text-sm font-semibold text-ink">Column visibility</p>
                <div className="mt-2.5 flex flex-col gap-2">
                  <Checkbox label="Branch" defaultChecked />
                  <Checkbox label="Product Suite" defaultChecked />
                  <Checkbox label="Sales Representative" />
                </div>
              </Popover>
            </Row>

            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Record payment"
              description="INV-2416 · Sita Gurung"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setModalOpen(false); toast.push({ tone: 'success', title: 'Payment recorded' }) }}>Confirm</Button>
                </>
              }
            >
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Amount" required><Input defaultValue="1,12,500" /></Field>
                <Field label="Mode"><Select options={['Cash', 'Card', 'eSewa', 'Khalti']} /></Field>
              </div>
            </Modal>

            <Drawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Filters"
              description="Narrow the invoice list"
              footer={<><Button variant="secondary" onClick={() => setDrawerOpen(false)}>Reset</Button><Button onClick={() => setDrawerOpen(false)}>Apply</Button></>}
            >
              <div className="flex flex-col gap-4">
                <Field label="Branch"><Select options={['All branches', 'Birat Central', 'Birat East']} /></Field>
                <Field label="Status"><Select options={['Any', 'Paid', 'Unpaid', 'Partial']} /></Field>
                <Slider value={slider} onChange={setSlider} label="Minimum amount" format={(v) => money(v * 1000)} />
              </div>
            </Drawer>
          </Demo>

          <Demo name="Accordion · Collapsible · DetailPanel">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <Accordion
                  defaultOpen={['a']}
                  items={[
                    { id: 'a', title: 'Order specifications', icon: 'cart', content: 'Order #819 received via Mobile CRM. 8 items verified.' },
                    { id: 'b', title: 'Payment clearing', icon: 'shield', content: 'Bank clearing voucher attached. Voucher SI-83/84-4471 under review.' },
                    { id: 'c', title: 'Primary contact', icon: 'userCheck', content: 'Bikash Tamang · Operations Manager · 9841-220145' },
                  ]}
                />
                <Collapsible label="Show advanced options">
                  <p className="text-sm text-ink-body">Rarely used settings live behind this disclosure.</p>
                </Collapsible>
              </div>

              <DetailPanel title="INV-2083-2416" subtitle="Sita Gurung · 2083-04-29" onClose={() => {}} width={9999}>
                <div className="flex flex-col gap-2.5">
                  <DetailRow label="Platform Core" value={money(61875)} />
                  <DetailRow label="Hardware SKUs" value={money(33750)} />
                  <DetailRow label="Installation & SLA" value={money(16875)} />
                </div>
                <Button block className="mt-4">Record payment</Button>
              </DetailPanel>
            </div>
          </Demo>
        </Section>

        {/* ------------------------------------------------------------ cards */}
        <Section
          id="cards"
          title="Cards"
          count="Card · CardHeader · CardBody · CardFooter · StatCard · KpiCard · ProgressCard · ActionCard · InfoCard · CardGrid"
        >
          <Demo name="Card · CardHeader · CardBody · CardFooter" hint="the container the rest are built on">
            <Card className="w-full max-w-md">
              <CardHeader
                title="Invoice INV-2083-9041"
                description="Submitted 2083-04-28"
                actions={<Badge tone="warning">Under review</Badge>}
              />
              <CardBody>
                <p className="text-sm text-ink-body">
                  Body copy sits here. The header and footer carry their own hairlines, so a card
                  never needs one added by hand.
                </p>
              </CardBody>
              <CardFooter>
                <span className="text-xs text-ink-muted">Last updated 2 hours ago</span>
                <Button size="sm" variant="secondary" className="ml-auto">
                  View invoice
                </Button>
              </CardFooter>
            </Card>
          </Demo>

          <Demo name="StatCard" hint="icon chip, trend, optional inline visual">
            <CardGrid min={230}>
              <StatCard label="Orders today" value="412" icon="cart" trend={{ value: '8%', direction: 'up', caption: 'vs last week' }} visual={<Sparkbars values={[312, 298, 341, 376, 355, 388, 412]} />} />
              <StatCard label="Daily Revenue" value={money(684000)} icon="billing" tone="success" trend={{ value: '12%', direction: 'up', caption: 'vs average' }} />
              <StatCard label="QA Work Orders" value="23" icon="activity" tone="critical" trend={{ value: '4 Critical', direction: 'flat' }} to="/lab" />
              <StatCard label="Warehouse Capacity" value="64%" icon="truck" tone="warning" visual={<ProgressBar value={64} tone="warning" label="Capacity" />} />
            </CardGrid>
          </Demo>

          <Demo name="KpiCard · ProgressCard">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard label="Orders Approved" value="128" detail="▲ 8% vs last week" tone="success" accent="linear-gradient(90deg,#00695C,#26A69A)" />
              <KpiCard label="Returns / Hold" value="4" detail="▼ 3% vs last week" tone="critical" accent="linear-gradient(90deg,#DC2626,#F87171)" />
              <ProgressCard label="Storage Bays" value={7} total={8} unit="bays" tone="critical" caption="1 free bay at Birat Central" />
              <ProgressCard label="Invoices Cleared" value={158} total={200} unit="invoices" tone="brand" />
            </div>
          </Demo>

          <Demo name="ActionCard · InfoCard · Card">
            <div className="grid gap-3 lg:grid-cols-3">
              <ActionCard icon="plus" title="Create Order" description="New sales order intake" to="/orders" />
              <ActionCard icon="billing" title="Create invoice" description="Bill verified order" tone="violet" to="/billing" />
              <InfoCard title="Needs attention" icon="alert" footer={<Link to="/dashboard" className="font-medium text-brand-600">View all</Link>}>
                <AlertList alerts={ALERTS.slice(0, 2)} />
              </InfoCard>
            </div>
            <Card className="mt-3">
              <CardHeader title="Card + CardHeader + CardBody" description="The base container every screen uses" actions={<Button size="sm" variant="secondary">Action</Button>} />
              <CardBody><p className="text-sm text-ink-body">Body content sits here.</p></CardBody>
            </Card>
          </Demo>
        </Section>

        {/* ----------------------------------------------------------- charts */}
        <Section id="charts" title="Charts" count="TrendLine · Sparkline · Sparkbars · Donut · Gauge · Bar · StackedBar · HorizontalBar · Heatmap · Legend · ChartCard">
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Revenue — last 12 months" description="Rs lakh · Aug is month-to-date">
              <TrendLine points={REVENUE_BY_MONTH} highlight="Aug" format={(p) => `Rs ${p.value}L`} />
            </ChartCard>

            <ChartCard title="Daily Orders — 7 days" description="All branches">
              <Sparkline points={OPD_LAST_7_DAYS} format={(p) => `${p.value} orders`} />
            </ChartCard>

            <ChartCard title="Revenue Mix" description="Share of billed revenue" legend={<Legend entries={PAYER_MIX.map((p, i) => ({ label: p.label, color: CATEGORICAL[i % 4]!, value: `${p.value}%` }))} />}>
              <DonutChart segments={PAYER_MIX} size={110} thickness={13} legend={false} className="justify-center" />
            </ChartCard>

            <ChartCard title="Orders by Product Line" description="This period">
              <BarChart
                data={[
                  { label: 'ERP Cloud', value: 42 },
                  { label: 'Hardware', value: 36 },
                  { label: 'Edge IoT', value: 28 },
                  { label: 'Supply Chain', value: 24 },
                  { label: 'Analytics', value: 18 },
                  { label: 'Services', value: 11 },
                ]}
                format={(v) => `${v} orders`}
              />
            </ChartCard>

            <ChartCard
              title="Revenue by Settlement Channel"
              description="Quarterly composition"
              legend={<Legend entries={[{ label: 'Wire Transfer', color: CATEGORICAL[0]! }, { label: 'Corporate ACH', color: CATEGORICAL[1]! }, { label: 'Counter Voucher', color: CATEGORICAL[2]! }]} />}
            >
              <StackedBarChart
                series={[{ label: 'Wire Transfer' }, { label: 'Corporate ACH' }, { label: 'Counter Voucher' }]}
                data={[
                  { label: 'Q1', values: [22, 14, 6] },
                  { label: 'Q2', values: [26, 16, 7] },
                  { label: 'Q3', values: [24, 19, 9] },
                  { label: 'Q4', values: [30, 21, 10] },
                ]}
                format={(v) => `Rs ${v}L`}
              />
            </ChartCard>

            <ChartCard title="Top Product Lines" description="Revenue, month to date">
              <HorizontalBarChart data={TOP_DEPARTMENTS.map((d) => ({ label: d.name, value: d.revenue }))} format={money} />
            </ChartCard>

            <ChartCard title="Warehouse Storage Occupancy" description="Network-wide">
              <div className="flex justify-center py-2"><Gauge percent={64} size={120} thickness={14} /></div>
            </ChartCard>

            <ChartCard title="Order throughput by hour" description="Darker = busier">
              <Heatmap
                rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
                columns={['8a', '10a', '12p', '2p', '4p', '6p']}
                values={[
                  [4, 12, 18, 14, 9, 3],
                  [6, 15, 22, 16, 11, 4],
                  [5, 11, 16, 20, 12, 6],
                  [8, 18, 24, 19, 14, 5],
                  [7, 16, 21, 17, 10, 4],
                ]}
                format={(v) => `${v} orders`}
              />
            </ChartCard>
          </div>
        </Section>

        {/* --------------------------------------------------------- enterprise domain */}
        <Section
          id="clinical"
          title="Enterprise Account 360 & Operations"
          count="AccountBanner · HealthScoreCard · TelemetryMonitor · MetricTrend · ServiceSchedule · ComplianceAudit · AccountTeam · RevenueBalanceCard · NoteCard · Timeline · ResourceTile"
        >
          <Demo name="AccountBanner" hint="the customer 360 summary — identity, contract tier, tags, standing facts, latest telemetry">
            <PatientBanner
              record={record}
              actions={
                <>
                  <Button variant="secondary" size="sm" icon="notes">
                    Log touchpoint
                  </Button>
                  <Button size="sm" icon="plus">
                    New Order
                  </Button>
                </>
              }
            />
          </Demo>

          <div className="grid gap-4 lg:grid-cols-2">
            <Demo name="HealthScoreCard" hint="Account health index — adoption, CSAT, telemetry scores">
              <EwsCard ews={record.ews} className="w-full" />
            </Demo>
            <Demo name="TelemetryMonitor" hint="real-time stream telemetry & throughput">
              <VitalsMonitor pulse="96" spo2="94" respiration="22" className="w-full" />
            </Demo>

            <Demo name="MetricTrend" hint="telemetry series with target benchmark band">
              <div className="grid w-full gap-2.5 sm:grid-cols-2">
                {(record.trends || []).slice(0, 2).map((series) => (
                  <VitalTrend key={series.label} series={series} />
                ))}
              </div>
            </Demo>
            <Demo name="MetricCard" hint="key business metrics with status flags">
              <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
                {(record.vitals || []).slice(0, 6).map((vital) => (
                  <VitalCard key={vital.label} vital={vital} />
                ))}
              </div>
            </Demo>
          </div>

          <Demo name="ServiceSchedule" hint="SLA & delivery schedule — execution status per milestone">
            <MedicationSchedule rows={record.mar || []} className="w-full" />
          </Demo>

          <div className="grid gap-4 lg:grid-cols-2">
            <Demo name="ComplianceAudit" hint="security & SLA tolerance benchmarks">
              <ul className="flex w-full flex-col gap-3">
                {[
                  { test: 'SLA Availability', value: 99.99, low: 99.95, high: 100, flag: '' as const },
                  { test: 'API Latency (ms)', value: 38, low: 20, high: 80, flag: '' as const },
                  { test: 'Throughput (k/s)', value: 14.2, low: 10, high: 25, flag: '' as const },
                ].map((row) => (
                  <li key={row.test} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-xs text-ink-soft">{row.test}</span>
                    <ReferenceRange {...row} />
                    <span data-numeric className="w-12 shrink-0 text-right text-xs font-semibold text-ink">
                      {row.value}
                    </span>
                  </li>
                ))}
              </ul>
            </Demo>
            <Demo name="RevenueBalanceCard" hint="contract run-rate vs overage & hourly billing">
              <FluidBalanceCard fluids={record.fluids} className="w-full" />
            </Demo>

            <Demo name="AccountTeam" hint="assigned executive sponsor and account architects">
              <CareTeam members={record.careTeam || []} className="w-full" />
            </Demo>
            <Demo name="CapacityLegend · AlertList">
              <BedLegend className="mb-4" />
              <AlertList alerts={ALERTS} />
            </Demo>

            <Demo name="ResourceTile · AccountLink · BranchSwitcher">
              <div className="flex w-full flex-col gap-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BEDS.slice(0, 3).map((bed) => (
                    <BedTile key={bed.id} bed={bed} selected={false} onSelect={() => {}} />
                  ))}
                </div>
                <Row>
                  <PatientLink id={record.id} name={record.name} />
                  <BranchSwitcher />
                </Row>
              </div>
            </Demo>
            <Demo name="Timeline"><Timeline items={record.encounters || []} /></Demo>
          </div>

          <Demo name="NoteCard" hint="executive briefing & touchpoint summary">
            <NoteCard note={record.notes?.[0] || { title: 'Q3 Account Review', author: 'Jagat Chaudhary', role: 'CRO', date: '2083-04-29', where: 'Executive Briefing', time: '14:00', body: 'Expansion finalized.' }} />
          </Demo>
        </Section>

        {/* ---------------------------------------------------------- layouts */}
        <Section id="layouts" title="Layouts" count="single · two-column · multi-column · all resizable">
          <Demo name="PageHeader" hint="in-content title row — back link, description, actions">
            <PageHeader
              className="w-full"
              backTo={{ to: '/design', label: 'Back to gallery' }}
              title="Invoices"
              description="Every invoice raised across the network this month"
              actions={
                <>
                  <Button variant="secondary" size="sm" icon="download">
                    Export
                  </Button>
                  <Button size="sm" icon="plus">
                    New invoice
                  </Button>
                </>
              }
            />
          </Demo>

          <Demo name="PageLayout variant='single'" hint="one column, optional max width">
            <PageLayout
              variant="single"
              primary={<div className="grid h-24 place-items-center rounded-card border border-dashed border-hairline bg-subtle text-sm text-ink-muted">Primary — full width</div>}
            />
          </Demo>

          <Demo name="PageLayout variant='split'" hint="drag the divider · ←/→ when focused">
            <PageLayout
              id="demo-split"
              variant="split"
              primary={<div className="grid h-32 place-items-center rounded-card border border-dashed border-hairline bg-subtle text-sm text-ink-muted">Content</div>}
              secondary={<div className="grid h-32 place-items-center rounded-card border border-dashed border-brand-600/40 bg-brand-50 text-sm text-brand-700">Detail panel</div>}
            />
          </Demo>

          <Demo name="PageLayout variant='triple'" hint="two draggable dividers">
            <PageLayout
              id="demo-triple"
              variant="triple"
              primary={<div className="grid h-32 place-items-center rounded-card border border-dashed border-hairline bg-subtle text-sm text-ink-muted">List</div>}
              secondary={<div className="grid h-32 place-items-center rounded-card border border-dashed border-hairline bg-subtle text-sm text-ink-muted">Record</div>}
              tertiary={<div className="grid h-32 place-items-center rounded-card border border-dashed border-brand-600/40 bg-brand-50 text-sm text-brand-700">Context</div>}
            />
          </Demo>

          <Demo name="Resizable" hint="the primitive underneath — any number of panes">
            <Resizable
              id="demo-four"
              stackBelow="md"
              panes={[
                { id: 'a', initial: 25, min: 12, content: <div className="grid h-24 place-items-center rounded-card bg-brand-50 text-xs text-brand-700">A</div> },
                { id: 'b', initial: 25, min: 12, content: <div className="grid h-24 place-items-center rounded-card bg-info-soft text-xs text-info">B</div> },
                { id: 'c', initial: 25, min: 12, content: <div className="grid h-24 place-items-center rounded-card bg-warning-soft text-xs text-warning-deep">C</div> },
                { id: 'd', initial: 25, min: 12, content: <div className="grid h-24 place-items-center rounded-card bg-violet-50 text-xs text-accent-violet">D</div> },
              ]}
            />
          </Demo>
        </Section>

        {/* ------------------------------------------------------------ login */}
        <Section id="login" title="Login options" count="pick one — it replaces the current sign-in screen">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              label="Login design"
              value={loginVariant}
              onChange={setLoginVariant}
              options={LOGIN_VARIANTS.map((entry) => ({ value: entry.id, label: entry.name }))}
            />
          </div>
          <p className="text-sm text-ink-muted">{ActiveLogin.note}</p>
          <div className="overflow-hidden rounded-card border border-hairline shadow-card">
            <ActiveLogin.Component />
          </div>
          <p className="text-xs text-ink-subtle">
            Tell me the letter (A/B/C/D) and I'll make it the real <code className="font-mono">/login</code> screen.
          </p>
        </Section>
      </div>
    </div>
  )
}
