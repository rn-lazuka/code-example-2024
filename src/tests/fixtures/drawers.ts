import { DrawerStatus, LabOrderEventPlace } from '@enums';
import { DrawerFull } from '@types';
import { ROUTES } from '@constants';

export const getBaseDrawerStateFixture = () => {
  return {
    status: DrawerStatus.Showed,
    nextStatus: DrawerStatus.Showed,
    collapsable: false,
    allowedPathsToShowDrawer: [],
    payload: {},
    statuses: {
      isDirty: false,
    },
  };
};

export const getDrawerHdPrescriptionFormFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    allowedPathsToShowDrawer: [ROUTES.patientsOverview],
    payload: {
      id: 50,
    },
    ...data,
  };
};

export const getDrawerEmptyFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    ...data,
  };
};

export const getDrawerLabOrderCreationFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    payload: {
      orderId: 1,
      disabledPatient: true,
      place: LabOrderEventPlace.LabOrders,
    },
    ...data,
  };
};

export const getDrawerAccessManagementFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    payload: { id: 50 },
    allowedPathsToShowDrawer: [],
    ...data,
  };
};

export const getDrawerTodayPatientsFiltersFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    ...data,
  };
};

export const getDrawerPatientsOverviewFiltersFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    ...data,
  };
};

export const getDrawerHdSchedulingFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    ...data,
  };
};

export const getDrawerMedicationFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    payload: { id: 50 },
    ...data,
  };
};

export const getDrawerClinicalNotesFormFixture = (data: Partial<DrawerFull> = {}) => {
  return {
    ...getBaseDrawerStateFixture(),
    payload: { id: 50 },
    ...data,
  };
};
