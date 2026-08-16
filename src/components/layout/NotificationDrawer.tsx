import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Drawer,
  Icon,
  type IconName,
} from '@/components/ui'
import { cn } from '@/lib/cn'

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  category: 'orders' | 'collections'
  unread: boolean
  icon: IconName
  iconBg: string
  iconColor: string
  link?: string
  actionLabel?: string
  actionType?: 'approve' | 'view'
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New Order Received',
    description: 'Order #819 received from Aaryan Stha (Dharan) for Rs. 8,000.00.',
    time: '5m ago',
    category: 'orders',
    unread: true,
    icon: 'cart',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    link: '/orders',
    actionLabel: 'View Order',
    actionType: 'view',
  },
  {
    id: 'n2',
    title: 'Order Status Verified',
    description: 'Order #818 (Bikash Enterprises) has been marked VERIFIED by Sales Supervisor.',
    time: '24m ago',
    category: 'orders',
    unread: true,
    icon: 'check',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40',
    iconColor: 'text-[#701A75] dark:text-purple-400',
    link: '/orders',
    actionLabel: 'View Order',
    actionType: 'view',
  },
  {
    id: 'n3',
    title: 'Pending Order Review',
    description: 'Order #815 from Summit Traders (Biratnagar) for Rs. 22,400.00 requires authorization.',
    time: '45m ago',
    category: 'orders',
    unread: false,
    icon: 'clock',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    link: '/orders',
    actionLabel: 'Authorize',
    actionType: 'view',
  },
  {
    id: 'n4',
    title: 'Money Collection Recorded',
    description: 'Received Rs. 45,000.00 cash voucher from Summit Traders (Biratnagar).',
    time: '1h ago',
    category: 'collections',
    unread: true,
    icon: 'wallet',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40',
    iconColor: 'text-sky-600 dark:text-sky-400',
    link: '/billing',
    actionLabel: 'View Voucher',
  },
  {
    id: 'n5',
    title: 'Bank Collection Clearance',
    description: 'Bank clearance voucher of Rs. 18,950.00 recorded for Lumbini Suppliers (Butwal).',
    time: '3h ago',
    category: 'collections',
    unread: false,
    icon: 'creditCard',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    link: '/billing',
    actionLabel: 'View Voucher',
  },
]

export interface NotificationDrawerProps {
  open: boolean
  onClose: () => void
}

export function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [tab, setTab] = useState<'all' | 'orders' | 'collections'>('all')

  const unreadCount = notifications.filter((n) => n.unread).length

  const filtered = notifications.filter((n) => {
    if (tab === 'all') return true
    if (tab === 'orders') return n.category === 'orders'
    if (tab === 'collections') return n.category === 'collections'
    return true
  })

  function markAllRead() {
    setNotifications((current) => current.map((n) => ({ ...n, unread: false })))
  }

  function markRead(id: string) {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    )
  }

  function handleNavigate(link?: string, id?: string) {
    if (id) markRead(id)
    if (link) {
      navigate(link)
      onClose()
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      width={420}
      title={
        <div className="flex items-center gap-2.5">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge tone="brand" size="sm">
              {unreadCount} new
            </Badge>
          )}
        </div>
      }
      description="Live order updates, status changes, and money collection entries."
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            size="xs"
            variant="ghost"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="text-2xs font-semibold"
          >
            Mark all as read
          </Button>

          <Button
            size="xs"
            variant="secondary"
            onClick={() => {
              navigate('/settings')
              onClose()
            }}
            className="text-2xs"
          >
            Notification Settings
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-hairline-teal bg-subtle p-1 text-2xs">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            {
              id: 'orders',
              label: 'Orders',
              count: notifications.filter((n) => n.category === 'orders').length,
            },
            {
              id: 'collections',
              label: 'Collections',
              count: notifications.filter((n) => n.category === 'collections').length,
            },
          ].map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as any)}
                className={cn(
                  'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1 font-semibold transition-all',
                  active
                    ? 'bg-surface text-brand-700 shadow-2xs'
                    : 'text-ink-subtle hover:text-ink',
                )}
              >
                <span>{t.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[9px] font-bold',
                    active ? 'bg-brand-50 text-brand-700' : 'bg-canvas text-ink-muted',
                  )}
                >
                  {t.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col divide-y divide-hairline-teal/70 rounded-xl border border-hairline-teal bg-surface">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-2.5 grid size-10 place-items-center rounded-full bg-subtle text-ink-subtle">
                <Icon name="bell" size={18} />
              </div>
              <p className="text-sm font-semibold text-ink">No notifications</p>
              <p className="text-xs text-ink-muted">You're all caught up with alerts.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNavigate(item.link, item.id)}
                className={cn(
                  'group relative flex cursor-pointer items-start gap-3 p-3.5 transition-colors hover:bg-subtle/80',
                  item.unread && 'bg-brand-50/20',
                )}
              >
                {/* Icon Badge */}
                <div
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-lg shadow-2xs',
                    item.iconBg,
                    item.iconColor,
                  )}
                >
                  <Icon name={item.icon} size={15} strokeWidth={2.2} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={cn(
                        'truncate text-xs',
                        item.unread ? 'font-bold text-ink' : 'font-semibold text-ink-soft',
                      )}
                    >
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-ink-subtle font-mono">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-ink-muted line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Actions row */}
                  {item.actionLabel && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#007A87] group-hover:underline">
                        {item.actionLabel} →
                      </span>
                    </div>
                  )}
                </div>

                {/* Unread indicator dot */}
                {item.unread && (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600 shadow-2xs" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Drawer>
  )
}
