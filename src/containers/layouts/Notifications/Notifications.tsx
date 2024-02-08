import type { WithSx } from '@types';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { selectNotifications } from '@store/slices';
import { NotificationItem } from './NotificationItem';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { convertSxToArray } from '@utils/converters/mui';

export type NotificationsProps = WithSx<{
  isOpen: boolean;
  onClose: (_: unknown, reason?: string) => void;
}>;

const EmptyNotifications = () => {
  const { t } = useTranslation('notifications');
  return (
    <Box
      sx={(theme) => ({
        height: theme.spacing(24),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Box
        sx={(theme) => ({
          background: alpha(theme.palette.primary.light, 0.3),
          width: theme.spacing(5),
          height: theme.spacing(5),
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <NotificationsOutlinedIcon />
      </Box>
      <Typography
        sx={(theme) => ({
          color: theme.palette.text.secondary,
          mt: 1,
        })}
      >
        {t('noNotifications')}
      </Typography>
    </Box>
  );
};

export const Notifications = ({ isOpen, sx = [], onClose = () => {} }: NotificationsProps) => {
  const { t } = useTranslation('notifications');
  const notifications = selectNotifications();

  return (
    <Modal
      open={isOpen}
      sx={convertSxToArray(sx)}
      onClose={onClose}
      disableEnforceFocus
      disableScrollLock={true}
      componentsProps={{ backdrop: { style: { backgroundColor: 'transparent' } } }}
    >
      <Paper
        sx={(theme) => ({
          position: 'absolute',
          top: theme.spacing(8),
          right: theme.spacing(1),
          // subtrackting header, footer, margin
          maxHeight: `calc(100vh - ${theme.spacing(12)})`,
          borderRadius: theme.spacing(1),
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
          width: theme.spacing(45),
          overflowY: 'auto',
        })}
      >
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box
              sx={(theme) => ({
                borderBottom: `1px solid ${theme.palette.border.default}`,
                p: 2,
                width: 1,
              })}
            >
              <Typography variant="headerS">{t('title')}</Typography>
            </Box>
          </Box>
          {notifications.map((notification, index) => (
            <NotificationItem key={index} notification={notification} onClose={onClose} />
          ))}
          {!notifications.length && <EmptyNotifications />}
        </>
      </Paper>
    </Modal>
  );
};
