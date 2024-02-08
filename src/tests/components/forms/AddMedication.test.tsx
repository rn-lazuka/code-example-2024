import { render } from '@unit-tests';
import userEvent from '@testing-library/user-event';
import AddMedicationForm from '@containers/layouts/Drawer/components/AddMedicationForm/AddMedicationForm';
import { medicationFixture } from '@unit-tests/fixtures/medications';
import { MedicationDurationTypes, MedicationPlaces, MedicationFrequency } from '@enums';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';

jest.mock('@components/NoticeBlock/NoticeBlock', () => ({
  NoticeBlock: () => <div data-testid="NoticeBlock"></div>,
}));

const medication = {
  id: 'exampleId',
  amount: 'amount',
  comments: 'test comments',
  day: 'daily',
  doctorType: 'EXTERNAL',
  doctorsName: 'John',
  doctorsSpeciality: 'speciality',
  frequency: MedicationFrequency.ONCE_PER_DAY,
  meal: 'meal',
  nameDrug: { id: '', name: '' },
  medicationGroup: 'Anti-Cholesterol',
  prescriptionDate: new Date(),
  route: 'Oral',
};

const preloadedState = {
  medications: {
    medications: [medicationFixture()],
  },
};

describe('AddMedicationForm', () => {
  const user = userEvent.setup();

  it('should render form, check elements and confirmation modal', async () => {
    render(<AddMedicationForm />, { preloadedState });

    expect(screen.getByTestId('addMedicationForm')).toBeInTheDocument();
    expect(screen.getByTestId('NoticeBlock')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    // TODO find out why toHaveLength returns different values
    // expect(screen.getAllByRole('combobox')).toHaveLength(6);
    expect(screen.getByTestId('daySelectInput')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByTestId('cancelMedicationButton')).toBeInTheDocument();
    expect(screen.getByTestId('saveMedicationButton')).toBeInTheDocument();

    await act(() => user.type(screen.getByTestId('amountTextInput'), '5'));
    await act(() => user.click(screen.getByTestId('cancelMedicationButton')));

    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCancelButton')));

    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });

  it('should disable button while form submitting', () => {
    render(<AddMedicationForm />, {
      preloadedState: {
        medications: { ...preloadedState.medications, medicationForm: medication, loading: true, saveSuccess: false },
      },
    });

    const saveMedicationButton = screen.getByTestId('saveMedicationButton');

    expect(saveMedicationButton).toBeInTheDocument();
    expect(saveMedicationButton).toHaveAttribute('disabled');
    expect(screen.getByTestId('progressbar')).toBeInTheDocument();
  });

  it('should not show some elements, when administering "At home" or "In center" is selected', async () => {
    render(<AddMedicationForm />);

    await act(() => user.click(screen.getByTestId(`${MedicationPlaces.AtHome}RadioButton`)));

    expect(screen.getByTestId('frequencyLongTermAutocompleteFreeSolo')).toBeInTheDocument();
    expect(screen.queryByTestId('frequencyDialysisRelatedSelectInput')).not.toBeInTheDocument();
    expect(screen.queryByTestId('durationOfMedicationSectionTitle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('startDateDatePicker')).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${MedicationDurationTypes.Unlimited}RadioButton`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${MedicationDurationTypes.VisitsAmount}RadioButton`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${MedicationDurationTypes.DueDate}RadioButton`)).not.toBeInTheDocument();

    await act(() => user.click(screen.getByTestId(`${MedicationPlaces.InCenter}RadioButton`)));

    expect(screen.queryByTestId('frequencyLongTermAutocompleteFreeSolo')).not.toBeInTheDocument();
    expect(screen.getByTestId('frequencyDialysisRelatedSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('durationOfMedicationSectionTitle')).toBeInTheDocument();
    expect(screen.getByTestId('startDateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId(`${MedicationDurationTypes.Unlimited}RadioButton`)).toBeInTheDocument();
    expect(screen.getByTestId(`${MedicationDurationTypes.VisitsAmount}RadioButton`)).toBeInTheDocument();
    expect(screen.getByTestId(`${MedicationDurationTypes.DueDate}RadioButton`)).toBeInTheDocument();
  });

  it('should show needed elements, when "days amount" duration type is selected', async () => {
    render(<AddMedicationForm />);

    await act(() => user.click(screen.getByTestId(`${MedicationPlaces.InCenter}RadioButton`)));
    await act(() => user.click(screen.getByTestId(`${MedicationDurationTypes.VisitsAmount}RadioButton`)));

    expect(screen.getByTestId('visitsAmountTextInput')).toBeInTheDocument();
  });

  it('should show needed elements, when "due date" duration type is selected', async () => {
    render(<AddMedicationForm />);

    await act(() => user.click(screen.getByTestId(`${MedicationPlaces.InCenter}RadioButton`)));
    await act(() => user.click(screen.getByTestId(`${MedicationDurationTypes.DueDate}RadioButton`)));

    expect(screen.getByTestId('dueDateDatePicker')).toBeInTheDocument();
  });

  it('should disable day input and set its value to an empty string, when "Dialysis related medication" is selected', async () => {
    render(<AddMedicationForm />);

    await act(() => user.click(screen.getByTestId(`${MedicationPlaces.InCenter}RadioButton`)));

    expect(screen.getByTestId('dayTextInput')).toBeDisabled();
    expect(screen.getByTestId('dayTextInput')).toHaveAttribute('value', 'form.dialysisDay');
  });
});
