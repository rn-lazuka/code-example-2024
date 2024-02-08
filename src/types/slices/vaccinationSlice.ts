import { VaccinationForm, VaccinationResponse } from '@types';

export type VaccinationSliceState = {
  loading: boolean;
  submitting: boolean;
  saveSuccess: boolean;
  isFileLoading: boolean;
  errors: Error[];
  vaccinationForm: VaccinationForm | null;
  vaccinations: VaccinationResponse[];
};
