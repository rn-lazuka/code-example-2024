import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  getHospitalizationReportSaga,
  hospitalizationReportsSagaWatcher,
} from '@src/sagas/reports/hospitalizationReportsSaga';
import {
  changeHospitalizationReportsPage,
  changeHospitalizationRowsPerPage,
  getHospitalizationReports,
  getHospitalizationReportsSuccess,
  setHospitalizationChipsCounters,
  setHospitalizationReportsError,
} from '@src/store';
import {
  convertHospitalizationReportDataToTableFormat,
  dateToServerFormat,
  setHospitalizationReasonsBadges,
} from '@utils';
import { HospitalizationReportCountersResponse, HospitalizationResponseContentItem } from '@types';
import { PatientHospitalizationReason } from '@enums';
import { takeLatest } from 'redux-saga/effects';

const storeMock = {
  hospitalizationReports: {
    pagination: { currentPage: 1, perPage: 10 },
    reports: {
      filters: {
        date: new Date(),
        patient: { id: 1, label: 'test' },
        reasons: [
          {
            name: PatientHospitalizationReason.UNKNOWN,
            selected: false,
            badge: null,
          },
          {
            name: PatientHospitalizationReason.VASCULAR_RELATED,
            selected: false,
            badge: null,
          },
          {
            name: PatientHospitalizationReason.NON_HD_RELATED,
            selected: false,
            badge: null,
          },
          {
            name: PatientHospitalizationReason.HD_RELATED,
            selected: false,
            badge: null,
          },
        ],
      },
    },
  },
};

const contentMock: HospitalizationResponseContentItem[] = [
  {
    id: 1,
    date: '01-01-2023',
    clinic: 'test',
    patient: { id: 1, name: 'test' },
    comment: 'test',
    details: 'test',
    reason: PatientHospitalizationReason.HD_RELATED,
    returningDate: '01-01-2023',
  },
];
const paginationMock = {
  pageable: { pageNumber: 1, pageSize: 10 },
  totalElements: 2,
};
const chipsDataMock: HospitalizationReportCountersResponse = {
  unknown: 1,
  hdRelated: 2,
  nonHdRelated: 3,
  vascularRelated: 4,
};
describe('Hospitalization Report Saga Tests', () => {
  describe('getHospitalizationReportSaga', () => {
    it('should fetch hospitalization reports with filters', async () => {
      const { filters } = storeMock.hospitalizationReports.reports;
      const { pagination } = storeMock.hospitalizationReports;
      const filtersToSend = {
        date: dateToServerFormat(filters.date),
        patientId: filters.patient.id,
        reasons: filters.reasons.filter((reasonItem) => reasonItem.selected).map((filteredItem) => filteredItem.name),
      };
      API.post = jest
        .fn()
        .mockResolvedValueOnce({ data: { content: contentMock, ...paginationMock } })
        .mockResolvedValueOnce({ data: chipsDataMock });
      const dispatched: any[] = [];

      await runSagaHandler(dispatched, storeMock, getHospitalizationReportSaga, {
        type: getHospitalizationReports.type,
      });

      expect(API.post).toHaveBeenCalledWith('/pm/reports/hospitalization', filtersToSend, {
        params: { page: pagination.currentPage, size: pagination.perPage },
      });
      expect(API.post).toHaveBeenCalledWith('/pm/reports/hospitalization/counters', filtersToSend);

      expect(dispatched).toEqual([
        {
          type: getHospitalizationReportsSuccess.type,
          payload: {
            content: convertHospitalizationReportDataToTableFormat(contentMock),
            pagination: {
              currentPage: paginationMock.pageable.pageNumber,
              perPage: paginationMock.pageable.pageSize,
              totalCount: paginationMock.totalElements,
            },
          },
        },
        {
          type: setHospitalizationChipsCounters.type,
          payload: setHospitalizationReasonsBadges(chipsDataMock, filters),
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error('Some error message');
      API.post = jest.fn().mockRejectedValueOnce(errorMock);
      const dispatched: any[] = [];

      await runSagaHandler(dispatched, storeMock, getHospitalizationReportSaga, {
        type: getHospitalizationReports.type,
      });

      expect(dispatched).toEqual([
        {
          type: setHospitalizationReportsError.type,
          payload: errorMock.message,
        },
      ]);
    });
  });

  describe('injectionReportsSagaWatcher', () => {
    it('should watch for relevant actions and call getInjectionReportSaga', () => {
      const generator = hospitalizationReportsSagaWatcher();
      expect(generator.next().value).toEqual(
        takeLatest(
          [
            getHospitalizationReports.type,
            changeHospitalizationReportsPage.type,
            changeHospitalizationRowsPerPage.type,
          ],
          getHospitalizationReportSaga,
        ),
      );
    });
  });
});
