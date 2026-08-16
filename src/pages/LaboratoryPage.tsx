import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Card, Cell, DataTable, EmptyState, FilterChips, IdCell, type Column } from '@/components/ui'
import { PatientLink, PriorityLabel, StatusBadge } from '@/components/domain'
import { LAB_FILTERS, LAB_ORDERS } from '@/data/clinical'
import { findPatientByName } from '@/data/patients'
import type { LabOrder } from '@/data/types'

/** Quality Assurance & Work Orders Dispatch Board */
export function LaboratoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [completed, setCompleted] = useState<Record<string, true>>({})

  const filter = searchParams.get('status') ?? 'All'

  const orders = useMemo(
    () =>
      LAB_ORDERS.map((order) =>
        completed[order.id] ? ({ ...order, status: 'Completed' } as LabOrder) : order,
      ),
    [completed],
  )

  const rows = orders.filter((order) => filter === 'All' || order.status === filter)

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: orders.length }
    for (const name of LAB_FILTERS) {
      if (name !== 'All') map[name] = orders.filter((order) => order.status === name).length
    }
    return map
  }, [orders])

  const columns: Column<LabOrder>[] = [
    { id: 'id', header: 'Work Order', width: '110px', cell: (row) => <IdCell>{row.id}</IdCell> },
    {
      id: 'patient',
      header: 'Account / Client',
      width: 'minmax(180px,1.4fr)',
      cell: (row) => {
        const patient = findPatientByName(row.account || row.patient || '')
        return patient ? (
          <PatientLink id={patient.id} name={patient.name} showAvatar={false} />
        ) : (
          <Cell className="font-medium text-ink">{row.account || row.patient}</Cell>
        )
      },
    },
    { id: 'test', header: 'QA & Service Specification', width: 'minmax(220px,1.6fr)', cell: (row) => <Cell className="font-semibold text-ink">{row.title || row.test}</Cell> },
    { id: 'branch', header: 'Business Unit', width: 'minmax(130px,1fr)', cell: (row) => <Cell className="text-xs">{row.branch}</Cell> },
    { id: 'priority', header: 'Priority', width: '100px', cell: (row) => <PriorityLabel priority={row.priority} /> },
    { id: 'status', header: 'Status', width: '140px', cell: (row) => <StatusBadge status={row.status} /> },
    {
      id: 'action',
      header: '',
      width: '130px',
      cell: (row) =>
        row.status === 'Completed' || row.status === 'Abnormal' ? null : (
          <Button
            size="xs"
            variant="quiet"
            onClick={() => setCompleted((current) => ({ ...current, [row.id]: true }))}
          >
            Mark fulfilled
          </Button>
        ),
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <FilterChips
          label="Filter by status"
          options={LAB_FILTERS}
          value={filter}
          counts={counts}
          onChange={(next) => setSearchParams(next === 'All' ? {} : { status: next }, { replace: true })}
        />
        <Button variant="secondary" icon="download" className="ml-auto">
          Export work orders
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          minWidth={980}
          emptyState={
            <EmptyState
              icon="activity"
              title="No work orders in this state"
              description="Every work order in this dispatch list has been resolved or moved to the next queue."
              action={{ label: 'Show all orders', onClick: () => setSearchParams({}, { replace: true }) }}
            />
          }
        />
      </Card>
    </div>
  )
}

export const WorkOrdersPage = LaboratoryPage
