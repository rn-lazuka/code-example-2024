import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { DialyzerStatuses } from '@enums/pages';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { dotsTextOverflowStyles } from '@utils/styles';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';

interface RichTableCellDialyzerStatusProps {
  dotsTextOverflow: boolean;
  status: DialyzerStatuses;
}

export const RichTableCellDialyzerStatus = ({ dotsTextOverflow, status }: RichTableCellDialyzerStatusProps) => {
  const { t } = useTranslation('dialyzers');
  const isActive = useMemo(() => DialyzerStatuses.ACTIVE === status, [status]);
  const isDisposed = useMemo(() => DialyzerStatuses.DISPOSED === status, [status]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isActive && <ChangeCircleIcon style={{ fill: '#FFD600' }} fontSize="small" />}
      {isDisposed && <DoNotDisturbOnIcon fontSize="small" />}
      <Typography sx={dotsTextOverflow ? dotsTextOverflowStyles : []} variant="labelM">
        {t(`statuses.${status}`)}
      </Typography>
    </Stack>
  );
};
