import {
  addServiceModal,
  selectDialysisAppointmentId,
  selectDialysisPatient,
  selectDialysisSkipInfo,
  selectIsDisableInterface,
  selectServiceModal,
  selectUserId,
  selectVaccinesService,
} from '@store/slices';
import { useTranslation } from 'react-i18next';
import DialysisServiceCard from '../../DialysisServiceCard';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { capitalizeFirstLetter, toAmPmTimeString } from '@utils';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import {
  AppointmentEventPlace,
  PatientStatuses,
  ServiceModalName,
  UserPermissions,
  VaccinationMedicationAdministeringStatus,
  VaccinationMedicationModalType,
  VaccinationStatus,
} from '@enums';
import Button from '@mui/material/Button';
import { useAppDispatch } from '@hooks/storeHooks';
import { VaccinationService } from '@types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Divider from '@mui/material/Divider';
import { PermissionGuard } from '@guards';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Tooltip from '@mui/material/Tooltip';
import { ServicesType } from '@enums/components/ServicesType';
import { CardDataRow } from '@src/components/DataRow';

export const DialysisServicesVaccineCard = ({ isXs }: { isXs: boolean }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('dialysis');
  const { t: tVaccination } = useTranslation('vaccination');
  const { t: tCommon } = useTranslation('common');
  const vaccines = selectVaccinesService() || [];
  const skipInfo = selectDialysisSkipInfo();
  const appointmentId = selectDialysisAppointmentId();
  const userId = selectUserId();
  const { patientId } = selectServiceModal(ServiceModalName.DialysisProcedureModal);
  const isDisabledInterface = selectIsDisableInterface();
  const patient = selectDialysisPatient();

  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;

  const openVaccineMedicationAdministeringModal = (
    vaccine,
    status: VaccinationMedicationAdministeringStatus,
    mode?: VaccinationMedicationModalType,
  ) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.VaccineMedicationAdministeringModal,
        payload: {
          patientId,
          vaccine,
          status,
          mode,
          appointmentId,
        },
      }),
    );
  };

  const openRescheduleModal = (vaccineId: number) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.RescheduleModal,
        payload: {
          appointmentId,
          activeService: { id: vaccineId, type: ServicesType.Vaccine },
          place: AppointmentEventPlace.Services,
        },
      }),
    );
  };

  const checkOnShowActionButtons = (status: VaccinationStatus): boolean => {
    const notSuitableStatuses = [VaccinationStatus.AdministeredInternal, VaccinationStatus.Omitted];
    return !isDisabledInterface && !skipInfo?.skipReason && !notSuitableStatuses.includes(status);
  };

  if (!vaccines.length) {
    return null;
  }

  return (
    <DialysisServiceCard title={tVaccination('tableView.vaccination')} isXs={isXs}>
      <Stack alignItems="flex-start">
        {vaccines.map((vaccine: VaccinationService) => (
          <Card
            key={vaccine.id}
            data-testid={`vaccine${vaccine.id}`}
            sx={({ spacing, palette }) => ({
              mb: 2,
              width: 1,
              bgcolor:
                vaccine.status === VaccinationStatus.Omitted ||
                vaccine.status === VaccinationStatus.AdministeredInternal
                  ? `${palette.background.default} !important`
                  : '#E9F0F6 !important',
              border: `solid 1px ${palette.border.default}`,
              borderRadius: `${spacing(1.5)} !important`,
            })}
          >
            <Stack
              direction={isXs ? 'column' : 'row'}
              alignItems={vaccine.status === VaccinationStatus.AdministeredInternal && !isXs ? 'center' : 'flex-start'}
              justifyContent="space-between"
              sx={[
                isXs && {
                  flexWrap: 'wrap',
                  '& > :not(:first-child)': { mt: 1 },
                },
                {
                  p: ({ spacing }) => spacing(2, 3),
                },
              ]}
            >
              <Stack direction="column">
                <Typography variant="labelL" sx={{ maxWidth: (theme) => theme.spacing(30.5) }}>
                  {capitalizeFirstLetter(vaccine.vaccineType.name)}
                </Typography>
                {vaccine.status === VaccinationStatus.NotDone && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VaccinesOutlinedIcon sx={({ palette }) => ({ fill: palette.error.main })} />
                    <Typography variant="labelM" sx={({ palette }) => ({ color: palette.text.darker })}>
                      {tVaccination(`statuses.${vaccine.status}`)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {skipInfo?.skipComment && (
                <Stack direction="row" spacing={0.5}>
                  <CancelIcon sx={{ fill: ({ palette }) => palette.error.main }} />
                  <Typography variant="labelM">{t('skipped')}</Typography>
                </Stack>
              )}
              {vaccine.status === VaccinationStatus.AdministeredInternal && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ fill: '#006D3C' }} />
                  <Typography variant="paragraphM">{tVaccination(`statuses.${vaccine.status}`)}</Typography>
                </Stack>
              )}
              {vaccine.status === VaccinationStatus.Omitted && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CancelIcon sx={{ fill: (theme) => theme.palette.error.main }} />
                  <Typography variant="paragraphM">{tVaccination(`statuses.${vaccine.status}`)}</Typography>
                </Stack>
              )}
            </Stack>
            <Divider sx={{ bgcolor: (theme) => `solid 1px ${theme.palette.border.default}` }} />
            <Stack direction="row">
              <Stack direction="column" sx={{ px: 3, py: 2, flex: 1 }}>
                <CardDataRow isXs={isXs} name={tVaccination('tableView.amount')} value={vaccine?.amount} />
                <CardDataRow
                  isXs={isXs}
                  name={tVaccination('tableView.dosingSchedule')}
                  value={vaccine?.dossingSchedule}
                />
                {(vaccine.status === VaccinationStatus.AdministeredInternal ||
                  vaccine.status === VaccinationStatus.Omitted) && (
                  <>
                    <CardDataRow
                      isXs={isXs}
                      name={tVaccination(
                        `form.${vaccine.status !== VaccinationStatus.Omitted ? 'administeredBy' : 'omittedBy'}`,
                      )}
                      value={
                        vaccine.status === VaccinationStatus.Omitted
                          ? vaccine?.omittedBy?.name
                          : vaccine?.administeredBy?.name
                      }
                      additionalValue={
                        vaccine.status === VaccinationStatus.AdministeredInternal
                          ? toAmPmTimeString(new Date(vaccine?.administeredAt))
                          : toAmPmTimeString(new Date(vaccine?.omittedAt))
                      }
                    />
                    {vaccine.editedBy && (
                      <CardDataRow
                        isXs={isXs}
                        name={tVaccination('tableView.editedBy')}
                        value={vaccine?.editedBy?.name}
                        additionalValue={toAmPmTimeString(new Date(vaccine?.editedAt))}
                      />
                    )}
                    <CardDataRow isXs={isXs} name={tVaccination('form.comments')} value={vaccine?.comment} />
                  </>
                )}
              </Stack>
            </Stack>
            <Divider sx={{ bgcolor: (theme) => `solid 1px ${theme.palette.border.default}` }} />
            {!isDisabledInterface &&
              !isUnavailableStatus &&
              (vaccine?.administeredBy?.id === userId || vaccine?.omittedBy?.id === userId) &&
              (vaccine.status === VaccinationStatus.AdministeredInternal ||
                vaccine.status === VaccinationStatus.Omitted) && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    py: 1,
                    px: 2,
                  }}
                >
                  <IconButton
                    onClick={() =>
                      openVaccineMedicationAdministeringModal(
                        vaccine,
                        vaccine.status === VaccinationStatus.Omitted
                          ? VaccinationMedicationAdministeringStatus.Omit
                          : VaccinationMedicationAdministeringStatus.Administering,
                        VaccinationMedicationModalType.Editing,
                      )
                    }
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Stack>
              )}
            {checkOnShowActionButtons(vaccine.status) && (
              <PermissionGuard permissions={UserPermissions.DialysisAddMeasurement}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    p: ({ spacing }) => spacing(2, 3),
                  }}
                  justifyContent={isXs ? 'center' : 'flex-end'}
                  useFlexGap={isXs}
                  flexWrap={isXs ? 'wrap' : 'nowrap'}
                >
                  {!skipInfo?.hasEncounter && (
                    <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{ flexBasis: isXs ? '45%' : 'inherit' }}
                        disabled={isUnavailableStatus}
                        onClick={() => openRescheduleModal(vaccine.id)}
                      >
                        {tVaccination('service.reschedule')}
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                    <Button
                      variant="outlined"
                      size="large"
                      disabled={isUnavailableStatus}
                      sx={{ flexBasis: isXs ? '50%' : 'inherit' }}
                      onClick={() =>
                        openVaccineMedicationAdministeringModal(vaccine, VaccinationMedicationAdministeringStatus.Omit)
                      }
                    >
                      {tVaccination('service.omit')}
                    </Button>
                  </Tooltip>
                  <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ flexBasis: isXs ? '100%' : 'inherit' }}
                      disabled={isUnavailableStatus}
                      onClick={() =>
                        openVaccineMedicationAdministeringModal(
                          vaccine,
                          VaccinationMedicationAdministeringStatus.Administering,
                        )
                      }
                    >
                      {tVaccination('service.administer')}
                    </Button>
                  </Tooltip>
                </Stack>
              </PermissionGuard>
            )}
          </Card>
        ))}
      </Stack>
    </DialysisServiceCard>
  );
};
