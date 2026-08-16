import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import {
  BillingPage,
  DashboardPage,
  DesignSystemPage,
  IpdPage,
  LaboratoryPage,
  LauncherPage,
  LoginPage,
  ModulePlaceholderPage,
  OrdersPage,
  ReportsPage,
  SettingsPage,
} from '@/pages'
import { MODULES } from '@/data/navigation'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Component gallery + login options — open without signing in. */}
      <Route path="/design" element={<DesignSystemPage />} />

      {/* Everything below shares the nav rail + topbar shell. */}
      <Route element={<AppShell />}>
        {/* Core Main Views */}
        <Route path="/" element={<LauncherPage />} />
        <Route path="/launcher" element={<LauncherPage />} />
        <Route path="/dashboard" element={<LauncherPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:patientId" element={<OrdersPage />} />
        <Route path="/order" element={<OrdersPage />} />
        <Route path="/order/:patientId" element={<OrdersPage />} />
        <Route path="/sales/order" element={<OrdersPage />} />
        <Route path="/account/order" element={<OrdersPage />} />
        <Route path="/patients" element={<OrdersPage />} />
        <Route path="/patients/:patientId" element={<OrdersPage />} />
        <Route path="/accounts" element={<OrdersPage />} />
        <Route path="/accounts/:patientId" element={<OrdersPage />} />
        <Route path="/account" element={<BillingPage />} />
        <Route path="/account/*" element={<BillingPage />} />
        <Route path="/sales" element={<DashboardPage />} />
        <Route path="/sales/*" element={<DashboardPage />} />
        <Route path="/purchase" element={<ModulePlaceholderPage />} />
        <Route path="/purchase/*" element={<ModulePlaceholderPage />} />
        <Route path="/opd" element={<ModulePlaceholderPage />} />
        <Route path="/lead" element={<ModulePlaceholderPage />} />
        <Route path="/lead/*" element={<ModulePlaceholderPage />} />
        <Route path="/leads" element={<ModulePlaceholderPage />} />
        <Route path="/ipd" element={<IpdPage />} />
        <Route path="/logistics" element={<IpdPage />} />
        <Route path="/logistics/*" element={<IpdPage />} />
        <Route path="/capacity" element={<IpdPage />} />
        <Route path="/lab" element={<LaboratoryPage />} />
        <Route path="/workorders" element={<LaboratoryPage />} />
        <Route path="/pharmacy" element={<ModulePlaceholderPage />} />
        <Route path="/inventory" element={<ModulePlaceholderPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />

        {/* Master Data Setup */}
        <Route path="/master" element={<ModulePlaceholderPage />} />
        <Route path="/master/*" element={<ModulePlaceholderPage />} />

        {/* Other Registered Modules & Sub-routes */}
        {MODULES.filter((module) => !module.implemented).map((module) => (
          <Route key={module.key} path={`${module.path}/*`} element={<ModulePlaceholderPage />} />
        ))}
        {MODULES.filter((module) => !module.implemented).map((module) => (
          <Route key={`root-${module.key}`} path={module.path} element={<ModulePlaceholderPage />} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
