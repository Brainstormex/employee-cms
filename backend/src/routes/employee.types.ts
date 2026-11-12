export interface EmployeeInput {
  name: string
  email: string
  role: string
}

export interface EmployeeResponse {
  id: number
  name: string
  email: string
  role: string
  created_at: Date
  updated_at: Date
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface EmployeeListResult {
  data: EmployeeResponse[]
  pagination: PaginationMeta
}

export interface ListEmployeesParams {
  search?: string
  page?: number
  limit?: number
}
