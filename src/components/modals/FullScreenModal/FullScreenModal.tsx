import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import { PropsWithChildren } from 'react';
import type { WithSx } from '@types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';
import { convertSxToArray } from '@utils/converters/mui';
import { footerHeight } from '@constants';

export type FullScreenModalProps = PropsWithChildren<
  WithSx<{
    isOpen: boolean;
    title: string;
    onClose: () => void;
    titleBlockColor?: string;
    contentBlockColor?: string;
    contentFullWidth?: boolean;
  }>
>;

export const FullScreenModal = ({
  isOpen,
  title,
  onClose,
  children,
  titleBlockColor,
  contentBlockColor,
  contentFullWidth,
  sx = [],
}: FullScreenModalProps) => {
  return (
    <Modal open={isOpen} disableEnforceFocus hideBackdrop data-testid={`${title}FullScreenModal`}>
      <Paper
        square
        sx={[
          (theme) => ({
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: { xs: 0, sm: theme.spacing(footerHeight) },
          }),
          ...convertSxToArray(sx),
        ]}
      >
        <Box
          sx={(theme) => ({
            width: 1,
            p: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(3)}`,
            borderBottom: `solid 1px ${theme.palette.border.default}`,
            backgroundColor: titleBlockColor || theme.palette.primary.light,
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.04)',
          })}
        >
          <Box
            sx={(theme) => ({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: theme.spacing(240),
              mx: 'auto',
            })}
          >
            <Typography variant="headerS">{title}</Typography>
            <IconButton onClick={onClose} sx={{ m: 0 }} data-testid="closeModalButton">
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={(theme) => ({
            width: 1,
            height: `calc(100% - ${theme.spacing(7.125)})`,
            overflow: 'auto',
            pt: 4,
            pb: 3,
            px: { xs: 2, md: 3 },
            bgcolor: contentBlockColor || theme.palette.surface.default,
          })}
        >
          <Stack
            spacing={6}
            sx={(theme) => ({
              width: 1,
              maxWidth: contentFullWidth ? undefined : theme.spacing(87),
              mx: contentFullWidth ? undefined : 'auto',
            })}
          >
            {children}
          </Stack>
        </Box>
      </Paper>
    </Modal>
  );
};
