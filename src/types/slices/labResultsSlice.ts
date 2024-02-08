import type { ResultPackage, Specification, LabResultsFilters, LabResultsFiltersErrors } from '@types';

export interface LabResultsSliceState {
  statuses: {
    isLoading: boolean;
    isFileLoading: boolean;
  };
  specifications: Specification[];
  labResultsList: ResultPackage[];
  filters: LabResultsFilters;
  filtersError: LabResultsFiltersErrors;
}
