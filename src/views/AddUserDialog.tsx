import { Ref, useState, forwardRef, ReactElement, useCallback } from "react";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Chip,
  Grid,
  Card,
  Switch,
  Dialog,
  Button,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
  DialogContent,
  DialogActions,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
  Accordion,
  Checkbox,
} from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Icon from "src/@core/components/icon";
import { NextPage } from "next";

import { postPatient } from "@/server/hooks/patient";
import { addPatientSchema, IAddPatient } from "@/server/schema/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useController } from "react-hook-form";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const AddUserDialog: NextPage = () => {
  const [show, setShow] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);

  const {
    control,
    setError,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IAddPatient>({
    resolver: zodResolver(addPatientSchema),
  });

  const { mutateAsync } = postPatient();

  const AddPatientHandler = async (data: IAddPatient) => {
    try {
      const result = await mutateAsync(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search Patient"
          sx={{ mr: 4, mb: 2, maxWidth: "180px" }}
        />
        <Button sx={{ mb: 2 }} variant="outlined" onClick={() => setShow(true)}>
          Add Patient
        </Button>
      </Box>
      <Card>
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
                Add Patient
              </Typography>
              <Typography variant="body2">
                Add a patient into the system
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(AddPatientHandler)}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    1. Personal Info
                  </Typography>
                </Grid>

                <Grid item sm={5}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="First Name"
                        placeholder="John"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={5}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        onChange={onChange}
                        fullWidth
                        label="Last Name"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={2}>
                  <Controller
                    name="middleInitial"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Middle Initial"
                        placeholder="D"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Address"
                        placeholder="Jln Palma Gil St. Brgy 34-D, Davao City"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Date of Birth"
                        placeholder="June 11, 2000"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Controller
                    name="civilStatusId"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Civil Status"
                        placeholder="Single"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Controller
                    name="age"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Age"
                        placeholder="22"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Controller
                    name="occupationId"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Occupation"
                        placeholder="Engineer"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Controller
                    name="genderId"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Gender"
                        placeholder="Male"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Controller
                    name="contactNumber"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Contact Number"
                        placeholder="+63 9770910860"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    2. Family History
                  </Typography>
                </Grid>
                <Grid item sm={12}>
                  <Accordion>
                    <AccordionSummary
                      id="panel-header-1"
                      aria-controls="panel-content-1"
                      expandIcon={<Icon icon="mdi:chevron-down" />}
                    >
                      <Typography>Family History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Controller
                            name="familyHistory.bronchialAsthma"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <FormControlLabel
                                label="Bronchial Asthma"
                                onChange={onChange}
                                control={
                                  <Checkbox
                                    value={value}
                                    onChange={(e) => setCheck(e.target.checked)}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="familyHistory.pulmonaryTuberculosis"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <FormControlLabel
                                onChange={onChange}
                                label="Pulmonary Tuberculosis"
                                control={
                                  <Checkbox
                                    value={value}

                                    onChange={(e) => setCheck(e.target.checked)}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="familyHistory.diabetesMellitus"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <FormControlLabel
                                label="Diabetes Mellitus"
                                onChange={onChange}
                                control={
                                  <Checkbox
                                    value={value}

                                    onChange={(e) => setCheck(e.target.checked)}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="familyHistory.hearthDisease"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <FormControlLabel
                                label="Heart Disease"
                                onChange={onChange}
                                control={
                                  <Checkbox
                                    value={value}

                                    onChange={(e) => setCheck(e.target.checked)}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="familyHistory.cancer"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <FormControlLabel
                                onChange={onChange}
                                label="Cancer"
                                control={
                                  <Checkbox
                                    value={value}

                                    onChange={(e) => setCheck(e.target.checked)}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="familyHistory.others"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Others"
                                placeholder="Hemophilia, Pneumonia"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    3. Personal History
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography>Are you a smoker?</Typography>
                  <Divider />
                  <Controller
                    name="personalHistory.smoking"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="How many cigarette sticks per day?"
                        placeholder="5"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={4}>
                  <Typography>Do you consume Alcohol?</Typography>
                  <Divider />
                  <Controller
                    name="personalHistory.alcohol"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Years of drinking"
                        placeholder="5"
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={4}>
                  <Typography>Current Health Conditions</Typography>
                  <Divider />
                  <Controller
                    name="personalHistory.currentHealthCondition"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Health Condition"
                        placeholder="Healthy"
                      />
                    )}
                  />
                </Grid>

                <Grid item sm={12}>
                  <Accordion>
                    <AccordionSummary
                      id="panel-header-1"
                      aria-controls="panel-content-1"
                      expandIcon={<Icon icon="mdi:chevron-down" />}
                    >
                      <Typography>Medications</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Controller
                            name="personalHistory.medications"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Brand Name"
                                placeholder="Biogesic"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="personalHistory.medications"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Dosage"
                                placeholder="500mg"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="personalHistory.medications"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Generic"
                                placeholder="Paracetamol"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    4. Past Medical History
                  </Typography>
                </Grid>
                <Grid item sm={12}>
                  <Accordion>
                    <AccordionSummary
                      id="panel-header-1"
                      aria-controls="panel-content-1"
                      expandIcon={<Icon icon="mdi:chevron-down" />}
                    >
                      <Typography>Past Medical History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography>Were you hospitalized?</Typography>
                          <Divider />
                          <Controller
                            name="pastMedicalHistory.hospitalized"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="When and why"
                                placeholder="When I was a kid, I was diagnosed with diarrhea"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>Do you have any injuries?</Typography>
                          <Divider />

                          <Controller
                            name="pastMedicalHistory.injuries"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Please specify"
                                placeholder="Leg, back, etc."
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            Have you undergone any surgeries?
                          </Typography>
                          <Divider />

                          <Controller
                            name="pastMedicalHistory.surgeries"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Please Specify"
                                placeholder="Appendix removal"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>Do you have any allergies?</Typography>
                          <Divider />
                          <Controller
                            name="pastMedicalHistory.allergies"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Please Specify"
                                placeholder="Pet Allergy"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>Have you had Measles?</Typography>
                          <Divider />
                          <Controller
                            name="pastMedicalHistory.measles"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Measles"
                                placeholder="Yes, and no"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>Have you had Chicken Pox?</Typography>
                          <Divider />

                          <Controller
                            name="pastMedicalHistory.chickenPox"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
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
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="Others"
                                placeholder="Gastritis"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontWeight: 600 }}
                  >
                    5. Obstetrics Gynecology, if exist.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="obGyne.menstrualCycle"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Menstrual Cycle"
                        placeholder="June, 16, 2023"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="obGyne.days"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="Days of Menstrual Cycle"
                        placeholder="5"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions
            sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: "center" }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShow(false)}
            >
              Discard
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Stack>
  );
};

export default AddUserDialog;
