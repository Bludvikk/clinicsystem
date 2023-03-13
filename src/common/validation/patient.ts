import { z } from "zod";

export const addPatientSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name must be a string",
    })
    .trim(),
  lastName: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be a string ",
    })
    .trim(),
  middleInitial: z
    .string({
      invalid_type_error: "Middle initial must be a string",
    })
    .min(1, {
      message: "Middle initial must be a single character.",
    })
    .trim(),
  address: z
    .string({
      required_error: "Address is required",
      invalid_type_error: "Address must be a string",
    })
    .trim(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Date of birth must be a date",
  }),
  civilStatus: z.string({
    required_error: "Civil status is required",
    invalid_type_error: "Civil status must be a string",
  }),
  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }),
  occupation: z
    .string({
      invalid_type_error: "Occupation must be a string",
    })
    .trim(),
  gender: z.string({
    required_error: "Gender is required",
    invalid_type_error: "Gender must be a string",
  }),
  contactNumber: z
    .string({
      invalid_type_error: "Contact number must be a string",
    })
    .trim(),
  isBronchialAsthma: z
    .boolean({
      invalid_type_error: "isBronchialAsthma must be a boolean",
    })
    .default(false),
  isPulmonaryTuberculosis: z.boolean({
    invalid_type_error: "isPulmonaryTuberculosis must be a boolean",
  }),
  isHypertension: z.boolean({
    invalid_type_error: "isHypertension must be a boolean",
  }),
  isDiabetesMellitus: z.boolean({
    invalid_type_error: "isDiabetesMellitus must be a boolean",
  }),
  isHearthDisease: z.boolean({
    invalid_type_error: "isHearthDisease must be a boolean",
  }),
  isCancer: z.boolean({
    invalid_type_error: "isCancer must be a boolean",
  }),
  familyHistoryOthers: z
    .string({
      invalid_type_error: "Other family history must be a string",
    })
    .optional(),
  isSmoking: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a string" }).default("N/A"),
  ]),
  isAlcohol: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a number" }).default("N/A"),
  ]),
  currentHealthCondition: z.string({
    required_error: "Present health conditions is required",
    invalid_type_error: "Present health conditions must be a string",
  }),
  medications: z.object({
    brandName: z.string({
      invalid_type_error: "Brand name must be a string",
    }),
    generic: z.string({ invalid_type_error: "Generic must be string" }),
    dosage: z.string({ invalid_type_error: "Dosage must be string" }),
  }),
  isHospitalized: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a string" }).default("N/A"),
  ]),
  isInjuries: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a string" }).default("N/A"),
  ]),
  isSurgeries: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a string" }).default("N/A"),
  ]),
  isAllergies: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a string" }).default("N/A"),
  ]),
  isMeasles: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a string" }).default("N/A"),
  ]),
  isChickenPox: z.tuple([
    z.string({ invalid_type_error: "Element must be a string" }).default("no"),
    z.string({ invalid_type_error: "Element must be a string" }).default("N/A"),
  ]),
  PastMedicalHistoryOthers: z
    .string({
      invalid_type_error: "Other past medical history must be a string",
    })
    .optional(),
  menstrualCycle: z.date({
    required_error: "Menstrual cycle is required",
    invalid_type_error: "Menstrual cycle must be a date",
  }),
  days: z.number({ invalid_type_error: "Days must be a number" }),
});

export const getPatientSchema = z.object({
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
});

export const updatePatientSchema = addPatientSchema.merge(
  z.object({
    id: z.string({
      required_error: "Id is required",
      invalid_type_error: "Id must be a string",
    }),
  })
);

export const deletePatientSchema = z.object({
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
});

export type IAddPatient = z.infer<typeof addPatientSchema>;
export type IGetPatient = z.infer<typeof getPatientSchema>;
export type IUpdatePatient = z.infer<typeof updatePatientSchema>;
export type IdeletePatient = z.infer<typeof deletePatientSchema>;
