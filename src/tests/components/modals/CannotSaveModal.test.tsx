import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render } from '@unit-tests';
import { CannotSaveModal } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/CannotSaveModal';
import { act } from 'react-dom/test-utils';

describe('CannotSaveModal', () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  it('should render modal if open prop is true', () => {
    render(<CannotSaveModal open={true} onClose={onClose} />);
    expect(screen.getByTestId('errorHdReadingModal')).toBeInTheDocument();
  });

  it('should close modal on close  open prop is true', async () => {
    render(<CannotSaveModal open={true} onClose={onClose} />);
    await act(() => user.click(screen.getByTestId('cannotSaveModalOkButton')));
    await act(() => user.click(screen.getByTestId('cannotSaveModalCloseButton')));
    expect(onClose).toBeCalledTimes(2);
  });
});
