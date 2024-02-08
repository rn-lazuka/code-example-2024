import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { API } from '@utils';
import {
  fetchNotifications,
  fetchNotificationsError,
  fetchNotificationsSuccess,
  markNotificationRead,
  markNotificationReadError,
  markNotificationReadSuccess,
} from '@store/slices';
import type { NotificationsResponse } from '@types';

export function* fetchNotificationsSaga() {
  try {
    const {
      data: { notificationList, unreadNotificationCount },
    }: AxiosResponse<NotificationsResponse> = yield call(API.get, '/pm/notifications/summary');
    yield put(fetchNotificationsSuccess({ notificationList, unreadNotificationCount }));
  } catch (e) {
    yield put({ type: fetchNotificationsError.type, payload: e });
  }
}

export function* markNotificationReadSaga({ payload }: PayloadAction<number>) {
  try {
    yield call(API.put, `/pm/notifications/${payload}/read`, { isRead: true });
    yield put({ type: markNotificationReadSuccess.type, payload });
  } catch (error) {
    if (error instanceof Error) {
      yield put({ type: markNotificationReadError.type, payload: error });
    } else {
      console.error(error);
    }
  }
}

export function* notificationsSagaWatcher() {
  yield takeLatest(fetchNotifications.type, fetchNotificationsSaga);
  yield takeLatest(markNotificationRead.type, markNotificationReadSaga);
}
