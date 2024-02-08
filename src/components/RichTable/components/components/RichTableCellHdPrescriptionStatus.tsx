import { HdPrescriptionStatuses } from '@enums';
import Stack from '@mui/material/Stack';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import Typography from '@mui/material/Typography';
import { dotsTextOverflowStyles } from '@utils/styles';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface RichTableCellHdPrescriptionStatusProps {
  dotsTextOverflow: boolean;
  status: HdPrescriptionStatuses;
}

const RichTableCellHdPrescriptionStatus = ({ status, dotsTextOverflow }: RichTableCellHdPrescriptionStatusProps) => {
  const { t: tHdPrescription } = useTranslation('hdPrescription');
  const isActive = useMemo(() => HdPrescriptionStatuses.ACTIVE === status, [status]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isActive ? (
        <ChangeCircleIcon style={{ fill: '#FFD600' }} fontSize="small" />
      ) : (
        <DoNotDisturbOnIcon fontSize="small" />
      )}
      <Typography sx={dotsTextOverflow ? dotsTextOverflowStyles : []} variant="labelM">
        {tHdPrescription(isActive ? 'statuses.active' : 'statuses.discontinued')}
      </Typography>
    </Stack>
  );
};

export default RichTableCellHdPrescriptionStatus;
