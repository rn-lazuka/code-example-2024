import { screen } from '@testing-library/dom';
import theme from '@src/styles/theme';
import { InjectionHistoryReportTable } from '@components/pages/Reports';
import { PatientDocumentType } from '@enums';
import type { InjectionReportFilters, InjectionReportsContentItem } from '@types';
import { injectionReportsInitialState } from '@store/slices';
import { render } from '@unit-tests';
import { getTenantDate, getTenantYesterdayDate } from '@utils/getTenantDate';
import { format } from 'date-fns';
import { getGenerateReportDate } from '@unit-tests/fixtures';

const reportsTableDataMock: InjectionReportsContentItem = {
  id: 1,
  patient: {
    id: 1,
    name: 'Test name',
    document: { number: '12321312', type: PatientDocumentType.NRIC },
  },
  administeredAt: '2023-02-23T10:00:00.000Z',
  injection: { id: 44, name: 'Heparin 20', amount: 3 },
  shiftName: '1st',
};

const filtersInitialState = injectionReportsInitialState.reports.filters;
const filtersErrorInitialState = injectionReportsInitialState.reports.filtersError;

const customFilters: InjectionReportFilters = {
  fromDate: getTenantYesterdayDate(),
  toDate: getTenantDate(),
  injection: 'Heparin 20',
  patient: { id: 2, label: 'Test patient' },
  shifts: [{ label: '1st', value: '1st' }],
};

describe('InjectionHistoryReportTable', () => {
  it('should render empty body with correct styles', () => {
    render(<InjectionHistoryReportTable />);
    const emptyBodyId = screen.getByTestId('richTableEmptyBodyContainer');

    expect(emptyBodyId).toBeInTheDocument();
    expect(emptyBodyId).toHaveStyle(`background-color: ${theme.palette.background.default}`);
  });

  it('should render reports data', () => {
    render(<InjectionHistoryReportTable />, {
      preloadedState: {
        injectionReports: {
          reports: {
            content: [reportsTableDataMock],
            filters: filtersInitialState,
            filtersError: filtersErrorInitialState,
          },
        },
      },
    });
    expect(screen.getByText('reports:table.patientName')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.patient.name)).toBeInTheDocument();
  });

  const checkTitle = (filters: InjectionReportFilters, expectedResult: string) => {
    it('should render correct title, due to applied filters', () => {
      render(<InjectionHistoryReportTable />, {
        preloadedState: {
          injectionReports: {
            reports: {
              content: [reportsTableDataMock],
              filters: { ...filters },
              filtersError: filtersErrorInitialState,
            },
          },
        },
      });
      expect(screen.getByText(expectedResult)).toBeInTheDocument();
    });
  };

  checkTitle(
    { ...filtersInitialState, fromDate: getTenantYesterdayDate(), toDate: getTenantDate() },
    `injectionHistory ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} ${format(
      getTenantDate(),
      'dd/MM/yyyy',
    )} ${getGenerateReportDate()}`,
  );
  checkTitle(
    {
      ...filtersInitialState,
      ...customFilters,
    },
    `injectionHistory ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} ${format(getTenantDate(), 'dd/MM/yyyy')} ${
      customFilters.injection
    } ${customFilters.patient?.label} ${customFilters.shifts
      .map((shift) => shift.label)
      .join('_')} ${getGenerateReportDate()}`,
  );
});
