import { useState } from 'react'
import { Badge, Card, CardBody, Icon } from '@/components/ui'
import { cn } from '@/lib/cn'

type TimePeriod = 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'
type HeatmapMode = 'SALES' | 'COLLECTION' | 'VISITS'
type PerformerTab = 'SALESMAN' | 'TARGETS' | 'CUSTOMER' | 'BRAND' | 'PRODUCT GROUP' | 'PRODUCT' | 'AREA'
type AlertTab = 'SEC' | 'CO.'

interface ProvinceData {
  id: string
  name: string
  nepaliName: string
  sales: string
  salesRaw: number
  collection: string
  visits: string
  color: string
  path: string
  center: [number, number]
}

const PROVINCES: ProvinceData[] = [
  {
    id: 'p1',
    name: 'Province no. 1',
    nepaliName: 'Koshi Province',
    sales: 'Rs. 3.61 Cr',
    salesRaw: 36100000,
    collection: 'Rs. 2.18 Cr',
    visits: '482',
    color: '#0284C7',
    path: 'M 450 140 L 510 100 L 580 120 L 590 200 L 540 240 L 460 210 L 440 170 Z',
    center: [515, 170],
  },
  {
    id: 'p2',
    name: 'Province no. 2',
    nepaliName: 'Madhesh Province',
    sales: 'Rs. 19.35 L',
    salesRaw: 1935000,
    collection: 'Rs. 14.20 L',
    visits: '210',
    color: '#38BDF8',
    path: 'M 360 200 L 460 210 L 540 240 L 530 260 L 370 240 Z',
    center: [450, 230],
  },
  {
    id: 'p3',
    name: 'Bagmati',
    nepaliName: 'Bagmati Province',
    sales: 'Rs. 82.41 L',
    salesRaw: 8241000,
    collection: 'Rs. 68.90 L',
    visits: '640',
    color: '#7DD3FC',
    path: 'M 350 110 L 440 110 L 450 170 L 410 205 L 340 195 L 320 150 Z',
    center: [385, 155],
  },
  {
    id: 'p4',
    name: 'Gandaki',
    nepaliName: 'Gandaki Province',
    sales: 'Rs. 0.00',
    salesRaw: 0,
    collection: 'Rs. 0.00',
    visits: '0',
    color: '#CBD5E1',
    path: 'M 240 80 L 350 110 L 320 150 L 340 195 L 260 200 L 230 140 Z',
    center: [285, 145],
  },
  {
    id: 'p5',
    name: 'Lumbini',
    nepaliName: 'Lumbini Province',
    sales: 'Rs. 77.28 L',
    salesRaw: 7728000,
    collection: 'Rs. 52.40 L',
    visits: '395',
    color: '#0EA5E9',
    path: 'M 180 150 L 260 150 L 260 200 L 340 195 L 370 240 L 210 240 L 170 200 Z',
    center: [250, 195],
  },
  {
    id: 'p6',
    name: 'Karnali',
    nepaliName: 'Karnali Province',
    sales: 'Rs. 0.00',
    salesRaw: 0,
    collection: 'Rs. 0.00',
    visits: '0',
    color: '#E2E8F0',
    path: 'M 120 70 L 240 80 L 230 140 L 180 150 L 140 180 L 90 120 Z',
    center: [165, 120],
  },
  {
    id: 'p7',
    name: 'Sudurpashchim',
    nepaliName: 'Sudurpashchim Province',
    sales: 'Rs. 27.10 K',
    salesRaw: 27100,
    collection: 'Rs. 25.00 K',
    visits: '64',
    color: '#BAE6FD',
    path: 'M 10 90 L 120 70 L 90 120 L 140 180 L 90 220 L 30 180 Z',
    center: [75, 140],
  },
]

const ATTENTION_STAFF = [
  { name: 'Ram Lal Biswas', role: 'STAFF', status: 'ABSENT TODAY' },
  { name: 'Santosh Bista', role: 'STAFF', status: 'ABSENT TODAY' },
  { name: 'Sujan Shrestha', role: 'STAFF', status: 'ABSENT TODAY' },
  { name: 'Jivan Choudhary', role: 'STAFF', status: 'ABSENT TODAY' },
]

const TOP_SALESMEN = [
  { rank: 1, name: 'Rajesh Karki', area: 'Biratnagar / Koshi', target: 'Rs. 15.00L', achieved: 'Rs. 18.25L', pct: 121 },
  { rank: 2, name: 'Anita Thapa', area: 'Kathmandu Valley', target: 'Rs. 12.00L', achieved: 'Rs. 13.80L', pct: 115 },
  { rank: 3, name: 'Bipin Shrestha', area: 'Butwal / Lumbini', target: 'Rs. 10.00L', achieved: 'Rs. 10.90L', pct: 109 },
  { rank: 4, name: 'Dipak Sharma', area: 'Pokhara / Gandaki', target: 'Rs. 8.00L', achieved: 'Rs. 8.40L', pct: 105 },
  { rank: 5, name: 'Sunita Chaudhari', area: 'Madhesh Plains', target: 'Rs. 7.50L', achieved: 'Rs. 6.80L', pct: 91 },
]

const ATTENDANCE_15_DAYS = [
  { day: '01', present: 146, late: 2, absent: 2 },
  { day: '02', present: 148, late: 1, absent: 1 },
  { day: '03', present: 144, late: 4, absent: 2 },
  { day: '04', present: 147, late: 2, absent: 1 },
  { day: '05', present: 140, late: 6, absent: 4 },
  { day: '06', present: 138, late: 5, absent: 7 },
  { day: '07', present: 142, late: 3, absent: 5 },
  { day: '08', present: 145, late: 3, absent: 2 },
  { day: '09', present: 149, late: 1, absent: 0 },
  { day: '10', present: 146, late: 2, absent: 2 },
  { day: '11', present: 143, late: 4, absent: 3 },
  { day: '12', present: 141, late: 5, absent: 4 },
  { day: '13', present: 144, late: 3, absent: 3 },
  { day: '14', present: 146, late: 2, absent: 2 },
  { day: '15', present: 142, late: 4, absent: 4 },
]

export function LauncherPage() {
  // Metric Period Filters
  const [ordersPeriod, setOrdersPeriod] = useState<TimePeriod>('MONTH')
  const [collectionsPeriod, setCollectionsPeriod] = useState<TimePeriod>('MONTH')
  const [visitsPeriod, setVisitsPeriod] = useState<TimePeriod>('MONTH')
  const [leadsPeriod, setLeadsPeriod] = useState<TimePeriod>('MONTH')

  // Heatmap State
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('SALES')
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string>('p1')

  // Top Performers State
  const [performerTab, setPerformerTab] = useState<PerformerTab>('SALESMAN')
  const [performerPeriod, setPerformerPeriod] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH')
  const [showDemoPerformers, setShowDemoPerformers] = useState(false)

  // Alerts State
  const [alertTab, setAlertTab] = useState<AlertTab>('SEC')

  const timeOptions: TimePeriod[] = ['TODAY', 'WEEK', 'MONTH', 'YEAR']

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* ================= 1. Top 4 Metric KPI Cards ================= */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: ORDERS */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs transition-all hover:shadow-card">
          <CardBody className="flex flex-col p-3.5 sm:p-4">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-[#0284C7] uppercase">
                <span className="grid size-6 place-items-center rounded-md bg-[#E0F2FE] text-[#0284C7]">
                  <Icon name="cube" size={13} strokeWidth={2.4} />
                </span>
                <span>ORDERS</span>
              </div>
              {/* Period Switcher */}
              <div className="inline-flex rounded-md bg-subtle p-0.5 ring-1 ring-hairline-teal">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOrdersPeriod(t)}
                    className={cn(
                      'cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all',
                      ordersPeriod === t
                        ? 'bg-surface font-bold text-ink shadow-2xs'
                        : 'text-ink-subtle hover:text-ink',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-label & Main Metric */}
            <p className="mt-3 text-[10px] font-bold tracking-wider text-ink-subtle uppercase">
              DISPATCHED (BILLED)
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                Rs. 0.00
              </span>
              <span className="text-xs font-bold text-critical">-100.0%</span>
            </div>

            {/* Subtle Trend Line Spark */}
            <div className="mt-2.5 flex h-4 items-center gap-1">
              {[4, 6, 8, 5, 9, 12, 14, 11, 15, 10, 16, 18, 14, 20, 12].map((v, i) => (
                <span
                  key={i}
                  style={{ height: `${(v / 20) * 100}%` }}
                  className="w-full rounded-xs bg-[#BAE6FD]/80"
                />
              ))}
            </div>

            {/* Bottom Breakdown 2-Column Grid */}
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-hairline-teal pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <span className="size-2 rounded-full bg-warning" /> Pending
                </span>
                <span className="font-bold text-ink">3.65 K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="check" size={11} strokeWidth={3} className="text-info" /> Verified
                </span>
                <span className="font-bold text-ink">1.50 K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="check" size={11} strokeWidth={3} className="text-success" /> Approved
                </span>
                <span className="font-bold text-ink">13.27 K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="declined" size={11} strokeWidth={2.4} className="text-critical" /> Declined
                </span>
                <span className="font-bold text-ink">0.00</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 2: COLLECTIONS */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs transition-all hover:shadow-card">
          <CardBody className="flex flex-col p-3.5 sm:p-4">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-[#16A34A] uppercase">
                <span className="grid size-6 place-items-center rounded-md bg-[#DCFCE7] text-[#16A34A]">
                  <Icon name="wallet" size={13} strokeWidth={2.4} />
                </span>
                <span>COLLECTIONS</span>
              </div>
              <div className="inline-flex rounded-md bg-subtle p-0.5 ring-1 ring-hairline-teal">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCollectionsPeriod(t)}
                    className={cn(
                      'cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all',
                      collectionsPeriod === t
                        ? 'bg-surface font-bold text-ink shadow-2xs'
                        : 'text-ink-subtle hover:text-ink',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold tracking-wider text-ink-subtle uppercase">
              TOTAL COLLECTED
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                Rs. 0.00
              </span>
              <span className="text-xs font-bold text-critical">-100.0%</span>
            </div>

            <div className="mt-2.5 flex h-4 items-center gap-1">
              {[2, 4, 3, 7, 5, 8, 10, 6, 9, 12, 11, 14, 13, 15, 8].map((v, i) => (
                <span
                  key={i}
                  style={{ height: `${(v / 15) * 100}%` }}
                  className="w-full rounded-xs bg-[#86EFAC]/80"
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-hairline-teal pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="cash" size={11} className="text-success" /> Cash
                </span>
                <span className="font-bold text-ink">0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="building" size={11} className="text-info" /> Bank & Cheque
                </span>
                <span className="font-bold text-ink">0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <span className="size-2 rounded-full bg-warning" /> PDC Cheques
                </span>
                <span className="font-bold text-ink">0.00</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 3: VISITS */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs transition-all hover:shadow-card">
          <CardBody className="flex flex-col p-3.5 sm:p-4">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-[#7C3AED] uppercase">
                <span className="grid size-6 place-items-center rounded-md bg-[#EDE9FE] text-[#7C3AED]">
                  <Icon name="location" size={13} strokeWidth={2.4} />
                </span>
                <span>VISITS</span>
              </div>
              <div className="inline-flex rounded-md bg-subtle p-0.5 ring-1 ring-hairline-teal">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setVisitsPeriod(t)}
                    className={cn(
                      'cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all',
                      visitsPeriod === t
                        ? 'bg-surface font-bold text-ink shadow-2xs'
                        : 'text-ink-subtle hover:text-ink',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold tracking-wider text-ink-subtle uppercase">
              TOTAL VISITS
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                0.00
              </span>
              <span className="text-xs font-bold text-success">+0%</span>
            </div>

            <div className="mt-2.5 flex h-4 items-center gap-1">
              {[3, 5, 2, 6, 8, 7, 10, 9, 12, 8, 14, 11, 13, 10, 6].map((v, i) => (
                <span
                  key={i}
                  style={{ height: `${(v / 14) * 100}%` }}
                  className="w-full rounded-xs bg-[#DDD6FE]/80"
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-hairline-teal pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="cart" size={11} className="text-warning" /> Order
                </span>
                <span className="font-bold text-ink">0 (Rs. 0.00)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="wallet" size={11} className="text-info" /> Collection
                </span>
                <span className="font-bold text-ink">0 (Rs. 0.00)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="check" size={11} className="text-success" /> Productive
                </span>
                <span className="font-bold text-ink">0.00</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 4: LEADS */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs transition-all hover:shadow-card">
          <CardBody className="flex flex-col p-3.5 sm:p-4">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-[#DB2777] uppercase">
                <span className="grid size-6 place-items-center rounded-md bg-[#FCE7F3] text-[#DB2777]">
                  <Icon name="userGroup" size={13} strokeWidth={2.4} />
                </span>
                <span>LEADS</span>
              </div>
              <div className="inline-flex rounded-md bg-subtle p-0.5 ring-1 ring-hairline-teal">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setLeadsPeriod(t)}
                    className={cn(
                      'cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all',
                      leadsPeriod === t
                        ? 'bg-surface font-bold text-ink shadow-2xs'
                        : 'text-ink-subtle hover:text-ink',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold tracking-wider text-ink-subtle uppercase">
              NEW LEADS
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                1.00
              </span>
              <span className="text-xs font-bold text-success">+0%</span>
            </div>

            <div className="mt-2.5 flex h-4 items-end gap-1">
              {[0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0].map((v, i) => (
                <span
                  key={i}
                  style={{ height: v > 0 ? '100%' : '15%' }}
                  className={cn('w-full rounded-xs', v > 0 ? 'bg-[#F472B6]' : 'bg-hairline-teal')}
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-hairline-teal pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="check" size={11} className="text-success" /> Converted
                </span>
                <span className="font-bold text-ink">0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <span className="size-2 rounded-full bg-warning" /> In Pipeline
                </span>
                <span className="font-bold text-ink">1.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Icon name="declined" size={11} className="text-critical" /> Dropped
                </span>
                <span className="font-bold text-ink">0.00</span>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>

      {/* ================= 2. Middle Row: Regional Heatmap + Top Performers ================= */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        
        {/* Left: Regional Heatmap (7 Provinces Map) */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs lg:col-span-8">
          <CardBody className="flex flex-col p-4 sm:p-5">
            {/* Header + Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon name="map" size={17} className="text-brand-600" />
                <h2 className="font-bold text-base text-ink">Regional Heatmap</h2>
              </div>

              <div className="inline-flex rounded-lg bg-subtle p-0.5 ring-1 ring-hairline-teal">
                {(['SALES', 'COLLECTION', 'VISITS'] as HeatmapMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setHeatmapMode(mode)}
                    className={cn(
                      'cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition-all',
                      heatmapMode === mode
                        ? 'bg-surface font-bold text-brand-700 shadow-2xs'
                        : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Body: Left Breakdown List & Right Interactive Map */}
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
              
              {/* Left Provinces List (5 Cols) */}
              <div className="flex flex-col divide-y divide-hairline-teal md:col-span-5">
                {PROVINCES.map((prov) => {
                  const isSelected = selectedProvince === prov.id
                  const isHovered = hoveredProvince === prov.id
                  const value =
                    heatmapMode === 'SALES'
                      ? prov.sales
                      : heatmapMode === 'COLLECTION'
                        ? prov.collection
                        : `${prov.visits} visits`

                  return (
                    <div
                      key={prov.id}
                      onMouseEnter={() => setHoveredProvince(prov.id)}
                      onMouseLeave={() => setHoveredProvince(null)}
                      onClick={() => setSelectedProvince(prov.id)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between py-2.5 px-2 rounded-lg transition-colors',
                        isSelected || isHovered ? 'bg-brand-50/70 font-semibold' : 'hover:bg-subtle',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          style={{ backgroundColor: prov.color }}
                          className="size-2.5 shrink-0 rounded-full shadow-2xs"
                        />
                        <span className="text-xs text-ink">{prov.name}</span>
                      </div>
                      <span className="font-bold text-xs text-ink">{value}</span>
                    </div>
                  )
                })}
              </div>

              {/* Right: Interactive Nepal Map (7 Cols) */}
              <div className="relative flex min-h-[260px] items-center justify-center rounded-xl bg-subtle/50 p-2 md:col-span-7">
                <svg
                  viewBox="0 0 620 300"
                  className="h-full max-h-[300px] w-full drop-shadow-sm transition-all"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {PROVINCES.map((prov) => {
                    const isSelected = selectedProvince === prov.id
                    const isHovered = hoveredProvince === prov.id
                    const fill =
                      isSelected || isHovered
                        ? '#0284C7'
                        : prov.salesRaw > 0
                          ? '#38BDF8'
                          : '#E2E8F0'

                    return (
                      <g key={prov.id}>
                        <path
                          d={prov.path}
                          fill={fill}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          className="cursor-pointer transition-all duration-200 hover:opacity-90"
                          onMouseEnter={() => setHoveredProvince(prov.id)}
                          onMouseLeave={() => setHoveredProvince(null)}
                          onClick={() => setSelectedProvince(prov.id)}
                        />
                        {/* Province Label on Map */}
                        <text
                          x={prov.center[0]}
                          y={prov.center[1]}
                          textAnchor="middle"
                          className={cn(
                            'pointer-events-none text-[10px] font-bold tracking-tight select-none',
                            prov.salesRaw > 0 ? 'fill-white' : 'fill-slate-500',
                          )}
                        >
                          {prov.name.replace('Province no. ', 'P-')}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* Interactive Tooltip Card for Selected/Hovered Province */}
                {(() => {
                  const activeProv = PROVINCES.find(
                    (p) => p.id === (hoveredProvince || selectedProvince),
                  )
                  if (!activeProv) return null
                  return (
                    <div className="pointer-events-none absolute right-3 bottom-3 rounded-lg border border-hairline-teal bg-surface/95 px-3 py-2 shadow-card backdrop-blur-xs">
                      <p className="text-xs font-bold text-ink">{activeProv.name} ({activeProv.nepaliName})</p>
                      <p className="text-2xs text-brand-700 font-semibold">
                        {heatmapMode}: {heatmapMode === 'SALES' ? activeProv.sales : heatmapMode === 'COLLECTION' ? activeProv.collection : `${activeProv.visits} visits`}
                      </p>
                    </div>
                  )
                })()}
              </div>

            </div>
          </CardBody>
        </Card>

        {/* Right: Top Performers */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs lg:col-span-4">
          <CardBody className="flex flex-col p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon name="trophy" size={17} className="text-warning" />
                <h2 className="font-bold text-base text-ink">Top Performers</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  value={performerPeriod}
                  onChange={(e) => setPerformerPeriod(e.target.value as any)}
                  aria-label="Filter period for top performers"
                  className="cursor-pointer rounded-md border border-hairline-teal bg-subtle px-2 py-1 text-2xs font-bold text-ink outline-none"
                >
                  <option value="MONTH">MONTH</option>
                  <option value="QUARTER">QUARTER</option>
                  <option value="YEAR">YEAR</option>
                </select>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="scrollbar-none mt-3 flex items-center gap-1 overflow-x-auto border-b border-hairline-teal pb-2 text-2xs font-bold uppercase">
              {(['SALESMAN', 'TARGETS', 'CUSTOMER', 'BRAND', 'PRODUCT GROUP', 'PRODUCT', 'AREA'] as PerformerTab[]).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPerformerTab(tab)}
                    className={cn(
                      'cursor-pointer whitespace-nowrap px-2 py-1 rounded transition-colors',
                      performerTab === tab
                        ? 'bg-brand-50 text-brand-700 font-extrabold'
                        : 'text-ink-subtle hover:text-ink',
                    )}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            {/* Performers List or Empty State */}
            <div className="mt-4 flex flex-1 flex-col justify-center">
              {!showDemoPerformers ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-xs font-semibold text-ink-muted">No data available</p>
                  <p className="mt-1 text-2xs text-ink-subtle">
                    Performance metrics refresh every 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDemoPerformers(true)}
                    className="mt-3 cursor-pointer text-2xs font-semibold text-brand-600 underline hover:text-brand-700"
                  >
                    View simulated leaderboard
                  </button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-hairline-teal">
                  {TOP_SALESMEN.map((s) => (
                    <div key={s.rank} className="flex items-center gap-3 py-2.5 text-xs">
                      <span
                        className={cn(
                          'grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white',
                          s.rank === 1 ? 'bg-amber-500' : s.rank === 2 ? 'bg-slate-400' : s.rank === 3 ? 'bg-amber-700' : 'bg-slate-300 text-slate-700',
                        )}
                      >
                        {s.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-ink">{s.name}</p>
                        <p className="text-[10px] text-ink-subtle">{s.area}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-700">{s.achieved}</p>
                        <p className="text-[10px] text-success font-semibold">{s.pct}% of {s.target}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowDemoPerformers(false)}
                    className="pt-2 text-center text-2xs text-ink-subtle hover:underline"
                  >
                    Hide simulated data
                  </button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

      </div>

      {/* ================= 3. Bottom Row: HR Snapshot + System Alerts ================= */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        
        {/* Left: HR Snapshot (8 Cols) */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs lg:col-span-8">
          <CardBody className="flex flex-col p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon name="userGroup" size={17} className="text-warning-deep" />
                <h2 className="font-bold text-base text-ink">HR Snapshot</h2>
              </div>
              <span className="text-2xs font-semibold text-ink-subtle">150 Registered Staff</span>
            </div>

            {/* Sub-content split */}
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
              
              {/* Left: 15-Day Attendance Trend (7 Cols) */}
              <div className="flex flex-col md:col-span-7">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-ink">
                    <Icon name="activity" size={13} className="text-brand-600" />
                    15-DAY TREND
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-ink-subtle">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-xs bg-brand-500" /> Present
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-xs bg-critical" /> Absent
                    </span>
                  </div>
                </div>

                {/* Trend Visualizer */}
                <div className="mt-3 flex h-32 items-end gap-1.5 rounded-lg border border-hairline-teal bg-subtle/50 p-2.5">
                  {ATTENDANCE_15_DAYS.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex h-20 w-full flex-col justify-end gap-0.5">
                        <span
                          style={{ height: `${(d.present / 150) * 100}%` }}
                          className="w-full rounded-t-xs bg-brand-500 transition-all hover:bg-brand-600"
                          title={`Day ${d.day}: ${d.present} Present`}
                        />
                        {d.absent > 0 && (
                          <span
                            style={{ height: `${(d.absent / 20) * 100}%` }}
                            className="w-full rounded-b-xs bg-critical transition-all"
                            title={`Day ${d.day}: ${d.absent} Absent`}
                          />
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-ink-subtle">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: ATTENTION List (5 Cols) */}
              <div className="flex flex-col md:col-span-5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-warning-deep uppercase">
                  <Icon name="alert" size={13} strokeWidth={2.4} className="text-warning" />
                  ATTENTION
                </p>

                <div className="mt-2.5 flex flex-col divide-y divide-hairline-teal rounded-lg border border-hairline-teal bg-surface">
                  {ATTENTION_STAFF.map((staff) => (
                    <div key={staff.name} className="flex items-center justify-between p-2.5 text-xs">
                      <div>
                        <p className="font-bold text-ink">{staff.name}</p>
                        <p className="text-[10px] text-ink-subtle">{staff.role}</p>
                      </div>
                      <Badge tone="critical" size="sm" className="font-bold tracking-wider uppercase">
                        {staff.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </CardBody>
        </Card>

        {/* Right: System Alerts (4 Cols) */}
        <Card className="flex flex-col border border-hairline-teal bg-surface shadow-xs lg:col-span-4">
          <CardBody className="flex flex-col p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon name="bell" size={17} className="text-emergency" />
                <h2 className="font-bold text-base text-ink">System Alerts</h2>
              </div>
              <div className="inline-flex rounded-md bg-subtle p-0.5 ring-1 ring-hairline-teal">
                {(['SEC', 'CO.'] as AlertTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setAlertTab(tab)}
                    className={cn(
                      'cursor-pointer rounded px-2.5 py-0.5 text-2xs font-bold transition-all',
                      alertTab === tab
                        ? 'bg-surface text-ink shadow-2xs'
                        : 'text-ink-subtle hover:text-ink',
                    )}
                  >
                    {tab === 'SEC' ? '🛡 SEC' : '🏢 CO.'}
                  </button>
                ))}
              </div>
            </div>

            {/* All Caught Up Status */}
            <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
              <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success shadow-2xs">
                <Icon name="check" size={22} strokeWidth={2.5} />
              </span>
              <p className="mt-3 text-sm font-bold text-ink">All caught up!</p>
              <p className="mt-1 text-xs text-ink-muted">
                No critical security or organizational alerts requiring action.
              </p>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  )
}
