import type { RouterKeyType } from "@/server/routers";
import { ReferenceEntityType } from "./db.type";
import { QueryKey } from "@tanstack/react-query";
import { queryClient, trpc } from "./trpc";
import { DynamicType, FilterQueryInputType } from "./common.type";
import _ from 'lodash'
import { getFilterObjValue } from "./helper";

type RQCachedType = FilterQueryInputType & { queryKey: QueryKey }
type RQKeyType = {
  routerKey: RouterKeyType
  queryKey: { entityId?: number } | { entities?: number[] }
  filterQuery?: FilterQueryInputType
}

interface FilterInf<TData> {
  data: TData[]
  query?: FilterQueryInputType
  filter(): void
  textSearch(): void
  dropDown(): void
}

export class FilterData<TData extends DynamicType> implements FilterInf<TData> {
  data: TData[]
  query: FilterQueryInputType | undefined
  private searchFilter!: DynamicType
  private dropDownValue!: DynamicType
  private inputValue!: string

  constructor(data: TData[], query?: FilterQueryInputType) {
    this.data = data
    this.query = query

    this.init()
  }

  private init() {
    this.searchFilter = getFilterObjValue(this.query).searchFilter
    this.dropDownValue = getFilterObjValue(this.searchFilter).dropDownValue
    this.inputValue = getFilterObjValue(this.searchFilter).inputValue
  }

  filter() {
    if (_.isEmpty(this.searchFilter)) return this.data

    this.dropDown()
    this.textSearch()

    return this.data
  }

  textSearch() {
    if (!this.inputValue) return this.data

    return (this.data = _.filter(this.data, row =>
      Object.keys(row).some(key => {
        const nestedObj = _.get(row, `${key}.name`)
        const value = nestedObj ? nestedObj : _.get(row, key)

        if (value && typeof value === 'string') {
          return value.toLowerCase().includes(this.inputValue.toLowerCase())
        }
      })
    ))
  }

  dropDown() {
    if (!this.dropDownValue) return this.data

    for (const key in this.dropDownValue) {
      const value = _.get(this.dropDownValue, key)

      if (value < 1 || value?.length < 1) {
        delete this.dropDownValue[key]
      }
    }

    return (this.data = _.filter(this.data, this.dropDownValue) as TData[])
  }
}
