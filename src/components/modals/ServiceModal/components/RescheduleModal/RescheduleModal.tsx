import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import { Dialog, Stack } from '@mui/material';
import { FormDatePicker, FormInputSelect } from '@components/FormComponents';
import { validatorRequired } from '@validators/validatorRequired';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import { useForm } from 'react-hook-form';
import {
  removeServiceModal,
  rescheduleHdPrescription,
  rescheduleSlaveServices,
  selectScheduleLoading,
  selectServiceModal,
} from '@store/slices';
import { ServiceModalName } from '@enums/components';
import { ServicesType } from '@enums/components/ServicesType';
import CloseIcon from '@mui/icons-material/Close';
import { SkeletonWrapper as Skeleton } from '@components/Skeleton/Skeleton';
import { API } from '@utils/api';
import { format, isValid } from 'date-fns';
import type { AxiosResponse } from 'axios';
import { validatorIsValidDate } from '@validators/validatorIsValidDate';
import { getTenantStartCurrentDay } from '@utils/getTenantDate';
import { validatorPastDate } from '@validators/validatorPastDate';
import { validatorNoShiftsAvailable } from '@validators/validatorNoShiftsAvailable';
import { dateToServerFormat } from '@utils/dateFormat';

type RescheduleModalProps = {
  index: number;
};

const RescheduleModal = ({ index }: RescheduleModalProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('schedule');
  const dispatch = useAppDispatch();
  const isLoading = selectScheduleLoading();
  const { appointmentId, activeService, place } = selectServiceModal(ServiceModalName.RescheduleModal);
  const [availableDates, setAvailableDates] = useState<{ date: string; shifts: { label: string; value: string }[] }[]>(
    [],
  );
  const [shiftsOptions, setSiftsOptions] = useState<{ label: string; value: string }[]>([]);
  const isSlaveService = activeService.type === ServicesType.Medication || activeService.type === ServicesType.Vaccine;

  useEffect(() => {
    if (isSlaveService) {
      getSlaveServicesAvailableDates();
    } else {
      getHdServiceAvailableDates();
    }
  }, []);

  const getHdServiceAvailableDates = async () => {
    try {
      const { data }: AxiosResponse<{ date: string; shifts: { id: string; name: string }[] }[]> = await API.post(
        `/pm/appointments/${appointmentId}/rescheduling/hd/available`,
      );

      setAvailableDates(
        data.map(({ date, shifts }) => ({ date, shifts: shifts.map(({ id, name }) => ({ label: name, value: id })) })),
      );
    } catch (error) {
      console.error(error);
    }
  };

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

  const defaultValues: { day: Date | null; shift?: string } = {
    day: null,
    shift: undefined,
  };
  const { handleSubmit, control, watch, setValue } = useForm<{ day: Date | null; shift?: string }>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const day = watch('day');

  useEffect(() => {
    if (day && isValid(day)) {
      const shifts = availableDates.find(({ date }) => date === format(day, 'yyyy-MM-dd'))?.shifts;
      shifts && setSiftsOptions(shifts);
      shifts?.length && setValue('shift', shifts[0].value);
    } else {
      setSiftsOptions([]);
    }
  }, [day]);

  const onCloseHandler = () => dispatch(removeServiceModal(ServiceModalName.RescheduleModal));

  const onSubmit = (data: { day: Date | null; shift?: string }) => {
    if (isSlaveService) {
      dispatch(
        rescheduleSlaveServices({
          date: dateToServerFormat(data.day!),
          service: {
            [activeService.type === ServicesType.Medication ? 'medicationId' : 'vaccinationId']: activeService?.id,
          },
          appointmentId,
          place,
        }),
      );
    }
    if (!isSlaveService && data?.shift && data?.day) {
      dispatch(
        rescheduleHdPrescription({
          date: dateToServerFormat(data.day),
          shiftId: data.shift,
          appointmentId,
          place,
        }),
      );
    }
  };

  const getModalTitle = () => {
    switch (activeService?.type) {
      case ServicesType.Hemodialysis:
        return t('hdProcedure');
      case ServicesType.Medication:
        return t('medication');
      case ServicesType.Vaccine:
        return t('vaccination');
      default:
        return '';
    }
  };

  return (
    <Dialog
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      data-testid="rescheduleModal"
      sx={{ zIndex: index, '& .MuiDialog-paper': { m: 1 } }}
    >
      <Box sx={({ spacing }) => ({ m: 0, p: 2, width: spacing(43), maxWidth: spacing(87) })}>
        <Typography variant="headerS">{getModalTitle()}</Typography>
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
        {availableDates.length ? (
          <>
            <Stack spacing={2} direction="column" sx={{ width: 1, p: 2 }}>
              <FormDatePicker
                control={control}
                name="day"
                label={t('form.day')}
                required
                shouldDisableDate={(day) => !availableDates.find(({ date }) => date === format(day, 'yyyy-MM-dd'))}
                minDate={getTenantStartCurrentDay()}
                rules={{
                  required: validatorRequired(),
                  validate: {
                    isValid: validatorIsValidDate,
                    isPast: validatorPastDate,
                    isNoShifts: validatorNoShiftsAvailable(
                      availableDates.map(({ date }) => date),
                      t('form.chosenDateIsOccupied'),
                    ),
                  },
                }}
              />
              <FormInputSelect
                options={shiftsOptions}
                control={control}
                name="shift"
                required
                isDisabled={!shiftsOptions.length || isSlaveService}
                label={t('form.shift')}
                rules={{
                  required: validatorRequired(),
                }}
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
          </>
        ) : (
          <Stack spacing={2} direction="column" sx={{ width: 1, p: 2 }}>
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={64} />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
