import { render } from '@unit-tests';
import DialysisProcedureModal from '@components/modals/ServiceModal/components/DialysisProcedureModal/DialysisProcedureModal';
import { ServiceModalName, DialysisStatus } from '@enums';
import { dialysisFixture } from '@unit-tests/fixtures/dialysis';
import { waitFor, screen } from '@testing-library/dom';

describe('DialysisProcedureModal', () => {
  it('should render procedure modal', async () => {
    render(<DialysisProcedureModal index={1} />, {
      preloadedState: {
        serviceModal: { [ServiceModalName.DialysisProcedureModal]: { appointmentId: '1' } },
      },
    });

    expect(screen.getByTestId('dialysisProcedureModal')).toBeInTheDocument();
  });

  it('should render services step', async () => {
    render(<></>, {
      preloadedState: dialysisFixture(DialysisStatus.CheckIn),
    });

    await waitFor(() => {
      expect(screen.getByTestId('dialysisProcedureModalHeader')).toBeInTheDocument();
    });
    expect(screen.getByTestId('dialysisServicesStep')).toBeInTheDocument();
  });

  it('should render preHd step', async () => {
    render(<></>, {
      preloadedState: dialysisFixture(DialysisStatus.PreDialysis),
    });

    await waitFor(() => {
      expect(screen.getByTestId('dialysisPreHdStep')).toBeInTheDocument();
    });
  });

  it('should render hdReading step', async () => {
    render(<></>, {
      preloadedState: dialysisFixture(DialysisStatus.HDReading),
    });

    expect(screen.getByTestId('dialysisHdReadingStep')).toBeInTheDocument();
  });

  it('should render postHd step', async () => {
    render(<></>, {
      preloadedState: dialysisFixture(DialysisStatus.PostDialysis),
    });

    expect(screen.getByTestId('dialysisPostHdStep')).toBeInTheDocument();
  });
  it('should not render step', async () => {
    render(<></>, {
      preloadedState: dialysisFixture(null),
    });

    expect(screen.getByTestId('dialysisProcedureModalStep')).toBeEmptyDOMElement();
  });
});
