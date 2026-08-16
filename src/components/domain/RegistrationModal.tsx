import { useEffect, useState } from 'react'
import { Button, Field, Icon, Input, Modal, Select } from '@/components/ui'
import { OPD_DEPARTMENTS, OPD_DOCTORS, PAYMENT_MODES } from '@/data/clinical'

export interface RegistrationModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Quick-lead intake dialog reachable from anywhere via the FAB or shortcut dock.
 */
export function RegistrationModal({ open, onClose }: RegistrationModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')

  // Reset to a blank form whenever the dialog is re-opened.
  useEffect(() => {
    if (open) {
      setSubmitted(false)
      setCompany('')
      setEmail('')
    }
  }, [open])

  const valid = company.trim().length > 1 && email.trim().length >= 4

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Quick Lead Intake & Opportunity"
      description={submitted ? undefined : 'Minimum details — full qualification wizard is on the Lead Intake screen.'}
      footer={
        submitted ? (
          <Button onClick={onClose}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!valid} onClick={() => setSubmitted(true)}>
              Register Lead
            </Button>
          </>
        )
      }
    >
      {submitted ? (
        <div className="py-8 text-center">
          <span className="mx-auto mb-3.5 grid size-13 place-items-center rounded-full bg-success-soft text-success">
            <Icon name="check" size={22} strokeWidth={3} />
          </span>
          <p className="text-md font-bold text-ink">Lead Successfully Registered</p>
          <p className="mt-2 text-sm text-ink-muted">
            Opportunity <b className="font-mono text-ink">OPP-2026-08412</b> · Routed to{' '}
            <b className="font-semibold text-ink">Enterprise SDR Queue</b>
          </p>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label="Company / Organization" required full>
            <Input
              placeholder="e.g. Nexus Global Systems"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              autoComplete="off"
            />
          </Field>
          <Field label="Primary Contact Email" required>
            <Input
              type="email"
              placeholder="lead@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field label="Estimated ARR / Deal Size">
            <Select options={['$50k - $100k', '$100k - $250k', '$250k - $500k', '$500k+ (Enterprise)']} />
          </Field>
          <Field label="Product Interest">
            <Select options={OPD_DEPARTMENTS} />
          </Field>
          <Field label="Assigned Account Exec">
            <Select options={OPD_DOCTORS} />
          </Field>
          <Field label="Billing / Payment Terms" full>
            <Select options={PAYMENT_MODES} />
          </Field>
        </div>
      )}
    </Modal>
  )
}

export const QuickLeadModal = RegistrationModal
