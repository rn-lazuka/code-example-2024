import type { PayloadAction } from '@reduxjs/toolkit';
import type { WithDrawerType, DrawerFullPartial, DrawerWithOptionalStatuses } from '@types';
import { delay, put, takeLatest } from 'redux-saga/effects';
import {
  addDrawer,
  addDrawerSuccess,
  collapseAllDrawers,
  expandAllDrawers,
  removeDrawer,
  removeDrawerSuccess,
  updateDrawer,
} from '@store/slices/drawerSlice';
import { DrawerType, DrawerStatus } from '@enums';

export function* addDrawerSaga({
  payload: { type },
}: PayloadAction<WithDrawerType<Partial<DrawerWithOptionalStatuses>>>) {
  yield delay(100);
  yield put(addDrawerSuccess(type));
}

export function* updateDrawerSaga({ payload: { status } }: PayloadAction<WithDrawerType<DrawerFullPartial>>) {
  if (status === DrawerStatus.Collapsed) {
    yield put(collapseAllDrawers());
  }
  if (status === DrawerStatus.Showed) {
    yield put(expandAllDrawers());
  }
}

export function* removeDrawerSaga({ payload: type }: PayloadAction<DrawerType>) {
  yield delay(300);
  yield put(removeDrawerSuccess(type));
}

export function* drawerSagaWatcher() {
  yield takeLatest(addDrawer.type, addDrawerSaga);
  yield takeLatest(removeDrawer.type, removeDrawerSaga);
  yield takeLatest(updateDrawer.type, updateDrawerSaga);
}
