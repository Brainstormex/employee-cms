import { Request, Response } from 'express'
import { validateEmployee } from '../validators/employee'
import {
  AppError,
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  listEmployees,
  updateEmployee,
} from './employee.service'

function handleError(res: Response, err: unknown, fallback: string) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ error: fallback })
}

export async function getEmployees(req: Request, res: Response) {
  try {
    const result = await listEmployees({
      search: String(req.query.search || ''),
      page: parseInt(String(req.query.page), 10) || 1,
      limit: parseInt(String(req.query.limit), 10) || 10,
    })
    res.json(result)
  } catch (err) {
    handleError(res, err, 'Failed to fetch employees')
  }
}

export async function getEmployee(req: Request, res: Response) {
  try {
    const employee = await getEmployeeById(Number(req.params.id))
    res.json(employee)
  } catch (err) {
    handleError(res, err, 'Failed to fetch employee')
  }
}

export async function postEmployee(req: Request, res: Response) {
  try {
    const { error, value } = validateEmployee(req.body)
    if (error) {
      res.status(400).json({ error: error.details.map((d) => d.message).join(', ') })
      return
    }

    const employee = await createEmployee(value)
    res.status(201).json(employee)
  } catch (err) {
    handleError(res, err, 'Failed to create employee')
  }
}

export async function putEmployee(req: Request, res: Response) {
  try {
    const { error, value } = validateEmployee(req.body)
    if (error) {
      res.status(400).json({ error: error.details.map((d) => d.message).join(', ') })
      return
    }

    const employee = await updateEmployee(Number(req.params.id), value)
    res.json(employee)
  } catch (err) {
    handleError(res, err, 'Failed to update employee')
  }
}

export async function removeEmployee(req: Request, res: Response) {
  try {
    await deleteEmployee(Number(req.params.id))
    res.json({ message: 'Employee deleted' })
  } catch (err) {
    handleError(res, err, 'Failed to delete employee')
  }
}
