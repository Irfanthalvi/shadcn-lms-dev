import { z } from "zod";
import { forgetMessage } from "./message";

export const forgetSchema = z.object({
    email: z
        .string({ required_error: forgetMessage.emailRequired })
        .min(1, forgetMessage.emailRequired)
        .email(forgetMessage.emailInvalid)
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, forgetMessage.emailInvalid)

});
