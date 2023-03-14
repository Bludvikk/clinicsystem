import { z } from "zod";

export const addPatientSchema = z.object({
  firstName: z.string({
    required_error: "Please enter a first name.",
  }),
  lastName: z.string({
    required_error: "Please enter a last name.",
  }),
  middleInitial: z
    .string()
    .min(1, {
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

export const getPatientSchema = z.object({
  id: z.string({
    required_error: "Please enter a patient Id.",
  }),
});

export const updatePatientSchema = addPatientSchema.merge(
  z.object({
    id: z.string({
      required_error: "Please enter a patient Id.",
    }),
  })
);

export const deletePatientSchema = z.object({
  id: z.string({
    required_error: "Please enter a patient Id.",
  }),
});

export type IAddPatient = z.infer<typeof addPatientSchema>;
export type IGetPatient = z.infer<typeof getPatientSchema>;
export type IUpdatePatient = z.infer<typeof updatePatientSchema>;
export type IdeletePatient = z.infer<typeof deletePatientSchema>;
