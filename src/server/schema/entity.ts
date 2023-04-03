import { z } from "zod";

export const EntitySchema = z.object({
  id: z.number().min(1, { message: "Please enter a entity id." }),
  code: z.string().min(1, { message: "Please enter a code." }),
  name: z.string().min(1, { message: "Please enter a name." }),
  deletedAt: z.date().optional(),
  isShow: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  isParent: z.boolean().default(false),
  parentId: z.number().optional(),
  fieldProp: z.string().optional(),
});

export const addEntitySchema = EntitySchema.omit({ id: true });
export const getEntitySchema = EntitySchema.pick({ id: true });
export const updateEntitySchema = EntitySchema;
export const deleteEntitySchema = EntitySchema.pick({ id: true });

export type IEntity = z.infer<typeof EntitySchema>;
export type IAddEntity = z.infer<typeof addEntitySchema>;
export type IGetEntity = z.infer<typeof getEntitySchema>;
export type IUpdateEntity = z.infer<typeof updateEntitySchema>;
export type IDeleteEntity = z.infer<typeof deleteEntitySchema>;
