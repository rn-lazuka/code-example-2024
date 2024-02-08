import type { AccessManagement } from '@types';

export type AccessManagementSliceState = {
  accessManagementLoaded: boolean;
  submitting: boolean;
  loading: boolean;
  saveSuccess: boolean;
  isFileLoading: boolean;
  error: any;
  accessManagementForm: AccessManagement | null;
  accessManagement: AccessManagement[];
};
