import { render } from '@unit-tests';
import { screen, waitFor } from '@testing-library/dom';
import { PatientStatuses } from '@enums/global';
import { patientPermanentFixture } from '@unit-tests/fixtures';
import { ServiceModalName, FileTypes } from '@enums';

const patient = patientPermanentFixture();

describe('PatientChangeStatusModal', () => {
  it('should render the PatientChangeStatusModal in not history mode', async () => {
    await render(<></>, {
      preloadedState: {
        patient: {
          loading: false,
          errors: [],
          patient,
        },
        serviceModal: {
          [ServiceModalName.PatientStatusModal]: {
            isHistory: false,
          },
        },
      },
    });

    await waitFor(() => {
      expect(screen.queryAllByTestId('patientStatusModal').length).toBeGreaterThan(0);
    });
    expect(screen.getByTestId('closeIcon')).toBeInTheDocument();
    expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('statusSelectInput')).toHaveValue(patient.status);
    });
    expect(screen.getByText('statusModal.changeStatus')).toBeInTheDocument();
  });

  it('should render the PatientChangeStatusModal in history mode', async () => {
    await render(<></>, {
      preloadedState: {
        patient: {
          loading: false,
          errors: [],
          patient,
        },
        serviceModal: {
          [ServiceModalName.PatientStatusModal]: {
            isHistory: true,
            statusData: {
              statusId: 123,
              status: PatientStatuses.Permanent,
              comment: 'test comment',
              reason: 'test reason',
              createdAt: '2022-10-15T12:34:56Z',
              updatedAt: '2022-10-15T13:45:23Z',
              files: [
                {
                  id: 1,
                  name: 'x-ray.jpg',
                  type: FileTypes.Status,
                  size: 1024,
                  createAt: '2022-10-15T12:35:00Z',
                  tempKey: 'abc123',
                  error: null,
                },
                {
                  id: 2,
                  name: 'lab_report.pdf',
                  type: FileTypes.Status,
                  size: 2048,
                  createAt: '2022-10-15T12:35:30Z',
                  tempKey: 'def456',
                  error: {
                    code: 'FILE_CORRUPTED',
                    description: 'File could not be opened',
                    id: 'file-error-123',
                  },
                },
              ],
              returningDate: '2022-10-22T10:00:00Z',
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('patientStatusModal')).toBeInTheDocument();
    });
    expect(screen.getByTestId('closeIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
    expect(screen.getByText('PERMANENT patient')).toBeInTheDocument();
    expect(screen.getByText('statusModal.changeStatus')).toBeInTheDocument();
  });
});
