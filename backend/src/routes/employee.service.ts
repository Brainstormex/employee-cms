import { Prisma, Employee } from '@prisma/client'
import prisma from '../prisma'
import type {
  EmployeeInput,
  EmployeeListResult,
  EmployeeResponse,
  ListEmployeesParams,
} from './employee.types'

export class AppError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function serialize(employee: Employee): EmployeeResponse {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    created_at: employee.createdAt,
    updated_at: employee.updatedAt,
  }
}

export async function listEmployees(
  params: ListEmployeesParams
): Promise<EmployeeListResult> {
  const search = String(params.search || '').trim()
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(50, Math.max(1, params.limit || 10))
  const skip = (page - 1) * limit

  const where: Prisma.EmployeeWhereInput = search
    ? { name: { contains: search } }
    : {}

  const [total, rows] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip,
      take: limit,
    }),
  ])

  return {
    data: rows.map(serialize),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

export async function getEmployeeById(id: number): Promise<EmployeeResponse> {
  const employee = await prisma.employee.findUnique({ where: { id } })
  if (!employee) {
    throw new AppError('Employee not found', 404)
  }
  return serialize(employee)
}

export async function createEmployee(
  input: EmployeeInput
): Promise<EmployeeResponse> {
  try {
    const employee = await prisma.employee.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        role: input.role,
      },
    })
    return serialize(employee)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError('Email already exists', 409)
    }
    throw err
  }
}

export async function updateEmployee(
  id: number,
  input: EmployeeInput
): Promise<EmployeeResponse> {
  try {
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        role: input.role,
      },
    })
    return serialize(employee)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('Employee not found', 404)
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError('Email already exists', 409)
    }
    throw err
  }
}

export async function deleteEmployee(id: number): Promise<void> {
  try {
    await prisma.employee.delete({ where: { id } })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('Employee not found', 404)
    }
    throw err
  }
}
