import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import type { submitAccessManagementPayload } from '@store/slices/accessManagementSlice';
import {
  submitAccessManagement,
  submitAccessManagementSuccess,
  accessManagementError,
  getAccessManagements,
  getAccessManagementSuccess,
  deleteAccessManagement,
  discontinueAccessManagement,
  exportAccessManagement,
  exportAccessManagementFinish,
} from '@store/slices/accessManagementSlice';
import { addSnack } from '@store/slices/snackSlice';
import i18n from 'i18next';
import { API } from '@utils/api';
import { AccessCategory, SnackType } from '@enums';
import type { AxiosResponse } from 'axios';
import { getFileParamsFromHeaders } from '@utils/getFileParamsFromHeaders';
import { downloadFile } from '@utils/downloadFile';

export function* submitAccessManagementSaga({
  payload: { accessManagement, patientId, hdAccessId },
}: PayloadAction<submitAccessManagementPayload>) {
  try {
    const apiURL = `/pm/patients/${patientId}/hd-accesses${hdAccessId ? '/' + hdAccessId : ''}`;
    yield call(API[hdAccessId ? 'put' : 'post'], apiURL, accessManagement);

    yield put({
      type: submitAccessManagementSuccess.type,
      payload: {},
    });
    yield put({
      type: addSnack.type,
      payload: {
        type: SnackType.Success,
        message: i18n.t(`accessManagement:modal.${hdAccessId ? 'hasBeenModify' : 'hasBeenCreated'}`),
      },
    });
    yield put({ type: getAccessManagements.type, payload: patientId });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: accessManagementError.type, payload: error });
      yield put({
        type: addSnack.type,
        payload: { type: SnackType.Error, message: i18n.t('accessManagement:modal.updateFailed') },
      });
    }
  }
}

export function* getAccessManagementsSaga({ payload: patientId }: PayloadAction<string>) {
  try {
    const response = yield call(API.get, `pm/patients/${patientId}/hd-accesses`);
    const preparedData = response.data.map((access) => ({
      ...access,
      creationDate:
        access.accessCategory === AccessCategory.VascularAccess ? access.creationDate : access.insertionDate,
    }));

    yield put({ type: getAccessManagementSuccess.type, payload: preparedData });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: accessManagementError.type, payload: error });
    }
  }
}

export function* deleteAccessManagementsSaga({
  payload: { hdAccessId, patientId },
}: PayloadAction<{ hdAccessId: string; patientId: string }>) {
  try {
    yield call(API.delete, `pm/patients/${patientId}/hd-accesses/${hdAccessId}`);
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Delete, message: i18n.t(`accessManagement:modal.hasDelete`) },
    });
    yield put({ type: getAccessManagements.type, payload: patientId });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: accessManagementError.type, payload: error });
    }
  }
}

export function* discontinueAccessManagementsSaga({
  payload: { hdAccessId, patientId },
}: PayloadAction<{ hdAccessId: string; patientId: string }>) {
  try {
    yield call(API.post, `pm/patients/${patientId}/hd-accesses/${hdAccessId}/discontinue`);
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Success, message: i18n.t(`accessManagement:modal.hasBeenDiscontinued`) },
    });
    yield put({ type: getAccessManagements.type, payload: patientId });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: accessManagementError.type, payload: error });
    }
  }
}

function* exportAccessManagementsSaga({
  payload: { hdAccessId, patientId },
}: PayloadAction<{ hdAccessId: string; patientId: string }>) {
  try {
    const { data, headers }: AxiosResponse<Blob> = yield call(
      API.get,
      `/pm/patients/${patientId}/hd-accesses/${hdAccessId}/printing`,
      { responseType: 'blob' },
    );
    const { fileName, fileType } = getFileParamsFromHeaders(headers);
    downloadFile(data, fileName, fileType);
    yield put(exportAccessManagementFinish());
  } catch (error) {
    console.error(error);
    yield put(exportAccessManagementFinish());
  }
}

export function* accessManagementSagaWatcher() {
  yield takeLatest(submitAccessManagement.type, submitAccessManagementSaga);
  yield takeLatest(getAccessManagements.type, getAccessManagementsSaga);
  yield takeLatest(deleteAccessManagement.type, deleteAccessManagementsSaga);
  yield takeLatest(discontinueAccessManagement.type, discontinueAccessManagementsSaga);
  yield takeLatest(exportAccessManagement.type, exportAccessManagementsSaga);
}
