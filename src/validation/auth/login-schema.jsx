import { z } from 'zod'
import { loginMessage } from './message'

export const loginSchema = z.object({
  email: z
    .string({ required_error: loginMessage.emailRequired })
    .min(1, loginMessage.emailRequired)
    .email(loginMessage.emailInvalid),

  password: z
    .string({ required_error: loginMessage.passwordRequired })
    .min(8, loginMessage.passwordMinLength || "Password must be at least 8 characters")
    .regex(/[A-Z]/, loginMessage.passwordUppercase || "Password must include an uppercase letter")
    .regex(/[a-z]/, loginMessage.passwordLowercase || "Password must include a lowercase letter")
    .regex(/[0-9]/, loginMessage.passwordNumber || "Password must include a number")
    .regex(/[^A-Za-z0-9]/, loginMessage.passwordSymbol || "Password must include a special character"),
})
