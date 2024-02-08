import type { PatientStatusForm } from '@types';
import { screen } from '@testing-library/react';
import { render, changeSelectValue } from '@unit-tests';
import { useForm } from 'react-hook-form';
import { FileTypes, PatientHospitalizationReason, PatientStatuses } from '@enums/global';
import { PatientChangeStatusForm } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/PatientChangeStatusForm';

const defaultValues: PatientStatusForm = {
  status: PatientStatuses.Permanent,
  comment: '',
  reason: PatientHospitalizationReason.UNKNOWN,
  returningDate: new Date(),
  kins: [],
  [FileTypes.DischargeNotes]: [],
  [FileTypes.IdentityDocument]: [],
  [FileTypes.DeathProof]: [],
  [FileTypes.VirologyStatus]: [],
  [FileTypes.MedicalReport]: [],
  [FileTypes.Consultation]: [],
  [FileTypes.BloodTest]: [],
  [FileTypes.HdPrescription]: [],
  [FileTypes.Other]: [],
};

const patientId = 1;

const mockAvailableStatuses = [
  PatientStatuses.Dead,
  PatientStatuses.Walk_In,
  PatientStatuses.Permanent,
  PatientStatuses.Hospitalized,
  PatientStatuses.Visiting,
  PatientStatuses.Discharged,
  PatientStatuses.Temporary_Transferred,
];

describe('PatientChangeStatusForm', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let form;
  let onCancelCallback;

  beforeEach(() => {
    form = null;
    onCancelCallback = jest.fn();
  });

  const TestComponent = ({
    isHistory = false,
    statusId = null,
    currentPatientStatus = PatientStatuses.Permanent,
  }: {
    isHistory: boolean;
    currentPatientStatus: PatientStatuses;
    statusId?: string | number | null;
  }) => {
    form = useForm<PatientStatusForm>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues,
      shouldUnregister: true,
    });

    return (
      <PatientChangeStatusForm
        patientId={patientId}
        isHistory={isHistory}
        statusId={statusId}
        currentPatientStatus={currentPatientStatus}
        availableStatuses={mockAvailableStatuses}
        onCancel={onCancelCallback}
      />
    );
  };

  it("should render the form and check that it's being rendered in the default state", () => {
    render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Permanent} />);
    expect(screen.getByTestId('patientStatusDefaultFormView')).toBeInTheDocument();
    expect(screen.getByTestId('cancelPatientStatusFormButton')).toBeInTheDocument();
    expect(screen.getByText('button.cancel')).toBeInTheDocument();
    expect(screen.getByTestId('submitPatientStatusFormButton')).toBeInTheDocument();
    expect(screen.getByText('button.save')).toBeInTheDocument();
    expect(screen.getByTestId('submitPatientStatusFormButton')).toHaveAttribute('disabled');
  });

  it('should render different form views when status is changed', async () => {
    const { rerender } = render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Permanent} />);
    await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Dead);
    expect(screen.getByTestId('patientStatusDeadFormView')).toBeInTheDocument();
    await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Visiting);
    expect(screen.getByTestId('patientStatusVisitingFormView')).toBeInTheDocument();
    await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Walk_In);
    expect(screen.getByTestId('patientStatusWalkInFormView')).toBeInTheDocument();
    await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Discharged);
    expect(screen.getByTestId('patientStatusDischargedFormView')).toBeInTheDocument();
    await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Hospitalized);
    expect(screen.getByTestId('patientStatusHospitalizedFormView')).toBeInTheDocument();
    await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Temporary_Transferred);
    expect(screen.getByTestId('patientStatusTemporaryTransferredFormView')).toBeInTheDocument();
    rerender(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Visiting} />);
    await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Permanent);
    expect(screen.getByTestId('patientStatusPermanentFormView')).toBeInTheDocument();
  });

  describe('PatientChangeStatusForm - Permanent status', () => {
    it('should render form view for Permanent patient in isHistory mode', async () => {
      render(<TestComponent isHistory={true} currentPatientStatus={PatientStatuses.Permanent} />);
      expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
      expect(screen.getByTestId('VIROLOGY_STATUS_FIELD')).toBeInTheDocument();
    });

    it('should render form view for Permanent patient in not isHistory mode', async () => {
      render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Hospitalized} />);
      await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Permanent);
      expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
      expect(screen.getByTestId('fileInput')).toBeInTheDocument();
    });
  });

  describe('PatientChangeStatusForm - Dead status', () => {
    it('should render form view for dead patient in isHistory mode', async () => {
      render(<TestComponent isHistory={true} currentPatientStatus={PatientStatuses.Dead} />);
      expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
      expect(screen.getByTestId('fileInput')).toBeInTheDocument();
      expect(screen.getByTestId('deathDateDatePicker')).toBeInTheDocument();
      expect(screen.queryByTestId('noticeBlock')).not.toBeInTheDocument();
      expect(screen.queryByTestId('statusModal.payAttention')).not.toBeInTheDocument();
    });

    it('should render form view for dead patient in not isHistory mode', async () => {
      render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Permanent} />);
      await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Dead);
      expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
      expect(screen.getByTestId('deathDateDatePicker')).toBeInTheDocument();
      expect(screen.getByTestId('fileInput')).toBeInTheDocument();
      expect(screen.getAllByTestId('noticeBlock').length).toEqual(2);
      expect(screen.getByText('statusModal.payAttention')).toBeInTheDocument();
    });
  });

  describe('PatientChangeStatusForm - Walk_In status', () => {
    it('should render form view for Walk_In patient in isHistory mode', async () => {
      render(<TestComponent isHistory={true} currentPatientStatus={PatientStatuses.Walk_In} />);
      expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });

    it('should render form view for Walk_In patient in not isHistory mode', async () => {
      render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Hospitalized} />);
      await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Walk_In);
      expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });
  });

  describe('PatientChangeStatusForm - Visiting status', () => {
    it('should render form view for Visiting patient in isHistory mode', async () => {
      render(<TestComponent isHistory={true} currentPatientStatus={PatientStatuses.Visiting} />);
      expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });

    it('should render form view for Visiting patient in not isHistory mode', async () => {
      render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Permanent} />);
      await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Visiting);
      expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });
  });

  describe('PatientChangeStatusForm - Discharged status', () => {
    it('should render form view for Discharged patient in isHistory mode', async () => {
      render(<TestComponent isHistory={true} currentPatientStatus={PatientStatuses.Discharged} />);
      expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });

    it('should render form view for Discharged patient in not isHistory mode', async () => {
      render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Permanent} />);
      await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Discharged);
      expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });
  });

  describe('PatientChangeStatusForm - Temporary_Transferred status', () => {
    it('should render form view for Temporary_Transferred patient in isHistory mode', async () => {
      render(<TestComponent isHistory={true} currentPatientStatus={PatientStatuses.Temporary_Transferred} />);
      expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
      expect(screen.getByTestId('returningDateDatePicker')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });

    it('should render form view for Temporary_Transferred patient in not isHistory mode', async () => {
      render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Permanent} />);
      await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Temporary_Transferred);
      expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
      expect(screen.getByTestId('returningDateDatePicker')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });
  });

  describe('PatientChangeStatusForm - Hospitalized status', () => {
    it('should render form view for Hospitalized patient in isHistory mode', async () => {
      render(<TestComponent isHistory={true} currentPatientStatus={PatientStatuses.Hospitalized} />);
      expect(screen.queryByTestId('statusSelectInput')).not.toBeInTheDocument();
      expect(screen.getByText('statusModal.reasonToHospitalization')).toBeInTheDocument();
      expect(screen.getByTestId('UNKNOWNRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('HD_RELATEDRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('NON_HD_RELATEDRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('VASCULAR_RELATEDRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('returningDateDatePicker')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });

    it('should render form view for Hospitalized patient in not isHistory mode', async () => {
      render(<TestComponent isHistory={false} currentPatientStatus={PatientStatuses.Permanent} />);
      await changeSelectValue(screen.getByTestId('statusSelectInput'), PatientStatuses.Hospitalized);
      expect(screen.getByTestId('statusSelectInput')).toBeInTheDocument();
      expect(screen.getByText('statusModal.reasonToHospitalization')).toBeInTheDocument();
      expect(screen.getByTestId('UNKNOWNRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('HD_RELATEDRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('NON_HD_RELATEDRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('VASCULAR_RELATEDRadioButton')).toBeInTheDocument();
      expect(screen.getByTestId('returningDateDatePicker')).toBeInTheDocument();
      expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    });
  });
});
