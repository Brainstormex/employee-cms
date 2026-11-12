import axios from 'axios'
import type { Employee, EmployeeInput, EmployeesResponse } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
})

export async function fetchEmployees(params: {
  search?: string
  page?: number
  limit?: number
}): Promise<EmployeesResponse> {
  const { data } = await api.get<EmployeesResponse>('/employees', { params })
  return data
}

export async function createEmployee(payload: EmployeeInput): Promise<Employee> {
  const { data } = await api.post<Employee>('/employees', payload)
  return data
}

export async function updateEmployee(
  id: number,
  payload: EmployeeInput
): Promise<Employee> {
  const { data } = await api.put<Employee>(`/employees/${id}`, payload)
  return data
}

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employees/${id}`)
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.message
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}
