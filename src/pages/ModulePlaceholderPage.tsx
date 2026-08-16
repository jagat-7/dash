import { Link, useLocation } from 'react-router-dom'
import { Card, CardBody, Icon } from '@/components/ui'
import { moduleForPath } from '@/data/navigation'

/**
 * Registered module without a designed screen yet. Honest about its state and
 * still shows the planned sub-sections, so navigation stays coherent instead
 * of dead-ending on a 404.
 */
export function ModulePlaceholderPage() {
  const { pathname } = useLocation()
  const module = moduleForPath(pathname)

  if (!module) return null

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardBody className="px-6 py-10 text-center">
          <span
            aria-hidden
            className="mx-auto grid size-14 place-items-center rounded-panel"
            style={{ background: module.iconBg }}
          >
            <Icon name={module.icon} size={26} style={{ color: module.iconColor }} />
          </span>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">{module.label}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            This module is in the navigation model, but its screens have not been designed yet.
            The sections below are what it will contain.
          </p>

          <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left sm:grid-cols-3">
            {module.links.map((link) => (
              <li
                key={link.label}
                className="rounded-field border border-hairline bg-subtle px-3 py-2.5 text-xs font-medium text-ink-soft"
              >
                {link.label}
              </li>
            ))}
          </ul>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-500"
          >
            <Icon name="arrowLeft" size={13} strokeWidth={2.2} />
            Back to all modules
          </Link>
        </CardBody>
      </Card>
    </div>
  )
}
