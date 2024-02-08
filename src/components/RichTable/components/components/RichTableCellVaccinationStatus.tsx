import Stack from '@mui/material/Stack';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import Typography from '@mui/material/Typography';
import { dotsTextOverflowStyles } from '@utils/styles';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { VaccinationStatus } from '@enums/global';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { convertSxToArray } from '@utils/converters';
import type { WithSx } from '@types';

interface RichTableCellVaccinationStatusProps extends WithSx {
  dotsTextOverflow: boolean;
  status: VaccinationStatus;
}

const RichTableCellVaccinationStatus = ({ status, dotsTextOverflow, sx = [] }: RichTableCellVaccinationStatusProps) => {
  const { t } = useTranslation('vaccination');
  const isPending = useMemo(() => VaccinationStatus.Pending === status, [status]);
  const isNotDone = useMemo(() => VaccinationStatus.NotDone === status, [status]);
  const isOmitted = useMemo(() => VaccinationStatus.Omitted === status, [status]);
  const isAdministered = useMemo(
    () => VaccinationStatus.AdministeredInternal === status || VaccinationStatus.AdministeredExternal === status,
    [status],
  );

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={[...convertSxToArray(sx)]}>
      {isPending && <ChangeCircleIcon style={{ fill: '#FFD600' }} fontSize="small" />}
      {isNotDone && <VaccinesOutlinedIcon sx={({ palette }) => ({ fill: palette.error.main })} fontSize="small" />}
      {isOmitted && <CancelIcon sx={({ palette }) => ({ fill: palette.error.main })} fontSize="small" />}
      {isAdministered && <CheckCircleIcon sx={{ fill: '#006D3C' }} fontSize="small" />}
      <Typography sx={dotsTextOverflow ? dotsTextOverflowStyles : []} variant="labelM">
        {t(`statuses.${status}`)}
      </Typography>
    </Stack>
  );
};

export default RichTableCellVaccinationStatus;
