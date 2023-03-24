import { z } from "zod";

export const ReferenceSchema = z.object({
  id: z.number({ required_error: "Please enter a reference Id" }),
  code: z.string({ required_error: "Please enter a code." }),
  name: z.string({ required_error: "Please enter a name." }),
  deletedAt: z.date().optional(),
  isShow: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  entityId: z.number({ required_error: "Please enter a entity Id." }),
  entities: z
    .array(z.number({ required_error: "Please enter a entity Id." }))
    .optional(),
});

export const addReferenceSchema = ReferenceSchema.omit({
  id: true,
  entities: true,
});
export const getReferenceSchema = ReferenceSchema.pick({ id: true });
export const getReferencesByEntityIdSchema = ReferenceSchema.pick({
  entities: true,
});
export const updateReferenceSchema = ReferenceSchema.omit({ entities: true });
export const deleteReferenceSchema = ReferenceSchema.pick({ id: true });

export type ReferenceSchema = z.infer<typeof ReferenceSchema>;
export type IAddReference = z.infer<typeof addReferenceSchema>;
export type IGetReference = z.infer<typeof getReferenceSchema>;
export type IGetReferencesByEntityId = z.infer<
  typeof getReferencesByEntityIdSchema
>;
export type IUpdateReference = z.infer<typeof updateReferenceSchema>;
export type IDeleteReferenceSchema = z.infer<typeof deleteReferenceSchema>;
