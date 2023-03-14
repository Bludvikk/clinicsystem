import { z } from "zod";

export const getGenderSchema = z.object({
  id: z.number({ required_error: "Please enter a gender Id." }),
});

export type IGetGender = z.infer<typeof getGenderSchema>;
