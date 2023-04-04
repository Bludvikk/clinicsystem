import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Medication {
  brandName: string;
  generic: string;
  dosage: string;
}

interface Store {
  medications: Medication[];
  addMedication: (medication: Medication) => void;
  removeMedication: (index: number) => void;
}

const useStore = create<Store>(set => ({
  medications: [
    { brandName: 'Advil', generic: 'Ibuprofen', dosage: '200mg' },
    { brandName: 'Tylenol', generic: 'Acetaminophen', dosage: '500mg' },
    { brandName: 'Zyrtec', generic: 'Cetirizine', dosage: '10mg' },
    { brandName: 'Prilosec', generic: 'Omeprazole', dosage: '20mg' },
    { brandName: 'Allegra', generic: 'Fexofenadine', dosage: '180mg' }
  ],
  addMedication: medication =>
    set(state => ({
      medications: [...state.medications, medication]
    })),
  removeMedication: index =>
    set(state => ({
      medications: [
        ...state.medications.slice(0, index),
        ...state.medications.slice(index + 1)
      ]
    }))
}));

export const useMedicationStore = useStore;
