import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import DialysisServicesStep from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/DialysisServicesStep';
import { ServiceModalName, DialysisStatus } from '@enums';
import { patient, prescriptionFixture } from '@unit-tests/fixtures';

const preloadedStateMock = {
  serviceModal: {
    [ServiceModalName.DialysisProcedureModal]: {
      patientId: 10,
    },
  },
  dialysis: {
    loading: false,
    patient,
    isolationGroup: {
      id: 1,
      name: 'Iso 1',
    },
    services: {
      hemodialysis: prescriptionFixture(),
      doctorReviews: [],
    },
    metaData: {
      event: '',
    },
    status: {
      activeStep: DialysisStatus.CheckIn,
    },
  },
};

describe('DialysisHemodialysisServiceCard', () => {
  it('should render general info if patient has dialysis', () => {
    render(<DialysisServicesStep isXs={false} />, {
      preloadedState: { ...preloadedStateMock, dialysis: { ...preloadedStateMock.dialysis, withDialysis: true } },
    });
    expect(screen.queryByText('activePrescription')).toBeTruthy();
    expect(screen.queryByText('generalInfo')).toBeTruthy();
    expect(screen.queryByText('enteredBy')).toBeTruthy();
    expect(screen.queryByText('prescribedBy')).toBeTruthy();
    expect(screen.queryByText('frequency')).toBeTruthy();
    expect(screen.queryByText('isolation')).toBeTruthy();
    expect(screen.queryByText('days')).toBeTruthy();
    expect(screen.queryByText('startDate')).toBeTruthy();
    expect(screen.queryByText('endDate')).toBeTruthy();
    expect(screen.queryByText('hdSessions')).toBeTruthy();
    expect(screen.queryByText('duration')).toBeTruthy();
    expect(screen.queryByText('dialysate')).toBeTruthy();
    expect(screen.queryByText('anticoagulant')).toBeTruthy();
    expect(screen.queryByText('comments')).toBeTruthy();
  });

  it('should not render general info if patient has no dialysis', () => {
    render(<DialysisServicesStep isXs={false} />, {
      preloadedState: { ...preloadedStateMock, dialysis: { ...preloadedStateMock.dialysis, withDialysis: false } },
    });
    expect(screen.queryByText('activePrescription')).not.toBeTruthy();
  });
});
