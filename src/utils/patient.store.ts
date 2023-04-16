import { create } from "zustand";
import { IDiagnosis, ITreatment, IMedication } from "@/server/schema/patient";
import { DynamicType } from "./common.type";

type FormAction = "Add" | "Edit";

type MedicationStoreType = {
  id: number;
  medications: IMedication[];
  onAdd: (data: IMedication) => void;
  onReplaceAll: (data: IMedication[]) => void;
  onDelete: (index: number) => void;
  onClear: () => void;
};

export const useMedicationsStore = create<MedicationStoreType>((set) => ({
  id: -1,
  medications: [],
  onAdd: (data) => {
    set((state) => ({ medications: [...state.medications, { ...data }] }));
  },
  onReplaceAll: (data) => set((state) => ({ medications: data })),
  onDelete: (index) =>
    set((state) => ({
      medications: state.medications.filter((medication, i) => i !== index),
    })),
  onClear: () => set(() => ({ medications: [] })),
}));

type FormStore = {
  id: number;
  dialogTitle: FormAction;
  showDialog: boolean;
  isSaving: boolean;
  onAdd: (() => void) | ((id: number) => void);
  onEdit: (id: number) => void;
  onSaving: (stat: boolean) => void;
  onClosing: () => void;
  searchFilter: DynamicType | undefined;
  setSearchFilter: (value: DynamicType) => void;
};

type PatientFormStoreType = FormStore & {
  steps: string[];
  activeStep: number;
  setActiveStep: (value: number) => void;
};

export const usePatientFormStore = create<PatientFormStoreType>((set) => ({
  id: 0,
  dialogTitle: "Add",
  showDialog: false,
  isSaving: false,
  onAdd: () => set({ showDialog: true, dialogTitle: "Add" }),
  onEdit: (id) => set({ id, showDialog: true, dialogTitle: "Edit" }),
  onSaving: (stat) => set({ isSaving: stat }),
  onClosing: () => set({ id: 0, showDialog: false, isSaving: false }),
  steps: [
    "Personal Information",
    "Family History",
    "Personal History",
    "Past Medical History",
    "Obstetrics & Gynecology",
    "Review",
  ],
  searchFilter: undefined,
  setSearchFilter: (value) => set(() => ({ searchFilter: value })),
  activeStep: 0,
  setActiveStep: (value) => set({ activeStep: value }),
}));

// type PhysicalCheckupStoreType = FormStore & {
//   tabsValue: string;
//   setTabsValue: (value: string) => void;
// };

type PhysicalCheckupFormStoreType = {
  id: number;
  patientId: number;
  vitalSignId: number;
  physicianId: number;
  dialogTitle: FormAction;
  showDialog: boolean;
  isSaving: boolean;
  onAdd: (patientId: number, vitalSignsId: number, physicianId: number) => void;
  onAddVitalSigns: (patientId: number) => void;
  onEdit: (id: number) => void;
  onSaving: (stat: boolean) => void;
  onClosing: () => void;
  searchFilter: DynamicType | undefined;
  setSearchFilter: (value: DynamicType) => void;
  tabsValue: string;
  setTabsValue: (value: string) => void;
};

export const usePhysicalCheckupFormStore = create<PhysicalCheckupFormStoreType>(
  (set) => ({
    id: 0,
    patientId: 0,
    vitalSignId: 0,
    physicianId: 0,
    dialogTitle: "Add",
    showDialog: false,
    isSaving: false,
    onAdd: (patientId, vitalSignId, physicianId) =>
      set({
        patientId,
        vitalSignId,
        physicianId,
        showDialog: true,
        dialogTitle: "Add",
      }),
    onAddVitalSigns: (patientId) =>
      set({ patientId, showDialog: true, dialogTitle: "Add" }),
    onEdit: (id) => set({ id, showDialog: true, dialogTitle: "Edit" }),
    onSaving: (stat) => set({ isSaving: stat }),
    onClosing: () =>
      set({
        id: 0,
        patientId: 0,
        vitalSignId: 0,
        physicianId: 0,
        showDialog: false,
        isSaving: false,
      }),
    searchFilter: undefined,
    setSearchFilter: (value) => set(() => ({ searchFilter: value })),
    tabsValue: "1",
    setTabsValue: (value) => set({ tabsValue: value }),
  })
);

type DiagnosisStoreType = {
  id: number;
  diagnoses: IDiagnosis[];
  dialog: { edit: { showDialog: boolean; dialogTitle: string } };
  addDiagnosis: (data: IDiagnosis) => void;
  editDiagnosis: (index: number, data: IDiagnosis) => void;
  removeDiagnosis: (index: number) => void;
  clearDiagnoses: () => void;
  onShow: (key: "EDIT", index: number) => void;
  onClose: (key: "EDIT") => void;
};

type TreatmentStoreType = {
  id: number;
  treatments: ITreatment[];
  dialog: { edit: { showDialog: boolean; dialogTitle: string } };
  addTreatment: (data: ITreatment) => void;
  editTreatment: (index: number, data: ITreatment) => void;
  removeTreatment: (index: number) => void;
  clearTreatments: () => void;
  onShow: (key: "EDIT", index: number) => void;
  onClose: (key: "EDIT") => void;
};

export const useDiagnosisStore = create<DiagnosisStoreType>((set, get) => ({
  id: -1,
  diagnoses: [],
  dialog: {
    edit: { showDialog: false, dialogTitle: "" },
  },
  addDiagnosis: (data) => {
    set((state) => ({
      diagnoses: [...state.diagnoses, { ...data }],
    }));
  },
  editDiagnosis: (index, data) => {
    const newDiagnoses: IDiagnosis[] = get().diagnoses;
    newDiagnoses.splice(index, 1, data);

    set(() => ({ diagnoses: newDiagnoses }));
  },
  removeDiagnosis: (index) => {
    set((state) => ({
      diagnoses: state.diagnoses.filter((diagnosis, i) => i !== index),
    }));
  },
  clearDiagnoses: () => set(() => ({ diagnoses: [] })),
  onShow: (key, index) => {
    set(() => ({
      id: index,
      dialog: {
        edit: {
          showDialog: key === "EDIT" ? true : false,
          dialogTitle: "Edit",
        },
      },
    }));
  },
  onClose: (key) => {
    set({
      dialog: {
        edit: {
          showDialog: key === "EDIT" ? false : true,
          dialogTitle: "Edit",
        },
      },
    });
  },
}));

export const useTreatmentStore = create<TreatmentStoreType>((set, get) => ({
  id: -1,
  treatments: [],
  dialog: {
    edit: { showDialog: false, dialogTitle: "" },
  },
  addTreatment: (data) => {
    set((state) => ({
      treatments: [...state.treatments, { ...data }],
    }));
  },
  editTreatment: (index, data) => {
    const newTreatments: ITreatment[] = get().treatments;
    newTreatments.splice(index, 1, data);

    set(() => ({ treatments: newTreatments }));
  },
  removeTreatment: (index) => {
    set((state) => ({
      treatments: state.treatments.filter((treatment, i) => i !== index),
    }));
  },
  clearTreatments: () => set(() => ({ treatments: [] })),
  onShow: (key, index) => {
    set(() => ({
      id: index,
      dialog: {
        edit: {
          showDialog: key === "EDIT" ? true : false,
          dialogTitle: "Edit Treatment",
        },
      },
    }));
  },
  onClose: (key) => {
    set({
      dialog: {
        edit: {
          showDialog: key === "EDIT" ? false : true,
          dialogTitle: "Edit Treatment",
        },
      },
    });
  },
}));
