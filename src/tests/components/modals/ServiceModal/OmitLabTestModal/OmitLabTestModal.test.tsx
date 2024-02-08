import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { getTestStore, getTestStoreAndDispatch, render } from '@unit-tests/_utils';
import { AppointmentEventPlace, LabOrderStatus, LabTestTypes, OmitLabTestType, ServiceModalName } from '@enums';
import { act } from 'react-dom/test-utils';
import { addServiceModal, omitLabTest, removeServiceModal } from '@store';

describe('OmitLabTestModal', () => {
  const user = userEvent.setup();

  it('should render modal and all nested components', async () => {
    const modalData = {
      labTest: {
        id: 1,
        procedureName: 'Procedure name',
        status: LabOrderStatus.TO_PERFORM,
        type: LabTestTypes.Individual,
        createdAt: new Date(),
        dialysisBased: false,
      },
      appointmentId: 1,
      patientName: 'Patient Name',
      place: AppointmentEventPlace.Scheduler,
    };
    const store = getTestStore({
      serviceModal: { [ServiceModalName.OmitLabTest]: modalData },
    });

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    expect(screen.getByTestId('OmitLabTestModal')).toBeInTheDocument();
    expect(screen.getByText(modalData.labTest.procedureName)).toBeInTheDocument();
    expect(screen.getByTestId('OmitLabTestModalCloseIconWrapper')).toBeInTheDocument();
    expect(screen.getByTestId('OmitLabTestModalRadioGroup')).toBeInTheDocument();
    expect(screen.getByTestId(`${OmitLabTestType.RescheduleToNextSession}RadioButton`)).toBeInTheDocument();
    expect(screen.getByTestId(`${OmitLabTestType.OmitPermanently}RadioButton`)).toBeInTheDocument();
    expect(screen.getByTestId(`commentTextInput`)).toBeInTheDocument();
    expect(screen.getByTestId(`OmitLabTestModalCancelButton`)).toBeInTheDocument();
    expect(screen.getByTestId(`OmitLabTestModalSaveButton`)).toBeInTheDocument();
    expect(screen.getByText(`button.cancel`)).toBeInTheDocument();
    expect(screen.getByText(`button.save`)).toBeInTheDocument();
  });

  it('should render and submit the form', async () => {
    const comment = 'Comment value 123';
    const modalData = {
      labTest: {
        id: 1,
        procedureName: 'Procedure name',
        status: LabOrderStatus.TO_PERFORM,
        type: LabTestTypes.Individual,
        createdAt: new Date(),
        dialysisBased: false,
      },
      appointmentId: 1,
      patientName: 'Patient Name',
      place: AppointmentEventPlace.Scheduler,
    };
    const { store, dispatch } = getTestStoreAndDispatch(
      {
        serviceModal: { [ServiceModalName.OmitLabTest]: modalData },
      },
      true,
    );

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    await act(() => user.click(screen.getByTestId(`${OmitLabTestType.RescheduleToNextSession}RadioButton`)));
    await act(() => user.type(screen.getByTestId('commentTextInput'), comment));
    await act(() => user.click(screen.getByTestId('OmitLabTestModalSaveButton')));

    expect(dispatch).toHaveBeenCalledWith({
      type: addServiceModal.type,
      payload: {
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: expect.any(Function),
          confirmButton: 'button.continue',
          cancelButton: 'button.cancel',
          title: expect.any(String),
          text: expect.any(String),
        },
      },
    });

    dispatch.mockReset();

    expect(screen.getByTestId(`confirmModalConfirmButton`)).toBeInTheDocument();
    await act(() => user.click(screen.getByTestId(`confirmModalConfirmButton`)));

    expect(dispatch).toHaveBeenCalledWith({
      type: omitLabTest.type,
      payload: {
        type: OmitLabTestType.RescheduleToNextSession,
        comment,
        labOrderId: modalData.labTest.id,
        appointmentId: modalData.appointmentId,
        place: modalData.place,
      },
    });
  });

  it('should close modal with falsy isDirty', async () => {
    const modalData = {
      labTest: {
        id: 1,
        procedureName: 'Procedure name',
        status: LabOrderStatus.TO_PERFORM,
        type: LabTestTypes.Individual,
        createdAt: new Date(),
        dialysisBased: false,
      },
      appointmentId: 1,
      patientName: 'Patient Name',
      place: AppointmentEventPlace.Scheduler,
    };
    const { store, dispatch } = getTestStoreAndDispatch({
      serviceModal: { [ServiceModalName.OmitLabTest]: modalData },
    });

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    expect(screen.getByText(`button.cancel`)).toBeInTheDocument();

    await act(() => user.click(screen.getByText(`button.cancel`)));
    expect(dispatch).toHaveBeenCalledWith(removeServiceModal(ServiceModalName.OmitLabTest));
  });

  it('should close modal with truthy isDirty', async () => {
    const comment = 'Test comment 123';
    const modalData = {
      labTest: {
        id: 1,
        procedureName: 'Procedure name',
        status: LabOrderStatus.TO_PERFORM,
        type: LabTestTypes.Individual,
        createdAt: new Date(),
        dialysisBased: false,
      },
      appointmentId: 1,
      patientName: 'Patient Name',
      place: AppointmentEventPlace.Scheduler,
    };
    const { store, dispatch } = getTestStoreAndDispatch({
      serviceModal: { [ServiceModalName.OmitLabTest]: modalData },
    });

    await act(() =>
      render(<></>, {
        store,
      } as any),
    );

    expect(screen.getByText(`button.cancel`)).toBeInTheDocument();

    await act(() => user.type(screen.getByTestId('commentTextInput'), comment));

    await act(() => user.click(screen.getByText(`button.cancel`)));
    expect(dispatch).toHaveBeenCalledWith(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: expect.any(Function),
          title: 'closeWithoutSaving',
          text: 'dataLost',
          confirmButton: 'button.continue',
          cancelButton: 'button.cancel',
        },
      }),
    );
  });
});
