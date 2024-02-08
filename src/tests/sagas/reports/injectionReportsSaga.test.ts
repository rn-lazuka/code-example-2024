import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  changeInjectionReportPage,
  changeInjectionReportRowsPerPage,
  getInjectionReport,
  getInjectionReportSuccess,
  injectionReportsInitialState,
  setInjectionReportError,
} from '@src/store';
import { getInjectionReportSaga, injectionReportsSagaWatcher } from '@src/sagas/reports/injectionReportsSaga';
import { takeLatest } from 'redux-saga/effects';

const storeMock = {
  injectionReports: injectionReportsInitialState,
};
describe('Injection Report Saga Tests', () => {
  describe('getInjectionReportSaga', () => {
    it('should fetch injection reports with filters', async () => {
      const { filters } = storeMock.injectionReports.reports;
      const { pagination } = storeMock.injectionReports;
      const filtersToSend = {
        from: filters.fromDate,
        to: null,
        patientId: filters.patient?.id,
        shiftIds: filters.shifts?.length ? filters.shifts.map((shift) => shift.value) : null,
        medicationUid: undefined,
      };
      const apiResponseMock = {
        data: {
          content: [],
          pageable: {
            pageNumber: pagination.currentPage,
            pageSize: pagination.perPage,
          },
          totalElements: 100,
        },
      };
      API.post = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: any[] = [];

      await runSagaHandler(dispatched, storeMock, getInjectionReportSaga, {
        type: getInjectionReport.type,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/reports/injections', filtersToSend, {
        params: { page: pagination.currentPage, size: pagination.perPage },
      });

      expect(dispatched).toEqual([
        {
          type: getInjectionReportSuccess.type,
          payload: {
            content: apiResponseMock.data.content,
            pagination: {
              currentPage: apiResponseMock.data.pageable.pageNumber,
              perPage: apiResponseMock.data.pageable.pageSize,
              totalCount: apiResponseMock.data.totalElements,
            },
          },
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error('Some error');
      API.post = jest.fn().mockRejectedValue(errorMock);
      const dispatched: any[] = [];

      await runSagaHandler(dispatched, storeMock, getInjectionReportSaga, {
        type: getInjectionReport.type,
      });

      expect(dispatched).toEqual([
        {
          type: setInjectionReportError.type,
          payload: errorMock.message,
        },
      ]);
    });
  });

  describe('injectionReportsSagaWatcher', () => {
    it('should watch for relevant actions and call getInjectionReportSaga', () => {
      const generator = injectionReportsSagaWatcher();
      expect(generator.next().value).toEqual(
        takeLatest(
          [getInjectionReport.type, changeInjectionReportPage.type, changeInjectionReportRowsPerPage.type],
          getInjectionReportSaga,
        ),
      );
    });
  });
});
