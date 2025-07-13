import { z } from "zod";
import { logOutMessage } from "./message";

export const registerSchema = z.object({
  name: z
    .string({ required_error: logOutMessage.nameRequired || "Name is required" })
    .min(1, logOutMessage.nameRequired || "Name is required"),

  email: z
    .string({ required_error: logOutMessage.emailRequired })
    .min(1, logOutMessage.emailRequired)
    .email(logOutMessage.emailInvalid),

  password: z
    .string({ required_error: logOutMessage.passwordRequired })
    .min(8, logOutMessage.passwordMinLength || "Password must be at least 8 characters")
    .regex(/[A-Z]/, logOutMessage.passwordUppercase || "Password must include an uppercase letter")
    .regex(/[a-z]/, logOutMessage.passwordLowercase || "Password must include a lowercase letter")
    .regex(/[0-9]/, logOutMessage.passwordNumber || "Password must include a number")
    .regex(/[^A-Za-z0-9]/, logOutMessage.passwordSymbol || "Password must include a special character"),
});
