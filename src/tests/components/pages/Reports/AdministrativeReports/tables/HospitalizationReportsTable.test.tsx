import type { HospitalizationReportFilters, HospitalizationResponseContentItem } from '@types';
import { PatientHospitalizationReason } from '@enums';
import { hospitalizationReportsInitialState } from '@store/slices';
import { render } from '@unit-tests';
import { HospitalizationReportsTable } from '@components/pages/Reports';
import { screen } from '@testing-library/dom';
import theme from '@src/styles/theme';
import { getTenantYesterdayDate } from '@utils/getTenantDate';
import { format } from 'date-fns';
import { getGenerateReportDate } from '@unit-tests/fixtures';

const reportsTableDataMock: HospitalizationResponseContentItem = {
  id: 1,
  patient: { id: 1, name: 'Test Name' },
  date: '05/06/2022',
  returningDate: '09/10/2022',
  reason: PatientHospitalizationReason.HD_RELATED,
  details: 'Test Details',
  clinic: 'Test Clinic',
  comment: 'Test comment',
};

const filtersInitialState = hospitalizationReportsInitialState.reports.filters;
const filtersErrorsInitialState = hospitalizationReportsInitialState.reports.filtersErrors;

describe('HospitalizationReportsTable', () => {
  it('should render empty body with correct styles', () => {
    render(<HospitalizationReportsTable />);

    const emptyBodyId = screen.getByTestId('richTableEmptyBodyContainer');

    expect(emptyBodyId).toBeInTheDocument();
    expect(emptyBodyId).toHaveStyle(`background-color: ${theme.palette.background.default}`);
  });

  it('should render reports data', () => {
    render(<HospitalizationReportsTable />, {
      preloadedState: {
        hospitalizationReports: {
          reports: {
            content: [reportsTableDataMock],
            filters: filtersInitialState,
            filtersErrors: filtersErrorsInitialState,
          },
        },
      },
    });

    expect(screen.getByText('reports:table.patientName')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.patient.name)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.date)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.returningDate)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.reason)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.details)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.clinic)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.comment)).toBeInTheDocument();
  });

  const checkTitle = (filters: HospitalizationReportFilters, expectedResult: string) => {
    it('should render correct title, due to applied filters', () => {
      render(<HospitalizationReportsTable />, {
        preloadedState: {
          hospitalizationReports: {
            reports: { content: [reportsTableDataMock], filters, filtersErrors: filtersErrorsInitialState },
          },
        },
      });

      expect(screen.getByText(expectedResult)).toBeInTheDocument();
    });
  };

  checkTitle(
    { ...filtersInitialState, date: getTenantYesterdayDate() },
    `hospitalizationReport ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} ${getGenerateReportDate()}`,
  );
  checkTitle(
    {
      ...filtersInitialState,
      date: getTenantYesterdayDate(),
      reasons: filtersInitialState.reasons.map((reason) => ({ ...reason, selected: true })),
    },
    `hospitalizationReport ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} filters.${
      PatientHospitalizationReason.HD_RELATED
    }_filters.${PatientHospitalizationReason.NON_HD_RELATED}_filters.${
      PatientHospitalizationReason.VASCULAR_RELATED
    }_filters.${PatientHospitalizationReason.UNKNOWN} ${getGenerateReportDate()}`,
  );
});
