import { API } from '@utils/api';
import type { Action } from 'redux';
import { runSagaHandler } from '@unit-tests';
import {
  addStaffManagementError,
  getStaffList,
  getStaffListSuccess,
  getStaffRoles,
  getStaffRolesSuccess,
} from '@store/slices';
import { getStaffListSaga, getStaffRolesSaga } from '@sagas/staffManagementSaga';

const storeMock = {
  staffManagement: {
    pagination: { currentPage: 1, perPage: 30 },
    filters: {
      roles: [],
      user: null,
    },
  },
};
describe('Staff Management Saga Tests', () => {
  describe('getStaffListSaga', () => {
    it('should correctly get vaccinations', async () => {
      const apiResponseMock = { data: { totalElements: 0, content: [] } };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];
      const payloadMock = { roles: [], userId: '' };

      await runSagaHandler(dispatched, storeMock, getStaffListSaga, {
        type: getStaffList.type,
        payload: payloadMock,
      });

      expect(API.post).toHaveBeenCalledWith(`/pm/users/search`, payloadMock, {
        params: {
          page: storeMock.staffManagement.pagination.currentPage,
          size: storeMock.staffManagement.pagination.perPage,
        },
      });
      expect(dispatched).toEqual([
        {
          type: getStaffListSuccess.type,
          payload: apiResponseMock.data,
        },
      ]);
    });
    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = { roles: [], userId: '' };

      await runSagaHandler(dispatched, storeMock, getStaffListSaga, {
        type: getStaffList.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addStaffManagementError.type, payload: new Error() }]);
    });
  });
  describe('getStaffRolesSaga', () => {
    it('should correctly get staff roles', async () => {
      const apiResponseMock = [
        { roleCode: 'role1', count: 5 },
        { roleCode: 'role2', count: 10 },
      ];
      API.post = jest.fn().mockResolvedValue({ data: apiResponseMock });
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, {}, getStaffRolesSaga, {
        type: getStaffRoles.type,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/users/count');
      expect(dispatched).toEqual([
        {
          type: getStaffRolesSuccess.type,
          payload: [
            { name: 'role1', selected: false, badge: 5 },
            { name: 'role2', selected: false, badge: 10 },
          ],
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, null, getStaffRolesSaga, {
        type: getStaffRoles.type,
      });

      expect(dispatched).toEqual([
        {
          type: addStaffManagementError.type,
          payload: new Error(),
        },
      ]);
    });
  });
});
