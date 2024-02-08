import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useForm, useFormState } from 'react-hook-form';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { AddHdPrescriptionFormView } from './AddHdPrescriptionFormView';
import { HdPrescriptionForm, HdPrescriptionRequest, HdSchedulingData } from '@types';
import { useAppDispatch, useDoctor, usePageUnload, useConfirmNavigation, useDeletedUserValidation } from '@hooks';
import {
  addHdPrescription,
  addHdSchedulingData,
  changeSchedulingFormStatus,
  clearHdPrescriptionSaveSuccessState,
  selectHdPrescriptionForm,
  selectHdPrescriptionSaveDataSuccess,
  selectHdPrescriptionSubmitting,
  selectHdSchedulingForm,
  selectHdSchedulingFormDirtyStatus,
  removeDrawer,
  selectDrawerPayload,
  updateDrawer,
  addServiceModal,
  checkHasTodayEncounter,
  getPatientDialyzersList,
} from '@store';
import { ServiceModalName, DrawerType, DoctorTypes, HdPrescriptionStatuses, HdType } from '@enums';
import useIgnoreFirstRenderEffect from '@hooks/useIgnoreFirstRenderEffect';
import { format } from 'date-fns';
import {
  joinAndSortFrequencyDays,
  capitalizeFirstLetter,
  dateToServerFormat,
  countSessionsBetweenDates,
  Dictionaries,
} from '@utils';

const AddHdPrescriptionForm = () => {
  const { t } = useTranslation('hdPrescription');
  const { t: tCommon } = useTranslation('common');
  const { t: tAnticoagulantType } = useTranslation(Dictionaries.AnticoagulantType);
  const dispatch = useAppDispatch();
  const { id: patientId } = selectDrawerPayload(DrawerType.HdPrescriptionForm);
  const isSubmitting = selectHdPrescriptionSubmitting();
  const isSaveSuccess = selectHdPrescriptionSaveDataSuccess();
  const formData = selectHdPrescriptionForm();
  const schedulingFormData = selectHdSchedulingForm();
  const isHdSchedulingDirty = selectHdSchedulingFormDirtyStatus();
  const [showEmptySchedulingWarning, setShowEmptySchedulingWarning] = useState(false);

  useEffect(() => {
    dispatch(getPatientDialyzersList(patientId));
  }, []);

  const defaultValues: HdPrescriptionForm = {
    prescriptionDate: formData?.prescriptionDate ? new Date(formData.prescriptionDate) : new Date(),
    prescribedBy: formData?.prescribedBy,
    bloodFlow: formData?.bloodFlow,
    dryWeight: formData?.dryWeight,
    calcium: formData?.calcium,
    sodiumStart: formData?.sodiumStart || 140,
    sodiumEnd: formData?.sodiumEnd || 140,
    potassium: formData?.potassium || '2.0',
    temperature: formData?.temperature || 37.2,
    flow: formData?.flow || 500,
    anticoagulantType: formData?.anticoagulantType || {
      label: tAnticoagulantType('Unfractionated Heparin'),
      value: tAnticoagulantType('Unfractionated Heparin'),
    },
    primeDose: formData?.primeDose,
    bolusDose: formData?.bolusDose,
    hourlyDose: formData?.hourlyDose,
    comments: formData?.comments,
  };

  useEffect(() => {
    if (formData?.schedule?.recurrent || formData?.schedule?.adHoc) {
      let HdSchedulingFormData = {};

      if (formData.schedule.recurrent) {
        HdSchedulingFormData = {
          hdType: formData.schedule.recurrent ? HdType.Recurrent : HdType.AdHoc,
          daysOfWeek: joinAndSortFrequencyDays(formData?.schedule?.recurrent?.daysOfWeek, '_', false),
          frequency: formData?.schedule?.recurrent?.frequency!,
          shift: {
            shiftId: formData.schedule.recurrent?.shift?.id,
            shiftName: formData.schedule.recurrent?.shift?.name,
          },
          duration: formData.schedule.recurrent.duration,
          startDate: formData.schedule.recurrent.startedAt,
          endDate: formData.schedule.recurrent.endsAt,
          hdSession: countSessionsBetweenDates(
            formData.schedule.recurrent.startedAt,
            formData.schedule.recurrent.endsAt,
            formData.schedule.recurrent.frequency?.daysOfWeek!,
          ),
        };
      }

      if (formData.schedule.adHoc) {
        HdSchedulingFormData = {
          hdType: formData.schedule.recurrent ? HdType.Recurrent : HdType.AdHoc,
          dateShifts: formData.schedule.adHoc.dateShifts.map(({ duration, shiftId, shiftName, date }) => ({
            duration,
            shiftId,
            shiftName,
            date: new Date(date),
          })),
        };
      }
      dispatch(addHdSchedulingData(HdSchedulingFormData as HdSchedulingData));
    } else {
      dispatch(addHdSchedulingData(null));
    }
  }, [formData]);

  useIgnoreFirstRenderEffect(() => {
    if (schedulingFormData) {
      setShowEmptySchedulingWarning(false);
    }
  }, [schedulingFormData]);

  const { handleSubmit, control, trigger, watch, setError } = useForm<HdPrescriptionForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });
  const prescribedByField = watch('prescribedBy');

  const { isExternalDoctor } = useDoctor(formData, prescribedByField, formData?.prescribedBy);

  useDeletedUserValidation('prescribedBy', setError, prescribedByField);
  useConfirmNavigation(isDirty || isHdSchedulingDirty, ['/patients-overview']);
  usePageUnload(isDirty || isHdSchedulingDirty, tCommon('dataLost'));

  const handleClose = () => {
    isDirty || isHdSchedulingDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeDrawer(DrawerType.HdPrescriptionForm)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeDrawer(DrawerType.HdPrescriptionForm));
  };

  const onSubmit = ({ prescribedBy, prescriptionDate, ...data }: HdPrescriptionForm) => {
    if (patientId && prescribedBy && schedulingFormData) {
      let hdPrescriptionPayload: HdPrescriptionRequest = {
        ...data,
        prescriptionDate: dateToServerFormat(prescriptionDate as Date),
        prescribedBy: {
          source: isExternalDoctor ? DoctorTypes.External : DoctorTypes.Internal,
          internalDoctorId:
            !isExternalDoctor && prescribedBy?.specialities ? prescribedBy.specialities[0].id : undefined,
          name: isExternalDoctor ? capitalizeFirstLetter(prescribedBy.label) : undefined,
        },
        anticoagulantType: (data.anticoagulantType as any).value,
        dryWeight: Number(Number(data.dryWeight).toFixed(1)),
        schedule: {},
      };

      if (schedulingFormData.hdType === HdType.Recurrent) {
        hdPrescriptionPayload.schedule = {
          recurrent: {
            startedAt: dateToServerFormat(schedulingFormData.startDate! as Date),
            endsAt: dateToServerFormat(schedulingFormData.endDate! as Date),
            duration: schedulingFormData.duration,
            frequency: schedulingFormData.frequency!,
            daysOfWeek: schedulingFormData.daysOfWeek!.split('_'),
            shiftId: schedulingFormData.shift!.shiftId,
          },
        };
      } else {
        hdPrescriptionPayload.schedule = {
          adHoc: {
            dateShifts: schedulingFormData.dateShifts.map((shift) => ({
              ...shift,
              date: format(shift.date!, 'yyyy-MM-dd'),
            })),
          },
        };
      }

      dispatch(
        addHdPrescription({
          hdPrescription: hdPrescriptionPayload,
          id: patientId,
        }),
      );
    } else {
      setShowEmptySchedulingWarning(true);
    }
  };

  const confirmationBeforeSave = () => {
    if (formData?.status === HdPrescriptionStatuses.ACTIVE) {
      dispatch(
        addServiceModal({
          name: ServiceModalName.ConfirmModal,
          payload: {
            closeCallback: handleSubmit(onSubmit),
            title: t('modals.confirmOnChange.title'),
            text: t('modals.confirmOnChange.description'),
            confirmButton: tCommon('button.continue'),
          },
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(checkHasTodayEncounter(patientId));
    dispatch(changeSchedulingFormStatus(false));
  }, []);

  useEffect(() => {
    if (isSaveSuccess) {
      dispatch(clearHdPrescriptionSaveSuccessState());
    }
  }, [isSaveSuccess]);

  useEffect(() => {
    dispatch(
      updateDrawer({ type: DrawerType.HdPrescriptionForm, statuses: { isDirty: isDirty || isHdSchedulingDirty } }),
    );
    return () => {
      dispatch(updateDrawer({ type: DrawerType.HdPrescriptionForm, statuses: { isDirty: false } }));
    };
  }, [isDirty, isHdSchedulingDirty]);

  return (
    <>
      <Stack direction="column" data-testid="addHdPrescriptionForm" sx={{ pb: 6.875 }}>
        <Typography
          variant="labelMCaps"
          data-testid="addHdPrescriptionFormHeader"
          sx={(theme) => ({ color: theme.palette.text.secondary, mb: 2 })}
        >
          {t('form.header')}
        </Typography>
        <AddHdPrescriptionFormView
          control={control}
          trigger={trigger}
          showEmptySchedulingWarning={showEmptySchedulingWarning}
        />
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
            <Button onClick={handleClose} variant={'outlined'} data-testid="cancelHdPrescriptionButton">
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={
                formData?.status === HdPrescriptionStatuses.ACTIVE ? confirmationBeforeSave : handleSubmit(onSubmit)
              }
              variant={'contained'}
              disabled={isSubmitting}
              data-testid="saveHdPrescriptionButton"
            >
              {tCommon('button.save')}
              {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default AddHdPrescriptionForm;
