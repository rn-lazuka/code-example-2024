import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { useAppDispatch } from '@hooks/storeHooks';
import {
  addServiceModal,
  removeServiceModal,
  selectDialysisAppointmentId,
  selectDialysisPatient,
  selectDialysisSkipInfo,
  selectIsDisableInterface,
  selectMedicationsService,
  selectServiceModal,
  selectUserId,
} from '@store';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import type { MedicationsService } from '@types';
import { ROUTES } from '@constants';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { capitalizeFirstLetter, getPersonNameWithDeletedSyfix } from '@utils';
import {
  AppointmentEventPlace,
  MedicationFrequency,
  PatientStatuses,
  ServiceModalName,
  VaccinationMedicationAdministeringStatus,
  VaccinationMedicationModalType,
  VaccinationMedicationResolution,
  VaccineMedicationServiceType,
} from '@enums';
import DialysisServiceCard from '../../DialysisServiceCard';
import { format } from 'date-fns';
import medicationFrequency from '@translations/en/dictionaries/medicationFrequencyAll.json';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Tooltip from '@mui/material/Tooltip';
import { ServicesType } from '@enums/components/ServicesType';
import { Divider } from '@mui/material';
import { CardDataRow } from '@src/components/DataRow';

export const DialysisServicesMedicationCard = ({ isXs }: { isXs: boolean }) => {
  const dispatch = useAppDispatch();
  const medications = selectMedicationsService() || [];
  const { t } = useTranslation('dialysis');
  const { t: tMedications } = useTranslation('medications');
  const { t: tCommon } = useTranslation('common');
  const isDisabledInterface = selectIsDisableInterface();
  const skipInfo = selectDialysisSkipInfo();
  const appointmentId = selectDialysisAppointmentId();
  const { patientId } = selectServiceModal(ServiceModalName.DialysisProcedureModal);
  const userId = selectUserId();
  const patient = selectDialysisPatient();

  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;

  const openVaccineMedicationAdministeringModal = (
    medication: MedicationsService,
    status: VaccinationMedicationAdministeringStatus,
    mode?: VaccinationMedicationModalType,
  ): void => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.VaccineMedicationAdministeringModal,
        payload: {
          patientId,
          medication,
          status,
          serviceType: VaccineMedicationServiceType.Medication,
          mode,
          appointmentId,
        },
      }),
    );
  };

  const openRescheduleModal = (medicationId: string) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.RescheduleModal,
        payload: {
          appointmentId,
          activeService: { id: medicationId, type: ServicesType.Medication },
          place: AppointmentEventPlace.Services,
        },
      }),
    );
  };

  const getFrequencyString = (medication: MedicationsService) => {
    if (!medication.frequency) return medicationFrequency.EVERY_DIALYSIS;
    if (medication.frequency === MedicationFrequency.OTHER) return medicationFrequency[MedicationFrequency.OTHER];
    return medicationFrequency[medication.frequency] || '—';
  };

  if (!medications.length) {
    return null;
  }

  return (
    <DialysisServiceCard title={tMedications('medication')} isXs={isXs}>
      <Stack alignItems="flex-start">
        {medications.map((medication: MedicationsService) => {
          const isOmitted =
            medication.resolution === VaccinationMedicationResolution.Omitted ||
            medication.resolution === VaccinationMedicationResolution.Rescheduled;
          return (
            <Card
              key={medication.id}
              data-testid={`medication${medication.id}`}
              sx={({ spacing, palette }) => ({
                mb: 2,
                width: 1,
                backgroundColor:
                  medication.resolution === undefined
                    ? '#E9F0F6 !important'
                    : `${palette.background.default} !important`,
                border: `solid 1px ${palette.border.default}`,
                borderRadius: `${spacing(1.5)} !important`,
              })}
            >
              <Stack
                direction={isXs ? 'column' : 'row'}
                alignItems={isXs ? 'flex-start' : 'center'}
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="labelL">{capitalizeFirstLetter(medication.medication.name)}</Typography>
                </Stack>
                <Stack direction="row">
                  {medication.resolution === VaccinationMedicationResolution.Administered && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon sx={{ fill: '#006D3C' }} />
                      <Typography variant="paragraphM">{tMedications('service.administered')}</Typography>
                    </Stack>
                  )}
                  {isOmitted && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CancelIcon sx={{ fill: (theme) => theme.palette.error.main }} />
                      <Typography variant="paragraphM">{tCommon('omitted')}</Typography>
                    </Stack>
                  )}
                  {skipInfo?.skipComment && (
                    <Stack direction="row" spacing={0.5}>
                      <CancelIcon sx={{ fill: ({ palette }) => palette.error.main }} />
                      <Typography variant="labelM">{t('skipped')}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
              <Divider sx={{ bgcolor: (theme) => `solid 1px ${theme.palette.border.default}` }} />
              <Stack
                sx={{
                  py: 2,
                  px: 3,
                  flex: 1,
                }}
              >
                <CardDataRow
                  isXs={isXs}
                  name={tMedications('form.medicationGroup')}
                  value={medication.medicationGroup}
                />
                <CardDataRow isXs={isXs} name={tMedications('form.route')} value={medication.route} />
                <CardDataRow isXs={isXs} name={tMedications('form.amount')} value={medication.amount} />
                <CardDataRow isXs={isXs} name={tMedications('form.frequency')} value={getFrequencyString(medication)} />
                <CardDataRow isXs={isXs} name={tMedications('form.day')} value={medication.day} />
                {medication.resolution !== undefined && (
                  <>
                    {medication.administeredAt && (
                      <CardDataRow
                        isXs={isXs}
                        name={tMedications('service.administeredBy')}
                        value={
                          <Box sx={{ display: 'flex', alignItems: 'center' }} color="primary.main">
                            <Typography variant="labelM">
                              {getPersonNameWithDeletedSyfix(medication.administeredBy)}
                            </Typography>
                          </Box>
                        }
                        additionalValue={format(new Date(medication.administeredAt), 'hh:mm a')}
                      />
                    )}
                    {medication.omittedAt && (
                      <CardDataRow
                        isXs={isXs}
                        name={tCommon('omittedBy')}
                        value={
                          <Box
                            component={Link}
                            sx={{ display: 'flex', alignItems: 'center' }}
                            color="primary.main"
                            onClick={() => dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal))}
                            to={`${ROUTES.main}${ROUTES.patientsOverview}/${medication.omittedBy?.id}/${ROUTES.patientProfile}`}
                          >
                            <Typography variant="labelM">
                              {getPersonNameWithDeletedSyfix(medication.omittedBy)}
                            </Typography>
                          </Box>
                        }
                        additionalValue={format(new Date(medication.omittedAt), 'hh:mm a')}
                      />
                    )}
                    {medication.editedAt && (
                      <CardDataRow
                        isXs={isXs}
                        name={tMedications('service.editedBy')}
                        value={
                          <Box
                            component={Link}
                            sx={{ display: 'flex', alignItems: 'center' }}
                            color="primary.main"
                            onClick={() => dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal))}
                            to={`${ROUTES.main}${ROUTES.patientsOverview}/${medication.editedBy?.id}/${ROUTES.patientProfile}`}
                          >
                            <Typography variant="labelM">
                              {getPersonNameWithDeletedSyfix(medication.editedBy)}
                            </Typography>
                          </Box>
                        }
                        additionalValue={format(new Date(medication.editedAt), 'hh:mm a')}
                      />
                    )}
                    <CardDataRow isXs={isXs} name={tMedications('form.comments')} value={medication.comments} />
                  </>
                )}
              </Stack>
              <Divider sx={{ bgcolor: (theme) => `solid 1px ${theme.palette.border.default}` }} />
              {(isOmitted || medication.resolution === VaccinationMedicationResolution.Administered) &&
                (medication?.administeredBy?.id === userId || medication?.omittedBy?.id === userId) &&
                !isDisabledInterface &&
                !isUnavailableStatus && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      py: 1,
                      px: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        openVaccineMedicationAdministeringModal(
                          medication,
                          isOmitted
                            ? VaccinationMedicationAdministeringStatus.Omit
                            : VaccinationMedicationAdministeringStatus.Administering,
                          VaccinationMedicationModalType.Editing,
                        );
                      }}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                  </Stack>
                )}

              {!medication.resolution && !skipInfo?.skipComment && !isDisabledInterface && (
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
                        onClick={() => openRescheduleModal(medication.id)}
                      >
                        {tMedications('button.reschedule')}
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
                        openVaccineMedicationAdministeringModal(
                          medication,
                          VaccinationMedicationAdministeringStatus.Omit,
                        )
                      }
                    >
                      {tMedications('button.omit')}
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
                          medication,
                          VaccinationMedicationAdministeringStatus.Administering,
                        )
                      }
                    >
                      {tMedications('button.administer')}
                    </Button>
                  </Tooltip>
                </Stack>
              )}
            </Card>
          );
        })}
      </Stack>
    </DialysisServiceCard>
  );
};
