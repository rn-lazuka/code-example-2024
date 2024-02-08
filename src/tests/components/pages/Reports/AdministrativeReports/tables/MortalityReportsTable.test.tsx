import { render } from '@unit-tests';
import type { MortalityReportFilters, MortalityReportsContentItem } from '@types';
import { PatientStatuses } from '@enums';
import { mortalityReportsInitialState } from '@store/slices';
import { MortalityReportsTable } from '@components/pages/Reports';
import { screen } from '@testing-library/dom';
import theme from '@src/styles/theme';
import { getTenantTomorrowDate, getTenantYesterdayDate } from '@utils/getTenantDate';
import { format } from 'date-fns';
import { getGenerateReportDate } from '@unit-tests/fixtures';

const reportsTableDataMock: MortalityReportsContentItem = {
  id: 1,
  patient: { id: 1, name: 'Test Name' },
  deathDate: '11/11/2020',
  comment: 'Test Comment',
  previousStatus: PatientStatuses.Hospitalized,
};

const filtersInitialState = mortalityReportsInitialState.reports.filters;
const filtersErrorInitialState = mortalityReportsInitialState.reports.filtersError;

describe('MortalityReportsTable', () => {
  it('should render empty body with correct styles', () => {
    render(<MortalityReportsTable />);

    const emptyBodyId = screen.getByTestId('richTableEmptyBodyContainer');

    expect(emptyBodyId).toBeInTheDocument();
    expect(emptyBodyId).toHaveStyle(`background-color: ${theme.palette.background.default}`);
  });

  it('should render reports data', () => {
    render(<MortalityReportsTable />, {
      preloadedState: {
        mortalityReports: {
          reports: {
            content: [reportsTableDataMock],
            filters: filtersInitialState,
            filtersErrors: filtersErrorInitialState,
          },
        },
      },
    });
    expect(screen.getByText('reports:table.patientName')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.patient.name)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.deathDate)).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.comment)).toBeInTheDocument();
    expect(screen.getByText(`STATUSES:${reportsTableDataMock.previousStatus}`)).toBeInTheDocument();
  });

  const checkTitle = (filters: MortalityReportFilters, expectedResult: string) => {
    it('should render correct title, due to applied filters', () => {
      render(<MortalityReportsTable />, {
        preloadedState: {
          mortalityReports: { reports: { content: [reportsTableDataMock], filters } },
        },
      });

      expect(screen.getByText(expectedResult)).toBeInTheDocument();
    });
  };

  checkTitle(
    { ...filtersInitialState, fromDate: getTenantYesterdayDate() },
    `mortalityReport ${format(new Date(), 'dd/MM/yyyy')} filters.fromDate ${format(
      getTenantYesterdayDate(),
      'dd/MM/yyyy',
    )} ${getGenerateReportDate()}`,
  );
  checkTitle(
    { ...filtersInitialState, fromDate: getTenantYesterdayDate(), toDate: getTenantTomorrowDate() },
    `mortalityReport ${format(new Date(), 'dd/MM/yyyy')} filters.fromDate ${format(
      getTenantYesterdayDate(),
      'dd/MM/yyyy',
    )} filters.toDate ${format(getTenantTomorrowDate(), 'dd/MM/yyyy')} ${getGenerateReportDate()}`,
  );
});
