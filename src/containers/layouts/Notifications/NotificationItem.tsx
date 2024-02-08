import { Badge, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Notification } from '@types';
import { useAppDispatch } from '@hooks/storeHooks';
import { markNotificationRead } from '@store/slices/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants';
import { NotificationTransComponent } from './components/NotificationTransComponent';
import { getPassedTimeLabel } from '@utils';

type NotificationItemProps = {
  notification: Notification;
  onClose: (_: unknown, reason?: string) => void;
};

export const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
  const { t } = useTranslation('notifications');
  const { isRead } = notification;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onNotificationClick = () => {
    dispatch(markNotificationRead(notification.id));
    navigate(getNavScreenLink());
    onClose(null, 'linkClick');
  };

  const getNavScreenLink = () => {
    switch (notification.navigationScreen) {
      case 'LAB_RESULTS': {
        return `/${ROUTES.patientsOverview}/${notification.patientId}/${ROUTES.patientLabResults}`;
      }
      case 'MEDICATIONS': {
        return `/${ROUTES.patientsOverview}/${notification.patientId}/${ROUTES.patientMedication}`;
      }
      case 'HD_PRESCRIPTIONS': {
        return `/${ROUTES.patientsOverview}/${notification.patientId}/${ROUTES.patientHdPrescription}`;
      }
      case 'CALENDAR': {
        if (
          notification.messageKey === 'notification.CALENDAR_BT_EVENT_CREATED' ||
          notification.messageKey === 'notification.CALENDAR_BT_EVENT_UPDATED' ||
          notification.messageKey === 'notification.CALENDAR_BT_EVENT_DELETED' ||
          notification.messageKey === 'notification.CALENDAR_PIC_EVENT_CREATED' ||
          notification.messageKey === 'notification.CALENDAR_PIC_EVENT_UPDATED' ||
          notification.messageKey === 'notification.CALENDAR_PIC_EVENT_DELETED' ||
          notification.messageKey === 'notification.CALENDAR_NEPHROLOGIST_EVENT_CREATED' ||
          notification.messageKey === 'notification.CALENDAR_NEPHROLOGIST_EVENT_UPDATED' ||
          notification.messageKey === 'notification.CALENDAR_NEPHROLOGIST_EVENT_DELETED'
        ) {
          return `/${ROUTES.schedule}/${ROUTES.clinical}?activeEventId=${notification.navigationObjectId}&date=${notification.messageArguments[0]}`;
        }
        return `/${ROUTES.schedule}/${ROUTES.clinical}?activeEventId=${notification.navigationObjectId}&date=${notification.messageArguments[1]}`;
      }
      default: {
        return '#';
      }
    }
  };

  return (
    <Box
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.border.default}`,
        p: 2,
        width: 1,
        cursor: 'pointer',
      })}
      onClick={onNotificationClick}
      data-testid={`notificationItem-${notification.id}${getNavScreenLink()}`}
    >
      <Badge
        color="error"
        variant="dot"
        invisible={isRead}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="labelM"
            sx={(theme) => ({
              color: theme.palette.text.primary,
              '& a': {
                color: theme.palette.primary.main,
              },
            })}
          >
            <NotificationTransComponent notification={notification} onClose={onClose} t={t} />
          </Typography>
          <Box
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              mt: theme.spacing(0.5),
            })}
          >
            <Typography variant="labelM">{getPassedTimeLabel(notification.createdAt)}</Typography>
          </Box>
        </Box>
      </Badge>
    </Box>
  );
};
