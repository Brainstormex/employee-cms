'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Employee, EmployeeInput } from '@/types'

interface Props {
  initial?: Employee | null
  onSubmit: (data: EmployeeInput) => Promise<void>
  onCancel?: () => void
  busy?: boolean
}

const empty: EmployeeInput = { name: '', email: '', role: '' }

export default function EmployeeForm({ initial, onSubmit, onCancel, busy }: Props) {
  const [form, setForm] = useState<EmployeeInput>(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name, email: initial.email, role: initial.role })
    } else {
      setForm(empty)
    }
    setError('')
  }, [initial])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await onSubmit(form)
      if (!initial) setForm(empty)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  const editing = Boolean(initial)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-teal">
            Name
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full name"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-teal">
            Email
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="name@company.com"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-teal">
            Role
          </span>
          <input
            required
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="Job role"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-bright disabled:opacity-60"
        >
          {busy ? 'Saving…' : editing ? 'Update employee' : 'Add employee'}
        </button>
        {editing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-fog"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
