import { z } from "zod";

export const PatientSchema = z.object({
  id: z.string({
    required_error: "Please enter a patient Id.",
  }),
  firstName: z.string({
    required_error: "Please enter a first name.",
  }),
  lastName: z.string({
    required_error: "Please enter a last name.",
  }),
  middleInitial: z
    .string()
    .max(1, {
      message: "Middle initial must be a single character.",
    })
    .optional(),
  address: z.string({
    required_error: "Please enter a valid address.",
  }),
  dateOfBirth: z.date({
    required_error: "Please enter a valid date of birth.",
  }),
  civilStatusId: z.number({
    required_error: "Please enter a civil status ID.",
  }),
  age: z.number({
    required_error: "Please enter an age.",
  }),
  occupationId: z.number({
    required_error: "Please enter an occupation ID.",
  }),
  genderId: z.number({ required_error: "Please enter a gender ID." }),
  contactNumber: z.string().optional(),
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
