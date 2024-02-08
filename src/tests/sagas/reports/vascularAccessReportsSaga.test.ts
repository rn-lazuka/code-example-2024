import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  changeVascularAccessReportsPage,
  changeVascularAccessReportsRowsPerPage,
  getVascularAccessReports,
  getVascularAccessReportsError,
  getVascularAccessReportsSuccess,
  setVascularAccessChipsCounters,
  vascularAccessInitialState,
} from '@src/store';
import { takeLatest } from 'redux-saga/effects';
import { ChipsCountersSumNames, VascularAccessFilterNames } from '@enums';
import { VascularAccessChipsCountersResponse } from '@types';
import { setVascularAccessReportsFiltersBadges } from '@src/utils';
import {
  getVascularAccessReportsSaga,
  vascularAccessReportsSagaWatcher,
} from '@sagas/reports/vascularAccessReportsSaga';

const storeMock = {
  vascularAccessReports: vascularAccessInitialState,
};

const chipsDataMock: VascularAccessChipsCountersResponse = {
  avf: 1,
  avg: 1,
  permanent: 1,
  temporary: 1,
};
describe('Vascular Access Report Saga Tests', () => {
  describe('getVascularAccessReportsSaga', () => {
    it('should fetch vascular access reports with filters', async () => {
      const { filters } = storeMock.vascularAccessReports.reports;
      const { pagination } = storeMock.vascularAccessReports;
      const filtersToSend = {
        date: null,
        [VascularAccessFilterNames.accessTypes]: filters.accessTypes
          .filter((item) => item.name !== ChipsCountersSumNames.vascular && item.selected)
          .map((filteredItem) => filteredItem.name),
        [VascularAccessFilterNames.categories]: filters.categories
          .filter((item) => item.name !== ChipsCountersSumNames.cvc && item.selected)
          .map((filteredItem) => filteredItem.name),
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
      API.post = jest.fn().mockResolvedValueOnce(apiResponseMock).mockResolvedValueOnce({ data: chipsDataMock });
      const dispatched: any[] = [];

      await runSagaHandler(dispatched, storeMock, getVascularAccessReportsSaga, {
        type: getVascularAccessReports.type,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/reports/vascular-access', filtersToSend, {
        params: { page: pagination.currentPage, size: pagination.perPage },
      });
      expect(API.post).toHaveBeenCalledWith('/pm/reports/vascular-access/counters', filtersToSend);

      expect(dispatched).toEqual([
        {
          type: getVascularAccessReportsSuccess.type,
          payload: {
            content: apiResponseMock.data.content,
            pagination: {
              currentPage: apiResponseMock.data.pageable.pageNumber,
              perPage: apiResponseMock.data.pageable.pageSize,
              totalCount: apiResponseMock.data.totalElements,
            },
          },
        },
        {
          type: setVascularAccessChipsCounters.type,
          payload: setVascularAccessReportsFiltersBadges(chipsDataMock, filters),
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error('Some error');
      API.post = jest.fn().mockRejectedValue(errorMock);
      const dispatched: any[] = [];

      await runSagaHandler(dispatched, storeMock, getVascularAccessReportsSaga, {
        type: getVascularAccessReports.type,
      });

      expect(dispatched).toEqual([
        {
          type: getVascularAccessReportsError.type,
          payload: errorMock.message,
        },
      ]);
    });
  });

  describe('vascularAccessReportsSagaWatcher', () => {
    it('should watch for relevant actions and call getVascularAccessReportsSaga', () => {
      const generator = vascularAccessReportsSagaWatcher();
      expect(generator.next().value).toEqual(
        takeLatest(
          [
            getVascularAccessReports.type,
            changeVascularAccessReportsPage.type,
            changeVascularAccessReportsRowsPerPage.type,
          ],
          getVascularAccessReportsSaga,
        ),
      );
    });
  });
});
