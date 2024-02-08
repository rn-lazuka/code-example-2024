import type { submitAccessManagementPayload } from '@store';
import {
  accessManagementError,
  getAccessManagements,
  getAccessManagementSuccess,
  submitAccessManagement,
  submitAccessManagementSuccess,
} from '@store';
import { API } from '@utils/api';
import type { Action } from 'redux';
import {
  deleteAccessManagementsSaga,
  getAccessManagementsSaga,
  submitAccessManagementSaga,
} from '@sagas/accessManagement';
import { addSnack } from '@store/slices/snackSlice';
import { SnackType } from '@enums';
import i18n from 'i18next';
import { runSagaHandler } from '@unit-tests';

describe('Access Management Sagas', () => {
  afterAll(() => jest.clearAllMocks());

  describe('submitAccessManagementSaga', () => {
    const submitAccessManagementPayloadMock: submitAccessManagementPayload = {
      accessManagement: {},
      patientId: '1',
    };

    it('should call "POST" api method and show needed snack, when "hdAccessId" is not passed in payload', async () => {
      API.post = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, submitAccessManagementSaga, {
        type: submitAccessManagement.type,
        payload: submitAccessManagementPayloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(
        `/pm/patients/${submitAccessManagementPayloadMock.patientId}/hd-accesses`,
        submitAccessManagementPayloadMock.accessManagement,
      );
      expect(dispatched).toEqual([
        { type: submitAccessManagementSuccess.type, payload: {} },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('accessManagement:modal.hasBeenCreated'),
          },
        },
        { type: getAccessManagements.type, payload: submitAccessManagementPayloadMock.patientId },
      ]);
    });

    it('should call "PUT" api method and show needed snack, when "hdAccessId" is passed in payload', async () => {
      API.put = jest.fn().mockResolvedValue({});
      const hdAccessId = '2';
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, submitAccessManagementSaga, {
        type: submitAccessManagement.type,
        payload: { ...submitAccessManagementPayloadMock, hdAccessId },
      });

      expect(API.put).toHaveBeenCalledWith(
        `/pm/patients/${submitAccessManagementPayloadMock.patientId}/hd-accesses/${hdAccessId}`,
        submitAccessManagementPayloadMock.accessManagement,
      );
      expect(dispatched).toEqual([
        { type: submitAccessManagementSuccess.type, payload: {} },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('accessManagement:modal.hasBeenModify'),
          },
        },
        { type: getAccessManagements.type, payload: submitAccessManagementPayloadMock.patientId },
      ]);
    });

    it('should handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, submitAccessManagementSaga, {
        type: submitAccessManagement.type,
        payload: submitAccessManagementPayloadMock,
      });

      expect(dispatched).toEqual([
        { type: accessManagementError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('accessManagement:modal.updateFailed') },
        },
      ]);
    });
  });

  describe('getAccessManagementsSaga', () => {
    const patientId = '1';

    it('should fetch data and put it into the store', async () => {
      API.get = jest.fn().mockResolvedValue({ data: [] });
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, getAccessManagementsSaga, {
        type: getAccessManagements.type,
        payload: patientId,
      });

      expect(dispatched).toEqual([
        {
          type: getAccessManagementSuccess.type,
          payload: [],
        },
      ]);
    });

    it('should handle error', async () => {
      API.get = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, getAccessManagementsSaga, {
        type: getAccessManagements.type,
        payload: patientId,
      });

      expect(dispatched).toEqual([{ type: accessManagementError.type, payload: new Error() }]);
    });
  });

  describe('deleteAccessManagementsSaga', () => {
    const payloadMock = { hdAccessId: '1', patientId: '2' };

    it('should successful delete data', async () => {
      API.delete = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, deleteAccessManagementsSaga, {
        type: getAccessManagements.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        {
          type: addSnack.type,
          payload: { type: SnackType.Delete, message: i18n.t(`accessManagement:modal.hasDelete`) },
        },
        { type: getAccessManagements.type, payload: payloadMock.patientId },
      ]);
    });

    it('should handle error', async () => {
      API.delete = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, deleteAccessManagementsSaga, {
        type: getAccessManagements.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: accessManagementError.type, payload: new Error() }]);
    });
  });
});
