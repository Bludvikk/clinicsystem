import _ from 'lodash';
import { z } from 'zod';
import { params } from './common';

export const loginUserDtoSchema = z.object({
  email: z.string().min(1, { message: 'Please enter an email.' }).email(),
  password: z.string().min(1, { message: 'Please enter a password' })
});

export const userDtoSchema = z
  .object({
    userName: z.string().min(1, { message: 'Please enter a username.' }),
    email: z.string().min(1, { message: 'Please enter an email.' }).email(),
    password: z.string().min(1, { message: 'Please enter a password' }),
    firstName: z.string().min(1, { message: 'Please enter a first name.' }),
    lastName: z.string().min(1, { message: 'Please enter a last name.' }),
    middleInitial: z.string().max(1, { message: 'Middle initial must be a single character.' }).nullable().optional(),
    roleId: z.coerce.number().min(1, { message: 'Please select a role.' }),
    statusId: z.coerce.number().min(1, { message: 'Please select a status.' }),
    departmentId: z.coerce.number().nullable().optional()
  })
  .refine(formObj => {
    for (const key in formObj) {
      const val = _.get(formObj, key);

      //dropdown data which has 0 value
      if (!val && val === 0 && key.includes('Id')) {
        _.set(formObj, key, null);
      }
    }

    return formObj;
  });

export const postUserDtoSchema = z.object({
  params,
  body: userDtoSchema
});

export type UserDtoSchemaType = z.infer<typeof userDtoSchema>;
export type LoginUserDtoSchemaType = z.infer<typeof loginUserDtoSchema>;
export type PostUserDtoType = z.infer<typeof postUserDtoSchema>;

export type UserUnionFieldType = keyof UserDtoSchemaType;
