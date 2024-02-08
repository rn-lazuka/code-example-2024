import { InfoCard } from '@components';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { StyledPatientRowStack } from '@components/StyledPatientRowStack/StyledPatientRowStack.styled';
import { useTranslation } from 'react-i18next';
import { selectDialysisInfoForProgress } from '@store/slices/dialysisSlice';
import { format, differenceInMinutes } from 'date-fns';

const getHdDuration = (startTime, endTime) => {
  const durationMin = differenceInMinutes(new Date(endTime), new Date(startTime));
  const hours = Math.floor(durationMin / 60);
  const minutes = Math.floor(durationMin - hours * 60);
  let hoursWithZero = hours < 10 ? `0${hours}` : hours;
  let minutesWithZero = minutes < 10 ? `0${minutes}` : minutes;

  return `${hoursWithZero}:${minutesWithZero}`;
};

export const DialysisPostHdTiming = ({ isXs }: { isXs: boolean }) => {
  const { t } = useTranslation('dialysis');
  const { startTime, endTime } = selectDialysisInfoForProgress();

  const rows = [
    { label: t('startTime'), value: format(new Date(startTime!), 'hh:mm aa') },
    { label: t('entTime'), value: format(new Date(endTime!), 'hh:mm aa') },
    { label: t('hdDuration'), value: getHdDuration(startTime, endTime) },
  ];

  return (
    <InfoCard title={'Timing'} isXs={isXs}>
      <Stack direction="column" spacing={1}>
        {rows.map(({ label, value }) => (
          <StyledPatientRowStack direction="row" spacing={10} textAlign="start" key={label}>
            <Typography variant="labelM">{label}</Typography>
            <Box>{value}</Box>
          </StyledPatientRowStack>
        ))}
      </Stack>
    </InfoCard>
  );
};
