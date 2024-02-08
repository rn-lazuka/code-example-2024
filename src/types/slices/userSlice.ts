import { User } from '@types';

export interface UserSliceState {
  loading: boolean;
  error: string | null;
  user: User | null;
}
