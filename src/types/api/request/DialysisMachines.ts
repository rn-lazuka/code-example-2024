import { DialysisMachineCommunicationType, DialysisMachineStatus } from '@enums';

export type DialysisMachinesCreationRequest = {
  name: string;
  serialNumber: string;
  model: string;
  brand: string;
  communicationType: DialysisMachineCommunicationType;
  slotCount: number;
  description: string;
  status: DialysisMachineStatus;
  commissionedDate: string;
  isolationGroupId: number;
  locationId: number | null;
  maintenanceFrom: string;
  maintenanceTo: string;
  warrantyFrom: string;
  warrantyTo: string;
  comment?: string;
};

export type DialysisMachinesEditingRequest = {
  name: string;
  serialNumber: string;
  model: string;
  brand: string;
  communicationType: DialysisMachineCommunicationType;
  slotCount: number;
  description: string;
  status: DialysisMachineStatus;
  commissionedDate: string;
  isolationGroupId: number;
  locationId: number | null;
  maintenanceFrom: string;
  maintenanceTo: string;
  warrantyFrom: string;
  warrantyTo: string;
  comment?: string;
};
