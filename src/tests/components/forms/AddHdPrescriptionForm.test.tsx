import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import AddHdPrescriptionForm from '@containers/layouts/Drawer/components/AddHdPrescriptionForm/AddHdPrescriptionForm';
import { prescriptionFixture } from '@unit-tests/fixtures/prescriptions';
import { act } from 'react-dom/test-utils';

describe('AddHdPrescriptionForm', () => {
  const user = userEvent.setup();

  it('should render form', () => {
    render(<AddHdPrescriptionForm />);

    expect(screen.getByTestId('addHdPrescriptionForm')).toBeInTheDocument();
    expect(screen.getByTestId('addHdPrescriptionFormHeader')).toBeInTheDocument();
  });

  it('should contain control elements', () => {
    render(<AddHdPrescriptionForm />);

    expect(screen.getAllByRole('textbox')).toHaveLength(13);
    expect(screen.getByTestId('cancelHdPrescriptionButton')).toBeInTheDocument();
    expect(screen.getByTestId('prescribedByAutocompleteFreeSoloAsync')).toBeInTheDocument();
    expect(screen.getByTestId('saveHdPrescriptionButton')).toBeInTheDocument();
    expect(screen.getByTestId('prescriptionDateDatePicker')).toBeInTheDocument();
  });

  it('should change comma to dot in input', async () => {
    render(<AddHdPrescriptionForm />);
    const dryWeightField = screen.getByTestId('dryWeightTextInput');

    await act(() => user.clear(dryWeightField));
    await act(() => user.type(dryWeightField, '1,12'));

    expect(dryWeightField).toHaveAttribute('value', '1.12');
  });

  it('should show confirm modal', async () => {
    render(<AddHdPrescriptionForm />);

    await act(() => user.type(screen.getByTestId('dryWeightTextInput'), '123'));
    await act(() => user.click(screen.getByTestId('cancelHdPrescriptionButton')));

    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();
  });

  it('should show and close confirm modal', async () => {
    render(<AddHdPrescriptionForm />);
    const dryWeightField = screen.getByTestId('dryWeightTextInput');

    await act(() => user.type(dryWeightField, '123'));

    const cancelHdPrescriptionButton = screen.getByTestId('cancelHdPrescriptionButton');
    await act(() => user.click(cancelHdPrescriptionButton));

    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCancelButton')));
    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
    const form = screen.getByTestId('addHdPrescriptionForm');
    expect(form).toBeInTheDocument();
  });

  it('should confirm close confirm modal', async () => {
    render(<AddHdPrescriptionForm />);

    await act(() => user.type(screen.getByTestId('dryWeightTextInput'), '123'));
    await act(() => user.click(screen.getByTestId('cancelHdPrescriptionButton')));

    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalConfirmButton')));
    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });

  it('should render set schedule button if data is empty', async () => {
    render(<AddHdPrescriptionForm />);
    expect(screen.getByTestId('setScheduleButton')).toBeInTheDocument();
  });
  // TODO wierd test (fixture is wrong) find out after release
  it('should render edit schedule button if data is not empty', async () => {
    render(<AddHdPrescriptionForm />, {
      preloadedState: {
        hdPrescriptions: {
          hdPrescriptionForm: prescriptionFixture(),
        },
      },
    });
    expect(screen.getByTestId('editScheduleButton')).toBeInTheDocument();
  });
  // TODO wierd test (fixture is wrong) find out after release
  it('should show info from scheduling form', async () => {
    render(<AddHdPrescriptionForm />, {
      preloadedState: {
        hdPrescriptions: {
          hdPrescriptionForm: prescriptionFixture(),
        },
      },
    });

    expect(screen.getByText(/form.frequency/i)).toBeInTheDocument();
    expect(screen.getByText(/ONCE_PER_WEEK/i)).toBeInTheDocument();
    expect(screen.getByText(/form.days/i)).toBeInTheDocument();
    // expect(screen.getByText(/MON - 1st/i)).toBeInTheDocument();
    expect(screen.getByText(/tableView.duration/i)).toBeInTheDocument();
    expect(screen.getByText(/04h 00m/i)).toBeInTheDocument();
    expect(screen.getByText(/form.startDate/i)).toBeInTheDocument();
    expect(screen.getByText(/05\/01\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/form.endDate/i)).toBeInTheDocument();
    expect(screen.getByText(/27\/02\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/form.hdSessions/i)).toBeInTheDocument();
    // expect(screen.getByText(/8/i)).toBeInTheDocument();
  });
});
