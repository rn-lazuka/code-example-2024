import { render } from '@unit-tests';
import { RenderResult } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { DoctorReviewStatus, PerformAndOmitDoctorReviewPlaces, ServiceModalName } from '@enums';

const serviceModalPayloadWithDefault = {
  review: 'test',
  title: 'test',
  appointmentId: '1',
  type: DoctorReviewStatus.OMITTED,
  patientName: 'test',
  place: PerformAndOmitDoctorReviewPlaces.Services,
};

const renderModal = async (preloadedState = {}): Promise<RenderResult> => {
  return render(<></>, {
    preloadedState,
  });
};
describe('PerformAndOmitDoctorsReviewModal', () => {
  it('should render modal', async () => {
    await renderModal({
      serviceModal: {
        [ServiceModalName.PerformAndOmitDoctorsReview]: serviceModalPayloadWithDefault,
      },
      snack: {
        snacks: [],
      },
      dialysis: {
        isSubmitting: false,
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('performDoctorsReviewModal')).toBeInTheDocument();
    });
  });
});
