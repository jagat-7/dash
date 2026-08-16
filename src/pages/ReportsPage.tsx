import { Button, Card, CardBody } from '@/components/ui'
import { DonutChart, TrendLine } from '@/components/charts'
import { PAYER_MIX, REVENUE_BY_MONTH, TOP_DEPARTMENTS } from '@/data/finance'
import { money } from '@/lib/format'
import { useBranch } from '@/store/useAppStore'

export function ReportsPage() {
  const branch = useBranch()

  const revenue = REVENUE_BY_MONTH.map((month) => ({
    ...month,
    value: Math.round(month.value * branch.factor * 10) / 10,
  }))
  const total = revenue.reduce((sum, month) => sum + month.value, 0)

  return (
    <div className="grid gap-3.5 xl:grid-cols-[1.7fr_1fr] xl:items-start">
      <Card>
        <CardBody>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">Consolidated ARR Growth — Last 12 Months</h2>
              <p className="mt-0.5 text-xs text-ink-muted">
                $k USD · {branch.name} · August is current month-to-date
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xs font-semibold tracking-[0.06em] text-ink-subtle uppercase">
                12-Month ARR Trailing Total
              </p>
              <p data-numeric className="text-xl font-bold tracking-tight text-ink">
                ${total.toFixed(0)}k USD{' '}
                <span className="text-xs font-semibold text-success">▲ 18.4% YoY</span>
              </p>
            </div>
          </div>

          <TrendLine
            points={revenue}
            highlight="Aug"
            format={(point) => `$${point.value.toFixed(0)}k`}
          />

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" icon="download" size="sm">
              Export CSV Dataset
            </Button>
            <Button variant="secondary" icon="printer" size="sm">
              Executive Board Deck
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3">
        <Card>
          <CardBody>
            <h2 className="mb-3.5 text-base font-semibold text-ink">Revenue by Customer Tier</h2>
            <DonutChart segments={PAYER_MIX} size={80} thickness={9} />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="mb-2 text-base font-semibold text-ink">Top Revenue Business Lines</h2>
            <ul>
              {TOP_DEPARTMENTS.map((department) => (
                <li
                  key={department.name}
                  className="flex justify-between border-b border-hairline-soft py-2.5 text-sm last:border-b-0"
                >
                  <span className="text-ink-soft">{department.name}</span>
                  <span data-numeric className="font-semibold text-ink">
                    {money(Math.round(department.revenue * branch.factor))}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
