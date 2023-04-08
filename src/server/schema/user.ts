import { z } from "zod";

export const userDtoSchema = z.object({
  id: z.string().min(1, { message: "Please enter a user id." }),
  userName: z.string().min(1, { message: "Please enter a username." }),
  email: z.string().min(1, { message: "Please enter an email." }).email(),
  password: z
    .string()
    .min(4, { message: "Password must contain atleast 4 characters" })
    .max(12, {
      message: "Password must not exceed 12 characters",
    }),
  firstName: z.string().min(1, { message: "Please enter a first name." }),
  lastName: z.string().min(1, { message: "Please enter a last name." }),
  middleInitial: z
    .string()
    .max(1, { message: "Middle initial must be a single character." })
    .optional(),
  roleId: z.coerce.number().min(1, { message: "Please select a role." }),
  statusId: z.coerce.number().min(1, { message: "Please select a status." }),
  departmentId: z.coerce.number().nullable().optional(),
});

export const loginUserDtoSchema = userDtoSchema.pick({
  email: true,
  password: true,
});

export const registerUserDtoSchema = userDtoSchema.omit({ id: true }).extend({
  terms: z.literal<boolean>(true, {
    errorMap: (issue, ctx) => {
      if (issue.code === "invalid_literal")
        return { message: "You need to accept our privacy policy & terms." };
      return { message: ctx.defaultError };
    },
  }),
});

export type UserDtoSchemaType = z.infer<typeof userDtoSchema>;
export type LoginUserDtoSchemaType = z.infer<typeof loginUserDtoSchema>;
export type RegisterUserDtoSchemaType = z.infer<typeof registerUserDtoSchema>;
