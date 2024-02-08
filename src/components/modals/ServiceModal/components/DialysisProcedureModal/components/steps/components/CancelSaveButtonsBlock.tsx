import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

type CancelSaveButtonsBlockProps = {
  isXs?: boolean;
  reset: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  saveButtonLabel?: string;
};

export const CancelSaveButtonsBlock = ({
  isXs,
  reset,
  onSubmit,
  isSubmitting,
  saveButtonLabel = i18n.t('common:button.save'),
}: CancelSaveButtonsBlockProps) => {
  const { t: tCommon } = useTranslation('common');

  return (
    <Box
      sx={(theme) => ({
        position: 'fixed',
        bottom: theme.spacing(isXs ? 8 : 3.13),
        width: theme.spacing(80),
        left: `calc(50% - ${theme.spacing(16.25)})`,
        zIndex: theme.zIndex.snackbar,
      })}
    >
      <Button
        onClick={reset}
        variant="outlined"
        data-testid="cancelHDFormChanges"
        sx={(theme) => ({
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          width: theme.spacing(20),
          height: theme.spacing(5.5),
          bgcolor: theme.palette.surface.default,
          textTransform: 'none',
        })}
      >
        <Typography variant="labelL">{tCommon('button.cancel')}</Typography>
      </Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        disabled={isSubmitting}
        data-testid="saveHDFormChanges"
        sx={(theme) => ({
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: theme.spacing(20),
          height: theme.spacing(5.5),
          textTransform: 'none',
        })}
      >
        <Typography variant="labelL">{saveButtonLabel}</Typography>
      </Button>
    </Box>
  );
};
