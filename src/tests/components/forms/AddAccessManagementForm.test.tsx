import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import AddAccessManagementForm from '@containers/layouts/Drawer/components/AddAccessManagementForm/AddAccessManagementForm';

describe('AddAccessManagementForm', () => {
  const user = userEvent.setup();

  it('should render form', () => {
    render(<AddAccessManagementForm />);

    expect(screen.getByTestId('addAccessManagementForm')).toBeInTheDocument();
  });

  it('should contain control vascular elements', () => {
    render(<AddAccessManagementForm />);

    expect(screen.getByText('modal.accessCategory')).toBeInTheDocument();
    expect(screen.getByTestId('VASCULAR_ACCESSRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('CVCRadioButton')).toBeInTheDocument();

    expect(screen.getByTestId('creationDateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('createdByTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('createdAtTextInput')).toBeInTheDocument();

    expect(screen.getByText('modal.accessType')).toBeInTheDocument();
    expect(screen.getByTestId('AVFRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('AVGRadioButton')).toBeInTheDocument();

    expect(screen.getByTestId('noteTextInput')).toBeInTheDocument();

    expect(screen.getByText('modal.side')).toBeInTheDocument();
    expect(screen.getByTestId('LEFTRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('RIGHTRadioButton')).toBeInTheDocument();

    expect(screen.getByText('modal.needleType')).toBeInTheDocument();
    expect(screen.getByTestId('STANDARD_AVF_NEEDLERadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('BLUNT_AVF_NEEDLERadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('SINGLE_NEEDLERadioButton')).toBeInTheDocument();

    expect(screen.getByText('modal.arterialNeedleSize')).toBeInTheDocument();
    expect(screen.getAllByTestId('17RadioButton')).toHaveLength(2);
    expect(screen.getAllByTestId('16RadioButton')).toHaveLength(2);
    expect(screen.getAllByTestId('15RadioButton')).toHaveLength(2);
    expect(screen.getAllByTestId('14RadioButton')).toHaveLength(2);

    expect(screen.getByText('modal.venousNeedleSize')).toBeInTheDocument();
    expect(screen.getByTestId('commentsTextInput')).toBeInTheDocument();

    expect(screen.getByTestId('cancelAddAccessManagementButton')).toBeInTheDocument();
    expect(screen.getByTestId('saveAddAccessManagementButton')).toBeInTheDocument();
  });

  it('should contain control cvc elements', async () => {
    render(<AddAccessManagementForm />);
    const cvcRadioButton = screen.getByTestId('CVCRadioButton').querySelector('input');
    expect(cvcRadioButton).toBeTruthy();

    cvcRadioButton && (await act(() => user.click(cvcRadioButton)));
    expect(cvcRadioButton).toBeChecked();
    expect(screen.getByTestId('insertionDateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('PERMANENTRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('TEMPORARYRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('LEFTRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('RIGHTRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('HEPARIN_UNITS_MLRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('arterialVolumeTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('venousVolumeTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('commentsTextInput')).toBeInTheDocument();
  });
});
