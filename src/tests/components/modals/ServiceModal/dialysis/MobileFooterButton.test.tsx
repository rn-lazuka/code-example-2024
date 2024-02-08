import { getTestStore, render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { MobileFooterButton } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/MobileFooterButton';
import { DialysisStatus, ServiceModalName } from '@enums';
import { patientDialysisFixture, prescriptionFixture } from '@unit-tests/fixtures';
import { addServiceModal, finishAndSaveHdClick, finishHdClick, setCurrentStep, startHdClick } from '@store';
import { Event } from '@services/Event/Event';

const defaultSystemState = {
  networkConnection: {
    isOnline: true,
  },
};

const defaultDialysisState = {
  isFutureAppointment: false,
  services: {},
};

const hemodialysisServiceState = prescriptionFixture();

const initiateTestStore = (preloadedState = {}) => {
  const dispatch = jest.fn();
  const store = getTestStore(preloadedState);
  store.dispatch = dispatch;
  return { store, dispatch };
};

describe('MobileFooterButton', () => {
  const user = userEvent.setup();
  let patient;

  beforeEach(() => {
    patient = patientDialysisFixture();
  });

  it('Should render only the wrapper', () => {
    const { store } = initiateTestStore({
      system: defaultSystemState,
      dialysis: defaultDialysisState,
    });

    render(
      <MobileFooterButton patient={patient} activeStep={DialysisStatus.CheckIn} currentStep={DialysisStatus.CheckIn} />,
      {
        store,
      } as any,
    );

    const wrapper = screen.getByTestId('dialysisProcedureModalMobileFooterButtonWrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.children?.length).toBe(0);
  });

  it("Should render in CheckIn status with prescription's data", async () => {
    const { store, dispatch } = initiateTestStore({
      system: defaultSystemState,
      dialysis: {
        ...defaultDialysisState,
        services: {
          hemodialysis: hemodialysisServiceState,
        },
      },
    });

    render(
      <MobileFooterButton patient={patient} activeStep={DialysisStatus.CheckIn} currentStep={DialysisStatus.CheckIn} />,
      {
        store,
      } as any,
    );

    const continueButton = screen.getByTestId('dialysisProcedureModalContinueButton');

    expect(continueButton).toBeInTheDocument();

    await act(() => user.click(continueButton));

    expect(dispatch).toHaveBeenCalledWith(setCurrentStep(DialysisStatus.PreDialysis));
  });

  it("Should render in PreDialysis status with prescription's data", async () => {
    const eventFireSpy = jest.spyOn(Event, 'fire').mockImplementation(() => {});
    const { store, dispatch } = initiateTestStore({
      system: defaultSystemState,
      dialysis: {
        ...defaultDialysisState,
        services: {
          hemodialysis: hemodialysisServiceState,
        },
      },
    });

    render(
      <MobileFooterButton
        patient={patient}
        activeStep={DialysisStatus.PreDialysis}
        currentStep={DialysisStatus.PreDialysis}
      />,
      {
        store,
      } as any,
    );

    const abortButton = screen.getByTestId('abortDialysisButton');
    const startHdButton = screen.getByTestId('dialysisProcedureModalStartHdButton');

    expect(abortButton).toBeInTheDocument();
    expect(startHdButton).toBeInTheDocument();

    await act(() => user.click(abortButton));

    expect(dispatch).toHaveBeenCalledWith(
      addServiceModal({ name: ServiceModalName.ConfirmModal, payload: expect.any(Object) }),
    );

    await act(() => user.click(startHdButton));
    expect(eventFireSpy).toHaveBeenCalledWith(startHdClick.type);
  });

  it("Should render in HDReading status with prescription's data", async () => {
    const eventFireSpy = jest.spyOn(Event, 'fire').mockImplementation(() => {});
    const { store } = initiateTestStore({
      system: defaultSystemState,
      dialysis: {
        ...defaultDialysisState,
        services: {
          hemodialysis: hemodialysisServiceState,
        },
      },
    });

    render(
      <MobileFooterButton
        patient={patient}
        activeStep={DialysisStatus.HDReading}
        currentStep={DialysisStatus.HDReading}
      />,
      {
        store,
      } as any,
    );

    const abortButton = screen.getByTestId('abortDialysisButton');
    const finishHdButton = screen.getByTestId('dialysisProcedureModalFinishHdButton');

    expect(abortButton).toBeInTheDocument();
    expect(finishHdButton).toBeInTheDocument();

    await act(() => user.click(finishHdButton));
    expect(eventFireSpy).toHaveBeenCalledWith(finishHdClick.type);
  });

  it("Should render in PostDialysis status with prescription's data", async () => {
    const eventFireSpy = jest.spyOn(Event, 'fire').mockImplementation(() => {});
    const { store } = initiateTestStore({
      system: defaultSystemState,
      dialysis: {
        ...defaultDialysisState,
        services: {
          hemodialysis: hemodialysisServiceState,
        },
      },
    });

    render(
      <MobileFooterButton
        patient={patient}
        activeStep={DialysisStatus.PostDialysis}
        currentStep={DialysisStatus.PostDialysis}
      />,
      {
        store,
      } as any,
    );

    const abortButton = screen.getByTestId('abortDialysisButton');
    const finishAndSaveButton = screen.getByTestId('dialysisProcedureModalFinishAndSaveButton');

    expect(abortButton).toBeInTheDocument();
    expect(finishAndSaveButton).toBeInTheDocument();

    await act(() => user.click(finishAndSaveButton));
    expect(eventFireSpy).toHaveBeenCalledWith(finishAndSaveHdClick.type);
  });
});
