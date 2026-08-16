import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Icon, IconButton } from '@/components/ui'
import { BranchSwitcher } from '@/components/domain'
import { NotificationDrawer } from './NotificationDrawer'
import { CURRENT_USER } from '@/data/branches'
import { useAppStore } from '@/store/useAppStore'

export interface TopbarProps {
  title: string
  crumb: string
}

export function Topbar({ title, crumb }: TopbarProps) {
  const navigate = useNavigate()
  const setMobileNav = useAppStore((state) => state.setMobileNav)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="relative z-30 flex h-topbar shrink-0 items-center justify-between gap-2 border-b border-hairline-top bg-surface px-3 shadow-topbar sm:gap-3 sm:px-4">
      {/* Left: Mobile Nav & Page Title / Crumb */}
      <div className="flex min-w-0 shrink-0 items-center gap-2.5">
        <IconButton
          icon="menu"
          label="Open navigation"
          variant="ghost"
          size={32}
          className="shrink-0 lg:hidden"
          onClick={() => setMobileNav(true)}
        />

        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-tight text-ink sm:text-lg">{title}</h1>
          <p className="truncate text-2xs text-ink-subtle">{crumb}</p>
        </div>
      </div>

      {/* Right: Branch Switcher & User Controls */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        {/* Branch Switcher Strip */}
        <BranchSwitcher />

        {/* Notifications */}
        <span className="relative hidden sm:block">
          <IconButton
            icon="bell"
            label="Notifications"
            onClick={() => setNotificationsOpen(true)}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1.5 right-2 size-1.5 rounded-full border-[1.5px] border-surface bg-emergency"
          />
        </span>

        {/* User Profile */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex cursor-pointer items-center gap-2 rounded-control p-1 transition-colors hover:bg-subtle"
          aria-label={`Signed in as ${CURRENT_USER.name}`}
        >
          <Avatar name={CURRENT_USER.name} size={30} />
          <span className="hidden flex-col items-start leading-tight 2xl:flex">
            <span className="text-xs font-semibold text-ink">{CURRENT_USER.name}</span>
            <span className="text-[10px] text-ink-subtle">{CURRENT_USER.role}</span>
          </span>
          <Icon
            name="chevronDown"
            size={11}
            strokeWidth={2.2}
            className="hidden text-ink-subtle 2xl:block"
          />
        </button>
      </div>

      {/* Right Side Slide-Over Notification Drawer */}
      <NotificationDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </header>
  )
}
