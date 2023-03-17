import { z } from "zod";

export const GenderSchema = z.object({
  id: z.number({ required_error: "Please enter a gender ID." }),
  name: z.string({ required_error: "Please enter a gender name" }),
});

export const getGenderSchema = GenderSchema.pick({ id: true });

export type IGender = z.infer<typeof GenderSchema>;
export type IGetGender = z.infer<typeof getGenderSchema>;
