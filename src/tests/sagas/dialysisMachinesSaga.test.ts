import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  createDialysisMachineSaga,
  getDialysisMachineSaga,
  getDialysisMachinesIsolationGroupsSaga,
  getDialysisMachinesListSaga,
  updateDialysisMachineSaga,
} from '@sagas/dialysisMachinesSaga';
import {
  addSnack,
  createDialysisMachine,
  createDialysisMachineSuccess,
  getDialysisMachine,
  getDialysisMachinesIsolationGroups,
  getDialysisMachinesIsolationGroupsSuccess,
  getDialysisMachinesList,
  getDialysisMachinesListSuccess,
  getDialysisMachineSuccess,
  removeDrawer,
  updateDialysisMachine,
  updateDialysisMachineSuccess,
} from '@store/slices';
import {
  dialysisMachineFixture,
  dialysisMachineFullFixture,
  dialysisMachineIsolationGroupFixture,
} from '@unit-tests/fixtures';
import type { DialysisMachine, DialysisMachineFull } from '@types';
import { DialysisMachineCommunicationType, DialysisMachineStatus, DrawerType, SnackType } from '@enums';
import i18n from 'i18next';

describe('DialysisMachinesSaga', () => {
  let store;
  let dispatched;

  beforeEach(() => {
    dispatched = [];
    store = {
      dialysisMachines: {
        statuses: {
          isLoading: false,
          isSubmitting: false,
        },
        error: null,
        machines: [],
        machine: null,
        isolationGroups: [],
        sortBy: 'name',
        sortDir: 'asc',
        pagination: {
          currentPage: 0,
          perPage: 50,
          totalCount: 0,
        },
      },
    };
  });

  describe('getDialysisMachinesInfectionStatusesSaga', () => {
    it('should correctly get data from API, put the data to the store', async () => {
      const isolationGroupResponse = [dialysisMachineIsolationGroupFixture(1, 'Non', [])];

      API.get = jest.fn().mockResolvedValue({
        data: isolationGroupResponse,
      });

      await runSagaHandler(
        dispatched,
        store,
        getDialysisMachinesIsolationGroupsSaga,
        getDialysisMachinesIsolationGroups(),
      );

      expect(API.get).toHaveBeenCalledTimes(1);
      expect(API.get).toHaveBeenCalledWith('/pm/isolation-groups');
      expect(dispatched).toEqual([getDialysisMachinesIsolationGroupsSuccess(isolationGroupResponse)]);
    });
  });

  describe('getDialysisMachinesListSaga', () => {
    it('should correctly get data from API, put the data to the store and show snacks', async () => {
      API.post = jest.fn().mockResolvedValue({
        data: {
          content: [dialysisMachineFixture(1), dialysisMachineFixture(2)] as DialysisMachine[],
          totalElements: 2,
        },
      });
      await runSagaHandler(dispatched, store, getDialysisMachinesListSaga, getDialysisMachinesList());

      expect(API.post).toHaveBeenCalledTimes(1);
      expect(API.post).toHaveBeenCalledWith(
        '/pm/dialysis-machines/search',
        {},
        {
          params: {
            sort: `${store.dialysisMachines.sortBy},${store.dialysisMachines.sortDir}`,
            page: store.dialysisMachines.pagination.currentPage,
            size: store.dialysisMachines.pagination.perPage,
          },
        },
      );
      expect(dispatched).toEqual([
        getDialysisMachinesListSuccess({
          content: [dialysisMachineFixture(1), dialysisMachineFixture(2)],
          totalElements: 2,
        }),
      ]);
    });
  });

  describe('createDialysisMachineSaga', () => {
    it('should correctly create dialysis machine, remove drawer and show snack', async () => {
      const dialysisMachineId = '1';
      const dialysisMachineFormData = {
        name: 'name',
        serialNumber: 'num',
        model: 'model',
        brand: 'brand',
        communicationType: DialysisMachineCommunicationType.COM_PORT,
        slotCount: 2,
        description: 'descr',
        status: DialysisMachineStatus.ACTIVE,
        commissionedDate: '2023-10-10',
        isolationGroupId: 1,
        locationId: 1,
        maintenanceFrom: '2023-10-10',
        maintenanceTo: '2023-10-10',
        warrantyFrom: '2023-10-10',
        warrantyTo: '2023-10-10',
        comment: 'comment',
      };
      const dialysisMachineResponse: DialysisMachineFull = {
        id: +dialysisMachineId,
        name: dialysisMachineFormData.name,
        serialNumber: dialysisMachineFormData.serialNumber,
        communicationType: dialysisMachineFormData.communicationType,
        status: dialysisMachineFormData.status,
        model: dialysisMachineFormData.model,
        brand: dialysisMachineFormData.brand,
        warrantyFrom: dialysisMachineFormData.warrantyFrom,
        warrantyTo: dialysisMachineFormData.warrantyTo,
        warrantyFinished: true,
        maintenanceFrom: dialysisMachineFormData.maintenanceFrom,
        maintenanceTo: dialysisMachineFormData.maintenanceTo,
        maintenanceFinished: true,
        slotCount: dialysisMachineFormData.slotCount,
        commissionedDate: dialysisMachineFormData.commissionedDate,
        description: dialysisMachineFormData.description,
        isolationGroup: {
          id: +dialysisMachineFormData.isolationGroupId,
          name: 'iso name',
        },
        location: {
          id: +dialysisMachineFormData.locationId,
          name: 'location name',
        },
        comment: dialysisMachineFormData.comment,
      };

      API.post = jest.fn().mockResolvedValue({
        data: dialysisMachineResponse,
      });
      await runSagaHandler(
        dispatched,
        store,
        createDialysisMachineSaga,
        createDialysisMachine(dialysisMachineFormData),
      );

      expect(API.post).toHaveBeenCalledTimes(1);
      expect(API.post).toHaveBeenCalledWith('/pm/dialysis-machines', dialysisMachineFormData);
      expect(dispatched).toEqual([
        createDialysisMachineSuccess(dialysisMachineResponse),
        removeDrawer(DrawerType.DialysisMachineForm),
        addSnack({ type: SnackType.Success, message: i18n.t('dialysisMachine:snacks.dialysisMachineHasBeenAdded') }),
      ]);
    });
  });

  describe('getDialysisMachineSaga', () => {
    it('should correctly getting dialysis machine and pass data to the store', async () => {
      const dialysisMachine = dialysisMachineFullFixture(1);
      API.get = jest.fn().mockResolvedValue({
        data: dialysisMachine,
      });
      await runSagaHandler(
        dispatched,
        store,
        getDialysisMachineSaga,
        getDialysisMachine(dialysisMachine.id.toString()),
      );

      expect(API.get).toHaveBeenCalledTimes(1);
      expect(API.get).toHaveBeenCalledWith('/pm/dialysis-machines/' + dialysisMachine.id);
      expect(dispatched).toEqual([getDialysisMachineSuccess(dialysisMachine)]);
    });
  });

  describe('updateDialysisMachineSaga', () => {
    it('should correctly update dialysis machine, remove drawer and show a snack', async () => {
      const dialysisMachineId = '1';
      const dialysisMachineFormData = {
        name: 'name',
        serialNumber: 'num',
        model: 'model',
        brand: 'brand',
        communicationType: DialysisMachineCommunicationType.COM_PORT,
        slotCount: 2,
        description: 'descr',
        status: DialysisMachineStatus.ACTIVE,
        commissionedDate: '2023-10-10',
        isolationGroupId: 1,
        locationId: 1,
        maintenanceFrom: '2023-10-10',
        maintenanceTo: '2023-10-10',
        warrantyFrom: '2023-10-10',
        warrantyTo: '2023-10-10',
        comment: 'comment',
      };
      const dialysisMachineResponse: DialysisMachineFull = {
        id: +dialysisMachineId,
        name: dialysisMachineFormData.name,
        serialNumber: dialysisMachineFormData.serialNumber,
        communicationType: dialysisMachineFormData.communicationType,
        status: dialysisMachineFormData.status,
        model: dialysisMachineFormData.model,
        brand: dialysisMachineFormData.brand,
        warrantyFrom: dialysisMachineFormData.warrantyFrom,
        warrantyTo: dialysisMachineFormData.warrantyTo,
        warrantyFinished: true,
        maintenanceFrom: dialysisMachineFormData.maintenanceFrom,
        maintenanceTo: dialysisMachineFormData.maintenanceTo,
        maintenanceFinished: true,
        slotCount: dialysisMachineFormData.slotCount,
        commissionedDate: dialysisMachineFormData.commissionedDate,
        description: dialysisMachineFormData.description,
        isolationGroup: {
          id: +dialysisMachineFormData.isolationGroupId,
          name: 'iso name',
        },
        location: {
          id: +dialysisMachineFormData.locationId,
          name: 'location name',
        },
        comment: dialysisMachineFormData.comment,
      };

      API.put = jest.fn().mockResolvedValue({
        data: dialysisMachineResponse,
      });

      await runSagaHandler(
        dispatched,
        store,
        updateDialysisMachineSaga,
        updateDialysisMachine({
          id: dialysisMachineId,
          data: dialysisMachineFormData,
        }),
      );

      expect(API.put).toHaveBeenCalledTimes(1);
      expect(API.put).toHaveBeenCalledWith('/pm/dialysis-machines/1', dialysisMachineFormData);
      expect(dispatched).toEqual([
        updateDialysisMachineSuccess(dialysisMachineResponse),
        getDialysisMachine(dialysisMachineId),
        removeDrawer(DrawerType.DialysisMachineForm),
        addSnack({ type: SnackType.Success, message: i18n.t('dialysisMachine:snacks.dialysisMachineHasBeenUpdated') }),
      ]);
    });
  });
});
