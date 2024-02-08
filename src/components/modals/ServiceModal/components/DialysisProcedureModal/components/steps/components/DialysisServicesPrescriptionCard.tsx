import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  countSessionsBetweenDates,
  dateFormat,
  getHoursAndMinutes,
  joinAndSortFrequencyDays,
  getDoctorName,
  getPersonNameWithDeletedSyfix,
} from '@utils';
import {
  selectDialysisIsolationGroup,
  selectDialysisLoading,
  selectHemodialysisService,
  selectWithDialysis,
} from '@store';
import DialysisServiceCard from '../../DialysisServiceCard';
import { DaysOfWeek } from '@enums';

export const DialysisServicesPrescriptionCard = ({ isXs }: { isXs: boolean }) => {
  const prescription = selectHemodialysisService();
  const isLoading = selectDialysisLoading();
  const { t: tService } = useTranslation('dialysis', { keyPrefix: 'dialysisServices.hemodialysis' });
  const isolationGroup = selectDialysisIsolationGroup();
  const withDialysis = selectWithDialysis();

  if (!withDialysis) {
    return null;
  }

  return (
    <DialysisServiceCard isCollapsable title={tService('activePrescription')} isXs={isXs}>
      {withDialysis && prescription && !isLoading && (
        <Paper
          sx={({ spacing }) => ({
            padding: spacing(2, 3),
          })}
        >
          <Stack direction="column">
            <Column title={tService('generalInfo')}>
              {renderDataRow(
                isXs,
                tService('prescribedBy'),
                getDoctorName(prescription.prescribedBy),
                prescription.prescriptionDate ? dateFormat(prescription.prescriptionDate) : '—',
              )}
              {renderDataRow(
                isXs,
                tService('enteredBy'),
                getPersonNameWithDeletedSyfix(prescription.enteredBy),
                prescription.enteredAt ? format(new Date(prescription.enteredAt), 'dd/MM/yyyy hh:mm a') : '—',
              )}
              {renderDataRow(isXs, tService('bloodFlow'), prescription.bloodFlow)}
              {renderDataRow(isXs, tService('dryWeight'), prescription.dryWeight)}
            </Column>
            <Column title={tService('dialysate')} mt={1}>
              {renderDataRow(isXs, tService('calcium'), prescription.calcium)}
              {renderDataRow(isXs, tService('sodiumStart'), prescription.sodiumStart)}
              {renderDataRow(isXs, tService('sodiumEnd'), prescription.sodiumEnd)}
              {renderDataRow(isXs, tService('potassium'), prescription.potassium)}
              {renderDataRow(isXs, tService('temperature'), prescription.temperature)}
              {renderDataRow(isXs, tService('flowQd'), prescription.flow)}
            </Column>
            <Column title={tService('anticoagulant')} mt={1}>
              {renderDataRow(isXs, tService('anticoagulantType'), prescription.anticoagulantType)}
              {renderDataRow(isXs, tService('primeDoseUnits'), prescription.primeDose)}
              {renderDataRow(isXs, tService('bolusDoseUnits'), prescription.bolusDose)}
              {renderDataRow(isXs, tService('hourlyDoseUnits'), prescription.hourlyDose)}
            </Column>
            <Column title={tService('scheduling')} mt={1}>
              {isolationGroup?.name && renderDataRow(isXs, tService('isolation'), isolationGroup.name)}
              {prescription.schedule?.recurrent ? (
                <>
                  {renderDataRow(
                    isXs,
                    tService('frequency'),
                    tService(`frequencyCodes.${prescription.schedule.recurrent!.frequency}`),
                  )}
                  {renderDataRow(
                    isXs,
                    tService('days'),
                    `${joinAndSortFrequencyDays(prescription.schedule.recurrent!.daysOfWeek, ', ')} - ${
                      prescription?.schedule.recurrent!.shift.name
                    }`,
                  )}
                  {renderDataRow(
                    isXs,
                    tService('duration'),
                    getHoursAndMinutes(prescription?.schedule.recurrent!.duration),
                  )}
                  {renderDataRow(
                    isXs,
                    tService('startDate'),
                    prescription?.schedule.recurrent?.startedAt
                      ? format(new Date(prescription.schedule.recurrent.startedAt), 'dd/MM/yyyy')
                      : '',
                  )}
                  {renderDataRow(
                    isXs,
                    tService('endDate'),
                    prescription?.schedule.recurrent?.endsAt
                      ? format(new Date(prescription.schedule.recurrent.endsAt), 'dd/MM/yyyy')
                      : '',
                  )}
                  {renderDataRow(
                    isXs,
                    tService('hdSessions'),
                    prescription?.schedule.recurrent?.startedAt && prescription?.schedule.recurrent?.endsAt
                      ? countSessionsBetweenDates(
                          prescription.schedule.recurrent.startedAt,
                          prescription.schedule.recurrent.endsAt,
                          prescription.schedule.recurrent!.frequency.daysOfWeek as DaysOfWeek[],
                        )
                      : null,
                  )}
                </>
              ) : (
                <>
                  {prescription?.schedule?.adHoc?.dateShifts &&
                    prescription?.schedule?.adHoc.dateShifts.map(({ date, shift, duration }, index) => (
                      <>
                        {renderDataRow(
                          isXs,
                          `${tService('day')} ${index + 1}`,
                          `${format(new Date(date), 'dd/MM/yyyy')} - ${shift.name} ${tService(
                            'shift',
                          )} (${getHoursAndMinutes(Number(duration))})`,
                        )}
                      </>
                    ))}
                </>
              )}
            </Column>
            <Column title={tService('comments')} mt={1}>
              <Typography variant="labelM" sx={{ mt: `0 !important`, mb: (theme) => `${theme.spacing(2)} !important` }}>
                {prescription.comments ?? '—'}
              </Typography>
            </Column>
          </Stack>
        </Paper>
      )}
    </DialysisServiceCard>
  );
};

const Column = ({
  title,
  children,
  mt,
}: PropsWithChildren<{
  title: string;
  mt?: number;
}>) => {
  return (
    <Stack>
      <Typography variant="labelL" sx={{ mb: 1, mt: mt }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
};

const renderDataRow = (isXs: boolean, name: ReactNode, value: ReactNode, secondValue?: ReactNode) => {
  return (
    <Stack direction={isXs ? 'column' : 'row'}>
      <Stack direction="row" alignItems="center" spacing={isXs ? 0 : 4}>
        <Typography
          variant="labelM"
          sx={[
            ({ spacing, palette }) => ({
              color: palette.text.secondary,
              minWidth: isXs ? spacing(18.95) : spacing(20),
              maxWidth: isXs ? spacing(18.95) : spacing(20),
              padding: spacing(0, 1),
            }),
          ]}
        >
          {name}
        </Typography>
        <Typography
          variant="labelM"
          sx={[
            isXs && { whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: (theme) => theme.spacing(18.95) },
            !isXs && { minWidth: (theme) => theme.spacing(20), whiteSpace: 'pre-wrap' },
            { padding: ({ spacing }) => spacing(0, 1) },
          ]}
        >
          {value || '-'}
        </Typography>
      </Stack>
      {isXs ? (
        <Stack direction="row" alignItems="center" spacing={isXs ? 0 : 4}>
          <Typography
            variant="labelM"
            sx={{
              whiteSpace: 'pre-wrap',
              ml: (theme) => theme.spacing(18.95),
              padding: ({ spacing }) => spacing(0, 1),
            }}
          >
            {secondValue}
          </Typography>
        </Stack>
      ) : (
        <Typography
          variant="labelM"
          sx={{ minWidth: (theme) => theme.spacing(23.25), padding: ({ spacing }) => spacing(0, 1) }}
        >
          {secondValue}
        </Typography>
      )}
    </Stack>
  );
};
