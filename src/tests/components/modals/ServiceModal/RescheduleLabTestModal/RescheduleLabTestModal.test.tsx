import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { LabTestTypes, ServiceModalName } from '@enums';
import { format } from 'date-fns';
import { act } from 'react-dom/test-utils';

const labTestMock = {
  id: 1,
  dialysisBased: false,
  type: LabTestTypes.Urgent,
  procedureName: 'Test Procedure',
  createdAt: new Date(),
};

const slaveLabTestMock = { ...labTestMock, dialysisBased: true };

const modalPayloadMock = {
  labTest: labTestMock,
  appointmentId: 2,
};

const dialysisBasedTextMock = ', modals.dialysisDayOnly';

describe('RescheduleLabTestModal', () => {
  it('should correctly render lab test type label, if lab test is not dialysis based and not Quarterly BT', async () => {
    await act(() => {
      render(<></>, {
        preloadedState: { serviceModal: { [ServiceModalName.RescheduleLabTest]: { ...modalPayloadMock } } },
      });
    });

    expect(screen.getByText(`modals.labTestTypes.${labTestMock.type}`)).toBeInTheDocument();
  });

  it('should correctly render lab test type label, if lab test is dialysis based and not Quarterly BT', async () => {
    await act(() => {
      render(<></>, {
        preloadedState: {
          serviceModal: {
            [ServiceModalName.RescheduleLabTest]: {
              ...modalPayloadMock,
              labTest: { ...slaveLabTestMock },
            },
          },
        },
      });
    });

    expect(screen.getByText(`modals.labTestTypes.${labTestMock.type}${dialysisBasedTextMock}`)).toBeInTheDocument();
  });

  it('should correctly render lab test type label, if lab test is not dialysis based and Quarterly BT', async () => {
    await act(() => {
      render(<></>, {
        preloadedState: {
          serviceModal: {
            [ServiceModalName.RescheduleLabTest]: {
              ...modalPayloadMock,
              labTest: { ...labTestMock, type: LabTestTypes.Quarterly },
            },
          },
        },
      });
    });

    expect(
      screen.getByText(
        `modals.labTestTypes.${LabTestTypes.Quarterly} ${format(new Date(labTestMock.createdAt), 'yyyy')}`,
      ),
    ).toBeInTheDocument();
  });

  it('should correctly render lab test type label, if lab test is dialysis based and Quarterly BT', async () => {
    await act(() => {
      render(<></>, {
        preloadedState: {
          serviceModal: {
            [ServiceModalName.RescheduleLabTest]: {
              ...modalPayloadMock,
              labTest: { ...slaveLabTestMock, type: LabTestTypes.Quarterly },
            },
          },
        },
      });
    });

    expect(
      screen.getByText(
        `modals.labTestTypes.${LabTestTypes.Quarterly} ${format(
          new Date(labTestMock.createdAt),
          'yyyy',
        )}${dialysisBasedTextMock}`,
      ),
    ).toBeInTheDocument();
  });

  it('should not set options for shift select, if lab test is not dialysis based', async () => {
    await act(() => {
      render(<></>, {
        preloadedState: { serviceModal: { [ServiceModalName.RescheduleLabTest]: { ...modalPayloadMock } } },
      });
    });

    expect(screen.queryAllByRole('option').length).toBe(0);
  });
});
