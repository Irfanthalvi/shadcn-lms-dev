import { z } from 'zod'
import { loginMessage } from './message'

export const loginSchema = z.object({
  email: z
    .string({ required_error: loginMessage.emailRequired || "Email is required" })
    .min(1, loginMessage.emailRequired || "Email is required")
    .email(loginMessage.emailInvalid || "Invalid email format"),

  password: z
    .string({ required_error: loginMessage.passwordRequired || "Password is required" })
    .min(6, "Password must be at least 6 characters"),
})

