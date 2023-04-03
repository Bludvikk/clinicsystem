import { z } from "zod";

export const ReferenceSchema = z.object({
  id: z.number().min(1, { message: "Please enter a reference id." }),
  code: z.string().min(1, { message: "Please enter a code." }),
  name: z.string().min(1, { message: "Please enter a name." }),
  deletedAt: z.date().optional(),
  isShow: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  entityId: z.number().min(1, { message: "Please enter a entity id." }),
  entities: z
    .array(z.number())
    .min(1, { message: "Please enter atleast one entity id." })
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

export type IReference = z.infer<typeof ReferenceSchema>;
export type IAddReference = z.infer<typeof addReferenceSchema>;
export type IGetReference = z.infer<typeof getReferenceSchema>;
export type IGetReferencesByEntityId = z.infer<
  typeof getReferencesByEntityIdSchema
>;
export type IUpdateReference = z.infer<typeof updateReferenceSchema>;
export type IDeleteReferenceSchema = z.infer<typeof deleteReferenceSchema>;
