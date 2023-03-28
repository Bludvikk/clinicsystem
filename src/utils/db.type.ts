import { PatientsAsyncType } from "@/server/services/patient";
import { ReferencesAsyncType } from "@/server/services/reference";
import { EntitiesAsyncType } from "@/server/services/entity";
import { ThemeColor } from "@/@core/layouts/types";

export type EntitiesType = TGenerics<EntitiesAsyncType>
export type ReferenceEntityType = TGenerics<ReferencesAsyncType>
export type PatientEntityType = TGenerics<PatientsAsyncType> & { avatars?: string | null; avatarColor?: ThemeColor }

export type TGenerics<T extends (..._args: any) => Promise<any>> = RecursivelyConvertDatesToStrings<
  ArrayElement<AsyncReturnType<T>>
>

export type AsyncReturnType<T extends (..._args: any) => Promise<any>> = Awaited<ReturnType<T>>

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export type RecursivelyConvertDatesToStrings<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? RecursivelyConvertDatesToStrings<U>[]
  : T extends object
  ? { [K in keyof T]: RecursivelyConvertDatesToStrings<T[K]> }
  : T

export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: never
}
