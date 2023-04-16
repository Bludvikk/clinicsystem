import {
  addPatientSchema,
  IAddPatient,
  IMedication,
  addMedicationSchema,
  PatientUnionFieldType,
} from "@/server/schema/patient";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/system";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { ChangeEvent, FormEvent, useEffect, useId, useState } from "react";
import { AgeFromDate } from "age-calculator";

import { postPatient } from "@/server/hooks/patient";
import { toast } from "react-hot-toast";
import { getReferences } from "@/server/hooks/reference";
import { FormControlPropsType } from "@/utils/common.type";
import { FormObjectComponent } from "@/utils/form.component";

const PatientForm = () => {
  const [medications, setMedications] = useState<IMedication[]>([]);

  const { mutateAsync: postPatientMutateAsync, status: postPatientStatus } =
    postPatient();

  const { data: referencesData, status: referencesDataStatus } = getReferences({
    entities: [1, 2, 3],
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    middleInitial: "",
    address: "",
    dateOfBirth: new Date(),
    civilStatusId: 0,
    age: 0,
    occupationId: 0,
    genderId: 0,
    contactNumber: "",
    familyHistory: {
      diseases: [],
      others: "N/A",
    },
    personalHistory: {
      smoking: 0,
      alcohol: 0,
      currentHealthCondition: "",
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
      menstrualCycle: new Date(),
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

  const [age, setAge] = useState(0);
  const dateOfBirthWatch = watch("dateOfBirth");

  const {
    reset: reset2,
    control: control2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    formState: { errors: errors2 },
  } = useForm<IMedication>({
    defaultValues: {
      brandName: "",
      dosage: "",
      generic: "",
    },
    mode: "onChange",
    resolver: zodResolver(addMedicationSchema),
  });

  const medicationOnSubmitHandler: SubmitHandler<IMedication> = (
    data: IMedication,
    e: any
  ) => {
    reset2();
    setMedications((prev) => [...prev, { ...data }]);
  };

  const addPatientOnSubmitHandler: SubmitHandler<IAddPatient> = async (
    data: IAddPatient
  ) => {
    try {
      const result = await postPatientMutateAsync(data);
      if (result.data) {
        toast.success(result.message);
      } else {
        toast.error("something went wrong.");
      }
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFamilyHistoryDisease = (e: ChangeEvent<HTMLInputElement>) => {
    const currentDiseasesValue = getValues("familyHistory.diseases");

    if (e.target.checked)
      setValue("familyHistory.diseases", [
        ...currentDiseasesValue,
        parseInt(e.target.value),
      ]);
    else {
      const filterValue = currentDiseasesValue.filter(
        (value) => value !== parseInt(e.target.value)
      );
      setValue("familyHistory.diseases", [...filterValue]);
    }
  };

  console.log(errors);

  useEffect(() => {
    setValue("personalHistory.medications", medications);
  }, [medications]);

  useEffect(() => {
    setValue("age", new AgeFromDate(getValues("dateOfBirth")).age);
  }, [dateOfBirthWatch]);

  const PATIENT_PANEL = ["General"] as const;
  const PATIENT_FIELDS: Record<
    typeof PATIENT_PANEL[number],
    FormControlPropsType<PatientUnionFieldType>[]
  > = {
    General: [
      {
        label: "First Name",
        dbField: "firstName",
        type: "textField",
        required: true,
        autoFocus: true,
        extendedProps: { textFieldAttribute: { sx: { width: 200 } } },
      },
      {
        label: "Last Name",
        dbField: "lastName",
        type: "textField",
        required: true,
        extendedProps: {
          textFieldAttribute: {
            margin: "dense",
            sx: { backgroundColor: "red" },
          },
        },
      },
      {
        label: "Middle Initial",
        dbField: "middleInitial",
        type: "textField",
        required: true,
        extendedProps: {
          textFieldAttribute: { margin: "dense", rows: 5, multiline: true },
        },
      },
      {
        label: "Gender",
        dbField: "genderId",
        type: "dropDown",
        required: true,
        autoFocus: true,
        entityId: 1,
        extendedProps: {},
      },
      {
        label: "Date of Birth",
        type: "datePicker",
        dbField: "dateOfBirth",
        autoFocus: true,
        required: true,
        extendedProps: {},
      },
    ],
  };

  return (
    // <Box>
    //   <pre>{JSON.stringify(watch(), null, 2)}</pre>
    //   <form onSubmit={handleSubmit(addPatientOnSubmitHandler)}>
    //     <Controller
    //       name="firstName"
    //       control={control}
    //       render={({ field }) => (
    //         <TextField
    //           {...field}
    //           name="firstName"
    //           label="First Name"
    //           variant="outlined"
    //         />
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["firstName"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="lastName"
    //       control={control}
    //       render={({ field }) => (
    //         <TextField
    //           {...field}
    //           name="lastName"
    //           label="Last Name"
    //           variant="outlined"
    //         />
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["lastName"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="middleInitial"
    //       control={control}
    //       render={({ field }) => (
    //         <TextField
    //           {...field}
    //           name="middleInitial"
    //           label="Middle Initial"
    //           variant="outlined"
    //         />
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["middleInitial"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="address"
    //       control={control}
    //       render={({ field }) => (
    //         <TextField
    //           {...field}
    //           name="address"
    //           label="Address"
    //           variant="outlined"
    //         />
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["address"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="dateOfBirth"
    //       control={control}
    //       render={({ field }) => (
    //         <DatePicker {...field} label="Date of Birth" />
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["dateOfBirth"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="civilStatusId"
    //       control={control}
    //       render={({ field }) => (
    //         <Select
    //           label="Civil Status"
    //           disabled={referencesDataStatus === "loading"}
    //           variant="outlined"
    //           placeholder="Civil Status"
    //           {...field}
    //         >
    //           {referencesData &&
    //             referencesData?.length > 0 &&
    //             referencesData
    //               .filter((reference) => reference.entityId === 3)
    //               .map((civilStatus) => (
    //                 <MenuItem key={civilStatus.id} value={civilStatus.id}>
    //                   {civilStatus.name}
    //                 </MenuItem>
    //               ))}
    //         </Select>
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["civilStatusId"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="age"
    //       control={control}
    //       render={({ field }) => (
    //         <TextField
    //           {...field}
    //           name="age"
    //           disabled
    //           label="Age"
    //           type="number"
    //           variant="outlined"
    //           InputLabelProps={{ shrink: true }}
    //         />
    //       )}
    //     />

    //     <Controller
    //       name="occupationId"
    //       control={control}
    //       render={({ field }) => (
    //         <Select
    //           label="Civil Status"
    //           disabled={referencesDataStatus === "loading"}
    //           variant="outlined"
    //           placeholder="Occupation"
    //           {...field}
    //         >
    //           {referencesData &&
    //             referencesData?.length > 0 &&
    //             referencesData
    //               .filter((reference) => reference.entityId === 2)
    //               .map((occupation) => (
    //                 <MenuItem key={occupation.id} value={occupation.id}>
    //                   {occupation.name}
    //                 </MenuItem>
    //               ))}
    //         </Select>
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["occupationId"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="genderId"
    //       control={control}
    //       render={({ field }) => (
    //         <Select
    //           label="Gender"
    //           disabled={referencesDataStatus === "loading"}
    //           variant="outlined"
    //           placeholder="Gender"
    //           {...field}
    //         >
    //           {referencesData &&
    //             referencesData?.length > 0 &&
    //             referencesData
    //               .filter((reference) => reference.entityId === 1)
    //               .map((gender) => (
    //                 <MenuItem key={gender.id} value={gender.id}>
    //                   {gender.name}
    //                 </MenuItem>
    //               ))}
    //         </Select>
    //       )}
    //     />
    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["genderId"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Controller
    //       name="contactNumber"
    //       control={control}
    //       render={({ field }) => (
    //         <TextField
    //           {...field}
    //           name="contactNumber"
    //           label="Contact Number"
    //           variant="outlined"
    //         />
    //       )}
    //     />

    //     <Box>
    //       <FormHelperText sx={{ color: "error.main" }}>
    //         {errors["contactNumber"]?.message}
    //       </FormHelperText>
    //     </Box>

    //     <Box>
    //       <Typography>Family History </Typography>
    //       <Controller
    //         name="familyHistory.diseases"
    //         control={control}
    //         render={({ field }) => (
    //           <FormControlLabel
    //             control={
    //               <Checkbox
    //                 {...field}
    //                 value={1}
    //                 name="familyHistory.diseases"
    //                 onChange={handleFamilyHistoryDisease}
    //               />
    //             }
    //             label="Bronchial Asthma"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="familyHistory.diseases"
    //         control={control}
    //         render={({ field }) => (
    //           <FormControlLabel
    //             control={
    //               <Checkbox
    //                 {...field}
    //                 value={2}
    //                 name="familyHistory.diseases"
    //                 onChange={handleFamilyHistoryDisease}
    //               />
    //             }
    //             label="Pulmonary Tuberculosis"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="familyHistory.diseases"
    //         control={control}
    //         render={({ field }) => (
    //           <FormControlLabel
    //             control={
    //               <Checkbox
    //                 {...field}
    //                 value={3}
    //                 name="familyHistory.diseases"
    //                 onChange={handleFamilyHistoryDisease}
    //               />
    //             }
    //             label="Pulmonary Tuberculosis"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="familyHistory.diseases"
    //         control={control}
    //         render={({ field }) => (
    //           <FormControlLabel
    //             control={
    //               <Checkbox
    //                 {...field}
    //                 value={4}
    //                 name="familyHistory.diseases"
    //                 onChange={handleFamilyHistoryDisease}
    //               />
    //             }
    //             label="Diabetes Mellitus"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="familyHistory.diseases"
    //         control={control}
    //         render={({ field }) => (
    //           <FormControlLabel
    //             control={
    //               <Checkbox
    //                 {...field}
    //                 value={5}
    //                 name="familyHistory.diseases"
    //                 onChange={handleFamilyHistoryDisease}
    //               />
    //             }
    //             label="Hearth Disease"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="familyHistory.diseases"
    //         control={control}
    //         render={({ field }) => (
    //           <FormControlLabel
    //             control={
    //               <Checkbox
    //                 {...field}
    //                 value={6}
    //                 name="familyHistory.diseases"
    //                 onChange={handleFamilyHistoryDisease}
    //               />
    //             }
    //             label="Cancer"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="familyHistory.others"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="familyHistory.others"
    //             label="Others"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //     </Box>

    //     <Box>
    //       <Typography>Personal History </Typography>

    //       <Controller
    //         name="personalHistory.smoking"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             type="number"
    //             name="personalHistory.smoking"
    //             label="Smoking"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //       <Box>
    //         <FormHelperText sx={{ color: "error.main" }}>
    //           {errors.personalHistory?.smoking?.message}
    //         </FormHelperText>
    //       </Box>

    //       <Controller
    //         name="personalHistory.alcohol"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             type="number"
    //             name="personalHistory.alcohol"
    //             label="Alcohol"
    //             variant="outlined"
    //             InputLabelProps={{ shrink: true }}
    //             inputProps={{ min: 0, valueasnumber: "true" }}
    //             onChange={(e) => field.onChange(parseInt(e.target.value))}
    //           />
    //         )}
    //       />
    //       <Box>
    //         <FormHelperText sx={{ color: "error.main" }}>
    //           {errors.personalHistory?.alcohol?.message}
    //         </FormHelperText>
    //       </Box>
    //     </Box>

    //     <Controller
    //       name="personalHistory.currentHealthCondition"
    //       control={control}
    //       render={({ field }) => (
    //         <TextField
    //           {...field}
    //           name="personalHistory.currentHealthCondition"
    //           label="Others"
    //           variant="outlined"
    //         />
    //       )}
    //     />

    //     <Typography>Medications</Typography>

    //     <form>
    //       <Controller
    //         name="brandName"
    //         control={control2}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="brandName"
    //             label="Brand Name"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //       <Box>
    //         <FormHelperText sx={{ color: "error.main" }}>
    //           {errors2.brandName?.message}
    //         </FormHelperText>
    //       </Box>
    //       <Controller
    //         name="dosage"
    //         control={control2}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="dosage"
    //             label="Dosage"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //       <Box>
    //         <FormHelperText sx={{ color: "error.main" }}>
    //           {errors2.dosage?.message}
    //         </FormHelperText>
    //       </Box>
    //       <Controller
    //         name="generic"
    //         control={control2}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="generic"
    //             label="Generic"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //       <Box>
    //         <FormHelperText sx={{ color: "error.main" }}>
    //           {errors2.generic?.message}
    //         </FormHelperText>
    //       </Box>

    //       <Button
    //         type="button"
    //         variant="contained"
    //         onClick={handleSubmit2(medicationOnSubmitHandler)}
    //       >
    //         Add
    //       </Button>

    //       {/* TODO: add id for delete and edit medications */}
    //       {medications.length > 0 &&
    //         medications.map((medication, i) => (
    //           <Box display="flex" key={i}>
    //             <Typography>BrandName: {medication.brandName}</Typography>
    //             <Typography>Dosage: {medication.dosage}</Typography>
    //             <Typography>Generic: {medication.generic}</Typography>
    //           </Box>
    //         ))}
    //     </form>

    //     <Box>
    //       <Typography>Past Medical History</Typography>
    //       <Controller
    //         name="pastMedicalHistory.hospitalized"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="pastMedicalHistory.hospitalized"
    //             label="Hospitalized?"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //       <Controller
    //         name="pastMedicalHistory.injuries"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="pastMedicalHistory.injuries"
    //             label="Injuries?"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //       <Controller
    //         name="pastMedicalHistory.surgeries"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="pastMedicalHistory.surgeries"
    //             label="Surgeries?"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //       <Controller
    //         name="pastMedicalHistory.allergies"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="pastMedicalHistory.allergies"
    //             label="Allergies?"
    //             variant="outlined"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="pastMedicalHistory.measles"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="pastMedicalHistory.measles"
    //             label="Measles?"
    //             variant="outlined"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="pastMedicalHistory.chickenPox"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="pastMedicalHistory.chickenPox"
    //             label="ChickenPox?"
    //             variant="outlined"
    //           />
    //         )}
    //       />

    //       <Controller
    //         name="pastMedicalHistory.others"
    //         control={control}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             name="pastMedicalHistory.others"
    //             label="Others?"
    //             variant="outlined"
    //           />
    //         )}
    //       />

    //       <Box>
    //         <Typography>ObGyne</Typography>
    //         <Controller
    //           name="obGyne.menstrualCycle"
    //           control={control}
    //           render={({ field }) => (
    //             <DatePicker {...field} label="Menstrual Cycle" />
    //           )}
    //         />

    //         <Controller
    //           name="obGyne.days"
    //           control={control}
    //           render={({ field }) => (
    //             <TextField
    //               {...field}
    //               name="days"
    //               label="Days"
    //               type="number"
    //               variant="outlined"
    //               InputLabelProps={{ shrink: true }}
    //               inputProps={{ min: 0, valueasnumber: "true" }}
    //               onChange={(e) => field.onChange(parseInt(e.target.value))}
    //             />
    //           )}
    //         />
    //       </Box>
    //     </Box>

    //     <Button type="submit" variant="contained">
    //       Submit
    //     </Button>
    //   </form>
    // </Box>

    <div>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
      {PATIENT_FIELDS["General"].map((obj, index) => (
        <Grid key={obj.dbField} item sm={6} xs={12}>
          <FormObjectComponent
            key={index}
            objFieldProp={obj}
            control={control}
            errors={errors}
          />
        </Grid>
      ))}
    </div>
  );
};

export default PatientForm;
