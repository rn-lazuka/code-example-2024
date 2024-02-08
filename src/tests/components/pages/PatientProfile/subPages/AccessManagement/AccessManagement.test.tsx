import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { AccessManagement } from '@pages/PatientProfile/subPages/AccessManagement/AccessManagement';
import { userFixture } from '@unit-tests/fixtures';

describe('Access management', () => {
  it('should render empty access page', () => {
    render(<AccessManagement />, {
      preloadedState: { user: { user: userFixture() } },
    });

    expect(screen.getByText('tableView.noActiveAccessManagement')).toBeTruthy();
    expect(screen.getByText('noResultsFound')).toBeTruthy();
    expect(screen.getByTestId('globalAddButtonId')).toBeInTheDocument();
  });
});
