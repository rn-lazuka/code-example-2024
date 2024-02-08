import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { FinishHdModal } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/FinishHdModal';
import userEvent from '@testing-library/user-event';

describe('FinishHdModal', () => {
  const user = userEvent.setup();
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render finishHd modal', () => {
    render(<FinishHdModal open onClose={onClose} />);
    const modal = screen.getByTestId('finishHdModal');
    const header = screen.getByTestId('finishHdHeader');
    const timePiker = screen.getByTestId('endsAtFormTimePicker');
    const saveButton = screen.getByTestId('saveFinishDialysisTimeButton');

    expect(modal).toBeInTheDocument();
    expect(timePiker).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent('buttons.finishHd');
    expect(header).toHaveTextContent('buttons.finishHd');
  });

  it('should call close function', async () => {
    render(<FinishHdModal open onClose={onClose} />, {
      preloadedState: { dialysis: { isSubmitting: true } },
    });
    const cancelButton = screen.getByTestId('closeIcon');

    await act(() => user.click(cancelButton));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
