export interface Employee {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export interface EmployeeInput {
  name: string
  email: string
  role: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface EmployeesResponse {
  data: Employee[]
  pagination: Pagination
}
