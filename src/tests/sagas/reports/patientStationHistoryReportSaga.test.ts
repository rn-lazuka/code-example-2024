import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  changePatientStationHistoryReportPage,
  changePatientStationHistoryReportRowsPerPage,
  getPatientStationHistoryReport,
  getPatientStationHistoryReportSuccess,
  patientStationHistoryInitialState,
  setPatientStationHistoryReportError,
} from '@src/store';
import { takeLatest } from 'redux-saga/effects';
import {
  getPatientStationHistoryReportSaga,
  patientStationHistoryReportSagaWatcher,
} from '@sagas/reports/patientStationHistoryReportSaga';

const storeMock = {
  patientStationHistoryReport: patientStationHistoryInitialState,
};
describe('Patient Station History Report Saga Tests', () => {
  describe('getPatientStationHistoryReportSaga', () => {
    it('should fetch patient station history reports with filters', async () => {
      const { filters } = storeMock.patientStationHistoryReport.reports;
      const { pagination } = storeMock.patientStationHistoryReport;
      const filtersToSend = {
        from: filters.fromDate,
        to: null,
        patientId: filters.patient?.id,
        locationId: filters.locations?.value,
        startTime: filters.startTime,
        endTime: filters.endTime,
        deviceId: filters.dialysisMachineNumber?.value,
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

      await runSagaHandler(dispatched, storeMock, getPatientStationHistoryReportSaga, {
        type: getPatientStationHistoryReport.type,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/reports/patient-station', filtersToSend, {
        params: { page: pagination.currentPage, size: pagination.perPage },
      });

      expect(dispatched).toEqual([
        {
          type: getPatientStationHistoryReportSuccess.type,
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

      await runSagaHandler(dispatched, storeMock, getPatientStationHistoryReportSaga, {
        type: getPatientStationHistoryReport.type,
      });

      expect(dispatched).toEqual([
        {
          type: setPatientStationHistoryReportError.type,
          payload: errorMock,
        },
      ]);
    });
  });

  describe('patientStationHistoryReportSagaWatcher', () => {
    it('should watch for relevant actions and call getMortalityReportSaga', () => {
      const generator = patientStationHistoryReportSagaWatcher();
      expect(generator.next().value).toEqual(
        takeLatest(
          [
            getPatientStationHistoryReport.type,
            changePatientStationHistoryReportPage.type,
            changePatientStationHistoryReportRowsPerPage.type,
          ],
          getPatientStationHistoryReportSaga,
        ),
      );
    });
  });
});
