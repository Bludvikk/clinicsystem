import React, { useEffect } from "react";
import { getReferences } from "@/server/hooks/reference";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Paper,
  ListItemText,
  List,
  ListItem,
  useTheme,
  DialogTitle,
} from "@mui/material";
import Icon from "@/@core/components/icon";
import StepperWrapper from "@/@core/styles/mui/stepper";
import StepperCustomDot from "@/views/forms/form-wizard/StepperCustomDot";
import { toast } from "react-hot-toast";
import { FormControlPropsType } from "@/utils/common.type";
import {
  IAddPatient,
  IMedication,
  MedicationUnionFieldType,
  PatientUnionFieldType,
  addMedicationSchema,
  addPatientSchema,
} from "@/server/schema/patient";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormObjectComponent,
  ListItemTextData,
  ListItemTextType,
} from "@/utils/form.component";
import { AgeFromDate } from "age-calculator";
import {
  useMedicationsStore,
  usePatientFormStore,
} from "@/utils/patient.store";
import moment from "moment";
import { getPatient, postPatient, putPatient } from "@/server/hooks/patient";
import { parseJSONWithDates } from "@/utils/helper";

const PatientHealthRecordDialog = () => {
  const { data: referencesData } = getReferences({ entities: [1, 2, 3, 10] });
  const theme = useTheme();

  const {
    id,
    onClosing,
    isSaving,
    showDialog,
    dialogTitle,
    steps,
    activeStep,
    setActiveStep,
  } = usePatientFormStore((state) => state);

  const { medications, onAdd, onDelete, onClear, onReplaceAll } =
    useMedicationsStore();
  const { mutate: postPatientMutate } = postPatient();
  const { mutate: putPatientMutate } = putPatient();
  const { data: patientData } = getPatient({ id });

  const defaultValues = {
    firstName: "",
    lastName: "",
    middleInitial: "",
    address: "",
    dateOfBirth: new Date(""),
    civilStatusId: 0,
    age: 0,
    occupationId: 0,
    genderId: 0,
    contactNumber: "N/A",
    familyHistory: {
      diseases: [],
      others: "N/A",
    },
    personalHistory: {
      smoking: 0,
      alcohol: 0,
      currentHealthCondition: "N/A",
      medications: [],
    },
    pastMedicalHistory: {
      hospitalized: "N/A",
      injuries: "N/A",
      surgeries: "N/A",
      allergies: "N/A",
      measles: "N/A",
      chickenPox: "N/A",
      others: "N/A",
    },
    obGyne: {
      menstrualCycle: null,
      days: 0,
      p: 0,
      g: 0,
    },
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IAddPatient>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(addPatientSchema),
  });

  const {
    control: medicationControl,
    handleSubmit: medicationHandleSubmit,
    reset: medicationReset,
    formState: { errors: medicationErrrors },
  } = useForm<IMedication>({
    defaultValues: {
      brandName: "",
      dosage: "",
      generic: "",
    },
    mode: "onChange",
    resolver: zodResolver(addMedicationSchema),
  });

  const PATIENT_HEALTH_RECORD_PANELS = [
    "PersonalInformation",
    "FamilyHistory",
    "PersonalHistory",
    "PastMedicalHistory",
    "Obgyne",
  ] as const;

  const PATIENT_HEALTH_RECORD_FIELDS: Record<
    (typeof PATIENT_HEALTH_RECORD_PANELS)[number],
    FormControlPropsType<PatientUnionFieldType>[]
  > = {
    PersonalInformation: [
      {
        label: "First Name",
        dbField: "firstName",
        type: "textField",
        required: true,
        extendedProps: { gridAttribute: { xs: 5 } },
      },
      {
        label: "Last Name",
        dbField: "lastName",
        type: "textField",
        required: true,
        extendedProps: { gridAttribute: { xs: 5 } },
      },
      {
        label: "Middle Initial",
        dbField: "middleInitial",
        type: "textField",
        required: true,
        extendedProps: { gridAttribute: { xs: 2 } },
      },
      {
        label: "Address",
        dbField: "address",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { multiline: true, rows: 3 },
        },
      },
      {
        label: "Date of Birth",
        dbField: "dateOfBirth",
        type: "datePicker",
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 6, lg: 5 } },
      },
      {
        label: "Civil Status",
        dbField: "civilStatusId",
        type: "dropDown",
        required: true,
        entityId: 3,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 5 },
        },
      },
      {
        label: "Age",
        dbField: "age",
        type: "textField",
        disabledErrors: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 2 },
          textFieldAttribute: {
            disabled: true,
            type: "number",
            inputProps: { min: 0 },
          },
        },
      },
      {
        label: "Occupation",
        dbField: "occupationId",
        type: "dropDown",
        required: true,
        entityId: 2,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 5 },
        },
      },
      {
        label: "Contact Number",
        dbField: "contactNumber",
        type: "textField",
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 5 },
        },
      },
      {
        label: "Gender",
        dbField: "genderId",
        type: "dropDown",
        required: true,
        entityId: 1,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 2 },
        },
      },
    ],
    FamilyHistory: [
      {
        label: "Diseases",
        dbField: "familyHistory.diseases",
        type: "multi-checkbox",
        required: true,
        entityId: 10,
        extendedProps: {
          gridAttribute: { xs: 6, md: 4, lg: 3 },
        },
      },
      {
        label: "Other",
        dbField: "familyHistory.others",
        type: "textField",
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { multiline: true, rows: 5 },
        },
      },
    ],
    PersonalHistory: [
      {
        label: "Smoking: (No. of sticks per day)",
        dbField: "personalHistory.smoking",
        type: "textField",
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { type: "number", inputProps: { min: 0 } },
        },
      },
      {
        label: "Alcohol: (No. of years)",
        dbField: "personalHistory.alcohol",
        type: "textField",
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { type: "number", inputProps: { min: 0 } },
        },
      },
      {
        label: "Present Health Condition",
        dbField: "personalHistory.currentHealthCondition",
        type: "textField",
        extendedProps: {
          gridAttribute: { xs: 12 },
        },
      },
    ],
    PastMedicalHistory: [
      {
        label: "Have you ever been hospitalized? If yes, when and Why?",
        dbField: "pastMedicalHistory.hospitalized",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
        },
      },
      {
        label:
          "Have you had any serious injuries and/or broken bones? If yes, please specify.",
        dbField: "pastMedicalHistory.injuries",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
        },
      },
      {
        label:
          "Have you undergone any surgeries? If yes, please specify and when?",
        dbField: "pastMedicalHistory.surgeries",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
        },
      },
      {
        label: "Do you have any allergies? If yes, please specify.",
        dbField: "pastMedicalHistory.allergies",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
        },
      },
      {
        label: "Have you had measles?",
        dbField: "pastMedicalHistory.measles",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
        },
      },
      {
        label: "Have you had chicken pox?",
        dbField: "pastMedicalHistory.chickenPox",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
        },
      },
      {
        label: "Others",
        dbField: "pastMedicalHistory.others",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
          },
          textFieldAttribute: { multiline: true, rows: 3 },
        },
      },
    ],
    Obgyne: [
      {
        label: "Menstrual Cycle",
        dbField: "obGyne.menstrualCycle",
        type: "datePicker",
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } },
      },
      {
        label: "Days",
        dbField: "obGyne.days",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
          textFieldAttribute: { type: "number", inputProps: { min: 0 } },
        },
      },
      {
        label: "G (Gravida)",
        dbField: "obGyne.g",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
          textFieldAttribute: { type: "number", inputProps: { min: 0 } },
        },
      },
      {
        label: "P (Para)",
        dbField: "obGyne.p",
        type: "textField",
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6,
          },
          textFieldAttribute: { type: "number", inputProps: { min: 0 } },
        },
      },
    ],
  };

  const PATIENT_REVIEW_PANELS: Record<
    (typeof PATIENT_HEALTH_RECORD_PANELS)[number],
    ListItemTextType[]
  > = {
    PersonalInformation: [
      {
        listItemTextAttribute: {
          primary: "First Name",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("firstName"),
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Last Name",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("lastName"),
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Middle Initial",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("middleInitial"),
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Date of Birth",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: moment(getValues("dateOfBirth")).format("L"),
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Age",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("age"),
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Gender",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: referencesData?.find(
            (ref) => ref.id === getValues("genderId")
          )?.name,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Civil Status",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: referencesData?.find(
            (ref) => ref.id === getValues("civilStatusId")
          )?.name,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Occupation",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: referencesData?.find(
            (ref) => ref.id === getValues("occupationId")
          )?.name,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Contact Number",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("contactNumber"),
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Address",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("address"),
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
    ],
    FamilyHistory: referencesData!
      ?.filter((ref) => ref.entityId === 10)
      .map(
        (disease) =>
          ({
            listItemTextAttribute: {
              primary: getValues("familyHistory.diseases").includes(
                disease.id
              ) ? (
                <Icon
                  icon="material-symbols:check-circle"
                  style={{ color: theme.palette.success.main }}
                />
              ) : (
                <Icon
                  icon="gridicons:cross-circle"
                  style={{ color: theme.palette.error.main }}
                />
              ),
              primaryTypographyProps: {
                sx: { mr: 2, display: "inline", verticalAlign: "middle" },
              },
              secondary: disease.name,
              secondaryTypographyProps: {
                sx: { display: "inline", verticalAlign: "middle" },
              },
            },
            gridAttribute: { xs: 6, sm: 4, md: 3 },
          } as ListItemTextType)
      )
      .concat([
        {
          listItemTextAttribute: {
            primary: "Others",
            primaryTypographyProps: { fontWeight: "bold" },
            secondary: getValues("familyHistory.others"),
            secondaryTypographyProps: { variant: "body2" },
          },
          gridAttribute: { xs: 12 },
        },
      ]),

    PersonalHistory: [
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant="body1" fontWeight="bold">
              Smoking
              <Typography variant="caption" ml={1}>
                (No. of sticks per day)
              </Typography>
            </Typography>
          ),
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("personalHistory.smoking")
            ? getValues("personalHistory.smoking")
            : 0,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 4, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant="body1" fontWeight="bold">
              Alcohol
              <Typography variant="caption" ml={1}>
                (No. of years)
              </Typography>
            </Typography>
          ),
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("personalHistory.alcohol")
            ? getValues("personalHistory.alcohol")
            : 0,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 4, lg: 2 },
      },
      {
        listItemTextAttribute: {
          primary: "Present Health Condition",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("personalHistory.currentHealthCondition")
            ? getValues("personalHistory.currentHealthCondition")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 4, lg: 2 },
      },
    ],
    PastMedicalHistory: [
      {
        listItemTextAttribute: {
          primary: "Have you ever been hospitalized? If yes, when and Why?",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("pastMedicalHistory.hospitalized")
            ? getValues("pastMedicalHistory.hospitalized")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
      {
        listItemTextAttribute: {
          primary:
            "Have you had any serious injuries and/or broken bones? If yes, please specify.",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("pastMedicalHistory.injuries")
            ? getValues("pastMedicalHistory.injuries")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
      {
        listItemTextAttribute: {
          primary:
            "Have you undergone any surgeries? If yes, please specify and when?",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("pastMedicalHistory.surgeries")
            ? getValues("pastMedicalHistory.surgeries")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
      {
        listItemTextAttribute: {
          primary: "Do you have any allergies? If yes, please specify.",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("pastMedicalHistory.allergies")
            ? getValues("pastMedicalHistory.allergies")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
      {
        listItemTextAttribute: {
          primary: "Have you had measles?",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("pastMedicalHistory.measles")
            ? getValues("pastMedicalHistory.measles")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
      {
        listItemTextAttribute: {
          primary: "Have you had chicken pox?",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("pastMedicalHistory.chickenPox")
            ? getValues("pastMedicalHistory.chickenPox")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
      {
        listItemTextAttribute: {
          primary: "Others",
          primaryTypographyProps: { fontWeight: "bold" },
          secondary: getValues("pastMedicalHistory.others")
            ? getValues("pastMedicalHistory.others")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 12 },
      },
    ],
    Obgyne: [
      {
        listItemTextAttribute: {
          primary: "Menstrual Cycle",
          primaryTypographyProps: {
            fontWeight: "bold",
          },
          secondary: getValues("obGyne.menstrualCycle")
            ? moment(getValues("obGyne.menstrualCycle")).format("L")
            : "N/A",
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6 },
      },
      {
        listItemTextAttribute: {
          primary: "Days",
          primaryTypographyProps: {
            fontWeight: "bold",
          },
          secondary: getValues("obGyne.days") ? getValues("obGyne.days") : 0,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6 },
      },
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant="body1" fontWeight="bold">
              OB Score:
              <Typography variant="caption" ml={1}>
                G (Gravida)
              </Typography>
            </Typography>
          ),
          primaryTypographyProps: {
            fontWeight: "bold",
          },
          secondary: getValues("obGyne.g") ? getValues("obGyne.g") : 0,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6 },
      },
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant="body1" fontWeight="bold">
              OB Score:
              <Typography variant="caption" ml={1}>
                P (Para)
              </Typography>
            </Typography>
          ),
          primaryTypographyProps: {
            fontWeight: "bold",
          },
          secondary: getValues("obGyne.p") ? getValues("obGyne.p") : 0,
          secondaryTypographyProps: { variant: "body2" },
        },
        gridAttribute: { xs: 6 },
      },
    ],
  };

  const PATIENT_MEDICATIONS_PANEL = ["Medications"] as const;
  const PATIENT_MEDICATIONS_FIELD: Record<
    (typeof PATIENT_MEDICATIONS_PANEL)[number],
    FormControlPropsType<MedicationUnionFieldType>[]
  > = {
    Medications: [
      {
        label: "Brand Name",
        dbField: "brandName",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 4 },
        },
      },
      {
        label: "Generic",
        dbField: "generic",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 3 },
        },
      },
      {
        label: "Dosage",
        dbField: "dosage",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 3 },
        },
      },
    ],
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleClose = () => {
    onClosing();
    setActiveStep(0);
    handleReset();
  };

  const handleReset = () => {
    reset();
    medicationReset();
    onClear();
  };

  const medicationOnSubmit: SubmitHandler<IMedication> = (
    data: IMedication
  ) => {
    medicationReset();
    onAdd(data);
  };

  const postPatientOnSubmit: SubmitHandler<IAddPatient> = (
    data: IAddPatient
  ) => {
    if (id) {
      putPatientMutate(
        { id, ...data },
        {
          onSuccess: (data) => {
            handleNext();
            handleReset();
            toast.success(data.message);
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      postPatientMutate(data, {
        onSuccess: (data) => {
          handleNext();
          handleReset();
          toast.success(data.message);
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const getLabelPropsError = (i: number) => {
    const labelProps: { error?: boolean } = {};

    if (i === activeStep) {
      labelProps.error = false;
      if (
        (errors.firstName ||
          errors.lastName ||
          errors.middleInitial ||
          errors.address ||
          errors.dateOfBirth ||
          errors.age ||
          errors.civilStatusId ||
          errors.occupationId ||
          errors.genderId) &&
        activeStep === 0
      ) {
        labelProps.error = true;
      } else {
        labelProps.error = false;
      }
    }

    return labelProps;
  };

  useEffect(() => {
    if (id && patientData) {
      const { occupation, gender, civilStatus, createdAt, updatedAt, ...data } =
        patientData;

      // solution tp problem - Prisma return Prisma.JsonValue type which is not match to my zod type or which ts can't infer the value type
      const JSONWithDatesData = parseJSONWithDates(
        JSON.stringify(data)
      ) as IAddPatient; // cast it to your desired type to have auto-complete
      reset(JSONWithDatesData);
      onReplaceAll(JSONWithDatesData.personalHistory.medications);
    }
  }, [id, patientData]);

  useEffect(() => {
    setValue("age", new AgeFromDate(getValues("dateOfBirth")).age);
  }, [watch("dateOfBirth")]);

  useEffect(() => {
    setValue("personalHistory.medications", medications);
  }, [medications]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} id="form-step-0" onSubmit={handleSubmit(handleNext)}>
            <Grid container spacing={5}>
              {PATIENT_HEALTH_RECORD_FIELDS["PersonalInformation"].map(
                (obj, i) => (
                  <Grid
                    item
                    key={obj.dbField}
                    {...obj.extendedProps?.gridAttribute}
                  >
                    <FormObjectComponent
                      key={i}
                      objFieldProp={obj}
                      control={control}
                      errors={errors}
                      getValues={getValues}
                      setValue={setValue}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </form>
        );

      case 1:
        return (
          <form key={1} id="form-step-1" onSubmit={handleSubmit(handleNext)}>
            <Grid container spacing={5}>
              {PATIENT_HEALTH_RECORD_FIELDS["FamilyHistory"].map((obj, i) =>
                obj.type === "multi-checkbox" ? (
                  <FormObjectComponent
                    key={i}
                    objFieldProp={obj}
                    control={control}
                    errors={errors}
                    getValues={getValues}
                    setValue={setValue}
                  />
                ) : (
                  <Grid
                    item
                    key={obj.dbField}
                    {...obj.extendedProps?.gridAttribute}
                  >
                    <FormObjectComponent
                      key={i}
                      objFieldProp={obj}
                      control={control}
                      errors={errors}
                      getValues={getValues}
                      setValue={setValue}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </form>
        );

      case 2:
        return (
          <form key={2} id="form-step-2" onSubmit={handleSubmit(handleNext)}>
            <Grid container spacing={6}>
              <Grid container item spacing={5} xs={12} md={6}>
                {PATIENT_HEALTH_RECORD_FIELDS["PersonalHistory"].map(
                  (obj, i) => (
                    <Grid
                      item
                      key={obj.dbField}
                      {...obj.extendedProps?.gridAttribute}
                    >
                      <FormObjectComponent
                        key={i}
                        objFieldProp={obj}
                        control={control}
                        errors={errors}
                        getValues={getValues}
                        setValue={setValue}
                      />
                    </Grid>
                  )
                )}
              </Grid>
              <Grid
                container
                item
                spacing={5}
                xs={12}
                md={6}
                alignItems="start"
              >
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold">
                    Medication Taken Regularly
                  </Typography>
                </Grid>
                {PATIENT_MEDICATIONS_FIELD["Medications"].map((obj, i) => (
                  <Grid
                    item
                    key={obj.dbField}
                    {...obj.extendedProps?.gridAttribute}
                  >
                    <FormObjectComponent
                      key={i}
                      objFieldProp={obj}
                      control={medicationControl}
                      errors={medicationErrrors}
                    />
                  </Grid>
                ))}

                <Grid item xs={1} sx={{ p: 0 }}>
                  <IconButton
                    color="primary"
                    onClick={medicationHandleSubmit(medicationOnSubmit)}
                  >
                    <Icon icon="material-symbols:add-circle" fontSize={45} />
                  </IconButton>
                </Grid>

                <Box display="flex" width="100%">
                  <Paper
                    elevation={3}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      height: 200,
                      mt: 2,
                      ml: 5,
                      p: 5,
                      backgroundColor: (theme) => theme.palette.grey[100],
                    }}
                  >
                    <List
                      sx={{
                        height: 180,
                        overflowY: "auto",
                      }}
                      dense
                    >
                      {medications &&
                        medications.length > 0 &&
                        medications.map((medication, i) => (
                          <ListItem
                            key={i}
                            secondaryAction={
                              <IconButton
                                type="button"
                                color="secondary"
                                onClick={() => onDelete(i)}
                              >
                                <Icon icon="mdi:delete-outline" fontSize={20} />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              sx={{ m: 0, width: "50%" }}
                              primary={medication.brandName}
                              primaryTypographyProps={{
                                sx: { fontWeight: "bold" },
                              }}
                              secondary={medication.generic}
                              secondaryTypographyProps={{ variant: "body2" }}
                            />
                            <ListItemText
                              primary={medication.dosage}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </form>
        );

      case 3:
        return (
          <form key={3} id="form-step-3" onSubmit={handleSubmit(handleNext)}>
            <Grid container spacing={5}>
              {PATIENT_HEALTH_RECORD_FIELDS["PastMedicalHistory"].map(
                (obj, i) => (
                  <Grid
                    item
                    key={obj.dbField}
                    {...obj.extendedProps?.gridAttribute}
                  >
                    <FormObjectComponent
                      key={i}
                      objFieldProp={obj}
                      control={control}
                      errors={errors}
                      getValues={getValues}
                      setValue={setValue}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </form>
        );

      case 4:
        return (
          <form key={0} id="form-step-4" onSubmit={handleSubmit(handleNext)}>
            <Grid container spacing={5}>
              {PATIENT_HEALTH_RECORD_FIELDS["Obgyne"].map((obj, i) => (
                <Grid
                  item
                  key={obj.dbField}
                  {...obj.extendedProps?.gridAttribute}
                >
                  <FormObjectComponent
                    key={i}
                    objFieldProp={obj}
                    control={control}
                    errors={errors}
                    getValues={getValues}
                    setValue={setValue}
                  />
                </Grid>
              ))}
            </Grid>
          </form>
        );

      case 5:
        return (
          <>
            <Typography variant="body1" fontWeight="bold">
              {steps[0]}
            </Typography>
            <Divider sx={{ width: "100%" }} />
            <Grid container>
              {PATIENT_REVIEW_PANELS["PersonalInformation"].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Typography variant="body1" fontWeight="bold" mt={5}>
              {steps[1]}
            </Typography>
            <Divider sx={{ width: "100%" }} />
            <Grid container>
              {PATIENT_REVIEW_PANELS["FamilyHistory"].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Typography variant="body1" fontWeight="bold" mt={5}>
              {steps[2]}
            </Typography>
            <Divider sx={{ width: "100%" }} />
            <Grid container>
              {PATIENT_REVIEW_PANELS["PersonalHistory"].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
              <Grid item xs={12} md={12} lg={6}>
                <Typography variant="body1" fontWeight="bold">
                  Any Medication Taken Regularly
                </Typography>
                <Box display="flex" width="100%">
                  <Paper
                    elevation={3}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      height: 200,
                      mt: 2,
                      p: 5,
                      backgroundColor: (theme) => theme.palette.grey[100],
                    }}
                  >
                    <List
                      sx={{
                        height: 180,
                        overflowY: "auto",
                      }}
                      dense
                    >
                      {medications &&
                        medications.length > 0 &&
                        medications.map((medication, i) => (
                          <ListItem key={i}>
                            <ListItemText
                              sx={{ m: 0, width: "50%" }}
                              primary={medication.brandName}
                              primaryTypographyProps={{
                                sx: { fontWeight: "bold" },
                              }}
                              secondary={medication.generic}
                              secondaryTypographyProps={{ variant: "body2" }}
                            />
                            <ListItemText
                              primary={medication.dosage}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="body1" fontWeight="bold" mt={5}>
              {steps[3]}
            </Typography>
            <Divider sx={{ width: "100%" }} />
            <Grid container>
              {PATIENT_REVIEW_PANELS["PastMedicalHistory"].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Typography variant="body1" fontWeight="bold" mt={5}>
              {steps[4]}
            </Typography>
            <Divider sx={{ width: "100%" }} />
            <Grid container>
              {PATIENT_REVIEW_PANELS["Obgyne"].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
          </>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <>
          <Typography
            variant="h5"
            textAlign="center"
            component="h2"
            fontWeight="bold"
          >
            ACTION COMPLETED!
          </Typography>
          <Typography variant="subtitle2" textAlign="center">
            Click "Again" button to add another patient health record.
          </Typography>
          <Grid container>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
              <Button size="large" onClick={() => handleClose()} sx={{ mr: 3 }}>
                Close
              </Button>

              <Button
                size="large"
                variant="contained"
                onClick={() => setActiveStep(0)}
              >
                Again
              </Button>
            </Grid>
          </Grid>
        </>
      );
    } else {
      return (
        <Grid container>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 5,
              }}
            >
              {steps[activeStep]}{" "}
              {steps[activeStep] === steps[steps.length - 1] && (
                <Typography variant="caption" ml={1}>
                  (All steps are completed! Please review all the details
                  below.)
                </Typography>
              )}
            </Typography>
          </Grid>
          {getStepContent(activeStep)}
          <Grid
            mt={5}
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "end" }}
          >
            {activeStep === 0 ? (
              <Button size="large" onClick={() => handleClose()} sx={{ mr: 3 }}>
                Cancel
              </Button>
            ) : (
              <Button size="large" onClick={handleBack} sx={{ mr: 3 }}>
                Previous
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                form={`form-step-${activeStep}`}
                size="large"
                variant="contained"
                type="submit"
                onClick={handleSubmit(postPatientOnSubmit)}
              >
                Submit
              </Button>
            ) : (
              <Button
                form={`form-step-${activeStep}`}
                size="large"
                variant="contained"
                type="submit"
              >
                Next
              </Button>
            )}
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <Dialog open={showDialog} fullWidth maxWidth="lg" scroll="paper">
      <DialogContent sx={{ p: 6 }}>
        <DialogTitle textAlign="center" variant="h5">
          {dialogTitle} Patient Health Record
        </DialogTitle>

        <Box my={5}>
          <StepperWrapper>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((title, i) => {
                return (
                  <Step key={i}>
                    <StepLabel
                      {...getLabelPropsError(i)}
                      StepIconComponent={StepperCustomDot}
                    >
                      <Box className="step-label">
                        <Box width={120}>
                          <Typography className="step-title">
                            {title}
                          </Typography>
                        </Box>
                      </Box>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </StepperWrapper>
        </Box>
        <Divider sx={{ m: "0 !important" }} />
        <Box sx={{ mt: 5, px: 5 }}>{renderContent()}</Box>
      </DialogContent>
    </Dialog>
  );
};

export default PatientHealthRecordDialog;
