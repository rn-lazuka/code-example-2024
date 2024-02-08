import { render } from '@unit-tests';
import { ReportsLayout } from '@containers/layouts/Reports/ReportsLayout';
import theme from '@src/styles/theme';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ROUTES } from '@constants/global';
import { act } from 'react-dom/test-utils';

const mainContainerId = 'reportsLayoutMainContentContainer';
const goBackButtonId = 'reportsLayoutNavigateToBackButton';

const mockedNavigation = jest.fn();

let mockReportParameter = '';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockReportParameter }),
  useNavigate: () => mockedNavigation,
}));

describe('ReportsLayout', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('ReportsLayout all reports page', () => {
    it('should apply correct background-color on main container', () => {
      render(<ReportsLayout />);
      expect(screen.getByTestId(mainContainerId)).toHaveStyle(`background-color: ${theme.palette.background.default}`);
    });

    it('should not display back arrow icon button', () => {
      render(<ReportsLayout />);
      expect(screen.queryByTestId(goBackButtonId)).not.toBeInTheDocument();
    });

    it('should render correct title', () => {
      render(<ReportsLayout />);
      expect(screen.getByText('allReports')).toBeTruthy();
    });
  });

  describe('ReportsLayout report page', () => {
    const user = userEvent.setup();

    beforeAll(() => {
      mockReportParameter = 'vascular-access';
    });

    // TODO find out why color is different
    it.skip('should apply correct background-color on main container', () => {
      render(<ReportsLayout />);
      expect(screen.getByTestId(mainContainerId)).toHaveStyle(`background-color: ${theme.palette.surface.default}`);
    });

    // TODO find out why reportsLayoutNavigateToBackButton is not exist
    it.skip('should display back arrow icon button, and navigate when click on it and render the correct title', async () => {
      render(<ReportsLayout />);
      const backButton = screen.getByTestId(goBackButtonId);

      expect(backButton).toBeInTheDocument();

      await act(() => user.click(backButton));

      expect(mockedNavigation).toHaveBeenCalledWith(`/${ROUTES.reports}`);
      expect(screen.getByText('vascular-access')).toBeTruthy();
    });
  });
});
