import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AmountCell,
  Badge,
  Button,
  Card,
  CardHeader,
  Cell,
  DataTable,
  DetailPanel,
  IdCell,
  StatCard,
  Tabs,
  type Column,
  type StatCardProps,
} from '@/components/ui'
import { PatientLink, StatusBadge } from '@/components/domain'
import { PageLayout } from '@/components/layout'
import { CLAIMS, DIGITAL_WALLETS, INVOICES, PAYMENTS, invoiceLines } from '@/data/finance'
import { findPatientByName } from '@/data/patients'
import type { Claim, Invoice, Payment } from '@/data/types'
import { money } from '@/lib/format'
import { useBranch } from '@/store/useAppStore'

const TABS = [
  { id: 'invoices', label: 'Customer Invoices' },
  { id: 'claims', label: 'ARR Subscriptions & SLAs' },
  { id: 'payments', label: 'Payment Clearing Ledger' },
]

function accountCell(name: string) {
  const patient = findPatientByName(name)
  return patient ? (
    <PatientLink id={patient.id} name={name} showAvatar={false} />
  ) : (
    <Cell className="font-medium text-ink">{name}</Cell>
  )
}

export function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const branch = useBranch()
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  const tab = searchParams.get('tab') ?? 'invoices'
  const invoice = INVOICES.find((entry) => entry.id === selectedInvoice) ?? null

  const summary: StatCardProps[] = [
    {
      label: 'Settled & Cleared Today',
      value: money(Math.round((684000 * branch.factor) / 100) * 100),
      icon: 'check',
      tone: 'success',
      trend: { value: '+14.2%', direction: 'up', caption: 'vs daily run-rate' },
    },
    {
      label: 'Outstanding AR Ledger',
      value: money(Math.round((240000 * branch.factor) / 100) * 100),
      icon: 'clock',
      tone: 'warning',
      trend: { value: '4 invoices', direction: 'flat', caption: 'due in 15 days' },
    },
    {
      label: 'Pending Contract Invoicing',
      value: money(Math.round((1840000 * branch.factor) / 100) * 100),
      icon: 'shield',
      tone: 'brand',
      trend: { value: '142 accounts', direction: 'flat', caption: 'monthly billing cycle' },
    },
  ]

  const invoiceColumns: Column<Invoice>[] = [
    { id: 'id', header: 'Invoice ID', width: '125px', cell: (row) => <IdCell>{row.id}</IdCell> },
    { id: 'patient', header: 'Customer / Account', width: 'minmax(180px,1.4fr)', cell: (row) => accountCell(row.account || row.patient || '') },
    { id: 'branch', header: 'Business Unit', width: 'minmax(130px,1fr)', cell: (row) => <Cell>{row.branch}</Cell> },
    { id: 'dept', header: 'Product Line', width: 'minmax(140px,1fr)', cell: (row) => <Cell>{row.department}</Cell> },
    { id: 'amount', header: 'Amount (USD)', width: '130px', align: 'right', cell: (row) => <AmountCell>{money(row.amount)}</AmountCell> },
    { id: 'status', header: 'Status', width: '140px', cellClassName: 'pl-3', headClassName: 'pl-3', cell: (row) => <StatusBadge status={row.status} /> },
  ]

  const claimColumns: Column<Claim>[] = [
    { id: 'id', header: 'Contract ID', width: '125px', cell: (row) => <IdCell>{row.id}</IdCell> },
    { id: 'patient', header: 'Account / Client', width: 'minmax(180px,1.4fr)', cell: (row) => accountCell(row.patient || '') },
    { id: 'branch', header: 'Business Unit', width: 'minmax(130px,1fr)', cell: (row) => <Cell>{row.branch}</Cell> },
    { id: 'amount', header: 'ARR Value', width: '130px', align: 'right', cell: (row) => <AmountCell>{money(row.amount)}</AmountCell> },
    { id: 'submitted', header: 'Renewal / Due', width: '120px', cellClassName: 'pl-3', headClassName: 'pl-3', cell: (row) => <Cell>{row.submitted}</Cell> },
    { id: 'status', header: 'Status', width: '140px', cell: (row) => <StatusBadge status={row.status} /> },
  ]

  const paymentColumns: Column<Payment>[] = [
    { id: 'id', header: 'Receipt ID', width: '115px', cell: (row) => <IdCell>{row.id}</IdCell> },
    { id: 'invoice', header: 'Invoice', width: '125px', cell: (row) => <IdCell>{row.invoice}</IdCell> },
    { id: 'patient', header: 'Account / Client', width: 'minmax(180px,1.4fr)', cell: (row) => accountCell(row.account || row.patient || '') },
    { id: 'amount', header: 'Settled Amount', width: '130px', align: 'right', cell: (row) => <AmountCell>{money(row.amount)}</AmountCell> },
    { id: 'mode', header: 'Clearing Channel', width: '130px', cellClassName: 'pl-3', headClassName: 'pl-3', cell: (row) => <Badge tone="brand">{row.mode}</Badge> },
    { id: 'receivedAt', header: 'Clearing Desk', width: 'minmax(180px,1.2fr)', cell: (row) => <Cell className="text-xs">{row.receivedAt}</Cell> },
    { id: 'time', header: 'Timestamp', width: '130px', cell: (row) => <Cell className="text-xs">{row.time}</Cell> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {summary.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <Tabs
        label="Billing sections"
        items={TABS}
        value={tab}
        onChange={(next) => {
          setSearchParams(next === 'invoices' ? {} : { tab: next }, { replace: true })
          setSelectedInvoice(null)
        }}
      />

      {tab === 'invoices' ? (
        <PageLayout
          id="billing-invoices"
          variant={invoice ? 'split' : 'single'}
          primary={
            <Card className="min-w-0">
              <DataTable
                columns={invoiceColumns}
                rows={INVOICES}
                getRowId={(row) => row.id}
                selectedId={selectedInvoice}
                minWidth={920}
                onRowClick={(row) => setSelectedInvoice(row.id === selectedInvoice ? null : row.id)}
              />
            </Card>
          }
          secondary={
            invoice ? (
              <DetailPanel
                title={invoice.id}
                subtitle={`${invoice.account || invoice.patient} · ${invoice.date}`}
                width={9999}
                onClose={() => setSelectedInvoice(null)}
              >
                <ul className="flex flex-col gap-2.5">
                  {invoiceLines(invoice).map((line) => (
                    <li key={line.label} className="flex justify-between gap-3 text-sm">
                      <span className="text-ink-muted">{line.label}</span>
                      <span data-numeric className="font-semibold whitespace-nowrap text-ink">
                        {money(line.amount)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex justify-between rounded-control bg-subtle px-3 py-2.5 text-base font-bold text-ink">
                  <span>Total Billed</span>
                  <span data-numeric>{money(invoice.amount)}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-2xs text-ink-muted">Supported Rails:</span>
                  {DIGITAL_WALLETS.map((wallet) => (
                    <Badge key={wallet} tone="neutral" className="font-medium">
                      {wallet}
                    </Badge>
                  ))}
                </div>

                <Button block className="mt-3" disabled={invoice.status === 'Paid'}>
                  {invoice.status === 'Paid' ? 'Settled & Reconciled' : 'Record Direct Settlement'}
                </Button>
              </DetailPanel>
            ) : null
          }
        />
      ) : null}

      {tab === 'claims' ? (
        <Card>
          <CardHeader
            title="Active ARR Subscriptions & Enterprise SLAs"
            description="Recurring contract cycles across global business units"
            actions={<Button>Release Billing Cycle (142 ready)</Button>}
          />
          <DataTable columns={claimColumns} rows={CLAIMS} getRowId={(row) => row.id} minWidth={920} />
        </Card>
      ) : null}

      {tab === 'payments' ? (
        <Card>
          <CardHeader title="Payment Clearing Receipts" description="Automated gateway and wire settlements" />
          <DataTable columns={paymentColumns} rows={PAYMENTS} getRowId={(row) => row.id} minWidth={1040} />
        </Card>
      ) : null}
    </div>
  )
}
