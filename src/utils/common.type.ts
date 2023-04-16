import { z } from "zod";
import { RouterKeyType } from "@/server/routers";
import {
  commonDataDtoSchema,
  filterQuery,
  params,
} from "@/server/schema/common";
import {
  Breakpoint,
  FormControlProps,
  SelectProps,
  TextFieldProps,
  ListItemTextProps,
  GridProps,
  CheckboxProps,
  FormControlLabelProps,
} from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers";

export type ParamsInput = z.TypeOf<typeof params>;
export type CommonDataInputType = z.TypeOf<typeof commonDataDtoSchema>;
export type FilterQueryInputType = z.TypeOf<typeof filterQuery> & DynamicType;

export type DynamicType = {
  [key: string]: any | undefined;
};

export type FormDisplayType = "normal" | "dialog";
export type FormUIType = `${RouterKeyType}-form-${FormDisplayType}`;

export type FormPropsType = {
  formId: FormUIType;
  maxWidth?: Breakpoint;
};

export type TableHeaderPropsType = {
  searchFilter: DynamicType;
  handleSearchFilter: (...event: any[]) => void;
};

export type FormInputType =
  | "textField"
  | "dropDown"
  | "datePicker"
  | "checkbox"
  | "multi-checkbox";

export type ExtendedPropsType = {
  formControlAttribute?: FormControlProps;
  formControlLabelAttribute?: FormControlLabelProps;
  textFieldAttribute?: TextFieldProps;
  dropDownAttribute?: SelectProps;
  datePickerAttribute?: DatePickerProps<Date>;
  gridAttribute?: GridProps;
  checkboxAttribute?: CheckboxProps;
  listItemTextAttribute?: ListItemTextProps;
};

export type FormControlPropsType<TUnionField> = {
  label: string;
  dbField: TUnionField;
  type: FormInputType;
  width?: number;
  rows?: number;
  required?: boolean;
  autoFocus?: boolean;
  entityId?: number;
  disabledErrors?: boolean;
  extendedProps?: ExtendedPropsType;
};
