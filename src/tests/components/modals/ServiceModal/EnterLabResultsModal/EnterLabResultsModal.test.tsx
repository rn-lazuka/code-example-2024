import { render } from '@unit-tests';
import { screen, waitFor } from '@testing-library/dom';
import { ServiceModalName } from '@enums';
import { act } from 'react-dom/test-utils';

const modalPayloadMock = {
  labOrder: {
    id: '1',
    procedureName: 'test',
    number: 1,
    createdAt: '01-01-2023',
    labName: 'test',
    patient: { id: '1', name: test },
    document: { code: 'test', number: '123145' },
  },
  isEditing: false,
};
describe('EnterLabResultsModal', () => {
  it('should render modal with loader', async () => {
    await render(<></>, {
      preloadedState: {
        serviceModal: { [ServiceModalName.EnterLabResultModal]: modalPayloadMock },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId('modals.enterLabResultFullScreenModal')).toBeInTheDocument();
    });
    expect(screen.getByTestId('labResultsLoader')).toBeInTheDocument();
  });

  it('should render modal with form after loading data', async () => {
    await act(() => {
      render(<></>, {
        preloadedState: {
          serviceModal: { [ServiceModalName.EnterLabResultModal]: modalPayloadMock },
          snack: {
            snacks: [],
          },
        },
      });
    });
    expect(screen.getByTestId('modals.enterLabResultFullScreenModal')).toBeInTheDocument();
    expect(screen.getByTestId('cancelPatientStatusFormButton')).toBeInTheDocument();
    expect(screen.getByTestId('submitPatientStatusFormButton')).toBeInTheDocument();
  });
});
