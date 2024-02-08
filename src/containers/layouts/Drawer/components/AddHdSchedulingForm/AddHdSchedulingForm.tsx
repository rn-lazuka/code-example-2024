import { selectRestDay } from '@store/slices';
import { useEffect, useMemo, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useForm, useFormState } from 'react-hook-form';
import { useAppDispatch, useCallbackPrompt, usePageUnload } from '@hooks';
import Button from '@mui/material/Button';
import { AddHdSchedulingFormView } from './AddHdSchedulingFormView';
import type { HdSchedulingData, HdSchedulingForm } from '@types';
import {
  addHdSchedulingData,
  changeSchedulingFormStatus,
  selectHdSchedulingForm,
} from '@store/slices/hdPrescriptionSlice';
import { removeDrawer, selectDrawerPayload, updateDrawer } from '@store/slices/drawerSlice';
import { getAllowedPath, capitalizeFirstLetter } from '@utils';
import Box from '@mui/material/Box';
import { addServiceModal } from '@store/slices/serviceModalSlice';
import { ServiceModalName, DrawerType, DaysOfWeek, HdType, HDPrescriptionScheduleFrequency } from '@enums';
import { addMonths } from 'date-fns';
import { AddHocSchedulingForm } from '@containers/layouts/Drawer/components/AddHdSchedulingForm/AddHocSchedulingForm';
import Typography from '@mui/material/Typography';
import { FormInputRadio } from '@components/FormComponents';

const AddHdSchedulingForm = () => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('hdPrescription');
  const dispatch = useAppDispatch();
  const { id: patientId } = selectDrawerPayload(DrawerType.HdPrescriptionForm);
  const formData = selectHdSchedulingForm();
  const restDay = selectRestDay();

  const daysOfWeek = formData?.daysOfWeek || '';
  const isDayOffInDaysOfWeek = daysOfWeek.includes(restDay);

  const defaultValues: HdSchedulingForm = {
    hdType: formData?.hdType ?? HdType.Recurrent,
    frequency: formData?.frequency ?? HDPrescriptionScheduleFrequency.THREE_TIMES_PER_WEEK,
    daysOfWeek: isDayOffInDaysOfWeek ? '' : daysOfWeek,
    shift:
      formData?.shift && daysOfWeek && !isDayOffInDaysOfWeek
        ? { shiftId: formData.shift.shiftId, days: formData.daysOfWeek.split('_') as DaysOfWeek[] }
        : undefined,
    duration: formData?.duration ?? 240,
    startDate: formData?.startDate ? new Date(formData.startDate) : new Date(),
    endDate: formData?.endDate ? new Date(formData.endDate) : addMonths(new Date(), 3),
    hdSession: formData?.hdSession,
    dateShifts: formData?.dateShifts
      ? formData?.dateShifts
      : [{ date: null, shiftId: '', shiftName: '', duration: 240 }],
  };

  const { handleSubmit, control, watch, setValue, trigger, setError, clearErrors, getFieldState } =
    useForm<HdSchedulingForm>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues,
      shouldUnregister: true,
      shouldFocusError: true,
    });
  const { isDirty, isValid } = useFormState({ control });

  usePageUnload(isDirty, tCommon('dataLost'));
  const allowedPath = useMemo(() => getAllowedPath(patientId), [patientId]);
  const { showPrompt, confirmNavigation, cancelNavigation } = useCallbackPrompt(isDirty, allowedPath);
  const handleClose = () => {
    isDirty ? openConfirmModal() : dispatch(removeDrawer(DrawerType.HdScheduling));
  };
  const hdType = watch('hdType');

  const hdTypeOptions = useMemo(
    () => [
      { label: capitalizeFirstLetter(t('form.recurrent')), value: HdType.Recurrent },
      { label: capitalizeFirstLetter(t('form.adHok')), value: HdType.AdHoc },
    ],
    [],
  );

  const handleConfirmClose = () => {
    dispatch(removeDrawer(DrawerType.HdScheduling));
    confirmNavigation();
  };

  const openConfirmModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: handleConfirmClose,
          cancelCallback: () => cancelNavigation(),
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  const onSubmit = (data: HdSchedulingForm) => {
    if (data.hdType === HdType.Recurrent) {
      dispatch(addHdSchedulingData(data?.shift?.shiftId ? (data as HdSchedulingData) : null));
    } else {
      dispatch(addHdSchedulingData(data as HdSchedulingData));
    }

    dispatch(removeDrawer(DrawerType.HdScheduling));
  };

  useEffect(() => {
    dispatch(updateDrawer({ type: DrawerType.HdScheduling, statuses: { isDirty } }));
    dispatch(changeSchedulingFormStatus(isDirty));
    return () => {
      dispatch(updateDrawer({ type: DrawerType.HdScheduling, statuses: { isDirty: false } }));
    };
  }, [isDirty]);

  useEffect(() => {
    showPrompt && openConfirmModal();
  }, [showPrompt]);

  const onRadioButtonClick = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(
        addServiceModal({
          name: ServiceModalName.ConfirmModal,
          payload: {
            closeCallback: () => {
              setValue('hdType', hdType === HdType.Recurrent ? HdType.AdHoc : HdType.Recurrent);
            },
            title: tCommon('Change HD type?'),
            text: tCommon('dataLost'),
            confirmButton: tCommon('button.continue'),
          },
        }),
      );
    },
    [hdType],
  );

  return (
    <>
      <Stack direction="column" data-testid="addHdSchedulingForm" sx={{ pb: 6.875 }} spacing={2}>
        <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
          {t('form.hdType')}
        </Typography>
        <div onClick={onRadioButtonClick}>
          <FormInputRadio control={control} name="hdType" options={hdTypeOptions} />
        </div>
        {hdType === HdType.Recurrent ? (
          <AddHdSchedulingFormView
            control={control}
            watch={watch}
            setValue={setValue}
            trigger={trigger}
            defaultValues={defaultValues}
            clearErrors={clearErrors}
            setError={setError}
            getFieldState={getFieldState}
          />
        ) : (
          <AddHocSchedulingForm
            control={control}
            watch={watch}
            trigger={trigger}
            isValid={isValid}
            setValue={setValue}
          />
        )}

        <Box
          sx={(theme) => ({
            px: 1,
            py: 1,
            bgcolor: theme.palette.surface.default,
            borderTop: `solid 1px ${theme.palette.border.default}`,
            position: 'absolute',
            bottom: 0,
            width: `calc(100% - ${theme.spacing(4.5)})`,
            zIndex: theme.zIndex.drawer,
          })}
        >
          <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} variant={'outlined'} data-testid="cancelHdSchedulingButton">
              {tCommon('button.cancel')}
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant={'contained'} data-testid="saveHdSchedulingButton">
              {tCommon('button.save')}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default AddHdSchedulingForm;
