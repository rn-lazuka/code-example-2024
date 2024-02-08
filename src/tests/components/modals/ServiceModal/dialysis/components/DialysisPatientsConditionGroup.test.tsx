import { DialysisPatientsConditionGroup } from '@src/components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/DialysisPatientsConditionGroup';
import { render } from '@unit-tests';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { useForm } from 'react-hook-form';
import { DialysisStatus, PatientCondition } from '@enums';
import { dialysisFixture } from '@unit-tests/fixtures';

describe('DialysisPatientsConditionGroup', () => {
  let form;
  const name = 'patientCondition';
  const user = userEvent.setup();
  const TestComponent = () => {
    form = useForm({
      defaultValues: {
        [name]: PatientCondition.Acceptable,
      },
    });
    return <DialysisPatientsConditionGroup control={form.control} watch={form.watch} isXs={false} />;
  };

  it('should render acceptable patient condition by default', async () => {
    await render(<TestComponent />, {
      preloadedState: dialysisFixture(DialysisStatus.PreDialysis),
    });
    expect(screen.getByLabelText('ACCEPTABLE_PATIENT_CONDITIONRadioButton')).toHaveAttribute('checked');
    expect(screen.getByLabelText('SOME_PATIENT_ISSUESRadioButton')).not.toHaveAttribute('checked');
    expect(screen.queryByTestId('patientConditionExtValueTextInput')).not.toBeInTheDocument();
  });

  it('should render patient condition with issues on selecting some issues radio button', async () => {
    await render(<TestComponent />, {
      preloadedState: dialysisFixture(DialysisStatus.PreDialysis, [], true, {}),
    });

    const issueButton = screen.getByTestId('SOME_PATIENT_ISSUESRadioButton');
    await act(() => user.click(issueButton));

    expect(screen.getByTestId('patientConditionExtValueTextInput')).toBeInTheDocument();
  });
});
