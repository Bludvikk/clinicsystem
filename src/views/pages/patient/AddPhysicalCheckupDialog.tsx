// @ts-nocheck
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  Tab,
  Typography,
  IconButton,
  Paper,
  Theme,
  Breakpoint
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import isDeepEqual from 'fast-deep-equal/react';

import Icon from '@/@core/components/icon';
import IconifyIcon from '@/@core/components/icon';
// import { getPhysicians } from "@/server/hooks/patient";
import { getReferences } from '@/server/hooks/reference';
import {
  addDiagnosisSchema,
  addPhysicalCheckupSchema,
  addTreatmentSchema,
  IAddPhysicalCheckup,
  IDiagnosis,
  ITreatment
} from '@/server/schema/patient';
import { useDiagnosisStore, useTreatmentStore } from '@/utils/store';
import { postPhysicalCheckup } from '@/server/hooks/patient';

const AddPhysicalCheckupDialog: FC<{ id: number }> = ({ id }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tabsValue, setTabsValue] = useState<string>('1');

  // const { data: physiciansData, status: physiciansDataStatus } =
  //   getPhysicians();

  const { data: medicinesData, status: medicinesDataStatus } = getReferences({
    entities: [9]
  });

  const {
    diagnoses,
    addDiagnosis,
    removeDiagnosis,
    clearDiagnoses,
    onShow: diagnosisOnShow
  } = useDiagnosisStore(state => state);

  const {
    treatments,
    addTreatment,
    removeTreatment,
    clearTreatments,
    onShow: treatmentOnShow
  } = useTreatmentStore(state => state);

  const { mutate: postPhysicalCheckupMutate } = postPhysicalCheckup();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<IAddPhysicalCheckup>({
    defaultValues: {
      patientId: id,
      physicianId: 0,
      vitalSignId: 0,
      diagnoses: [],
      treatments: [],
      dietaryAdviseGiven: 'N/A',
      followUp: null
    },
    mode: 'onChange',
    resolver: zodResolver(addPhysicalCheckupSchema)
  });

  const {
    control: diagnosisControl,
    handleSubmit: diagnosisHandleSubmit,
    reset: diagnosisReset,
    formState: { errors: diagnosisErrors }
  } = useForm<IDiagnosis>({
    defaultValues: {
      name: ''
    },
    mode: 'onChange',
    resolver: zodResolver(addDiagnosisSchema)
  });

  const {
    control: treatmentControl,
    handleSubmit: treatmentHandleSubmit,
    reset: TreatmentReset,
    formState: { errors: treatmentErrors }
  } = useForm<ITreatment>({
    defaultValues: {
      medicineId: 0,
      signa: ''
    },
    mode: 'onChange',
    resolver: zodResolver(addTreatmentSchema)
  });

  const addPhysicalCheckupOnSubmit: SubmitHandler<IAddPhysicalCheckup> = (data: IAddPhysicalCheckup) => {
    postPhysicalCheckupMutate(data, {
      onSuccess: data => {
        toast.success(data.message);
        reset();
        clearDiagnoses();
        clearTreatments();
        setOpen(false);
      },
      onError: err => toast.error(err.message)
    });
  };

  const diagnosisOnSubmitHandler: SubmitHandler<IDiagnosis> = (data: IDiagnosis) => {
    addDiagnosis(data);
    diagnosisReset();
  };

  const treatmentOnSubmitHandler: SubmitHandler<ITreatment> = (data: ITreatment) => {
    addTreatment(data);
    TreatmentReset();
  };

  useEffect(() => {
    setValue('diagnoses', diagnoses);
  }, [isDeepEqual(getValues('diagnoses'), diagnoses)]);

  useEffect(() => {
    setValue('treatments', treatments);
  }, [isDeepEqual(getValues('treatments'), treatments)]);

  return (
    <Box>
      <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => setOpen(true)}>
        <Icon icon='tabler:checkup-list' fontSize={20} />
        Checkup
      </MenuItem>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='lg' fullWidth>
        <DialogTitle textAlign='center'>Patient Medical Checkup</DialogTitle>

        <Grid container px={5}>
          <Grid item xs={5} ml='auto'>
            <Controller
              control={control}
              name='physicianId'
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='physicianId-label'>Physician</InputLabel>
                  {/* <Select
                    label="Physician"
                    defaultValue=""
                    labelId="physicianId-label"
                    disabled={physiciansDataStatus === "loading"}
                    error={Boolean(errors.physicianId)}
                    {...field}
                  >
                    <MenuItem value="">Select Physician</MenuItem>
                    {physiciansData &&
                      physiciansData?.length > 0 &&
                      physiciansData?.map((physician) => (
                        <MenuItem key={physician.id} value={physician.id}>
                          {physician.lastName} {physician.firstName},
                        </MenuItem>
                      ))}
                  </Select> */}
                  <FormHelperText sx={{ color: 'error.main' }}>{errors['physicianId']?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} mt={3}>
            <TabContext value={tabsValue}>
              <TabList onChange={(e: SyntheticEvent<Element>, newValue: string) => setTabsValue(newValue)}>
                <Tab value='1' label='VITAL SIGNS' />
                <Tab value='2' label='CC/DIAGNOSIS' />
                <Tab value='3' label='TREATMENT' />
                <Tab value='4' label='DIETARY ADVISE & FOLLOW UP' />
              </TabList>
              <TabPanel value='1'>
                <Grid container spacing={5} mt={1}>
                  <Grid item lg={4} md={6} xs={12}>
                    <Controller
                      name='vitalSigns.t'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          name='vitalSigns.t'
                          label='T'
                          variant='outlined'
                          fullWidth
                          error={Boolean(errors.vitalSigns?.t)}
                          helperText={errors.vitalSigns?.t?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <Controller
                      name='vitalSigns.bp'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name='vitalSigns.bp'
                          label='BP'
                          variant='outlined'
                          fullWidth
                          error={Boolean(errors.vitalSigns?.bp)}
                          helperText={errors.vitalSigns?.bp?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <Controller
                      name='vitalSigns.cbg'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          name='vitalSigns.cbg'
                          label='CBG'
                          variant='outlined'
                          fullWidth
                          error={Boolean(errors.vitalSigns?.cbg)}
                          helperText={errors.vitalSigns?.cbg?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <Controller
                      name='vitalSigns.p'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          name='vitalSigns.p'
                          label='p'
                          variant='outlined'
                          fullWidth
                          error={Boolean(errors.vitalSigns?.p)}
                          helperText={errors.vitalSigns?.p?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <Controller
                      name='vitalSigns.wt'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          name='vitalSigns.wt'
                          label='WT'
                          variant='outlined'
                          fullWidth
                          error={Boolean(errors.vitalSigns?.wt)}
                          helperText={errors.vitalSigns?.wt?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item lg={4} md={6} xs={12}>
                    <Controller
                      name='vitalSigns.ht'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          name='vitalSigns.ht'
                          label='HT'
                          variant='outlined'
                          fullWidth
                          error={Boolean(errors.vitalSigns?.ht)}
                          helperText={errors.vitalSigns?.ht?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item lg={4} md={6} xs={12}>
                    <Controller
                      name='vitalSigns.r'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          name='vitalSigns.r'
                          label='R'
                          variant='outlined'
                          fullWidth
                          error={Boolean(errors.vitalSigns?.r)}
                          helperText={errors.vitalSigns?.r?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value='2'>
                <form onSubmit={diagnosisHandleSubmit(diagnosisOnSubmitHandler)}>
                  <Grid container mt={1} alignItems='center'>
                    <Grid item flex={3}>
                      <Controller
                        name='name'
                        control={diagnosisControl}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            name='diagnosis'
                            label='Diagnosis'
                            variant='outlined'
                            fullWidth
                            error={Boolean(diagnosisErrors.name)}
                            helperText={diagnosisErrors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <IconButton type='submit' color='primary'>
                        <IconifyIcon icon='material-symbols:add-circle' fontSize={50} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </form>

                <Paper
                  elevation={3}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    mt: 2,
                    p: 5,
                    backgroundColor: theme => theme.palette.grey[100]
                  }}
                >
                  <Box
                    sx={{
                      height: 180,
                      overflowY: 'auto'
                    }}
                  >
                    {diagnoses &&
                      diagnoses.length > 0 &&
                      diagnoses.map((diagnosis, i) => (
                        <Grid container justifyContent='space-between' alignItems='center' key={i}>
                          <Grid item>
                            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                              {diagnosis.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton type='button' color='secondary' onClick={() => diagnosisOnShow('EDIT', i)}>
                              <IconifyIcon icon='material-symbols:edit-outline' fontSize={20} />
                            </IconButton>
                            <IconButton type='button' color='secondary' onClick={() => removeDiagnosis(i)}>
                              <IconifyIcon icon='ic:outline-delete-outline' fontSize={20} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}

                    <EditDiagnosisDialog />
                  </Box>
                </Paper>
                <FormHelperText sx={{ color: 'error.main', marginTop: 1, marginX: 4 }}>
                  {diagnoses.length < 1 && errors['diagnoses']?.message}
                </FormHelperText>
              </TabPanel>
              <TabPanel value='3'>
                <form onSubmit={treatmentHandleSubmit(treatmentOnSubmitHandler)}>
                  <Grid container mt={1} alignItems='center'>
                    <Grid item flex={3}>
                      <Controller
                        name='medicineId'
                        control={treatmentControl}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id='medicineId-label'>Treatment</InputLabel>
                            <Select
                              label='Treatment'
                              defaultValue={0}
                              labelId='medicineId-label'
                              disabled={medicinesDataStatus === 'loading'}
                              error={Boolean(treatmentErrors.medicineId)}
                              {...field}
                            >
                              <MenuItem value={0}>Select Treatment</MenuItem>
                              {medicinesData &&
                                medicinesData?.length > 0 &&
                                medicinesData?.map(medicine => (
                                  <MenuItem key={medicine.id} value={medicine.id}>
                                    {medicine.name}
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {treatmentErrors.medicineId?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />

                      <Grid item flex={3} mt={2}>
                        <Controller
                          name='signa'
                          control={treatmentControl}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              name='signa'
                              label='signa'
                              variant='outlined'
                              fullWidth
                              error={Boolean(treatmentErrors.signa)}
                              helperText={treatmentErrors.signa?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <IconButton type='submit' color='primary'>
                        <IconifyIcon icon='material-symbols:add-circle' fontSize={50} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </form>

                <Paper
                  elevation={3}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    mt: 2,
                    p: 5,
                    backgroundColor: theme => theme.palette.grey[100]
                  }}
                >
                  <Box
                    sx={{
                      height: 220,
                      overflowY: 'auto'
                    }}
                  >
                    {treatments &&
                      treatments.length > 0 &&
                      treatments.map((treatment, i) => (
                        <Grid container justifyContent='space-between' alignItems='center' key={i}>
                          <Grid item>
                            <Box display='flex' flexDirection='column' flexWrap='wrap'>
                              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                {medicinesData?.filter(medicine => medicine.id === treatment.medicineId)[0].name}
                              </Typography>
                              <Typography variant='body2'>{treatment.signa}</Typography>
                            </Box>
                          </Grid>

                          <Grid item>
                            <IconButton type='button' color='secondary' onClick={() => treatmentOnShow('EDIT', i)}>
                              <IconifyIcon icon='material-symbols:edit-outline' fontSize={20} />
                            </IconButton>
                            <IconButton type='button' color='secondary' onClick={() => removeTreatment(i)}>
                              <IconifyIcon icon='ic:outline-delete-outline' fontSize={20} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}

                    <EditTreatmentDialog />
                  </Box>
                </Paper>
                <FormHelperText sx={{ color: 'error.main', marginTop: 1, marginX: 4 }}>
                  {treatments.length < 1 && errors['treatments']?.message}
                </FormHelperText>
              </TabPanel>
              <TabPanel value='4'>
                <Grid container rowGap={5}>
                  <Grid item xs={12}>
                    <Controller
                      name='dietaryAdviseGiven'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name='dietaryAdviseGiven'
                          label='Dietary Advise Given'
                          variant='outlined'
                          fullWidth
                          multiline
                          rows={5}
                          error={Boolean(errors.dietaryAdviseGiven)}
                          helperText={errors.dietaryAdviseGiven?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Controller
                      name='followUp'
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          sx={{ width: '100%' }}
                          label='Follow up'
                          slotProps={{
                            textField: {
                              error: Boolean(errors.followUp),
                              helperText: errors.followUp?.message
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>

        {/* use for debugging form values in react hook form */}
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}

        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit(addPhysicalCheckupOnSubmit)}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Dialogs
type PropsType = {
  maxWidth?: Breakpoint;
};

const EditDiagnosisDialog: FC<PropsType> = ({ maxWidth }) => {
  const { id, diagnoses, onClose, editDiagnosis, dialog } = useDiagnosisStore(state => state);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<IDiagnosis>({
    defaultValues: { name: '' },
    mode: 'onChange',
    resolver: zodResolver(addDiagnosisSchema)
  });

  useEffect(() => {
    reset({ ...diagnoses.at(id) });
  }, [id]);

  const editDiagnosisOnSubmitHandler: SubmitHandler<IDiagnosis> = (data: IDiagnosis) => {
    editDiagnosis(id, data);
    onClose('EDIT');
  };

  const closeAndReset = () => {
    onClose('EDIT');
    reset();
  };

  return (
    <Dialog open={dialog.edit.showDialog} maxWidth={maxWidth ? maxWidth : 'md'} fullWidth>
      <DialogTitle textAlign='center'>{dialog.edit.dialogTitle}</DialogTitle>

      <form onSubmit={handleSubmit(editDiagnosisOnSubmitHandler)}>
        <Grid container p={5} alignItems='center'>
          <Grid item xs={12}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  name='name'
                  label='Diagnosis'
                  variant='outlined'
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => closeAndReset()}>
            Cancel
          </Button>
          <Button type='submit' variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const EditTreatmentDialog: FC<PropsType> = ({ maxWidth }) => {
  const { id, treatments, onClose, editTreatment, dialog } = useTreatmentStore(state => state);

  const { data: medicinesData, status: medicinesDataStatus } = getReferences({
    entities: [14]
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ITreatment>({
    defaultValues: { medicineId: 0, signa: '' },
    mode: 'onChange',
    resolver: zodResolver(addTreatmentSchema)
  });

  useEffect(() => {
    reset({ ...treatments.at(id) });
  }, [id]);

  const editTreatmentOnSubmitHandler: SubmitHandler<ITreatment> = (data: ITreatment) => {
    editTreatment(id, data);
    onClose('EDIT');
  };

  const closeAndReset = () => {
    onClose('EDIT');
    reset();
  };

  return (
    <Dialog open={dialog.edit.showDialog} maxWidth={maxWidth ? maxWidth : 'md'} fullWidth>
      <DialogTitle textAlign='center'>{dialog.edit.dialogTitle}</DialogTitle>

      <form onSubmit={handleSubmit(editTreatmentOnSubmitHandler)}>
        <Grid container p={5} alignItems='center'>
          <Grid item xs={12}>
            <Controller
              name='medicineId'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='medicineId-label'>Treatment</InputLabel>
                  <Select
                    label='Treatment'
                    defaultValue={0}
                    labelId='medicineId-label'
                    disabled={medicinesDataStatus === 'loading'}
                    error={Boolean(errors.medicineId)}
                    {...field}
                  >
                    <MenuItem value={0}>Select Treatment</MenuItem>
                    {medicinesData &&
                      medicinesData?.length > 0 &&
                      medicinesData?.map(medicine => (
                        <MenuItem key={medicine.id} value={medicine.id}>
                          {medicine.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.medicineId?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Grid item xs={12} mt={2}>
              <Controller
                name='signa'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    name='signa'
                    label='signa'
                    variant='outlined'
                    fullWidth
                    error={Boolean(errors.signa)}
                    helperText={errors.signa?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => closeAndReset()}>
            Cancel
          </Button>
          <Button type='submit' variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPhysicalCheckupDialog;
