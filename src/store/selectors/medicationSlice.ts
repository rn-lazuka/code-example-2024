import type { RootState, MedicationResponse } from '@types';
import { MedicationStatus } from '@enums';
import { createSelector } from '@reduxjs/toolkit';

export const selectorMedicationsWithMedicationName = createSelector(
  (state: RootState) => state.medications.medications,
  (medications: MedicationResponse[]) =>
    medications.map((medication) => ({
      ...medication,
      medicationName: medication.medication?.name || medication.medicationName!,
    })),
);

export const selectorSelectedMedicationStatus = createSelector(
  ({ medications: medicationsState }: RootState) => {
    return { medications: medicationsState.medications, medicationForm: medicationsState.medicationForm };
  },
  ({ medications, medicationForm }): MedicationStatus | null => {
    const status = medications.find((medication) => medicationForm?.id === medication?.id)?.status;
    return status || null;
  },
);
