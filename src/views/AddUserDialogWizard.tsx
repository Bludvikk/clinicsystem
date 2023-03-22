import { Fragment, MouseEvent, useState } from "react";

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
  IconButton,
  CardContent,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";

import { z } from "zod";
import toast from "react-hot-toast";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Icon from "src/@core/components/icon";

import StepperCustomDot from "./AddUserWizard/StepperCustomDot";

import StepperWrapper from "@/@core/styles/mui/stepper";
import { NextPage } from "next";
import { getGenders } from "@/server/hooks/gender";
import { getCivilStatuses } from "@/server/hooks/civilStatus";
import { getOccupations } from "@/server/hooks/occupation";
import { FormEvent, useId } from "react";
import { postPatient } from "@/server/hooks/patient";
import { IAddPatient } from "../server/schema/patient";
import { addPatientSchema } from "@/server/schema/patient";
import { DatePicker } from "@mui/x-date-pickers";
import { Container } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import CustomChip from "src/@core/components/mui/chip";
import Paper from "@mui/material/Paper";
import moment from "moment";

const steps = [
  {
    title: "Personal Information",
    subtitle: "Enter your personal information",
  },
  {
    title: "Family History",
    subtitle: "Enter your family history",
  },
  {
    title: "Personal History",
    subtitle: "Enter your personal history",
  },
  {
    title: "Past Medical History",
    subtitle: "Enter your past medical history",
  },
  {
    title: "Obstetrics and Gynecology",
    subtitle: "Enter your ObGyne Information",
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

const AddUserWizard = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [medications, setMedications] = useState<Medications[]>([]);

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

  console.log(watch());

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
                <Typography variant="caption" component="p">
                  {steps[0].subtitle}
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
                <Typography variant="caption" component="p">
                  {steps[1].subtitle}
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
                      <IconButton
                        onClick={handleSubmit2(medicationOnSubmitHandler)}
                      >
                        <Icon icon="material-symbols:add-circle-outline-rounded" />
                      </IconButton>
                    </Grid>
                  </Grid>

                  <Divider />

                  <Paper>
                    {medications.length > 0 &&
                      medications.map((medication, i) => (
                        <CardContent>
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
                              <IconButton>
                                <Icon icon="ph:trash-thin" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </CardContent>
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
                <Typography variant="caption" component="p">
                  {steps[3].subtitle}
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
                <Typography variant="caption" component="p">
                  {steps[4].subtitle}
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
                          label: "Menstrual Cycle Date Range",
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
      default:
        return null;
    }
  };

  const renderContent = () => {
    const values = getValues([
      "firstName",
      "lastName",
      "middleInitial",
      "dateOfBirth",
      "civilStatusId",
      "age",

    ]);
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>Review</Typography>

          <Grid container spacing={2}>
            <Grid item xs={1.5}>
              <ListItemText primary="First Name" secondary={values[0]} />
            </Grid>
            <Grid item xs={1.5}>
              <ListItemText primary="Last Name" secondary={values[1]} />
            </Grid>
            <Grid item xs={1.5}>
              <ListItemText primary="Middle Initial" secondary={getValues(['civilStatusId', 'civilStatus.name'])} />
            </Grid>
            <Grid item xs={1.5}>
              <ListItemText
                primary="Date of Birth"
                secondary={moment(values[3]).format("L")}
              />
            </Grid>
            <Grid item xs={1.5}>

                  <ListItemText
                    primary="Civil Status"
                    secondary={values[4]}
                  />
            </Grid>
            <Grid item xs={1.5}>
            <ListItemText
                primary="Age"
                secondary={values[5]}
              />

            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              size="large"
              variant="contained"
              onClick={handleSubmit(addPatientOnSubmitHandler)}
            >
              Submit
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
                        <Typography className="step-subtitle">
                          {step.subtitle}
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
    </Card>
  );
};

export default AddUserWizard;
