import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import {
  clearInitialDialysisData,
  closeDialysisModal,
  reactivateAppointment,
  selectDialysisAppointmentDate,
  selectDialysisAppointmentId,
  selectDialysisLoading,
  selectDialysisPatient,
  selectDialysisSkipInfo,
  selectHemodialysisServiceStatus,
  selectServicesAppointmentDate,
  selectWithDialysis,
} from '@store/slices/dialysisSlice';
import { addServiceModal, removeServiceModal } from '@store/slices/serviceModalSlice';
import { useAppDispatch } from '@hooks/storeHooks';
import { DialysisServicesLaboratoryCard } from './components/DialysisServicesLaboratoryCard';
import {
  AppointmentEventPlace,
  HdPrescriptionStatuses,
  PatientStatuses,
  ServiceModalName,
  UserPermissions,
  UserRoles,
} from '@enums';
import { DialysisServicesPrescriptionCard } from './components/DialysisServicesPrescriptionCard';
import { DialysisServicesDoctorReviewCard } from './components/DialysisServicesDoctorReviewCard';
import { DialysisServicesMedicationCard } from './components/DialysisServicesMedicationCard';
import { Event } from '@services/Event/Event';
import { DialysisServicesVaccineCard } from './components/DialysisServicesVaccineCard';
import { selectLabOrdersIsFileLoading, selectUserRoles } from '@store/slices';
import { GlobalLoader } from '@components/GlobalLoader/GlobalLoader';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import { theme } from '@src/styles';
import { getCodeValueFromCatalog } from '@utils/getOptionsListFormCatalog';
import { dateFormat, toAmPmTimeString } from '@utils/dateFormat';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import { PermissionGuard } from '@guards/PermissionGuard';
import { getPersonNameWithDeletedSyfix } from '@utils/getPersonNameWithDeletedSyfix';
import { ServicesType } from '@enums/components/ServicesType';
import { API } from '@utils/api';
import { DialysisServiceStepDataRow } from './components/DialysisServiceStepDataRow';

export const DialysisServicesStep = ({ isXs }: { isXs: boolean }) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const skipInfo = selectDialysisSkipInfo();
  const loading = selectDialysisLoading();
  const appointmentId = selectDialysisAppointmentId();
  const isFileLoading = selectLabOrdersIsFileLoading();
  const [reactivateAvailability, setReactivateAvailability] = useState(false);
  const patient = selectDialysisPatient();
  const withDialysis = selectWithDialysis();
  const hdServiceStatus = selectHemodialysisServiceStatus();
  const userRoles = selectUserRoles();
  const servicesAppointmentDate = selectServicesAppointmentDate();
  const dialysisAppointmentDate = selectDialysisAppointmentDate();

  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;

  useEffect(() => {
    const onCloseDialysisModal = () => {
      dispatch(clearInitialDialysisData());
      dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal));
    };
    Event.subscribe(closeDialysisModal.type, onCloseDialysisModal);
    return () => Event.unsubscribe(closeDialysisModal.type, onCloseDialysisModal);
  }, []);

  const openSkipAppointmentModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.SkipAppointmentModal,
        payload: {
          appointmentId,
          skipInfo,
          previousSkipped: skipInfo?.previousSkipped,
          reason: skipInfo?.skipReason,
          skipPlace: AppointmentEventPlace.Services,
        },
      }),
    );
  };

  const openRescheduleAppointmentModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.RescheduleModal,
        payload: {
          appointmentId,
          activeService: { type: ServicesType.Hemodialysis },
          place: AppointmentEventPlace.Services,
        },
      }),
    );
  };
  const openReactivateAppointmentModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => {
            dispatch(reactivateAppointment(appointmentId));
          },
          title: t('modal.areYouSureReactivateAppointment'),
          text: '',
          confirmButton: tCommon('button.reactivate'),
        },
      }),
    );
  };

  useEffect(() => {
    if (!userRoles.includes(UserRoles.ROLE_DOCTOR)) {
      API.get(`pm/appointments/${appointmentId}/reactivation/available`)
        .then(({ data }) => {
          setReactivateAvailability(data.available);
        })
        .catch((error) => console.error(error));
    }
  }, [appointmentId]);

  useEffect(() => {
    if (servicesAppointmentDate && servicesAppointmentDate !== dialysisAppointmentDate) {
      dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal));
    }
  }, [servicesAppointmentDate, dialysisAppointmentDate]);

  const actionButtonsStyles = { textTransform: 'none' };

  return (
    <>
      {(isFileLoading || loading) && <GlobalLoader />}
      <Stack
        direction="column"
        data-testid="dialysisServicesStep"
        sx={{
          pb: theme.spacing(0),
          pt: 2,
          pr: theme.spacing(isXs ? 2 : 3),
          pl: theme.spacing(isXs ? 2 : 3),
        }}
      >
        <Stack direction="column" spacing={2} alignItems="center">
          {!loading && (
            <Box
              display="flex"
              flexDirection={!isXs || (isXs && skipInfo?.skipComment) ? 'row' : 'column'}
              justifyContent="space-between"
              width={1}
              sx={{ maxWidth: (theme) => theme.spacing(87) }}
            >
              <Typography variant={isXs ? 'headerM' : 'headerL'}>{t('appointmentServices')}</Typography>
              {withDialysis && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={(theme) => ({
                    mb: isXs && skipInfo?.skipComment ? theme.spacing(2) : 0,
                    mt: isXs && !skipInfo?.skipComment && !skipInfo?.hasEncounter ? theme.spacing(2) : 0,
                  })}
                >
                  {skipInfo?.skipComment && reactivateAvailability && (
                    <PermissionGuard permissions={[UserPermissions.DialysisReactivateAppointment]}>
                      <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                        <Button
                          data-testid="dialysisServicesStepReactivateButton"
                          variant="outlined"
                          disabled={isUnavailableStatus}
                          size="large"
                          onClick={openReactivateAppointmentModal}
                          sx={actionButtonsStyles}
                        >
                          {t('reactivate')}
                        </Button>
                      </Tooltip>
                    </PermissionGuard>
                  )}
                  {!skipInfo?.skipComment && !skipInfo?.hasEncounter && (
                    <>
                      <PermissionGuard permissions={[UserPermissions.DialysisRescheduleAppointment]}>
                        <Tooltip
                          title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''}
                          enterTouchDelay={0}
                        >
                          <Button
                            data-testid="dialysisServicesStepRescheduleButton"
                            variant="outlined"
                            disabled={isUnavailableStatus}
                            size="large"
                            onClick={openRescheduleAppointmentModal}
                            fullWidth={isXs}
                            sx={actionButtonsStyles}
                          >
                            {<Typography variant={isXs ? 'labelM' : 'labelL'}>{t('reschedule')}</Typography>}
                          </Button>
                        </Tooltip>
                      </PermissionGuard>
                      <PermissionGuard permissions={[UserPermissions.DialysisDeleteAppointment]}>
                        <Button
                          data-testid="dialysisServicesStepSkipAppointmentButton"
                          variant="outlined"
                          size="large"
                          onClick={openSkipAppointmentModal}
                          fullWidth={isXs}
                          sx={actionButtonsStyles}
                        >
                          {<Typography variant={isXs ? 'labelM' : 'labelL'}>{t('skipAppointment')}</Typography>}
                        </Button>
                      </PermissionGuard>
                    </>
                  )}
                </Stack>
              )}
            </Box>
          )}
          {!loading &&
            skipInfo?.skipReason &&
            withDialysis &&
            hdServiceStatus !== HdPrescriptionStatuses.DISCONTINUED && (
              <>
                <DialysisServiceStepDataRow
                  isXs={isXs}
                  name={t('appointmentStatus')}
                  value={
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CancelIcon sx={{ fill: ({ palette }) => palette.error.main }} />
                      <Typography variant="labelM">{t('skipped')}</Typography>
                      <IconButton
                        onClick={openSkipAppointmentModal}
                        sx={{ p: 0, '&:hover': { backgroundColor: 'unset' } }}
                      >
                        <EditOutlinedIcon sx={{ ml: 1 }} />
                      </IconButton>
                    </Stack>
                  }
                />
                <DialysisServiceStepDataRow
                  isXs={isXs}
                  name={t('reasonForSkipping')}
                  value={skipInfo?.skipReason ? getCodeValueFromCatalog('skippingReasons', skipInfo.skipReason) : null}
                />
                <DialysisServiceStepDataRow
                  isXs={isXs}
                  name={t('skippedBy')}
                  value={getPersonNameWithDeletedSyfix(skipInfo?.skippedBy)}
                  additionalValue={`${dateFormat(skipInfo?.skippedAt)} ${toAmPmTimeString(
                    new Date(skipInfo?.skippedAt),
                  )}`}
                />
                {skipInfo?.editedBy && (
                  <DialysisServiceStepDataRow
                    isXs={isXs}
                    name={t('editedBy')}
                    value={getPersonNameWithDeletedSyfix(skipInfo?.editedBy)}
                    additionalValue={`${dateFormat(skipInfo?.editedAt)} ${toAmPmTimeString(
                      new Date(skipInfo?.editedAt),
                    )}`}
                  />
                )}
                <DialysisServiceStepDataRow isXs={isXs} name={t('comments')} value={skipInfo?.skipComment} />
              </>
            )}
          <DialysisServicesPrescriptionCard isXs={isXs} />
          <DialysisServicesMedicationCard isXs={isXs} />
          <DialysisServicesVaccineCard isXs={isXs} />
          <DialysisServicesLaboratoryCard isXs={isXs} />
          <DialysisServicesDoctorReviewCard isXs={isXs} />
        </Stack>
      </Stack>
    </>
  );
};

export default DialysisServicesStep;
