import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { NoPermissions } from '@containers/layouts/NoPermissions/NoPermissions';

describe('NoPermission', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render NoPermission component', () => {
    render(<NoPermissions />);

    expect(screen.getByTestId('ContentPasteSearchIcon')).toBeInTheDocument();
    expect(screen.getByText('anyResponsibilities')).toBeTruthy();
    expect(screen.getByTestId('logOutButton')).toBeTruthy();
  });
});
