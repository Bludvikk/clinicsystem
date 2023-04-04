import { z } from 'zod'
import { RouterKeyType } from '@/server/routers'
import { commonDataDtoSchema, filterQuery, params } from '@/server/schema/common'
import { Breakpoint } from '@mui/material'

export type ParamsInput = z.TypeOf<typeof params>
export type CommonDataInputType = z.TypeOf<typeof commonDataDtoSchema>
export type FilterQueryInputType = z.TypeOf<typeof filterQuery> & DynamicType

export type DynamicType = {
  [key: string]: any | undefined
}

export type FormDisplayType = 'normal' | 'dialog'
export type FormUIType = `${RouterKeyType}-form-${FormDisplayType}`

export type FormPropsType = {
  formId: FormUIType
  maxWidth?: Breakpoint
}

export type TableHeaderPropsType = {
  searchFilter: DynamicType
  handleSearchFilter: (...event: any[]) => void
}

export type FormInputType = 'textField' | 'number' | 'dropDown' | 'textarea' | 'multiselect' | 'multiline' | 'checkbox' | 'DatePicker' | 'notFullText'

export type FormControlPropsType<TUnionField> = {
  label: string
  dbField: TUnionField
  type: FormInputType
  width?: number
  rows?: number
  required?: boolean
  autoFocus?: boolean
  entityId?: number
  extendedProps?: any
}

export type ListItemTextType = 'ListItemText'

export type ListItemTextPropsType = {
  label: string
  secondary: any
  type: ListItemTextType
  required?: boolean
  extendedProps?: any
}
