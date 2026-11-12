import { Router } from 'express'
import {
  getEmployee,
  getEmployees,
  postEmployee,
  putEmployee,
  removeEmployee,
} from './employee.controller'

const router = Router()

router.get('/', getEmployees)
router.get('/:id', getEmployee)
router.post('/', postEmployee)
router.put('/:id', putEmployee)
router.delete('/:id', removeEmployee)

export default router
