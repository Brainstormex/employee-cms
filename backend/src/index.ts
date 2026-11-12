import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import employeesRouter from './routes/employee.route'
import prisma from './prisma'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5001

app.use(cors())
app.use(express.json())

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

app.use('/employees', employeesRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
