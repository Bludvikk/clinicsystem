import { create } from 'zustand';
import { DiagnosisDtoSchemaType, TreatmentDtoSchemaType } from '@/server/schema/checkup';
import { DynamicType } from '@/utils/common.type';

type FormAction = 'Add' | 'Edit';

type FormStore = {
  id: number;
  dialogTitle: FormAction;
  showDialog: boolean;
  isSaving: boolean;
  onAdd: (patientId: number) => void;
  onEdit: (id: number) => void;
  onSaving: (stat: boolean) => void;
  onClosing: () => void;
  searchFilter: DynamicType | undefined;
  setSearchFilter: (value: DynamicType) => void;
};

type CheckupFormStoreType = FormStore & {
  patientId: number;
  tabsValue: string;
  setTabsValue: (value: string) => void;
};

export const useCheckupFormStore = create<CheckupFormStoreType>(set => ({
  id: 0,
  patientId: 0,
  dialogTitle: 'Add',
  showDialog: false,
  isSaving: false,
  onAdd: patientId => {
    set({ patientId, showDialog: true, dialogTitle: 'Add' });
  },
  onEdit: id => set({ id, showDialog: true, dialogTitle: 'Edit' }),
  onSaving: stat => set({ isSaving: stat }),
  onClosing: () => set({ id: 0, showDialog: false, isSaving: false }),
  searchFilter: undefined,
  setSearchFilter: value => set(() => ({ searchFilter: value })),
  tabsValue: '1',
  setTabsValue: value => set({ tabsValue: value })
}));

type Assessment<TData> = {
  id: number;
  dialogTitle: FormAction;
  showDialog: boolean;
  data: TData[];
  onEdit: (id: number) => void;
  onClosing: () => void;
  add: (data: TData) => void;
  edit: (id: number, data: TData) => void;
  remove: (id: number) => void;
  clear: () => void;
  replaceAll: (data: TData[]) => void;
};

export const useDiagnosisFormStore = create<Assessment<DiagnosisDtoSchemaType>>((set, get) => ({
  id: -1,
  dialogTitle: 'Edit',
  showDialog: false,
  data: [],
  onEdit: id => set({ id, showDialog: true, dialogTitle: 'Edit' }),
  onClosing: () => set({ id: -1, showDialog: false }),
  add: data => set(state => ({ data: [...state.data, { ...data }] })),
  edit: (id, data) => {
    const newData: DiagnosisDtoSchemaType[] = get().data;
    newData.splice(id, 1, data);

    set(() => ({ data: newData }));
  },
  remove: id => set(state => ({ data: state.data.filter((row, i) => i !== id) })),
  clear: () => set({ data: [] }),
  replaceAll: data => set({ data })
}));

export const useTreatmentFormStore = create<Assessment<TreatmentDtoSchemaType>>((set, get) => ({
  id: -1,
  dialogTitle: 'Edit',
  showDialog: false,
  data: [],
  onEdit: id => set({ id, showDialog: true, dialogTitle: 'Edit' }),
  onClosing: () => set({ id: -1, showDialog: false }),
  add: data => set(state => ({ data: [...state.data, { ...data }] })),
  edit: (id, data) => {
    const newData: TreatmentDtoSchemaType[] = get().data;
    newData.splice(id, 1, data);

    set(() => ({ data: newData }));
  },
  remove: id => set(state => ({ data: state.data.filter((row, i) => i !== id) })),
  clear: () => set({ data: [] }),
  replaceAll: data => set({ data })
}));
