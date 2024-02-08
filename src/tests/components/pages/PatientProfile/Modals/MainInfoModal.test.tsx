import userEvent from '@testing-library/user-event';
import { MainInfoModal } from '@components/pages/PatientProfile';
import { render } from '@unit-tests';
import { PatientStatuses } from '@enums';
import { screen } from '@testing-library/dom';
import { patientPermanentFixture } from '@unit-tests/fixtures';
import { act } from 'react-dom/test-utils';

const patient = {
  id: 'exampleId',
  name: 'Chuck Norris',
  status: PatientStatuses.Permanent,
  document: {
    type: 'NRIC',
    number: 'S1315906H',
  },
  dateBirth: '2022-08-01',
  gender: { code: 'male', extValue: 'my own gender' },
  educationLevel: 'nil',
  occupation: '1001',
  race: 'british',
  nationality: 'australian',
  language: {
    code: 'en',
    extValue: 'my own language',
  },
  religion: '1007',
  phone: {
    number: '60457812',
    countryCode: '+65',
  },
  address: {
    houseFlat: '842',
    street: 'Toa Payoh Lorong',
    city: 'Singapure',
    countryIso: 'SG',
    postalCode: 319319,
  },
  comment: 'Absolutely healthy',
};

describe('MainInfoModal', () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  const TestComponent = (props) => {
    return <MainInfoModal isOpen={true} onClose={onClose} {...props} />;
  };

  const renderTestComponent = (props = {}, patientData = {}) => {
    return render(<TestComponent {...props} />, {
      preloadedState: {
        patient: {
          loading: false,
          errors: [],
          saveSuccess: false,
          patient: {
            ...patientPermanentFixture(),
            ...patientData,
          },
          patientIsolation: undefined,
          statusesHistory: [],
        },
      },
    });
  };

  it('should render modal if isOpen prop is true', () => {
    renderTestComponent();
    expect(screen.getByTestId('profile.mainInfoFullScreenModal')).toBeInTheDocument();
    expect(screen.getAllByText('profile.mainInfo').length).toBe(2);
    expect(screen.getByText(/modal.additionalComments/i)).toBeInTheDocument();
  });

  it('should be unmounted if isOpen false', () => {
    renderTestComponent({ isOpen: false });
    expect(screen.queryByTestId('profile.mainInfoFullScreenModal')).not.toBeInTheDocument();
  });

  it('should show actual status and document type of patient', async () => {
    renderTestComponent();

    const nricRadioButton = screen.getByLabelText('NRICRadioButton');
    expect(screen.getByLabelText('NRICRadioButton')).toBeInTheDocument();
    expect(nricRadioButton).toBeChecked();

    const passportRadioButton = screen.getByLabelText('PASSPORTRadioButton') as HTMLInputElement;
    await act(() => user.click(passportRadioButton));
    expect(passportRadioButton).toBeChecked();
  });

  it('should be closed on press cancel or close button', async () => {
    render(<MainInfoModal isOpen={true} onClose={onClose} />);

    await act(() => user.click(screen.getByTestId('cancelMainInfoModalButton')));
    await act(() => user.click(screen.getByTestId('closeModalButton')));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('should show confirm modal after changing data and press cancel', async () => {
    renderTestComponent({}, patient);
    const nameInput = screen.getByTestId('nameTextInput') as HTMLInputElement;
    expect(nameInput).toBeTruthy();
    expect(nameInput.value).toBe('Chuck Norris');
    await act(() => user.clear(nameInput));
    await act(() => user.type(nameInput, 'Pedro'));
    expect(nameInput.value).toBe('Pedro');

    const cancelMainInfoModalButton = screen.getByTestId('cancelMainInfoModalButton');
    await act(() => user.click(cancelMainInfoModalButton));
    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCancelButton')));
    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });

  it('should show confirm modal after changing data and press close', async () => {
    renderTestComponent({}, patient);
    const nameInput = screen.getByTestId('nameTextInput') as HTMLInputElement;
    await act(() => user.clear(nameInput));
    await act(() => user.type(nameInput, 'Huan Carlos'));
    expect(nameInput.value).toBe('Huan Carlos');

    await act(() => user.click(screen.getByTestId('closeModalButton')));
    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCloseButton')));
    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });
});
