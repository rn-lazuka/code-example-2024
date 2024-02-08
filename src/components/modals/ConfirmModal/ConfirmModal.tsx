import { WithSx } from '@types';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Stack } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { convertSxToArray } from '@utils/converters/mui';
import { ReactNode } from 'react';

export type ConfirmModalProps = WithSx<{
  isOpen: boolean;
  title: string;
  text?: string | ReactNode;
  icon?: OverridableComponent<SvgIconTypeMap>;
  onClose: () => void;
  confirmButton: Pick<ButtonProps, 'onClick' | 'children' | 'variant'>;
  cancelButton?: Pick<ButtonProps, 'onClick' | 'children' | 'variant'>;
  dataTestId?: string;
  disableEnforceFocus?: boolean;
}>;

export const ConfirmModal = ({
  disableEnforceFocus = false,
  isOpen,
  title,
  text,
  icon: Icon,
  onClose,
  confirmButton,
  cancelButton,
  sx = [],
  dataTestId = 'confirmModal',
}: ConfirmModalProps) => {
  return (
    <Modal disableEnforceFocus={disableEnforceFocus} open={isOpen} data-testid={dataTestId}>
      <Paper
        sx={[
          (theme) => ({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: theme.spacing(44),
            maxWidth: theme.spacing(44),
            borderRadius: theme.spacing(3),
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
            p: 2,
          }),
          ...convertSxToArray(sx),
        ]}
      >
        <Box sx={{ width: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} sx={{ mr: -1, mt: -1 }} data-testid="confirmModalCloseButton">
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
        <Box sx={{ width: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 4 }}>
          {Icon && <Icon sx={(theme) => ({ fontSize: theme.spacing(5), mb: 2 })} />}
          <Typography
            variant="headerM"
            sx={{ textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {title}
          </Typography>
          {text && typeof text === 'string' && (
            <Typography variant="paragraphL" sx={{ mt: 1, textAlign: 'center' }}>
              {text}
            </Typography>
          )}
          {text && typeof text !== 'string' && text}
        </Box>
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'no-wrap' }}>
          {!!cancelButton && (
            <Button
              variant="outlined"
              onClick={onClose}
              {...cancelButton}
              fullWidth
              data-testid="confirmModalCancelButton"
            />
          )}
          {!!confirmButton && (
            <Button
              variant={!cancelButton ? 'outlined' : 'contained'}
              {...confirmButton}
              fullWidth
              data-testid="confirmModalConfirmButton"
            />
          )}
        </Stack>
      </Paper>
    </Modal>
  );
};

export default ConfirmModal;
