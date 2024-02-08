import { DialysisMachineCommunicationType, DialysisMachineStatus } from '@enums';

export type DialysisMachine = {
  id: number;
  name: string;
  status: DialysisMachineStatus;
  serialNumber: string;
  model: string;
  brand: string;
  location?: {
    id: number;
    name: string;
  };
  warrantyFinished: boolean;
  isolationGroup?: {
    id: number;
    name: string;
  };
};

export type DialysisMachineFull = {
  id: number;
  name: string;
  serialNumber: string;
  communicationType: DialysisMachineCommunicationType;
  status: DialysisMachineStatus;
  model: string;
  brand: string;
  warrantyFrom: string;
  warrantyTo: string;
  warrantyFinished: boolean;
  maintenanceFrom: string;
  maintenanceTo: string;
  maintenanceFinished: boolean;
  slotCount: number;
  commissionedDate: string;
  description: string;
  isolationGroup: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  comment?: string;
};
