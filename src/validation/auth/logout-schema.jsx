import { z } from "zod";
import { logOutMessage } from "./message";

export const CLASS_OPTIONS = [
  { value: "class-8", label: "Class 8" },
  { value: "class-9", label: "Class 9" },
  { value: "class-10", label: "Class 10" },
  { value: "class-11", label: "Class 11" },
  { value: "class-12", label: "Class 12" },
];

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

  classId: z
    .string({ required_error: "Please select your class" })
    .min(1, "Please select your class"),
});
