import { Router, Request, Response } from 'express'
import { Prisma, Employee } from '@prisma/client'
import prisma from '../prisma'
import type { EmployeeResponse } from '../types'
import { validateEmployee } from '../validators/employee'

const router = Router()

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

router.get('/', async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || '').trim()
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 10))
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

    res.json({
      data: rows.map(serialize),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch employees' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const employee = await prisma.employee.findUnique({ where: { id } })
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' })
      return
    }
    res.json(serialize(employee))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch employee' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { error, value } = validateEmployee(req.body)
    if (error) {
      res.status(400).json({ error: error.details.map((d) => d.message).join(', ') })
      return
    }

    const employee = await prisma.employee.create({
      data: {
        name: value.name,
        email: value.email.toLowerCase(),
        role: value.role,
      },
    })
    res.status(201).json(serialize(employee))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Failed to create employee' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { error, value } = validateEmployee(req.body)
    if (error) {
      res.status(400).json({ error: error.details.map((d) => d.message).join(', ') })
      return
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name: value.name,
        email: value.email.toLowerCase(),
        role: value.role,
      },
    })
    res.json(serialize(employee))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      res.status(404).json({ error: 'Employee not found' })
      return
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Failed to update employee' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    await prisma.employee.delete({ where: { id } })
    res.json({ message: 'Employee deleted' })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      res.status(404).json({ error: 'Employee not found' })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Failed to delete employee' })
  }
})

export default router
