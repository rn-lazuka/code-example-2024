import { Notification } from '@types';

export interface NotificationsResponse {
  notificationList: Notification[];
  unreadNotificationCount: number;
}
