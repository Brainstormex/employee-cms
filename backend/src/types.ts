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
