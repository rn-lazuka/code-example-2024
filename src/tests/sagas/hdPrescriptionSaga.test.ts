import type { Action } from 'redux';
import { runSagaHandler } from '@unit-tests';
import { addHdPrescriptionSaga, deleteHdPrescriptionSaga, viewHdPrescriptionsSaga } from '@sagas/hdPrescriptionSaga';
import {
  addHdPrescription,
  addHdPrescriptionError,
  addHdPrescriptionsError,
  addHdPrescriptionSuccess,
  addServiceModal,
  addSnack,
  deleteHdPrescription,
  deleteHdPrescriptionSuccess,
  getHdPrescriptionsList,
  getHdPrescriptionsListSuccess,
  removeDrawer,
} from '@store/slices';
import { DrawerType, ServiceModalName, SnackType } from '@enums';
import i18n from 'i18next';
import { API } from '@utils';
import { ERROR_CODES } from '@constants';

describe('HD Prescription Sagas', () => {
  afterAll(() => jest.clearAllMocks());

  describe('addHdPrescriptionSaga', () => {
    it('should correctly post hd prescriptions', async () => {
      API.post = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { hdPrescription: { id: 'Test data' }, id: '1' };

      await runSagaHandler(dispatched, {}, addHdPrescriptionSaga, {
        type: addHdPrescription.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(`/pm/patients/${payloadMock.id}/prescriptions`, payloadMock.hdPrescription);
      expect(dispatched).toEqual([
        {
          type: addHdPrescriptionSuccess.type,
        },
        removeDrawer(DrawerType.HdPrescriptionForm),
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('hdPrescription:form.hdPrescriptionCreate') },
        },
        { type: getHdPrescriptionsList.type, payload: '1' },
      ]);
    });

    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue('Error');
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, addHdPrescriptionSaga, {
        type: addHdPrescription.type,
        payload: { hdPrescription: {}, id: '1' },
      });

      expect(dispatched).toEqual([
        { type: addHdPrescriptionError.type, payload: 'Error' },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('hdPrescription:form.updateFailed') },
        },
      ]);
    });
  });

  describe('viewHdPrescriptionsSaga', () => {
    it('should correctly fetch prescriptions', async () => {
      API.get = jest.fn().mockResolvedValue({ data: [] });
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, viewHdPrescriptionsSaga, {
        type: getHdPrescriptionsList.type,
        payload: '1',
      });

      expect(API.get).toHaveBeenCalledWith(`pm/patients/1/prescriptions`);
      expect(dispatched).toEqual([
        {
          type: getHdPrescriptionsListSuccess.type,
          payload: {
            content: [],
          },
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.get = jest.fn().mockRejectedValue('Error');
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, viewHdPrescriptionsSaga, {
        type: getHdPrescriptionsList.type,
        payload: '1',
      });

      expect(dispatched).toEqual([
        {
          type: addHdPrescriptionsError.type,
          payload: 'Error',
        },
      ]);
    });
  });

  describe('deleteHdPrescriptionSaga', () => {
    it('should correctly delete prescription', async () => {
      API.delete = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { patientId: '1' };

      await runSagaHandler(dispatched, {}, deleteHdPrescriptionSaga, {
        type: deleteHdPrescription.type,
        payload: payloadMock,
      });

      expect(API.delete).toHaveBeenCalledWith(`pm/patients/${payloadMock.patientId}/prescriptions`);
      expect(dispatched).toEqual([
        { type: deleteHdPrescriptionSuccess.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Delete, message: i18n.t('hdPrescription:form.hdPrescriptionDelete') },
        },
        { type: getHdPrescriptionsList.type, payload: payloadMock.patientId },
      ]);
    });

    it('should correctly handle error with response data', async () => {
      const errorMock = { response: { data: [{ code: ERROR_CODES.HD_PRESCRIPTION_CANNOT_BE_DELETED }] } };
      API.delete = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, deleteHdPrescriptionSaga, {
        type: deleteHdPrescription.type,
        payload: { patientId: '1' },
      });

      expect(dispatched).toEqual([
        { type: addHdPrescriptionsError.type, payload: errorMock },
        {
          type: addServiceModal.type,
          payload: {
            name: ServiceModalName.ConfirmModal,
            payload: {
              cancelButton: null,
              confirmButton: i18n.t('common:button.ok'),
              title: i18n.t('hdPrescription:form.hdPrescriptionCanNotDelete'),
              text: i18n.t('hdPrescription:form.procedurePerformed'),
            },
          },
        },
      ]);
    });

    it('should correctly handle error without response data', async () => {
      API.delete = jest.fn().mockRejectedValue('Error');
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, deleteHdPrescriptionSaga, {
        type: deleteHdPrescription.type,
        payload: { patientId: '1' },
      });

      expect(dispatched).toEqual([
        { type: addHdPrescriptionsError.type, payload: 'Error' },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
        },
      ]);
    });
  });
});
