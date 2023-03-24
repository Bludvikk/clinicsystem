import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "Password must contain atleast 4 characters" })
    .max(12, {
      message: "Password must not exceed 12 characters",
    }),
});

export const signUpSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, { message: "Username must contain atleast 3 characters" }),
  terms: z.literal<boolean>(true, {
    required_error: "You must accept the privacy policy & terms",
  }),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
