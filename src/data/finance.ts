import type { Claim, Drug, Invoice, Payment, SKUItem } from './types'

export const INVOICES: Invoice[] = [
  {
    id: 'INV-2026-9041',
    account: 'Acme Global Technologies',
    patient: 'Acme Global Technologies',
    branch: 'Biratnagar',
    department: 'Enterprise Platform',
    amount: 160000,
    status: 'Paid',
    date: '11 Aug',
  },
  {
    id: 'INV-2026-9040',
    account: 'Nexus Cloud Systems',
    patient: 'Nexus Cloud Systems',
    branch: 'Biratnagar',
    department: 'Dedicated Cluster',
    amount: 120000,
    status: 'Partial',
    date: '11 Aug',
  },
  {
    id: 'INV-2026-9039',
    account: 'Horizon Retail Holdings',
    patient: 'Horizon Retail Holdings',
    branch: 'Kathmandu',
    department: 'Omnichannel ERP',
    amount: 60000,
    status: 'Paid',
    date: '10 Aug',
  },
  {
    id: 'INV-2026-9038',
    account: 'BioGen Innovations',
    patient: 'BioGen Innovations',
    branch: 'Kathmandu',
    department: 'Life Sciences Suite',
    amount: 286000,
    status: 'In Review',
    date: '10 Aug',
  },
  {
    id: 'INV-2026-9037',
    account: 'Starlight Media Network',
    patient: 'Starlight Media Network',
    branch: 'Dhangadi',
    department: 'Media Delivery Hub',
    amount: 47500,
    status: 'Unpaid',
    date: '08 Aug',
  },
  {
    id: 'INV-2026-9036',
    account: 'Vertex Logistics & Supply',
    patient: 'Vertex Logistics & Supply',
    branch: 'Dhangadi',
    department: 'Supply Chain Engine',
    amount: 95000,
    status: 'Paid',
    date: '08 Aug',
  },
]

/** Invoices breakdown in detail panel */
export function invoiceLines(invoice: Invoice) {
  const subscription = Math.round(invoice.amount * 0.65)
  const infrastructure = Math.round(invoice.amount * 0.22)
  return [
    { label: 'Platform Core & Enterprise Seats', amount: subscription },
    { label: 'Cloud Infrastructure & High-Compute Nodes', amount: infrastructure },
    { label: 'Enterprise SLA & Support Escalation', amount: invoice.amount - subscription - infrastructure },
  ]
}

export const DIGITAL_WALLETS = ['Wire Transfer', 'Corporate ACH', 'Stripe Enterprise', 'Corporate Card'] as const

export const CLAIMS: Claim[] = [
  { id: 'SLA-4471', patient: 'BioGen Innovations', branch: 'APAC Regional Center', amount: 286000, submitted: '10 Aug', status: 'Under review' },
  { id: 'SLA-4470', patient: 'Vertex Logistics', branch: 'EMEA Operations Hub', amount: 95000, submitted: '08 Aug', status: 'Approved' },
  { id: 'SLA-4469', patient: 'Starlight Media', branch: 'EMEA Operations Hub', amount: 47500, submitted: '07 Aug', status: 'Approved' },
  { id: 'SLA-4468', patient: 'Acme Global Tech', branch: 'North America (HQ)', amount: 160000, submitted: '05 Aug', status: 'Queried' },
  { id: 'SLA-4467', patient: 'Nexus Cloud Systems', branch: 'North America (HQ)', amount: 120000, submitted: '04 Aug', status: 'Paid out' },
]

export const PAYMENTS: Payment[] = [
  {
    id: 'PAY-9917',
    invoice: 'INV-2026-9041',
    account: 'Acme Global Technologies',
    patient: 'Acme Global Technologies',
    amount: 160000,
    mode: 'Wire Transfer',
    receivedAt: 'J.P. Morgan Corporate Clearing · NA-HQ',
    time: 'Today 10:42',
  },
  {
    id: 'PAY-9916',
    invoice: 'INV-2026-9039',
    account: 'Horizon Retail Holdings',
    patient: 'Horizon Retail Holdings',
    amount: 60000,
    mode: 'ACH',
    receivedAt: 'Corporate Settlement Desk · APAC',
    time: 'Today 09:15',
  },
  {
    id: 'PAY-9915',
    invoice: 'INV-2026-9036',
    account: 'Vertex Logistics & Supply',
    patient: 'Vertex Logistics & Supply',
    amount: 95000,
    mode: 'Stripe',
    receivedAt: 'Automated Global Gateway · EMEA',
    time: 'Yesterday 18:03',
  },
  {
    id: 'PAY-9914',
    invoice: 'INV-2026-9034',
    account: 'Quantum CyberSec',
    patient: 'Quantum CyberSec',
    amount: 52500,
    mode: 'Corporate Card',
    receivedAt: 'Online Enterprise Billing Portal',
    time: 'Yesterday 14:27',
  },
]

export const INVENTORY_FILTERS = ['All', 'Low stock', 'Expiring soon'] as const
export const PHARMACY_FILTERS = INVENTORY_FILTERS

export const INVENTORY_SKUS: SKUItem[] = [
  { id: 'SKU-01', sku: 'SRV-X9-RACK', name: 'Enterprise Server Node X9 (Dual 64-Core Xeon)', category: 'High-Compute Hardware', stock: 124, reorderLevel: 50, unitPrice: 8400, location: 'Warehouse A · Rack 12' },
  { id: 'SKU-02', sku: 'IOT-GW-5G', name: 'Industrial Edge IoT Gateway 5G Ultra-Rugged', category: 'Edge Telemetry', stock: 32, reorderLevel: 80, unitPrice: 1250, location: 'Warehouse B · Bin 04' },
  { id: 'SKU-03', sku: 'OPT-TRX-100G', name: '100G QSFP28 Fiber Optic Transceiver Module', category: 'Optical Networking', stock: 14, reorderLevel: 40, unitPrice: 620, location: 'Warehouse A · Clean Rm' },
  { id: 'SKU-04', sku: 'ENC-HSM-PCI', name: 'FIPS 140-3 Hardware Security Module (HSM)', category: 'Security Appliances', stock: 210, reorderLevel: 60, unitPrice: 4800, location: 'Secure Vault · NA-HQ' },
  { id: 'SKU-05', sku: 'PLC-MOD-IND', name: 'Programmable Logic Controller (PLC) Automation Unit', category: 'Industrial ERP Hardware', stock: 41, reorderLevel: 30, unitPrice: 3100, location: 'Warehouse C · Bay 02' },
  { id: 'SKU-06', sku: 'PWR-UPS-10K', name: '10kVA Modular Rackmount Smart UPS Battery Bank', category: 'Power & Infrastructure', stock: 8, reorderLevel: 15, unitPrice: 5400, location: 'Heavy Storage Deck' },
  { id: 'SKU-07', sku: 'STR-NVME-30T', name: '30.72TB Enterprise U.3 NVMe SSD Storage Blade', category: 'Storage Systems', stock: 156, reorderLevel: 50, unitPrice: 2200, location: 'Warehouse A · Shelf 09' },
]

export const PRODUCTS = INVENTORY_SKUS

export const DRUGS: Drug[] = INVENTORY_SKUS.map((item) => ({
  name: item.name,
  category: item.category,
  stock: item.stock,
  reorderLevel: item.reorderLevel,
  expiry: 'Q4 FY27',
}))

export function stockLevel(drug: Drug | SKUItem) {
  return Math.min(100, Math.round((drug.stock / (drug.reorderLevel * 2)) * 100))
}

/* ------------------------------------------------------------- Insights */

export const REVENUE_BY_MONTH = [
  { label: 'Sep', value: 310 },
  { label: 'Oct', value: 360 },
  { label: 'Nov', value: 340 },
  { label: 'Dec', value: 410 },
  { label: 'Jan', value: 380 },
  { label: 'Feb', value: 350 },
  { label: 'Mar', value: 440 },
  { label: 'Apr', value: 470 },
  { label: 'May', value: 430 },
  { label: 'Jun', value: 490 },
  { label: 'Jul', value: 520 },
  { label: 'Aug', value: 230 },
]

export const DAILY_ORDERS_LAST_7_DAYS = [
  { label: 'Mon', value: 312 },
  { label: 'Tue', value: 298 },
  { label: 'Wed', value: 341 },
  { label: 'Thu', value: 376 },
  { label: 'Fri', value: 355 },
  { label: 'Sat', value: 388 },
  { label: 'Sun', value: 412 },
]

export const OPD_LAST_7_DAYS = DAILY_ORDERS_LAST_7_DAYS

export const PAYER_MIX = [
  { label: 'Enterprise ARR', value: 58 },
  { label: 'Mid-Market SaaS', value: 24 },
  { label: 'Strategic Services', value: 12 },
  { label: 'Hardware & Edge', value: 6 },
]

export const TOP_DEPARTMENTS = [
  { name: 'Enterprise Cloud Platform', revenue: 4860000 },
  { name: 'Global Supply Chain & ERP', revenue: 3420000 },
  { name: 'Dedicated High-Compute Clusters', revenue: 2310000 },
  { name: 'Professional Services & Delivery', revenue: 1980000 },
  { name: 'Security Appliances & Edge Hardware', revenue: 1640000 },
]
