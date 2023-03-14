import { z } from "zod";

export const getCivilStatusSchema = z.object({
  id: z.number({ required_error: "Please enter a civil status Id." }),
});

export type IGetCivilStatus = z.infer<typeof getCivilStatusSchema>;
