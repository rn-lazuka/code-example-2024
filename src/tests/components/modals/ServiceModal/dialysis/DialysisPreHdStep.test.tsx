import { getTestStore, render } from '@unit-tests';
import { dialysisFixture, dialyzerFixture } from '@unit-tests/fixtures';
import { DialysisStatus } from '@enums';
import { waitFor, screen } from '@testing-library/dom';

const dispatch = jest.fn();

jest.mock('@hooks/useGetNursesOptions', () => ({
  useGetNursesOptions: jest.fn().mockReturnValue({
    nursesOptions: [{ label: 'test', value: 'test' }],
    userNurse: null,
  }),
}));

describe('DialysisPreHdStep', () => {
  it('should render the pre HD form with fields', async () => {
    const preloadedState = {
      ...dialysisFixture(DialysisStatus.PreDialysis),
      dialyzer: {
        dialyzers: [dialyzerFixture()],
      },
    };
    const store = getTestStore(preloadedState);
    store.dispatch = dispatch;
    await render(<></>, {
      store,
    });
    await waitFor(() => expect(screen.getByText(/form.initialInfo/i)).toBeTruthy());
    expect(screen.getByTestId(/initialBayNumberSelectInput/i)).toBeTruthy();
    expect(screen.getByTestId(/initialTreatmentNumberTextInput/i)).toBeTruthy();
    expect(screen.getByTestId(/initialTodayDatePicker/i)).toBeTruthy();
    expect(screen.getByTestId(/initialDurationTimeDurationPicker$/i)).toBeTruthy();
    expect(screen.getByText(/form.bloodPressureTemp/i)).toBeTruthy();
    expect(screen.getByText(/form.standingBp/i)).toBeTruthy();
    expect(screen.getByTestId(/standingSystolicBloodPressureTextInput/i)).toBeTruthy();
    expect(screen.getByTestId(/standingDiastolicBloodPressureTextInput/i)).toBeTruthy();
    expect(screen.getByTestId(/standingPulseTextInput/i)).toBeTruthy();
    expect(screen.getByText(/form.sittingBP/i)).toBeTruthy();
    expect(screen.getByTestId(/sittingSystolicBloodPressureTextInput/i)).toBeTruthy();
    expect(screen.getByTestId(/sittingDiastolicBloodPressureTextInput/i)).toBeTruthy();
    expect(screen.getByTestId(/sittingPulseTextInput/i)).toBeTruthy();
    expect(screen.getByTestId(/bodyTemperatureTextInput/i)).toBeTruthy();
    expect(screen.getByText(/form.patientsCondition/i)).toBeTruthy();
    expect(screen.getByLabelText(/ACCEPTABLE_PATIENT_CONDITIONRadioButton/i)).toBeTruthy();
    expect(screen.getByTestId(/SOME_PATIENT_ISSUESRadioButton/i)).toBeTruthy();
    expect(screen.getByText(/form.accessCondition/i)).toBeTruthy();
    expect(screen.getByLabelText(/NO_ACCESS_PROBLEMS_PRE_HDRadioButton/i)).toBeTruthy();
    expect(screen.getByTestId(/SOME_ACCESS_ISSUESRadioButton/i)).toBeTruthy();
  });

  it('should render loader if loading true', async () => {
    const preloadedState = {
      ...dialysisFixture(DialysisStatus.PreDialysis),
      dialysis: { ...dialysisFixture(DialysisStatus.PreDialysis).dialysis, loading: true },
    };
    const store = getTestStore(preloadedState);
    store.dispatch = dispatch;
    await render(<></>, {
      store,
    });
    await waitFor(() => expect(screen.getByTestId(/globalLoader/i)).toBeTruthy());
  });
});
