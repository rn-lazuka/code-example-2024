import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { DialysisPostHdStep } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/DialysisPostHdStep';
import { postHdFixture } from '@unit-tests/fixtures';
import { UserPermissions, DialysisStatus } from '@enums';
import { format } from 'date-fns';

const initialState = {
  dialysis: {
    postHd: postHdFixture(),
    metaData: {
      event: null,
    },
    status: {
      currentStep: DialysisStatus.PostDialysis,
      activeStep: DialysisStatus.PostDialysis,
    },
    startTime: '2022-11-15T09:41:24.321Z',
    endTime: '2022-11-15T11:41:53.832Z',
    bay: 'Bay 05',
  },
  user: {
    user: {
      permissions: [UserPermissions.DialysisEditMeasurement],
    },
  },
};

describe('DialysisHdReadingStepForm', () => {
  it('should show postHd step with data', async () => {
    render(<DialysisPostHdStep isXs={false} />, {
      preloadedState: initialState,
    });
    expect(screen.getByTestId('postSessionWeightAutocompleteFreeSolo')).toHaveAttribute('value', '99');
    expect(screen.getByTestId('weightLossTextInput')).toHaveAttribute('value', '1');
    expect(screen.getByTestId('sittingSystolicBloodPressureTextInput')).toHaveAttribute('value', '44');
    expect(screen.getByTestId('sittingDiastolicBloodPressureTextInput')).toHaveAttribute('value', '55');
    expect(screen.getByTestId('sittingPulseTextInput')).toHaveAttribute('value', '66');
    expect(screen.getByTestId('standingSystolicBloodPressureTextInput')).toHaveAttribute('value', '11');
    expect(screen.getByTestId('standingDiastolicBloodPressureTextInput')).toHaveAttribute('value', '22');
    expect(screen.getByTestId('standingPulseTextInput')).toHaveAttribute('value', '33');
    expect(screen.getByTestId('bodyTemperatureTextInput')).toHaveAttribute('value', '38.0');
    expect(screen.getByLabelText('ACCEPTABLE_PATIENT_CONDITIONRadioButton')).toHaveAttribute('checked');
    expect(screen.getByLabelText('NO_ACCESS_PROBLEMS_POST_HDRadioButton')).toHaveAttribute('checked');
    expect(screen.getByLabelText('WITHOUT_DIFFICULTIESRadioButton')).toHaveAttribute('checked');
    expect(screen.getByText(format(new Date('2022-11-15T09:41:24.321z'), 'hh:mm aa'))).toBeInTheDocument();
    expect(screen.getByText(format(new Date('2022-11-15T11:41:53.832z'), 'hh:mm aa'))).toBeInTheDocument();
    expect(screen.getByText('02:00')).toBeInTheDocument();
    expect(screen.getByLabelText('UNEVENTFULRadioButton')).toHaveAttribute('checked');
    expect(screen.getByTestId('summaryTextTextInput')).toHaveTextContent('all is ok');
  });
});
