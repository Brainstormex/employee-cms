'use client'

import { useEffect, useState } from 'react'
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  getErrorMessage,
  updateEmployee,
} from '@/lib/api'
import EmployeeForm from '@/components/EmployeeForm'
import EmployeeTable from '@/components/EmployeeTable'
import Pagination from '@/components/Pagination'
import type { Employee, EmployeeInput, Pagination as PaginationMeta } from '@/types'

const PAGE_SIZE = 5

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const result = await fetchEmployees({
          search: debouncedSearch || undefined,
          page,
          limit: PAGE_SIZE,
        })
        if (cancelled) return
        setEmployees(result.data)
        setPagination(result.pagination)
      } catch (err) {
        if (!cancelled) {
          setBanner({ type: 'err', text: getErrorMessage(err) })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, page])

  async function handleSave(data: EmployeeInput) {
    setSaving(true)
    setBanner(null)
    try {
      if (editing) {
        await updateEmployee(editing.id, data)
        setBanner({ type: 'ok', text: 'Employee updated' })
        setEditing(null)
      } else {
        await createEmployee(data)
        setBanner({ type: 'ok', text: 'Employee added' })
        setPage(1)
      }
      const result = await fetchEmployees({
        search: debouncedSearch || undefined,
        page: editing ? page : 1,
        limit: PAGE_SIZE,
      })
      setEmployees(result.data)
      setPagination(result.pagination)
    } catch (err) {
      throw new Error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(employee: Employee) {
    if (!window.confirm(`Delete ${employee.name}?`)) return
    setBanner(null)
    try {
      await deleteEmployee(employee.id)
      if (editing?.id === employee.id) setEditing(null)
      const nextPage = employees.length === 1 && page > 1 ? page - 1 : page
      setPage(nextPage)
      const result = await fetchEmployees({
        search: debouncedSearch || undefined,
        page: nextPage,
        limit: PAGE_SIZE,
      })
      setEmployees(result.data)
      setPagination(result.pagination)
      setBanner({ type: 'ok', text: 'Employee deleted' })
    } catch (err) {
      setBanner({ type: 'err', text: getErrorMessage(err) })
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="animate-fade-up mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Directory
        </p>
        <h1 className="font-display text-5xl tracking-tight text-ink sm:text-6xl">
          Employee CMS
        </h1>
        <p className="mt-3 max-w-xl text-base text-ink/60">
          Add, search, edit, and remove people on your team — backed by MySQL + Prisma.
        </p>
      </header>

      {banner && (
        <div
          className={`animate-fade-in mb-6 rounded-lg px-4 py-3 text-sm ${banner.type === 'ok' ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'
            }`}
        >
          {banner.text}
        </div>
      )}

      <section className="animate-fade-up stagger-1 mb-6 rounded-2xl border border-line/80 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(15,28,26,0.35)] backdrop-blur sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">
            {editing ? 'Edit employee' : 'Add employee'}
          </h2>
          <p className="text-sm text-ink/50">
            {editing
              ? `Updating ${editing.name}`
              : 'Name, email, and role are required'}
          </p>
        </div>
        <EmployeeForm
          initial={editing}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
          busy={saving}
        />
      </section>

      <section className="animate-fade-up stagger-2 rounded-2xl border border-line/80 bg-white/80 shadow-[0_20px_50px_-30px_rgba(15,28,26,0.35)] backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-ink">All employees</h2>
            <p className="text-sm text-ink/50">Search by name, paginated results</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search employees</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-lg border border-line bg-fog/60 px-3 py-2.5 text-sm outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20"
            />
          </label>
        </div>

        <EmployeeTable
          employees={employees}
          loading={loading}
          onEdit={(employee) => {
            setEditing(employee)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onDelete={handleDelete}
        />

        <div className="border-t border-line px-5 py-4 sm:px-6">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onChange={setPage}
          />
        </div>
      </section>
    </div>
  )
}
