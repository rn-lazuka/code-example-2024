import type { Action } from 'redux';
import { runSagaHandler } from '@unit-tests';
import { API } from '@utils';
import {
  fetchNotifications,
  fetchNotificationsError,
  fetchNotificationsSuccess,
  markNotificationRead,
  markNotificationReadError,
  markNotificationReadSuccess,
} from '@store/slices';
import { fetchNotificationsSaga, markNotificationReadSaga } from '@sagas/notificationsSaga';

describe('Notification Saga Tests', () => {
  describe('fetchNotificationsSaga', () => {
    it('should correctly get notifications', async () => {
      const apiResponseMock = { data: {} };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, fetchNotificationsSaga, {
        type: fetchNotifications.type,
      });

      expect(API.get).toHaveBeenCalledWith('/pm/notifications/summary');
      expect(dispatched).toEqual([
        {
          type: fetchNotificationsSuccess.type,
          payload: apiResponseMock.data,
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.get = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, fetchNotificationsSaga, {
        type: fetchNotifications.type,
      });

      expect(dispatched).toEqual([{ type: fetchNotificationsError.type, payload: new Error() }]);
    });
  });

  describe('markNotificationReadSaga', () => {
    it('should correctly mark notification as read', async () => {
      API.put = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const payloadMock = 1;

      await runSagaHandler(dispatched, {}, markNotificationReadSaga, {
        type: markNotificationRead.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(`/pm/notifications/${payloadMock}/read`, { isRead: true });
      expect(dispatched).toEqual([{ type: markNotificationReadSuccess.type, payload: payloadMock }]);
    });

    it('should correctly handle error', async () => {
      API.put = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, markNotificationReadSaga, {
        type: markNotificationRead.type,
      });
      expect(dispatched).toEqual([{ type: markNotificationReadError.type, payload: new Error() }]);
    });
  });
});
