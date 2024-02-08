import { render } from '@unit-tests';
import AddClinicalNoteForm from '@containers/layouts/Drawer/components/AddClinicalNoteForm/AddClinicalNoteForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { ClinicalNoteTypes } from '@enums';
import { act } from 'react-dom/test-utils';

const cancelButtonId = 'cancelClinicalNoteButton';
const saveButtonId = 'saveClinicalNoteButton';
const noteInputId = 'noteTextInput';
const typeInputId = 'typeSelectInput';

describe('AddClinicalNoteForm', () => {
  const user = userEvent.setup();

  it('should display form fields and controls', () => {
    render(<AddClinicalNoteForm />);

    expect(screen.getByTestId(typeInputId)).toBeInTheDocument();
    expect(screen.getByTestId(noteInputId)).toBeInTheDocument();
    expect(screen.getByTestId(cancelButtonId)).toBeInTheDocument();
    expect(screen.getByTestId(saveButtonId)).toBeInTheDocument();
  });

  it('should have default selected value in field "type"', () => {
    render(<AddClinicalNoteForm />, {
      preloadedState: {
        clinicalNotes: {
          selectedClinicalNoteType: ClinicalNoteTypes.Issue,
          availableClinicalNoteTypes: [{ label: 'Issue', value: ClinicalNoteTypes.Issue }],
        },
      },
    });

    expect(screen.getByTestId(typeInputId)).toHaveValue(ClinicalNoteTypes.Issue);
  });

  it.skip('should validate "note" field on latin letters', async () => {
    render(<AddClinicalNoteForm />);
    const noteInput = screen.getByTestId(noteInputId);

    await act(() => user.type(noteInput, 'тест'));
    await act(() => user.click(screen.getByTestId(saveButtonId)));

    expect(screen.getByText('common:validation.latinLettersNumbersAndSymbols')).toBeInTheDocument();
  });

  it('should show "confirm modal", when user tried to cancel form insertions', async () => {
    render(<AddClinicalNoteForm />, { preloadedState: { serviceModal: {} } });
    const noteInput = screen.getByTestId(noteInputId);

    await act(() => user.type(noteInput, 'test'));
    await act(() => user.click(screen.getByTestId(cancelButtonId)));

    expect(screen.getByTestId('confirmModalCloseButton')).toBeInTheDocument();
  });
});
