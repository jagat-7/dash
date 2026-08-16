import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, DetailPanel, DetailRow, EmptyState, FilterChips } from '@/components/ui'
import { BedLegend, BedTile } from '@/components/domain'
import { PageLayout } from '@/components/layout'
import { BEDS, BED_COUNTS, WARD_FILTERS } from '@/data/clinical'
import { PATIENTS } from '@/data/patients'
import type { Bed } from '@/data/types'

/** Operations Resource & Capacity Allocation Board */
export function IpdPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const ward = searchParams.get('ward') ?? 'All'
  const beds = useMemo(() => BEDS.filter((bed) => ward === 'All' || bed.ward === ward), [ward])
  const selected = beds.find((bed) => bed.id === selectedId) ?? null

  const counts = useMemo(
    () => Object.fromEntries(WARD_FILTERS.map((name) => [name, name === 'All' ? BEDS.length : BEDS.filter((bed) => bed.ward === name).length])),
    [],
  )

  function openChart(bed: Bed) {
    if (!bed.project && !bed.patient) return
    const name = bed.project || bed.patient || ''
    const patient = PATIENTS.find((entry) => entry.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(entry.name.toLowerCase()))
    navigate(patient ? `/patients/${patient.id}` : '/patients')
  }

  const board = (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <FilterChips
          label="Filter by facility"
          options={WARD_FILTERS}
          value={ward}
          counts={counts}
          onChange={(next) => {
            setSearchParams(next === 'All' ? {} : { ward: next }, { replace: true })
            setSelectedId(null)
          }}
        />

        <ul className="ml-auto flex items-center gap-3.5">
          <BedStat value={BED_COUNTS.occupied} label="Active In-Use" className="text-brand-600" />
          <BedStat value={BED_COUNTS.available} label="Available" className="text-success" />
          <BedStat value={BED_COUNTS.maintenance} label="Maintenance" className="text-ink-subtle" />
        </ul>
      </div>

      <BedLegend className="mb-3" />

      {beds.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(124px,1fr))] gap-2">
          {beds.map((bed) => (
            <BedTile
              key={bed.id}
              bed={bed}
              selected={bed.id === selectedId}
              onSelect={(next) => setSelectedId(next.id === selectedId ? null : next.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon="layers" title="No capacity bays in this facility" />
      )}
    </div>
  )

  return (
    <PageLayout
      id="ipd-board"
      variant={selected ? 'split' : 'single'}
      primary={board}
      secondary={
        selected ? (
          <DetailPanel
            title={`Resource ${selected.id}`}
            subtitle={`${selected.ward}`}
            width={9999}
            onClose={() => setSelectedId(null)}
          >
            {selected.project || selected.patient ? (
              <>
                <div className="flex flex-col gap-2.5">
                  <DetailRow label="Allocated Account" value={selected.project || selected.patient || 'Active'} />
                  <DetailRow label="Workload Type" value={selected.type || selected.diagnosis} />
                  <DetailRow label="Operations Lead" value={selected.manager || selected.attending} />
                  <DetailRow label="Utilization Rate" value={selected.utilization} />
                  <DetailRow label="Allocation Term" value={selected.lengthOfStay || '12 mos'} />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button block onClick={() => openChart(selected)}>
                    View Account 360
                  </Button>
                  <Button block variant="secondary">
                    Reallocate Pod
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-ink-muted">
                <p>
                  This resource bay is{' '}
                  <b className="text-ink">
                    {selected.state === 'available' ? 'available for deployment' : 'under scheduled maintenance'}
                  </b>
                  .
                </p>
                <Button block className="mt-4" disabled={selected.state !== 'available'}>
                  Assign Project / Workload
                </Button>
              </div>
            )}
          </DetailPanel>
        ) : null
      }
    />
  )
}

function BedStat({ value, label, className }: { value: number; label: string; className: string }) {
  return (
    <li className="text-xs whitespace-nowrap text-ink-muted">
      <b data-numeric className={`text-lg font-bold ${className}`}>
        {value}
      </b>{' '}
      {label}
    </li>
  )
}

export const OperationsPage = IpdPage
