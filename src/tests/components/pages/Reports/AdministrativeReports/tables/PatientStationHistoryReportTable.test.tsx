import { screen } from '@testing-library/dom';
import { format } from 'date-fns';
import { PatientStationHistoryReportTable } from '@components/pages/Reports';
import theme from '@src/styles/theme';
import { render } from '@unit-tests';
import { PatientHistoryStationIsolations } from '@types';
import type { PatientStationHistoryFilters, PatientStationHistoryReportContentItem } from '@types';
import { PatientStatuses } from '@enums';
import { patientStationHistoryInitialState } from '@store/slices';
import { getTenantTomorrowDate, getTenantYesterdayDate } from '@utils';
import { getGenerateReportDate } from '@unit-tests/fixtures';

const reportMockData: PatientStationHistoryReportContentItem = {
  id: 1,
  patient: {
    id: 1,
    name: 'Test Name',
    status: PatientStatuses.Permanent,
  },
  dialysisDate: '09/10/2022',
  startTime: '2023-04-06T07:28:00.824Z',
  endTime: '2023-04-06T11:28:00.824Z',
  location: {
    id: 1,
    name: 'Bay 03',
  },
  isolation: {
    id: 1,
    name: 'Test Isolation',
    isolations: [PatientHistoryStationIsolations.HEP_B],
  },
  device: {
    id: 1,
    name: 'Device name',
    serialNumber: 'serial number',
  },
};

const filtersInitialState = patientStationHistoryInitialState.reports.filters;
const filtersErrorInitialState = patientStationHistoryInitialState.reports.filtersError;

describe('PatientStationHistoryReportTable', () => {
  it('should render empty body with correct styles', () => {
    render(<PatientStationHistoryReportTable />);

    const emptyBodyId = screen.getByTestId('richTableEmptyBodyContainer');

    expect(emptyBodyId).toBeInTheDocument();
    expect(emptyBodyId).toHaveStyle(`background-color: ${theme.palette.background.default}`);
  });

  it('should render reports data', () => {
    render(<PatientStationHistoryReportTable />, {
      preloadedState: {
        patientStationHistoryReport: {
          reports: { content: [reportMockData], filters: filtersInitialState, filtersError: filtersErrorInitialState },
        },
      },
    });

    expect(screen.getByText('reports:table.patientName')).toBeInTheDocument();
    expect(screen.getByText(reportMockData.patient.name)).toBeInTheDocument();
    expect(screen.getByText(reportMockData.dialysisDate)).toBeInTheDocument();
    expect(screen.getByText(reportMockData.location.name)).toBeInTheDocument();
    expect(screen.getByText(format(new Date(reportMockData.startTime), 'hh:mm a'))).toBeInTheDocument();
    expect(screen.getByText(format(new Date(reportMockData.endTime), 'hh:mm a'))).toBeInTheDocument();
    expect(screen.getByText(reportMockData.isolation.name)).toBeInTheDocument();
  });

  const checkTitle = (filters: PatientStationHistoryFilters, expectedResult: string) => {
    it('should render correct title, due to applied filters', () => {
      render(<PatientStationHistoryReportTable />, {
        preloadedState: {
          patientStationHistoryReport: {
            reports: {
              content: [reportMockData],
              filters,
              filtersError: filtersErrorInitialState,
            },
          },
        },
      });

      expect(screen.getByText(expectedResult)).toBeInTheDocument();
    });
  };

  checkTitle(
    { ...filtersInitialState, fromDate: getTenantYesterdayDate() },
    `patient-station-history-report ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} ${getGenerateReportDate()}`,
  );
  checkTitle(
    { ...filtersInitialState, fromDate: getTenantYesterdayDate(), toDate: getTenantTomorrowDate() },
    `patient-station-history-report ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} ${format(
      getTenantTomorrowDate(),
      'dd/MM/yyyy',
    )} ${getGenerateReportDate()}`,
  );
  checkTitle(
    { ...filtersInitialState, patient: { label: reportMockData.patient.name, id: 1 } },
    `patient-station-history-report ${reportMockData.patient.name} ${getGenerateReportDate()}`,
  );
  checkTitle(
    { ...filtersInitialState, locations: { label: reportMockData.location.name, value: '1' } },
    `patient-station-history-report ${reportMockData.location.name} ${getGenerateReportDate()}`,
  );
  checkTitle(
    { ...filtersInitialState, startTime: getTenantYesterdayDate() },
    `patient-station-history-report ${format(getTenantYesterdayDate(), 'hh:mm aa')} ${getGenerateReportDate()}`,
  );
  checkTitle(
    { ...filtersInitialState, startTime: getTenantYesterdayDate(), endTime: getTenantTomorrowDate() },
    `patient-station-history-report ${format(getTenantYesterdayDate(), 'hh:mm aa')} ${format(
      getTenantTomorrowDate(),
      'hh:mm aa',
    )} ${getGenerateReportDate()}`,
  );
});
