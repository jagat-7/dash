import type { IconName } from '@/components/ui'

export interface Branch {
  id: string
  code: string
  name: string
  /** Scales network-wide figures down to a single branch/entity. */
  factor: number
}

/* ------------------------------------------------------------- CRM: Accounts */

export type AccountStatus =
  | 'Enterprise'
  | 'Growth'
  | 'Active'
  | 'Prospect'
  | 'Onboarding'
  | 'Churn Risk'
  | 'Admitted'
  | 'In consultation'
  | 'Under observation'
  | 'Discharged'
  | string

export type PatientStatus = AccountStatus

export interface ContactPerson {
  name: string
  role: string
  email: string
  phone: string
  isPrimary?: boolean
}

export interface Account {
  id: string
  name: string
  industry: string
  tier: 'Tier 1 Global' | 'Enterprise' | 'Mid-Market' | 'Strategic' | 'Growth' | string
  arr: number
  primaryContact: ContactPerson
  location: string
  status: AccountStatus
  branch: string
  lastActive: string
  // Compatibility fields
  age?: number
  sex?: 'F' | 'M' | string
  phone?: string
  lastVisit?: string
}

export type Patient = Account

export interface Deal {
  id: string
  title: string
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Contract Review' | 'Closed Won' | 'Renewal' | string
  value: number
  probability: number
  closeDate: string
  owner: string
}

export interface MetricItem {
  label: string
  value: string
  unit: string
  trend?: 'up' | 'down' | 'neutral'
  abnormal?: boolean
}

export type Vital = MetricItem

export interface ContractSLA {
  tier: '24/7 Platinum' | 'Mission Critical' | 'Enterprise Gold' | 'Standard SLA' | string
  uptime: string
  responseTime: string
  renewalDate: string
  arr: number
  accountManager: string
  status: 'Active' | 'Under Review' | 'Renewal Due' | 'Expired' | string
}

export interface SupportTicket {
  id: string
  title: string
  priority: 'P1 - Critical' | 'P2 - High' | 'P3 - Medium' | 'P4 - Low' | string
  status: 'Open' | 'Investigating' | 'In Progress' | 'Resolved' | string
  slaTarget: string
  created: string
  assignee: string
}

export interface ActivityEvent {
  date: string
  title: string
  where: string
  note: string
  author?: string
}

export type Encounter = ActivityEvent

export interface Stakeholder {
  name: string
  role: string
  contact: string
  icon: IconName
}

export type CareTeamMember = Stakeholder

export interface AccountHealthScore {
  total: number
  nps: number
  csat: number
  adoptionPct: number
  parameters: {
    label: string
    value: string
    unit: string
    score: number
    icon: IconName
  }[]
  takenAt: string
  by: string
}

export type EwsScore = AccountHealthScore

export interface HealthTrendSeries {
  label: string
  unit: string
  icon: IconName
  points: { label: string; value: number }[]
  low: number
  high: number
}

export type VitalSeries = HealthTrendSeries

export type DoseState = 'given' | 'due' | 'missed' | 'held' | 'scheduled'
export type MedDoseState = DoseState

export interface AccountScheduleRow {
  service: string
  detail: string
  category: string
  deliveries: { time: string; state: 'completed' | 'scheduled' | 'delayed' | 'in_review'; by?: string }[]
}

export type MarRow = {
  medication: string
  dose: string
  route: string
  doses: { time: string; state: DoseState; by?: string }[]
}

export interface SoapNote {
  title: string
  author: string
  role?: string
  date: string
  where?: string
  time?: string
  kind?: string
  body?: string
  content?: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  [key: string]: any
}

export type ClinicalNote = SoapNote

export interface AccountProfileDetail {
  industrySegment: string
  contractTier: string
  onboardingDate: string
  contractLength: string
  executiveSponsor: string
  billingCadence: 'Annual Upfront' | 'Quarterly' | 'Monthly Net-30' | string
  slaLevel: string
  securityCompliance: string
  integrationStatus: string
  // Compatibility fields
  ward?: string
  bed?: string
  admitted?: string
  lengthOfStay?: string
  attending?: string
  codeStatus?: 'Full code' | 'DNR' | 'Not documented'
  diet?: string
  isolation?: string
  mobility?: string
}

export type AdmissionDetail = AccountProfileDetail

export interface RevenueBreakdown {
  subscription: number
  professionalServices: number
  usageOverage: number
  hourly: number[]
  intake?: number
  output?: number
}

export type FluidBalance = {
  intake?: number
  output?: number
  current?: number
  target?: number
  subscription?: number
  professionalServices?: number
  usageOverage?: number
  hourly: number[]
  [key: string]: any
}

export interface SubscribedService {
  name: string
  frequency: string
  route: string
  prescriber?: string
  dose?: string
  status?: string
  since?: string
  [key: string]: any
}

export type Medication = SubscribedService

export interface ComplianceAuditResult {
  test: string
  value: string | number
  reference?: string
  date: string
  flag?: string
}

export type LabResult = ComplianceAuditResult

export interface ArchitectureStudy {
  id: string
  study: string
  modality: string
  report: string
  requested: string
  verified?: string
  status?: string
  [key: string]: any
}

export type ImagingStudy = ArchitectureStudy

export interface WorkOrderAssignment {
  order: string
  type: string
  by: string
  status: string
  date?: string
}

export type ClinicalOrder = WorkOrderAssignment

export interface CustomerRecord extends Account {
  taxId: string
  tags: string[]
  keyObjectives: string[]
  metrics: MetricItem[]
  deals: Deal[]
  tickets: SupportTicket[]
  activities: ActivityEvent[]
  invoices: Invoice[]
  team: Stakeholder[]
  health: AccountHealthScore
  trends: HealthTrendSeries[]
  sla: ContractSLA
  profile: AccountProfileDetail
  revenueMix: RevenueBreakdown
  // Compatibility properties
  bloodGroup?: string
  allergies?: string[]
  problems?: string[]
  vitals?: Vital[]
  medications?: SubscribedService[]
  labs?: LabResult[]
  encounters?: Encounter[]
  orders?: ClinicalOrder[]
  nursingOrders?: any[]
  notes?: SoapNote[]
  ews?: EwsScore
  mar?: MarRow[]
  careTeam?: CareTeamMember[]
  imaging?: ArchitectureStudy[]
  admission?: AdmissionDetail
  fluids?: FluidBalance
}

export type PatientRecord = CustomerRecord

/* -------------------------------------------------------- ERP: Operations */

export type CapacityState = 'occupied' | 'available' | 'maintenance'
export type BedState = CapacityState

export interface CapacityBay {
  id: string
  ward: string
  state: CapacityState
  project: string | null
  patient?: string | null
  type: string
  manager: string
  attending?: string
  diagnosis?: string
  utilization: string
  lengthOfStay?: string
}

export type Bed = CapacityBay

export type WorkOrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Abnormal' | 'Sample collected' | 'Active' | string
export type LabStatus = WorkOrderStatus
export type OrderStatus = WorkOrderStatus

export type WorkOrderPriority = 'STAT' | 'Urgent' | 'Routine' | 'Critical'
export type LabPriority = WorkOrderPriority

export interface WorkOrder {
  id: string
  account: string
  patient?: string
  title: string
  test?: string
  branch: string
  priority: WorkOrderPriority
  status: WorkOrderStatus
}

export type LabOrder = WorkOrder

/* ---------------------------------------------------- Supply Chain & Finance */

export interface SKUItem {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  reorderLevel: number
  unitPrice: number
  location: string
  expiry?: string
}

export type Drug = {
  name: string
  category: string
  stock: number
  reorderLevel: number
  expiry: string
}

export type InvoiceStatus = 'Paid' | 'Partial' | 'In Review' | 'Unpaid' | 'Insurance pending' | string

export interface Invoice {
  id: string
  account: string
  patient?: string
  branch: string
  department: string
  amount: number
  status: InvoiceStatus
  date: string
}

export type ClaimStatus = 'Approved' | 'Under review' | 'Queried' | 'Paid out' | string

export interface Claim {
  id: string
  patient: string
  branch: string
  amount: number
  submitted: string
  status: ClaimStatus
}

export interface Payment {
  id: string
  invoice: string
  account: string
  patient?: string
  amount: number
  mode: 'Wire Transfer' | 'ACH' | 'Corporate Card' | 'Stripe' | 'Cash' | 'Card' | 'eSewa' | 'Khalti' | 'ConnectIPS' | string
  receivedAt: string
  time: string
}

/* -------------------------------------------------------------- System Types */

export type AlertLevel = 'critical' | 'warning' | 'info'

export interface Alert {
  id: string
  level: AlertLevel
  title: string
  detail: string
}

export interface ModuleDefinition {
  key: string
  label: string
  path: string
  icon: IconName
  description: string
  crumb: string
  implemented: boolean
  iconBg: string
  iconColor: string
  links: { label: string; to: string; icon: IconName }[]
}
