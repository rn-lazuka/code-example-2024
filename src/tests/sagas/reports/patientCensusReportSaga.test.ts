import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  changePatientCensusReportPage,
  changePatientCensusReportRowsPerPage,
  getPatientCensusReport,
  getPatientCensusReportError,
  getPatientCensusReportSuccess,
  patientCensusInitialState,
  setPatientCensusChipsCounters,
} from '@src/store';
import { takeLatest } from 'redux-saga/effects';
import { PatientCensusIsolationFilter } from '@enums';
import { getPatientCensusReportSaga, patientCensusReportsSagaWatcher } from '@sagas/reports/patientCensusReportSaga';
import { PatientCensusFiltersChipsCountersPayload } from '@types';
import { setPatientCensusBadges } from '@src/utils';

const storeMock = {
  patientCensusReport: patientCensusInitialState,
};

const chipsDataMock: PatientCensusFiltersChipsCountersPayload = {
  infection: { normal: 1, hepB: 1, hepC: 1, hiv: 1 },
  therapy: {
    permanent: 1,
    temporaryTransferred: 1,
    hospitalized: 1,
    dead: 1,
    discharged: 1,
    acute: 1,
    visiting: 1,
    walkIn: 1,
  },
};
describe('Patient Census Report Saga Tests', () => {
  describe('patientCensusReportSaga', () => {
    it('should fetch patient census reports with filters', async () => {
      const { filters } = storeMock.patientCensusReport.reports;
      const { pagination } = storeMock.patientCensusReport;
      const filtersToSend = {
        date: null,
        isolations: filters.isolations
          .filter((isolation) => isolation.name !== PatientCensusIsolationFilter.Isolated && isolation.selected)
          .map((isolation) => isolation.name),
        statuses: filters.statuses.filter((status) => status.selected).map((status) => status.name),
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

      await runSagaHandler(dispatched, storeMock, getPatientCensusReportSaga, {
        type: getPatientCensusReport.type,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/reports/patient-census', filtersToSend, {
        params: { page: pagination.currentPage, size: pagination.perPage },
      });
      expect(API.post).toHaveBeenCalledWith('/pm/reports/patient-census/counters', filtersToSend);

      expect(dispatched).toEqual([
        {
          type: getPatientCensusReportSuccess.type,
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
          type: setPatientCensusChipsCounters.type,
          payload: setPatientCensusBadges(chipsDataMock, filters),
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error('Some error');
      API.post = jest.fn().mockRejectedValue(errorMock);
      const dispatched: any[] = [];

      await runSagaHandler(dispatched, storeMock, getPatientCensusReportSaga, {
        type: getPatientCensusReport.type,
      });

      expect(dispatched).toEqual([
        {
          type: getPatientCensusReportError.type,
          payload: errorMock.message,
        },
      ]);
    });
  });

  describe('patientCensusReportsSagaWatcher', () => {
    it('should watch for relevant actions and call getPatientCensusReportSaga', () => {
      const generator = patientCensusReportsSagaWatcher();
      expect(generator.next().value).toEqual(
        takeLatest(
          [getPatientCensusReport.type, changePatientCensusReportPage.type, changePatientCensusReportRowsPerPage.type],
          getPatientCensusReportSaga,
        ),
      );
    });
  });
});
