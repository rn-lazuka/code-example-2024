import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import AddDialysisMachineForm from '@containers/layouts/Drawer/components/AddDialysisMachineForm/AddDialysisMachineForm';
import userEvent from '@testing-library/user-event';
import { dialysisMachineIsolationGroupFixture, dialysisMachineFullFixture } from '@unit-tests/fixtures';
import { DrawerType } from '@enums/containers';
import { act } from 'react-dom/test-utils';

const dialysisMachine = dialysisMachineFullFixture(1);
const dialysisMachineIsolationGroups = [
  dialysisMachineIsolationGroupFixture(1, 'test'),
  dialysisMachineIsolationGroupFixture(2, 'test-2'),
];

describe('AddDialysisMachineForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<AddDialysisMachineForm />, {
      preloadedState: {
        drawer: {
          [DrawerType.DialysisMachineForm]: {
            payload: {
              isEditing: true,
            },
          },
        },
        dialysisMachines: {
          statuses: {
            isLoading: false,
            isSubmitting: false,
          },
          isolationGroups: dialysisMachineIsolationGroups,
          machine: dialysisMachine,
        },
      },
    });
  });

  it('should display form fields and controls', () => {
    expect(screen.getByText('form.generalInformation')).toBeInTheDocument();
    expect(screen.getByTestId('nameTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('nameTextInput')).toHaveValue(dialysisMachine.name);
    expect(screen.getByTestId('serialNumberTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('serialNumberTextInput')).toHaveValue(dialysisMachine.serialNumber);
    expect(screen.getByTestId('modelTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('modelTextInput')).toHaveValue(dialysisMachine.model);
    expect(screen.getByTestId('brandTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('brandTextInput')).toHaveValue(dialysisMachine.brand);
    expect(screen.getByTestId('communicationTypeSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('communicationTypeSelectInput')).toHaveValue(dialysisMachine.communicationType);
    expect(screen.getByTestId('slotCountTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('slotCountTextInput')).toHaveValue(dialysisMachine.slotCount.toString());
    expect(screen.getByTestId('descriptionTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('descriptionTextInput')).toHaveValue(dialysisMachine.description);
    expect(screen.getByText('form.condition')).toBeInTheDocument();
    expect(screen.getByTestId('statusSelectInput')).toHaveValue(dialysisMachine.status);
    expect(screen.getByTestId('commissionedDateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('isolationGroupIdSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('locationIdSelectInput')).toBeInTheDocument();
    expect(screen.getByText('form.maintenanceDateRange')).toBeInTheDocument();
    expect(screen.getByTestId('maintenanceFromDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('maintenanceToDatePicker')).toBeInTheDocument();
    expect(screen.getByText('form.warrantyDateRange')).toBeInTheDocument();
    expect(screen.getByTestId('warrantyFromDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('warrantyToDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
  });

  // TODO find out how to fix losing the confirmation modal
  it.skip('should show "confirm modal", when user tried to cancel form insertions', async () => {
    await act(() => user.type(screen.getByTestId('nameTextInput'), 'test'));
    await act(() => user.click(screen.getByTestId('cancelDialysisMachineCreationButton')));

    expect(screen.getByTestId('confirmModalCloseButton')).toBeInTheDocument();
  });
});
