import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = loginSchema.extend({
  username: z.string(),
  terms: z.literal<boolean>(true, {required_error: "You must accept the privacy policy & terms"}),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;