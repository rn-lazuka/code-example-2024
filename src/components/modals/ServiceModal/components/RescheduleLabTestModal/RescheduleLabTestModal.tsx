import type { LabOrdersServiceResponse, ServiceModalProps, RescheduleLabTestForm } from '@types';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { format, isValid } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import { FormDatePicker, FormInputSelect } from '@components/FormComponents';
import { validatorRequired, validatorIsValidDate, validatorPastDate, validatorNoShiftsAvailable } from '@validators';
import { removeServiceModal, rescheduleLabTest, selectLabOrdersIsSubmitting, selectServiceModal } from '@store/slices';
import { useAppDispatch } from '@hooks';
import { AppointmentEventPlace, LabTestTypes, ServiceModalName } from '@enums';
import { API, getTenantStartCurrentDay } from '@utils';

const RescheduleLabTestModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const { t: tCommon } = useTranslation('common');
  const { t: tSchedule } = useTranslation('schedule');
  const { t } = useTranslation('labOrders');
  const onCloseHandler = () => dispatch(removeServiceModal(ServiceModalName.RescheduleLabTest));
  const {
    labTest,
    appointmentId,
    place,
  }: { labTest: LabOrdersServiceResponse; appointmentId: string; place: AppointmentEventPlace } = selectServiceModal(
    ServiceModalName.RescheduleLabTest,
  );

  const [shiftsOptions, setSiftsOptions] = useState<{ label: string; value: string }[]>([]);
  const [availableDates, setAvailableDates] = useState<{ date: string; shifts: { label: string; value: string }[] }[]>(
    [],
  );
  const isDialysisBased = labTest.dialysisBased;
  const dateValidators = { isValid: validatorIsValidDate, isPast: validatorPastDate };
  const isLoading = selectLabOrdersIsSubmitting();

  useEffect(() => {
    if (isDialysisBased) {
      getSlaveServicesAvailableDates();
    }
  }, []);

  const getSlaveServicesAvailableDates = async () => {
    try {
      const { data }: AxiosResponse<{ date: string; shift: { id: string; name: string } }[]> = await API.post(
        `/pm/appointments/${appointmentId}/rescheduling/slave/available`,
      );
      setAvailableDates(data.map(({ date, shift: { name, id } }) => ({ date, shifts: [{ label: name, value: id }] })));
    } catch (error) {
      console.error(error);
    }
  };

  const defaultValues: RescheduleLabTestForm = {
    day: null,
    shift: undefined,
  };
  const { handleSubmit, control, watch, setValue } = useForm<RescheduleLabTestForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const day = watch('day');

  useEffect(() => {
    if (!isDialysisBased) return;
    if (day && isValid(day)) {
      const shifts = availableDates.find(({ date }) => date === format(day, 'yyyy-MM-dd'))?.shifts;
      shifts && setSiftsOptions(shifts);
      shifts?.length && setValue('shift', shifts[0].value);
    } else {
      setSiftsOptions([]);
    }
  }, [day]);

  const getLabTestTypeLabel = () => {
    const { type, createdAt, dialysisBased } = labTest;
    const localizedTestType = t(`modals.labTestTypes.${labTest.type}`);
    const dialysisBasedText = dialysisBased ? `, ${t('modals.dialysisDayOnly')}` : '';

    if (type === LabTestTypes.Quarterly) {
      return `${localizedTestType} ${format(new Date(createdAt), 'yyyy')}${dialysisBasedText}`;
    }
    return `${localizedTestType}${dialysisBasedText}`;
  };

  const onSubmit = (data: RescheduleLabTestForm) => {
    dispatch(
      rescheduleLabTest({
        date: data.day as Date,
        type: labTest.type,
        appointmentId,
        labOrderId: labTest.id,
        place,
      }),
    );
  };

  return (
    <Dialog
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      sx={{ zIndex: index }}
      data-testid="rescheduleLabTestModal"
    >
      <Box sx={({ spacing }) => ({ m: 0, p: 2, width: spacing(43), maxWidth: spacing(87) })}>
        <Typography variant="headerS">{labTest.procedureName}</Typography>
        <IconButton
          onClick={onCloseHandler}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.icon.main,
          }}
          data-testid="closeIcon"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} direction="column" sx={{ width: 1, p: 2 }}>
          <Stack direction="column">
            <Typography variant="labelM">{t('modals.labTestType')}</Typography>
            <Typography variant="paragraphM">{getLabTestTypeLabel()}</Typography>
          </Stack>
          <FormDatePicker
            control={control}
            name="day"
            label={t('modals.day')}
            required
            shouldDisableDate={
              isDialysisBased
                ? (day) => !availableDates.find(({ date }) => date === format(day, 'yyyy-MM-dd'))
                : undefined
            }
            minDate={getTenantStartCurrentDay()}
            rules={{
              required: validatorRequired(),
              validate: !isDialysisBased
                ? dateValidators
                : {
                    ...dateValidators,
                    isNoShifts: validatorNoShiftsAvailable(
                      availableDates.map(({ date }) => date),
                      tSchedule('form.chosenDateIsOccupied'),
                    ),
                  },
            }}
          />
          <FormInputSelect
            control={control}
            options={shiftsOptions}
            name="shift"
            isDisabled
            label={t('modals.shift')}
          />
        </Stack>
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'no-wrap', p: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCloseHandler}
            fullWidth
            data-testid="rescheduleModalCancelButton"
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            fullWidth
            disabled={isLoading}
            data-testid="rescheduleModalSaveButton"
          >
            {tCommon('button.save')}
            {isLoading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleLabTestModal;
