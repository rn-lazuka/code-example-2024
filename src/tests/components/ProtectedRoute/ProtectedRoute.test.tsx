import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { ProtectedRoute } from '@components';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
  }),
}));

describe('ProtectedRoute', () => {
  it('should render the allowed path', () => {
    render(
      <>
        <ProtectedRoute isAllowed>
          <div data-testid="test" />
        </ProtectedRoute>
      </>,
    );
    expect(screen.queryByTestId('test')).toBeInTheDocument();
  });
});
