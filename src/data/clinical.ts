import type { CapacityBay, CapacityState, WorkOrder } from './types'

const WARDS: [string, number][] = [
  ['Cluster A (Compute)', 8],
  ['Assembly Pod B', 8],
  ['Logistics Bay East', 14],
  ['QA Test Cell 4', 14],
]

export const WARD_FILTERS = ['All', 'Cluster A (Compute)', 'Assembly Pod B', 'Logistics Bay East', 'QA Test Cell 4'] as const

const STATE_CYCLE: CapacityState[] = [
  'occupied',
  'occupied',
  'available',
  'occupied',
  'maintenance',
  'occupied',
  'available',
  'occupied',
]

const OCCUPANT_NAMES = [
  'Acme Global Tech',
  'Nexus Cloud',
  'Vertex Supply',
  'BioGen Innovations',
  'Horizon Retail',
  'Starlight Media',
  'AeroDynamics',
  'Quantum Cyber',
]

const PROJECT_TYPES = [
  'ERP Dedicated Node',
  'Multi-Region VPC',
  'Telemetry Pipeline',
  'Supply Chain Hub',
  'Automated QA Run',
  'Edge IoT Cluster',
  'Global DB Migration',
  'Security Audit Node',
]

const MANAGERS = ['Marcus Bennett', 'Dr. Sarah Koirala', 'Elena Rostova', 'David Chen']
const ALLOCATION_PERIODS = ['18 mos', '24 mos', '6 mos', '12 mos', '36 mos']

/** Deterministic operations resource capacity layout */
export const BEDS: CapacityBay[] = WARDS.flatMap(([ward, count], wardIndex) =>
  Array.from({ length: count }, (_, slot): CapacityBay => {
    const number = slot + 1
    const state = STATE_CYCLE[(wardIndex * 7 + number * 3) % 8]!
    const accountName = state === 'occupied' ? OCCUPANT_NAMES[(wardIndex + number) % 8]! : null
    const projectType = PROJECT_TYPES[(wardIndex * 3 + number) % 8]!
    const managerName = MANAGERS[(wardIndex + number) % 4]!
    const period = ALLOCATION_PERIODS[(wardIndex + number) % 5]!
    return {
      id: `${ward.split(' ')[0]}-${String(number).padStart(2, '0')}`,
      ward,
      state,
      project: accountName,
      patient: accountName, // compatibility alias
      type: projectType,
      manager: managerName,
      attending: managerName, // compatibility alias
      diagnosis: projectType, // compatibility alias
      utilization: state === 'occupied' ? `${Math.round(75 + ((number * 7) % 23))}%` : '0%',
      lengthOfStay: period, // compatibility alias
    }
  }),
)

export const BED_COUNTS = {
  occupied: BEDS.filter((bed) => bed.state === 'occupied').length,
  available: BEDS.filter((bed) => bed.state === 'available').length,
  maintenance: BEDS.filter((bed) => bed.state === 'maintenance').length,
  total: BEDS.length,
}

export const OCCUPANCY_PCT = Math.round((BED_COUNTS.occupied / BED_COUNTS.total) * 100)

export const WARD_OCCUPANCY = [
  { name: 'Compute Clusters', occupancy: 91 },
  { name: 'Supply Chain Bays', occupancy: 78 },
  { name: 'Assembly Lines', occupancy: 84 },
  { name: 'QA Test Labs', occupancy: 65 },
  { name: 'Logistics Docks', occupancy: 58 },
]

export const LAB_FILTERS = ['All', 'Processing', 'Completed', 'Abnormal'] as const

export const LAB_ORDERS: WorkOrder[] = [
  {
    id: 'WO-8841',
    account: 'Acme Global Technologies',
    patient: 'Acme Global Technologies',
    title: 'Multi-Region VPC Latency Audit',
    test: 'Multi-Region VPC Latency Audit',
    branch: 'Biratnagar',
    priority: 'STAT',
    status: 'Processing',
  },
  {
    id: 'WO-8840',
    account: 'BioGen Innovations',
    patient: 'BioGen Innovations',
    title: 'SOC 2 Type II Security Compliance Scan',
    test: 'SOC 2 Type II Security Compliance Scan',
    branch: 'Kathmandu',
    priority: 'Critical',
    status: 'Processing',
  },
  {
    id: 'WO-8839',
    account: 'Vertex Logistics & Supply',
    patient: 'Vertex Logistics & Supply',
    title: 'Warehouse EDI Protocol Integration QA',
    test: 'Warehouse EDI Protocol Integration QA',
    branch: 'Dhangadi',
    priority: 'Urgent',
    status: 'Sample collected',
  },
  {
    id: 'WO-8838',
    account: 'Horizon Retail Holdings',
    patient: 'Horizon Retail Holdings',
    title: 'Automated Invoice Reconciliation Test',
    test: 'Automated Invoice Reconciliation Test',
    branch: 'Kathmandu',
    priority: 'Routine',
    status: 'Completed',
  },
  {
    id: 'WO-8837',
    account: 'Nexus Cloud Systems',
    patient: 'Nexus Cloud Systems',
    title: 'ERP Ledger High-Throughput Load Benchmark',
    test: 'ERP Ledger High-Throughput Load Benchmark',
    branch: 'Biratnagar',
    priority: 'Routine',
    status: 'Completed',
  },
  {
    id: 'WO-8836',
    account: 'Starlight Media Network',
    patient: 'Starlight Media Network',
    title: 'CDN Edge Routing Error Investigation',
    test: 'CDN Edge Routing Error Investigation',
    branch: 'Dhangadi',
    priority: 'Urgent',
    status: 'Abnormal',
  },
]

export const ADMISSIONS = [
  {
    id: 'LEAD-981',
    account: 'Acme Global Technologies',
    patient: 'Acme Global Technologies',
    branch: 'Biratnagar',
    department: 'Enterprise Platform',
    doctor: 'Jagat Chaudhary',
    status: 'Enterprise' as const,
  },
  {
    id: 'LEAD-980',
    account: 'Vertex Logistics',
    patient: 'Vertex Logistics',
    branch: 'Dhangadi',
    department: 'Global Supply Chain',
    doctor: 'Marcus Bennett',
    status: 'Active' as const,
  },
  {
    id: 'LEAD-979',
    account: 'BioGen Innovations',
    patient: 'BioGen Innovations',
    branch: 'Kathmandu',
    department: 'Life Sciences Suite',
    doctor: 'Dr. Arthur Chen',
    status: 'Enterprise' as const,
  },
  {
    id: 'LEAD-978',
    account: 'Horizon Retail',
    patient: 'Horizon Retail',
    branch: 'Kathmandu',
    department: 'Omnichannel ERP',
    doctor: 'David Chen',
    status: 'Growth' as const,
  },
  {
    id: 'LEAD-977',
    account: 'Starlight Media',
    patient: 'Starlight Media',
    branch: 'Dhangadi',
    department: 'Media & Billing',
    doctor: 'Elena Rostova',
    status: 'Onboarding' as const,
  },
]

export const LEADS = ADMISSIONS

export const PRODUCT_SUITES = [
  'Enterprise SaaS Suite',
  'Global Supply Chain & ERP',
  'Dedicated Cloud Cluster',
  'Professional Services & Integrations',
] as const

export const OPD_DEPARTMENTS = PRODUCT_SUITES

export const SALES_EXECUTIVES = [
  'Jagat Chaudhary (CRO)',
  'Marcus Bennett (VP Success)',
  'Dr. Sarah Koirala (Lead Architect)',
  'Elena Rostova (VP Eng)',
] as const

export const OPD_DOCTORS = SALES_EXECUTIVES

export const PAYMENT_MODES = [
  'Wire Transfer',
  'ACH Corporate Net-30',
  'Stripe Enterprise Gateway',
  'Corporate Card',
] as const

/** Pipeline velocity by weekday × hour slot */
export const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const HEATMAP_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'] as const
export const OPD_LOAD = [
  [44, 78, 61, 46, 53, 28],
  [39, 62, 58, 44, 50, 25],
  [48, 84, 65, 51, 56, 31],
  [52, 91, 69, 54, 60, 34],
  [49, 86, 67, 50, 58, 32],
  [57, 99, 78, 61, 64, 37],
]

/** Inbound Deal Lead Sources by month */
export const ADMISSION_SOURCES = [
  { label: 'Outbound Enterprise' },
  { label: 'Inbound Inquiries' },
  { label: 'Partner Channel' },
]

export const ADMISSIONS_BY_MONTH = [
  { label: 'Mar', values: [188, 142, 65] },
  { label: 'Apr', values: [204, 158, 72] },
  { label: 'May', values: [196, 164, 68] },
  { label: 'Jun', values: [228, 179, 84] },
  { label: 'Jul', values: [242, 191, 92] },
  { label: 'Aug', values: [168, 134, 58] },
]
