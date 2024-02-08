import type { Action } from 'redux';
import { API } from '@utils';
import { runSagaHandler } from '@unit-tests';
import {
  getTodayPatientsAppointments,
  getTodayPatientsAppointmentsError,
  getTodayPatientsAppointmentsSuccess,
  setTodayPatientsStatusesCounters,
  todayPatientInitialState,
} from '@store/slices';
import { filterTodayPatientsSaga } from '@sagas/todayPatientsSaga';
import { dateToServerFormat } from '@utils/dateFormat';
import { convertAppointmentsToTableFormat, setAppointmentsStatusesBadges } from '@utils/converters';

describe('Today Patients Saga tests', () => {
  afterAll(() => jest.clearAllMocks());

  describe('filterTodayPatientsSaga', () => {
    it('should correctly get data from store, fetch data from server and put it into the store, when filters are initial', async () => {
      const responseDataFromCountersCallMock = {
        data: { waitList: 1, inProgress: 2, completed: 3, cancelled: 4 },
      };
      const responseDataFromSearchCallMock = {
        data: { content: [], pageable: { pageNumber: 10, pageSize: 10 }, totalElements: 20 },
      };
      const filterDateMock = new Date();
      API.post = jest
        .fn()
        .mockResolvedValueOnce(responseDataFromSearchCallMock)
        .mockResolvedValueOnce(responseDataFromCountersCallMock);
      const dispatched: Action[] = [];

      await runSagaHandler(
        dispatched,
        {
          todayPatients: {
            filters: todayPatientInitialState.filters,
            filterDate: filterDateMock,
            pagination: todayPatientInitialState.pagination,
          },
        },
        filterTodayPatientsSaga,
        {
          type: getTodayPatientsAppointments.type,
        },
      );

      expect(API.post).toHaveBeenCalledTimes(2);
      expect(API.post).toHaveBeenCalledWith(
        '/pm/appointments/search',
        {
          isolations: [],
          date: dateToServerFormat(filterDateMock),
          status: undefined,
          patientId: undefined,
        },
        { params: { page: 0, size: 50, sort: 'patient.name,id' } },
      );
      expect(API.post).toHaveBeenCalledWith('/pm/appointments/count', {
        isolations: [],
        date: dateToServerFormat(filterDateMock),
      });
      expect(dispatched).toEqual([
        {
          type: getTodayPatientsAppointmentsSuccess.type,
          payload: {
            content: convertAppointmentsToTableFormat(responseDataFromSearchCallMock.data.content),
            pagination: {
              currentPage: responseDataFromSearchCallMock.data.pageable.pageNumber,
              perPage: responseDataFromSearchCallMock.data.pageable.pageSize,
              totalCount: responseDataFromSearchCallMock.data.totalElements,
            },
          },
        },
        {
          type: setTodayPatientsStatusesCounters.type,
          payload: {
            items: setAppointmentsStatusesBadges(
              responseDataFromCountersCallMock.data,
              todayPatientInitialState.filters.statuses.items,
            ),
          },
        },
      ]);
    });

    it('should correctly get data from store, fetch data from server and put it into the store, when filters are selected', async () => {
      const responseDataFromCountersCallMock = {
        data: { waitList: 1, inProgress: 2, completed: 3, cancelled: 4 },
      };
      const responseDataFromSearchCallMock = {
        data: { content: [], pageable: { pageNumber: 10, pageSize: 10 }, totalElements: 20 },
      };
      const filterDateMock = new Date();
      API.post = jest
        .fn()
        .mockResolvedValueOnce(responseDataFromSearchCallMock)
        .mockResolvedValueOnce(responseDataFromCountersCallMock);
      const dispatched: Action[] = [];

      const allSelectedStatuses = todayPatientInitialState.filters.statuses.items.map((item) => ({
        ...item,
        selected: true,
      }));

      await runSagaHandler(
        dispatched,
        {
          todayPatients: {
            filters: {
              patient: { name: 'Test Name', id: '1' },
              isolation: {
                items: todayPatientInitialState.filters.isolation.items.map((item) => ({ ...item, checked: true })),
              },
              statuses: {
                items: allSelectedStatuses,
              },
            },
            filterDate: filterDateMock,
            pagination: todayPatientInitialState.pagination,
          },
        },
        filterTodayPatientsSaga,
        {
          type: getTodayPatientsAppointments.type,
        },
      );

      const isolationFiltersToSend = todayPatientInitialState.filters.isolation.items.map((item) =>
        item.name.toUpperCase(),
      );

      expect(API.post).toHaveBeenCalledTimes(2);
      expect(API.post).toHaveBeenCalledWith(
        '/pm/appointments/search',
        {
          isolations: isolationFiltersToSend,
          date: dateToServerFormat(filterDateMock),
          status: undefined,
          patientId: '1',
        },
        { params: { page: 0, size: 50, sort: 'patient.name,id' } },
      );
      expect(API.post).toHaveBeenCalledWith('/pm/appointments/count', {
        isolations: isolationFiltersToSend,
        date: dateToServerFormat(filterDateMock),
        status: undefined,
        patientId: '1',
      });
      expect(dispatched).toEqual([
        {
          type: getTodayPatientsAppointmentsSuccess.type,
          payload: {
            content: convertAppointmentsToTableFormat(responseDataFromSearchCallMock.data.content),
            pagination: {
              currentPage: responseDataFromSearchCallMock.data.pageable.pageNumber,
              perPage: responseDataFromSearchCallMock.data.pageable.pageSize,
              totalCount: responseDataFromSearchCallMock.data.totalElements,
            },
          },
        },
        {
          type: setTodayPatientsStatusesCounters.type,
          payload: {
            items: setAppointmentsStatusesBadges(responseDataFromCountersCallMock.data, allSelectedStatuses),
          },
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const filterDateMock = new Date();
      const dispatched: Action[] = [];

      await runSagaHandler(
        dispatched,
        {
          todayPatients: {
            filters: todayPatientInitialState.filters,
            filterDate: filterDateMock,
            pagination: todayPatientInitialState.pagination,
          },
        },
        filterTodayPatientsSaga,
        {
          type: getTodayPatientsAppointments.type,
        },
      );

      expect(dispatched).toEqual([{ type: getTodayPatientsAppointmentsError.type }]);
    });
  });
});
