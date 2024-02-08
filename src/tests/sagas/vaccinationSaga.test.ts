import { API } from '@utils/api';
import { Action } from 'redux';
import { runSagaHandler } from '@unit-tests';
import {
  addVaccinationSaga,
  deleteVaccinationSaga,
  editVaccinationSaga,
  getVaccinationsSaga,
} from '@sagas/vaccinationSaga';
import {
  addSnack,
  addVaccination,
  addVaccinationError,
  addVaccinationSuccess,
  deleteVaccination,
  deleteVaccinationSuccess,
  editVaccination,
  editVaccinationSuccess,
  getVaccinationsList,
  getVaccinationsListSuccess,
} from '@store/slices';
import { SnackType } from '@enums/components';
import i18n from 'i18next';
import { VaccinationStatus } from '@enums/global';

describe('Vaccination Saga Tests', () => {
  describe('getVaccinationsSaga', () => {
    it('should correctly get vaccinations', async () => {
      const apiResponseMock = { data: {} };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];
      const payloadMock = '1';

      await runSagaHandler(dispatched, {}, getVaccinationsSaga, {
        type: getVaccinationsList.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`pm/patients/${payloadMock}/vaccinations`);
      expect(dispatched).toEqual([
        {
          type: getVaccinationsListSuccess.type,
          payload: apiResponseMock.data,
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.get = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = '1';

      await runSagaHandler(dispatched, {}, getVaccinationsSaga, {
        type: getVaccinationsList.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addVaccinationError.type, payload: new Error() }]);
    });
  });

  describe('addVaccinationSaga', () => {
    it('should correctly add a vaccine', async () => {
      API.post = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', vaccination: {} };

      await runSagaHandler(dispatched, {}, addVaccinationSaga, {
        type: addVaccination.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(`/pm/patients/${payloadMock.id}/vaccinations`, payloadMock.vaccination);
      expect(dispatched).toEqual([
        { type: addVaccinationSuccess.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('vaccination:form.vaccinationCreated') },
        },
        { type: getVaccinationsList.type, payload: payloadMock.id },
      ]);
    });

    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue({ response: { data: [{ code: '' }] } });
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', vaccination: {} };

      await runSagaHandler(dispatched, {}, addVaccinationSaga, {
        type: addVaccination.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('vaccination:form.updateFailed') },
        },
        { type: addVaccinationError.type, payload: { code: '' } },
      ]);
    });
  });

  describe('editVaccinationSaga', () => {
    it('should correctly edit vaccination', async () => {
      API.put = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', vaccination: {}, vaccinationId: '2' };

      await runSagaHandler(dispatched, {}, editVaccinationSaga, {
        type: editVaccination.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/vaccinations/${payloadMock.vaccinationId}`,
        payloadMock.vaccination,
      );
      expect(dispatched).toEqual([
        { type: editVaccinationSuccess.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('vaccination:form.vaccinationUpdated') },
        },
        { type: getVaccinationsList.type, payload: payloadMock.id },
      ]);
    });

    it('should correctly handle error', async () => {
      API.put = jest.fn().mockRejectedValue({ response: { data: [{ code: '' }] } });
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', vaccination: {}, vaccinationId: '2' };

      await runSagaHandler(dispatched, {}, editVaccinationSaga, {
        type: editVaccination.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('vaccination:form.updateFailed') },
        },
        { type: addVaccinationError.type, payload: { code: '' } },
      ]);
    });
  });

  describe('deleteVaccinationSaga', () => {
    it('should correctly delete vaccination', async () => {
      API.delete = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', status: VaccinationStatus, vaccinationId: '2' };

      await runSagaHandler(dispatched, {}, deleteVaccinationSaga, {
        type: deleteVaccination.type,
        payload: payloadMock,
      });

      expect(API.delete).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/vaccinations/${payloadMock.vaccinationId}`,
        { params: { status: payloadMock.status } },
      );
      expect(dispatched).toEqual([
        { type: deleteVaccinationSuccess.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Delete, message: i18n.t('vaccination:vaccinationDeleted') },
        },
        { type: getVaccinationsList.type, payload: payloadMock.id },
      ]);
    });

    it('should correctly handle error', async () => {
      API.delete = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', status: VaccinationStatus, vaccinationId: '2' };

      await runSagaHandler(dispatched, {}, deleteVaccinationSaga, {
        type: deleteVaccination.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addVaccinationError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('vaccination:form.updateFailed') },
        },
      ]);
    });
  });
});
