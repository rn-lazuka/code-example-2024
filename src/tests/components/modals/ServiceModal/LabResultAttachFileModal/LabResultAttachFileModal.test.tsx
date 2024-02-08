import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { getTestStore, getTestStoreAndDispatch, render } from '@unit-tests/_utils';
import { act } from 'react-dom/test-utils';
import { ServiceModalName } from '@enums';
import { submitLabResultFile } from '@store';

describe('LabResultAttachFileModal', () => {
  const user = userEvent.setup();
  const labOrderId = 100500;
  const file = new File(['hello'], 'hello.png', { type: 'image/png' });

  it('should render modal and check all nested components', async () => {
    const modalData = {
      labOrderId,
    };
    const store = getTestStore({
      serviceModal: { [ServiceModalName.AttachFileModal]: modalData },
    });

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    expect(screen.getByTestId('infoModal')).toBeInTheDocument();
    expect(screen.getByTestId('LabResultAttachFileModalCancelButton')).toBeInTheDocument();
    expect(screen.getByTestId('LabResultAttachFileModalSubmitButton')).toBeInTheDocument();
    expect(screen.getByText('modals.attachFile')).toBeInTheDocument();
    expect(screen.getByTestId('fileInput')).toBeInTheDocument();
  });

  it('should render modal, upload the file and submit', async () => {
    const modalData = {
      labOrderId,
    };
    const { store, dispatch } = getTestStoreAndDispatch({
      serviceModal: { [ServiceModalName.AttachFileModal]: modalData },
    });

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    await act(() => user.upload(screen.getByTestId('fileInput'), file));
    dispatch.mockReset();
    await act(() => user.click(screen.getByTestId('LabResultAttachFileModalSubmitButton')));

    expect(dispatch).toHaveBeenCalledWith(submitLabResultFile(expect.any(Object)));
  });
});
