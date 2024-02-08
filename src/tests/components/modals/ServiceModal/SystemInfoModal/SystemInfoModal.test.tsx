import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { ServiceModalName } from '@enums/components';
import { waitFor } from '@testing-library/react';

const user = {
  id: 1,
  firstName: 'Name',
  lastName: 'Lastname',
  login: 'login',
  organizations: [],
  currentBranchId: 1000,
  currentOrganizationId: 1001,
  roles: [],
  permissions: [],
};

describe('SystemInfoModal', () => {
  it('should render the SystemInfoModal and check that all text is there', async () => {
    await render(<></>, {
      preloadedState: {
        user: {
          user,
        },
        serviceModal: {
          [ServiceModalName.SystemInfoModal]: {},
        },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId('systemInfoModal')).toBeInTheDocument();
    });
    expect(screen.getByText(/productName/i)).toBeInTheDocument();
    expect(screen.getByText(/udipi/i)).toBeInTheDocument();
    expect(screen.getByText(/legalManufacturer/i)).toBeInTheDocument();
  });
});
