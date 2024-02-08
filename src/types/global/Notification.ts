export interface Notification {
  id: number;
  userId: number;
  branchId: number;
  tenantId: number;
  patientId: number;
  type: string;
  channel: string;
  navigationScreen: string;
  navigationObjectId: number;
  createdAt: string;
  endTo: string;
  isTask: boolean;
  isCompleted: boolean;
  isRead: boolean;
  messageKey: string;
  messageArguments: any[];
}
