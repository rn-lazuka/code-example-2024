import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { StartHdModal } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/StartHdModal';
import userEvent from '@testing-library/user-event';

describe('StartHdModal', () => {
  const user = userEvent.setup();
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render startHd modal', () => {
    render(<StartHdModal open onClose={onClose} />);
    const modal = screen.getByTestId('startHdModal');
    const header = screen.getByTestId('startHdHeader');
    const timePiker = screen.getByTestId('startedAtFormTimePicker');
    const saveButton = screen.getByTestId('saveStartDialysisTimeButton');

    expect(modal).toBeInTheDocument();
    expect(timePiker).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent('buttons.startHd');
    expect(header).toHaveTextContent('buttons.startHd');
  });

  it('should call close function', async () => {
    render(<StartHdModal open onClose={onClose} />, {
      preloadedState: { dialysis: { isSubmitting: true } },
    });
    const cancelButton = screen.getByTestId('closeIcon');

    await act(() => user.click(cancelButton));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
