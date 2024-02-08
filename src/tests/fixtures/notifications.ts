import { Notification } from '@types';

export const notificationFixture = (data?): Notification => ({
  id: 1,
  patientId: 1,
  endTo: '2022-10-10',
  createdAt: '2022-10-10',
  navigationScreen: 'HD_PRESCRIPTIONS',
  branchId: 10000,
  channel: 'NURSE',
  isRead: false,
  isCompleted: false,
  isTask: false,
  messageArguments: ['Patient Name'],
  messageKey: 'notification.PATIENT_DIALYSIS_PRESCRIPTION_CHANGES',
  type: 'PATIENT',
  navigationObjectId: 1,
  tenantId: 1000,
  userId: 1,
  ...data,
});
