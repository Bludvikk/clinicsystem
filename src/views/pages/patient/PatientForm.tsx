import { addPatientSchema, IAddPatient } from "@/server/schema/patient";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/system";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { FormEvent, useId, useState } from "react";
import { z } from "zod";

import { postPatient } from "@/server/hooks/patient";
import { toast } from "react-hot-toast";
import { getReferences } from "@/server/hooks/reference";

type Medications = {
  brandName: string;
  dosage: string;
  generic: string;
};

const MedicationsSchema = z.object({
  brandName: z.string(),
  dosage: z.string(),
  generic: z.string(),
});

const PatientForm = () => {
  const [medications, setMedications] = useState<Medications[]>([]);

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
    dateOfBirth: new Date(""),
    civilStatusId: 0,
    age: 0,
    occupationId: 0,
    genderId: 0,
    contactNumber: "",
    familyHistory: {
      bronchialAsthma: false,
      pulmonaryTuberculosis: false,
      diabetesMellitus: false,
      hearthDisease: false,
      cancer: false,
      others: "",
    },
    personalHistory: {
      smoking: 0,
      alcohol: 0,
      currentHealthCondition: "",
      medications: [],
    },
    pastMedicalHistory: {
      hospitalized: "",
      injuries: "",
      surgeries: "",
      allergies: "",
      measles: "",
      chickenPox: "",
      others: "",
    },
    obGyne: {
      menstrualCycle: new Date(""),
      days: 0,
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
    mode: "onBlur",
    resolver: zodResolver(addPatientSchema),
  });

  const {
    reset: reset2,
    control: control2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    formState: { errors: errors2 },
  } = useForm<Medications>({
    defaultValues: {
      brandName: "",
      dosage: "",
      generic: "",
    },
    mode: "onBlur",
    resolver: zodResolver(MedicationsSchema),
  });

  const medicationOnSubmitHandler: SubmitHandler<Medications> = (
    data: Medications,
    e: any
  ) => {
    reset2();
    setMedications((prev) => [...prev, { ...data }]);
  };

  const addPatientOnSubmitHandler: SubmitHandler<IAddPatient> = async (
    data: IAddPatient
  ) => {
    try {
      setValue("personalHistory.medications", medications);
      const result = await postPatientMutateAsync(data);
      if (result.data) {
        toast.success(result.message);
        reset();
      } else {
        toast.error("something went wrong.");
      }
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  console.log(errors);

  return (
    <Box>
      <form onSubmit={handleSubmit(addPatientOnSubmitHandler)}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="firstName"
              label="First Name"
              variant="outlined"
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="lastName"
              label="Last Name"
              variant="outlined"
            />
          )}
        />

        <Controller
          name="middleInitial"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="middleInitial"
              label="Middle Initial"
              variant="outlined"
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="address"
              label="Address"
              variant="outlined"
            />
          )}
        />

        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker {...field} label="Date of Birth" />
          )}
        />

        <Controller
          name="civilStatusId"
          control={control}
          render={({ field }) => (
            <Select
              label="Civil Status"
              disabled={referencesDataStatus === "loading"}
              variant="outlined"
              placeholder="Civil Status"
              {...field}
            >
              {referencesData &&
                referencesData?.length > 0 &&
                referencesData
                  .filter((reference) => reference.entityId === 3)
                  .map((civilStatus) => (
                    <MenuItem key={civilStatus.id} value={civilStatus.id}>
                      {civilStatus.name}
                    </MenuItem>
                  ))}
            </Select>
          )}
        />

        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="age"
              label="Age"
              type="number"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 0, valueasnumber: true }}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          )}
        />

        <Controller
          name="occupationId"
          control={control}
          render={({ field }) => (
            <Select
              label="Civil Status"
              disabled={referencesDataStatus === "loading"}
              variant="outlined"
              placeholder="Occupation"
              {...field}
            >
              {referencesData &&
                referencesData?.length > 0 &&
                referencesData
                  .filter((reference) => reference.entityId === 2)
                  .map((occupation) => (
                    <MenuItem key={occupation.id} value={occupation.id}>
                      {occupation.name}
                    </MenuItem>
                  ))}
            </Select>
          )}
        />

        <Controller
          name="genderId"
          control={control}
          render={({ field }) => (
            <Select
              label="Gender"
              disabled={referencesDataStatus === "loading"}
              variant="outlined"
              placeholder="Gender"
              {...field}
            >
              {referencesData &&
                referencesData?.length > 0 &&
                referencesData
                  .filter((reference) => reference.entityId === 1)
                  .map((gender) => (
                    <MenuItem key={gender.id} value={gender.id}>
                      {gender.name}
                    </MenuItem>
                  ))}
            </Select>
          )}
        />

        <Controller
          name="contactNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="contactNumber"
              label="Contact Number"
              variant="outlined"
            />
          )}
        />

        <Box>
          <Typography>Family History </Typography>
          <Controller
            name="familyHistory.bronchialAsthma"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} name="familyHistory.bronchialAsthma" />
                }
                label="Bronchial Asthma"
              />
            )}
          />

          <Controller
            name="familyHistory.pulmonaryTuberculosis"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    name="familyHistory.pulmonaryTuberculosis"
                  />
                }
                label="Pulmonary Tuberculosis"
              />
            )}
          />

          <Controller
            name="familyHistory.pulmonaryTuberculosis"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    name="familyHistory.pulmonaryTuberculosis"
                  />
                }
                label="Pulmonary Tuberculosis"
              />
            )}
          />

          <Controller
            name="familyHistory.diabetesMellitus"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} name="familyHistory.diabetesMellitus" />
                }
                label="Diabetes Mellitus"
              />
            )}
          />

          <Controller
            name="familyHistory.hearthDisease"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} name="familyHistory.hearthDisease" />
                }
                label="Hearth Disease"
              />
            )}
          />

          <Controller
            name="familyHistory.cancer"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} name="familyHistory.cancer" />}
                label="Cancer"
              />
            )}
          />

          <Controller
            name="familyHistory.others"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="familyHistory.others"
                label="Others"
                variant="outlined"
              />
            )}
          />
        </Box>

        <Box>
          <Typography>Personal History </Typography>

          <Controller
            name="personalHistory.smoking"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                name="personalHistory.smoking"
                label="Smoking"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, valueAsNumber: true }}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            )}
          />

          <Controller
            name="personalHistory.alcohol"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                name="personalHistory.alcohol"
                label="Alcohol"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, valueAsNumber: true }}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            )}
          />
        </Box>

        <Controller
          name="personalHistory.currentHealthCondition"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="personalHistory.currentHealthCondition"
              label="Others"
              variant="outlined"
            />
          )}
        />

        <Typography>Medications</Typography>

        <form>
          <Controller
            name="brandName"
            control={control2}
            render={({ field }) => (
              <TextField
                {...field}
                name="brandName"
                label="Brand Name"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="dosage"
            control={control2}
            render={({ field }) => (
              <TextField
                {...field}
                name="dosage"
                label="Dosage"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="generic"
            control={control2}
            render={({ field }) => (
              <TextField
                {...field}
                name="generic"
                label="Generic"
                variant="outlined"
              />
            )}
          />

          {errors2 && errors2.brandName?.message}
          {errors2 && errors2.dosage?.message}
          {errors2 && errors2.generic?.message}
          <Button
            type="button"
            variant="contained"
            onClick={handleSubmit2(medicationOnSubmitHandler)}
          >
            Add
          </Button>

          {/* TODO: add id for delete and edit medications */}
          {medications.length > 0 &&
            medications.map((medication, i) => (
              <Box display="flex" key={i}>
                <Typography>BrandName: {medication.brandName}</Typography>
                <Typography>Dosage: {medication.dosage}</Typography>
                <Typography>Generic: {medication.generic}</Typography>
              </Box>
            ))}
        </form>

        <Box>
          <Typography>Past Medical History</Typography>
          <Controller
            name="pastMedicalHistory.hospitalized"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="pastMedicalHistory.hospitalized"
                label="Hospitalized?"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="pastMedicalHistory.injuries"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="pastMedicalHistory.injuries"
                label="Injuries?"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="pastMedicalHistory.surgeries"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="pastMedicalHistory.surgeries"
                label="Surgeries?"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="pastMedicalHistory.allergies"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="pastMedicalHistory.allergies"
                label="Allergies?"
                variant="outlined"
              />
            )}
          />

          <Controller
            name="pastMedicalHistory.measles"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="pastMedicalHistory.measles"
                label="Measles?"
                variant="outlined"
              />
            )}
          />

          <Controller
            name="pastMedicalHistory.chickenPox"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="pastMedicalHistory.chickenPox"
                label="ChickenPox?"
                variant="outlined"
              />
            )}
          />

          <Controller
            name="pastMedicalHistory.others"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="pastMedicalHistory.others"
                label="Others?"
                variant="outlined"
              />
            )}
          />

          <Box>
            <Typography>ObGyne</Typography>
            <Controller
              name="obGyne.menstrualCycle"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} label="Menstrual Cycle" />
              )}
            />

            <Controller
              name="obGyne.days"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  name="days"
                  label="Days"
                  type="number"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: 0, valueAsNumber: true }}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </Box>
        </Box>

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default PatientForm;
