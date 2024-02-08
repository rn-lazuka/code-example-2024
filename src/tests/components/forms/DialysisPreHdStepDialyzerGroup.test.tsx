import { render } from '@unit-tests';
import { PreHDForm } from '@types';
import { DialysisStatus } from '@enums';
import DialysisPreHdStepDialyzerGroup from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/DialysisPreHdStepDialyzerGroup';
import { useForm } from 'react-hook-form';
import { screen } from '@testing-library/dom';
import { patient } from '@unit-tests/fixtures';

const defaultValues = {
  patientDialyzer: {
    label: 'Revaclear 300 (10 tableView.m2) - tableView.new',
    value: '1',
    history: [],
  },
  dialyzerReuseNum: '',
  sterilantVe: true,
  dialyzerTestedBy: { label: 'dialyzerTestedBy', value: '1' },
  residualVe: true,
  residualTestedBy: { label: 'residualTestedBy', value: '1' },
  dialyzerPrimedBy: { label: 'dialyzerPrimedBy', value: '1' },
  dialyzerSterilantVeComment: 'dialyzerSterilantVeComment',
};

const dialyzers = [
  {
    brand: 'Revaclear 300',
    history: [],
    id: 1,
    status: 'ACTIVE',
    surfaceArea: 10,
    type: 'SINGLE_USE',
  },
  {
    brand: 'Theranova 400 1.7 m2',
    history: [],
    id: 2,
    status: 'ACTIVE',
    surfaceArea: 10,
    type: 'SINGLE_USE',
  },
];

const preloadedStateMock = {
  dialysis: {
    patient,
    status: {
      activeStep: DialysisStatus.CheckIn,
    },
  },
};

describe('DialysisPreHdStepDialyzerGroup', () => {
  const TestComponent = ({ nursesOptions = [], dialyzers, id = '' }: any) => {
    const { control, watch, setValue } = useForm<PreHDForm>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues,
      shouldUnregister: true,
    });
    return (
      <DialysisPreHdStepDialyzerGroup
        control={control}
        watch={watch}
        setValue={setValue}
        nursesOptions={nursesOptions}
        dialyzers={dialyzers}
        id={id}
        isXs={false}
      />
    );
  };

  it('should show dialyzer form', async () => {
    render(<TestComponent nursesOptions={[]} dialyzers={dialyzers} id={''} />, {
      preloadedState: preloadedStateMock,
    });

    expect(screen.getByText('form.dialyzer')).toBeInTheDocument();
    expect(screen.getByText('form.usedDialyzer')).toBeInTheDocument();
    expect(screen.getByTestId('patientDialyzerFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('patientDialyzerFormAutocomplete')).toHaveAttribute(
      'value',
      'Revaclear 300 (10 tableView.m2) - tableView.new',
    );
    expect(screen.getByTestId('dialyzerReuseNumTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerReuseNumTextInput')).toHaveAttribute('value', '1');
    expect(screen.getByTestId('addNewDialyzerButton')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerPrimedByFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerPrimedByFormAutocomplete')).toHaveAttribute('value', 'DialyzerPrimedBy');
    expect(screen.getByTestId('dialyzerSterilantVeCommentTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerSterilantVeCommentTextInput')).toHaveAttribute(
      'value',
      'dialyzerSterilantVeComment',
    );
  });

  it('should show form with used dialyzer', async () => {
    const defaultValuesWithHistory = {
      ...defaultValues,
      patientDialyzer: {
        label: 'test dialyzer',
        value: '1',
        history: [
          {
            date: '14-07-2023',
            dialysisId: '123',
            used: true,
          },
          {
            date: '14-07-2023',
            dialysisId: '1234',
            used: true,
          },
        ],
      },
      dialyzerReuseNum: 2,
    };
    const TestComponent = ({ nursesOptions = [], dialyzers = [], id = '123' }: any) => {
      const { control, watch, setValue } = useForm<PreHDForm>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: defaultValuesWithHistory,
        shouldUnregister: true,
      });
      return (
        <DialysisPreHdStepDialyzerGroup
          control={control}
          watch={watch}
          setValue={setValue}
          nursesOptions={nursesOptions}
          dialyzers={dialyzers}
          id={id}
          isXs={false}
        />
      );
    };
    render(<TestComponent />, {
      preloadedState: preloadedStateMock,
    });

    expect(screen.getByTestId('dialyzerReuseNumTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerReuseNumTextInput')).toHaveAttribute('value', '2');
    expect(screen.getByText('form.dialyzerSterilant')).toBeInTheDocument();
    expect(screen.getByTestId('sterilantVeCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('sterilantVeCheckbox')).toHaveAttribute('checked');
    expect(screen.getByTestId('dialyzerTestedByFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerTestedByFormAutocomplete')).toHaveAttribute('value', 'DialyzerTestedBy');
    expect(screen.getByTestId('residualVeCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('residualVeCheckbox')).toHaveAttribute('checked');
    expect(screen.getByTestId('residualTestedByFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('residualTestedByFormAutocomplete')).toHaveAttribute('value', 'ResidualTestedBy');
    expect(screen.getByTestId('dialyzerPrimedByFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerPrimedByFormAutocomplete')).toHaveAttribute('value', 'DialyzerPrimedBy');
    expect(screen.getByTestId('dialyzerSterilantVeCommentTextInput')).toHaveAttribute(
      'value',
      'dialyzerSterilantVeComment',
    );
    expect(screen.getByTestId('dialyzerSterilantVeCommentTextInput')).toHaveAttribute(
      'value',
      'dialyzerSterilantVeComment',
    );
  });
});
