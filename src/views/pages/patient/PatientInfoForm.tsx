import { useState, useEffect, forwardRef, ReactElement, Ref, ChangeEvent } from 'react'

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
  IconButton
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import StepperWrapper from '@/@core/styles/mui/stepper'
import StepperCustomDot from '@/views/AddUserWizard/StepperCustomDot'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControlPropsType, FormPropsType } from '@/utils/common.type'
import { PatientSchema, PatientUnionFieldType, PatientDtoSchemaType } from '@/server/schema/patient'
import { findPatientDataById, postPatient } from '@/server/hooks/patient'
import Fade, { FadeProps } from '@mui/material/Fade'
import toast from 'react-hot-toast'

import { Fragment } from 'react'
import { errorUtil } from '@/utils/helper'
import { FormObjectComponent } from '@/utils/form.component'
import { usePatientFormStore } from '@/utils/store'
import { getReferences } from '@/server/hooks/reference'

const PERSONAL_PANEL = ['PersonalInformation'] as const
const PERSONAL_FIELDS: Record<typeof PERSONAL_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  PersonalInformation: [
    {label: "First Name", dbField: "firstName", type: "textField", required: true, autoFocus: true},
    {label: "Last Name", dbField: "lastName", type: "textField", required: true, autoFocus: true},
  ]
}
const MIDDLE_PANEL = ['MiddleInitialPanel'] as const
const MIDDLE_FIELDS: Record<typeof MIDDLE_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  MiddleInitialPanel: [
    {label: "Middle Initial", dbField: "middleInitial", type: "textField", required: true, autoFocus: true},
  ]
}

const ADDRESS_PANEL = ['AddressPanel'] as const
const ADDRESS_FIELDS: Record<typeof ADDRESS_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  AddressPanel: [
    {label: "Address", dbField: "address", type: "multiline", required: true}
  ]
}

const ADDITIONAL_PANEL = ['AdditionalPanel'] as const
const ADDITIONAL_FIELDS: Record<typeof ADDITIONAL_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  AdditionalPanel: [
    { label: "Date of Birth", dbField: 'dateOfBirth', type: 'DatePicker', required: true },
    { label: "Age", dbField: 'age', type: 'number', required: true },
    { label: "Gender", dbField: 'genderId', type: 'dropDown', required: true, entityId: 1 },
    { label: "Civil Status", dbField: 'civilStatusId', type: 'dropDown', required: true, entityId: 2 },
    { label: "Occupation", dbField: 'occupationId', type: 'dropDown', required: true, entityId: 3 },
    { label: "Contact Number", dbField: 'contactNumber', type: 'number', required: true },
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

const PatientInfoForm = ({ formId }: FormPropsType) => {
  const { id, onClosing, onSaving } = usePatientFormStore()
  const [activeStep, setActiveStep] = useState(0)
  const [show, setShow] = useState<boolean>(false)

  const patientData = findPatientDataById({ id })

  const {
    control,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues
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
        menstrualCycle: new Date(''),
        days: 0,
        p: 0,
        g: 0
      }
    },
    // resolver: zodResolver(PatientSchema),
    mode: 'onChange'
  })

  console.log(watch('familyHistory.diseases'))
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
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const { mutate: postPatientData, isLoading: isLoadingPostPatient } = postPatient()

  useEffect(() => {
    onSaving(isLoadingPostPatient)
  }, [isLoadingPostPatient])

  console.log(watch())
  const { data: referencesData } = getReferences({ entities: [4] })
  const handleFamilyHistoryDisease = (e: ChangeEvent<HTMLInputElement>) => {
    const currentDiseasesValue = getValues('familyHistory.diseases')

    if (e.target.checked) setValue('familyHistory.diseases', [...currentDiseasesValue, parseInt(e.target.value)])
    else {
      const filterValue = currentDiseasesValue.filter(value => value !== parseInt(e.target.value))
      setValue('familyHistory.diseases', [...filterValue])
    }
  }
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0}>
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
                  {PERSONAL_FIELDS['PersonalInformation'].map((obj, index) => (
                    <Grid key={obj.dbField} item xs={5}>
                      <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                    </Grid>
                  ))}
                  {MIDDLE_FIELDS['MiddleInitialPanel'].map((obj, index) => (
                    <Grid key={obj.dbField} item xs={2}>
                      <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                    </Grid>
                  ))}
                  {ADDRESS_FIELDS['AddressPanel'].map((obj, index) => (
                    <Grid key={obj.dbField} item xs={12}>
                      <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                    </Grid>
                  ))}
                  {ADDITIONAL_FIELDS['AdditionalPanel'].map((obj, index) => (
                    <Grid key={obj.dbField} item sm={6} xs={12}>
                      <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
                    </Grid>
                  ))}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size='large' onClick={handleSubmit(onSubmit)} variant='contained'>
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
                      referencesData.map(ref => (
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
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[2].title}
                </Typography>
              </Grid>
              <Grid container spacing={6}>
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
              <Grid container spacing={6}>
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
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleReset}>
              Reset
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
