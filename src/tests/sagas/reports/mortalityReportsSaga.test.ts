import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  changeMortalityReportPage,
  changeMortalityReportRowsPerPage,
  getMortalityReport,
  getMortalityReportSuccess,
  mortalityReportsInitialState,
  setMortalityReportError,
} from '@src/store';
import { takeLatest } from 'redux-saga/effects';
import { dateToServerFormat } from '@utils';
import { getMortalityReportSaga, mortalityReportsSagaWatcher } from '@sagas/reports/mortalityReportsSaga';

const storeMock = {
  mortalityReports: mortalityReportsInitialState,
};
describe('Mortality Report Saga Tests', () => {
  describe('getMortalityReportSaga', () => {
    it('should fetch mortality reports with filters', async () => {
      const { filters } = storeMock.mortalityReports.reports;
      const { pagination } = storeMock.mortalityReports;
      const filtersToSend = {
        from: filters.fromDate ? dateToServerFormat(filters.fromDate) : null,
        to: filters.toDate ? dateToServerFormat(filters.toDate) : null,
        patientId: filters.patient?.id,
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

      await runSagaHandler(dispatched, storeMock, getMortalityReportSaga, {
        type: getMortalityReport.type,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/reports/mortality', filtersToSend, {
        params: { page: pagination.currentPage, size: pagination.perPage },
      });

      expect(dispatched).toEqual([
        {
          type: getMortalityReportSuccess.type,
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

      await runSagaHandler(dispatched, storeMock, getMortalityReportSaga, {
        type: getMortalityReport.type,
      });

      expect(dispatched).toEqual([
        {
          type: setMortalityReportError.type,
          payload: errorMock.message,
        },
      ]);
    });
  });

  describe('mortalityReportsSagaWatcher', () => {
    it('should watch for relevant actions and call getMortalityReportSaga', () => {
      const generator = mortalityReportsSagaWatcher();
      expect(generator.next().value).toEqual(
        takeLatest(
          [getMortalityReport.type, changeMortalityReportPage.type, changeMortalityReportRowsPerPage.type],
          getMortalityReportSaga,
        ),
      );
    });
  });
});
