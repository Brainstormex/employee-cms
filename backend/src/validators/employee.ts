import Joi from 'joi'
import type { EmployeeInput } from '../routes/employee.types'

export const employeeSchema = Joi.object<EmployeeInput>({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  email: Joi.string().trim().email().max(150).required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email is invalid',
    'any.required': 'Email is required',
  }),
  role: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Role is required',
    'any.required': 'Role is required',
  }),
})

export function validateEmployee(payload: unknown) {
  return employeeSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  })
}
