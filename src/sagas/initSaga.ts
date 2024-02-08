import type { AxiosResponse } from 'axios';
import type { InitData } from '@types';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import { API, setHeaders, setStorageInitData } from '@utils';
import { Headers, SystemModuleName } from '@enums';
import { appInit } from '@store/slices/initSlice';
import { fetchTokenContinuously, fetchTokenContinuouslySuccess, getUserSummary } from '@store/slices/userSlice';
import { getTenantTimeZoneFromStorage } from '@utils/getTenantTimeZoneFromStorage';
import { setTimezone, systemUpdateModuleBuildVersions } from '@store/slices/systemSlice';

function* initSaga() {
  if (!localStorage.initData) {
    try {
      localStorage.removeItem('currentOrganizationId');
      localStorage.removeItem('currentBranchId');

      const scope = 'email+openid+phone';
      const response: AxiosResponse<InitData> = yield call(API.get, '/env');
      const initData = response.data;

      yield put({ type: setTimezone.type, payload: initData?.timeZone ? initData?.timeZone : 'Asia/Singapore' });
      initData.logInUrl = `${initData.authUrl}/login?client_id=${initData.clientId}&response_type=code&scope=${scope}&redirect_uri=${window.location.origin}`;
      initData.logOutUrl = `${initData.authUrl}/logout?client_id=${initData.clientId}&response_type=code&scope=${scope}&redirect_uri=${window.location.origin}`;
      setStorageInitData(initData);
      setHeaders({ [Headers.TenantId]: initData.tenantId });
    } catch (e) {
      // TODO: handle error
      console.error(e);
    }
  } else {
    const timeZone = getTenantTimeZoneFromStorage();
    yield put({ type: setTimezone.type, payload: timeZone });
  }
  yield put(systemUpdateModuleBuildVersions({ [SystemModuleName.Host]: APP_VERSION }));
  yield put({ type: fetchTokenContinuously.type });
  // waiting for the token to be set
  yield take(fetchTokenContinuouslySuccess);
  yield put({ type: getUserSummary.type });
}

export function* initSagaTakeEvery() {
  yield takeLatest(appInit.type, initSaga);
}
