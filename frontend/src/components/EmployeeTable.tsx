'use client'

import type { Employee } from '@/types'

interface Props {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  loading?: boolean
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-ink/50">
        Loading employees…
      </div>
    )
  }

  if (!employees.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="font-display text-2xl text-ink/80">No employees found</p>
        <p className="text-sm text-ink/50">Add someone new or adjust your search.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-180 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-ink/45">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
            <th className="px-4 py-3 font-semibold">Updated</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={employee.id}
              className="animate-fade-up border-b border-line/70 transition hover:bg-fog/80"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <td className="px-4 py-3.5 font-medium text-ink">{employee.name}</td>
              <td className="px-4 py-3.5 text-ink/70">{employee.email}</td>
              <td className="px-4 py-3.5">
                <span className="inline-block rounded-md bg-teal/10 px-2 py-1 text-xs font-medium text-teal">
                  {employee.role}
                </span>
              </td>
              <td className="px-4 py-3.5 text-ink/55">{formatDateTime(employee.created_at)}</td>
              <td className="px-4 py-3.5 text-ink/55">{formatDateTime(employee.updated_at)}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(employee)}
                    className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink/80 transition hover:border-teal hover:text-teal"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(employee)}
                    className="rounded-md border border-coral/20 bg-coral/5 px-3 py-1.5 text-xs font-semibold text-coral transition hover:bg-coral/10"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
