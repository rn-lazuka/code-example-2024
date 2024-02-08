import { screen } from '@testing-library/dom';
import type { VascularAccessFilters, VascularAccessFiltersErrors } from '@types';
import { VascularAccessFilterNames } from '@enums';
import { render } from '@unit-tests';
import { VascularAccessReportsFilters } from '@components/pages/Reports';
import { format } from 'date-fns';
import userEvent from '@testing-library/user-event';
import theme from '@src/styles/theme';
import { store, vascularAccessInitialState } from '@store';
import { getTenantYesterdayDate } from '@utils';
import { act } from 'react-dom/test-utils';

const filtersInitialState = vascularAccessInitialState.reports.filters;

const filtersMock: VascularAccessFilters = {
  date: null,
  accessTypes: filtersInitialState.accessTypes,
  categories: filtersInitialState.categories,
};

const filterErrorMock: VascularAccessFiltersErrors = {
  date: null,
};

const dateFilterId = `${VascularAccessFilterNames.date}DatePicker`;
const generateReportsButtonId = 'generateVascularAccessReportsButtonId';
const clearFiltersButtonId = 'clearVascularAccessReportsButtonId';

describe('VascularAccessReportsFilters', () => {
  const user = userEvent.setup();

  it('should render date filter and check selected date and other filters', () => {
    render(<VascularAccessReportsFilters />, {
      preloadedState: {
        vascularAccessReports: {
          reports: {
            filters: { ...filtersMock, date: getTenantYesterdayDate() },
            filtersError: filterErrorMock,
          },
        },
      },
    });
    expect(screen.getByTestId(dateFilterId)).toBeInTheDocument();
    expect(screen.getByTestId(dateFilterId)).toHaveValue(format(getTenantYesterdayDate(), 'dd/MM/yyyy'));

    [...filtersMock.accessTypes, ...filtersMock.categories].forEach((item) => {
      expect(screen.getByTestId(`${item.name}Id`)).toBeInTheDocument();
    });
  });

  it('should select all access type filters, when click on "Vascular" filter chip', async () => {
    render(<VascularAccessReportsFilters />);

    expect(screen.getByTestId(generateReportsButtonId)).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId(`${filtersMock.accessTypes[0].name}Id`)));

    filtersMock.accessTypes.forEach((item) => {
      expect(screen.getByTestId(`${item.name}Id`)).toHaveStyle(`background-color: ${theme.palette.primary.light}`);
    });
  });

  it('should select all access type filters, when click on "CVC" filter chip', async () => {
    render(<VascularAccessReportsFilters />);

    await act(() => user.click(screen.getByTestId(`${filtersMock.categories[0].name}Id`)));

    filtersMock.categories.forEach((item) => {
      expect(screen.getByTestId(`${item.name}Id`)).toHaveStyle('background-color: #FFD6FF');
    });
  });

  it('should show "Clear filters" button and clear filters, when click on "Clear filters" button', async () => {
    render(<VascularAccessReportsFilters />);

    await act(() => user.click(screen.getByTestId(`${filtersMock.accessTypes[0].name}Id`)));
    expect(screen.getByTestId(clearFiltersButtonId)).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId(clearFiltersButtonId)));
    expect(store.getState().vascularAccessReports.reports.filters).toEqual(filtersInitialState);
  });

  it('should show error', () => {
    render(<VascularAccessReportsFilters />, {
      preloadedState: {
        vascularAccessReports: {
          reports: {
            filters: filtersMock,
            filtersError: {
              date: 'Test error',
            },
          },
          couldGenerateReport: true,
        },
      },
    });

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should automatically set yesterday date when click on "Generate reports" button', async () => {
    render(<VascularAccessReportsFilters />);

    await act(() => user.click(screen.getByTestId(generateReportsButtonId)));

    expect(screen.getByTestId(dateFilterId)).toHaveValue(format(getTenantYesterdayDate(), 'dd/MM/yyyy'));
  });
});
