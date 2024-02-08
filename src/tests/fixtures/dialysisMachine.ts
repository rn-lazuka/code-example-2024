import { DialysisMachineCommunicationType, DialysisMachineStatus } from '@enums';
import { DialysisMachine, DialysisMachineFull } from '@types';
import { getTenantStartCurrentDay } from '@utils/getTenantDate';

export const dialysisMachineFixture = (id: number, data: Partial<DialysisMachine> = {}): DialysisMachine => {
  return {
    id,
    name: 'Machine 1',
    status: DialysisMachineStatus.ACTIVE,
    serialNumber: '123456789',
    model: 'MK - ' + id,
    brand: 'Brand A',
    location: {
      id: 1,
      name: 'Location 1',
    },
    warrantyFinished: false,
    isolationGroup: {
      id: 1,
      name: 'Isolation Group 1',
    },
    ...data,
  };
};

export const dialysisMachineFullFixture = (
  id: number,
  data: Partial<DialysisMachineFull> = {},
): DialysisMachineFull => {
  return {
    id,
    name: 'Dialysis Machine ' + id,
    serialNumber: 'SN-00' + id,
    communicationType: DialysisMachineCommunicationType.COM_PORT,
    status: DialysisMachineStatus.ACTIVE,
    model: 'Model X',
    brand: 'Brand Y',
    warrantyFrom: getTenantStartCurrentDay().toDateString(),
    warrantyTo: getTenantStartCurrentDay().toDateString(),
    warrantyFinished: false,
    maintenanceFrom: getTenantStartCurrentDay().toDateString(),
    maintenanceTo: getTenantStartCurrentDay().toDateString(),
    maintenanceFinished: false,
    slotCount: 3,
    commissionedDate: getTenantStartCurrentDay().toDateString(),
    description: 'High-performance dialysis machine with advanced features',
    isolationGroup: {
      id: 5678,
      name: 'Isolation Group A',
    },
    location: {
      id: 9012,
      name: 'Hospital XYZ',
    },
    comment: 'This machine has been performing well so far.',
    ...data,
  };
};
