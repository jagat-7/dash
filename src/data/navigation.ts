import type { ModuleDefinition } from './types'

/**
 * Enterprise Navigation Hierarchy according to Forward Sales CRM & ERP menu structure.
 */
export const MODULES: ModuleDefinition[] = [
  /* 1. Dashboard */
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'dashboard',
    description: 'Executive Launcher & Module Hub',
    crumb: 'Launcher',
    implemented: true,
    iconBg: '#E6F4F1',
    iconColor: '#00695C',
    links: [],
  },

  /* 2. Master */
  {
    key: 'master',
    label: 'Master',
    path: '/master',
    icon: 'business',
    description: 'Master Data Setup & Entity Registry',
    crumb: 'Master Setup',
    implemented: false,
    iconBg: '#E0F2FE',
    iconColor: '#0369A1',
    links: [
      { label: 'Company', to: '/master/company', icon: 'building' },
      { label: 'Attendance', to: '/master/attendance', icon: 'calendar' },
      { label: 'Customer', to: '/orders', icon: 'badge' },
      { label: 'Products', to: '/master/products', icon: 'box' },
      { label: 'Employee', to: '/master/employee', icon: 'userCheck' },
      { label: 'Account', to: '/master/account', icon: 'calculator' },
      { label: 'Supplier', to: '/master/supplier', icon: 'badge' },
    ],
  },

  /* 3. Account */
  {
    key: 'account',
    label: 'Account',
    path: '/account',
    icon: 'calculator',
    description: 'General Ledger, Entries, Orders & Payments',
    crumb: 'Financial Accounts',
    implemented: true,
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
    links: [
      { label: 'Entry', to: '/billing', icon: 'book' },
      { label: 'Order', to: '/account/order', icon: 'cart' },
      { label: 'Collection', to: '/billing?tab=claims', icon: 'book' },
      { label: 'Payment', to: '/billing?tab=payments', icon: 'creditCard' },
    ],
  },

  /* 4. Sales */
  {
    key: 'sales',
    label: 'Sales',
    path: '/sales',
    icon: 'cart',
    description: 'Orders, Visits, Route & Beat Plans, Targets',
    crumb: 'Sales Management',
    implemented: true,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    links: [
      { label: 'Order', to: '/sales/order', icon: 'cart' },
      { label: 'Collection', to: '/sales/collection', icon: 'cart' },
      { label: 'Visit', to: '/sales/visit', icon: 'cart' },
      { label: 'Follow Up', to: '/sales/follow-up', icon: 'cart' },
      { label: 'Price List', to: '/sales/price-list', icon: 'cart' },
      { label: 'Route Plan', to: '/sales/route-plan', icon: 'cart' },
      { label: 'Beat Plan', to: '/sales/beat-plan', icon: 'cart' },
      { label: 'Sales Target', to: '/sales/sales-target', icon: 'cart' },
      { label: 'Party Stock', to: '/sales/party-stock', icon: 'cart' },
      { label: 'Scheme', to: '/sales/scheme', icon: 'gift' },
      { label: 'Reports', to: '/reports', icon: 'reports' },
    ],
  },

  /* 5. Expenses */
  {
    key: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'receipt',
    description: 'Expense Categorization & Vouchers',
    crumb: 'Expenses Register',
    implemented: false,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    links: [
      { label: 'Expenses For', to: '/expenses/expenses-for', icon: 'cart' },
      { label: 'Expenses', to: '/expenses/list', icon: 'cart' },
    ],
  },

  /* 6. Marketing */
  {
    key: 'marketing',
    label: 'Marketing',
    path: '/marketing',
    icon: 'target',
    description: 'Campaigns, Collateral & Field Marketing',
    crumb: 'Marketing Hub',
    implemented: false,
    iconBg: '#FDF4FF',
    iconColor: '#A21CAF',
    links: [
      { label: 'Campaigns', to: '/marketing/campaigns', icon: 'cart' },
      { label: 'Collateral & Assets', to: '/marketing/collateral', icon: 'cart' },
      { label: 'Field Marketing', to: '/marketing/field', icon: 'cart' },
    ],
  },

  /* 7. Purchase */
  {
    key: 'purchase',
    label: 'Purchase',
    path: '/purchase',
    icon: 'box',
    description: 'Purchase Orders, GRN, Returns & Costing',
    crumb: 'Procurement & Purchase',
    implemented: true,
    iconBg: '#EFF6FF',
    iconColor: '#1D4ED8',
    links: [
      { label: 'Purchase', to: '/purchase/list', icon: 'gift' },
      { label: 'Purchase Addition', to: '/purchase/addition', icon: 'gift' },
      { label: 'Purchase Return', to: '/purchase/return', icon: 'cart' },
      { label: 'Purchase Order', to: '/purchase/order', icon: 'cart' },
      { label: 'GRN', to: '/purchase/grn', icon: 'cart' },
      { label: 'Costing Sheet', to: '/purchase/costing-sheet', icon: 'cart' },
    ],
  },

  /* 8. Logistics */
  {
    key: 'logistics',
    label: 'Logistics',
    path: '/logistics',
    icon: 'truck',
    description: 'Shipment Dispatch, Fleets & Warehouse Movements',
    crumb: 'Logistics & Supply',
    implemented: true,
    iconBg: '#ECFEFF',
    iconColor: '#0891B2',
    links: [
      { label: 'Dispatch & Shipments', to: '/logistics', icon: 'truck' },
      { label: 'Delivery Tracking', to: '/logistics/tracking', icon: 'box' },
      { label: 'Warehouse Transit', to: '/logistics/transit', icon: 'warehouse' },
    ],
  },

  /* 9. Lead */
  {
    key: 'lead',
    label: 'Lead',
    path: '/lead',
    icon: 'cash',
    description: 'Lead Ingestion, Pipeline & Opportunity Stage',
    crumb: 'Lead Pipeline',
    implemented: true,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    links: [
      { label: 'Lead Intake', to: '/lead', icon: 'plus' },
      { label: 'Active Pipeline', to: '/lead/pipeline', icon: 'cash' },
      { label: 'Qualified Leads', to: '/orders', icon: 'userCheck' },
    ],
  },

  /* 10. Leave Management */
  {
    key: 'leave',
    label: 'Leave Management',
    path: '/leave',
    icon: 'calendar',
    description: 'Employee Leave Requests & Balance',
    crumb: 'Leave Register',
    implemented: false,
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    links: [
      { label: 'Leave Requests', to: '/leave/requests', icon: 'calendar' },
      { label: 'Leave Balance', to: '/leave/balance', icon: 'calendar' },
      { label: 'Approvals & Policy', to: '/leave/approvals', icon: 'check' },
    ],
  },

  /* 11. Attendance */
  {
    key: 'attendance',
    label: 'Attendance',
    path: '/attendance',
    icon: 'calendar',
    description: 'Daily Check-in, Biometrics & Shift Rosters',
    crumb: 'Attendance Roster',
    implemented: false,
    iconBg: '#F0FDFA',
    iconColor: '#0D9488',
    links: [
      { label: 'Daily Attendance', to: '/attendance/daily', icon: 'calendar' },
      { label: 'Shift & Overtime', to: '/attendance/shifts', icon: 'clock' },
      { label: 'Attendance Summary', to: '/attendance/reports', icon: 'reports' },
    ],
  },

  /* 12. Payroll */
  {
    key: 'payroll',
    label: 'Payroll',
    path: '/payroll',
    icon: 'cash',
    description: 'Monthly Salary Sheets, Payslips & Deductions',
    crumb: 'Payroll Processing',
    implemented: false,
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    links: [
      { label: 'Salary Sheets', to: '/payroll/salary-sheets', icon: 'cash' },
      { label: 'Payslip Generation', to: '/payroll/payslips', icon: 'receipt' },
      { label: 'Tax & Deductions', to: '/payroll/tax', icon: 'calculator' },
    ],
  },

  /* 13. Settings */
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'settings',
    description: 'System Preferences, Company Setup & Roles',
    crumb: 'System Settings',
    implemented: true,
    iconBg: '#F8FAFC',
    iconColor: '#475569',
    links: [
      { label: 'Company Settings', to: '/settings/company', icon: 'companySettings' },
      { label: 'Theme Setting', to: '/settings/theme', icon: 'palette' },
      { label: 'Buttons and actions', to: '/settings/buttons-and-actions', icon: 'zap' },
    ],
  },
]

export const MODULES_BY_KEY = Object.fromEntries(
  MODULES.map((module) => [module.key, module]),
) as Record<string, ModuleDefinition>

/**
 * Sequential Sidebar navigation order matching the user's hierarchy.
 */
export const NAV_SECTIONS: { label: string; items: string[] }[] = [
  {
    label: 'Main Navigation',
    items: [
      'dashboard',
      'master',
      'account',
      'sales',
      'expenses',
      'marketing',
      'purchase',
      'logistics',
      'lead',
      'leave',
      'attendance',
      'payroll',
      'settings',
    ],
  },
]

/** Page title + breadcrumb per route */
export const PAGE_META: Record<string, { title: string; crumb: string }> = Object.fromEntries(
  MODULES.map((module) => [module.path, { title: module.label, crumb: module.crumb }]),
)

export function moduleForPath(pathname: string) {
  return MODULES.find((module) => pathname.startsWith(module.path))
}
