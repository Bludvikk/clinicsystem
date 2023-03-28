import { object, z } from "zod";
import { params } from "./common";

export const PatientSchema = z.object({
  id: z.string({
    required_error: "Please enter a patient Id.",
  }),
  firstName: z.string().min(1, {message: 'First name is required'}),
  lastName: z.string().min(1, {message: 'Last name is required'}),
  middleInitial: z
    .string()
    .max(1, {
      message: "Middle initial must be a single character.",
    }),
  address: z.string().min(1, {message: 'Please enter a valid address'}),
  dateOfBirth: z.date().min(new Date("1900-01-01"), { message: "Too old" }).max(new Date(), { message: "Too young!" }),
  civilStatusId: z.number({
    required_error: "Please enter a civil status ID.",
  }),
  age: z.number().min(1, {message: 'Age is required'}),
  occupationId: z.number({
    required_error: "Please enter an occupation ID.",
  }),
  genderId: z.number({ required_error: "Please enter a gender ID." }),
  contactNumber: z.string(),
  familyHistory: z.any(),
  personalHistory: z.any(),
  pastMedicalHistory: z.any(),
  obGyne: z.any(),
});

export const addPatientSchema = PatientSchema.omit({ id: true });
export const getPatientSchema = PatientSchema.pick({ id: true });
export const updatePatientSchema = PatientSchema;
export const deletePatientSchema = PatientSchema.pick({ id: true });

export type IPatient = z.infer<typeof PatientSchema>;
export type IAddPatient = z.infer<typeof addPatientSchema>;
export type IGetPatient = z.infer<typeof getPatientSchema>;
export type IUpdatePatient = z.infer<typeof updatePatientSchema>;
export type IDeletePatient = z.infer<typeof deletePatientSchema>;


export const postPatientDtoSchema = z.object({
  params,
  body: PatientSchema
})

export type PatientDtoSchemaType = z.TypeOf<typeof PatientSchema>
export type PostPatientDtoType = z.TypeOf<typeof postPatientDtoSchema>
export type PatientUnionFieldType = keyof PatientDtoSchemaType
