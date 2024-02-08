import type { Action } from 'redux';
import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import { staffUserFixture } from '@unit-tests/fixtures';
import {
  addSnack,
  addStaffUserError,
  changeStaffUserInfo,
  changeStaffUserInfoSuccess,
  getStaffUserInfo,
  getStaffUserInfoSuccess,
} from '@store/slices';
import { SnackType } from '@enums';
import i18n from 'i18next';
import { changeStaffUserSaga, getStaffUserInfoSaga } from '@sagas/staffUserSaga';

describe('Staff User Saga Tests', () => {
  describe('getStaffUserInfoSaga', () => {
    it('should correctly get staff user info', async () => {
      const apiResponseMock = { data: {} };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];
      const payloadMock = '1';

      await runSagaHandler(dispatched, {}, getStaffUserInfoSaga, {
        type: getStaffUserInfo.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`/pm/users/${payloadMock}`);
      expect(dispatched).toEqual([
        {
          type: getStaffUserInfoSuccess.type,
          payload: apiResponseMock.data,
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.get = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = '1';

      await runSagaHandler(dispatched, {}, getStaffUserInfoSaga, {
        type: getStaffUserInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addStaffUserError.type, payload: new Error() }]);
    });
  });

  describe('changeStaffUserSaga', () => {
    it('should correctly change staff user info', async () => {
      const apiResponseMock = { data: {} };
      API.put = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];
      const payloadMock = { staffUser: staffUserFixture(), id: '1' };

      await runSagaHandler(dispatched, {}, changeStaffUserSaga, {
        type: changeStaffUserInfo.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(`/pm/users/${payloadMock.id}`, payloadMock.staffUser);
      expect(dispatched).toEqual([
        { type: getStaffUserInfo.type, payload: payloadMock.id },
        { type: changeStaffUserInfoSuccess.type, payload: apiResponseMock.data },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('staffManagement:modal.staffUserInfoUpdated') },
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.put = jest.fn().mockRejectedValue({ response: { data: [{ code: '' }] } });
      const dispatched: Action[] = [];
      const payloadMock = { id: '1', vaccination: {} };

      await runSagaHandler(dispatched, {}, changeStaffUserSaga, {
        type: changeStaffUserInfo.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('staffManagement:modal.updateFailed') },
        },
        {
          type: addStaffUserError.type,
          payload: { code: '' },
        },
      ]);
    });
  });
});
