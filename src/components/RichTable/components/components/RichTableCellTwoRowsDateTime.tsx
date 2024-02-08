import Typography from '@mui/material/Typography';
import { format as formatDate } from 'date-fns';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

interface RichTableCellTwoRowsDateTimeProps {
  data: { date: Date | string; isEdited?: boolean };
}

const RichTableCellTwoRowsDateTime = ({ data: { date, isEdited = false } }: RichTableCellTwoRowsDateTimeProps) => {
  const { t } = useTranslation('common');
  return (
    <Stack direction="column" sx={{ pt: 1, pb: 1 }}>
      {isEdited && <Typography variant="paragraphM">{t('editedWithParenthesis')}</Typography>}
      <Typography variant="paragraphM">{formatDate(new Date(date), 'dd/MM/yyyy')}</Typography>
      <Typography variant="paragraphM">{formatDate(new Date(date), 'hh:mm a')}</Typography>
    </Stack>
  );
};

export default RichTableCellTwoRowsDateTime;
