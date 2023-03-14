import { z } from "zod";

export const getOccupationSchema = z.object({
  id: z.number({ required_error: "Please enter a occupation Id." }),
});

export type IGetOccupation = z.infer<typeof getOccupationSchema>;
