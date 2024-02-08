import type { ServiceModalProps } from '@types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import {
  getPatientActiveHd,
  removeServiceModal,
  resetPatientActiveHd,
  selectPatientActiveHd,
  selectServiceModal,
} from '@store/slices';
import { ServiceModalName } from '@enums/components';
import { useAppDispatch } from '@hooks/storeHooks';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { DataRow } from '@components/DataRow';
import { format } from 'date-fns';
import {
  getPersonNameWithDeletedSyfix,
  dateFormat,
  countSessionsBetweenDates,
  getHoursAndMinutes,
  joinAndSortFrequencyDays,
} from '@utils';
import { Dialog, DialogContent, Skeleton } from '@mui/material';

export const ShowHdParamsModal = ({ index }: ServiceModalProps) => {
  const { patientId } = selectServiceModal(ServiceModalName.ShowHdParamsModal);
  const dispatch = useAppDispatch();
  const patientActiveHd = selectPatientActiveHd();
  const { t } = useTranslation('schedule');
  const { t: tHdPrescription } = useTranslation('hdPrescription');
  const hasVirus = patientActiveHd?.isolationGroup?.isolations?.length > 0;

  useEffect(() => {
    patientId && dispatch(getPatientActiveHd(patientId));

    return () => {
      dispatch(resetPatientActiveHd());
    };
  }, [patientId]);

  const onCloseHandler = () => {
    dispatch(removeServiceModal(ServiceModalName.ShowHdParamsModal));
  };

  return (
    <Dialog
      disableEnforceFocus
      open={true}
      onClose={onCloseHandler}
      data-testid="showHdParamsModal"
      sx={{ zIndex: index }}
    >
      <Box sx={{ m: 0, p: 3, pb: 0, minWidth: (theme) => theme.spacing(87) }}>
        <Typography variant="headerM">{t('Active Hemodialysis Prescription')}</Typography>
        <IconButton
          onClick={onCloseHandler}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.icon.main,
          }}
          data-testid="showHdParamsModalCloseButton"
        >
          <CloseOutlinedIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 3 }}>
        {!patientActiveHd ? (
          <Stack direction="column" spacing={1}>
            {[...Array(20).keys()].map((number) => (
              <Skeleton height={30} key={number} />
            ))}
          </Stack>
        ) : (
          <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={1}>
              <Typography variant="labelL">{t('addHocEventForm.generalInfo')}</Typography>
              <DataRow
                title={tHdPrescription('tableView.prescribedBy')}
                value={getPersonNameWithDeletedSyfix(patientActiveHd.prescribedBy)}
                additionalValue={patientActiveHd.prescriptionDate ? dateFormat(patientActiveHd.prescriptionDate) : '—'}
              />
              <DataRow
                title={tHdPrescription('tableView.enteredBy')}
                value={getPersonNameWithDeletedSyfix(patientActiveHd.enteredBy)}
                additionalValue={
                  patientActiveHd.enteredAt ? format(new Date(patientActiveHd.enteredAt), 'dd/MM/yyyy hh:mm a') : '—'
                }
              />
              <DataRow title={tHdPrescription('tableView.bloodFlow')} value={patientActiveHd.bloodFlow} />
              <DataRow title={tHdPrescription('tableView.dryWeight')} value={patientActiveHd.dryWeight} />
            </Stack>
            <Stack direction="column" spacing={1}>
              <Typography variant="labelL">{t('addHocEventForm.dialysate')}</Typography>
              <DataRow title={tHdPrescription('tableView.calcium')} value={patientActiveHd.calcium} />
              <DataRow title={tHdPrescription('tableView.sodiumStart')} value={patientActiveHd.sodiumStart} />
              <DataRow title={tHdPrescription('tableView.sodiumEnd')} value={patientActiveHd.sodiumEnd} />
              <DataRow title={tHdPrescription('tableView.potassium')} value={patientActiveHd.potassium} />
              <DataRow title={tHdPrescription('tableView.temperature')} value={patientActiveHd.temperature} />
              <DataRow title={tHdPrescription('tableView.flowQd')} value={patientActiveHd.flow} />
            </Stack>
            <Stack direction="column" spacing={1}>
              <Typography variant="labelL">{t('addHocEventForm.anticoagulant')}</Typography>
              <DataRow
                title={tHdPrescription('tableView.anticoagulantType')}
                value={patientActiveHd.anticoagulantType}
              />
              <DataRow title={tHdPrescription('tableView.primeDoseUnits')} value={patientActiveHd.primeDose} />
              <DataRow title={tHdPrescription('tableView.bolusDoseUnits')} value={patientActiveHd.bolusDose} />
              <DataRow title={tHdPrescription('tableView.hourlyDoseUnits')} value={patientActiveHd.hourlyDose} />
            </Stack>
            <Stack direction="column" spacing={1}>
              <Typography variant="labelL">{t('addHocEventForm.schedule')}</Typography>
              <DataRow
                title={tHdPrescription('tableView.isolation')}
                value={tHdPrescription(`form.${hasVirus ? 'isolated' : 'nonInfection'}`)}
              />
              {patientActiveHd.schedule.recurrent ? (
                <>
                  <DataRow
                    title={tHdPrescription('tableView.frequency')}
                    value={tHdPrescription(`frequencyCodes.${patientActiveHd.schedule.recurrent.frequency}`)}
                  />
                  <DataRow
                    title={tHdPrescription('form.days')}
                    value={`${joinAndSortFrequencyDays(patientActiveHd.schedule.recurrent.daysOfWeek, ', ')} - ${
                      patientActiveHd?.schedule.recurrent.shift.name
                    } ${tHdPrescription('form.shift')}`}
                  />
                  <DataRow
                    title={tHdPrescription('tableView.duration')}
                    value={getHoursAndMinutes(patientActiveHd?.schedule.recurrent.duration)}
                  />
                  <DataRow
                    title={tHdPrescription('tableView.startDate')}
                    value={
                      patientActiveHd?.schedule.recurrent?.startedAt
                        ? format(new Date(patientActiveHd.schedule.recurrent.startedAt), 'dd/MM/yyyy')
                        : ''
                    }
                  />
                  <DataRow
                    title={tHdPrescription('tableView.endDate')}
                    value={
                      patientActiveHd?.schedule.recurrent?.endsAt
                        ? format(new Date(patientActiveHd.schedule.recurrent.endsAt), 'dd/MM/yyyy')
                        : ''
                    }
                  />
                  <DataRow
                    title={tHdPrescription('tableView.hdSessions')}
                    value={
                      patientActiveHd?.schedule.recurrent?.startedAt && patientActiveHd?.schedule.recurrent?.endsAt
                        ? countSessionsBetweenDates(
                            patientActiveHd.schedule.recurrent.startedAt,
                            patientActiveHd.schedule.recurrent.endsAt,
                            patientActiveHd.schedule.recurrent.daysOfWeek,
                          )
                        : ''
                    }
                  />
                </>
              ) : (
                <>
                  {patientActiveHd?.schedule.adHoc?.dateShifts &&
                    patientActiveHd?.schedule.adHoc.dateShifts.map(({ date, shift, duration }, index) => (
                      <DataRow
                        key={shift.id}
                        title={`${tHdPrescription('form.day')} ${index + 1}`}
                        value={`${format(new Date(date), 'dd/MM/yyyy')} - ${shift.name} ${t(
                          'form.shift',
                        )} (${getHoursAndMinutes(Number(duration))})`}
                      />
                    ))}
                </>
              )}
            </Stack>
            <Stack direction="column" spacing={1}>
              <Typography variant="labelL">{t('addHocEventForm.comments')}</Typography>
              <Typography
                variant="labelM"
                sx={({ palette }) => ({
                  mt: `0 !important`,
                  color: palette.text.secondary,
                })}
              >
                {patientActiveHd.comments ?? '—'}
              </Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShowHdParamsModal;
