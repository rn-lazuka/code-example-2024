import { DialysisMachineCommunicationType, DialysisMachineStatus } from '@enums';

export interface DialysisMachineForm {
  name: string;
  serialNumber: string;
  model: string;
  brand: string;
  communicationType: DialysisMachineCommunicationType;
  slotCount: number;
  description: string;
  status: DialysisMachineStatus;
  commissionedDate: Date;
  isolationGroupId: number;
  locationId: number;
  maintenanceFrom: Date;
  maintenanceTo: Date;
  warrantyFrom: Date;
  warrantyTo: Date;
  comment?: string;
}
