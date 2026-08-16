import type { Alert, Branch } from './types'

/**
 * Exact Branch list matching the ERP & CRM system.
 */
export const BRANCHES: Branch[] = [
  { id: 'biratnagar', code: 'BRT', name: 'Biratnagar', factor: 1.0 },
  { id: 'kathmandu', code: 'KTM', name: 'Kathmandu', factor: 1.4 },
  { id: 'dhangadi', code: 'DHN', name: 'Dhangadi', factor: 0.8 },
  { id: 'birtamod', code: 'BRM', name: 'Birtamod', factor: 0.7 },
  { id: 'hetauda', code: 'HTD', name: 'Hetauda', factor: 0.6 },
  { id: 'rajbiraj', code: 'RJB', name: 'Rajbiraj', factor: 0.5 },
  { id: 'testdd', code: 'TDD', name: 'testdd', factor: 0.4 },
  { id: 'rangeli', code: 'RNG', name: 'Rangeli', factor: 0.4 },
  { id: 'sdfsdf', code: 'SDF', name: 'sdfsdf', factor: 0.3 },
  { id: 'gfgffgfg', code: 'GFG', name: 'gfgffgfg', factor: 0.3 },
  { id: 'test', code: 'TST', name: 'TEST', factor: 0.3 },
  { id: 'test90', code: 'T90', name: 'test 90', factor: 0.2 },
]

export const FISCAL_YEARS = ['83/84', '82/83', '81/82', '80/81'] as const
export type FiscalYear = (typeof FISCAL_YEARS)[number]

export const CURRENT_USER = {
  name: 'Jagat Chaudhary',
  role: 'Chief Revenue Officer (CRO)',
  email: 'jagat.chaudhary@forward.io',
} as const

export const TODAY = {
  gregorian: 'Mon 11 Aug 2026',
  fiscal: 'Fiscal Year: 83/84',
  nepaliDate: '2083-04-30',
} as const

export const ALERTS: Alert[] = [
  {
    id: 'deal-closing',
    level: 'critical',
    title: 'Enterprise order ($450k) closing in 48h',
    detail: 'Acme Global — Delivery clearance for Biratnagar Branch',
  },
  {
    id: 'stock-low',
    level: 'warning',
    title: '4 hardware SKUs below safety stock',
    detail: 'Edge IoT Gateway, Server Rack X9, Fiber Hub in Kathmandu',
  },
  {
    id: 'billing-batch',
    level: 'info',
    title: 'Monthly sales billing cycle generated',
    detail: '142 invoices ready for release across branches',
  },
]
