import { render } from '@unit-tests';
import { screen, waitFor } from '@testing-library/dom';
import { LabOrderEventPlace, ServiceModalName } from '@enums';

const modalPayloadMock = {
  orderId: '1',
  place: LabOrderEventPlace.LabOrders,
};
jest.mock('@hooks/useGetNursesOptions', () => ({
  useGetNursesOptions: jest
    .fn()
    .mockReturnValueOnce({
      nursesOptions: [{ label: 'test', value: 'test' }],
      userNurse: null,
      nursesUnfilteredOptions: [{ label: 'test', value: 'test' }],
    })
    .mockReturnValue({
      nursesOptions: [],
      userNurse: null,
      nursesUnfilteredOptions: [],
    }),
}));

describe('PerformLabTestModal', () => {
  it('should render modal with fields if showForm is true', async () => {
    await render(<></>, {
      preloadedState: {
        serviceModal: { [ServiceModalName.PerformLabTest]: modalPayloadMock },
        labOrders: { statuses: { isSubmitting: false } },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId('PerformLabTestModal')).toBeInTheDocument();
    });
    expect(screen.getByTestId('patientAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('procedureFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('laboratoryFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('specimenTypeSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('performedAtFormTimePicker')).toBeInTheDocument();
    expect(screen.getByTestId('performedByFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('FASTINGRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('NON_FASTINGRadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('cancelPerformLabTestButton')).toBeInTheDocument();
    expect(screen.getByTestId('savePerformLabTestButton')).toBeInTheDocument();
  });
  it('should render modal with skeletons if showForm is false', async () => {
    await render(<></>, {
      preloadedState: {
        serviceModal: { [ServiceModalName.PerformLabTest]: modalPayloadMock },
        labOrders: { statuses: { isSubmitting: false } },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId('PerformLabTestModal')).toBeInTheDocument();
    });
    expect(screen.getByTestId('PerformLabTestSkeletonForm')).toBeInTheDocument();
  });
});
