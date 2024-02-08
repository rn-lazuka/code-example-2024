import type { RescheduleHdPayload, RescheduleSlaveServicesPayload } from '@store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AddHocEventFormType } from '@types';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { API, dateToServerFormat } from '@utils';
import {
  addSnack,
  getAppointmentServices,
  getAppointmentsList,
  getAppointmentsListSuccess,
  getDayAvailabilitySuccess,
  getDayTasksSuccess,
  getInitPatientScheduleData,
  getIsolationGroupsList,
  getIsolationGroupsListSuccess,
  getPatientActiveHd,
  getPatientActiveHdSuccess,
  getServices,
  getShiftList,
  getShiftListSuccess,
  getTodayPatientsAppointments,
  removeServiceModal,
  rescheduleHdPrescription,
  rescheduleSlaveServices,
  rescheduleSuccess,
  saveAddHocEvent,
  saveAddHocEventSuccess,
  setAppointmentServices,
  setPatientsScheduleError,
  setScheduleDate,
  updateAppointments,
} from '@store/slices';
import { LabTestTypes, ServiceModalName, SnackType, AppointmentEventPlace, AddHocEventTypes } from '@enums';
import i18n from 'i18next';

export function* getShiftListSaga() {
  const { data } = yield call(API.get, 'pm/shifts');
  return data;
}

export function* getIsolationGroupsListSaga() {
  const { data } = yield call(API.get, 'pm/isolation-groups/summary');
  return data;
}

export function* getAppointmentsListSaga() {
  const date = yield select((state) => state.patientsSchedule.scheduleDate);
  const { data } = yield call(API.post, 'pm/appointments/schedules/view', { date: dateToServerFormat(date) });
  return data;
}

function* getDayEvents() {
  const date = yield select((state) => state.patientsSchedule.scheduleDate);
  const { data } = yield call(API.get, `pm/calendar/daily-tasks?date=${dateToServerFormat(date)}`);
  return data;
}

function* getDayAvailabilitySaga() {
  const date = yield select((state) => state.patientsSchedule.scheduleDate);
  const { data } = yield call(API.post, 'pm/appointments/schedules/date/available', {
    date: dateToServerFormat(date),
  });
  return data;
}

export function* getInitPatientScheduleDataSaga() {
  try {
    const [shifts, isolationGroups, appointments, dayTasks, dayAvailability] = yield all([
      call(getShiftListSaga),
      call(getIsolationGroupsListSaga),
      call(getAppointmentsListSaga),
      call(getDayEvents),
      call(getDayAvailabilitySaga),
    ]);
    yield put({ type: getIsolationGroupsListSuccess.type, payload: isolationGroups });
    yield put({ type: getAppointmentsListSuccess.type, payload: appointments });
    yield put({ type: getShiftListSuccess.type, payload: shifts });
    yield put({ type: getDayTasksSuccess.type, payload: dayTasks });
    yield put({ type: getDayAvailabilitySuccess, payload: dayAvailability });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: setPatientsScheduleError.type, payload: error });
    }
  }
}

export function* updateAppointmentsSaga() {
  const [appointments, dayTasks, dayAvailability] = yield all([
    call(getAppointmentsListSaga),
    call(getDayEvents),
    call(getDayAvailabilitySaga),
  ]);
  yield put({ type: getAppointmentsListSuccess.type, payload: appointments });
  yield put({ type: getDayTasksSuccess.type, payload: dayTasks });
  yield put({ type: getDayAvailabilitySuccess, payload: dayAvailability });
}

export function* getAppointmentServicesSaga({ payload: appointmentId }: PayloadAction<number>) {
  try {
    const { data } = yield call(API.get, `pm/appointments/${appointmentId}/services/short`);
    yield put({ type: setAppointmentServices.type, payload: data });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: setPatientsScheduleError.type, payload: error });
    }
  }
}

function* rescheduleHdPrescriptionSaga({
  payload: { appointmentId, place, ...params },
}: PayloadAction<RescheduleHdPayload>) {
  try {
    yield call(API.post, `pm/appointments/${appointmentId}/rescheduling/hd`, params);
    yield put({ type: rescheduleSuccess.type });
    yield put({ type: removeServiceModal.type, payload: ServiceModalName.RescheduleModal });
    if (place === AppointmentEventPlace.Services) {
      yield put({ type: getTodayPatientsAppointments.type });
      yield put({ type: removeServiceModal.type, payload: ServiceModalName.DialysisProcedureModal });
    } else {
      yield put({ type: updateAppointments.type });
    }
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Success, message: i18n.t('dialysis:serviceHasBeenRescheduled') },
    });
  } catch (error) {
    //TODO: handle invalid date error from back
    if (error instanceof Error) {
      yield put({ type: setPatientsScheduleError.type, payload: error });
    }
  }
}

function* rescheduleSlaveServicesSaga({
  payload: { appointmentId, place, ...params },
}: PayloadAction<RescheduleSlaveServicesPayload>) {
  try {
    yield call(API.post, `pm/appointments/${appointmentId}/rescheduling/slave`, params);
    yield put({ type: rescheduleSuccess.type });
    yield put({ type: removeServiceModal.type, payload: ServiceModalName.RescheduleModal });
    if (place === AppointmentEventPlace.Services) {
      yield put({ type: getServices.type, payload: appointmentId });
    } else {
      yield put({ type: updateAppointments.type });
    }
    yield put({
      type: addSnack.type,
      payload: { type: SnackType.Success, message: i18n.t('dialysis:serviceHasBeenRescheduled') },
    });
  } catch (error) {
    //TODO: handle invalid date error from back
    if (error instanceof Error) {
      yield put({ type: setPatientsScheduleError.type, payload: error });
    }
  }
}

function* saveAddHocEventSaga({
  payload: { date, type, patient, shift, laboratory, procedure, specimenType, labTestPatient },
}: PayloadAction<AddHocEventFormType>) {
  try {
    const params = {
      date: dateToServerFormat(date!),
      type,
      patientId: patient?.value,
      shiftId: shift,
      ...(type === AddHocEventTypes.LAB_TEST
        ? {
            urgentLabOrder: {
              type: LabTestTypes.Urgent,
              patientId: labTestPatient?.value,
              labId: laboratory!.value,
              procedureId: procedure!.value,
              specimenType,
            },
          }
        : {}),
    };

    yield call(API.post, 'pm/appointments/schedules', params);

    yield put(removeServiceModal(ServiceModalName.AddHocServicesModal));
    yield put({ type: saveAddHocEventSuccess.type });
    yield put({ type: updateAppointments.type });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: setPatientsScheduleError.type, payload: error });
    }
  }
}
function* getPatientActiveHdSaga({ payload: patientId }: PayloadAction<string>) {
  try {
    const { data } = yield call(API.get, `pm/patients/${patientId}/prescriptions/active/full`);
    yield put({ type: getPatientActiveHdSuccess.type, payload: data });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: setPatientsScheduleError.type, payload: error });
    }
  }
}

export function* patientsScheduleSagaWatcher() {
  yield takeLatest(getShiftList.type, getShiftListSaga);
  yield takeLatest(getIsolationGroupsList.type, getIsolationGroupsListSaga);
  yield takeLatest(getAppointmentsList.type, getAppointmentsListSaga);
  yield takeLatest(getInitPatientScheduleData.type, getInitPatientScheduleDataSaga);
  yield takeLatest([setScheduleDate.type, updateAppointments.type], updateAppointmentsSaga);
  yield takeLatest(getAppointmentServices.type, getAppointmentServicesSaga);
  yield takeLatest(rescheduleHdPrescription.type, rescheduleHdPrescriptionSaga);
  yield takeLatest(rescheduleSlaveServices.type, rescheduleSlaveServicesSaga);
  yield takeLatest(saveAddHocEvent.type, saveAddHocEventSaga);
  yield takeLatest(getPatientActiveHd.type, getPatientActiveHdSaga);
}
