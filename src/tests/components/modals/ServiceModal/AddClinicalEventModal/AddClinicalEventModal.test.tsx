import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { format } from 'date-fns';
import userEvent from '@testing-library/user-event';
import { addClinicalEventModalFixture, shifts } from '@unit-tests/fixtures';
import { ClinicalScheduleEventType, TargetAudience } from '@enums';

describe('AddClinicalEventModal', () => {
  const user = userEvent.setup();

  it('should render addClinicalEventModal', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({}),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    expect(screen.getByText('addEvent')).toBeInTheDocument();
    expect(screen.getByTestId('addClinicalEventModal')).toBeInTheDocument();
  });

  it('should render prefilled Custom form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({
            type: ClinicalScheduleEventType.CustomEvent,
            title: 'Custom title',
            comment: 'comment',
            date: new Date(),
            isAllDay: true,
            startTime: null,
            endTime: null,
          }),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    expect(screen.getByTestId('typeSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('typeSelectInput')).toHaveAttribute('value', ClinicalScheduleEventType.CustomEvent);
    expect(screen.getByTestId('titleTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('titleTextInput')).toBeInTheDocument();
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    expect(screen.getByText('comment')).toBeInTheDocument();
    expect(screen.getByTestId('dateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('dateDatePicker')).toHaveAttribute('value', format(new Date(), 'dd/MM/yyyy'));
    expect(screen.getByTestId('isAllDayCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('isAllDayCheckbox')).toHaveAttribute('checked');
    expect(screen.getByTestId('startTimeFormTimePicker')).toBeInTheDocument();
    expect(screen.getByTestId('startTimeFormTimePicker')).toHaveAttribute('disabled');
    expect(screen.getByTestId('endTimeFormTimePicker')).toBeInTheDocument();
    expect(screen.getByTestId('endTimeFormTimePicker')).toHaveAttribute('disabled');
  });

  it('should render prefilled Quarterly BT form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({
            type: ClinicalScheduleEventType.QuarterlyBloodTest,
            laboratory: { label: 'Test laboratory', value: '123' },
            comment: 'comment',
            date: new Date(),
            isAllDay: true,
            startTime: null,
            endTime: null,
          }),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    expect(screen.getByTestId('typeSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('typeSelectInput')).toHaveAttribute(
      'value',
      ClinicalScheduleEventType.QuarterlyBloodTest,
    );
    expect(screen.getByTestId('laboratoryFormAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('laboratoryFormAutocomplete')).toHaveAttribute('value', 'Test laboratory');
    expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    expect(screen.getByText('comment')).toBeInTheDocument();
    expect(screen.getByTestId('dateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('dateDatePicker')).toHaveAttribute('value', format(new Date(), 'dd/MM/yyyy'));
    expect(screen.getByTestId('isAllDayCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('isAllDayCheckbox')).toHaveAttribute('checked');
    expect(screen.getByTestId('startTimeFormTimePicker')).toBeInTheDocument();
    expect(screen.getByTestId('startTimeFormTimePicker')).toHaveAttribute('disabled');
    expect(screen.getByTestId('endTimeFormTimePicker')).toBeInTheDocument();
    expect(screen.getByTestId('endTimeFormTimePicker')).toHaveAttribute('disabled');
  });

  it('should render prefilled Nephrologist visit form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({
            type: ClinicalScheduleEventType.NephrologistVisit,
            doctor: { label: 'Mark Twain', value: '5' },
            comment: 'comment',
            targetAudience: TargetAudience.AssignedPatients,
            dialysisRelated: true,
            date: new Date(),
            isAllDay: true,
            startTime: null,
            endTime: null,
          }),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    expect(screen.getByTestId('typeSelectInput')).toBeInTheDocument();
    expect(screen.getByTestId('typeSelectInput')).toHaveAttribute('value', ClinicalScheduleEventType.NephrologistVisit);
    expect(screen.getByTestId('doctorAutocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('commentTextInput')).toBeInTheDocument();
    expect(screen.getByText('comment')).toBeInTheDocument();
    expect(screen.getByTestId('FOR_ASSIGNED_PATIENTSRadioButton')).toBeInTheDocument();
    expect(screen.getByLabelText('FOR_ASSIGNED_PATIENTSRadioButton')).toHaveAttribute('checked');
    expect(screen.getByTestId('dialysisRelatedCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('dialysisRelatedCheckbox')).toHaveAttribute('checked');
    expect(screen.getByText('form.warning')).toBeInTheDocument();
    expect(screen.getByLabelText('FOR_ALL_PATIENTSRadioButton')).not.toHaveAttribute('checked');
    expect(screen.getByTestId('dateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('dateDatePicker')).toHaveAttribute('value', format(new Date(), 'dd/MM/yyyy'));
    expect(screen.getByTestId('isAllDayCheckbox')).toBeInTheDocument();
    expect(screen.getByTestId('isAllDayCheckbox')).toHaveAttribute('checked');
    expect(screen.getByTestId('startTimeFormTimePicker')).toBeInTheDocument();
    expect(screen.getByTestId('startTimeFormTimePicker')).toHaveAttribute('disabled');
    expect(screen.getByTestId('endTimeFormTimePicker')).toBeInTheDocument();
    expect(screen.getByTestId('endTimeFormTimePicker')).toHaveAttribute('disabled');
  });

  it('should render prefilled PIC visit form with specific patients', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({
            type: ClinicalScheduleEventType.PICVisit,
            doctor: { label: 'Mark Twain', value: '5' },
            comment: 'comment',
            targetAudience: TargetAudience.SpecificPatients,
            dialysisRelated: false,
            date: new Date(),
            isAllDay: true,
            startTime: null,
            endTime: null,
            patients: [
              { id: '123', name: 'patient name', photoPath: '/testPath' },
              { id: '124', name: 'patient name2', photoPath: '/testPath' },
            ],
          }),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    expect(screen.getByTestId('FOR_SPECIFIC_PATIENTSRadioButton')).toBeInTheDocument();
    expect(screen.getByLabelText('FOR_SPECIFIC_PATIENTSRadioButton')).toHaveAttribute('checked');
    expect(screen.getByTestId('patientAutocomplete')).toBeInTheDocument();
    expect(screen.getByText('patient name')).toBeInTheDocument();
    expect(screen.getByText('patient name2')).toBeInTheDocument();
  });

  it('should show confirm modal after change targetAudience', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({
            type: ClinicalScheduleEventType.PICVisit,
            doctor: { label: 'Mark Twain', value: '5' },
            comment: 'comment',
            targetAudience: TargetAudience.SpecificPatients,
            dialysisRelated: false,
            date: new Date(),
            isAllDay: true,
            startTime: null,
            endTime: null,
            patients: [
              { id: '123', name: 'patient name', photoPath: '/testPath' },
              { id: '124', name: 'patient name2', photoPath: '/testPath' },
            ],
          }),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    const assignedRadioButton = screen.queryByTestId('FOR_ASSIGNED_PATIENTSRadioButton');
    await act(() => user.click(assignedRadioButton!));

    expect(screen.queryByTestId('GlobalConfirmModal')).toBeInTheDocument();
    expect(screen.queryByText('form.changeOption')).toBeInTheDocument();
    expect(screen.queryByText('form.removeList')).toBeInTheDocument();
    expect(screen.queryByTestId('confirmModalCancelButton')).toBeInTheDocument();
    expect(screen.queryByTestId('confirmModalConfirmButton')).toBeInTheDocument();
  });

  it('should close form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({}),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    const cancelButton = screen.queryByTestId('closeIcon');
    await act(() => user.click(cancelButton!));

    expect(screen.queryByTestId('addClinicalEventModal')).not.toBeInTheDocument();
  });

  it('should show confirm modal', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({}),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    const cancelButton = screen.queryByTestId('closeIcon');
    const commentInput = screen.queryByTestId('commentTextInput');

    await act(() => user.type(commentInput!, 'test comment'));
    await act(() => user.click(cancelButton!));

    expect(screen.queryByTestId('GlobalConfirmModal')).toBeInTheDocument();
    expect(screen.queryByText('closeWithoutSaving')).toBeInTheDocument();
    expect(screen.queryByText('dataLost')).toBeInTheDocument();
  });

  it('should show close form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addClinicalEventModalFixture({}),
          clinicalSchedule: {
            loading: false,
            shifts,
          },
        },
      }),
    );

    const cancelButton = screen.queryByTestId('closeIcon');
    const commentInput = screen.queryByTestId('commentTextInput');

    await act(() => user.type(commentInput!, 'test comment'));
    await act(() => user.click(cancelButton!));

    const confirmButton = screen.queryByTestId('confirmModalConfirmButton');
    await act(() => user.click(confirmButton!));

    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('addClinicalEventModal')).not.toBeInTheDocument();
  });
});
