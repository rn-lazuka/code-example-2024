import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WarningIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

type CannotSaveModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CannotSaveModal = ({ open, onClose }: CannotSaveModalProps) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onClose} data-testid={`errorHdReadingModal`} sx={{ '& .MuiDialog-paper': { mx: 2 } }}>
      <Box sx={(theme) => ({ width: theme.spacing(42.5), m: 0, p: 2 })}>
        <Box sx={{ width: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} sx={{ mr: -1, mt: -1 }} data-testid="cannotSaveModalCloseButton">
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
        <Box sx={{ width: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 4 }}>
          <WarningIcon sx={(theme) => ({ fontSize: theme.spacing(5), mb: 2 })} />
          <Typography variant="headerM" sx={{ textAlign: 'center' }}>
            {t('cannotSave')}
          </Typography>
          <Typography variant="paragraphL" sx={{ mt: 1, textAlign: 'center' }}>
            {t('addNecessaryDataFirst')}
          </Typography>
        </Box>
        <Button variant="outlined" sx={{ width: 1 }} onClick={onClose} data-testid="cannotSaveModalOkButton">
          {tCommon('button.ok')}
        </Button>
      </Box>
    </Dialog>
  );
};
