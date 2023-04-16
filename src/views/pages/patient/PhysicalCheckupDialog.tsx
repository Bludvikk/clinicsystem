import React, { FC, SyntheticEvent, useContext, useEffect } from "react";

import {
  DiagnosisUnionFieldType,
  IAddPhysicalCheckup,
  IAddVitalSign,
  IDiagnosis,
  ITreatment,
  PhysicalCheckupUnionFieldType,
  TreatmentUnionFieldType,
  VitalSignUnionFieldType,
  addDiagnosisSchema,
  addPhysicalCheckupSchema,
  addTreatmentSchema,
  addVitalSignSchema,
} from "@/server/schema/patient";

import Icon from "@/@core/components/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControlPropsType } from "@/utils/common.type";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Breakpoint,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import {
  usePhysicalCheckupFormStore,
  useDiagnosisStore,
  useTreatmentStore,
} from "@/utils/patient.store";
import { getUsers } from "@/server/hooks/user";
import { FormObjectComponent } from "@/utils/form.component";
import { AbilityContext } from "@/layouts/components/acl/Can";
import {
  getVitalSignsById,
  postPhysicalCheckup,
  postVitalSign,
} from "@/server/hooks/patient";
import { toast } from "react-hot-toast";
import isDeepEqual from "fast-deep-equal/react";
import { getReferences } from "@/server/hooks/reference";

const PhysicalCheckupDialog = () => {
  const ability = useContext(AbilityContext);
  const { data: session } = useSession();
  const { data: medicinesData, status: medicinesDataStatus } = getReferences({
    entities: [9],
  });
  const { mutate: postPhysicalCheckupMutate } = postPhysicalCheckup();

  const {
    patientId,
    physicianId,
    vitalSignId,
    onClosing,
    onSaving,
    isSaving,
    showDialog,
    dialogTitle,
    tabsValue,
    setTabsValue,
  } = usePhysicalCheckupFormStore((state) => state);

  const {
    diagnoses,
    addDiagnosis,
    removeDiagnosis,
    clearDiagnoses,
    onShow: diagnosisOnShow,
  } = useDiagnosisStore((state) => state);

  const {
    treatments,
    addTreatment,
    removeTreatment,
    clearTreatments,
    onShow: treatmentOnShow,
  } = useTreatmentStore((state) => state);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<IAddPhysicalCheckup>({
    defaultValues: {
      patientId,
      physicianId,
      vitalSignId,
      diagnoses: [],
      treatments: [],
      dietaryAdviseGiven: "N/A",
      followUp: null,
    },
    mode: "onChange",
    resolver: zodResolver(addPhysicalCheckupSchema),
  });

  const {
    control: vitalSignControl,
    handleSubmit: vitalSignHandleSubmit,
    reset: vitalSignReset,
    formState: { errors: vitalSignErrors },
  } = useForm<IAddVitalSign>({
    defaultValues: {
      t: 0,
      p: 0,
      r: 0,
      bp: "",
      wt: 0,
      ht: 0,
      cbg: 0,
      patientId: patientId,
      physicianId: 0,
      receptionistId: session?.user.id,
    },
    mode: "onChange",
    resolver: zodResolver(addVitalSignSchema),
  });

  const {
    control: diagnosisControl,
    handleSubmit: diagnosisHandleSubmit,
    reset: diagnosisReset,
    formState: { errors: diagnosisErrors },
  } = useForm<IDiagnosis>({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
    resolver: zodResolver(addDiagnosisSchema),
  });

  const {
    control: treatmentControl,
    handleSubmit: treatmentHandleSubmit,
    reset: TreatmentReset,
    formState: { errors: treatmentErrors },
  } = useForm<ITreatment>({
    defaultValues: {
      medicineId: 0,
      signa: "",
    },
    mode: "onChange",
    resolver: zodResolver(addTreatmentSchema),
  });

  const { data: userData, status: userDataStatus } = getUsers();
  const { mutate: postVitalSignMutate } = postVitalSign();
  const { data: vitalSignData } = getVitalSignsById({ id: vitalSignId });

  const PATIENT_VITALSIGNS_PANEL = ["vitalSigns"] as const;
  const PATIENT_VITALSIGNS_FIELDS: Record<
    (typeof PATIENT_VITALSIGNS_PANEL)[number],
    FormControlPropsType<VitalSignUnionFieldType>[]
  > = {
    vitalSigns: [
      {
        label: "T",
        dbField: "t",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: "number",
            disabled: vitalSignData ? true : false,
            inputProps: { min: 0 },
          },
        },
      },
      {
        label: "BP",
        dbField: "bp",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            disabled: vitalSignData ? true : false,
          },
        },
      },
      {
        label: "CBG",
        dbField: "cbg",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: "number",
            disabled: vitalSignData ? true : false,
            inputProps: { min: 0 },
          },
        },
      },
      {
        label: "P",
        dbField: "p",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: "number",
            disabled: vitalSignData ? true : false,
            inputProps: { min: 0 },
          },
        },
      },
      {
        label: "WT",
        dbField: "wt",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: "number",
            disabled: vitalSignData ? true : false,
            inputProps: { min: 0 },
          },
        },
      },
      {
        label: "HT",
        dbField: "ht",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: "number",
            disabled: vitalSignData ? true : false,
            inputProps: { min: 0 },
          },
        },
      },
      {
        label: "R",
        dbField: "r",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: "number",
            disabled: vitalSignData ? true : false,
            inputProps: { min: 0 },
          },
        },
      },
    ],
  };

  const PATIENT_DIAGNOSIS_PANEL = ["diagnosis"] as const;
  const PATIENT_DIAGNOSIS_FIELDS: Record<
    (typeof PATIENT_DIAGNOSIS_PANEL)[number],
    FormControlPropsType<DiagnosisUnionFieldType>[]
  > = {
    diagnosis: [
      {
        label: "Diagnosis",
        dbField: "name",
        type: "textField",
        autoFocus: true,
        required: true,
        extendedProps: {
          gridAttribute: { flex: 3 },
        },
      },
    ],
  };

  const PATIENT_TREATMENTS_PANEL = ["treatment"] as const;
  const PATIENT_TREATMENTS_FIELDS: Record<
    (typeof PATIENT_TREATMENTS_PANEL)[number],
    FormControlPropsType<TreatmentUnionFieldType>[]
  > = {
    treatment: [
      {
        label: "Treatment",
        dbField: "medicineId",
        required: true,
        type: "dropDown",
        entityId: 9,
        extendedProps: {},
      },
      {
        label: "Signa",
        dbField: "signa",
        type: "textField",
        required: true,
        extendedProps: {
          textFieldAttribute: { sx: { mt: 2 } },
        },
      },
    ],
  };

  const PATIENT_DIETARYADVISE_FOLLOWUP_PANEL = [
    "dietaryAdviseFollowup",
  ] as const;
  const PATIENT_DIETARYADVISE_FOLLOWUP_FIELDS: Record<
    (typeof PATIENT_DIETARYADVISE_FOLLOWUP_PANEL)[number],
    FormControlPropsType<PhysicalCheckupUnionFieldType>[]
  > = {
    dietaryAdviseFollowup: [
      {
        label: "Dietary Advise Given",
        dbField: "dietaryAdviseGiven",
        type: "textField",
        extendedProps: {
          textFieldAttribute: { multiline: true, rows: 5 },
          gridAttribute: { xs: 12 },
        },
      },
      {
        label: "Follow Up",
        dbField: "followUp",
        type: "datePicker",
        extendedProps: {
          gridAttribute: { xs: 4 },
        },
      },
    ],
  };

  const closeAndReset = () => {
    reset();
    clearDiagnoses();
    clearTreatments();
    onClosing();
    setTabsValue("1");
  };

  const addPhysicalCheckupOnSubmit: SubmitHandler<IAddPhysicalCheckup> = (
    data: IAddPhysicalCheckup
  ) => {
    postPhysicalCheckupMutate(data, {
      onSuccess: (data) => {
        closeAndReset();
        toast.success(data.message);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const diagnosisOnSubmit: SubmitHandler<IDiagnosis> = (data: IDiagnosis) => {
    addDiagnosis(data);
    diagnosisReset();
  };

  const treatmentOnSubmit: SubmitHandler<ITreatment> = (data: ITreatment) => {
    addTreatment(data);
    TreatmentReset();
  };

  const postVitalSignOnSubmit: SubmitHandler<IAddVitalSign> = (
    data: IAddVitalSign
  ) => {
    postVitalSignMutate(data, {
      onSuccess: (data) => {
        onClosing();
        toast.success(data.message);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const renderTabs = () => {
    const tabs = [
      <Tab key="1" value="1" label="VITAL SIGNS" />,
      <Tab key="2" value="2" label="CC/DIAGNOSIS" />,
      <Tab key="3 " value="3" label="TREATMENT" />,
      <Tab key="4" value="4" label="DIETARY ADVISE & FOLLOW UP" />,
    ];
    return tabs.map((tab) => tab);
  };

  useEffect(() => {
    if (vitalSignId && vitalSignData) {
      const { patient, physician, receptionist, createdAt, ...data } =
        vitalSignData;
      vitalSignReset(data);
    }
  }, [vitalSignId, vitalSignData]);

  useEffect(() => {
    setValue("diagnoses", diagnoses);
  }, [isDeepEqual(getValues("diagnoses"), diagnoses)]);

  useEffect(() => {
    setValue("treatments", treatments);
  }, [isDeepEqual(getValues("treatments"), treatments)]);

  return (
    <>
      {console.log(JSON.stringify(watch(), null, 2))}
      <Dialog open={showDialog} fullWidth maxWidth="lg" scroll="paper">
        <DialogContent sx={{ p: 6 }}>
          <DialogTitle textAlign="center" variant="h5">
            {dialogTitle} Patient Physical Checkup
          </DialogTitle>

          <Grid container>
            <Grid item xs={5} mt={5} ml="auto">
              <Controller
                control={vitalSignControl}
                name="physicianId"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="physicianId-label">Physician</InputLabel>
                    <Select
                      label="Physician"
                      defaultValue={0}
                      labelId="physicianId-label"
                      disabled={
                        userDataStatus === "loading" || Boolean(vitalSignData)
                      }
                      error={Boolean(vitalSignErrors.physicianId)}
                      {...field}
                    >
                      <MenuItem value={0}>Select Physician</MenuItem>
                      {userData &&
                        userData?.length > 0 &&
                        userData
                          ?.filter((user) => user.roleId === 15)
                          .map((physician) => (
                            <MenuItem key={physician.id} value={physician.id}>
                              {physician.lastName} {physician.firstName},
                            </MenuItem>
                          ))}
                    </Select>
                    <FormHelperText sx={{ color: "error.main" }}>
                      {vitalSignErrors["physicianId"]?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} mt={3}>
              <TabContext value={tabsValue}>
                <TabList
                  onChange={(e: SyntheticEvent<Element>, newValue: string) =>
                    setTabsValue(newValue)
                  }
                >
                  {ability && ability.can("create", "vital signs") && (
                    <Tab value="1" label="VITAL SIGNS" />
                  )}
                  {ability &&
                    ability.can("create", "physical checkup") &&
                    renderTabs()}
                </TabList>

                <TabPanel value="1">
                  <Grid item container spacing={5} mt={1}>
                    {PATIENT_VITALSIGNS_FIELDS["vitalSigns"].map((obj, i) => (
                      <Grid
                        item
                        key={obj.dbField}
                        {...obj.extendedProps?.gridAttribute}
                      >
                        <FormObjectComponent
                          key={i}
                          objFieldProp={obj}
                          control={vitalSignControl}
                          errors={vitalSignErrors}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>

                {ability && ability.can("create", "physical checkup") && (
                  <Box>
                    <TabPanel value="2">
                      <form onSubmit={diagnosisHandleSubmit(diagnosisOnSubmit)}>
                        <Grid container mt={1}>
                          {PATIENT_DIAGNOSIS_FIELDS["diagnosis"].map(
                            (obj, i) => (
                              <Grid
                                item
                                key={obj.dbField}
                                {...obj.extendedProps?.gridAttribute}
                              >
                                <FormObjectComponent
                                  key={i}
                                  objFieldProp={obj}
                                  control={diagnosisControl}
                                  errors={diagnosisErrors}
                                />
                              </Grid>
                            )
                          )}

                          <Grid item>
                            <IconButton type="submit" color="primary">
                              <Icon icon="mdi:plus-circle" fontSize={45} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </form>

                      <Paper
                        elevation={3}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
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
                          {diagnoses &&
                            diagnoses.length > 0 &&
                            diagnoses.map((diagnosis, i) => (
                              <ListItem
                                key={i}
                                secondaryAction={
                                  <Grid item>
                                    <IconButton
                                      type="button"
                                      color="secondary"
                                      onClick={() => diagnosisOnShow("EDIT", i)}
                                    >
                                      <Icon
                                        icon="mdi:pencil-outline"
                                        fontSize={20}
                                      />
                                    </IconButton>
                                    <IconButton
                                      type="button"
                                      color="secondary"
                                      onClick={() => removeDiagnosis(i)}
                                    >
                                      <Icon
                                        icon="mdi:delete-outline"
                                        fontSize={20}
                                      />
                                    </IconButton>
                                  </Grid>
                                }
                              >
                                <ListItemText
                                  sx={{ m: 0, width: "50%" }}
                                  primary={diagnosis.name}
                                  primaryTypographyProps={{
                                    sx: { fontWeight: "bold" },
                                  }}
                                />
                              </ListItem>
                            ))}

                          <EditDiagnosisDialog />
                        </List>
                      </Paper>

                      <FormHelperText
                        sx={{ color: "error.main", marginTop: 1, marginX: 4 }}
                      >
                        {diagnoses.length < 1 && errors["diagnoses"]?.message}
                      </FormHelperText>
                    </TabPanel>
                    <TabPanel value="3">
                      <form onSubmit={treatmentHandleSubmit(treatmentOnSubmit)}>
                        <Grid container mt={1} alignItems="center">
                          <Grid item flex={3}>
                            {PATIENT_TREATMENTS_FIELDS["treatment"].map(
                              (obj, i) => (
                                <FormObjectComponent
                                  key={i}
                                  objFieldProp={obj}
                                  control={treatmentControl}
                                  errors={treatmentErrors}
                                />
                              )
                            )}
                          </Grid>

                          <Grid item>
                            <IconButton type="submit" color="primary">
                              <Icon icon="mdi:plus-circle" fontSize={45} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </form>

                      <Paper
                        elevation={3}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
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
                          {treatments &&
                            treatments.length > 0 &&
                            treatments.map((treatment, i) => (
                              <ListItem
                                key={i}
                                secondaryAction={
                                  <Grid item>
                                    <IconButton
                                      type="button"
                                      color="secondary"
                                      onClick={() => treatmentOnShow("EDIT", i)}
                                    >
                                      <Icon
                                        icon="mdi:pencil-outline"
                                        fontSize={20}
                                      />
                                    </IconButton>
                                    <IconButton
                                      type="button"
                                      color="secondary"
                                      onClick={() => removeTreatment(i)}
                                    >
                                      <Icon
                                        icon="mdi:delete-outline"
                                        fontSize={20}
                                      />
                                    </IconButton>
                                  </Grid>
                                }
                              >
                                <ListItemText
                                  sx={{ m: 0, width: "50%" }}
                                  primary={
                                    medicinesData?.find(
                                      (medicine) =>
                                        medicine.id === treatment.medicineId
                                    )?.name
                                  }
                                  primaryTypographyProps={{
                                    sx: { fontWeight: "bold" },
                                  }}
                                  secondary={treatment.signa}
                                  secondaryTypographyProps={{
                                    variant: "body2",
                                  }}
                                />
                              </ListItem>
                            ))}

                          <EditTreatmentDialog />
                        </List>
                      </Paper>

                      <FormHelperText
                        sx={{ color: "error.main", marginTop: 1, marginX: 4 }}
                      >
                        {treatments.length < 1 && errors["treatments"]?.message}
                      </FormHelperText>
                    </TabPanel>
                    <TabPanel value="4">
                      <Grid container rowGap={2}>
                        {PATIENT_DIETARYADVISE_FOLLOWUP_FIELDS[
                          "dietaryAdviseFollowup"
                        ].map((obj, i) => (
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
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </TabPanel>
                  </Box>
                )}
              </TabContext>
            </Grid>
          </Grid>

          {ability && ability.can("create", "vital signs") && (
            <DialogActions>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => onClosing()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={vitalSignHandleSubmit(postVitalSignOnSubmit)}
              >
                Submit
              </Button>
            </DialogActions>
          )}

          {ability && ability.can("create", "physical checkup") && (
            <DialogActions>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => closeAndReset()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit(addPhysicalCheckupOnSubmit)}
              >
                Submit
              </Button>
            </DialogActions>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Dialogs
type PropsType = {
  maxWidth?: Breakpoint;
};

const EditDiagnosisDialog: FC<PropsType> = ({ maxWidth }) => {
  const { id, diagnoses, onClose, editDiagnosis, dialog } = useDiagnosisStore(
    (state) => state
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IDiagnosis>({
    defaultValues: { name: "" },
    mode: "onChange",
    resolver: zodResolver(addDiagnosisSchema),
  });

  const PATIENT_DIAGNOSIS_PANEL = ["diagnosis"] as const;
  const PATIENT_DIAGNOSIS_FIELD: Record<
    (typeof PATIENT_DIAGNOSIS_PANEL)[number],
    FormControlPropsType<DiagnosisUnionFieldType>[]
  > = {
    diagnosis: [
      {
        label: "Diagnosis",
        dbField: "name",
        type: "textField",
        autoFocus: true,
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
        },
      },
    ],
  };

  const editDiagnosisOnSubmit: SubmitHandler<IDiagnosis> = (
    data: IDiagnosis
  ) => {
    editDiagnosis(id, data);
    onClose("EDIT");
  };

  const closeAndReset = () => {
    onClose("EDIT");
    reset();
  };

  useEffect(() => {
    reset({ ...diagnoses.at(id) });
  }, [id]);

  return (
    <Dialog
      open={dialog.edit.showDialog}
      maxWidth={maxWidth ? maxWidth : "md"}
      fullWidth
    >
      <form onSubmit={handleSubmit(editDiagnosisOnSubmit)}>
        <DialogContent>
          <DialogTitle textAlign="center">
            {dialog.edit.dialogTitle} Diagnosis
          </DialogTitle>

          <Grid container alignItems="center">
            {PATIENT_DIAGNOSIS_FIELD["diagnosis"].map((obj, i) => (
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
                />
              </Grid>
            ))}
          </Grid>

          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => closeAndReset()}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

const EditTreatmentDialog: FC<PropsType> = ({ maxWidth }) => {
  const { id, treatments, onClose, editTreatment, dialog } = useTreatmentStore(
    (state) => state
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ITreatment>({
    defaultValues: { medicineId: 0, signa: "" },
    mode: "onChange",
    resolver: zodResolver(addTreatmentSchema),
  });

  const PATIENT_TREATMENTS_PANEL = ["treatment"] as const;
  const PATIENT_TREATMENTS_FIELDS: Record<
    (typeof PATIENT_TREATMENTS_PANEL)[number],
    FormControlPropsType<TreatmentUnionFieldType>[]
  > = {
    treatment: [
      {
        label: "Treatment",
        dbField: "medicineId",
        required: true,
        type: "dropDown",
        entityId: 9,
        extendedProps: { gridAttribute: { xs: 12 } },
      },
      {
        label: "Signa",
        dbField: "signa",
        type: "textField",
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: {
            sx: { mt: 2 },
          },
        },
      },
    ],
  };

  const editTreatmentOnSubmit: SubmitHandler<ITreatment> = (
    data: ITreatment
  ) => {
    editTreatment(id, data);
    onClose("EDIT");
  };

  const closeAndReset = () => {
    onClose("EDIT");
    reset();
  };

  useEffect(() => {
    reset({ ...treatments.at(id) });
  }, [id]);

  return (
    <Dialog
      open={dialog.edit.showDialog}
      maxWidth={maxWidth ? maxWidth : "md"}
      fullWidth
    >
      <form onSubmit={handleSubmit(editTreatmentOnSubmit)}>
        <DialogContent>
          <DialogTitle textAlign="center">
            {dialog.edit.dialogTitle} Diagnosis
          </DialogTitle>

          <Grid container alignItems="center">
            {PATIENT_TREATMENTS_FIELDS["treatment"].map((obj, i) => (
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
                />
              </Grid>
            ))}
          </Grid>

          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => closeAndReset()}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default PhysicalCheckupDialog;
