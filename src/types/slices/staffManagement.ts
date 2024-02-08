import { BackendError, Pagination, StaffRole } from '@src/types';
import { StaffEntity } from '@types';

export interface StaffManagementState {
  statuses: {
    isLoading: boolean;
    isSubmitting: boolean;
  };
  staffList: StaffEntity[];
  filters: {
    roles: StaffRole[];
    user: { name: string; id: string } | null;
  };
  error: BackendError[] | Error | null;
  pagination: Pagination;
}
