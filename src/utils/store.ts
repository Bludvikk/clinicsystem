import { create } from "zustand";
import { IDiagnosis, ITreatment } from "@/server/schema/patient";

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
          dialogTitle: "Edit Diagnosis",
        },
      },
    }));
  },
  onClose: (key) => {
    set({
      dialog: {
        edit: {
          showDialog: key === "EDIT" ? false : true,
          dialogTitle: "Edit Diagnosis",
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
