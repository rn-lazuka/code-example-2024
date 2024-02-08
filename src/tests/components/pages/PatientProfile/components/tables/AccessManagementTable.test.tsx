import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { AccessManagement } from '@pages/PatientProfile/subPages/AccessManagement/AccessManagement';
import { userFixture } from '@unit-tests/fixtures';
import { accessManagementFixture } from '@unit-tests/fixtures/accessManagement';
import { AccessManagementStatuses } from '@enums';

describe('Access management', () => {
  it('should render table', () => {
    render(<AccessManagement />, {
      preloadedState: {
        user: { user: userFixture() },
        accessManagement: { accessManagement: accessManagementFixture },
      },
    });

    expect(screen.getByText('accessManagement:tableView.accessCategory')).toBeTruthy();
    expect(screen.getByText('accessManagement:tableView.dateOfCreation')).toBeTruthy();
    expect(screen.getByText('accessManagement:tableView.status')).toBeTruthy();
    expect(screen.getByText('accessManagement')).toBeTruthy();

    expect(screen.getByText('ACCESS_CATEGORIES:CVC')).toBeTruthy();
    expect(screen.getByText('28/12/2022')).toBeTruthy();
    expect(screen.getByText('statuses.active')).toBeTruthy();

    expect(screen.getByText('ACCESS_CATEGORIES:VASCULAR_ACCESS')).toBeTruthy();
    expect(screen.getByText('28/12/2022')).toBeTruthy();
    expect(screen.getByText('statuses.discontinued')).toBeTruthy();
  });

  it('should render table without active', () => {
    render(<AccessManagement />, {
      preloadedState: {
        user: { user: userFixture() },
        accessManagement: {
          accessManagement: accessManagementFixture.map((access) => ({
            ...access,
            status: AccessManagementStatuses.DISCONTINUED,
          })),
        },
      },
    });

    expect(screen.getByText('tableView.noActiveAccessManagement')).toBeTruthy();
  });
});
