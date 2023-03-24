import { Fragment, forwardRef, useState, ReactElement, Ref } from "react";
import { NextPage } from "next";
import {
  Box,
  Card,
  Step,
  Grid,
  Button,
  Select,
  Divider,
  Stepper,
  MenuItem,
  StepLabel,
  TextField,
  Typography,
  InputLabel,
  CardContent,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  ListItemText,
  Stack,
  IconButton,
} from "@mui/material";

import { z } from "zod";
import toast from "react-hot-toast";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Icon from "src/@core/components/icon";

import StepperCustomDot from "./AddUserWizard/StepperCustomDot";

import StepperWrapper from "@/@core/styles/mui/stepper";
import { postPatient } from "@/server/hooks/patient";
import { IAddPatient } from "../server/schema/patient";
import { addPatientSchema } from "@/server/schema/patient";
import Paper from "@mui/material/Paper";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import Fade, { FadeProps } from "@mui/material/Fade";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
const steps = [
  {
    title: "Personal Information",
  },
  {
    title: "Family History",
  },
  {
    title: "Personal History",
  },
  {
    title: "Past Medical History",
  },
  {
    title: "Obstetrics and Gynecology",
  },
  {
    title: "Review",
  },
];

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

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const AddUserWizard: NextPage = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [medications, setMedications] = useState<Medications[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const { mutateAsync: postPatientMutateAsync, status: postPatientStatus } =
    postPatient();

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
      hypertension: false,
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
      p: 0,
      g: 0,
    },
  };

  const { data: gendersData, status: genderDataStatus } = getGenders();
  const { data: civilStatusesData, status: civilStatusesDataStatus } =
    getCivilStatuses();
  const { data: occupationsData, status: occupationsDataStatus } =
    getOccupations();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    watch,
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
    setMedications((prev) => [...prev, data]);
  };

  const removeMedications = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  const addPatientOnSubmitHandler: SubmitHandler<IAddPatient> = async (
    data: IAddPatient
  ) => {
    try {
      setValue("personalHistory.medications", medications);
      const result = await postPatientMutateAsync(data);
      if (result.data) {
        toast.success(result.message);
      } else {
        toast.error("Something went wrong");
      }
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
  };

  const onSubmit = () => {
    setActiveStep(activeStep + 1);
    if (activeStep === steps.length - 1) {
      toast.success("Form Submitted");
    }
  };

  // console.log(watch());
  const values = getValues();
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {steps[0].title}
                </Typography>

              </Grid>
              <Grid item sm={5}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="firstName"
                      label="First Name"
                      error={Boolean(errors.firstName)}
                    />
                  )}
                />
                {errors.firstName && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.firstName.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={5}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      error={Boolean(errors.lastName)}
                    />
                  )}
                />
                {errors.lastName && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.lastName.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={2}>
                <Controller
                  name="middleInitial"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="middleInitial"
                      label="Middle Initial"
                      variant="outlined"
                      error={Boolean(errors.middleInitial)}
                    />
                  )}
                />
                {errors.middleInitial && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.middleInitial.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      multiline={true}
                      rows={3}
                      {...field}
                      fullWidth
                      name="address"
                      label="Address"
                      variant="outlined"
                      error={Boolean(errors.address)}
                    />
                  )}
                />
                {errors.address && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.address.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={6}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          label: "Date of Birth",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6}>
                <Controller
                  name="civilStatusId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="civilStatusId"> Civil Status </InputLabel>
                      <Select
                        {...field}
                        label="Civil Status"
                        disabled={civilStatusesDataStatus === "loading"}
                        error={Boolean(errors.civilStatusId)}
                      >
                        {civilStatusesData &&
                          civilStatusesData?.length > 0 &&
                          civilStatusesData.map((civilStatus) => (
                            <MenuItem
                              key={civilStatus.id}
                              value={civilStatus.id}
                            >
                              {civilStatus.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.occupationId && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.occupationId.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={6}>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="age"
                      label="Age"
                      type="number"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: 0, valueasnumber: true }}
                      error={Boolean(errors.age)}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />
                {errors.age && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.age.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={6}>
                <Controller
                  name="occupationId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="occupationId"> Occupation </InputLabel>
                      <Select
                        {...field}
                        label="Occupation"
                        disabled={occupationsDataStatus === "loading"}
                        error={Boolean(errors.occupationId)}
                      >
                        {occupationsData &&
                          occupationsData?.length > 0 &&
                          occupationsData.map((occupation) => (
                            <MenuItem key={occupation.id} value={occupation.id}>
                              {occupation.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.occupationId && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.occupationId.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={6}>
                <Controller
                  name="genderId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="genderId"> Gender </InputLabel>
                      <Select
                        {...field}
                        label="Gender"
                        disabled={genderDataStatus === "loading"}
                        error={Boolean(errors.genderId)}
                      >
                        {gendersData &&
                          gendersData?.length > 0 &&
                          gendersData.map((gender) => (
                            <MenuItem key={gender.id} value={gender.id}>
                              {gender.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.genderId && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.genderId.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={6}>
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Number"
                      placeholder="+63 9770910860"
                      error={Boolean(errors.contactNumber)}
                    />
                  )}
                />
                {errors.contactNumber && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.contactNumber.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 1:
        return (
          <form key={1} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {steps[1].title}
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <Controller
                  name="familyHistory.bronchialAsthma"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Bronchial Asthma"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4.5}>
                <Controller
                  name="familyHistory.pulmonaryTuberculosis"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Pulmonary Tuberculosis"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name="familyHistory.hypertension"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Hypertension"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4.5}>
                <Controller
                  name="familyHistory.diabetesMellitus"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Diabetes Mellitus"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4.5}>
                <Controller
                  name="familyHistory.hearthDisease"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Hearth Disease"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name="familyHistory.cancer"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Cancer"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="familyHistory.others"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline={true}
                      rows={3}
                      fullWidth
                      name="familyHistory.others"
                      label="Others"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 2:
        return (
          <form key={2} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Grid item sm={10}>
                  <Typography>Are you a smoker?</Typography>
                  <Divider />
                  <Controller
                    name="personalHistory.smoking"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="How many cigarette sticks per day?"
                        placeholder="5"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={10}>
                  <Typography>Do you consume Alcohol?</Typography>
                  <Divider />
                  <Controller
                    name="personalHistory.alcohol"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Years of drinking"
                        placeholder="5"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={10}>
                  <Typography>Current Health Conditions</Typography>
                  <Divider />
                  <Controller
                    name="personalHistory.currentHealthCondition"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Health Condition"
                        placeholder="Healthy"
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} mt={7}>
                <form>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Controller
                        name="brandName"
                        control={control2}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            {...field}
                            placeholder="Biogesic"
                            label="Brand Name"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="generic"
                        control={control2}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            {...field}
                            placeholder="Paracetamol"
                            label="Generic"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Controller
                        name="dosage"
                        control={control2}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            {...field}
                            placeholder="100ml"
                            label="Dosage"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        onClick={handleSubmit2(medicationOnSubmitHandler)}
                      >
                        <Icon icon="material-symbols:add-circle-outline-rounded" />
                      </Button>
                    </Grid>
                  </Grid>

                  <Divider />

                  <Paper>
                    {medications.length > 0 &&
                      medications.map((medication, i) => (
                        <Box
                          sx={{ p: 2, backgroundColor: "action.hover" }}
                          key={i}
                        >
                          <Grid container spacing={1}>
                            <Grid item xs={5}>
                              <ListItemText
                                primary={medication.generic}
                                secondary={medication.brandName}
                              />
                            </Grid>
                            <Grid item xs={4} mt={4}>
                              <ListItemText secondary={medication.dosage} />
                            </Grid>
                            <Grid item xs={2} mt={2}>
                              <Button onClick={() => removeMedications(i)}>
                                <Icon icon="ph:trash-thin" />
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                  </Paper>
                </form>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 3:
        return (
          <form key={3} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {steps[3].title}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Were you hospitalized?</Typography>
                <Divider />
                <Controller
                  name="pastMedicalHistory.hospitalized"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hospitalized"
                      placeholder="When I was a kid, I was diagnosed with diarrhea"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Do you have any injuries?</Typography>
                <Divider />

                <Controller
                  name="pastMedicalHistory.injuries"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Injuries"
                      placeholder="Leg, back, etc."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Have you undergone any surgeries?</Typography>
                <Divider />

                <Controller
                  name="pastMedicalHistory.surgeries"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Surgeries"
                      placeholder="Appendix removal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Do you have any allergies?</Typography>
                <Divider />
                <Controller
                  name="pastMedicalHistory.allergies"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Allergies"
                      placeholder="Pet Allergy"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Have you had Measles?</Typography>
                <Divider />
                <Controller
                  name="pastMedicalHistory.measles"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Measles"
                      placeholder="Yes, and no"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Have you had Chicken Pox?</Typography>
                <Divider />

                <Controller
                  name="pastMedicalHistory.chickenPox"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Chicken Pox"
                      placeholder="Yes, and no"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Other past medical history</Typography>
                <Divider />

                <Controller
                  name="pastMedicalHistory.others"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Others"
                      placeholder="Gastritis"
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 4:
        return (
          <form key={4} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {steps[4].title}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="obGyne.menstrualCycle"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          label: "Date of Birth",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="obGyne.p"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="P (Para)"
                      placeholder="3"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="obGyne.days"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cycle Days"
                      placeholder="5"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="obGyne.g"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="G (Gravida)"
                      placeholder="2"
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 5:
        return (
          <form key={4} onSubmit={handleSubmit(onSubmit)}>
            <Typography>Review</Typography>
            <Paper>
              <Box sx={{ p: "6px", backgroundColor: "action.hover" }}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {steps[0].title}
                    </Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText
                      primary="First Name"
                      secondary={values.firstName}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText
                      primary="Last Name"
                      secondary={values.lastName}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText
                      primary="Middle Initial"
                      secondary={values.middleInitial}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={moment(values.dateOfBirth).format("L")}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText
                      primary="Civil Status"
                      secondary={values.civilStatusId}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <ListItemText primary="Age" secondary={values.age} />
                  </Grid>
                  <Grid item xs={1}>
                    <ListItemText
                      primary="Gender"
                      secondary={values.genderId}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormControl fullWidth>
                      <ListItemText
                        primary="Occupation"
                        secondary={values.occupationId}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={1.5}>
                    <FormControl fullWidth>
                      <ListItemText
                        primary="Contact Number"
                        secondary={values.contactNumber}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <ListItemText
                        primary="Address"
                        secondary={values.address}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {steps[1].title}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText
                      primary="Bronchial Asthma"
                      secondary={
                        getValues("familyHistory.cancer") ? "Yes" : "No"
                      }
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText
                      primary="Pulmonary Tuberculosis"
                      secondary={
                        getValues("familyHistory.pulmonaryTuberculosis")
                          ? "Yes"
                          : "No"
                      }
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText
                      primary="Hypertension"
                      secondary={
                        getValues("familyHistory.hearthDisease") ? "Yes" : "No"
                      }
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText
                      primary="Diabetes Mellitus"
                      secondary={
                        getValues("familyHistory.diabetesMellitus")
                          ? "Yes"
                          : "No"
                      }
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText
                      primary="Cancer"
                      secondary={
                        getValues("familyHistory.cancer") ? (
                          "Yes"
                        ) : (
                          <Icon
                            icon="gridicons:cross
                        "
                          />
                        )
                      }
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText
                      primary="Others"
                      secondary={values.familyHistory.others}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {steps[2].title}
                    </Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText
                      primary="Cigarrete sticks per day"
                      secondary={values.personalHistory.smoking}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText
                      primary="Years of drinking alcohol"
                      secondary={values.personalHistory.alcohol}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={3}>
                    <ListItemText
                      primary="Current Health Condition"
                      secondary={values.personalHistory.currentHealthCondition}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper>
                      <Typography sx={{ m: 2 }}>
                        Medications (Any medications taken regularly)
                      </Typography>
                      {medications.length > 0 &&
                        medications.map((medication, i) => (
                          <Box
                            sx={{ p: "6px", backgroundColor: "action.hover" }}
                            key={i}
                          >
                            <Grid container spacing={2}>
                              <Grid item xs={5}>
                                <ListItemText
                                  primary={medication.generic}
                                  secondary={medication.brandName}
                                />
                              </Grid>
                              <Grid item xs={4} mt={4}>
                                <ListItemText secondary={medication.dosage} />
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {steps[3].title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} pt={10} pl={2}>
                    <ListItemText
                      primary="Have you ever been hospitalized?"
                      secondary={values.pastMedicalHistory.hospitalized}
                    />
                  </Grid>
                  <Grid item xs={12} p={2}>
                    <ListItemText
                      primary="Have you ever had serious injuries and/or broken bones??"
                      secondary={values.pastMedicalHistory.injuries}
                    />
                  </Grid>
                  <Grid item xs={12} p={2}>
                    <ListItemText
                      primary="Have you undergone any surgeries?"
                      secondary={values.pastMedicalHistory.surgeries}
                    />
                  </Grid>
                  <Grid item xs={12} p={2}>
                    <ListItemText
                      primary="Do you have allergies?"
                      secondary={values.pastMedicalHistory.allergies}
                    />
                  </Grid>
                  <Grid item xs={12} p={2}>
                    <ListItemText
                      primary="Have you had measles?"
                      secondary={values.pastMedicalHistory.measles}
                    />
                  </Grid>
                  <Grid item xs={12} p={2}>
                    <ListItemText
                      primary="Have you had chicken pox?"
                      secondary={values.pastMedicalHistory.chickenPox}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {steps[4].title}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} p={2}>
                    <ListItemText
                      primary="Menstrual Cycle?"
                      secondary={moment(values.obGyne.menstrualCycle).format(
                        "L"
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} p={2}>
                    <ListItemText
                      primary="Menstrual Cycle Days"
                      secondary={values.obGyne.days}
                    />
                  </Grid>
                  <Grid item xs={6} p={2}>
                    <ListItemText primary="Para" secondary={values.obGyne.p} />
                  </Grid>
                  <Grid item xs={6} p={2}>
                    <ListItemText
                      primary="Gravida"
                      secondary={values.obGyne.g}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Stack direction="row" spacing={2}>
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>

                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Stack>
            </Box>
          </form>
        );
    }
  };

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              size="large"
              variant="contained"
              onClick={handleSubmit(addPatientOnSubmitHandler)}
            >
              Reset
            </Button>
          </Box>
        </Fragment>
      );
    } else {
      return getStepContent(activeStep);
    }
  };

  return (
    <Card>
      <CardContent>
        <Button variant="contained" onClick={() => setShow(true)}>
          Add Patient
        </Button>
      </CardContent>
      <Dialog
        fullWidth
        open={show}
        maxWidth="lg"
        scroll="body"
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent
          sx={{
            pb: 6,
            px: { xs: 8, sm: 15 },
            pt: { xs: 8, sm: 12.5 },
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setShow(false)}
            sx={{ position: "absolute", right: "1rem", top: "1rem" }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 3, lineHeight: "2rem" }}>
              Add Patient Information to the system
            </Typography>
            <Typography variant="body2">
              Adding patient information will receive a privacy audit
            </Typography>
          </Box>

          <CardContent>
            <StepperWrapper>
              <Stepper activeStep={activeStep}>
                {steps.map((step, index) => {
                  const labelProps: {
                    error?: boolean;
                  } = {};
                  if (index === activeStep) {
                    labelProps.error = false;
                    if (errors.firstName && activeStep === 0) {
                      labelProps.error = true;
                    } else {
                      labelProps.error = false;
                    }
                  }

                  return (
                    <Step key={index}>
                      <StepLabel
                        {...labelProps}
                        StepIconComponent={StepperCustomDot}
                      >
                        <div className="step-label">
                          <Typography className="step-number">{`${
                            index + 1
                          }`}</Typography>
                          <div>
                            <Typography className="step-title">
                              {step.title}
                            </Typography>
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </StepperWrapper>
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />

          <CardContent>{renderContent()}</CardContent>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AddUserWizard;
