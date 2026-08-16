import { useCallback, useRef, useState } from 'react'
import { AnchoredPanel, Icon } from '@/components/ui'
import { cn } from '@/lib/cn'
import { BRANCHES, FISCAL_YEARS, TODAY, type FiscalYear } from '@/data/branches'
import { useAppStore, useBranch } from '@/store/useAppStore'

/**
 * Top Branch Switcher Tab & Operational Meta Strip
 * Matches the theme with separate, lighter chips for Branch Switch Dropdown,
 * BS Date, Transaction Date (editable), and Fiscal Year selector.
 */
export function BranchSwitcher({ className }: { className?: string }) {
  const branch = useBranch()
  const setBranch = useAppStore((state) => state.setBranch)
  const fiscalYear = useAppStore((state) => state.fiscalYear)
  const setFiscalYear = useAppStore((state) => state.setFiscalYear)
  const transactionDate = useAppStore((state) => state.transactionDate)
  const setTransactionDate = useAppStore((state) => state.setTransactionDate)

  // Branch dropdown state
  const [branchOpen, setBranchOpen] = useState(false)
  const branchAnchorRef = useRef<HTMLDivElement>(null)
  const closeBranch = useCallback(() => setBranchOpen(false), [])

  // Fiscal year dropdown state
  const [fyOpen, setFyOpen] = useState(false)
  const fyAnchorRef = useRef<HTMLDivElement>(null)
  const closeFy = useCallback(() => setFyOpen(false), [])

  // Transaction date editing state
  const [editingDate, setEditingDate] = useState(false)
  const [tempDate, setTempDate] = useState(transactionDate)

  const handleSaveDate = () => {
    if (tempDate.trim()) {
      setTransactionDate(tempDate.trim())
    }
    setEditingDate(false)
  }

  return (
    <div className={cn('flex items-center gap-1.5 sm:gap-2', className)}>
      {/* 1. Branch Switch Dropdown */}
      <div ref={branchAnchorRef} className="relative">
        <button
          type="button"
          onClick={() => setBranchOpen((val) => !val)}
          aria-haspopup="listbox"
          aria-expanded={branchOpen}
          className="group flex h-8.5 cursor-pointer items-center gap-1.5 rounded-field border border-brand-200/90 bg-brand-50/80 px-2.5 text-xs font-semibold text-brand-700 shadow-2xs transition-colors hover:border-brand-300 hover:bg-brand-100 hover:text-brand-800"
        >
          <Icon name="building" size={13} strokeWidth={2.2} className="shrink-0 text-brand-600" />
          <span className="text-xs font-semibold tracking-tight">{branch.name}</span>
          <Icon
            name="chevronDown"
            size={11}
            strokeWidth={2.5}
            className={cn('text-brand-500 transition-transform duration-200', branchOpen && 'rotate-180')}
          />
        </button>

        <AnchoredPanel
          open={branchOpen}
          anchorRef={branchAnchorRef}
          onDismiss={closeBranch}
          align="start"
          width={180}
          className="overflow-hidden rounded-panel border border-hairline-teal bg-surface py-1 shadow-panel"
        >
          <ul role="listbox" aria-label="Select Branch" className="max-h-72 overflow-y-auto">
            {BRANCHES.map((b) => {
              const isSelected = b.id === branch.id
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setBranch(b.id)
                      setBranchOpen(false)
                    }}
                    className={cn(
                      'flex w-full cursor-pointer items-center px-3.5 py-1.5 text-left text-xs transition-colors',
                      isSelected
                        ? 'bg-brand-50 font-semibold text-brand-700'
                        : 'text-ink-body hover:bg-subtle hover:text-ink',
                    )}
                  >
                    <span className="flex-1 truncate">{b.name}</span>
                    {isSelected ? <Icon name="check" size={12} strokeWidth={2.5} className="ml-1 text-brand-600" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </AnchoredPanel>
      </div>

      {/* 2. Current BS Date */}
      <div className="hidden h-8.5 items-center gap-1.5 rounded-field border border-hairline-teal bg-subtle/80 px-2.5 text-xs font-medium text-ink-muted md:flex">
        <Icon name="calendar" size={13} strokeWidth={2.2} className="shrink-0 text-ink-subtle" />
        <span className="text-ink-body">{TODAY.nepaliDate}</span>
      </div>

      {/* 3. Transaction Date (with editable pencil) */}
      <div className="flex h-8.5 items-center gap-1.5 rounded-field border border-brand-200/70 bg-brand-50/50 px-2.5 text-xs font-medium text-brand-800 transition-colors hover:border-brand-300/80 hover:bg-brand-50">
        <Icon name="calendar" size={13} strokeWidth={2.2} className="shrink-0 text-brand-600" />
        {editingDate ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveDate()
                if (e.key === 'Escape') setEditingDate(false)
              }}
              autoFocus
              className="h-6 w-24 rounded border border-brand-300 bg-surface px-1.5 text-xs font-medium text-ink placeholder-ink-subtle focus:border-brand-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveDate}
              className="cursor-pointer rounded bg-brand-100 p-0.5 text-brand-700 hover:bg-brand-200"
              title="Apply date"
            >
              <Icon name="check" size={11} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <span className="flex items-center gap-1 text-xs">
            <span className="hidden lg:inline text-brand-700/80">Transaction Date:</span>
            <span className="font-semibold text-brand-900">{transactionDate}</span>
            <button
              type="button"
              onClick={() => {
                setTempDate(transactionDate)
                setEditingDate(true)
              }}
              title="Edit Transaction Date"
              className="cursor-pointer rounded p-0.5 text-brand-600/70 transition-colors hover:bg-brand-100 hover:text-brand-800"
            >
              <Icon name="pencil" size={11} strokeWidth={2.4} />
            </button>
          </span>
        )}
      </div>

      {/* 4. Fiscal Year Selector */}
      <div ref={fyAnchorRef} className="relative hidden sm:block">
        <button
          type="button"
          onClick={() => setFyOpen((val) => !val)}
          aria-haspopup="listbox"
          aria-expanded={fyOpen}
          className="flex h-8.5 cursor-pointer items-center gap-1.5 rounded-field border border-hairline-teal bg-subtle/80 px-2.5 text-xs font-medium text-ink-body shadow-2xs transition-colors hover:border-line-strong hover:bg-surface hover:text-ink"
        >
          <span className="hidden xl:inline text-xs text-ink-subtle">Fiscal Year:</span>
          <span className="font-bold text-ink">{fiscalYear}</span>
          <Icon
            name="chevronDown"
            size={11}
            strokeWidth={2.5}
            className={cn('text-ink-subtle transition-transform duration-200', fyOpen && 'rotate-180')}
          />
        </button>

        <AnchoredPanel
          open={fyOpen}
          anchorRef={fyAnchorRef}
          onDismiss={closeFy}
          align="end"
          width={130}
          className="overflow-hidden rounded-panel border border-hairline-teal bg-surface py-1 shadow-panel"
        >
          <ul role="listbox" aria-label="Select Fiscal Year">
            {FISCAL_YEARS.map((fy) => {
              const isSelected = fy === fiscalYear
              return (
                <li key={fy}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setFiscalYear(fy as FiscalYear)
                      setFyOpen(false)
                    }}
                    className={cn(
                      'flex w-full cursor-pointer items-center px-3 py-1.5 text-left text-xs transition-colors',
                      isSelected
                        ? 'bg-brand-50 font-semibold text-brand-700'
                        : 'text-ink-body hover:bg-subtle hover:text-ink',
                    )}
                  >
                    <span className="flex-1">FY {fy}</span>
                    {isSelected ? <Icon name="check" size={11} strokeWidth={2.5} className="ml-1 text-brand-600" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </AnchoredPanel>
      </div>
    </div>
  )
}
