import type { Theme } from '@mui/material/styles';
import type {
  VaccinationService,
  ServiceModalProps,
  VaccinationMedicationAdministeringForm,
  VaccinationMedicationResolutionRequest,
  MedicationsService,
} from '@types';
import { Dialog, DialogContent, Grid, Skeleton, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  addServiceModal,
  removeServiceModal,
  saveAdministeringVaccinationMedication,
  selectDialysisIsSubmitting,
  selectDialysisPatient,
  selectServiceModal,
} from '@store';
import { NoticeBlock } from '@components';
import CloseIcon from '@mui/icons-material/Close';
import {
  NoticeBlockType,
  ServiceModalName,
  VaccinationMedicationAdministeringStatus,
  VaccinationMedicationModalType,
  VaccinationMedicationResolution,
  VaccinationStatus,
  VaccineMedicationServiceType,
} from '@enums';
import Stack from '@mui/material/Stack';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import { useAppDispatch, useConfirmNavigation, useGetAllergyNoticeInfo, usePageUnload } from '@hooks';
import { useForm, useFormState } from 'react-hook-form';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { capitalizeFirstLetter, dateTimeToServerFormat, getCodeValueFromCatalog } from '@utils';
import VaccineMedicationAdministeringForm from '@components/modals/ServiceModal/components/VaccineMedicationAdministeringModal/VaccineMedicationAdminiteringForm';

interface VaccineMedicationAdministeringModalPayload {
  patientId: number;
  vaccine?: VaccinationService;
  medication?: MedicationsService;
  status: VaccinationMedicationAdministeringStatus;
  serviceType: VaccineMedicationServiceType;
  mode?: VaccinationMedicationModalType;
  appointmentId: number;
}

const VaccineMedicationAdministeringModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const { t: tVaccination } = useTranslation('vaccination');
  const { t: tMedication } = useTranslation('medications');
  const { t: tCommon } = useTranslation('common');
  const patient = selectDialysisPatient();
  const isSubmitting = selectDialysisIsSubmitting();
  const {
    patientId,
    vaccine,
    medication,
    status,
    serviceType,
    mode,
    appointmentId,
  }: VaccineMedicationAdministeringModalPayload = selectServiceModal(
    ServiceModalName.VaccineMedicationAdministeringModal,
  );
  const { noticeInfo, noticeLoading } = useGetAllergyNoticeInfo(patientId);
  const isMedication = serviceType === VaccineMedicationServiceType.Medication;
  const showForm = !noticeLoading;
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const getAdministeredByValue = () => {
    if (vaccine?.administeredBy) {
      return {
        label: vaccine.administeredBy.name,
        value: vaccine.administeredBy.id,
      };
    }

    if (medication?.administeredBy) {
      return {
        label: medication.administeredBy.name,
        value: medication.administeredBy.id,
      };
    }

    return { label: '', value: '' };
  };

  const getAdministeredTimeValue = () => {
    if (vaccine?.administeredAt) {
      return new Date(vaccine.administeredAt);
    }
    if (medication?.administeredAt) {
      return new Date(medication.administeredAt);
    }
    return new Date();
  };

  const getStatusValue = (): VaccinationMedicationResolution | undefined => {
    if (vaccine?.omittedBy?.id) {
      return vaccine.resolution;
    }
    if (medication?.omittedBy?.id) {
      return medication.resolution;
    }
    return VaccinationMedicationResolution.Rescheduled;
  };

  const getCommentValue = () => {
    if (vaccine?.comment) {
      return vaccine.comment;
    }

    if (medication?.comments) {
      return medication.comments;
    }
    return '';
  };

  const defaultValues: VaccinationMedicationAdministeringForm = {
    administeredBy: getAdministeredByValue(),
    administeredTime: getAdministeredTimeValue(),
    status: getStatusValue(),
    comments: getCommentValue(),
  };

  const { handleSubmit, control, setValue, watch } = useForm<VaccinationMedicationAdministeringForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const currentVaccineMedicationStatus = watch('status');
  const { isDirty } = useFormState({ control });

  useConfirmNavigation(isDirty, []);
  usePageUnload(isDirty, tCommon('dataLost'));
  const onCloseHandler = () => {
    dispatch(removeServiceModal(ServiceModalName.VaccineMedicationAdministeringModal));
  };

  if (
    (serviceType === VaccineMedicationServiceType.Vaccine && !vaccine) ||
    (serviceType === VaccineMedicationServiceType.Medication && !medication)
  )
    return null;

  const openCancellationModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: onCloseHandler,
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  const onSubmit = ({ administeredBy, ...data }: VaccinationMedicationAdministeringForm) => {
    if (administeredBy) {
      const resolution: VaccinationMedicationResolutionRequest = {
        resolution:
          status === VaccinationMedicationAdministeringStatus.Omit
            ? data.status
            : VaccinationMedicationResolution.Administered,
        administeredAt:
          status !== VaccinationMedicationAdministeringStatus.Omit && !isMedication
            ? dateTimeToServerFormat(data.administeredTime)
            : undefined,
        time:
          status !== VaccinationMedicationAdministeringStatus.Omit && isMedication
            ? dateTimeToServerFormat(data.administeredTime)
            : undefined,
        administeredBy: status !== VaccinationMedicationAdministeringStatus.Omit ? +administeredBy.value : undefined,
        comment: !isMedication ? data?.comments : undefined,
        comments: isMedication ? data?.comments : undefined,
        ...(isMedication && status === VaccinationMedicationAdministeringStatus.Administering
          ? { amount: medication?.amount }
          : { amount: vaccine?.amount }),
      };
      dispatch(
        saveAdministeringVaccinationMedication({
          serviceId: isMedication ? +medication!.id : vaccine!.id,
          resolution,
          serviceType: isMedication ? VaccineMedicationServiceType.Medication : VaccineMedicationServiceType.Vaccine,
          mode,
          appointmentId,
        }),
      );
    }
  };

  const openConfirmModal = () => {
    let title = '';
    let text = '';
    const vaccineTranslatingData = {
      vaccineName: vaccine?.vaccineType?.name,
      dosingSchedule: getCodeValueFromCatalog('dosingSchedule', vaccine?.dossingSchedule || ''),
      patientName: patient?.patientName,
    };
    const medicationTranslatingData = {
      medicationName: medication?.medication.name,
      patientName: patient?.patientName,
    };
    if (status === VaccinationMedicationAdministeringStatus.Administering) {
      title = isMedication
        ? tMedication('form.youAreGoingToAdminister', medicationTranslatingData)
        : tVaccination('form.youAreGoingToAdminister', vaccineTranslatingData);
      text = tCommon('actionCanNotBeUndone');
    }
    if (status === VaccinationMedicationAdministeringStatus.Omit) {
      const medicationCode =
        currentVaccineMedicationStatus === VaccinationMedicationResolution.Rescheduled
          ? 'youAreGoingToReschedule'
          : 'youAreGoingToOmit';
      const vaccinationCode =
        currentVaccineMedicationStatus === VaccinationMedicationResolution.Rescheduled
          ? 'youAreGoingToReschedule'
          : 'youAreGoingToOmit';

      title = isMedication
        ? tMedication(`form.${medicationCode}`, medicationTranslatingData)
        : tVaccination(`form.${vaccinationCode}`, vaccineTranslatingData);

      if (currentVaccineMedicationStatus === VaccinationMedicationResolution.Rescheduled) {
        text = isMedication
          ? tMedication('form.actionWillBeMarkedAsOmitted')
          : tVaccination('form.actionWillBeMarkedAsOmitted');
      } else {
        text = tCommon('actionCanNotBeUndone');
      }
    }
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: handleSubmit(onSubmit),
          title,
          text,
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  return (
    <Dialog
      open={true}
      disableEnforceFocus
      onClose={openCancellationModal}
      data-testid="vaccineAdministeringModal"
      sx={{ zIndex: index, '& .MuiDialog-paper': { m: 1 } }}
    >
      <Box
        sx={{
          m: 0,
          p: 2,
          width: (theme) => (isXs ? theme.spacing(43) : theme.spacing(83.5)),
          maxWidth: (theme) => theme.spacing(87),
        }}
      >
        <Stack
          direction={isMedication ? 'row' : 'column'}
          spacing={isMedication ? 1 : 0}
          alignItems={isMedication ? 'center' : 'flex-start'}
        >
          <Typography variant="headerS">
            {capitalizeFirstLetter(isMedication ? medication!.medication.name : vaccine!.vaccineType.name)}
          </Typography>
          {!isMedication && (
            <>
              <Typography variant="labelM" sx={({ palette }) => ({ color: palette.text.darker })}>
                {`${getCodeValueFromCatalog('dosingSchedule', vaccine!.dossingSchedule)} ${tVaccination('dose')}`}
              </Typography>
              {vaccine!.status === VaccinationStatus.NotDone && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <VaccinesOutlinedIcon sx={({ palette }) => ({ fill: palette.error.main })} />
                  <Typography variant="paragraphM" sx={({ palette }) => ({ color: palette.text.darker })}>
                    {tVaccination(`statuses.${vaccine!.status}`)}
                  </Typography>
                </Stack>
              )}
            </>
          )}
        </Stack>
        <IconButton
          onClick={openCancellationModal}
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
      <DialogContent dividers sx={{ p: 2 }}>
        {showForm ? (
          <Stack direction="column" spacing={2}>
            <NoticeBlock
              type={noticeInfo.type}
              title={noticeInfo.title}
              text={noticeInfo.text}
              sx={[noticeInfo.type === NoticeBlockType.Error && { alignItems: 'flex-start' }]}
            />
            <VaccineMedicationAdministeringForm
              control={control}
              setValue={setValue}
              status={status}
              isMedication={isMedication}
              mode={mode}
            />
          </Stack>
        ) : (
          <>
            <Skeleton height={30} />
            <Grid container rowSpacing={2} columnSpacing={2} mb={2}>
              <Grid item xs={6}>
                <Skeleton height={60} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={60} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={60} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={60} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={60} />
              </Grid>
            </Grid>
            <Skeleton height={30} />
          </>
        )}
      </DialogContent>
      {showForm && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2 }}>
          <Button
            disabled={isSubmitting}
            onClick={openCancellationModal}
            variant="outlined"
            data-testid="cancelAdministerVaccineFormButton"
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            onClick={openConfirmModal}
            variant={'contained'}
            disabled={isSubmitting}
            data-testid="submitAdministerVaccineFormButton"
          >
            {tCommon('button.save')}
            {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      )}
    </Dialog>
  );
};

export default VaccineMedicationAdministeringModal;
