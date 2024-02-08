import { render } from '@unit-tests';
import { screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { DialysisStatus, Instillation } from '@enums';
import { accessManagementFixture, dialysisFixture } from '@unit-tests/fixtures';
import DialysisPreHdStepAccessManagementGroup from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/DialysisPreHdStepAccessManagementGroup';
import { getInstillationValue } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/DialysisPreHdStep';

describe('DialysisAccessManagementGroup', () => {
  const accessManagementData = accessManagementFixture;
  const TestComponent = () => {
    const form: any = useForm({
      defaultValues: {
        access: accessManagementData.map(({ needle, instillation, wasUsed }) => ({
          needleType: needle?.type,
          arterialNeedleSize: needle?.arterialSize,
          venousNeedleSize: needle?.venousSize,
          instillation: getInstillationValue(instillation),
          instillationExtValue: instillation?.code === Instillation.Others ? instillation.extValue : '',
          wasUsed,
        })),
      },
    });
    return (
      <DialysisPreHdStepAccessManagementGroup
        control={form.control}
        watch={form.watch}
        accessManagements={accessManagementData}
      />
    );
  };
  const TestComponentWithOneAccess = () => {
    const form: any = useForm({
      defaultValues: {
        access: [accessManagementData[0]].map(({ needle, instillation, wasUsed }) => ({
          needleType: needle?.type,
          arterialNeedleSize: needle?.arterialSize,
          venousNeedleSize: needle?.venousSize,
          instillation: getInstillationValue(instillation),
          instillationExtValue: instillation?.code === Instillation.Others ? instillation.extValue : '',
          wasUsed,
        })),
      },
    });
    return (
      <DialysisPreHdStepAccessManagementGroup
        control={form.control}
        watch={form.watch}
        accessManagements={[accessManagementData[0]]}
      />
    );
  };

  it('should render accessManagement list', async () => {
    await render(<TestComponent />, {
      preloadedState: dialysisFixture(DialysisStatus.PreDialysis),
    });

    expect(screen.getByTestId('form.accessManagementCVC_InfoCard')).toBeInTheDocument();
    expect(screen.getByTestId('form.accessManagementVascular_InfoCard')).toBeInTheDocument();
  });

  it('should render correct CVC access form data', async () => {
    await render(<TestComponent />, {
      preloadedState: dialysisFixture(DialysisStatus.PreDialysis),
    });

    expect(screen.getByText('form.accessManagementCVC')).toBeInTheDocument();
    expect(screen.getByTestId('access.0.wasUsedCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('access.0.wasUsedCheckbox')).not.toBeChecked();
    expect(screen.getByText('ACCESS_CATEGORIES:CVC, CVC_CATEGORIES:TEMPORARY, SIDES:RIGHT')).toBeInTheDocument();
    expect(screen.getByText('15/12/2022')).toBeInTheDocument();
    expect(screen.getByText('comments')).toBeInTheDocument();
    expect(screen.getByText('form.instillation')).toBeInTheDocument();
    expect(screen.getByTestId('HEPARIN_UNITS_MLRadioButton')).toBeInTheDocument();
    expect(screen.getByLabelText('HEPARIN_UNITS_MLRadioButton')).toHaveAttribute('checked');
    expect(screen.getByTestId('OTHERSRadioButton')).toBeInTheDocument();
    expect(screen.getByLabelText('OTHERSRadioButton')).not.toHaveAttribute('checked');
    expect(screen.getByText('form.arterialVolume')).not.toHaveAttribute('checked');
    expect(screen.getByText('form.arterialVolume')).toBeInTheDocument();
    expect(screen.getByText('2.2')).toBeInTheDocument();
    expect(screen.getByText('form.venousVolume')).toBeInTheDocument();
    expect(screen.getByText('2.1')).toBeInTheDocument();
  });

  it('should render correct Vascular access form data', async () => {
    await render(<TestComponent />, {
      preloadedState: dialysisFixture(DialysisStatus.PreDialysis),
    });

    expect(screen.getByText('form.accessManagementVascular')).toBeInTheDocument();
    expect(screen.getByTestId('access.1.wasUsedCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('access.1.wasUsedCheckbox')).toBeChecked();
    expect(screen.getByText('ACCESS_CATEGORIES:VASCULAR_ACCESS, ACCESS_TYPES:AVF, SIDES:LEFT')).toBeInTheDocument();
    expect(screen.getByText('note')).toBeInTheDocument();
    expect(screen.getByText('29/12/2022')).toBeInTheDocument();
    expect(screen.getByText('createdAtPlaceBy')).toBeInTheDocument();
    expect(screen.getByText('createdAtPlace')).toBeInTheDocument();
    expect(screen.getByText('VascularAccess comments')).toBeInTheDocument();
    expect(screen.getByText('form.needleType')).toBeInTheDocument();
    expect(screen.getByTestId('STANDARD_AVF_NEEDLERadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('BLUNT_AVF_NEEDLERadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('SINGLE_NEEDLERadioButton')).toBeInTheDocument();
    expect(screen.getByLabelText('STANDARD_AVF_NEEDLERadioButton')).not.toHaveAttribute('checked');
    expect(screen.getByLabelText('BLUNT_AVF_NEEDLERadioButton')).toHaveAttribute('checked');
    expect(screen.getByLabelText('SINGLE_NEEDLERadioButton')).not.toHaveAttribute('checked');
    expect(screen.getByText('form.arterialNeedleSize')).toBeInTheDocument();
    expect(screen.getAllByTestId('17RadioButton')).toHaveLength(2);
    expect(screen.getAllByTestId('16RadioButton')).toHaveLength(2);
    expect(screen.getAllByTestId('15RadioButton')).toHaveLength(2);
    expect(screen.getAllByTestId('14RadioButton')).toHaveLength(2);
    expect(screen.getAllByLabelText('17RadioButton')[0]).toHaveAttribute('checked');
    expect(screen.getAllByLabelText('17RadioButton')[1]).not.toHaveAttribute('checked');
    expect(screen.getByText('form.venousNeedleSize')).toBeInTheDocument();
  });

  it('should not render wasUsed checkbox with one access', async () => {
    await render(<TestComponentWithOneAccess />, {
      preloadedState: dialysisFixture(DialysisStatus.PreDialysis),
    });

    expect(screen.getByText('form.accessManagement')).toBeInTheDocument();
    expect(screen.queryByTestId('access.0.wasUsedCheckbox')).not.toBeInTheDocument();
  });
});
