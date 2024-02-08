import type { PatientStatusChangeRequest } from '@types';
import type { Action } from 'redux';
import { API } from '@utils';
import { runSagaHandler } from '@unit-tests';
import {
  addPatientError,
  addSnack,
  changeClinicalInfo,
  ChangeClinicalInfoPayload,
  changeClinicalInfoSuccess,
  changeDocuments,
  changeDocumentsSuccess,
  changeFamilyInfo,
  changeFamilyInfoSuccess,
  changeMainInfo,
  changeMainInfoSuccess,
  changePatientStatus,
  changePatientStatusSuccess,
  changeTreatmentInfo,
  changeTreatmentInfoSuccess,
  checkHasTodayEncounter,
  createNewPatient,
  createNewPatientSuccess,
  deletePatient,
  deletePatientSuccess,
  getDialysisProcessInfo,
  getDialysisProcessInfoSuccess,
  getPatientDialyzersList,
  getPatientDialyzersListSuccess,
  getPatientIsolationStatus,
  getPatientIsolationStatusSuccess,
  getPatientStatusHistory,
  getPatientStatusHistorySuccess,
  removeServiceModal,
  setHasTodayEncounter,
  setIsServiceEncountered,
  getPatientData,
  getPatientDataSuccess,
} from '@store/slices';
import { patientWalkInFixture, treatmentInfoFixture } from '@unit-tests/fixtures';
import {
  changeDocumentsSaga,
  changeFamilyInfoSaga,
  changePatientClinicalInfoSaga,
  changePatientMainInfoSaga,
  changePatientStatusSaga,
  changeTreatmentInfoSaga,
  checkHasTodayEncounterSaga,
  createNewPatientSaga,
  deletePatientSaga,
  getDialysisProcessInfoSaga,
  getPatientDialyzersListSaga,
  getPatientIsolationStatusSaga,
  getPatientStatusHistorySaga,
  getPatientDataSaga,
} from '@src/sagas/patientSaga';
import {
  AllergiesInfo,
  AppointmentStatus,
  PatientHospitalizationReason,
  PatientStatuses,
  ServiceModalName,
  SnackType,
} from '@src/enums';
import { ERROR_CODES, ROUTES } from '@constants';
import i18n from 'i18next';
import { AxiosError } from 'axios';

const patient = patientWalkInFixture();
const request = { path: '/test' };
const headers = {};
const config = {};

describe('Patient Saga Tests', () => {
  describe('createNewPatientSaga', () => {
    it('should create a new patient', async () => {
      const payloadMock = { patient, status: patient.status, messages: { error: '', success: 'test' } };
      const apiResponseMock = { data: payloadMock.patient };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, createNewPatientSaga, {
        type: createNewPatient.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/patients', payloadMock.patient);
      expect(dispatched).toEqual([
        {
          type: createNewPatientSuccess.type,
          payload: { patient: apiResponseMock.data },
        },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: payloadMock.messages.success },
        },
      ]);
    });
    it('should handle errors', async () => {
      const payloadMock = { patient, status: patient.status, messages: { error: 'test', success: 'test' } };
      const errorResponseMock = {
        response: {
          data: [
            { code: ERROR_CODES.PATIENT_IS_NOT_UNIQUE },
            { code: ERROR_CODES.S3_ANTIVIRUS_ERROR },
            { code: 'SOME_OTHER_ERROR' },
            { code: ERROR_CODES.S3_FILE_IS_NOT_FOUND },
          ],
        },
      };
      API.post = jest.fn().mockRejectedValue(errorResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, createNewPatientSaga, {
        type: createNewPatient.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: { code: ERROR_CODES.PATIENT_IS_NOT_UNIQUE } },
        { type: addPatientError.type, payload: errorResponseMock.response.data[1] },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('common:fileUpload.hasNotBeenChecked') },
        },
        { type: addPatientError.type, payload: errorResponseMock.response.data[2] },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: payloadMock.messages.error },
        },
        { type: addPatientError.type, payload: errorResponseMock.response.data[3] },
      ]);
    });
  });
  describe('deletePatientSaga', () => {
    it('should delete patient', async () => {
      const apiResponseMock = { data: {} };
      const navigateMock = jest.fn();
      const payloadMock = { id: '1', navigate: navigateMock };
      API.delete = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, deletePatientSaga, {
        type: deletePatient.type,
        payload: payloadMock,
      });

      expect(API.delete).toHaveBeenCalledWith(`/pm/patients/${payloadMock.id}`);
      expect(dispatched).toEqual([
        { type: deletePatientSuccess.type },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('patient:modal.patientHasBeenDeleted') },
        },
      ]);
      expect(navigateMock).toHaveBeenCalledWith(`/${ROUTES.patientsOverview}`);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      API.delete = jest.fn().mockRejectedValue(errorMock);
      const navigateMock = jest.fn();
      const payloadMock = { id: '1', navigate: navigateMock };
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, deletePatientSaga, {
        type: deletePatient.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: errorMock },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:modal.deleteError') },
        },
      ]);
    });
  });
  describe('changePatientMainInfoSaga', () => {
    it('should change patient main info', async () => {
      const payloadMock = { id: '1', patient, status: patient.status };
      const apiResponseMock = { data: patient };
      API.put = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, { patient: { patient } }, changePatientMainInfoSaga, {
        type: changeMainInfo.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(`/pm/patients/${payloadMock.id}`, payloadMock.patient);
      expect(dispatched).toEqual([
        {
          type: changeMainInfoSuccess.type,
          payload: {
            ...apiResponseMock.data,
            photoPath: undefined,
          },
        },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('patient:modal.patientUpdated') },
        },
      ]);
    });

    it('should handle unique patient error', async () => {
      const errorResponseMock = new AxiosError('Boom!', 'SOMETHING', config, request, {
        status: 200,
        data: [{ code: ERROR_CODES.PATIENT_IS_NOT_UNIQUE }],
        statusText: 'ok',
        request,
        headers,
        config,
      });
      const payloadMock = { id: '1', patient, status: patient.status };
      API.put = jest.fn().mockRejectedValue(errorResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, { patient: { patient } }, changePatientMainInfoSaga, {
        type: changeMainInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: { message: ERROR_CODES.PATIENT_IS_NOT_UNIQUE } },
      ]);
    });

    it('should handle other errors', async () => {
      const errorResponseMock = new AxiosError('Boom!', 'SOMETHING', config, request, {
        status: 200,
        data: [{ code: 'OTHER_CODE' }],
        statusText: 'ok',
        request,
        headers,
        config,
      });
      const payloadMock = { id: '1', patient, status: patient.status };
      API.put = jest.fn().mockRejectedValue(errorResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, { patient: { patient } }, changePatientMainInfoSaga, {
        type: changeMainInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: errorResponseMock },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:modal.updateFailed') },
        },
      ]);
    });
  });
  describe('changeFamilyInfoSaga', () => {
    it('should change family info', async () => {
      const payloadMock = {
        familyInfo: {
          maritalStatus: 'alone',
          kins: [{ name: 'test', phone: { number: '122354561', countryCode: '375' }, relationship: 'brother' }],
        },
        id: '1',
        method: 'post',
      };
      const apiResponseMock = { data: payloadMock };
      API[payloadMock.method] = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changeFamilyInfoSaga, {
        type: changeFamilyInfo.type,
        payload: payloadMock,
      });

      expect(API[payloadMock.method]).toHaveBeenCalledWith(
        `/pm/patients/${payloadMock.id}/family`,
        payloadMock.familyInfo,
      );
      expect(dispatched).toEqual([
        { type: changeFamilyInfoSuccess.type, payload: apiResponseMock.data },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('patient:modal.patientUpdated') },
        },
      ]);
    });

    it('should handle errors', async () => {
      const payloadMock = {
        familyInfo: {
          maritalStatus: 'alone',
          kins: [{ name: 'test', phone: { number: '122354561', countryCode: '375' }, relationship: 'brother' }],
        },
        id: '1',
        method: 'post',
      };
      const errorMock = new Error();
      API[payloadMock.method] = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changeFamilyInfoSaga, {
        type: changeFamilyInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: errorMock },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:modal.updateFailed') },
        },
      ]);
    });
  });
  describe('changeDocumentsSaga', () => {
    it('should change patient documents', async () => {
      const payloadMock = { id: '1', files: [] };
      const apiResponseMock = { data: { files: [] } };
      API.put = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changeDocumentsSaga, {
        type: changeDocuments.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(`/pm/patients/${payloadMock.id}/files`, { files: payloadMock.files });
      expect(dispatched).toEqual([
        { type: changeDocumentsSuccess.type, payload: apiResponseMock.data.files },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('patient:modal.patientUpdated') },
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorResponseMock = {
        response: {
          data: [{ code: ERROR_CODES.S3_ANTIVIRUS_ERROR }, { code: 'SOME_OTHER_ERROR' }],
        },
      };
      const payloadMock = { id: '1', files: [] };
      API.put = jest.fn().mockRejectedValue(errorResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changeDocumentsSaga, {
        type: changeDocuments.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('common:fileUpload.hasNotBeenChecked') },
        },
        { type: addPatientError.type, payload: errorResponseMock.response.data[0] },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:modal.updateFailed') },
        },
        { type: addPatientError.type, payload: errorResponseMock.response.data[1] },
      ]);
    });
  });
  describe('changePatientClinicalInfoSaga', () => {
    it('should change patient clinical info', async () => {
      const payloadMock: ChangeClinicalInfoPayload = {
        clinicalInfo: {
          allergy: {
            type: AllergiesInfo.NoAllergy,
            values: [],
          },
        },
        id: '1',
        method: 'post',
      };
      const apiResponseMock = { data: payloadMock.clinicalInfo };
      API[payloadMock.method] = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changePatientClinicalInfoSaga, {
        type: changeClinicalInfo.type,
        payload: payloadMock,
      });
      expect(API[payloadMock.method]).toHaveBeenCalledWith(`/pm/patients/${payloadMock.id}/clinical-info`, {
        ...payloadMock.clinicalInfo,
        medicalHistory: payloadMock.clinicalInfo?.medicalHistory?.replace(/\n/g, '\\n'),
      });
      expect(dispatched).toEqual([
        {
          type: changeClinicalInfoSuccess.type,
          payload: {
            clinicalInfo: {
              ...apiResponseMock.data,
              medicalHistory: apiResponseMock.data?.medicalHistory?.replace(/\\n/g, '\n'),
            },
          },
        },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('patient:modal.patientUpdated') },
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      const payloadMock: ChangeClinicalInfoPayload = {
        clinicalInfo: {
          allergy: {
            type: AllergiesInfo.NoAllergy,
            values: [],
          },
        },
        id: '1',
        method: 'post',
      };
      API[payloadMock.method] = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changePatientClinicalInfoSaga, {
        type: changeClinicalInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: errorMock },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:modal.updateFailed') },
        },
      ]);
    });
  });
  describe('changeTreatmentInfoSaga', () => {
    it('should change treatment info', async () => {
      const payloadMock = { treatmentInfo: treatmentInfoFixture(), id: '1' };
      const apiResponseMock = { data: payloadMock };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changeTreatmentInfoSaga, {
        type: changeTreatmentInfo.type,
        payload: payloadMock,
      });
      expect(API.post).toHaveBeenCalledWith(`/pm/patients/${payloadMock.id}/treatment`, payloadMock.treatmentInfo);
      expect(dispatched).toEqual([
        {
          type: changeTreatmentInfoSuccess.type,
          payload: { treatmentInfo: apiResponseMock.data },
        },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('patient:modal.patientUpdated') },
        },
      ]);
    });
    it('should handle errors', async () => {
      const payloadMock = { treatmentInfo: treatmentInfoFixture(), id: '1' };
      const errorMock = new Error();
      API.post = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changeTreatmentInfoSaga, {
        type: changeTreatmentInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: errorMock },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:modal.updateFailed') },
        },
      ]);
    });
  });
  describe('getPatientDataSaga', () => {
    it('should get patient data', async () => {
      const payloadMock = '1';
      const apiResponseMock = { data: {} };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientDataSaga, {
        type: getPatientData.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`/pm/patients/${payloadMock}`);
      expect(dispatched).toEqual([{ type: getPatientDataSuccess.type, payload: apiResponseMock.data }]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      const payloadMock = '1';
      API.get = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientDataSaga, {
        type: getPatientData.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addPatientError.type, payload: errorMock }]);
    });
  });
  describe('getDialysisProcessInfoSaga', () => {
    it('should get dialysis process info', async () => {
      const payloadMock = '1';
      const apiResponseMock = { data: { status: AppointmentStatus.ServiceEncountered } };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getDialysisProcessInfoSaga, {
        type: getDialysisProcessInfo.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`/pm/patients/${payloadMock}/appointments/summary`);
      expect(dispatched).toEqual([
        {
          type: setIsServiceEncountered.type,
          payload: apiResponseMock.data.status === AppointmentStatus.ServiceEncountered,
        },
        { type: getDialysisProcessInfoSuccess.type, payload: apiResponseMock.data },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      const payloadMock = '1';
      API.get = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getDialysisProcessInfoSaga, {
        type: getDialysisProcessInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addPatientError.type, payload: errorMock }]);
    });
  });
  describe('getPatientIsolationStatusSaga', () => {
    it('should get patient isolation status', async () => {
      const payloadMock = '1';
      const apiResponseMock = { data: {} };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientIsolationStatusSaga, {
        type: getPatientIsolationStatus.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(`/pm/isolation-groups/detect`, {
        patientId: payloadMock,
      });
      expect(dispatched).toEqual([
        { type: getPatientIsolationStatusSuccess.type, payload: apiResponseMock.data || null },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error('Some error message');
      const payloadMock = '1';
      API.post = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientIsolationStatusSaga, {
        type: getPatientIsolationStatus.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: errorMock },
        { type: getPatientIsolationStatusSuccess.type, payload: undefined },
      ]);
    });
  });
  describe('getPatientStatusHistorySaga', () => {
    it('should get patient status history', async () => {
      const payloadMock = '1';
      const apiResponseMock = { data: {} };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientStatusHistorySaga, {
        type: getPatientStatusHistory.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`/pm/patients/${payloadMock}/statuses`);
      expect(dispatched).toEqual([{ type: getPatientStatusHistorySuccess.type, payload: apiResponseMock.data }]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error();
      const payloadMock = '1';
      API.get = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientStatusHistorySaga, {
        type: getPatientStatusHistory.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        { type: addPatientError.type, payload: errorMock },
        { type: getPatientIsolationStatusSuccess.type, payload: undefined },
      ]);
    });
  });
  describe('changePatientStatusSaga', () => {
    it('should change patient status', async () => {
      const responseData = {
        status: PatientStatuses.Permanent,
        clinic: 'test',
        comment: 'test',
        deathDate: null,
        details: 'test',
        family: { kins: [] },
        files: [],
        gender: { code: 'male' },
        reason: PatientHospitalizationReason.UNKNOWN,
        returningDate: '01-01-2023',
      };
      const payloadMock: PatientStatusChangeRequest = {
        patientId: '1',
        isHistory: false,
        statusId: '2',
        ...responseData,
      };
      const apiResponseMock = { data: responseData };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changePatientStatusSaga, {
        type: changePatientStatus.type,
        payload: payloadMock,
      });

      const expectedApiEndpoint = payloadMock.isHistory
        ? `/pm/patients/${payloadMock.patientId}/statuses/status_id_here`
        : `/pm/patients/${payloadMock.patientId}/statuses`;

      expect(API.post).toHaveBeenCalledWith(expectedApiEndpoint, responseData);

      expect(dispatched).toEqual([
        { type: removeServiceModal.type, payload: ServiceModalName.PatientStatusModal },
        { type: getPatientData.type, payload: payloadMock.patientId },
        { type: getPatientStatusHistory.type, payload: payloadMock.patientId },
        { type: changePatientStatusSuccess.type, payload: apiResponseMock.data },
        {
          type: addSnack.type,
          payload: {
            type: SnackType.Success,
            message: i18n.t('patient:snacks.statusHasBeenChanged'),
          },
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorResponseMock = new AxiosError('Boom!', 'SOMETHING', config, request, {
        status: 200,
        data: [
          { code: ERROR_CODES.APPOINTMENT_HAS_OPEN_ENCOUNTER },
          { code: ERROR_CODES.S3_ANTIVIRUS_ERROR },
          { code: ERROR_CODES.S3_FILE_IS_NOT_FOUND },
          { code: 'OTHER_ERROR' },
        ],
        statusText: 'ok',
        request,
        headers,
        config,
      });
      API.post = jest.fn().mockRejectedValue(errorResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, changePatientStatusSaga, {
        type: changePatientStatus.type,
        payload: {
          patientId: '1',
          isHistory: false,
          statusId: '2',
        },
      });

      expect(dispatched).toEqual([
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:snacks.statusCanNotBeChanged') },
        },
        { type: addPatientError.type, payload: { code: errorResponseMock.response?.data[0].code } },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('common:fileUpload.hasNotBeenChecked') },
        },
        { type: addPatientError.type, payload: { code: errorResponseMock.response?.data[1].code } },
        { type: addPatientError.type, payload: { code: errorResponseMock.response?.data[2].code } },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('patient:snacks.statusHasNotBeenChanged') },
        },
        { type: addPatientError.type, payload: { code: errorResponseMock.response?.data[3].code } },
      ]);
    });
  });
  describe('checkHasTodayEncounterSaga', () => {
    it('should set hasTodayEncounter to false', async () => {
      const payloadMock = '1';
      const apiResponseMock = { data: { available: true } };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, checkHasTodayEncounterSaga, {
        type: checkHasTodayEncounter.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith('pm/prescriptions/start-available', {
        patientId: payloadMock,
        date: expect.any(String),
      });

      expect(dispatched).toEqual([{ type: setHasTodayEncounter.type, payload: !apiResponseMock.data.available }]);
    });

    it('should handle errors', async () => {
      const errorMock = new AxiosError();
      const payloadMock = '1';
      API.post = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, checkHasTodayEncounterSaga, {
        type: checkHasTodayEncounter.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addPatientError.type, payload: errorMock }]);
    });
  });
  describe('getPatientDialyzersListSaga', () => {
    it('should fetch and set patient dialyzers list', async () => {
      const payloadMock = '1';
      const apiResponseMock = {
        data: [
          { id: 1, name: 'Dialyzer 1' },
          { id: 2, name: 'Dialyzer 2' },
        ],
      };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientDialyzersListSaga, {
        type: getPatientDialyzersList.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`/pm/patients/${payloadMock}/dialyzers?status=ACTIVE`);

      expect(dispatched).toEqual([{ type: getPatientDialyzersListSuccess.type, payload: apiResponseMock.data }]);
    });

    it('should handle errors', async () => {
      const errorMock = new AxiosError('Some error message');
      API.get = jest.fn().mockRejectedValue(errorMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getPatientDialyzersListSaga, {
        type: getPatientDialyzersList.type,
        payload: '1',
      });

      expect(dispatched).toEqual([{ type: addPatientError.type, payload: errorMock }]);
    });
  });
});
