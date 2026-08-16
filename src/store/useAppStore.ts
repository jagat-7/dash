import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { BRANCHES, FISCAL_YEARS, TODAY, type FiscalYear } from '@/data/branches'
import type { Branch } from '@/data/types'

interface AppState {
  /** Design-prototype auth: no backend, just a gate in front of the shell. */
  authenticated: boolean
  branchId: string
  fiscalYear: FiscalYear
  transactionDate: string
  sidebarPinned: boolean
  /** Mobile drawer for the nav rail. */
  mobileNavOpen: boolean
  /** Free position of the draggable shortcut dock; null = default corner. */
  dock: { x: number; y: number } | null
  registrationOpen: boolean
  /** Persisted split sizes for resizable layouts, keyed by layout id. */
  splits: Record<string, number[]>

  signIn: () => void
  signOut: () => void
  setBranch: (id: string) => void
  setFiscalYear: (fy: FiscalYear) => void
  setTransactionDate: (date: string) => void
  cycleBranch: () => void
  toggleSidebarPin: () => void
  setMobileNav: (open: boolean) => void
  setDock: (position: { x: number; y: number }) => void
  resetDock: () => void
  setRegistrationOpen: (open: boolean) => void
  setSplit: (id: string, sizes: number[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      authenticated: false,
      branchId: BRANCHES[0]!.id,
      fiscalYear: FISCAL_YEARS[0],
      transactionDate: TODAY.nepaliDate,
      sidebarPinned: false,
      mobileNavOpen: false,
      dock: null,
      registrationOpen: false,
      splits: {},

      signIn: () => set({ authenticated: true }),
      signOut: () => set({ authenticated: false, registrationOpen: false, mobileNavOpen: false }),
      setBranch: (branchId) => set({ branchId }),
      setFiscalYear: (fiscalYear) => set({ fiscalYear }),
      setTransactionDate: (transactionDate) => set({ transactionDate }),
      cycleBranch: () =>
        set((state) => {
          const index = BRANCHES.findIndex((branch) => branch.id === state.branchId)
          return { branchId: BRANCHES[(index + 1) % BRANCHES.length]!.id }
        }),
      toggleSidebarPin: () => set((state) => ({ sidebarPinned: !state.sidebarPinned })),
      setMobileNav: (mobileNavOpen) => set({ mobileNavOpen }),
      setDock: (dock) => set({ dock }),
      resetDock: () => set({ dock: null }),
      setRegistrationOpen: (registrationOpen) => set({ registrationOpen }),
      setSplit: (id, sizes) => set((state) => ({ splits: { ...state.splits, [id]: sizes } })),
    }),
    {
      name: 'forward-app',
      storage: createJSONStorage(() => sessionStorage),
      /**
       * Session and workspace preferences survive a reload so deep links and
       * refreshes work. Transient UI (open drawer, open dialog) does not.
       */
      partialize: (state) => ({
        authenticated: state.authenticated,
        branchId: state.branchId,
        fiscalYear: state.fiscalYear,
        transactionDate: state.transactionDate,
        sidebarPinned: state.sidebarPinned,
        dock: state.dock,
        splits: state.splits,
      }),
    },
  ),
)

/** Active branch object — every KPI on the app scales by its factor. */
export function useBranch(): Branch {
  const branchId = useAppStore((state) => state.branchId)
  return BRANCHES.find((branch) => branch.id === branchId) ?? BRANCHES[0]!
}
