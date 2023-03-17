import { z } from "zod";

export const CivilStatusSchema = z.object({
  id: z.number({ required_error: "Please enter a civil status ID." }),
  name: z.string({ required_error: "Please enter a civil status name" }),
});

export const getCivilStatusSchema = CivilStatusSchema.pick({ id: true });

export type ICivilStatus = z.infer<typeof CivilStatusSchema>;
export type IGetCivilStatus = z.infer<typeof getCivilStatusSchema>;
