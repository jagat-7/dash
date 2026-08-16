import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CountBadge, Icon, Logo } from '@/components/ui'
import { cn } from '@/lib/cn'
import { MODULES, MODULES_BY_KEY, NAV_SECTIONS } from '@/data/navigation'
import { BRAND } from '@/data/brand'
import { useAppStore, useBranch } from '@/store/useAppStore'
import { useResolvedTheme, useThemeStore } from '@/store/useTheme'

function Brand({ expanded }: { expanded: boolean }) {
  return (
    <Link
      to="/"
      className="flex h-topbar shrink-0 items-center gap-2.5 overflow-hidden px-3.5"
      title="Back to dashboard"
    >
      <Logo
        variant="bare"
        size={22}
        showName={false}
        className="shrink-0 text-white"
      />
      <span
        className={cn(
          'text-md font-bold tracking-tight whitespace-nowrap text-white transition-opacity duration-150',
          expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {BRAND.fullName}
      </span>
    </Link>
  )
}

interface NavContentProps {
  expanded: boolean
  onNavigate?: () => void
}

function NavContent({ expanded, onNavigate }: NavContentProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const activeKey =
    MODULES.find((module) => {
      if (module.key === 'dashboard') {
        return (
          location.pathname === '/' ||
          location.pathname === '/dashboard' ||
          location.pathname === '/launcher'
        )
      }
      return (
        module.links.some((link) => {
          const [basePath] = link.to.split('?')
          return location.pathname === basePath || (basePath !== '/' && location.pathname.startsWith(basePath))
        }) || (module.path !== '/' && location.pathname.startsWith(module.path))
      )
    })?.key ?? null

  const [openKey, setOpenKey] = useState<string | null>(activeKey || 'sales')

  // Keep the open group in step with the route, including on first paint.
  useEffect(() => {
    if (activeKey && activeKey !== 'dashboard') setOpenKey(activeKey)
  }, [activeKey])

  return (
    <nav aria-label="Modules" className="scrollbar-rail flex-1 overflow-x-hidden overflow-y-auto px-2 py-2.5">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="mb-1.5">
          <ul className="flex flex-col gap-1">
            {section.items.map((key) => {
              const module = MODULES_BY_KEY[key]
              if (!module) return null
              const isDashboard = module.key === 'dashboard'
              const active = activeKey === key
              const submenuOpen = openKey === key && expanded

              if (isDashboard) {
                return (
                  <li key={key} className="mb-px">
                    <NavLink
                      to="/"
                      title={module.label}
                      onClick={() => {
                        onNavigate?.()
                      }}
                      className={cn(
                        'flex h-10 items-center gap-2.5 rounded-lg pr-2 pl-2.5 transition-all duration-150',
                        active
                          ? 'bg-slate-100 text-teal-800 font-bold shadow-sm'
                          : 'text-white/85 hover:bg-white/12 hover:text-white',
                      )}
                    >
                      <Icon
                        name={module.icon}
                        size={17}
                        strokeWidth={active ? 2.2 : 2}
                        className={cn('shrink-0', active ? 'text-teal-700' : 'text-white/80')}
                      />
                      <span
                        className={cn(
                          'flex-1 truncate text-sm whitespace-nowrap transition-opacity',
                          active ? 'font-bold text-teal-800' : 'font-medium text-white/90',
                          expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
                        )}
                      >
                        {module.label}
                      </span>
                    </NavLink>
                  </li>
                )
              }

              return (
                <li key={key} className="mb-px">
                  <button
                    type="button"
                    title={module.label}
                    onClick={() => {
                      setOpenKey((prev) => (prev === key ? null : key))
                    }}
                    className={cn(
                      'flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg pr-2 pl-2.5 text-left transition-all duration-150',
                      active
                        ? 'bg-white/15 font-semibold text-white'
                        : 'text-white/85 hover:bg-white/12 hover:text-white',
                    )}
                  >
                    <Icon
                      name={module.icon}
                      size={17}
                      strokeWidth={active ? 2.2 : 2}
                      className={cn('shrink-0', active ? 'text-white' : 'text-white/80')}
                    />

                    <span
                      className={cn(
                        'flex-1 truncate text-sm whitespace-nowrap transition-opacity',
                        active ? 'font-semibold text-white' : 'font-medium text-white/90',
                        expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
                      )}
                    >
                      {module.label}
                    </span>

                    {expanded && module.links.length > 0 ? (
                      <Icon
                        name="chevronDown"
                        size={12}
                        strokeWidth={2.5}
                        className={cn(
                          'shrink-0 transition-transform duration-200',
                          active ? 'text-white/80' : 'text-white/60',
                          submenuOpen && 'rotate-180',
                        )}
                      />
                    ) : null}
                  </button>

                  {submenuOpen && module.links.length > 0 ? (
                    <ul className="mt-1 mb-1 ml-4 flex flex-col gap-0.5 border-l border-white/20 pl-2">
                      {module.links.map((link) => {
                        const current =
                          location.pathname + location.search === link.to ||
                          (location.pathname === link.to && !location.search)
                        return (
                          <li key={link.label}>
                            <button
                              type="button"
                              title={link.label}
                              onClick={() => {
                                navigate(link.to)
                                onNavigate?.()
                              }}
                              className={cn(
                                'flex h-8.5 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-xs font-medium whitespace-nowrap transition-all duration-150',
                                current
                                  ? 'bg-slate-100 text-teal-800 font-bold shadow-sm'
                                  : 'text-white/80 hover:bg-white/10 hover:text-white',
                              )}
                            >
                              <Icon
                                name={link.icon}
                                size={13}
                                strokeWidth={current ? 2.3 : 2}
                                className={cn('shrink-0', current ? 'text-teal-700' : 'opacity-75')}
                              />
                              <span className="truncate">{link.label}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function RailFooter({ expanded }: { expanded: boolean }) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-1 border-t border-white/12 px-4 py-3 transition-opacity',
        expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <span className="text-2xs whitespace-nowrap text-white/45">{BRAND.fullName} {BRAND.version}</span>
      <a href="#help" className="text-2xs whitespace-nowrap text-white/45 hover:text-white">
        Help &amp; support
      </a>
    </div>
  )
}

/**
 * Controls the topbar drops on small screens — branch scope, theme, settings,
 * notifications, sign-out. Hiding them from the bar is only defensible if they
 * reappear somewhere, and the drawer is the somewhere.
 */
function MobileUtilities({ onNavigate }: { onNavigate: () => void }) {
  const navigate = useNavigate()
  const branch = useBranch()
  const cycleBranch = useAppStore((state) => state.cycleBranch)
  const signOut = useAppStore((state) => state.signOut)
  const resolved = useResolvedTheme()
  const toggleTheme = useThemeStore((state) => state.toggle)

  const rowClass =
    'flex w-full cursor-pointer items-center gap-2.5 rounded-field px-2.5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/12 hover:text-white'

  return (
    <div className="shrink-0 border-t border-white/12 p-2">
      <button type="button" onClick={cycleBranch} className={rowClass}>
        <span className="grid size-5 shrink-0 place-items-center rounded bg-white/15 text-[8px] font-bold text-white">
          {branch.code}
        </span>
        <span className="min-w-0 flex-1 truncate text-left">{branch.name}</span>
        <Icon name="transfer" size={13} className="shrink-0 text-white/50" />
      </button>

      <button type="button" onClick={toggleTheme} className={rowClass}>
        <Icon name={resolved === 'dark' ? 'moon' : 'sun'} size={15} className="shrink-0" />
        <span className="flex-1 text-left">{resolved === 'dark' ? 'Dark' : 'Light'} theme</span>
      </button>

      <button
        type="button"
        onClick={() => {
          navigate('/settings')
          onNavigate()
        }}
        className={rowClass}
      >
        <Icon name="settings" size={15} className="shrink-0" />
        <span className="flex-1 text-left">Settings</span>
      </button>

      <button type="button" className={rowClass}>
        <Icon name="bell" size={15} className="shrink-0" />
        <span className="flex-1 text-left">Notifications</span>
        <CountBadge>3</CountBadge>
      </button>

      <button type="button" onClick={signOut} className={rowClass}>
        <Icon name="logout" size={15} className="shrink-0" />
        <span className="flex-1 text-left">Sign out</span>
      </button>
    </div>
  )
}

/**
 * Nav rail. On desktop it is a 56px rail that expands to 224px on hover, or
 * stays open when pinned. Below `lg` it becomes an off-canvas drawer.
 */
export function Sidebar() {
  const [hovering, setHovering] = useState(false)
  const pinned = useAppStore((state) => state.sidebarPinned)
  const mobileOpen = useAppStore((state) => state.mobileNavOpen)
  const setMobileNav = useAppStore((state) => state.setMobileNav)
  const expanded = hovering || pinned

  // Escape closes the drawer, and the page behind it does not scroll under it.
  useEffect(() => {
    if (!mobileOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNav(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen, setMobileNav])

  return (
    <>
      {/* Desktop rail */}
      <aside
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ width: expanded ? 236 : 56 }}
        className="relative z-30 hidden shrink-0 flex-col overflow-visible bg-rail transition-[width] duration-200 ease-out lg:flex"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Brand expanded={expanded} />
          <NavContent expanded={expanded} />
          <RailFooter expanded={expanded} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNav(false)}
            className="absolute inset-0 animate-fade-in bg-black/40"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="relative flex h-full w-[268px] max-w-[85vw] animate-slide-in flex-col bg-rail shadow-panel"
          >
            <div className="flex items-center pr-2">
              <Brand expanded />
              <button
                type="button"
                onClick={() => setMobileNav(false)}
                aria-label="Close navigation"
                className="ml-auto grid size-8 shrink-0 cursor-pointer place-items-center rounded-control text-white/70 transition-colors hover:bg-white/12 hover:text-white"
              >
                <Icon name="close" size={16} strokeWidth={2.2} />
              </button>
            </div>

            <NavContent expanded onNavigate={() => setMobileNav(false)} />

            {/* The topbar sheds these below `sm`; the drawer is where they land. */}
            <MobileUtilities onNavigate={() => setMobileNav(false)} />
            <RailFooter expanded />
          </aside>
        </div>
      ) : null}
    </>
  )
}
