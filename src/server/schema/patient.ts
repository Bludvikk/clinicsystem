import { object, z } from "zod";
import { params } from "./common";


const MedicationSchema = z.object({
  brandName: z.string().min(1, { message: "Please enter a brand name"}),
  dosage: z.string().min(1, {message: "Please enter a dosage"}),
  generic: z.string().min(1, {message: 'Please enter a generic name'})
})
export const PatientSchema = z.object({
  id: z.string({
    required_error: "Please enter a patient Id.",
  }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleInitial: z.string().max(1, {
    message: "Middle initial must be a single character.",
  }),
  address: z.string().min(1, { message: "Please enter a valid address" }),
  dateOfBirth: z
    .date()
    .min(new Date("1900-01-01"), { message: "Too old" })
    .max(new Date(), { message: "Too young!" }),
  civilStatusId: z.number().min(1, {message: 'please select a civil status'}),
  age: z.number().min(1, { message: "Age is required" }),
  occupationId: z.number().min(1, { message: 'Please select an occupation'}),
  genderId: z.number().min(1, { message: 'Please select a gender'}),
  contactNumber: z.string(),
  familyHistory: z.object({
    diseases: z.array(z.number()).default([]),
    others: z.string().default('N/A')
  }),
  personalHistory: z.object({
    smoking: z.number({
      invalid_type_error: "No. of sticks per day must be a number"
    }).default(0),
    alcohol: z.number({
      invalid_type_error: "No. of years must be a number"
    }).default(0),
    currentHealthCondition: z.string().default('N/A'),
    medications: z.array(MedicationSchema).default([])
  }),
  pastMedicalHistory: z.object({
    hospitalized: z.string().default('N/A'),
    injuries: z.string().default('N/A'),
    surgeries: z.string().default('N/A'),
    allergies: z.string().default('N/A'),
    measles: z.string().default('N/A'),
    chickenPox: z.string().default('N/A'),
    others: z.string().default('N/A'),
  }),
  obGyne: z.object({
    menstrualCycle: z.date().nullable().optional(),
    days: z.number({ invalid_type_error: "days must be a number"}).default(0),
    p: z.number({ invalid_type_error: "P (PARA) must be a number"}).nullable().optional().default(0),
    g: z.number({ invalid_type_error: "G (GRAVIDA) must be a number"}).nullable().optional().default(0),
  }),
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
  body: PatientSchema,
});


type NestedKeyOf<ObjectType extends object> =
{[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
: `${Key}`
}[keyof ObjectType & (string | number)];


export type PatientDtoSchemaType = z.TypeOf<typeof PatientSchema>;
export type PostPatientDtoType = z.TypeOf<typeof postPatientDtoSchema>;
export type PatientUnionFieldType = NestedKeyOf<PatientDtoSchemaType>;
