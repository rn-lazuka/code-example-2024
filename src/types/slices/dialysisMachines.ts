import type { Pagination, BackendError, DialysisMachine, IsolationGroup, DialysisMachineFull } from '@types';

export interface DialysisMachinesState {
  statuses: {
    isLoading: boolean;
    isSubmitting: boolean;
  };
  error: BackendError[] | Error | null;
  machines: DialysisMachine[];
  machine: DialysisMachineFull | null;
  isolationGroups: IsolationGroup[];
  pagination: Pagination;
  sortBy: 'id' | 'serialNumber' | 'brand' | 'name' | 'model' | 'status';
  sortDir: 'asc' | 'desc';
}
