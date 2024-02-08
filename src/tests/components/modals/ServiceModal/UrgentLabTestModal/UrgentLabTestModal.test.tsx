import { render } from '@unit-tests';
import { RenderResult } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { ServiceModalName } from '@enums';

const PATIENT_ID = 123;

const serviceModalPayloadWithDefault = {
  disabledPatient: true,
  patientId: PATIENT_ID,
};

jest.mock('@hooks/useProceduresOptionsList', () => ({
  useProceduresOptionsList: jest.fn().mockImplementation(() => ({
    procedureOptions: [
      { id: 1, name: 'Procedure 1' },
      { id: 2, name: 'Procedure 2' },
    ],
  })),
}));
const renderModal = async (preloadedState = {}): Promise<RenderResult> => {
  return render(<></>, {
    preloadedState,
  });
};
describe('UrgentLabTestModal', () => {
  it.skip('should render modal with skeletons if showForm is false', async () => {
    await renderModal({
      serviceModal: {
        [ServiceModalName.UrgentLabTest]: serviceModalPayloadWithDefault,
      },
      snack: {
        snacks: [],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('urgentLabTestModal')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('urgentLabTestSkeletonForm')).toBeInTheDocument();
    });
  });

  it('should render modal with form field if showForm is true', async () => {
    await renderModal({
      serviceModal: {
        [ServiceModalName.UrgentLabTest]: serviceModalPayloadWithDefault,
      },
      patient: { patient: { id: PATIENT_ID, name: 'Test test' } },
      snack: {
        snacks: [],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('patientAutocomplete')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('procedureFormAutocomplete')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('laboratoryFormAutocomplete')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('specimenTypeSelectInput')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('cancelUrgentLabTestFormButton')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('saveUrgentLabTestFormButton')).toBeInTheDocument();
    });
  });
});
