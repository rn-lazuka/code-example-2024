import { AccessManagementStatuses } from '@enums';
import { CvcAccessManagementResponse, VascularAccessManagementResponse } from '@types';

export interface AccessManagement extends VascularAccessManagementResponse, CvcAccessManagementResponse {
  entryDate?: string;
  enteredAt?: string;
  enteredBy?: {
    id: string;
    name: string;
  };
  editedBy?: {
    id: string;
    name: 'string';
  };
  editedAt?: string;
  id?: string;
  status?: AccessManagementStatuses;
}
