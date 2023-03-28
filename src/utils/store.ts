import { create } from 'zustand'
import { DynamicType } from './common.type'

type FormAction = 'Add' | 'Edit'

type FormStore = {
  id: number
  dialogTitle: FormAction
  showDialog: boolean
  isSaving: boolean
  onAdd: () => void
  onEdit: (id: number) => void
  onSaving: (stat: boolean) => void
  onClosing: () => void
  searchFilter: DynamicType | undefined
  setSearchFilter: (value: DynamicType) => void
}

type ReferenceStoreType = FormStore & {
  entityId: number
  setEntityId: (id: number) => void
}

export const useReferenceFormStore = create<ReferenceStoreType>(set => ({
  entityId: 0,
  setEntityId: entityId => set({ entityId }),
  id: 0,
  dialogTitle: 'Add',
  showDialog: false,
  isSaving: false,
  onAdd: () => set({ id: 0, showDialog: true, dialogTitle: 'Add' }),
  onEdit: id => set({ id: id, showDialog: true, dialogTitle: 'Edit' }),
  onSaving: stat => set({ isSaving: stat }),
  onClosing: () => set({ id: 0, showDialog: false, isSaving: false }),
  searchFilter: undefined,
  setSearchFilter: value => set(() => ({ searchFilter: value }))
}))

export const usePatientFormStore = create<FormStore>(set => ({
  id: 0,
  dialogTitle: 'Add',
  showDialog: false,
  isSaving: false,
  onAdd: () => set({ id: 0, showDialog: true, dialogTitle: 'Add' }),
  onEdit: id => set({ id: id, showDialog: true, dialogTitle: 'Edit' }),
  onSaving: stat => set({ isSaving: stat }),
  onClosing: () => set({ id: 0, showDialog: false, isSaving: false }),
  searchFilter: undefined,
  setSearchFilter: value => set(() => ({ searchFilter: value }))
}))
