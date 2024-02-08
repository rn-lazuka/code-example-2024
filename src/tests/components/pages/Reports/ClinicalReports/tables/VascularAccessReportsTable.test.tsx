import { screen } from '@testing-library/dom';
import theme from '@src/styles/theme';
import { format } from 'date-fns';
import { render } from '@unit-tests';
import { VascularAccessReportsTable } from '@components/pages/Reports';
import {
  AccessCategory,
  AccessSide,
  CvcTimeCategory,
  Instillation,
  NeedleSize,
  NeedleType,
  VascularAccessType,
} from '@enums';
import type { VascularAccessReportsTableItem, VascularAccessFilters } from '@types';
import { vascularAccessInitialState } from '@store/slices/reports/vascularAccessReportsSlice';
import { getTenantYesterdayDate } from '@utils';
import { getGenerateReportDate } from '@unit-tests/fixtures';

const reportsTableDataMock: VascularAccessReportsTableItem = {
  id: 1,
  patient: {
    id: 1,
    name: 'Test name',
  },
  category: AccessCategory.CVC,
  vaType: VascularAccessType.AVF,
  cvcCategory: CvcTimeCategory.Permanent,
  side: AccessSide.Left,
  vaNeedleType: NeedleType.BluntAVF,
  vaNeedleSizeA: NeedleSize.Gauge14,
  vaNeedleSizeV: NeedleSize.Gauge14,
  cvcInstillation: Instillation.Heparin,
  vaCreationDate: '2022-12-23',
  vaCreationPerson: 'Test doctor',
  vaCreatedPlace: 'Test place',
  comments: 'Test comment',
};

const filtersInitialState = vascularAccessInitialState.reports.filters;
const filtersErrorInitialState = vascularAccessInitialState.reports.filtersError;

describe('VascularAccessReportsTable', () => {
  it('should render empty body with correct styles', () => {
    render(<VascularAccessReportsTable />);
    const emptyBodyId = screen.getByTestId('richTableEmptyBodyContainer');

    expect(emptyBodyId).toBeInTheDocument();
    expect(emptyBodyId).toHaveStyle(`background-color: ${theme.palette.background.default}`);
  });

  it('should render reports data', () => {
    render(<VascularAccessReportsTable />, {
      preloadedState: {
        vascularAccessReports: {
          reports: {
            content: [reportsTableDataMock],
            filters: filtersInitialState,
            filtersError: filtersErrorInitialState,
          },
        },
      },
    });

    expect(screen.getByText('vascularAccessReports:tableView.patientName')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.patient.name)).toBeInTheDocument();
  });

  const checkTitle = (filters: VascularAccessFilters, expectedResult: string) => {
    it('should render correct title, due to applied filters', () => {
      render(<VascularAccessReportsTable />, {
        preloadedState: {
          vascularAccessReports: {
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
    { ...filtersInitialState, date: getTenantYesterdayDate() },
    `vascularAccessReport ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} ${getGenerateReportDate()}`,
  );
  checkTitle(
    {
      ...filtersInitialState,
      date: getTenantYesterdayDate(),
      accessTypes: filtersInitialState.accessTypes.map((item) => ({ ...item, selected: true })),
      categories: filtersInitialState.categories.map((item) => ({ ...item, selected: true })),
    },
    `vascularAccessReport ${format(
      getTenantYesterdayDate(),
      'dd/MM/yyyy',
    )} filters.Vascular filters.AVF filters.AVG filters.CVC filters.PERMANENT filters.TEMPORARY ${getGenerateReportDate()}`,
  );
});
