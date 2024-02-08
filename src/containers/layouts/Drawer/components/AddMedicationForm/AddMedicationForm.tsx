import { useEffect, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useForm, useFormState } from 'react-hook-form';
import {
  addMedication,
  changeMedication,
  clearMedicationSaveSuccessState,
  editMedication,
  selectMedicationForm,
  selectMedicationSaveDataSuccess,
  selectMedicationsLoading,
  selectSelectedMedicationStatus,
  removeDrawer,
  selectDrawerPayload,
  updateDrawer,
  addServiceModal,
  selectMedications,
  checkHasTodayEncounter,
} from '@store';
import CircularProgress from '@mui/material/CircularProgress';
import { MedicationForm, Option } from '@types';
import { AddMedicationFormView } from './AddMedicationFormView';
import {
  useAppDispatch,
  usePageUnload,
  useConfirmNavigation,
  useGetAllergyNoticeInfo,
  useDoctor,
  useDeletedUserValidation,
  useIgnoreFirstRenderEffect,
} from '@hooks';
import { capitalize, dateToServerFormat, parseFrequencyToSubmit } from '@utils';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import {
  MedicationDurationTypes,
  ServiceModalName,
  DrawerType,
  NoticeBlockType,
  MedicationDrawerType,
  DoctorTypes,
  MedicationPlaces,
  MedicationStatus,
} from '@enums';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';
import { isEmpty } from 'lodash';

const AddMedicationForm = () => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('medications');
  const dispatch = useAppDispatch();
  const { id: patientId, type, collapseAllRowsHandler } = selectDrawerPayload(DrawerType.Medication);
  const isSubmitting = selectMedicationsLoading();
  const isSaveSuccess = selectMedicationSaveDataSuccess();
  const formData = selectMedicationForm();
  const medicationStatus = selectSelectedMedicationStatus();
  const { noticeInfo } = useGetAllergyNoticeInfo(patientId);
  const medications = selectMedications();
  const selectedDoctor = formData ? medications.find((medication) => formData.id === medication.id)?.doctor : null;

  const setStartDateValue = () => {
    if (formData?.place === MedicationPlaces.AtHome) {
      return formData?.startDate;
    }
    if (formData?.place === MedicationPlaces.InCenter) {
      return undefined;
    }
    return new Date();
  };

  const setHdPrescriptionDateValue = () => {
    if (formData?.place === MedicationPlaces.AtHome && type === MedicationDrawerType.Edit) {
      return new Date(formData.prescriptionDate);
    }
    return new Date();
  };

  const defaultValues = useMemo(
    () => ({
      place: formData?.place || MedicationPlaces.AtHome,
      nameDrug: formData?.nameDrug,
      medicationGroup: formData?.medicationGroup,
      route: formData?.route,
      amount: formData?.amount,
      amounts: formData?.amounts || [],
      frequencyLongTerm:
        formData?.place === MedicationPlaces.AtHome ? formData?.frequencyLongTerm : { value: '', label: '' },
      frequencyDialysisRelated:
        formData?.place === MedicationPlaces.InCenter ? formData?.frequencyDialysisRelated : undefined,
      day: formData?.day || '',
      meal: formData?.meal,
      prescriptionDate: setHdPrescriptionDateValue(),
      durationType: formData?.durationType || MedicationDurationTypes.Unlimited,
      startDate: setStartDateValue(),
      visitsAmount: formData?.visitsAmount,
      dueDate: formData?.dueDate || null,
      doctorsName: formData?.doctorsName,
      doctorsSpecialityText: formData?.doctorsSpecialityText || '',
      doctorsSpecialitySelect: formData?.doctorsSpecialitySelect || null,
      comments: formData?.comments,
    }),
    [formData],
  );

  const { handleSubmit, control, watch, setValue, trigger, register, setError } = useForm<MedicationForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const { isDirty, errors } = useFormState({ control });
  const place = watch('place');
  const watchDoctorsName = watch('doctorsName');
  const { isExternalDoctor, specialities } = useDoctor(formData, watchDoctorsName, selectedDoctor);
  const hasErrors = !isEmpty(errors);

  useDeletedUserValidation('doctorsName', setError, watchDoctorsName);
  useConfirmNavigation(isDirty, ['/patients-overview']);
  usePageUnload(isDirty, tCommon('dataLost'));

  useEffect(() => {
    dispatch(checkHasTodayEncounter(patientId));
  }, []);

  useIgnoreFirstRenderEffect(() => {
    if (place === MedicationPlaces.InCenter) {
      setValue('day', t('form.dialysisDay'));
    } else {
      setValue('day', '');
    }
  }, [place]);

  useEffect(() => {
    if (isSaveSuccess) {
      dispatch(clearMedicationSaveSuccessState());
      dispatch(removeDrawer(DrawerType.Medication));
    }
  }, [isSaveSuccess]);

  useEffect(() => {
    dispatch(updateDrawer({ type: DrawerType.Medication, statuses: { isDirty } }));
    return () => {
      dispatch(updateDrawer({ type: DrawerType.Medication, statuses: { isDirty: false } }));
    };
  }, [isDirty]);

  const handleClose = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeDrawer(DrawerType.Medication)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeDrawer(DrawerType.Medication));
  };

  const onSubmit = ({ doctorsName, ...data }: MedicationForm) => {
    if (patientId) {
      const medicationData = {
        medication: {
          place: data.place,
          medicationUid: data.place === MedicationPlaces.AtHome ? null : data?.nameDrug?.uid ?? formData?.id,
          medicationName: data.place === MedicationPlaces.AtHome ? data?.nameDrug?.label! : null,
          medicationGroup: (data?.medicationGroup as Option)?.value,
          route: (data?.route as Option)?.value,
          amount: data.place === MedicationPlaces.AtHome ? data?.amount : null,
          amounts: data.place === MedicationPlaces.InCenter ? data?.amounts : null,
          frequency: parseFrequencyToSubmit(
            data.place === MedicationPlaces.AtHome ? data.frequencyLongTerm! : data.frequencyDialysisRelated!,
          ),
          day: data.day,
          meal: (data?.meal as Option)?.value,
          prescriptionDate: dateToServerFormat(data.prescriptionDate as Date),
          duration: {
            type: data.place === MedicationPlaces.InCenter ? data.durationType : null,
            startDate: data.place === MedicationPlaces.InCenter ? dateToServerFormat(data.startDate as Date) : null,
            visitsAmount:
              data.place === MedicationPlaces.InCenter && data.durationType === MedicationDurationTypes.VisitsAmount
                ? +data.visitsAmount
                : null,
            dueDate:
              data.place === MedicationPlaces.InCenter && data.durationType === MedicationDurationTypes.DueDate
                ? dateToServerFormat(data.dueDate as Date)
                : null,
          },
          doctor: {
            source: isExternalDoctor ? DoctorTypes.External : DoctorTypes.Internal,
            internalDoctorId: !isExternalDoctor ? data.doctorsSpecialitySelect : undefined,
            name: isExternalDoctor && doctorsName?.label ? capitalize(doctorsName.label) : undefined,
            speciality:
              isExternalDoctor && data?.doctorsSpecialityText ? capitalize(data.doctorsSpecialityText) : undefined,
          },
          comments: data.comments,
        },
        id: patientId,
      };

      if (formData) {
        if (type === MedicationDrawerType.Edit)
          dispatch(editMedication({ ...medicationData, medicationId: formData.id }));
        if (type === MedicationDrawerType.Confirm) {
          dispatch(
            editMedication({ ...medicationData, medicationId: formData.id, type: MedicationDrawerType.Confirm }),
          );
        }
        if (type === MedicationDrawerType.Change) {
          medicationStatus && medicationStatus === MedicationStatus.Discontinued
            ? dispatch(
                addMedication({
                  ...medicationData,
                  collapseAllTableRowsHandler: collapseAllRowsHandler,
                  isChangingDiscontinuedMedication: true,
                }),
              )
            : dispatch(
                changeMedication({
                  addMedicationData: medicationData,
                  discontinueMedicationData: {
                    orderedBy: {
                      source: isExternalDoctor ? DoctorTypes.External : DoctorTypes.Internal,
                      internalDoctorId: !isExternalDoctor ? data?.doctorsSpecialitySelect : undefined,
                      name: isExternalDoctor && doctorsName?.label ? capitalize(doctorsName.label) : undefined,
                    },
                    date: format(new Date(), 'yyyy-MM-dd'),
                    medicationId: formData.id,
                    patientId,
                  },
                  collapseAllTableRowsHandler: collapseAllRowsHandler,
                }),
              );
        }
      } else {
        dispatch(addMedication(medicationData));
      }
    }
  };

  return (
    <>
      <Stack spacing={2} direction="column" data-testid="addMedicationForm" sx={{ pb: 6.875 }}>
        <NoticeBlock
          type={noticeInfo.type}
          title={noticeInfo.title}
          text={noticeInfo.text}
          sx={[noticeInfo.type === NoticeBlockType.Error && { alignItems: 'flex-start' }]}
        />
        <AddMedicationFormView
          control={control}
          setValue={setValue}
          watch={watch}
          trigger={trigger}
          doctorSpecialities={specialities as []}
          isExternalDoctor={isExternalDoctor}
          register={register}
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
            <Button onClick={handleClose} variant={'outlined'} data-testid="cancelMedicationButton">
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant={'contained'}
              disabled={hasErrors || isSubmitting}
              data-testid="saveMedicationButton"
            >
              {type === MedicationDrawerType.Add && tCommon('button.save')}
              {type === MedicationDrawerType.Edit && tCommon('button.edit')}
              {type === MedicationDrawerType.Confirm && tCommon('button.confirm')}
              {type === MedicationDrawerType.Change && t('form.changePrescription')}
              {isSubmitting && (
                <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} data-testid="progressbar" />
              )}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default AddMedicationForm;
