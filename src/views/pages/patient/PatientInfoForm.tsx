import React, { useState, useEffect, forwardRef, ReactElement, Ref, ChangeEvent } from 'react'

import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Step,
  Stepper,
  StepLabel,
  Divider,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  ListItemText,
  TextField,
  Stack,
  DialogProps,
  ListItemTextProps
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import StepperWrapper from '@/@core/styles/mui/stepper'
import StepperCustomDot from '@/views/AddUserWizard/StepperCustomDot'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControlPropsType, FormPropsType } from '@/utils/common.type'
import {
  PatientSchema,
  PatientUnionFieldType,
  PatientDtoSchemaType,
  addPatientSchema,
  IAddPatient,
  MedicationDtoType,
  IMedication,
  addMedicationSchema
} from '@/server/schema/patient'
import { findPatientDataById, postPatient } from '@/server/hooks/patient'
import Fade, { FadeProps } from '@mui/material/Fade'
import toast from 'react-hot-toast'

import { Fragment } from 'react'
import { errorUtil } from '@/utils/helper'
import { FormObjectComponent, ListItemComponent } from '@/utils/form.component'
import { usePatientFormStore } from '@/utils/store'
import { getReferences } from '@/server/hooks/reference'
import { maxHeight } from '@mui/system'
import { create } from 'zustand'
import { useMedicationStore } from './store'

import { ListItemTextPropsType } from '@/utils/common.type'
import moment from 'moment'

const PERSONAL_PANEL = ['PersonalInformation'] as const
const PERSONAL_FIELDS: Record<typeof PERSONAL_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  PersonalInformation: [
    {
      label: 'First Name',
      dbField: 'firstName',
      type: 'textField',
      required: true,
      autoFocus: true,
      extendedProps: { gridProps: { xs: 5 } }
    },
    {
      label: 'Last Name',
      dbField: 'lastName',
      type: 'textField',
      required: true,
      autoFocus: true,
      extendedProps: { gridProps: { xs: 5 } }
    },
    {
      label: 'Middle Initial',
      dbField: 'middleInitial',
      type: 'textField',
      required: true,
      autoFocus: true,
      extendedProps: { gridProps: { xs: 2 } }
    },
    {
      label: 'Address',
      dbField: 'address',
      type: 'multiline',
      required: true,
      extendedProps: { gridProps: { xs: 12 } }
    },
    { label: 'Date of Birth', dbField: 'dateOfBirth', type: 'DatePicker', required: true },
    { label: 'Age', dbField: 'age', type: 'textField' },
    { label: 'Gender', dbField: 'genderId', type: 'dropDown', required: true, entityId: 1 },
    { label: 'Civil Status', dbField: 'civilStatusId', type: 'dropDown', required: true, entityId: 2 },
    { label: 'Occupation', dbField: 'occupationId', type: 'dropDown', required: true, entityId: 3 },
    { label: 'Contact Number', dbField: 'contactNumber', type: 'textField' }
  ]
}

const pHISTORY_PANEL = ['pHistoryPanel'] as const
const pHISTORY_FIELDS: Record<typeof pHISTORY_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  pHistoryPanel: [
    { label: 'No. of Sticks per day', dbField: 'personalHistory.smoking', type: 'textField' },
    { label: 'No. of Years consuming alcohol', dbField: 'personalHistory.alcohol', type: 'textField' },
    { label: 'Current Health Condition', dbField: 'personalHistory.currentHealthCondition', type: 'textField' }
  ]
}

const MEDICATIONS_PANEL = ['MedicationsPanel'] as const
const MEDICATIONS_FIELDS: Record<typeof MEDICATIONS_PANEL[number], FormControlPropsType<MedicationDtoType>[]> = {
  MedicationsPanel: [
    { label: 'BrandName', dbField: 'brandName', type: 'textField' },
    { label: 'Generic', dbField: 'generic', type: 'textField' },
    { label: 'Dosage', dbField: 'dosage', type: 'textField' }
  ]
}

const PASTMEDICALHISTORY_PANEL = ['PastMedicalHistoryPanel'] as const
const PASTMEDICALHISTORY_FIELDS: Record<
  typeof PASTMEDICALHISTORY_PANEL[number],
  FormControlPropsType<PatientUnionFieldType>[]
> = {
  PastMedicalHistoryPanel: [
    { label: 'Hospitalized', dbField: 'pastMedicalHistory.hospitalized', type: 'textField' },
    { label: 'Injuries', dbField: 'pastMedicalHistory.injuries', type: 'textField' },
    { label: 'Surgeries', dbField: 'pastMedicalHistory.surgeries', type: 'textField' },
    { label: 'Allergies', dbField: 'pastMedicalHistory.allergies', type: 'textField' },
    { label: 'Measles', dbField: 'pastMedicalHistory.measles', type: 'textField' },
    { label: 'Chicken Pox', dbField: 'pastMedicalHistory.chickenPox', type: 'textField' },
    { label: 'Others', dbField: 'pastMedicalHistory.others', type: 'textField' }
  ]
}

const OBGYNE_PANEL = ['ObgynePanel'] as const
const OBGYNE_FIELDS: Record<typeof OBGYNE_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  ObgynePanel: [
    { label: 'Menstrual Cycle Date', dbField: 'obGyne.menstrualCycle', type: 'DatePicker' },
    { label: 'Cycle Days', dbField: 'obGyne.days', type: 'textField' },
    { label: 'Para', dbField: 'obGyne.p', type: 'textField' },
    { label: 'Gravida', dbField: 'obGyne.g', type: 'textField' }
  ]
}

const steps = [
  {
    title: 'Personal Information'
  },
  {
    title: 'Family History'
  },
  {
    title: 'Personal History'
  },
  {
    title: 'Past Medical History'
  },
  {
    title: 'Obstetrics and Gynecology'
  }
]

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const PatientInfoForm = ({ formId }) => {
  const { id, onClosing, onSaving } = usePatientFormStore()
  const [activeStep, setActiveStep] = useState(0)
  const [show, setShow] = useState<boolean>(false)
  const { data: referencesData } = getReferences({ entities: [4, 1, 2, 3] })
  const addMedication = useMedicationStore(state => state.addMedication)
  const medications = useMedicationStore(state => state.medications)
  const { removeMedication } = useMedicationStore()

  const patientData = findPatientDataById({ id })

  const {
    control,
    setError,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<PatientDtoSchemaType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleInitial: '',
      address: '',
      dateOfBirth: new Date(''),
      age: 0,
      genderId: 0,
      civilStatusId: 0,
      occupationId: 0,
      contactNumber: '',
      familyHistory: {
        diseases: [],
        others: ''
      },
      personalHistory: {
        smoking: 0,
        alcohol: 0,
        currentHealthCondition: '',
        medications: []
      },
      pastMedicalHistory: {
        hospitalized: '',
        injuries: '',
        surgeries: '',
        allergies: '',
        measles: '',
        chickenPox: '',
        others: ''
      },
      obGyne: {
        menstrualCycle: new Date(),
        days: 0,
        p: 0,
        g: 0
      }
    },
    // resolver: zodResolver(addPatientSchema),
    mode: 'onChange'
  })

  const values = getValues()
  function calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const dateOfBirth = watch('dateOfBirth')
  const age = calculateAge(dateOfBirth)

  useEffect(() => {
    setValue('age', age)
  }, [dateOfBirth, setValue, age])

  const REVIEW_PANEL = ['ReviewPanel', 'FamilyPanel', 'PersonalHistoryPanel', 'PastMedicalHistoryPanel', 'ObgynePanel'] as const
  const REVIEW_FIELDS: Record<typeof REVIEW_PANEL[number], ListItemTextPropsType[]> = {
    ReviewPanel: [
      {
        label: 'First Name',
        type: 'ListItemText',
        secondary: values.firstName,
        extendedProps: { gridProps: { xs: 5 } }
      },
      { label: 'Last Name', type: 'ListItemText', secondary: values.lastName, extendedProps: { gridProps: { xs: 5 } } },
      {
        label: 'Middle Initial',
        type: 'ListItemText',
        secondary: values.middleInitial,
        extendedProps: { gridProps: { xs: 2 } }
      },
      {
        label: 'Date of Birth',
        type: 'ListItemText',
        secondary: moment(values.dateOfBirth).format('L'),
        extendedProps: { gridProps: { xs: 5 } }
      },
      { label: 'Age', type: 'ListItemText', secondary: values.age, extendedProps: { gridProps: { xs: 5 } } },
      {
        label: 'Gender',
        type: 'ListItemText',
        secondary: referencesData?.filter(ref => ref.id === values.genderId)[0]?.name,
        extendedProps: { gridProps: { xs: 2 } }
      },
      {
        label: 'Civil Status',
        type: 'ListItemText',
        secondary: referencesData?.filter(ref => ref.id === values.civilStatusId)[0]?.name,
        extendedProps: { gridProps: { xs: 5 } }
      },
      {
        label: 'Occupation',
        type: 'ListItemText',
        secondary: referencesData?.filter(ref => ref.id === values.occupationId)[0]?.name,
        extendedProps: { gridProps: { xs: 5 } }
      },
      {
        label: 'Contact Number',
        type: 'ListItemText',
        secondary: values.contactNumber,
        extendedProps: { gridProps: { xs: 2 } }
      },
      { label: 'Address', type: 'ListItemText', secondary: values.address, extendedProps: { gridProps: { xs: 12 } } }
    ],
    //@ts-ignore
    FamilyPanel: referencesData
      ?.filter(ref => ref.entityId === 4)
      .map(ref => ({
        label: ref.name,
        type: 'ListItemText',
        secondary: values.familyHistory.diseases.includes(ref.id) ? (
          <Icon icon='material-symbols:check-circle-outline' color='green' />
        ) : (
          <Icon icon='gridicons:cross-circle' color='red' />
        ),
        extendedProps: { gridProps: { sm: 2 } }
      })),

    PersonalHistoryPanel: [
      { label: 'Sticks per day', type: 'ListItemText', secondary: values.personalHistory.smoking },
      { label: 'Years of drinking alcohol', type: 'ListItemText', secondary: values.personalHistory.alcohol },
      {
        label: 'Current Health Condition',
        type: 'ListItemText',
        secondary: values.personalHistory.currentHealthCondition
      }
    ],
    PastMedicalHistoryPanel: [
      { label: 'Hospitalized', type: 'ListItemText', secondary: values.pastMedicalHistory.hospitalized },
      { label: 'Injuries', type: 'ListItemText', secondary: values.pastMedicalHistory.injuries },
      { label: 'Surgeries', type: 'ListItemText', secondary: values.pastMedicalHistory.surgeries },
      { label: 'Allergies', type: 'ListItemText', secondary: values.pastMedicalHistory.allergies },
      { label: 'Measles', type: 'ListItemText', secondary: values.pastMedicalHistory.measles },
      { label: 'Chicken Pox', type: 'ListItemText', secondary: values.pastMedicalHistory.chickenPox },
      { label: 'Others', type: 'ListItemText', secondary: values.pastMedicalHistory.others, extendedProps: { gridProps: { xs: 12 } } },
    ],
    ObgynePanel: [
      { label: 'Menstrual Cycle Date', type: 'ListItemText', secondary: moment(values.obGyne.menstrualCycle).format('L') },
      { label: 'Menstrual Days', type: 'ListItemText', secondary: values.obGyne.days },
      { label: 'P (Para)', type: 'ListItemText', secondary: values.obGyne.p },
      { label: 'G (Gravida)', type: 'ListItemText', secondary: values.obGyne.g },
    ]
      
  }

  // referencesData?.filter(ref => ref.entityId === 4).map(ref => ({
  //   label: ref.name, type: 'ListItemText', secondary: values.familyHistory.diseases.includes(ref.id) ? <Icon icon='material-symbols:check-small-rounded' color='green' fontSize={30}/> : <Icon icon='gridicons:cross' color='red' fontSize={30} />
  // }))

  const {
    reset: resetMed,
    control: controlMed,
    handleSubmit: handleMed,
    formState: { errors: ErrorMed },
    watch: watchMed
  } = useForm<IMedication>({
    defaultValues: {
      brandName: '',
      generic: '',
      dosage: ''
    },
    mode: 'onChange'
  })

  console.log('Yawa', watchMed())

  const submitMed = (data: IMedication) => {
    addMedication(data)
    resetMed()
  }

  console.log(errors)

  const onSubmit = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    reset()
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const { mutate: postPatientData, isLoading: isLoadingPostPatient } = postPatient()

  useEffect(() => {
    onSaving(isLoadingPostPatient)
  }, [isLoadingPostPatient])

  const handleFamilyHistoryDisease = (e: ChangeEvent<HTMLInputElement>) => {
    const currentDiseasesValue = getValues('familyHistory.diseases')

    if (e.target.checked) setValue('familyHistory.diseases', [...currentDiseasesValue, parseInt(e.target.value)])
    else {
      const filterValue = currentDiseasesValue.filter(value => value !== parseInt(e.target.value))
      setValue('familyHistory.diseases', [...filterValue])
    }
  }

  const addPatientOnSubmitHandler: SubmitHandler<IAddPatient> = async (data: IAddPatient) => {
    postPatientData(data, {
      onSuccess(data) {
        toast.success(data.message)
        reset()
      },
      onError(error) {
        toast.error(error.message)
      }
    })
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
              </Grid>
              <Grid
                sx={{
                  pb: 6,
                  px: { xs: 8, sm: 15 },
                  pt: { xs: 8, sm: 8 },
                  position: 'relative'
                }}
              >
                <Grid container spacing={6}>
                  {PERSONAL_FIELDS['PersonalInformation'].map((obj, index) => {
                    const { extendedProps } = obj

                    let gridProps
                    if (extendedProps) {
                      gridProps = extendedProps.gridProps
                    }

                    return (
                      <Grid item {...(gridProps ? gridProps : { xs: 6 })} key={obj.dbField}>
                        <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                      </Grid>
                    )
                  })}

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size='large' type='submit' variant='contained'>
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
              </Grid>
              <Grid
                sx={{
                  pb: 6,
                  px: { xs: 8, sm: 15 },
                  pt: { xs: 8, sm: 8 }
                }}
              >
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    {referencesData &&
                      referencesData.length > 0 &&
                      referencesData
                        .filter(ref => ref.entityId === 4)
                        .map(ref => (
                          <Controller
                            name='familyHistory.diseases'
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                label={ref.name}
                                control={
                                  <Checkbox
                                    {...field}
                                    value={ref.id}
                                    name='familyHistory.diseases'
                                    onChange={handleFamilyHistoryDisease}
                                  />
                                }
                              />
                            )}
                          />
                        ))}
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                      Back
                    </Button>
                    <Button size='large' onClick={handleSubmit(onSubmit)} variant='contained'>
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </form>
        )
      case 2:
        return (
          <form key={2}>
            <Box>
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <form>
                    <Typography>Current Medications Taken</Typography>
                    <Divider />
                    <Grid container spacing={2}>
                      {MEDICATIONS_FIELDS['MedicationsPanel'].map((obj, index) => (
                        <Grid key={obj.dbField} item xs={3.4}>
                          <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                        </Grid>
                      ))}
                      <Grid item xs={1}>
                        <IconButton sx={{ position: 'relative', top: '6px' }} onClick={handleMed(submitMed)}>
                          <Icon icon='ic:baseline-add-circle-outline' />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </form>

                  <Divider />
                  <Paper elevation={3}>
                    <Box
                      sx={{
                        height: 300,
                        maxHeight: 300,
                        overflow: 'auto',
                        backgroundColor: 'Window',
                        p: 5,
                        borderRadius: 2
                      }}
                    >
                      {medications.length > 0 &&
                        medications.map((medication, i) => (
                          <Box sx={{ p: 2 }} key={i}>
                            <Grid container spacing={1}>
                              <Grid item xs={5}>
                                <ListItemText primary={medication.generic} secondary={medication.brandName} />
                              </Grid>
                              <Grid item xs={4} mt={4}>
                                <ListItemText secondary={medication.dosage} />
                              </Grid>
                              <Grid item xs={2} mt={2}>
                                <Button onClick={() => removeMedication(i)}>
                                  <Icon icon='ph:trash-thin' />
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Additional Personal Information</Typography>
                  <Divider />
                  <Grid container spacing={2}>
                    {pHISTORY_FIELDS['pHistoryPanel'].map((obj, index) => (
                      <Grid key={obj.dbField} item xs={12}>
                        <FormObjectComponent key={index} objFieldProp={obj} control={controlMed} errors={ErrorMed} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                    Back
                  </Button>
                  <Button size='large' onClick={handleSubmit(onSubmit)} variant='contained'>
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )
      case 3:
        return (
          <form key={3}>
            <Box>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[3].title}
                </Typography>
              </Grid>
              <Grid container spacing={6}>
                <Grid sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 8 }, position: 'relative' }}>
                  <Grid container spacing={6}>
                    {PASTMEDICALHISTORY_FIELDS['PastMedicalHistoryPanel'].map((obj, index) => (
                      <Grid key={obj.dbField} item sm={6} xs={12}>
                        <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                    Back
                  </Button>
                  <Button size='large' onClick={handleSubmit(onSubmit)} variant='contained'>
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )
      case 4:
        return (
          <form key={4}>
            <Box>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[4].title}
                </Typography>
              </Grid>
              <Grid sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 8 }, position: 'relative' }}>
                <Grid container spacing={6}>
                  {OBGYNE_FIELDS['ObgynePanel'].map((obj, index) => (
                    <Grid key={obj.dbField} item sm={6} xs={12}>
                      <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                    Back
                  </Button>
                  <Button size='large' onClick={handleSubmit(onSubmit)} variant='contained'>
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )
    }
  }
  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed! Please Review all the Details Below</Typography>
          <Divider />
          <Paper elevation={4} sx={{ backgroundColor: 'action.hover', p: '20px' }}>
            <Box>
              <Grid container spacing={0.5}>
                <Grid item xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[0].title}
                  </Typography>
                </Grid>

                <Grid container spacing={2}>
                  {REVIEW_FIELDS['ReviewPanel'].map((obj, index) => {
                    const { extendedProps } = obj

                    let gridProps
                    if (extendedProps) {
                      gridProps = extendedProps.gridProps
                    }
                    return (
                      <Grid key={obj.secondary} item {...(gridProps ? gridProps : { xs: 6 })} sx={{}}>
                        <ListItemComponent key={index} objFieldProp={obj} />
                      </Grid>
                    )
                  })}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                  <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[1].title}
                  </Typography>
                </Grid>
                <Grid container spacing={2}>
                  {REVIEW_FIELDS['FamilyPanel'].map((obj, index) => {
                    const { extendedProps } = obj

                    let gridProps
                    if (extendedProps) {
                      gridProps = extendedProps.gridProps
                    }
                    return (
                      <Grid key={obj.secondary} item {...(gridProps ? gridProps : { xs: 2 })}>
                        <ListItemComponent key={index} objFieldProp={obj} />
                      </Grid>
                    )
                  })}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                  <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[2].title}
                  </Typography>
                  <Grid container spacing={2}>
                    {REVIEW_FIELDS['PersonalHistoryPanel'].map((obj, index) => {
                      const { extendedProps } = obj

                      let gridProps
                      if (extendedProps) {
                        gridProps = extendedProps.gridProps
                      }
                      return (
                        <Grid key={obj.secondary} item {...(gridProps ? gridProps : { xs: 4 })}>
                          <ListItemComponent key={index} objFieldProp={obj} />
                        </Grid>
                      )
                    })}
                  </Grid>
                  <Typography variant='body1' sx={{ fontWeight: 600, color: 'GrayText' }}>
                    Medications Taken
                  </Typography>
                  <Paper>
                    {medications.length > 0 &&
                      medications.map((medication, index) => (
                        <Box key={index} sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={3}>
                              <ListItemText primary={medication.generic} secondary={medication.brandName} />
                            </Grid>
                            <Grid item xs={3}>
                              <ListItemText secondary={medication.dosage} />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                  </Paper>
                  <Divider />
                  <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[3].title}
                  </Typography>
                    <Grid container spacing={2}>
                    {REVIEW_FIELDS['PastMedicalHistoryPanel'].map((obj, index) => {
                      const { extendedProps } = obj

                      let gridProps
                      if (extendedProps) {
                        gridProps = extendedProps.gridProps
                      }
                      return (
                        <Grid key={obj.secondary} item {...(gridProps ? gridProps : { xs: 6 })}>
                          <ListItemComponent key={index} objFieldProp={obj} />
                        </Grid>
                      )
                    })}
                    </Grid>
                    <Divider />
                  <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[4].title}
                  </Typography>
                  <Grid container spacing={2}>
                    {REVIEW_FIELDS['ObgynePanel'].map((obj, index) => {
                      const { extendedProps } = obj

                      let gridProps
                      if (extendedProps) {
                        gridProps = extendedProps.gridProps
                      }
                      return (
                        <Grid key={obj.secondary} item {...(gridProps ? gridProps : { xs: 6 })}>
                          <ListItemComponent key={index} objFieldProp={obj} />
                        </Grid>
                      )
                    })}
                    </Grid>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
              Back
            </Button>
            <Button size='large' variant='contained' onClick={handleSubmit(addPatientOnSubmitHandler)}>
              Submit
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <Button variant='contained' onClick={() => setShow(true)}>
        Add Patient
      </Button>

      <Dialog
        fullWidth
        open={show}
        maxWidth='lg'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh',
            maxWidth: '140vh'
          }
        }}
      >
        <DialogContent
          sx={{
            pb: 6,
            px: { xs: 8, sm: 15 },
            pt: { xs: 8, sm: 12.5 },
            position: 'relative'
          }}
        >
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Add Patient Information to the system
            </Typography>
            <Typography variant='body2'>Adding patient information will receive a privacy audit</Typography>
          </Box>

          <CardContent>
            <StepperWrapper>
              <Stepper activeStep={activeStep}>
                {steps.map((step, index) => {
                  const labelProps: {
                    error?: boolean
                  } = {}
                  if (index === activeStep) {
                    labelProps.error = false
                    if (errors.firstName && activeStep === 0) {
                      labelProps.error = true
                    } else {
                      labelProps.error = false
                    }
                  }
                  return (
                    <Step key={index}>
                      <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <Typography className='step-number'>{`${index + 1}`}</Typography>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />

          <CardContent>{renderContent()}</CardContent>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PatientInfoForm
