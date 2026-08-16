import { Badge, type Tone } from '@/components/ui'
import type {
  AccountStatus,
  ClaimStatus,
  InvoiceStatus,
  LabPriority,
  LabStatus,
  OrderStatus,
  PatientStatus,
} from '@/data/types'

/**
 * Single mapping from domain status -> visual tone.
 */
const TONES: Record<string, Tone> = {
  // Accounts / CRM
  Enterprise: 'brand',
  Growth: 'success',
  Active: 'success',
  Prospect: 'info',
  Onboarding: 'warning',
  'Churn Risk': 'critical',
  Admitted: 'brand',
  'In consultation': 'success',
  'Under observation': 'warning',
  Observation: 'warning',
  'In surgery': 'brand',
  Discharged: 'neutral',
  // Invoice & Billing
  Paid: 'success',
  Partial: 'warning',
  'In Review': 'brand',
  'Insurance pending': 'brand',
  Unpaid: 'critical',
  // Claims / SLAs
  Approved: 'success',
  'Under review': 'brand',
  Queried: 'critical',
  'Paid out': 'neutral',
  // Work Orders & QA
  'Sample collected': 'brand',
  Processing: 'warning',
  Completed: 'success',
  Abnormal: 'critical',
  // Orders
  APPROVED: 'success',
  PENDING: 'warning',
  VERIFIED: 'violet',
  DECLINED: 'critical',
  HOLD: 'neutral',
  Pending: 'warning',
  'In progress': 'brand',
  // Stock
  'In stock': 'success',
  'Low stock': 'warning',
  'Expiring soon': 'critical',
}

type KnownStatus =
  | AccountStatus
  | PatientStatus
  | InvoiceStatus
  | ClaimStatus
  | LabStatus
  | OrderStatus
  | 'In stock'
  | 'Low stock'
  | 'Expiring soon'
  | string

export function StatusBadge({ status, className }: { status: KnownStatus; className?: string }) {
  return <Badge tone={TONES[status] ?? 'neutral'} className={className}>{status}</Badge>
}

const PRIORITY_CLASS: Record<string, string> = {
  STAT: 'text-critical',
  Critical: 'text-critical',
  Urgent: 'text-warning',
  Routine: 'text-ink-subtle',
}

/** Priority reads as weight + color, and always carries its word. */
export function PriorityLabel({ priority }: { priority: LabPriority | string }) {
  return <span className={`text-xs font-bold ${PRIORITY_CLASS[priority] ?? 'text-ink-subtle'}`}>{priority}</span>
}
