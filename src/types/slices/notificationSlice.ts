import { Notification } from '@types';

export interface NotificationSliceState {
  loading: boolean;
  count: number;
  notifications: Notification[];
  error: string | null;
}
