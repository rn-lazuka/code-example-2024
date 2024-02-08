import { API } from '@utils/api';
import { Action } from 'redux';
import { runSagaHandler } from '@unit-tests';
import {
  addDialyzersError,
  addSnack,
  deleteDialyzer,
  disposeOfDialyzer,
  getDialyzersList,
  getDialyzersListSuccess,
  getPatientDialyzersList,
  removeServiceModal,
  setPatientDialyzerInPreHdForm,
  submitDialyzerForm,
  submitDialyzerFormSuccess,
} from '@store/slices';
import {
  deleteDialyzerSaga,
  disposeOfDialyzerSaga,
  getDialyzersListSaga,
  submitDialyzerFormSaga,
} from '@sagas/dialyzerSaga';
import { AddDialyzerFormType } from '@types';
import { AddDialyzerModalPlace } from '@enums/components/AddDialyzerModalPlace';
import { DialyzerUseType, ServiceModalName, SnackType } from '@enums';
import i18n from 'i18next';

describe('Dialyzer Saga Tests', () => {
  describe('getDialyzersListSaga', () => {
    it('should fetch and set dialyzers list', async () => {
      const payloadMock = '1';
      const apiResponseMock = {
        data: [
          { id: 1, name: 'Dialyzer 1' },
          { id: 2, name: 'Dialyzer 2' },
        ],
      };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getDialyzersListSaga, {
        type: getDialyzersList.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`pm/patients/${payloadMock}/dialyzers`);

      expect(dispatched).toEqual([{ type: getDialyzersListSuccess.type, payload: apiResponseMock.data }]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      API.get = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getDialyzersListSaga, {
        type: getDialyzersList.type,
        payload: '1',
      });

      expect(dispatched).toEqual([{ type: addDialyzersError.type, payload: errorMock }]);
    });
  });

  describe('submitDialyzerFormSaga', () => {
    it('should create dialyzer and update for pre hd', async () => {
      const payloadMock: AddDialyzerFormType & { patientId; place: AddDialyzerModalPlace; dialyzerId?: string } = {
        patientId: '1',
        place: AddDialyzerModalPlace.PRE_HD_STEP,
        dialyzerBrand: { value: 'test', label: 'test' },
        dialyzerSurfaceArea: 'test',
        useType: DialyzerUseType.Single,
      };
      const apiResponseMock = {
        data: {
          brand: {
            name: payloadMock.dialyzerBrand?.label,
            type: payloadMock.useType,
          },
        },
      };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, submitDialyzerFormSaga, {
        type: submitDialyzerForm.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(`pm/patients/${payloadMock.patientId}/dialyzers`, {
        brandId: payloadMock.dialyzerBrand?.value,
        surfaceArea: payloadMock.dialyzerSurfaceArea,
      });

      expect(dispatched).toEqual([
        { type: submitDialyzerFormSuccess.type },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('dialyzers:hasAdded'),
          },
        },
        { type: removeServiceModal.type, payload: ServiceModalName.AddDialyzerModal },
        { type: getDialyzersList.type, payload: payloadMock.patientId },
        {
          type: setPatientDialyzerInPreHdForm.type,
          payload: {
            ...apiResponseMock.data,
          },
        },
      ]);
    });
    it('should update dialyzer and fetch info for hd prescription form', async () => {
      const payloadMock: AddDialyzerFormType & { patientId; place: AddDialyzerModalPlace; dialyzerId?: string } = {
        patientId: '1',
        dialyzerId: '1',
        place: AddDialyzerModalPlace.HD_PRESCRIPTION_FORM,
        dialyzerBrand: { value: 'test', label: 'test' },
        dialyzerSurfaceArea: 'test',
        useType: DialyzerUseType.Single,
      };
      const apiResponseMock = {
        data: {
          brand: {
            name: payloadMock.dialyzerBrand?.label,
            type: payloadMock.useType,
          },
        },
      };
      API.put = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, submitDialyzerFormSaga, {
        type: submitDialyzerForm.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(`pm/patients/${payloadMock.patientId}/dialyzers/${payloadMock.dialyzerId}`, {
        brandId: payloadMock.dialyzerBrand?.value,
        surfaceArea: payloadMock.dialyzerSurfaceArea,
      });

      expect(dispatched).toEqual([
        { type: submitDialyzerFormSuccess.type },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('dialyzers:changeDialyzer'),
          },
        },
        { type: removeServiceModal.type, payload: ServiceModalName.AddDialyzerModal },
        { type: getDialyzersList.type, payload: payloadMock.patientId },
        {
          type: getPatientDialyzersList.type,
          payload: payloadMock.patientId,
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      API.post = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, submitDialyzerFormSaga, {
        type: submitDialyzerForm.type,
        payload: {},
      });

      expect(dispatched).toEqual([{ type: addDialyzersError.type, payload: errorMock }]);
    });
  });
  describe('deleteDialyzerSaga', () => {
    it('should delete dialyzer', async () => {
      const payloadMock = { patientId: '1', dialyzerId: '1' };
      const dispatched: Action[] = [];
      API.delete = jest.fn();

      await runSagaHandler(dispatched, null, deleteDialyzerSaga, {
        type: deleteDialyzer.type,
        payload: payloadMock,
      });

      expect(API.delete).toHaveBeenCalledWith(
        `pm/patients/${payloadMock.patientId}/dialyzers/${payloadMock.dialyzerId}`,
      );

      expect(dispatched).toEqual([
        { type: getDialyzersList.type, payload: payloadMock.patientId },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Delete,
            message: i18n.t('dialyzers:hasBeenDeleted'),
          },
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      const dispatched: Action[] = [];
      API.delete = jest.fn().mockRejectedValue(errorMock);

      await runSagaHandler(dispatched, null, deleteDialyzerSaga, {
        type: deleteDialyzer.type,
        payload: {},
      });

      expect(dispatched).toEqual([{ type: addDialyzersError.type, payload: errorMock }]);
    });
  });

  describe('disposeOfDialyzerSaga', () => {
    it('should dispose of dialyzer and handle success', async () => {
      const payloadMock = { patientId: '1', dialyzerId: '1' };
      const dispatched: Action[] = [];
      API.post = jest.fn();

      await runSagaHandler(dispatched, null, disposeOfDialyzerSaga, {
        type: disposeOfDialyzer.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(
        `pm/patients/${payloadMock.patientId}/dialyzers/${payloadMock.dialyzerId}/dispose`,
      );

      expect(dispatched).toEqual([
        { type: getDialyzersList.type, payload: payloadMock.patientId },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('dialyzers:hasBeenDisposed'),
          },
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      const dispatched: Action[] = [];
      API.post = jest.fn().mockRejectedValue(errorMock);

      await runSagaHandler(dispatched, null, disposeOfDialyzerSaga, {
        type: disposeOfDialyzer.type,
        payload: {},
      });

      expect(dispatched).toEqual([{ type: addDialyzersError.type, payload: errorMock }]);
    });
  });
});
