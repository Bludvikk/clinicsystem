import { getDependencyData } from "@/server/hooks/reference";
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
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
} from "react-hook-form";
import { ExtendedPropsType, FormControlPropsType } from "./common.type";
import { getFilterObjValue } from "./helper";
import { ChangeEvent } from "react";

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
  props: Pick<
    FormContextType<TUnion>,
    "objFieldProp" | "control" | "errors" | "getValues" | "setValue"
  >
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
          setValue,
        })
      }
    />
  );

  return (
    <>
      {objControl}
      {!objFieldProp.disabledErrors &&
        getFormErrorMessage({ errors, dbField: objFieldProp.dbField })}
    </>
  );
}

export function FormContextType<TUnion>(props: FormContextType<TUnion>) {
  const { objFieldProp, field, fieldState, getValues, setValue } = props;
  const {
    formControlAttribute,
    formControlLabelAttribute,
    textFieldAttribute,
    dropDownAttribute,
    datePickerAttribute,
    gridAttribute,
    checkboxAttribute,
  } = objFieldProp.extendedProps as ExtendedPropsType;

  const label = objFieldProp.required
    ? objFieldProp.label + "*"
    : objFieldProp.label;

  switch (objFieldProp.type) {
    case "dropDown":
      return (
        <DropdownData
          type="control"
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

    case "datePicker":
      return (
        <FormControl
          {...(formControlAttribute
            ? formControlAttribute
            : { fullWidth: true })}
        >
          <DatePicker
            {...field}
            {...datePickerAttribute}
            slotProps={{
              textField: {
                label,
                placeholder: label,
                autoFocus: objFieldProp.autoFocus,
                error: Boolean(fieldState.error),
                value: field.value ? field.value : null,
              },
            }}
          />
        </FormControl>
      );

    case "checkbox":
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
              sx={fieldState.error ? { color: "error.main" } : null}
            />
          }
          sx={{
            "& .MuiFormControlLabel-label": { color: "text.primary" },
          }}
        />
      );

    case "multi-checkbox":
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
        <FormControl
          {...(formControlAttribute
            ? formControlAttribute
            : { fullWidth: true })}
        >
          <TextField
            {...field}
            {...textFieldAttribute}
            id={field.name}
            autoFocus={objFieldProp.autoFocus}
            label={label}
            placeholder={label}
            error={!objFieldProp.disabledErrors && Boolean(fieldState.error)}
            value={field.value ? field.value : ""}
          />
        </FormControl>
      );
  }
}

export function getFormErrorMessage({ ...props }) {
  const { errors, dbField } = props;

  return (
    errors[dbField] && (
      <FormHelperText sx={{ color: "error.main" }}>
        {errors[dbField]?.message}
      </FormHelperText>
    )
  );
}

type DropdownProps<TUnion> = {
  id: number;
  type: "filter" | "control";
  searchFilterValue: any;
  handleSearchFilter: (...event: any[]) => void;
  label?: string;
  objFieldProp?: FormControlPropsType<TUnion>;
  field?: ControllerRenderProps;
  fieldState?: ControllerFieldState;
  dropDownAttribute?: SelectProps;
  formControlAttribute?: FormControlProps;
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
  } = props;

  const { entities, references } = getDependencyData({ entities: [id] });

  if (!entities.data && !references.data) return null;

  const dataLoaded =
    !entities.isLoading &&
    !!entities.data &&
    !references.isLoading &&
    !!references.data;
  const entity = entities.data?.find((e) => e.id === id);

  if (!entity) return null;

  const currentLabel = label ? label : entity.name;
  let currentValue = 0;

  if (type === "filter") {
    const { dropDownValue } = getFilterObjValue(searchFilterValue);
    currentValue =
      dropDownValue && dropDownValue[entity.fieldProp]
        ? dropDownValue[entity.fieldProp]
        : 0;
  }

  if (type === "control") {
    currentValue = searchFilterValue ? searchFilterValue : 0;
  }

  return (
    <>
      {dataLoaded && entity ? (
        <FormControl
          {...(formControlAttribute
            ? formControlAttribute
            : { fullWidth: true })}
        >
          <InputLabel id={`${entity.fieldProp}-select`}>
            {currentLabel}
          </InputLabel>
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
            {references.data
              .filter((item) => item.isShow)
              .map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      ) : null}
    </>
  );
}

type MultiCheckboxProps<TUnion> = {
  id: number;
  type?: "multi";
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
    formControlLabelAttribute,
  } = props;

  const { entities, references } = getDependencyData({ entities: [id] });

  if (!entities.data && !references.data) return null;

  const dataLoaded =
    !entities.isLoading &&
    !!entities.data &&
    !references.isLoading &&
    !!references.data;
  const entity = entities.data?.find((e) => e.id === id);

  if (!entity) return null;

  const currentLabel = label ? label : entity.name;
  let currentValue = 0;

  // works only for array of values
  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    path: string
  ) => {
    const currentArrayValues = getValues(path);

    if (e.target.checked)
      setValue(path, [...currentArrayValues, parseInt(e.target.value)]);
    else {
      const filterValues = currentArrayValues.filter(
        (value: any) => value !== parseInt(e.target.value)
      );
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
                {...(formControlLabelAttribute
                  ? formControlLabelAttribute
                  : { sx: { width: "100%" } })}
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
                    sx={fieldState?.error ? { color: "error.main" } : null}
                    onChange={(e) =>
                      handleCheckboxChange(e, objFieldProp?.dbField as string)
                    }
                  />
                }
                sx={{
                  "& .MuiFormControlLabel-label": { color: "text.primary" },
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
