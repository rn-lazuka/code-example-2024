import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { getTestStoreAndDispatch, render } from '@unit-tests/_utils';
import { act } from 'react-dom/test-utils';
import { AddDialyzerModalPlace, ServiceModalName } from '@enums';
import { submitDialyzerForm } from '@store';

jest.mock('@components/modals/ServiceModal/components/AddDialyzerModal/AddDialyzerForm', () => ({
  AddDialyzerForm: () => <div data-testid="AddDialyzerForm"></div>,
}));

describe('AddDialyzerModal', () => {
  const user = userEvent.setup();
  const patientId = 100500;
  const formValue = undefined;

  it('should render modal in add mode and check all nested components', async () => {
    const modalData = {
      place: AddDialyzerModalPlace.HD_PRESCRIPTION_FORM,
      patientId,
      formValue,
    };
    const { store, dispatch } = getTestStoreAndDispatch({
      serviceModal: { [ServiceModalName.AddDialyzerModal]: modalData },
    });

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    expect(screen.getByTestId('addDialyzisModal')).toBeInTheDocument();
    expect(screen.getByTestId('AddDialyzerForm')).toBeInTheDocument();
    expect(screen.queryByTestId('noticeBlock')).not.toBeInTheDocument();
    expect(screen.getByTestId('closeIcon')).toBeInTheDocument();
    expect(screen.getByTestId('addDialyzerModalCancelButton')).toBeInTheDocument();
    expect(screen.getByTestId('addDialyzerModalSaveButton')).toBeInTheDocument();
    expect(screen.getByText('addNewDialyzer')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('addDialyzerModalSaveButton')));
    expect(dispatch).toBeCalledWith(submitDialyzerForm(expect.any(Object)));
  });

  it('should render modal in edit mode in PRE_HD_STEP environment and check the difference', async () => {
    const modalData = {
      place: AddDialyzerModalPlace.PRE_HD_STEP,
      patientId,
      formValue,
    };
    const { store, dispatch } = getTestStoreAndDispatch({
      serviceModal: { [ServiceModalName.AddDialyzerModal]: modalData },
    });

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    expect(screen.getByTestId('noticeBlock')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('addDialyzerModalSaveButton')));
    expect(dispatch).toBeCalledWith(submitDialyzerForm(expect.any(Object)));
  });
});
