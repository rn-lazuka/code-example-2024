import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { RegisterPatientModal } from '@components/pages/TodayPatients';
import { act } from 'react-dom/test-utils';

describe('Register patient modal', () => {
  const user = userEvent.setup();
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render register patient modal', () => {
    render(<RegisterPatientModal isOpen onClose={onClose} />);

    expect(screen.getByTestId('modal.newPatientFullScreenModal')).toBeInTheDocument();
    expect(screen.getByText('modal.newPatient')).toBeInTheDocument();
    expect(screen.getByText('modal.status')).toBeInTheDocument();
    expect(screen.getByTestId('PERMANENTTextToggleButton')).toBeInTheDocument();
    expect(screen.getByTestId('WALK_INTextToggleButton')).toBeInTheDocument();
    expect(screen.getByTestId('VISITINGTextToggleButton')).toBeInTheDocument();

    expect(screen.getByTestId('fullRegisterForm')).toBeInTheDocument();
    expect(screen.getByTestId('formCancelButton')).toBeInTheDocument();
    expect(screen.getByTestId('formSaveButton')).toBeInTheDocument();
  });

  it('should render full form', () => {
    render(<RegisterPatientModal isOpen onClose={onClose} />);

    expect(screen.getByTestId('fullRegisterForm')).toBeInTheDocument();

    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    expect(screen.getByTestId('nameTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('genderCodeSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('dateBirthDatePicker')).toBeInTheDocument();

    expect(screen.getByText('modal.idType')).toBeInTheDocument();
    expect(screen.getByTestId('NRICRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('PASSPORTRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('documentNumberTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('educationLevelSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('occupationFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('raceSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('nationalityFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('languageCodeSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('religionSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('phoneCountryCode')).toBeInTheDocument();
    expect(screen.getByTestId('phoneNumberPhoneInput')).toBeInTheDocument();

    expect(screen.getByText('modal.additionalComments')).toBeInTheDocument();
    expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();

    expect(screen.getByText('modal.address')).toBeInTheDocument();
    expect(screen.getByTestId('houseFlatTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('streetTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('cityTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('districtTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('stateTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('countryIsoSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('postalCodeTextInput')).toBeInTheDocument();

    expect(screen.getByText('modal.familyInformation')).toBeInTheDocument();
    expect(screen.getByTestId('maritalStatusSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('childCountNumberInput')).toBeInTheDocument();

    expect(screen.getByText('profile.nextOfKin 1')).toBeInTheDocument();
    expect(screen.getByTestId('kins.0.nameTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('kins.0.relationshipTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('kins.0.phone.countryCode')).toBeInTheDocument();
    expect(screen.getByTestId('kins.0.phone.numberPhoneInput')).toBeInTheDocument();
    expect(screen.getByTestId('addKinButton')).toBeInTheDocument();

    expect(screen.getByText('modal.documentsUpload')).toBeInTheDocument();
    expect(screen.getAllByTestId('fileInput')).toHaveLength(7);
    expect(screen.getByTestId('IDENTITY_DOCUMENT_FIELD')).toBeInTheDocument();
    expect(screen.getByTestId('VIROLOGY_STATUS_FIELD')).toBeInTheDocument();
    expect(screen.getByTestId('MEDICAL_REPORT_FIELD')).toBeInTheDocument();
    expect(screen.getByTestId('CONSULTATION_FIELD')).toBeInTheDocument();
    expect(screen.getByTestId('BLOOD_TEST_FIELD')).toBeInTheDocument();
    expect(screen.getByTestId('HD_PRESCRIPTION_FIELD')).toBeInTheDocument();
    expect(screen.getByTestId('OTHER_FIELD')).toBeInTheDocument();
  });

  it('should render walkIn form', async () => {
    render(<RegisterPatientModal isOpen onClose={onClose} />);
    const walkinButton = screen.getByTestId('WALK_INTextToggleButton');
    await act(() => user.click(walkinButton));

    expect(walkinButton.getAttribute('class')).toContain('Mui-selected');
    expect(screen.getByTestId('walkinRegisterForm')).toBeInTheDocument();

    expect(screen.getByTestId('nameTextInput')).toBeInTheDocument();
    expect(screen.getByText('modal.idType')).toBeInTheDocument();
    expect(screen.getByTestId('NRICRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('PASSPORTRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('documentNumberTextInput')).toBeInTheDocument();
    expect(screen.getByText('modal.additionalComments')).toBeInTheDocument();
    expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    expect(screen.getByText('modal.address')).toBeInTheDocument();
    expect(screen.getByTestId('houseFlatTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('streetTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('cityTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('districtTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('stateTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('countryIsoSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('postalCodeTextInput')).toBeInTheDocument();
  });

  it('should render confirm modal', async () => {
    render(<RegisterPatientModal isOpen onClose={onClose} />);
    const cancelButton = screen.getByTestId('closeModalButton');

    await act(() => user.type(screen.getByTestId('nameTextInput'), 'Test name'));
    await act(() => user.click(cancelButton));

    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCloseButton')));

    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });
});
