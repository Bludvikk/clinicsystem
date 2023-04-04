import { fetchDependencyData, getReference, getReferences } from '@/server/hooks/reference'
import { InputLabel, Select, MenuItem, TextField, FormControl, TextFieldProps, SelectProps, FormControlLabel, Checkbox, ListItemText } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import { DefaultComponentProps, OverridableTypeMap } from '@mui/material/OverridableComponent'
import { DatePicker } from '@mui/x-date-pickers'
import { contextProps } from '@trpc/react-query/shared'
import { values } from 'lodash'
import { Controller, ControllerFieldState, ControllerRenderProps, FieldErrorsImpl } from 'react-hook-form'
import { FormControlPropsType, ListItemTextPropsType } from './common.type'
import { getFilterObjValue } from './helper'

type ListContextType = {
  objFieldProp: ListItemTextPropsType
  extendedProps: any
}

export function ListContextType(props: ListContextType) {
  const { objFieldProp, extendedProps } = props
  const { gridAttributes, listItemTextAttribute } = extendedProps
  const label = objFieldProp.required ? objFieldProp.label + '*' : objFieldProp.label


  switch(objFieldProp.type) {
    case 'ListItemText':
      return(
        <ListItemText
        {...listItemTextAttribute}
        primary={label}

        />
      )
  }
}

type FormContextType<TUnion> = {
  objFieldProp: FormControlPropsType<TUnion>
  field: ControllerRenderProps
  fieldState: ControllerFieldState
  control: any
  errors: FieldErrorsImpl
  extendedProps: any
}

export function FormContextType<TUnion>(props: FormContextType<TUnion>) {
  const { objFieldProp, field, fieldState, extendedProps } = props
  const { textFieldAttribute, dropDownAttribute, formControlAttribute } = extendedProps


  const label = objFieldProp.required ? objFieldProp.label + '*' : objFieldProp.label


  switch (objFieldProp.type) {
    case 'dropDown':
      return (
        <DropdownData
          type='control'
          id={objFieldProp.entityId!}
          objFieldProp={objFieldProp}
          field={field}
          fieldState={fieldState}
          label={label}
          handleSearchFilter={field.onChange}
          searchFilterValue={field.value}
          dropDownAttribute={dropDownAttribute}
          formControlAttribute={formControlAttribute}
        />
      )
      case 'DatePicker':
        return (
          <DatePicker
          {...field}
          slotProps={{
            textField: {
              fullWidth: true,
              label: label,
              placeholder: label,
              autoFocus: objFieldProp.autoFocus,
              error: Boolean(fieldState.error),
              value: field.value ? field.value : '',
            }
          }}
          />
        )
    case 'multiline':
      return (
        <FormControl {...(formControlAttribute ? formControlAttribute : {fullWidth: true})}>
          <TextField
          {...field}
          {...textFieldAttribute}
          id={field.name}
          multiline={true}
          rows={3}
          autoFocus={objFieldProp.autoFocus}
          label={label}
          placeholder={label}
          error={Boolean(fieldState.error)}
          value={field.value ? field.value : ''}
          />
        </FormControl>
      )
      case 'notFullText':
        return (
          <FormControl {...(formControlAttribute ? formControlAttribute : {fullWidth: false})}>
          <TextField
          {...field}
          {...textFieldAttribute}
          id={field.name}
          autoFocus={objFieldProp.autoFocus}
          label={label}
          placeholder={label}
          error={Boolean(fieldState.error)}
          value={field.value ? field.value : ''}
          />
        </FormControl>
        )
    default:
      return (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <TextField
            {...field}
            {...textFieldAttribute}
            id={field.name}
            autoFocus={objFieldProp.autoFocus}
            label={label}
            placeholder={label}
            error={Boolean(fieldState.error)}
            value={field.value ? field.value : ''}
          />
        </FormControl>
      )
  }
}

export function ListItemComponent (
  props: Pick<ListContextType, 'objFieldProp' >
) {
  const { objFieldProp } = props
  const label = objFieldProp.required ? objFieldProp.label + '*' : objFieldProp.label

  const objControl = (
    <ListItemText
    primary={label}
    secondary={objFieldProp.secondary as string}
    sx={{
      fontSize: 12,
    }}
    />
  )

  return (
    <>
    {objControl}
    </>

  )
}


export function FormObjectComponent<TUnion>(
  props: Pick<FormContextType<TUnion>, 'objFieldProp' | 'control' | 'errors' | 'extendedProps' >
) {
  const { objFieldProp, control, errors, extendedProps } = props

  const objControl = (
    <Controller
      name={objFieldProp.dbField as string}
      control={control}
      render={({ field, fieldState }) =>
        FormContextType<TUnion>({ objFieldProp, control, errors, field, fieldState, extendedProps: props })
      }
    />

  )

  return (
    <>
      {objControl}
      {getFormErrorMessage({ errors, dbField: objFieldProp.dbField })}
    </>
  )
}

export function getFormErrorMessage({ ...props }) {
  const { errors, dbField } = props

  return errors[dbField] && <FormHelperText sx={{ color: 'error.main' }}>{errors[dbField]?.message}</FormHelperText>
}

type DropdownProps = {
  id: number
  type: 'filter' | 'control'
  searchFilterValue: any
  handleSearchFilter: (...event: any[]) => void
  label?: string
  objFieldProp?: any
  field?: ControllerRenderProps
  fieldState?: ControllerFieldState
  dropDownAttribute?: SelectProps
  formControlAttribute?: DefaultComponentProps<OverridableTypeMap>
}

export function DropdownData(props: DropdownProps) {
  const {
    id,
    type,
    handleSearchFilter,
    searchFilterValue,
    fieldState,
    label,
    dropDownAttribute,
    formControlAttribute
  } = props

  const { entities, reference } = fetchDependencyData({ entities: [id] })

  if (!entities.data || !reference.data) return null

  const dataLoaded = !entities.isLoading && !!entities.data && !reference.isLoading && !!reference.data
  const entity = entities.data.find(e => e.id === id)

  if (!entity) return null

  const currentLabel = label ? label : entity.name
  let currentValue = 0

  if (type === 'filter') {
    const { dropDownValue } = getFilterObjValue(searchFilterValue)
    currentValue = dropDownValue && dropDownValue[entity.fieldProp] ? dropDownValue[entity.fieldProp] : 0
  }

  if (type === 'control') {
    currentValue = searchFilterValue ? searchFilterValue : 0
  }

  return (
    <>
      {dataLoaded && entity ? (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <InputLabel id={`${entity.fieldProp}-select`}>{currentLabel}</InputLabel>
          <Select
            {...(dropDownAttribute ? dropDownAttribute : { fullWidth: true })}
            id={`select-${entity.fieldProp}`}
            name={entity.fieldProp}
            label={currentLabel}
            labelId={`${entity.fieldProp}-select`}
            error={fieldState && Boolean(fieldState.error)}
            onChange={handleSearchFilter}
            value={currentValue}
          >
            <MenuItem value={0}>Select {currentLabel}</MenuItem>
            {reference.data
              ?.filter(ref => ref.entityId === id)
              .map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      ) : null}
    </>
  )
}

type TextInputSearchProps = {
  searchFilterValue: any
  handleSearchFilter: (...event: any[]) => void
  textFieldAttribute?: TextFieldProps
}

export function TextInputSearch(props: TextInputSearchProps) {
  const { handleSearchFilter, searchFilterValue, textFieldAttribute } = props
  const { inputValue } = getFilterObjValue(searchFilterValue)

  return (
    <TextField
      {...(textFieldAttribute ? textFieldAttribute : { fullWidth: true })}
      placeholder='Search'
      name='inputValue'
      onChange={handleSearchFilter}
      value={inputValue ? inputValue : ''}
    />
  )
}
