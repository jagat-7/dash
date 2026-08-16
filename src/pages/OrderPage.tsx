import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Button,
  Card,
  ColumnVisibility,
  DataTable,
  EmptyState,
  Field,
  FilterPanel,
  IconButton,
  MultiSelect,
  Pagination,
  Popover,
  SearchInput,
  SearchSelect,
  type ActiveFilter,
  type Column,
} from '@/components/ui'
import { StatusBadge } from '@/components/domain'
import { INITIAL_ORDERS, type OrderRecord } from '@/data/orders'
import { cn } from '@/lib/cn'

const STATUS_OPTIONS = ['APPROVED', 'PENDING', 'VERIFIED', 'DECLINED', 'HOLD']

const STATUS_AMOUNT_RIGHT_BORDER: Record<string, string> = {
  APPROVED: 'border-r-[3.5px] border-r-emerald-500',
  VERIFIED: 'border-r-[3.5px] border-r-[#701A75]',
  PENDING: 'border-r-[3.5px] border-r-amber-500',
  DECLINED: 'border-r-[3.5px] border-r-rose-500',
  HOLD: 'border-r-[3.5px] border-r-[#00BCD4]',
}

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Filters
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statuses, setStatuses] = useState<string[]>(
    searchParams.get('status') ? [searchParams.get('status')!] : [],
  )
  const [customer, setCustomer] = useState('')
  const [salesman, setSalesman] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [hidden, setHidden] = useState<string[]>([])

  // Available options
  const customerOptions = useMemo(() => {
    return Array.from(new Set(orders.map((o) => `${o.customer} (${o.customerLocation})`)))
  }, [orders])

  const salesmanOptions = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.salesman)))
  }, [orders])

  const dateOptions = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.date)))
  }, [orders])

  function reset() {
    setQuery('')
    setStatuses([])
    setCustomer('')
    setSalesman('')
    setDateFilter('')
    setSelectedIds([])
    setSearchParams({}, { replace: true })
    setPage(1)
  }

  // Filtered dataset
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return orders.filter((order) => {
      if (statuses.length && !statuses.includes(order.status)) return false
      if (customer && `${order.customer} (${order.customerLocation})` !== customer) return false
      if (salesman && order.salesman !== salesman) return false
      if (dateFilter && order.date !== dateFilter) return false
      if (!needle) return true
      return (
        order.orderNo.toLowerCase().includes(needle) ||
        order.customer.toLowerCase().includes(needle) ||
        order.customerLocation.toLowerCase().includes(needle) ||
        order.salesman.toLowerCase().includes(needle) ||
        order.date.toLowerCase().includes(needle)
      )
    })
  }, [orders, query, statuses, customer, salesman, dateFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  // Totals
  const totalOrdersCount = filtered.length
  const totalAmountSum = useMemo(() => {
    return filtered.reduce((acc, curr) => acc + curr.amount, 0)
  }, [filtered])

  // Selection handlers
  const allSelected = rows.length > 0 && rows.every((o) => selectedIds.includes(o.id))
  const someSelected = rows.some((o) => selectedIds.includes(o.id)) && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(rows.map((o) => o.id))
    }
  }

  function toggleSelectRow(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  // Bulk actions
  function handleBulkStatus(newStatus: 'APPROVED' | 'DECLINED' | 'VERIFIED' | 'HOLD') {
    if (selectedIds.length === 0) return
    setOrders((current) =>
      current.map((o) => (selectedIds.includes(o.id) ? { ...o, status: newStatus } : o)),
    )
    setSelectedIds([])
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return
    setOrders((current) => current.filter((o) => !selectedIds.includes(o.id)))
    setSelectedIds([])
  }

  // Columns definition using the theme system
  const columns: Column<OrderRecord>[] = [
    {
      id: 'select',
      width: '40px',
      align: 'center',
      header: (
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected
          }}
          onChange={toggleSelectAll}
          aria-label="Select all orders"
          className="size-3.5 cursor-pointer rounded border-hairline text-brand-600 focus:ring-brand-500"
        />
      ),
      cell: (row) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(row.id)}
            onChange={() => toggleSelectRow(row.id)}
            aria-label={`Select order ${row.orderNo}`}
            className="size-3.5 cursor-pointer rounded border-hairline text-brand-600 focus:ring-brand-500"
          />
        </div>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      width: '110px',
      align: 'center',
      cell: (row) => (
        <span className="text-xs text-ink text-center">
          {row.date}
        </span>
      ),
    },
    {
      id: 'orderNo',
      header: 'Order No.',
      width: '110px',
      align: 'center',
      cell: (row) => (
        <div className="w-full text-center">
          <Link
            to={`/orders/${row.id}`}
            className="font-semibold text-xs text-[#007A87] hover:underline"
          >
            #{row.orderNo}
          </Link>
        </div>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      width: 'minmax(230px, 1.5fr)',
      cell: (row) => (
        <div className="flex min-w-0 items-baseline gap-1.5 truncate">
          <span className="truncate text-xs font-semibold text-ink">{row.customer}</span>
          <span className="shrink-0 text-[11px] font-normal text-ink-subtle">
            ({row.customerLocation})
          </span>
        </div>
      ),
    },
    {
      id: 'amount',
      header: 'Order Amount',
      width: '150px',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end pr-2">
          <span
            data-numeric
            className={cn(
              'inline-flex items-baseline rounded-l bg-subtle px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-ink border-y border-l border-hairline/60 shadow-2xs',
              STATUS_AMOUNT_RIGHT_BORDER[row.status] ?? 'border-r-[3.5px] border-r-slate-300',
            )}
          >
            <span className="mr-0.5 text-[9px] font-medium text-ink-subtle">Rs.</span>
            {row.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
    {
      id: 'salesman',
      header: 'Sales Man',
      width: '200px',
      align: 'center',
      cell: (row) => (
        <span className="block w-full text-center text-xs font-medium text-ink">
          {row.salesman}
        </span>
      ),
    },
    {
      id: 'modifiedBy',
      header: 'Modified By (Date)',
      width: '160px',
      align: 'center',
      cell: (row) => (
        <span className="text-xs text-ink-muted text-center">
          {row.modifiedBy}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      width: '130px',
      align: 'center',
      cell: (row) => (
        <div className="flex justify-center">
          <StatusBadge
            status={row.status}
            className="w-[84px] justify-center text-center font-bold tracking-wider text-[10px] uppercase"
          />
        </div>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      width: '70px',
      align: 'center',
      cell: () => (
        <IconButton
          icon="receipt"
          label="View Voucher / PDF"
          size={26}
          className="text-[#D97706] hover:bg-[#FEF3C7]"
        />
      ),
    },
  ]

  const visibleColumns = columns.filter((column) => !hidden.includes(column.id))

  const active: ActiveFilter[] = [
    ...(statuses.length
      ? [{ id: 'status', label: 'Status', value: statuses.join(', '), onClear: () => setStatuses([]) }]
      : []),
    ...(customer ? [{ id: 'customer', label: 'Customer', value: customer, onClear: () => setCustomer('') }] : []),
    ...(salesman ? [{ id: 'salesman', label: 'Sales Man', value: salesman, onClear: () => setSalesman('') }] : []),
    ...(dateFilter ? [{ id: 'date', label: 'Date', value: dateFilter, onClear: () => setDateFilter('') }] : []),
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2.5">
      {/* Top Filter Panel with theme search, popovers, and filters */}
      <FilterPanel
        active={active}
        onClearAll={reset}
        columns={4}
        className="shrink-0"
        toolbar={
          <>
            <SearchInput
              placeholder="Search by order no, customer, salesman..."
              aria-label="Search orders"
              width="280px"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              onClear={() => setQuery('')}
            />
            <Popover
              align="start"
              width={230}
              trigger={
                <Button size="sm" variant="secondary" icon="eye">
                  Columns
                </Button>
              }
            >
              <p className="mb-2 text-2xs font-bold tracking-[0.06em] text-ink-subtle uppercase">
                Show / hide columns
              </p>
              <ColumnVisibility
                columns={columns.map((column) => ({
                  id: column.id,
                  label: typeof column.header === 'string' ? column.header : column.id,
                  visible: !hidden.includes(column.id),
                  locked: column.id === 'select' || column.id === 'orderNo',
                }))}
                onToggle={(id, visible) =>
                  setHidden((current) =>
                    visible ? current.filter((entry) => entry !== id) : [...current, id],
                  )
                }
              />
            </Popover>
          </>
        }
      >
        <Field label="Order Status">
          <MultiSelect
            options={STATUS_OPTIONS}
            value={statuses}
            onChange={(next) => {
              setStatuses(next)
              setPage(1)
            }}
            placeholder="All statuses"
          />
        </Field>
        <Field label="Customer">
          <SearchSelect
            options={customerOptions}
            value={customer}
            onChange={(next) => {
              setCustomer(next)
              setPage(1)
            }}
            placeholder="All Customers"
          />
        </Field>
        <Field label="Sales Man">
          <SearchSelect
            options={salesmanOptions}
            value={salesman}
            onChange={(next) => {
              setSalesman(next)
              setPage(1)
            }}
            placeholder="All Salesmen"
          />
        </Field>
        <Field label="Order Date">
          <SearchSelect
            options={dateOptions}
            value={dateFilter}
            onChange={(next) => {
              setDateFilter(next)
              setPage(1)
            }}
            placeholder="All Dates"
          />
        </Field>
      </FilterPanel>

      {/* Main Table Card (Fills Remaining Screen Height) */}
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border border-hairline-teal shadow-xs">
        <DataTable
          columns={visibleColumns}
          rows={rows}
          getRowId={(row) => row.id}
          rowHeight={34}
          minWidth={940}
          className="min-h-0 flex-1 overflow-auto"
          emptyState={
            <EmptyState
              icon="cart"
              title="No orders match these filters"
              description="Try adjusting your search criteria, or clear the active filters to view all orders."
              action={{ label: 'Clear filters', onClick: reset }}
            />
          }
        />

        {/* Table Footer with Pagination & Summary & Bulk Actions */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-hairline-teal bg-subtle/50 px-3.5 py-1.5 text-xs">
          {/* Left: Pagination Controls */}
          {filtered.length > 0 ? (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              summary={`Showing ${start + 1}–${start + rows.length} of ${filtered.length} orders`}
            />
          ) : (
            <div />
          )}

          {/* Right: Metrics & Bulk Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Total Orders Metric */}
            <div className="flex items-baseline gap-1.5 border-r border-hairline-teal pr-3 sm:pr-4">
              <span className="text-[10px] font-bold tracking-wider text-ink-subtle uppercase">
                TOTAL ORDERS:
              </span>
              <span className="font-extrabold text-xs text-ink">{totalOrdersCount}</span>
            </div>

            {/* Total Amount Metric */}
            <div className="flex items-baseline gap-1.5 border-r border-hairline-teal pr-3 sm:pr-4">
              <span className="text-[10px] font-bold tracking-wider text-ink-subtle uppercase">
                TOTAL AMOUNT:
              </span>
              <span className="font-extrabold text-xs text-[#007A87]">
                Rs. {totalAmountSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Bulk Action Buttons Styled with Theme Primitives */}
            <div className="flex items-center gap-1">
              <Button
                size="xs"
                variant="delete"
                disabled={selectedIds.length === 0}
                onClick={handleBulkDelete}
                className="w-[74px] justify-center text-[10px] font-bold tracking-wider rounded-[5px]"
              >
                DELETE
              </Button>

              <Button
                size="xs"
                variant="decline"
                disabled={selectedIds.length === 0}
                onClick={() => handleBulkStatus('DECLINED')}
                className="w-[74px] justify-center text-[10px] font-bold tracking-wider rounded-[5px]"
              >
                DECLINE
              </Button>

              <Button
                size="xs"
                variant="verify"
                disabled={selectedIds.length === 0}
                onClick={() => handleBulkStatus('VERIFIED')}
                className="w-[74px] justify-center text-[10px] font-bold tracking-wider rounded-[5px]"
              >
                VERIFY
              </Button>

              <Button
                size="xs"
                variant="hold"
                disabled={selectedIds.length === 0}
                onClick={() => handleBulkStatus('HOLD')}
                className="w-[74px] justify-center text-[10px] font-bold tracking-wider rounded-[5px]"
              >
                HOLD
              </Button>

              <Button
                size="xs"
                variant="approve"
                disabled={selectedIds.length === 0}
                onClick={() => handleBulkStatus('APPROVED')}
                className="w-[74px] justify-center text-[10px] font-bold tracking-wider rounded-[5px]"
              >
                APPROVE
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export const OrderPage = OrdersPage
export const PatientsPage = OrdersPage
export const CustomersPage = OrdersPage
