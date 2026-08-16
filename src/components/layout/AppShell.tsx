import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ShortcutDock } from './ShortcutDock'
import { RegistrationModal } from '@/components/domain'
import { PAGE_META } from '@/data/navigation'
import { BRAND } from '@/data/brand'
import { useAppStore } from '@/store/useAppStore'

function pageMeta(pathname: string) {
  if (pathname === '/' || pathname === '/dashboard' || pathname === '/launcher') {
    return { title: 'Executive Dashboard', crumb: 'Dashboard / Overview' }
  }
  if (pathname.startsWith('/patients/') || pathname.startsWith('/customers/') || pathname.startsWith('/orders/')) {
    return { title: 'Customer 360', crumb: 'Accounts / Customer 360' }
  }
  if (pathname === '/settings/theme' || pathname === '/settings') {
    return { title: 'Theme Setting', crumb: 'Settings / Theme Setting' }
  }
  if (pathname.startsWith('/settings/company')) {
    return { title: 'Company Settings', crumb: 'Settings / Company Settings' }
  }
  if (pathname.startsWith('/settings/buttons-and-actions')) {
    return { title: 'Buttons and Actions', crumb: 'Settings / Buttons & Actions' }
  }
  if (pathname.startsWith('/settings')) {
    return { title: 'Settings', crumb: 'Settings' }
  }
  const match = Object.keys(PAGE_META).find((path) => pathname.startsWith(path))
  return match ? PAGE_META[match]! : { title: BRAND.name, crumb: 'Console' }
}

/**
 * Authenticated shell: nav rail + topbar + scrolling content well.
 * Screens render into the `Outlet` and never own chrome themselves.
 */
export function AppShell() {
  const location = useLocation()
  const authenticated = useAppStore((state) => state.authenticated)
  const registrationOpen = useAppStore((state) => state.registrationOpen)
  const setRegistrationOpen = useAppStore((state) => state.setRegistrationOpen)

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const { title, crumb } = pageMeta(location.pathname)

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} crumb={crumb} />
        <main
          id="content"
          /* `lg:pr-10` keeps the shortcut dock's right-edge tab off the content
             it would otherwise sit on top of. */
          className="scrollbar-slim flex-1 overflow-y-auto bg-canvas px-3 py-4 sm:px-5.5 sm:py-5 lg:pr-10"
        >
          {/* Keyed so each screen replays its entrance animation. */}
          <div key={location.pathname} className="animate-fade-up flex h-full min-h-0 flex-1 flex-col">
            <Outlet />
          </div>
        </main>
      </div>

      <ShortcutDock />
      <RegistrationModal open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
    </div>
  )
}
