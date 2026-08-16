import {
  AmountCell,
  Badge,
  Button,
  Cell,
  DataTable,
  Icon,
  IdCell,
  SectionLabel,
  StatTile,
  type Column,
} from '@/components/ui'
import {
  MedicationSchedule,
  NoteCard,
  StatusBadge,
  Timeline,
  VitalCard,
  VitalTrend,
} from '@/components/domain'
import { INVOICES } from '@/data/finance'
import { money } from '@/lib/format'
import type {
  ClinicalOrder,
  CustomerRecord,
  Invoice,
  LabResult,
  PatientRecord,
} from '@/data/types'

interface TabProps {
  record: CustomerRecord | PatientRecord
}

/* -------------------------------------------------------------- Overview */

export function OverviewTab({ record }: TabProps) {
  const latest = record.notes?.[0]
  const openDeals = record.deals?.filter((d) => d.stage !== 'Closed Won').length || 2
  const activeTickets = record.tickets?.filter((t) => t.status !== 'Resolved').length || 1

  return (
    <>
      <div className="mb-5 grid gap-2.5 sm:grid-cols-3">
        <StatTile
          label="Annual Run Rate (ARR)"
          value={`$${((record.arr || 640000) / 1000).toFixed(0)}k`}
          icon="coins"
          hint="Contracted recurring revenue"
        />
        <StatTile
          label="Open Pipeline Deals"
          value={openDeals}
          icon="deal"
          hint="Expansion opportunities"
        />
        <StatTile
          label="Active Support Tickets"
          value={activeTickets}
          icon="help"
          hint="All within SLA targets"
        />
      </div>

      <SectionLabel>Strategic Account Objectives & Focus</SectionLabel>
      <ul className="mb-5 flex flex-wrap gap-2">
        {(record.keyObjectives || record.problems || []).map((problem, index) => (
          <li key={problem}>
            <Badge tone={index === 0 ? 'brand' : 'neutral'} shape="square" size="md">
              <Icon name="check" size={11} className="text-brand-600" />
              {problem}
            </Badge>
          </li>
        ))}
      </ul>

      {latest ? (
        <div className="mb-5">
          <SectionLabel>Latest Executive Account Note</SectionLabel>
          <NoteCard note={latest} />
        </div>
      ) : null}

      <SectionLabel>Recent Engagement Milestones & QBRs</SectionLabel>
      <Timeline items={record.encounters || []} />
    </>
  )
}

/* -------------------------------------------------------------- Metrics & Telemetry */

export function VitalsTab({ record }: TabProps) {
  return (
    <>
      <SectionLabel>Key Account Telemetry & Health Signals</SectionLabel>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {(record.vitals || []).map((vital) => (
          <VitalCard key={vital.label} vital={vital} size="lg" />
        ))}
      </div>

      <SectionLabel>Platform Telemetry & Engagement Trends</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {(record.trends || []).map((series) => (
          <VitalTrend key={series.label} series={series} />
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------------- Service Schedule & Deliverables */

export function MarTab({ record }: TabProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>Active Subscriptions & SLA Services</SectionLabel>
        <Button size="sm" icon="plus">
          Add Service License
        </Button>
      </div>

      <div className="mb-6 overflow-hidden rounded-tile border border-hairline bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-hairline bg-subtle text-ink-subtle">
            <tr>
              <th className="py-2.5 pl-4 font-semibold">Service / License Component</th>
              <th className="py-2.5 px-3 font-semibold">Cadence</th>
              <th className="py-2.5 px-3 font-semibold">Environment</th>
              <th className="py-2.5 px-3 font-semibold">Contract Lead</th>
              <th className="py-2.5 pr-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {(record.medications || []).map((med) => (
              <tr key={med.name} className="hover:bg-subtle/50">
                <td className="py-2.5 pl-4 font-semibold text-ink">{med.name}</td>
                <td className="py-2.5 px-3 text-ink-muted">{med.frequency}</td>
                <td className="py-2.5 px-3 font-mono text-2xs text-ink-subtle">{med.route}</td>
                <td className="py-2.5 px-3 text-ink-body">{med.prescriber}</td>
                <td className="py-2.5 pr-4 text-right">
                  <Badge tone="success" size="sm">Active</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {record.mar ? <MedicationSchedule rows={record.mar} /> : null}
    </>
  )
}

/* -------------------------------------------------------------- Compliance & Audit Results */

const resultColumns: Column<LabResult>[] = [
  { id: 'test', header: 'Compliance / SLA Benchmark', width: 'minmax(180px,1.5fr)', cell: (row) => <Cell className="font-semibold text-ink">{row.test}</Cell> },
  { id: 'value', header: 'Measured Value', width: '130px', cell: (row) => <Cell className="font-bold text-ink">{row.value}</Cell> },
  { id: 'ref', header: 'Target Threshold', width: '130px', cell: (row) => <Cell className="text-ink-muted">{row.reference}</Cell> },
  { id: 'date', header: 'Audit Date', width: '100px', cell: (row) => <Cell>{row.date}</Cell> },
  {
    id: 'flag',
    header: 'Status',
    width: '90px',
    cell: (row) =>
      row.flag === 'H' || row.flag === 'L' ? (
        <Badge tone="critical" size="sm">Review</Badge>
      ) : (
        <Badge tone="success" size="sm">Passed</Badge>
      ),
  },
]

export function LabResultsTab({ record }: TabProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>SLA Performance & Security Benchmarks</SectionLabel>
        <Button size="sm" variant="secondary" icon="download">
          Export Audit PDF
        </Button>
      </div>

      <DataTable
        columns={resultColumns}
        rows={record.labs || []}
        getRowId={(row) => `${row.test}-${row.date}`}
        minWidth={680}
      />
    </>
  )
}

/* -------------------------------------------------------------- Architecture & Deployments */

export function ImagingTab({ record }: TabProps) {
  const studies = record.imaging || []
  return (
    <>
      <SectionLabel>VPC Deployments & Architecture Topology</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {studies.map((study) => (
          <div key={study.id} className="rounded-card border border-hairline bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-2xs text-ink-subtle">{study.id}</span>
                <h4 className="mt-0.5 text-sm font-bold text-ink">{study.study}</h4>
              </div>
              <Badge tone="brand" size="sm">{study.modality}</Badge>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-body">{study.report}</p>
            <div className="mt-3 flex items-center justify-between border-t border-hairline pt-2.5 text-2xs text-ink-subtle">
              <span>Verified: {study.requested}</span>
              <span className="font-semibold text-success">Deployed & Active</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------------- Work Orders */

const orderColumns: Column<ClinicalOrder>[] = [
  { id: 'order', header: 'Work Order / Dispatch Item', width: 'minmax(200px,1.6fr)', cell: (row) => <Cell className="font-semibold text-ink">{row.order}</Cell> },
  { id: 'type', header: 'Category', width: '130px', cell: (row) => <Cell>{row.type}</Cell> },
  { id: 'by', header: 'Assigned Pod', width: '120px', cell: (row) => <Cell>{row.by}</Cell> },
  { id: 'status', header: 'Status', width: '120px', cell: (row) => <StatusBadge status={row.status} /> },
]

export function OrdersTab({ record }: TabProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>Active Work Orders & Provisioning Tasks</SectionLabel>
        <Button size="sm" icon="plus">
          Create Work Order
        </Button>
      </div>

      <DataTable
        columns={orderColumns}
        rows={record.orders || []}
        getRowId={(row) => row.order}
        minWidth={680}
      />
    </>
  )
}

/* -------------------------------------------------------------- Notes */

export function NotesTab({ record }: TabProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>Executive Meeting Notes & Account History</SectionLabel>
        <Button size="sm" icon="notes">
          Add Note
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {(record.notes || []).map((note) => (
          <NoteCard key={`${note.title}-${note.date}`} note={note} />
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------------- Visits & QBRs */

export function VisitsTab({ record }: TabProps) {
  return (
    <>
      <SectionLabel>Quarterly Business Reviews & Stakeholder Touchpoints</SectionLabel>
      <div className="rounded-card border border-hairline bg-surface p-4">
        <Timeline items={record.encounters || []} />
      </div>
    </>
  )
}

/* -------------------------------------------------------------- Billing */

const invoiceColumns: Column<Invoice>[] = [
  { id: 'id', header: 'Invoice ID', width: '120px', cell: (row) => <IdCell>{row.id}</IdCell> },
  { id: 'dept', header: 'Service Category', width: 'minmax(160px,1.2fr)', cell: (row) => <Cell className="font-medium text-ink">{row.department}</Cell> },
  { id: 'amount', header: 'Amount', width: '120px', cell: (row) => <AmountCell>{money(row.amount)}</AmountCell> },
  { id: 'date', header: 'Billing Date', width: '100px', cell: (row) => <Cell>{row.date}</Cell> },
  { id: 'status', header: 'Payment Status', width: '120px', cell: (row) => <StatusBadge status={row.status} /> },
]

export function BillingTab({ record }: TabProps) {
  const invoices = (record.invoices && record.invoices.length > 0) ? record.invoices : INVOICES.slice(0, 3)
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <SectionLabel>Invoices & Account Statement</SectionLabel>
          <p className="text-xs text-ink-muted">
            Total Billed YTD: <b className="font-mono text-ink">${(totalBilled / 1000).toFixed(0)}k USD</b>
          </p>
        </div>
        <Button size="sm" icon="receipt">
          Generate Invoice
        </Button>
      </div>

      <DataTable
        columns={invoiceColumns}
        rows={invoices}
        getRowId={(row) => row.id}
        minWidth={680}
      />
    </>
  )
}
