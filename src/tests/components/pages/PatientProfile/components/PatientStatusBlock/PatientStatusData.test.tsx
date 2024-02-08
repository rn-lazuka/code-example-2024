import { screen } from '@testing-library/react';
import { PatientStatusData } from '@components/pages/PatientProfile/PatientStatusBlock/components/PatientStatusData';
import { PatientStatuses, UserPermissions } from '@enums';
import { render } from '@unit-tests';

const preloadedState = {
  user: {
    user: {
      permissions: [UserPermissions.PatientEditProfile, UserPermissions.PatientViewDemographics],
    },
  },
};

describe('PatientStatusData', () => {
  const patientStatusData = {
    statusId: 1,
    status: PatientStatuses.Permanent,
    details: 'Detail',
    comment: 'Some comment',
    reason: 'Some reason',
    createdAt: '2022-03-05T15:30:00.000Z',
    updatedAt: '2022-03-05T15:30:00.000Z',
    files: [],
    returningDate: '2022-03-15T15:30:00.000Z',
    clinic: 'Clinic',
  };

  it('should render component with isCurrentStatus', () => {
    render(
      <PatientStatusData
        patientId="123"
        patientStatusData={patientStatusData as any}
        isCurrentStatus={true}
        isFirstStatus={true}
        onChangePatientStatus={() => {}}
      />,
      { preloadedState },
    );

    expect(screen.getByText('currentStatus')).toBeInTheDocument();
  });

  it('should render component with falsy inCurrentStatus status and check that all permanent fields are exist', () => {
    render(
      <PatientStatusData
        patientId="123"
        patientStatusData={patientStatusData as any}
        isCurrentStatus={false}
        isFirstStatus={false}
        onChangePatientStatus={() => {}}
      />,
      { preloadedState },
    );

    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('modified')).toBeInTheDocument();
    expect(screen.getByText('comment')).toBeInTheDocument();
    expect(screen.getByText('virologyStatus')).toBeInTheDocument();
    expect(screen.getByText(/permanent/i)).toBeInTheDocument();
    expect(screen.getByTestId('EditOutlinedIcon')).toBeInTheDocument();
  });

  it('should render component with falsy inCurrentStatus status and check that all Hospitalized fields are exist', () => {
    render(
      <PatientStatusData
        patientId="123"
        patientStatusData={{ ...patientStatusData, status: PatientStatuses.Hospitalized } as any}
        isCurrentStatus={false}
        isFirstStatus={false}
        onChangePatientStatus={() => {}}
      />,
      { preloadedState },
    );

    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('reason')).toBeInTheDocument();
    expect(screen.getByText('modified')).toBeInTheDocument();
    expect(screen.getByText('comment')).toBeInTheDocument();
    expect(screen.getByText('details')).toBeInTheDocument();
    expect(screen.getByText('dischargeNotes')).toBeInTheDocument();
    expect(screen.getByText(/hospitalized/i)).toBeInTheDocument();
    expect(screen.getByText('hospitalClinic')).toBeInTheDocument();
    expect(screen.getByTestId('EditOutlinedIcon')).toBeInTheDocument();
  });

  it('should render component with falsy inCurrentStatus status and check that all Dead fields are exist', () => {
    render(
      <PatientStatusData
        patientId="123"
        patientStatusData={{ ...patientStatusData, status: PatientStatuses.Dead } as any}
        isCurrentStatus={false}
        isFirstStatus={false}
        onChangePatientStatus={() => {}}
      />,
      { preloadedState },
    );

    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('modified')).toBeInTheDocument();
    expect(screen.getByText('causeOfDeath')).toBeInTheDocument();
    expect(screen.getByText('deathCertificateOrOtherProof')).toBeInTheDocument();
    expect(screen.getByText(/dead/i)).toBeInTheDocument();
    expect(screen.getByTestId('EditOutlinedIcon')).toBeInTheDocument();
  });
});
