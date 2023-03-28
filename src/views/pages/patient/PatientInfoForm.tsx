import { useState, useEffect} from 'react'


import { Box, Grid } from '@mui/material'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControlPropsType, FormPropsType } from '@/utils/common.type'
import { PatientSchema, PatientUnionFieldType, PatientDtoSchemaType } from '@/server/schema/patient'
import { findPatientDataById, postPatient } from '@/server/hooks/patient'

import toast from 'react-hot-toast'

import { errorUtil } from '@/utils/helper'
import { FormObjectComponent } from '@/utils/form.component'
import { usePatientFormStore } from '@/utils/store'

const PERSONAL_PANEL = ['PersonalInformation'] as const
const PERSONAL_FIELDS: Record<typeof PERSONAL_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> = {
  PersonalInformation: [
    {label: 'First Name', dbField: 'firstName', type: 'textField', required: true, autoFocus: true},
    {label: 'Last Name', dbField: 'lastName', type: 'textField', required: true, autoFocus: true},
    {label: 'Middle Initial', dbField: 'middleInitial', type: 'textField', required: true, autoFocus: true},
    {label: 'Gender', dbField: 'genderId', type: 'dropDown', entityId: 1},
    {label: 'Occupation', dbField: 'occupationId', type: 'dropDown', entityId: 2},
    {label: 'Civil Status', dbField: 'civilStatusId', type: 'dropDown', entityId: 3},
    {label: 'Contact Number', dbField: 'contactNumber', type: 'number', required: true, autoFocus: true},

  ]
}
const MULTILINE_PANEL = ['AddressPanel'] as const
const MULTILINE_FIELDS: Record<typeof MULTILINE_PANEL[number], FormControlPropsType<PatientUnionFieldType>[]> ={
  AddressPanel: [
    {label: 'Address', dbField: 'address', type: 'multiline', required: true, autoFocus: true},
  ]
}
const PatientInfoForm = ({ formId }: FormPropsType) => {
  const { id, onClosing, onSaving} = usePatientFormStore()

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

  }

  const patientData = findPatientDataById({ id })

  const {
    control,
    formState: { errors },
    setError,
    handleSubmit,
    reset
  } = useForm<PatientDtoSchemaType>({
    defaultValues,
    resolver: zodResolver(PatientSchema),
    mode: 'onChange'
  })

const handleClose = () => {
  onClosing()
  reset(defaultValues)
}

const { mutate: postPatientData, isLoading: isLoadingPostPatient } = postPatient()

  useEffect(() => {
    onSaving(isLoadingPostPatient)
  }, [isLoadingPostPatient])

return (
  <Box>
    <Grid sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 8 }, position: 'relative' }}>
          <Grid container spacing={6}>
            {PERSONAL_FIELDS['PersonalInformation'].map((obj, index) => (
              <Grid key={obj.dbField} item sm={6} xs={12}>
                <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid sx={{ pb: 6, px: { xs: 8, sm: 15 }, position: 'relative' }}>
          <Grid container spacing={6}>
            {MULTILINE_FIELDS['AddressPanel'].map((obj, index) => (
              <Grid key={obj.dbField} item xs={12}>
                <FormObjectComponent key={index} objFieldProp={obj} control={control} errors={errors} />
              </Grid>
            ))}
          </Grid>
        </Grid>
  </Box>
)
}

export default PatientInfoForm
