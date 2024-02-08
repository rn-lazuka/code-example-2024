import type { Staff } from '@types';

export interface StaffUserSlice {
  loading: boolean;
  errors: Error[];
  saveSuccess: boolean;
  staffUser: Staff | null;
}
