// src/validation/schema/profileSchema.js

import { z } from "zod";
import { profileMessage } from "./message";

export const profileSchema = z
  .object({
    firstName: z
      .string({ required_error: profileMessage.firstNameRequired })
      .min(2, profileMessage.firstNameMin),

    lastName: z
      .string({ required_error: profileMessage.lastNameRequired })
      .min(2, profileMessage.lastNameMin),

    email: z
      .string({ required_error: profileMessage.emailRequired })
      .min(1, profileMessage.emailRequired)
      .email(profileMessage.emailInvalid),

    oldPassword: z.string().optional(),

    newPassword: z
      .string({ required_error: profileMessage.newPasswordRequired })
      .min(6, profileMessage.newPasswordMin),

    confirmPassword: z
      .string({ required_error: profileMessage.confirmPasswordRequired }),

    profilePicture: z.any().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: profileMessage.passwordMismatch,
    path: ["confirmPassword"],
  });
