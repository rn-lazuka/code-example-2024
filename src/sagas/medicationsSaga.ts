import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import type {
  AddMedicationPayload,
  EditMedicationPayload,
  DeleteMedicationPayload,
  ChangeMedicationPayload,
} from '@store/slices';
import {
  addMedication,
  addMedicationError,
  addMedicationSuccess,
  editMedication,
  editMedicationSuccess,
  deleteMedication,
  deleteMedicationError,
  deleteMedicationSuccess,
  getMedicationsList,
  getMedicationsListError,
  getMedicationsListSuccess,
  discontinueMedication,
  discontinueMedicationError,
  discontinueMedicationSuccess,
  changeMedication,
  changeMedicationSuccess,
  changeMedicationError,
  addSnack,
  addServiceModal,
  exportMedication,
  exportMedicationFinish,
} from '@store/slices';
import { API } from '@utils';
import i18n from 'i18next';
import { ServiceModalName, SnackType, MedicationDrawerType } from '@enums';
import type { DiscontinueMedicationRequest } from '@types';
import { ERROR_CODES } from '@constants';
import type { AxiosResponse } from 'axios';
import { getFileParamsFromHeaders } from '@utils/getFileParamsFromHeaders';
import { downloadFile } from '@utils/downloadFile';

export function* getMedicationsSaga({ payload }: PayloadAction<string>) {
  try {
    const { data: medications } = yield call(API.get, `pm/patients/${payload}/medication-requests`);
    yield put({
      type: getMedicationsListSuccess.type,
      payload: medications,
    });
  } catch (error) {
    yield put({ type: getMedicationsListError.type, payload: error });
  }
}

export function* addMedicationSaga({
  payload: { medication, id, collapseAllTableRowsHandler, isChangingDiscontinuedMedication },
}: PayloadAction<AddMedicationPayload>) {
  try {
    yield call(API.post, `/pm/patients/${id}/medication-requests`, medication);
    if (isChangingDiscontinuedMedication && collapseAllTableRowsHandler) {
      collapseAllTableRowsHandler();
    }
    yield put({ type: addMedicationSuccess.type });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Success, message: i18n.t('medications:form.medicationCreate') },
    });
    yield put({ type: getMedicationsList.type, payload: id });
  } catch (error) {
    yield put({ type: addMedicationError.type, payload: error });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
    });
  }
}

export function* editMedicationSaga({
  payload: { medication, id, medicationId, type },
}: PayloadAction<EditMedicationPayload>) {
  try {
    yield call(API.put, `/pm/patients/${id}/medication-requests/${medicationId}`, medication);
    if (type === MedicationDrawerType.Confirm) {
      yield call(API.post, `/pm/patients/${id}/medication-requests/${medicationId}/confirm`);
    }
    yield put({ type: editMedicationSuccess.type });
    yield put({
      type: addSnack.type,
      payload: {
        type: SnackType.Success,
        message: i18n.t(
          type === MedicationDrawerType.Confirm
            ? 'medications:form.medicationConfirm'
            : 'medications:form.medicationUpdate',
        ),
      },
    });
    yield put({ type: getMedicationsList.type, payload: id });
  } catch (error: any) {
    yield put({ type: addMedicationError.type, payload: error });
    if (
      type === MedicationDrawerType.Confirm &&
      error?.response?.data[0]?.code === ERROR_CODES.MEDICATION_CONFIRMATION_FREQUENCY_MISMATCH
    ) {
      yield put({
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
      });
    } else {
      yield put({
        type: addSnack.type,
        payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
      });
    }
  }
}

export function* deleteMedicationSaga({ payload: { id, medicationId } }: PayloadAction<DeleteMedicationPayload>) {
  try {
    yield call(API.delete, `/pm/patients/${id}/medication-requests/${medicationId}`);
    yield put({ type: deleteMedicationSuccess.type });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Delete, message: i18n.t('medications:form.medicationDeleted') },
    });
    yield put({ type: getMedicationsList.type, payload: id });
  } catch (error) {
    yield put({ type: deleteMedicationError.type, payload: error });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
    });
  }
}

export function* discontinueMedicationSaga({
  payload: { patientId, medicationId, ...payload },
}: PayloadAction<DiscontinueMedicationRequest>) {
  try {
    yield call(API.post, `/pm/patients/${patientId}/medication-requests/${medicationId}/discontinue`, payload);

    yield put({ type: discontinueMedicationSuccess.type });
    yield put({ type: getMedicationsList.type, payload: patientId });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Success, message: i18n.t('medications:discontinueSuccess') },
    });
  } catch (error) {
    yield put({ type: discontinueMedicationError.type, payload: error });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
    });
  }
}

export function* changeMedicationSaga({
  payload: { addMedicationData, discontinueMedicationData, collapseAllTableRowsHandler },
}: PayloadAction<ChangeMedicationPayload>) {
  try {
    yield call(
      API.post,
      `/pm/patients/${discontinueMedicationData.patientId}/medication-requests/${discontinueMedicationData.medicationId}/discontinue`,
      { orderedBy: discontinueMedicationData.orderedBy, date: discontinueMedicationData.date },
    );
    yield call(API.post, `/pm/patients/${addMedicationData.id}/medication-requests`, addMedicationData.medication);
    collapseAllTableRowsHandler();
    yield put({ type: changeMedicationSuccess.type });
  } catch (error) {
    yield put({ type: changeMedicationError.type });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Error, message: i18n.t('medications:form.updateFailed') },
    });
  } finally {
    yield put({ type: getMedicationsList.type, payload: discontinueMedicationData.patientId });
  }
}

function* exportMedicationSaga({ payload }: PayloadAction<string>) {
  try {
    const { data, headers }: AxiosResponse<Blob> = yield call(
      API.get,
      `/pm/patients/${payload}/medication-requests/printing`,
      {
        responseType: 'blob',
      },
    );
    const { fileName, fileType } = getFileParamsFromHeaders(headers);
    downloadFile(data, fileName, fileType);
    yield put(exportMedicationFinish());
  } catch (error) {
    console.error(error);
    yield put(exportMedicationFinish());
  }
}

export function* medicationSagaWatcher() {
  yield takeLatest(getMedicationsList.type, getMedicationsSaga);
  yield takeLatest(addMedication.type, addMedicationSaga);
  yield takeLatest(editMedication.type, editMedicationSaga);
  yield takeLatest(deleteMedication.type, deleteMedicationSaga);
  yield takeLatest(discontinueMedication.type, discontinueMedicationSaga);
  yield takeLatest(changeMedication.type, changeMedicationSaga);
  yield takeLatest(exportMedication.type, exportMedicationSaga);
}
