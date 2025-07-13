import { z } from "zod";
import { otpMessage } from "./message";

export const otpSchema = z.object({
  otp: z
    .string({ required_error: otpMessage.otpRequired })
    .min(6, otpMessage.otpLength)
    .max(6, otpMessage.otpLength)
    .regex(/^\d{6}$/, otpMessage.otpInvalid),
});
