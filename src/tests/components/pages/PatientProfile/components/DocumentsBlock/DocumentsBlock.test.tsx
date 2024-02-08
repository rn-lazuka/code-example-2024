import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { DocumentsBlock } from '@components/pages/PatientProfile';
import { UserPermissions } from '@enums';

const permissions = [UserPermissions.PatientEditProfile, UserPermissions.PatientAddDocuments];

describe('Patient profile documents block', () => {
  it('should render documents block', async () => {
    render(<DocumentsBlock />);
    const documentBlock = screen.getByText('profile.documents');
    expect(documentBlock).toBeTruthy();
  });

  it('user should to be able to edit info if has permission', async () => {
    render(<DocumentsBlock />, {
      preloadedState: { user: { user: { permissions } } },
    });
    const editButton = screen.getByTestId('EditOutlinedIcon');
    expect(editButton).toBeTruthy();
  });

  it('user should not to be able to edit info if has not permission', async () => {
    render(<DocumentsBlock />);
    const editButton = screen.queryByTestId('EditOutlinedIcon');
    expect(editButton).not.toBeTruthy();
  });

  it('user should to be able to add info if has permission', async () => {
    render(<DocumentsBlock />, {
      preloadedState: { user: { user: { permissions } } },
    });
    const addButton = screen.getByText('button.addInfo');
    expect(addButton).toBeTruthy();
  });

  it('user should not to be able to add info if has not permission', async () => {
    render(<DocumentsBlock />);
    const addButton = screen.queryByText('button.addInfo');
    expect(addButton).not.toBeTruthy();
  });
});
