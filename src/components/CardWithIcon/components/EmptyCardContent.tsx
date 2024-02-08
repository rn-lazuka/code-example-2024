import type { WithSx } from '@types';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { convertSxToArray } from '@utils/converters/mui';

type EmptyCardComponentProps = WithSx<{
  text?: string;
  addContentPermission?: boolean;
  onClick: () => void;
}>;

export const EmptyCardContent = ({
  onClick,
  text = 'addInformation',
  addContentPermission = false,
  sx = [],
}: EmptyCardComponentProps) => {
  const { t } = useTranslation('common');
  return (
    <Stack sx={[{ p: 3, alignItems: 'center' }, ...convertSxToArray(sx)]} direction="column" spacing={2}>
      <Typography variant="labelM" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t(addContentPermission ? text : 'noInfoYet')}
      </Typography>
      {addContentPermission && (
        <Button variant="text" onClick={onClick} startIcon={<AddOutlinedIcon />} sx={{ py: 1 }}>
          {t('button.addInfo')}
        </Button>
      )}
    </Stack>
  );
};
