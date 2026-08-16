import {
  Card,
  CardBody,
  CardHeader,
  Cell,
  DataTable,
  IdCell,
  StatCard,
  type Column,
} from '@/components/ui'
import { AlertList, PatientLink, StatusBadge } from '@/components/domain'
import { PageLayout } from '@/components/layout'
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
  STATUS,
  loadTone,
} from '@/components/charts'
import { ALERTS } from '@/data/branches'
import {
  ADMISSIONS,
  ADMISSIONS_BY_MONTH,
  ADMISSION_SOURCES,
  BED_COUNTS,
  HEATMAP_DAYS,
  HEATMAP_SLOTS,
  OPD_LOAD,
  WARD_OCCUPANCY,
} from '@/data/clinical'
import { OPD_LAST_7_DAYS, PAYER_MIX, REVENUE_BY_MONTH, TOP_DEPARTMENTS } from '@/data/finance'
import { findPatientByName } from '@/data/patients'
import { money, pct } from '@/lib/format'
import { useBranch } from '@/store/useAppStore'

type Admission = (typeof ADMISSIONS)[number]

const columns: Column<Admission>[] = [
  { id: 'id', header: 'Deal / Lead ID', width: '120px', cell: (row) => <IdCell>{row.id}</IdCell> },
  {
    id: 'patient',
    header: 'Account / Client',
    width: 'minmax(180px,1.4fr)',
    cell: (row) => {
      const patient = findPatientByName(row.patient)
      return patient ? (
        <PatientLink id={patient.id} name={row.patient} showAvatar={false} />
      ) : (
        <Cell className="font-medium text-ink">{row.patient}</Cell>
      )
    },
  },
  { id: 'branch', header: 'Business Unit', width: 'minmax(130px,1fr)', cell: (row) => <Cell>{row.branch}</Cell> },
  { id: 'dept', header: 'Product Suite', width: 'minmax(140px,1fr)', cell: (row) => <Cell>{row.department}</Cell> },
  { id: 'doctor', header: 'Account Lead', width: 'minmax(130px,1fr)', cell: (row) => <Cell>{row.doctor}</Cell> },
  { id: 'status', header: 'Stage / Tier', width: '130px', cell: (row) => <StatusBadge status={row.status} /> },
]

/** Executive CRM + ERP Command Center */
export function DashboardPage() {
  const branch = useBranch()
  const factor = branch.factor
  const scale = (value: number) => Math.round(value * factor)
  const occupancy = pct(BED_COUNTS.occupied, BED_COUNTS.total)

  const opdSeries = OPD_LAST_7_DAYS.map((point) => ({ ...point, value: scale(point.value) }))
  const revenue = REVENUE_BY_MONTH.map((month) => ({
    ...month,
    value: Math.round(month.value * factor * 10) / 10,
  }))
  const opdTarget = Math.round(opdSeries.reduce((sum, p) => sum + p.value, 0) / opdSeries.length)

  return (
    <PageLayout
      id="dashboard"
      variant="split"
      primary={
        <div className="flex flex-col gap-3">
          {/* Executive StatCards */}
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              label="Qualified Leads & Deals"
              value={scale(412)}
              icon="deal"
              tone="brand"
              trend={{ value: '+14%', direction: 'up', caption: 'vs last week' }}
              visual={<Sparkbars values={opdSeries.map((point) => point.value)} className="w-full" />}
              to="/opd"
            />
            <StatCard
              label="Operations Capacity"
              value={`${occupancy}%`}
              icon="layers"
              tone="info"
              trend={{
                value: `${scale(BED_COUNTS.occupied)}/${scale(BED_COUNTS.total)}`,
                direction: 'flat',
                caption: 'bays active',
              }}
              visual={
                <span className="block h-1.5 overflow-hidden rounded-full bg-canvas">
                  <span
                    style={{ width: `${occupancy}%`, background: STATUS[loadTone(occupancy)] }}
                    className="block h-full rounded-full"
                  />
                </span>
              }
              to="/ipd"
            />
            <StatCard
              label="Invoiced Revenue"
              value={`$${((Math.round(684000 * factor) / 1000)).toFixed(0)}k`}
              icon="receipt"
              tone="success"
              trend={{ value: '+18.4%', direction: 'up', caption: 'vs target' }}
              visual={
                <Sparkbars values={revenue.slice(-7).map((point) => point.value)} className="w-full" />
              }
              to="/billing"
            />
            <StatCard
              label="QA Work Orders"
              value={scale(23)}
              icon="activity"
              tone="critical"
              trend={{ value: '4 Critical', direction: 'down', caption: 'in dispatch queue' }}
              to="/lab"
            />
          </div>

          {/* Revenue Trend Line */}
          <ChartCard
            title="Consolidated ARR Run-rate — Last 12 Months"
            description={`$k USD · ${branch.name} · August is current period`}
          >
            <TrendLine
              points={revenue}
              highlight="Aug"
              format={(point) => `$${point.value.toFixed(0)}k`}
            />
          </ChartCard>

          <div className="grid gap-3 xl:grid-cols-2">
            <ChartCard title="Daily Opportunity & Lead Intake" description="Last 7 days vs weekly target">
              <BarChart
                data={opdSeries}
                format={(value) => `${value} leads`}
                reference={{ value: opdTarget, label: `target ${opdTarget}` }}
              />
            </ChartCard>

            <ChartCard
              title="Revenue by Acquisition Channel"
              description="Six months · Consolidated global units"
              legend={
                <Legend
                  entries={ADMISSION_SOURCES.map((series, index) => ({
                    label: series.label,
                    color: CATEGORICAL[index % CATEGORICAL.length]!,
                  }))}
                />
              }
            >
              <StackedBarChart
                series={ADMISSION_SOURCES}
                data={ADMISSIONS_BY_MONTH.map((month) => ({
                  label: month.label,
                  values: month.values.map(scale),
                }))}
                format={(value) => `$${value}k`}
              />
            </ChartCard>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            <ChartCard title="Capacity Utilization by Facility" description="Real-time operations load">
              <div className="flex flex-wrap items-center gap-4">
                <Gauge percent={occupancy} />
                <ul className="flex min-w-40 flex-1 flex-col gap-1.5">
                  {WARD_OCCUPANCY.map((ward) => (
                    <li key={ward.name} className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ background: STATUS[loadTone(ward.occupancy)] }}
                      />
                      <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">
                        {ward.name}
                      </span>
                      <span data-numeric className="text-xs font-semibold text-ink">
                        {ward.occupancy}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ChartCard>

            <ChartCard title="Revenue & Client Segment Mix" description="Share of billed ARR by customer tier">
              <DonutChart
                segments={PAYER_MIX}
                size={104}
                thickness={13}
                centerValue={`${PAYER_MIX[0]!.value}%`}
                centerLabel="enterprise"
              />
            </ChartCard>
          </div>

          <ChartCard title="Sales Pipeline & Lead Velocity by Hour" description="Inbound touches per hour slot">
            <Heatmap
              rows={[...HEATMAP_DAYS]}
              columns={[...HEATMAP_SLOTS]}
              values={OPD_LOAD.map((row) => row.map(scale))}
              format={(value) => `${value} interactions`}
            />
          </ChartCard>

          <Card>
            <CardHeader title="Recent Key Opportunities & Onboarding" description="High-priority accounts across business units" />
            <DataTable columns={columns} rows={ADMISSIONS} getRowId={(row) => row.id} minWidth={820} />
          </Card>
        </div>
      }
      secondary={
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader title="Business Alerts" description="Requires executive action today" />
            <CardBody>
              <AlertList alerts={ALERTS} />
            </CardBody>
          </Card>

          <ChartCard title="Lead Velocity — 7 Days" description="Consolidated network total">
            <Sparkline points={opdSeries} format={(point) => `${point.value} leads`} />
          </ChartCard>

          <ChartCard title="Top Revenue Business Units" description="Year-to-date revenue contribution">
            <HorizontalBarChart
              data={TOP_DEPARTMENTS.map((department) => ({
                label: department.name,
                value: Math.round(department.revenue * factor),
              }))}
              format={money}
            />
          </ChartCard>

          <Card>
            <CardHeader title="Today's Performance KPIs" description={branch.name} />
            <CardBody className="flex flex-col gap-2.5">
              {[
                { label: 'New Deals Created', value: scale(38) },
                { label: 'Contracts Finalized', value: scale(14) },
                { label: 'Work Orders Dispatched', value: scale(47) },
                { label: 'Invoices Cleared', value: scale(82) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 border-b border-hairline-teal pb-2.5 last:border-b-0 last:pb-0"
                >
                  <span className="truncate text-sm text-ink-body">{row.label}</span>
                  <span data-numeric className="shrink-0 text-sm font-bold text-ink">
                    {row.value}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      }
    />
  )
}
