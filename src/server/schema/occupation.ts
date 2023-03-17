import { z } from "zod";

export const OccupationSchema = z.object({
  id: z.number({ required_error: "Please enter an occupation ID." }),
  name: z.string({ required_error: "Please enter an occupation name" }),
});

export const getOccupationSchema = OccupationSchema.pick({ id: true });

export type IOccuation = z.infer<typeof OccupationSchema>;
export type IGetOccupation = z.infer<typeof getOccupationSchema>;
