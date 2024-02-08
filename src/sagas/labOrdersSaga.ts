import type { AxiosResponse } from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  CreateLabTestPayload,
  LabOrderForEditingResponse,
  LabOrdersChipCountersResponse,
  LabOrdersStatusFilter,
  LabOrderSubmitResponse,
  OmitLabTestPayload,
  PerformLabTestPayload,
  RescheduleLabTestPayload,
  RescheduleSlaveLabTestRequest,
  SubmitLabResultFilePayload,
  LabOrdersResponse,
  SubmitManualLabResultsPayload,
} from '@types';
import i18n from 'i18next';
import { endOfDay, startOfDay } from 'date-fns';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { addSnack } from '@store/slices/snackSlice';
import { API, dateToServerFormat, setStatusChipCount } from '@utils';
import {
  addLabOrdersError,
  changeLabOrdersPaginationPage,
  changeLabOrdersPaginationRowsPerPage,
  clearLabOrderFilters,
  createLabOrderSuccess,
  deleteLabResult,
  deleteLabResultSuccess,
  deleteUrgentLabOrder,
  deleteUrgentLabOrderSuccess,
  exportLabOrder,
  exportLabOrders,
  exportLabOrdersFinish,
  getFilteredLabOrdersList,
  getLabTestPlan,
  getLabTestPlanSuccess,
  omitLabTest,
  omitLabTestComplete,
  performLabOrder,
  performLabOrderSuccess,
  printSelectedOrders,
  rescheduleLabTest,
  rescheduleLabTestComplete,
  setFilters,
  setLabOrdersStatusChips,
  setStatusFilters,
  submitLabOrderForm,
  submitLabOrders,
  submitLabOrderSuccess,
  submitLabResultFile,
  submitLabResultFileError,
  submitLabResultFileSuccess,
  submitManualLabResultError,
  submitManualLabResults,
  submitManualLabResultsSuccess,
  updateLabOrdersListSuccess,
} from '@store/slices/labOrdersSlice';
import { addServiceModal, removeServiceModal } from '@store/slices/serviceModalSlice';
import {
  AppointmentEventPlace,
  DrawerType,
  FormType,
  LabOrderEventPlace,
  LabOrdersStatusFilters,
  LabTestTypes,
  OmitLabTestType,
  ServiceModalName,
  SnackType,
} from '@enums';
import { removeDrawer } from '@store/slices/drawerSlice';
import { getFileParamsFromHeaders } from '@utils/getFileParamsFromHeaders';
import { downloadFile } from '@utils/downloadFile';
import { ERROR_CODES } from '@constants/global';
import { getServices, updateAppointments } from '@store/slices';

export function* getLabOrdersListSaga({ type: actionType }: PayloadAction<any>) {
  const setFilterDateWithStartEndDay = (from: Date, to: Date) => ({
    from: from ? startOfDay(from) : null,
    to: to ? endOfDay(to) : null,
  });

  const setFilterDateWithoutTime = (from: Date, to: Date) => ({
    from: from ? dateToServerFormat(from) : null,
    to: to ? dateToServerFormat(to) : null,
  });

  const serviceModalPayload = yield select((state) => state.serviceModal[ServiceModalName.DialysisProcedureModal]);
  const sortBy = yield select((state) => state.labOrders.sortBy);
  const sortDir = yield select((state) => state.labOrders.sortDir);
  const pagination = yield select((state) => state.labOrders.pagination);
  const {
    patient,
    labIds,
    order,
    shifts,
    procedures,
    from,
    to,
    planFrom,
    planTo,
    appointmentFrom,
    appointmentTo,
    appointmentId,
    submissionFrom,
    submissionTo,
    resultFrom,
    resultTo,
    type,
  } = yield select((state) => state.labOrders.filters);
  const statusFilters: LabOrdersStatusFilter[] = yield select((state) => state.labOrders.statusFilters);
  const filteredFilters = {
    appointmentId,
    perform: setFilterDateWithStartEndDay(from, to),
    plan: setFilterDateWithoutTime(planFrom, planTo),
    appointmentDate: setFilterDateWithoutTime(appointmentFrom, appointmentTo),
    submission: setFilterDateWithStartEndDay(submissionFrom, submissionTo),
    result: setFilterDateWithoutTime(resultFrom, resultTo),
    patientId: patient ? patient.id : null,
    orderNumber: order ? order.label : null,
    shifts: shifts?.length ? shifts.map((shift) => shift.value) : null,
    procedureIds: procedures?.length ? procedures.map((procedure) => procedure.value) : null,
    labIds: labIds?.length ? labIds.map(({ value }) => value) : null,
    statuses: statusFilters
      .filter((item) => item.selected && item.name !== LabOrdersStatusFilters.All)
      .map((filter) => filter.name),
    type,
  };

  try {
    const [
      {
        data: { content, ...paginationData },
      },
      { data: chipsCounters },
    ]: [AxiosResponse<LabOrdersResponse>, AxiosResponse<LabOrdersChipCountersResponse>] = yield all([
      call(
        API.post,
        '/pm/lab-orders/search',
        {
          ...filteredFilters,
          ...(serviceModalPayload?.appointmentId ? { appointmentId: serviceModalPayload?.appointmentId } : {}),
        },
        {
          params: {
            page: pagination.currentPage,
            size: pagination.perPage,
            sort: `${sortBy},${sortDir}`,
          },
        },
      ),
      call(API.post, '/pm/lab-orders/count', {
        ...filteredFilters,
        ...(serviceModalPayload?.appointmentId ? { appointmentId: serviceModalPayload?.appointmentId } : {}),
        statuses: [],
      }),
    ]);

    yield put({
      type: updateLabOrdersListSuccess.type,
      payload: {
        content: content,
        pagination: {
          currentPage: paginationData.pageable.pageNumber,
          perPage: paginationData.pageable.pageSize,
          totalCount: paginationData.totalElements,
        },
      },
    });
    if (actionType !== setStatusFilters.type) {
      yield put(
        setLabOrdersStatusChips(
          statusFilters.map((filter) => ({ ...filter, badge: setStatusChipCount(filter.name, chipsCounters) })),
        ),
      );
    }
    yield put(removeDrawer(DrawerType.LabOrdersFilters));
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: addLabOrdersError.type, payload: error });
    } else {
      console.error(error);
    }
  }
}

export function* submitLabOrderSaga({
  payload: { id, type, place, mode, formData },
}: PayloadAction<CreateLabTestPayload>) {
  try {
    if (mode === FormType.Add) {
      yield call(API.post, '/pm/lab-orders', {
        ...formData,
        type,
      });
    } else {
      yield call(API.put, `/pm/lab-orders/${id}`, {
        ...formData,
        type,
      });
    }

    if (type === LabTestTypes.Urgent) {
      yield put(removeServiceModal(ServiceModalName.UrgentLabTest));
    }
    if (type === LabTestTypes.Individual) {
      yield put(removeDrawer(DrawerType.IndividualLabTestPlanForm));
    }
    if (type === LabTestTypes.Quarterly) {
      yield put(removeDrawer(DrawerType.QuarterlyBT));
    }

    if (place === LabOrderEventPlace.Dialysis) {
      const appointmentId = yield select((state) => state.dialysis.appointmentId);
      yield put({ type: getServices.type, payload: appointmentId });
    } else {
      yield put(getFilteredLabOrdersList());
    }
    yield put({ type: createLabOrderSuccess.type });
    yield put({
      type: addSnack.type,
      payload: {
        type: SnackType.Success,
        message: i18n.t(
          mode === FormType.Add ? 'labOrders:forms.creation.hasBeenCreated' : 'labOrders:forms.labOrderUpdate',
        ),
      },
    });
  } catch (error: any) {
    yield put({ type: addLabOrdersError.type, payload: error });
  }
}

export function* performLabOrderSaga({ payload: { orderId, place, formData } }: PayloadAction<PerformLabTestPayload>) {
  try {
    const appointmentId = yield select((state) => state.dialysis.appointmentId);

    const response: AxiosResponse<LabOrderForEditingResponse> = yield call(
      API.post,
      `/pm/lab-orders/${orderId}/perform`,
      { ...formData },
      { headers: { 'multiline-fields': 'comments' } },
    );
    yield put(removeServiceModal(ServiceModalName.PerformLabTest));
    if (place === LabOrderEventPlace.Dialysis) {
      yield put({ type: getServices.type, payload: appointmentId });
    } else {
      yield put(getFilteredLabOrdersList());
    }
    yield put({ type: performLabOrderSuccess.type, payload: response.data });
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Success, message: i18n.t('labOrders:forms.perform.hasBeenPerformed') },
    });
  } catch (error: any) {
    yield put({ type: addLabOrdersError.type, payload: error });
  }
}

export function* labOrdersCrudSuccessSaga({ type }: PayloadAction<{ type: string }>) {
  yield put(getFilteredLabOrdersList());

  yield put({
    type: addSnack.type,
    payload: {
      type: SnackType.Delete,
      message: i18n.t(
        type === deleteLabResultSuccess.type ? 'labOrders:labResultDeleted' : 'labOrders:labOrderDeleted',
      ),
    },
  });
}

function* submitLabOrdersSaga({
  payload: { orderIds, place },
}: PayloadAction<{ orderIds: string[]; place: LabOrderEventPlace }>) {
  const appointmentId = yield select((state) => state.dialysis.appointmentId);

  try {
    const { data }: AxiosResponse<LabOrderSubmitResponse> = yield call(API.post, `/pm/lab-orders/submit`, {
      orderIds,
    });

    if (place === LabOrderEventPlace.Dialysis) {
      yield put({ type: getServices.type, payload: appointmentId });
    } else {
      yield put(getFilteredLabOrdersList());
    }
    yield put({ type: submitLabOrderSuccess.type });
    const allSuccess = data.results.map((result) => result.success);
    const hasError = allSuccess.includes(false);
    yield put({
      type: addSnack.type,
      payload: {
        type: hasError ? SnackType.Error : SnackType.Success,
        message: i18n.t(`labOrders:${hasError ? 'notAllOrderSubmitted' : 'labOrderSubmitted'}`),
        clear: hasError,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: addLabOrdersError.type, payload: error });
      yield put({
        type: addSnack.type,
        payload: { type: SnackType.Error, message: i18n.t('common:systemError') },
      });
    }
  }
}

export function* deleteUrgentLabOrderSaga({
  type,
  payload: { id, place },
}: PayloadAction<{ id: string; place: LabOrderEventPlace }>) {
  const appointmentId = yield select((state) => state.dialysis.appointmentId);
  const isLabOrder = type === deleteUrgentLabOrder.type;

  try {
    const response = yield call(API.delete, `/pm/lab-${isLabOrder ? 'orders' : 'results'}/${id}`);
    if (isLabOrder) {
      yield put({ type: deleteUrgentLabOrderSuccess.type, payload: response.data });
      if (place === LabOrderEventPlace.Dialysis) {
        yield put({ type: getServices.type, payload: appointmentId });
      }
    } else {
      yield put({ type: deleteLabResultSuccess.type });
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: addLabOrdersError.type, payload: error });
    } else {
      console.error(error);
    }
  }
}

function* exportLabOrdersSaga() {
  const { patient, labIds, orderStatus, order, shifts, procedures, from, to, appointmentId } = yield select(
    (state) => state.labOrders.filters,
  );
  const params = {
    appointmentId,
    from: from ? startOfDay(from) : null,
    to: to ? endOfDay(to) : null,
    patientId: patient ? patient.id : null,
    orderNumber: order ? order.label : null,
    shifts: shifts?.length ? shifts.map((shift) => shift.value) : null,
    procedureIds: procedures?.length ? procedures.map((procedure) => procedure.value) : null,
    labIds: labIds?.length ? labIds.map(({ value }) => value) : null,
    statuses: orderStatus?.length ? orderStatus : null,
  };

  try {
    const { data, headers }: AxiosResponse<Blob> = yield call(API.post, '/pm/lab-orders/export', params, {
      responseType: 'blob',
    });
    const { fileName, fileType } = getFileParamsFromHeaders(headers);
    downloadFile(data, fileName, fileType);
    yield put(exportLabOrdersFinish());
  } catch (error) {
    console.error(error);
    yield put(exportLabOrdersFinish());
  }
}

function* exportLabOrderSaga({ payload }: PayloadAction<number>) {
  try {
    const { data, headers }: AxiosResponse<Blob> = yield call(API.get, `/pm/lab-orders/${payload}/printing`, {
      responseType: 'blob',
    });
    const { fileName, fileType } = getFileParamsFromHeaders(headers);
    downloadFile(data, fileName, fileType);
    yield put(exportLabOrdersFinish());
  } catch (error) {
    console.error(error);
    yield put(exportLabOrdersFinish());
  }
}

function* printSelectedOrdersSaga({ payload }: PayloadAction<number[]>) {
  for (const labOrderId of payload) {
    yield put({ type: exportLabOrder.type, payload: labOrderId });
  }
}

function* submitManualLabResultsSaga({
  payload: { isEditing, labOrderId, submitData },
}: PayloadAction<SubmitManualLabResultsPayload>) {
  try {
    yield call(API[isEditing ? 'put' : 'post'], `/pm/lab-results/${labOrderId}`, { ...submitData });
    yield put({ type: submitManualLabResultsSuccess.type });
    yield put(removeServiceModal(ServiceModalName.EnterLabResultModal));
    yield put({
      type: addSnack.type,
      payload: {
        type: SnackType.Success,
        message: i18n.t(`labOrders:forms.manualResultEnter.${isEditing ? 'labResultChanged' : 'labResultAdded'}`),
      },
    });
    yield put(getFilteredLabOrdersList());
  } catch (error: any) {
    if (error?.response?.data.length) {
      for (let err of error.response.data) {
        switch (err?.code) {
          case ERROR_CODES.S3_ANTIVIRUS_ERROR:
            yield put({
              type: addSnack.type,
              payload: { type: SnackType.Error, message: i18n.t('common:fileUpload.hasNotBeenChecked') },
            });
            break;
          case ERROR_CODES.S3_FILE_IS_NOT_FOUND:
            break;
          default:
            yield put({
              type: addSnack.type,
              payload: { type: SnackType.Error, message: i18n.t('common:systemError') },
            });
        }
        yield put({ type: submitManualLabResultError.type, payload: err });
      }
    }
  }
}

function* attachLabResultFileSaga({ payload: { file, labOrderId } }: PayloadAction<SubmitLabResultFilePayload>) {
  try {
    yield call(API.post, `/pm/lab-orders/${labOrderId}/files`, { file });
    yield put({ type: submitLabResultFileSuccess.type });
    yield put(removeServiceModal(ServiceModalName.AttachFileModal));
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Success, message: i18n.t('labOrders:fileAttached') },
    });
    yield put(getFilteredLabOrdersList());
  } catch (error: any) {
    if (error?.response?.data.length) {
      for (let err of error.response.data) {
        switch (err?.code) {
          case ERROR_CODES.S3_ANTIVIRUS_ERROR:
            yield put({
              type: addSnack.type,
              payload: { type: SnackType.Error, message: i18n.t('common:fileUpload.hasNotBeenChecked') },
            });
            break;
          case ERROR_CODES.S3_FILE_IS_NOT_FOUND:
            break;
          default:
            yield put({
              type: addSnack.type,
              payload: { type: SnackType.Error, message: i18n.t('common:systemError') },
            });
        }
        yield put({ type: submitLabResultFileError.type, payload: err });
      }
    }
  }
}

function* getLabTestPlanSaga({ payload }: PayloadAction<string>) {
  try {
    const response = yield call(API.get, `/pm/lab-orders/${payload}`);

    yield put({
      type: getLabTestPlanSuccess.type,
      payload: response.data,
    });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: addLabOrdersError.type, payload: error });
    } else {
      console.error(error);
    }
  }
}

function* rescheduleLabTestSaga({
  payload: { date, labOrderId, appointmentId, place },
}: PayloadAction<RescheduleLabTestPayload>) {
  try {
    const requestData: RescheduleSlaveLabTestRequest = {
      date: dateToServerFormat(date),
      service: { labOrderId },
    };
    yield call(API.post, `pm/appointments/${appointmentId}/rescheduling/slave`, requestData);
    yield put(addSnack({ type: SnackType.Success, message: i18n.t('common:serviceScheduled') }));

    if (place === AppointmentEventPlace.Services) {
      yield put({ type: getServices.type, payload: appointmentId });
    } else {
      yield put({ type: updateAppointments.type });
    }
  } catch (error) {
    console.error(error);
  } finally {
    yield put(rescheduleLabTestComplete());
    yield put(removeServiceModal(ServiceModalName.RescheduleLabTest));
  }
}

function* omitLabTestSaga({
  payload: { type, comment, labOrderId, appointmentId, place },
}: PayloadAction<OmitLabTestPayload>) {
  try {
    yield call(API.post, `/pm/appointments/${appointmentId}/lab-orders/${labOrderId}/resolution`, { type, comment });
    yield put(removeServiceModal(ServiceModalName.OmitLabTest));
    yield put(
      addSnack({
        type: SnackType.Success,
        message: i18n.t(
          `labOrders:${type === OmitLabTestType.RescheduleToNextSession ? 'labTestRescheduled' : 'labTestOmitted'}`,
        ),
      }),
    );

    if (place === AppointmentEventPlace.Services) {
      yield put({ type: getServices.type, payload: appointmentId });
    } else {
      yield put({ type: updateAppointments.type });
    }
  } catch (error: any) {
    if (
      error?.response?.data[0]?.code === ERROR_CODES.NO_APPOINTMENTS ||
      error?.response?.data[0]?.code === ERROR_CODES.NEXT_HD_PRESCRIPTION_CANNOT_BE_FOUND
    ) {
      yield put({
        type: addServiceModal.type,
        payload: {
          name: ServiceModalName.ConfirmModal,
          payload: {
            cancelButton: null,
            confirmButton: i18n.t('common:button.ok'),
            title: i18n.t('common:noScheduledHdSession'),
            text: '',
          },
        },
      });
    }
  } finally {
    yield put(omitLabTestComplete());
  }
}

export function* labOrdersSagaWatcher() {
  yield takeLatest(
    [
      getFilteredLabOrdersList.type,
      setFilters.type,
      setStatusFilters.type,
      clearLabOrderFilters.type,
      changeLabOrdersPaginationPage.type,
      changeLabOrdersPaginationRowsPerPage.type,
    ],
    getLabOrdersListSaga,
  );
  yield takeLatest(submitLabOrderForm.type, submitLabOrderSaga);
  yield takeLatest(submitLabOrders.type, submitLabOrdersSaga);
  yield takeLatest(performLabOrder.type, performLabOrderSaga);
  yield takeLatest([deleteUrgentLabOrder.type, deleteLabResult.type], deleteUrgentLabOrderSaga);
  yield takeLatest([deleteUrgentLabOrderSuccess.type, deleteLabResultSuccess.type], labOrdersCrudSuccessSaga);
  yield takeLatest(exportLabOrders.type, exportLabOrdersSaga);
  yield takeEvery(exportLabOrder.type, exportLabOrderSaga);
  yield takeLatest(printSelectedOrders.type, printSelectedOrdersSaga);
  yield takeLatest(submitManualLabResults.type, submitManualLabResultsSaga);
  yield takeLatest(submitLabResultFile.type, attachLabResultFileSaga);
  yield takeLatest(getLabTestPlan.type, getLabTestPlanSaga);
  yield takeLatest(rescheduleLabTest.type, rescheduleLabTestSaga);
  yield takeLatest(omitLabTest.type, omitLabTestSaga);
}
