import { ServiceModalName } from '@enums';
import { getTestStore, render } from '@unit-tests';
import { patientPermanentFixture } from '@unit-tests/fixtures';
import { removeServiceModal } from '@store';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';

describe('ServiceModal', () => {
  it('should render custom modal and rerender after dispatching', async () => {
    const store = getTestStore({
      patient: {
        loading: false,
        error: null,
        patient: patientPermanentFixture(),
      },
      serviceModal: {
        [ServiceModalName.PatientStatusModal]: {
          isHistory: false,
        },
      },
    });
    const { rerender, container } = await act(() =>
      render(<div></div>, {
        store,
      } as any),
    );

    expect(screen.getByTestId('patientStatusModal')).toBeInTheDocument();

    store.dispatch(removeServiceModal(ServiceModalName.PatientStatusModal));

    await act(() => rerender(<></>));
    expect(container).toBeEmptyDOMElement();
  });
});
