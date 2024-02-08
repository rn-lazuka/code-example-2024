import { render } from '@unit-tests';
import { getCodeValueFromCatalog, getTimeFromDate } from '@utils';
import { Header } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/Header';
import { dialysisFixture, patient } from '@unit-tests/fixtures/dialysis';
import { DialysisStatus } from '@enums';
import userEvent from '@testing-library/user-event';
import { selectDialysisStatus } from '@store/slices/dialysisSlice';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';

const HeaderWithWrapper = () => {
  const status = selectDialysisStatus();
  return <Header patient={patient} status={status} isXs={false} />;
};

describe('DialysisProcedureModalHeader', () => {
  const user = userEvent.setup();

  it('should render patient info and step buttons', async () => {
    await act(() =>
      render(<HeaderWithWrapper />, {
        preloadedState: {
          ...dialysisFixture(DialysisStatus.PreDialysis),
          serviceModal: {},
        },
      }),
    );
    const header = screen.getByTestId('dialysisProcedureModalHeader');
    const closeArrow = screen.getByTestId('closeModalButton');

    expect(header).toBeInTheDocument();
    expect(closeArrow).toBeInTheDocument();
    // TODO Uncomment it and fix
    // expect(
    //   screen.getByText(
    //     `- ${patient.document.number} - ${getTimeFromDate(patient.birthDate)} - ${getCodeValueFromCatalog(
    //       'gender',
    //       patient.gender.code,
    //     )}`,
    //   ),
    // ).toBeTruthy();

    const serviceButton = screen.getByTestId(`${DialysisStatus.CheckIn}Tab`);
    const preHdButton = screen.getByTestId(`${DialysisStatus.PreDialysis}Tab`);
    const hdReadingButton = screen.getByTestId(`${DialysisStatus.HDReading}Tab`);
    const postHdButton = screen.getByTestId(`${DialysisStatus.PostDialysis}Tab`);

    expect(serviceButton).toBeInTheDocument();
    expect(preHdButton).toBeInTheDocument();
    expect(hdReadingButton).toBeInTheDocument();
    expect(postHdButton).toBeInTheDocument();
    expect(serviceButton.classList.contains('MuiTab-root')).toBe(true);
    expect(preHdButton.classList.contains('MuiTab-root')).toBe(true);
  });

  it('should render only services step button, when patient has no dialysis', () => {
    render(<HeaderWithWrapper />, {
      preloadedState: {
        ...dialysisFixture(DialysisStatus.PreDialysis, [], false),
        serviceModal: {},
      },
    });

    const serviceButton = screen.getByTestId(`${DialysisStatus.CheckIn}Tab`);
    const preHdButton = screen.queryByTestId(`${DialysisStatus.PreDialysis}Tab`);
    const hdReadingButton = screen.queryByTestId(`${DialysisStatus.HDReading}Tab`);
    const postHdButton = screen.queryByTestId(`${DialysisStatus.PostDialysis}Tab`);

    expect(serviceButton).toBeInTheDocument();
    expect(preHdButton).not.toBeInTheDocument();
    expect(hdReadingButton).not.toBeInTheDocument();
    expect(postHdButton).not.toBeInTheDocument();
    expect(screen.queryByTestId('dialysisServicesModalControlButtons')).not.toBeInTheDocument();
  });

  it('should render header without abort button', () => {
    render(<HeaderWithWrapper />, {
      preloadedState: {
        ...dialysisFixture(DialysisStatus.CheckIn),
        serviceModal: {},
      },
    });
    expect(screen.queryByTestId('abortDialysisButton')).not.toBeInTheDocument();
  });

  it('should render header with abort button and check that its working', async () => {
    render(<HeaderWithWrapper />, {
      preloadedState: {
        ...dialysisFixture(DialysisStatus.HDReading),
        serviceModal: {},
      },
    });

    const abortButton = screen.getByTestId('abortDialysisButton');

    expect(abortButton).toBeTruthy();

    await act(() => user.click(abortButton));
    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();
    expect(screen.getByTestId('GlobalConfirmModal').querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('areYouSureYouWantToAbort')).toBeInTheDocument();
    expect(screen.getByText('allDataWillBeLost')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalConfirmButton')));
    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });

  it('should render actions buttons, when patient has dialysis', () => {
    render(<HeaderWithWrapper />, {
      preloadedState: {
        ...dialysisFixture(DialysisStatus.PreDialysis, []),
        serviceModal: {},
      },
    });

    expect(screen.getByTestId('dialysisServicesModalControlButtons')).toBeInTheDocument();
  });
});
