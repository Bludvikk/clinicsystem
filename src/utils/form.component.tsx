import { getDependencyData } from '@/server/hooks/reference';
import {
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControl,
  SelectProps,
  ListItemText,
  FormControlProps,
  FormControlLabel,
  Checkbox,
  CheckboxProps,
  FormControlLabelProps,
  GridProps,
  Grid,
  ListItemTextProps,
  TextFieldProps,
  BoxProps
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldErrors } from 'react-hook-form';
import { ExtendedPropsType, FormControlPropsType } from './common.type';
import { getFilterObjValue } from './helper';
import React, { ChangeEvent } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker';
import moment from 'moment';

type FormContextType<TUnion> = {
  objFieldProp: FormControlPropsType<TUnion>;
  field: ControllerRenderProps;
  fieldState: ControllerFieldState;
  getValues?: any;
  setValue?: any;
  control: any;
  errors: FieldErrors;
};

export function FormObjectComponent<TUnion>(
  props: Pick<FormContextType<TUnion>, 'objFieldProp' | 'control' | 'errors' | 'getValues' | 'setValue'>
) {
  const { objFieldProp, control, errors, getValues, setValue } = props;

  const objControl = (
    <Controller
      name={objFieldProp.dbField as string}
      control={control}
      render={({ field, fieldState }) =>
        FormContextType<TUnion>({
          objFieldProp,
          control,
          errors,
          field,
          fieldState,
          getValues,
          setValue
        })
      }
    />
  );

  return (
    <>
      {objControl}
      {!objFieldProp.disabledErrors && getFormErrorMessage({ errors, dbField: objFieldProp.dbField })}
    </>
  );
}

export function FormContextType<TUnion>(props: FormContextType<TUnion>) {
  const { objFieldProp, field, fieldState, getValues, setValue } = props;
  const {
    boxAttribute,
    formControlAttribute,
    formControlLabelAttribute,
    textFieldAttribute,
    dropDownAttribute,
    reactDatePickerAttribute,
    gridAttribute,
    checkboxAttribute
  } = objFieldProp.extendedProps as ExtendedPropsType;

  const label = objFieldProp.required ? objFieldProp.label + '*' : objFieldProp.label;

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
      );

    case 'datePicker':
      return (
        <DatePickerWrapper {...(boxAttribute ? boxAttribute : { width: '100%' })}>
          <DatePicker
            {...reactDatePickerAttribute}
            id={field.name}
            popperPlacement='bottom-start'
            selected={moment(field.value).isValid() ? field.value : null}
            onChange={field.onChange}
            placeholderText='MM/DD/YYYY'
            isClearable
            customInput={
              <TextField
                {...textFieldAttribute}
                label={label}
                fullWidth
                autoFocus={objFieldProp.autoFocus}
                error={Boolean(fieldState.error)}
              />
            }
          />
        </DatePickerWrapper>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          {...formControlLabelAttribute}
          label={label}
          control={
            <Checkbox
              {...field}
              {...checkboxAttribute}
              id={field.name}
              autoFocus={objFieldProp.autoFocus}
              checked={Boolean(getValues(objFieldProp.dbField))}
              sx={fieldState.error ? { color: 'error.main' } : null}
            />
          }
          sx={{
            '& .MuiFormControlLabel-label': { color: 'text.primary' }
          }}
        />
      );

    case 'multi-checkbox':
      return (
        <CheckBoxData
          id={objFieldProp.entityId!}
          objFieldProp={objFieldProp}
          field={field}
          fieldState={fieldState}
          label={label}
          getValues={getValues}
          setValue={setValue}
          gridAttribute={gridAttribute}
          checkboxAttribute={checkboxAttribute}
          formControlLabelAttribute={formControlLabelAttribute}
        />
      );

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
            error={!objFieldProp.disabledErrors && Boolean(fieldState.error)}
            value={field.value ? field.value : ''}
          />
        </FormControl>
      );
  }
}

export function getFormErrorMessage({ ...props }) {
  const { errors, dbField } = props;

  const properties = dbField.split('.');

  let currentError = errors;
  for (let i = 0; i < properties.length; i++) {
    currentError = currentError[properties[i]];
    if (currentError === undefined) return null;
  }

  return currentError && <FormHelperText sx={{ color: 'error.main' }}>{currentError.message}</FormHelperText>;
}

type DropdownProps<TUnion> = {
  id: number;
  type: 'filter' | 'control';
  searchFilterValue: any;
  handleSearchFilter: (...event: any[]) => void;
  label?: string;
  objFieldProp?: FormControlPropsType<TUnion>;
  field?: ControllerRenderProps;
  fieldState?: ControllerFieldState;
  dropDownAttribute?: SelectProps;
  formControlAttribute?: FormControlProps;
  customMenuItem?: { [key: string]: React.ReactNode };
};

export function DropdownData<TUnion>(props: DropdownProps<TUnion>) {
  const {
    id,
    type,
    objFieldProp,
    handleSearchFilter,
    searchFilterValue,
    fieldState,
    label,
    dropDownAttribute,
    formControlAttribute,
    customMenuItem
  } = props;

  const { entities, references } = getDependencyData({ entities: [id] });

  if (!entities.data && !references.data) return null;

  const dataLoaded = !entities.isLoading && !!entities.data && !references.isLoading && !!references.data;
  const entity = entities.data?.find(e => e.id === id);

  if (!entity) return null;

  const currentLabel = label ? label : entity.name;
  let currentValue = 0;

  if (type === 'filter') {
    const { dropDownValue } = getFilterObjValue(searchFilterValue);
    currentValue = dropDownValue && dropDownValue[entity.fieldProp] ? dropDownValue[entity.fieldProp] : 0;
  }

  if (type === 'control') {
    currentValue = searchFilterValue ? searchFilterValue : 0;
  }

  return (
    <>
      {dataLoaded && entity && entity.code !== 'timeframe' && (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <InputLabel id={`${entity.fieldProp}-select`}>{currentLabel}</InputLabel>
          <Select
            {...(dropDownAttribute ? dropDownAttribute : { fullWidth: true })}
            id={`select-${entity.fieldProp}`}
            name={entity.fieldProp}
            label={currentLabel}
            labelId={`${entity.fieldProp}-select`}
            autoFocus={objFieldProp?.autoFocus}
            error={fieldState && Boolean(fieldState.error)}
            onChange={handleSearchFilter}
            value={currentValue}
          >
            <MenuItem value={0}>Select {currentLabel}</MenuItem>
            {references.data.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {dataLoaded && entity && entity.code === 'timeframe' && (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <InputLabel id={`${entity.fieldProp}-select`}>{currentLabel}</InputLabel>
          <Select
            {...(dropDownAttribute ? dropDownAttribute : { fullWidth: true })}
            id={`select-${entity.fieldProp}`}
            name={entity.fieldProp}
            label={currentLabel}
            labelId={`${entity.fieldProp}-select`}
            autoFocus={objFieldProp?.autoFocus}
            error={fieldState && Boolean(fieldState.error)}
            onChange={handleSearchFilter}
            value={currentValue}
          >
            <MenuItem value={0}>Select {currentLabel}</MenuItem>
            {references.data.map(item =>
              customMenuItem && customMenuItem[item.code] ? (
                <div key={item.id}>{customMenuItem[item.code]}</div>
              ) : (
                <MenuItem key={item.id} value={item.code}>
                  {item.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      )}
    </>
  );
}

type MultiCheckboxProps<TUnion> = {
  id: number;
  type?: 'multi';
  label?: string;
  objFieldProp?: FormControlPropsType<TUnion>;
  field?: ControllerRenderProps;
  fieldState?: ControllerFieldState;
  setValue: any;
  getValues: any;
  gridAttribute?: GridProps;
  checkboxAttribute?: CheckboxProps;
  formControlLabelAttribute?: FormControlLabelProps;
};

export function CheckBoxData<TUnion>(props: MultiCheckboxProps<TUnion>) {
  const {
    id,
    type,
    objFieldProp,
    fieldState,
    label,
    field,
    gridAttribute,
    checkboxAttribute,
    getValues,
    setValue,
    formControlLabelAttribute
  } = props;

  const { entities, references } = getDependencyData({ entities: [id] });

  if (!entities.data && !references.data) return null;

  const dataLoaded = !entities.isLoading && !!entities.data && !references.isLoading && !!references.data;
  const entity = entities.data?.find(e => e.id === id);

  if (!entity) return null;

  // works only for array of values
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, path: string) => {
    const currentArrayValues = getValues(path);

    if (e.target.checked) setValue(path, [...currentArrayValues, parseInt(e.target.value)]);
    else {
      const filterValues = currentArrayValues.filter((value: any) => value !== parseInt(e.target.value));
      setValue(path, [...filterValues]);
    }
  };

  //TODO: check type of checkbox
  return (
    <>
      {dataLoaded && entity ? (
        <>
          {references.data.map((item, i) => (
            <Grid key={i} item {...gridAttribute}>
              <FormControlLabel
                key={i}
                {...(formControlLabelAttribute ? formControlLabelAttribute : { sx: { width: '100%' } })}
                label={item.name}
                control={
                  <Checkbox
                    {...field}
                    {...checkboxAttribute}
                    id={field?.name}
                    value={item.id}
                    name={objFieldProp?.dbField as string}
                    autoFocus={objFieldProp?.autoFocus}
                    checked={getValues(objFieldProp?.dbField).includes(item.id)}
                    sx={fieldState?.error ? { color: 'error.main' } : null}
                    onChange={e => handleCheckboxChange(e, objFieldProp?.dbField as string)}
                  />
                }
                sx={{
                  '& .MuiFormControlLabel-label': { color: 'text.primary' }
                }}
              />
            </Grid>
          ))}
        </>
      ) : null}
    </>
  );
}

export type ListItemTextType = {
  listItemTextAttribute: ListItemTextProps;
  gridAttribute?: GridProps;
};

export function ListItemTextData(props: ListItemTextType) {
  const { listItemTextAttribute, gridAttribute } = props;

  return (
    <Grid item {...gridAttribute}>
      <ListItemText {...listItemTextAttribute} />
    </Grid>
  );
}

type TextInputSearchProps = {
  searchFilterValue: any;
  handleSearchFilter: (...event: any[]) => void;
  textFieldAttribute?: TextFieldProps;
};

export function TextInputSearch(props: TextInputSearchProps) {
  const { handleSearchFilter, searchFilterValue, textFieldAttribute } = props;
  const { inputValue } = getFilterObjValue(searchFilterValue);

  return (
    <TextField
      {...(textFieldAttribute ? textFieldAttribute : { fullWidth: true })}
      placeholder='Search'
      name='inputValue'
      onChange={handleSearchFilter}
      value={inputValue ? inputValue : ''}
    />
  );
}

type DateRangeInputSearchProps = {
  searchFilterValue: any;
  handleDateRangeFilter: (...event: any[]) => void;
  reactDatePickerAttribute?: Omit<ReactDatePickerProps, 'onChange'>;
  boxAttribute?: BoxProps;
  customInput: React.ReactNode;
};

export function DateRangeInputSearch(props: DateRangeInputSearchProps) {
  const { handleDateRangeFilter, searchFilterValue, reactDatePickerAttribute, boxAttribute, customInput } = props;
  const { dateRangeInputValue } = getFilterObjValue(searchFilterValue);
  const { start, end } = dateRangeInputValue ? dateRangeInputValue : { start: null, end: null };

  return (
    <DatePickerWrapper {...(boxAttribute ? boxAttribute : { width: '100%' })}>
      <DatePicker
        {...reactDatePickerAttribute}
        selectsRange
        monthsShown={2}
        name='dateRangeInputValue'
        placeholderText='Date Range Search'
        startDate={start}
        endDate={end}
        selected={start}
        shouldCloseOnSelect={false}
        onChange={handleDateRangeFilter}
        isClearable
        customInput={customInput}
      />
    </DatePickerWrapper>
  );
}
