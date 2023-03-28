import { SelectChangeEvent } from "@mui/material"
import { TRPCClientError } from "@trpc/client"
import _ from 'lodash'


import { useState, useCallback } from "react"
import { DynamicType, FilterQueryInputType, FormInputType } from "./common.type"

type ErrorType = {
  status: 'CONFLICT' | 'ERROR'
  message: string
}

export function errorUtil(error: unknown): ErrorType {
  if (error instanceof TRPCClientError) {
    if (error.data?.httpStatus === 409) {
      return { status: 'CONFLICT', message: error.message }
    }
  }

  return { status: 'ERROR', message: `Unexpected error: ${error}!` }
}


export function getRandomNumber(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function useFilterControlChange() {
  const [searchFilter, setSearchFilter] = useState<DynamicType>({})

  const handleSearchFilter = useCallback((e: SelectChangeEvent) => {
    const { name, value } = e.target

    let key: FormInputType = 'textField' //e.type === change
    switch (e.type) {
      case 'click':
        key = 'dropDown'
        break

      default:
        key = 'textField'
        break
    }

    setSearchFilter(prev => {
      prev[key] = { ...prev[key], [name]: value }

      return { ...prev }
    })
  }, [])

  return { searchFilter, setSearchFilter, handleSearchFilter }
}


export function getFilterObjValue(objVal?: FilterQueryInputType) {
  const searchFilter = _.get(objVal, 'searchFilter')
  const dropDownValue = _.get(objVal, 'dropDown')
  const inputValue = _.get(objVal, 'textField.inputValue')

  return { searchFilter, dropDownValue, inputValue }
}

export function isObjEmpty(obj: any) {
  return _.isEmpty(obj)
}


