'use client'

interface Props {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, total, onChange }: Props) {
  if (totalPages <= 1) {
    return (
      <p className="text-sm text-ink/50">
        {total} employee{total === 1 ? '' : 's'}
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink/50">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
