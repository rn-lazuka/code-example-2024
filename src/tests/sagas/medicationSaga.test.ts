import type { MedicationRequest } from '@types';
import type { Action } from 'redux';
import { API } from '@utils';
import { runSagaHandler } from '@unit-tests';
import {
  addMedicationSaga,
  changeMedicationSaga,
  deleteMedicationSaga,
  discontinueMedicationSaga,
  editMedicationSaga,
  getMedicationsSaga,
} from '@sagas/medicationsSaga';
import {
  addMedication,
  addMedicationError,
  addMedicationSuccess,
  addServiceModal,
  addSnack,
  changeMedication,
  changeMedicationError,
  ChangeMedicationPayload,
  changeMedicationSuccess,
  deleteMedication,
  deleteMedicationError,
  deleteMedicationSuccess,
  discontinueMedication,
  discontinueMedicationError,
  discontinueMedicationSuccess,
  editMedication,
  editMedicationSuccess,
  getMedicationsList,
  getMedicationsListError,
  getMedicationsListSuccess,
} from '@store/slices';
import i18n from 'i18next';
import { DoctorTypes, MedicationDrawerType, ServiceModalName, SnackType } from '@enums';
import { ERROR_CODES } from '@constants';

describe('Medications Saga', () => {
  afterAll(() => jest.clearAllMocks());

  describe('getMedicationsSaga', () => {
    it('should correctly fetch medications', async () => {
      API.get = jest.fn().mockResolvedValue({ data: [] });
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, getMedicationsSaga, {
        type: getMedicationsList.type,
        payload: '1',
      });

      expect(API.get).toHaveBeenCalledWith(`pm/patients/1/medication-requests`);
      expect(dispatched).toEqual([
        {
          type: getMedicationsListSuccess.type,
          payload: [],
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.get = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, getMedicationsSaga, {
        type: getMedicationsList.type,
        payload: '1',
      });

      expect(dispatched).toEqual([{ type: getMedicationsListError.type, payload: new Error() }]);
    });
  });

  describe('addMedicationSaga', () => {
    it('should correctly add medication', async () => {
      API.post = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { medication: {}, id: '1' };

      await runSagaHandler(dispatched, {}, addMedicationSaga, {
        type: addMedication.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/medication-requests`,
        payloadMock.medication,
      );
      expect(dispatched).toEqual([
        { type: addMedicationSuccess.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('medications:form.medicationCreate') },
        },
        { type: getMedicationsList.type, payload: payloadMock.id },
      ]);
    });

    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = { medication: {}, id: '1' };

      await runSagaHandler(dispatched, {}, addMedicationSaga, {
        type: addMedication.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addMedicationError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
        },
      ]);
    });
  });

  describe('editMedicationSaga', () => {
    it(`should correctly edit medication and call "PUT" method, when medication type not equal ${MedicationDrawerType.Confirm}`, async () => {
      API.put = jest.fn().mockResolvedValue({});
      API.post = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { medication: {}, id: '1', medicationId: '2', type: MedicationDrawerType.Edit };

      await runSagaHandler(dispatched, {}, editMedicationSaga, {
        type: editMedication.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/medication-requests/${payloadMock.medicationId}`,
        payloadMock.medication,
      );
      expect(API.post).not.toBeCalled();
      expect(dispatched).toEqual([
        { type: editMedicationSuccess.type },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('medications:form.medicationUpdate'),
          },
        },
        { type: getMedicationsList.type, payload: payloadMock.id },
      ]);
    });

    it(`should correctly edit medication and call "POST" method, when medication type equal ${MedicationDrawerType.Confirm}`, async () => {
      API.post = jest.fn().mockResolvedValue({});
      API.put = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { medication: {}, id: '1', medicationId: '2', type: MedicationDrawerType.Confirm };

      await runSagaHandler(dispatched, {}, editMedicationSaga, {
        type: editMedication.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/medication-requests/${payloadMock.medicationId}`,
        payloadMock.medication,
      );
      expect(API.post).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/medication-requests/${payloadMock.medicationId}/confirm`,
      );
      expect(dispatched).toEqual([
        { type: editMedicationSuccess.type },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('medications:form.medicationConfirm'),
          },
        },
        { type: getMedicationsList.type, payload: payloadMock.id },
      ]);
    });

    it(`should correctly handle error, when medication type not equal ${MedicationDrawerType.Confirm}`, async () => {
      API.put = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = { medication: {}, id: '1', medicationId: '2', type: MedicationDrawerType.Edit };

      await runSagaHandler(dispatched, {}, editMedicationSaga, {
        type: editMedication.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addMedicationError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
        },
      ]);
    });

    it(`should correctly handle error, when medication type equal ${MedicationDrawerType.Confirm} and error comes from back-end`, async () => {
      const errorMock = { response: { data: [{ code: ERROR_CODES.MEDICATION_CONFIRMATION_FREQUENCY_MISMATCH }] } };
      API.post = jest.fn().mockRejectedValue(errorMock);
      API.put = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];
      const payloadMock = { medication: {}, id: '1', medicationId: '2', type: MedicationDrawerType.Confirm };

      await runSagaHandler(dispatched, {}, editMedicationSaga, {
        type: editMedication.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addMedicationError.type, payload: errorMock },
        {
          type: addServiceModal.type,
          payload: {
            name: ServiceModalName.ConfirmModal,
            payload: {
              cancelButton: null,
              confirmButton: i18n.t('common:button.ok'),
              title: i18n.t('medications:setupPrescriptionOrChangeMedication'),
              text: null,
            },
          },
        },
      ]);
    });
  });

  describe('deleteMedicationSaga', () => {
    it('should correctly delete medication', async () => {
      API.delete = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', medicationId: '2' };

      await runSagaHandler(dispatched, {}, deleteMedicationSaga, {
        type: deleteMedication.type,
        payload: payloadMock,
      });

      expect(API.delete).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/medication-requests/${payloadMock.medicationId}`,
      );
      expect(dispatched).toEqual([
        { type: deleteMedicationSuccess.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Delete, message: i18n.t('medications:form.medicationDeleted') },
        },
        { type: getMedicationsList.type, payload: payloadMock.id },
      ]);
    });

    it('should correctly handle error', async () => {
      API.delete = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', medicationId: '2' };

      await runSagaHandler(dispatched, {}, deleteMedicationSaga, {
        type: deleteMedication.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: deleteMedicationError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
        },
      ]);
    });
  });

  describe('discontinueMedicationSaga', () => {
    it('should correctly discontinue medication', async () => {
      API.post = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { date: 'test date', medicationId: '2', patientId: '1' };

      await runSagaHandler(dispatched, {}, discontinueMedicationSaga, {
        type: discontinueMedication.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.patientId}/medication-requests/${payloadMock.medicationId}/discontinue`,
        { date: payloadMock.date },
      );
      expect(dispatched).toEqual([
        { type: discontinueMedicationSuccess.type },
        { type: getMedicationsList.type, payload: payloadMock.patientId },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('medications:discontinueSuccess') },
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = { date: 'test date', medicationId: '2', patientId: '1' };

      await runSagaHandler(dispatched, {}, discontinueMedicationSaga, {
        type: discontinueMedication.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: discontinueMedicationError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
        },
      ]);
    });
  });

  describe('changeMedicationSaga', () => {
    it('should correctly change medication', async () => {
      API.post = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock: ChangeMedicationPayload = {
        addMedicationData: { medication: {} as MedicationRequest, id: '1' },
        discontinueMedicationData: {
          medicationId: '2',
          patientId: '3',
          orderedBy: { source: DoctorTypes.External },
          date: 'test date',
        },
        collapseAllTableRowsHandler: () => {},
      };

      await runSagaHandler(dispatched, {}, changeMedicationSaga, {
        type: changeMedication.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledTimes(2);
      expect(API.post).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.discontinueMedicationData.patientId}/medication-requests/${payloadMock.discontinueMedicationData.medicationId}/discontinue`,
        {
          orderedBy: payloadMock.discontinueMedicationData.orderedBy,
          date: payloadMock.discontinueMedicationData.date,
        },
      );
      expect(API.post).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.addMedicationData.id}/medication-requests`,
        payloadMock.addMedicationData.medication,
      );
      expect(dispatched).toEqual([
        { type: changeMedicationSuccess.type },
        { type: getMedicationsList.type, payload: payloadMock.discontinueMedicationData.patientId },
      ]);
    });

    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = {
        addMedicationData: { medication: {}, id: '1' },
        discontinueMedicationData: { medicationId: '2', patientId: '3', orderedBy: 'Test', date: 'test date' },
      };

      await runSagaHandler(dispatched, {}, changeMedicationSaga, {
        type: changeMedication.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: changeMedicationError.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
        },
        { type: getMedicationsList.type, payload: payloadMock.discontinueMedicationData.patientId },
      ]);
    });
  });
});
