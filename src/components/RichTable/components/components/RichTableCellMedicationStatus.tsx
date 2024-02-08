import Stack from '@mui/material/Stack';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import Typography from '@mui/material/Typography';
import { dotsTextOverflowStyles } from '@utils/styles';
import { useTranslation } from 'react-i18next';
import { MedicationStatus } from '@enums';
import PendingIcon from '@mui/icons-material/Pending';
import { useMemo } from 'react';

interface RichTableCellMedicationStatusProps {
  dotsTextOverflow: boolean;
  status: MedicationStatus;
}

const RichTableCellMedicationStatus = ({ status, dotsTextOverflow }: RichTableCellMedicationStatusProps) => {
  const { t: tMedications } = useTranslation('medications');
  const isActive = useMemo(() => MedicationStatus.Active === status, [status]);
  const isDiscontinued = useMemo(() => MedicationStatus.Discontinued === status, [status]);
  const isUnconfirmed = useMemo(() => MedicationStatus.Unconfirmed === status, [status]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isActive && <ChangeCircleIcon style={{ fill: '#FFD600' }} fontSize="small" />}
      {isDiscontinued && <DoNotDisturbOnIcon fontSize="small" />}
      {isUnconfirmed && <PendingIcon sx={(theme) => ({ fill: theme.palette.error.main })} fontSize="small" />}
      <Typography sx={dotsTextOverflow ? dotsTextOverflowStyles : []} variant="labelM">
        {tMedications(`statuses.${status}`)}
      </Typography>
    </Stack>
  );
};

export default RichTableCellMedicationStatus;
