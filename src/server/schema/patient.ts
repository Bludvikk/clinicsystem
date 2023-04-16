import { NestedKeyOf } from "@/utils/helper";
import { z } from "zod";

const MedicationSchema = z.object({
  brandName: z.string().min(1, { message: "Please enter a brand name." }),
  dosage: z.string().min(1, { message: "Please enter a dosage." }),
  generic: z.string().min(1, { message: "Please enter a generic name." }),
});

export const PatientSchema = z.object({
  id: z.coerce.number().min(1, { message: "Please enter a patient id." }),
  firstName: z.string().min(1, { message: "Please enter a first name." }),
  lastName: z.string().min(1, { message: "Please enter a last name." }),
  middleInitial: z
    .string()
    .max(1, { message: "Middle initial must be a single character." })
    .nullable()
    .optional(),
  address: z.string().min(1, { message: "Please enter an address." }),
  dateOfBirth: z.coerce
    .date({
      errorMap: (issue, ctx) => {
        if (issue.code === "invalid_date")
          return { message: "Please enter a valid date of birth." };
        else return { message: ctx.defaultError };
      },
    })
    .min(new Date("1900-01-01"), { message: "Too old." })
    .max(new Date(), { message: "Too young." }),
  civilStatusId: z.coerce
    .number()
    .min(1, { message: "Please select a civil status." }),
  age: z.coerce.number().min(1, { message: "Please enter an age." }),
  occupationId: z.coerce
    .number()
    .min(1, { message: "Please select an occupation." }),
  genderId: z.coerce.number().min(1, { message: "Please enter a gender." }),
  contactNumber: z.string().nullable().optional(),
  familyHistory: z.object({
    diseases: z.array(z.coerce.number()).default([]),
    others: z.string().default("N/A"),
  }),
  personalHistory: z.object({
    smoking: z.coerce.number().default(0),
    alcohol: z.coerce.number().default(0),
    currentHealthCondition: z.string().default("N/A"),
    medications: z.array(MedicationSchema).default([]),
  }),
  pastMedicalHistory: z.object({
    hospitalized: z.string().default("N/A"),
    injuries: z.string().default("N/A"),
    surgeries: z.string().default("N/A"),
    allergies: z.string().default("N/A"),
    measles: z.string().default("N/A"),
    chickenPox: z.string().default("N/A"),
    others: z.string().default("N/A"),
  }),
  obGyne: z.object({
    menstrualCycle: z.coerce.date().nullable().optional(),
    days: z.coerce.number().default(0),
    p: z.coerce.number().default(0),
    g: z.coerce.number().default(0),
  }),
});

const diagnosisSchema = z.object({
  name: z.string().min(1, { message: "Please enter a diagnosis." }),
});

const treatmentSchema = z.object({
  medicineId: z.coerce
    .number()
    .min(1, { message: "Please select a treatment." }),
  signa: z.string().min(1, { message: "Please enter a signa." }),
});

const physicalCheckupSchema = z.object({
  id: z.coerce
    .number()
    .min(1, { message: "Please enter a physical checkup id" }),
  patientId: z.coerce
    .number()
    .min(1, { message: "Please enter a patient id." }),
  physicianId: z.coerce
    .number()
    .min(1, { message: "Please select a physician." }),
  vitalSignId: z.coerce
    .number()
    .min(1, { message: "Please enter a vital signs id." }),
  diagnoses: z
    .array(diagnosisSchema)
    .min(1, { message: "Please enter atleast one diagnosis." }),
  treatments: z
    .array(treatmentSchema)
    .min(1, { message: "Please enter atleast one treatment." }),
  dietaryAdviseGiven: z.string().default("N/A"),
  followUp: z
    .date()
    .min(new Date(), { message: "Invalid follow up date." })
    .nullable()
    .optional(),
});

const vitalSignSchema = z.object({
  id: z.coerce.number().min(1, { message: "Please enter a vital signs id." }),
  t: z.coerce
    .number()
    .min(1, { message: "Please enter a body temperature (T)." }),
  p: z.coerce.number().min(1, { message: "Please enter a pulse rate (P)." }),
  r: z.coerce
    .number()
    .min(1, { message: "Please enter a respiration rate (R)." }),
  bp: z.string().min(1, { message: "Please enter a blood pressure (BP)." }),
  wt: z.coerce.number().min(1, { message: "Please enter a weight (WT)." }),
  ht: z.coerce.number().min(1, { message: "Please enter a height (HT)." }),
  cbg: z.coerce
    .number()
    .min(1, { message: "Please enter capillary blood glucose (CBG)." }),
  patientId: z.coerce
    .number()
    .min(1, { message: "Please enter a patient Id." }),
  physicianId: z.coerce
    .number()
    .min(1, { message: "Please select a physician." }),
  receptionistId: z.coerce
    .number()
    .min(1, { message: "Please enter a receptionist id." }),
});

export const addPatientSchema = PatientSchema.omit({ id: true });
export const getPatientSchema = PatientSchema.pick({ id: true });
export const updatePatientSchema = PatientSchema;
export const deletePatientSchema = PatientSchema.pick({ id: true });
export const addMedicationSchema = MedicationSchema;

export const addDiagnosisSchema = diagnosisSchema;
export const addTreatmentSchema = treatmentSchema;
export const addPhysicalCheckupSchema = physicalCheckupSchema.omit({
  id: true,
});
export const getPhysicalCheckupSchema = physicalCheckupSchema.pick({
  id: true,
});
export const getPhysicalCheckupsByPatientIdSchema = physicalCheckupSchema.pick({
  patientId: true,
});
export const addVitalSignSchema = vitalSignSchema.omit({ id: true });
export const getvitalSignsByPhysicianIdSchema = vitalSignSchema.pick({
  physicianId: true,
});
export const getVitalSignsByIdSchema = vitalSignSchema.pick({ id: true });
export const updateVitalSignSchema = vitalSignSchema;

export type IPatient = z.infer<typeof PatientSchema>;
export type IAddPatient = z.infer<typeof addPatientSchema>;
export type IGetPatient = z.infer<typeof getPatientSchema>;
export type IUpdatePatient = z.infer<typeof updatePatientSchema>;
export type IDeletePatient = z.infer<typeof deletePatientSchema>;
export type IMedication = z.infer<typeof addMedicationSchema>;

export type IPhysicalCheckup = z.infer<typeof physicalCheckupSchema>;
export type IAddPhysicalCheckup = z.infer<typeof addPhysicalCheckupSchema>;
export type IGetPhysicalCheckup = z.infer<typeof getPhysicalCheckupSchema>;
export type IGetPhysicalCheckupsByPatientId = z.infer<
  typeof getPhysicalCheckupsByPatientIdSchema
>;
export type IAddVitalSign = z.infer<typeof addVitalSignSchema>;
export type IGetVitalSignsByPhysicianId = z.infer<
  typeof getvitalSignsByPhysicianIdSchema
>;
export type IGetVitalSignsById = z.infer<typeof getVitalSignsByIdSchema>;
export type IUpdateVitalSign = z.infer<typeof updateVitalSignSchema>;

export type IVitalSign = z.infer<typeof vitalSignSchema>;
export type IDiagnosis = z.infer<typeof diagnosisSchema>;
export type ITreatment = z.infer<typeof treatmentSchema>;

export type PatientUnionFieldType = NestedKeyOf<IPatient>;
export type MedicationUnionFieldType = NestedKeyOf<IMedication>;

export type PhysicalCheckupUnionFieldType = NestedKeyOf<IPhysicalCheckup>;
export type VitalSignUnionFieldType = NestedKeyOf<IVitalSign>;
export type DiagnosisUnionFieldType = NestedKeyOf<IDiagnosis>;
export type TreatmentUnionFieldType = NestedKeyOf<ITreatment>;
