import { LocationStatus } from '@enums';

export interface Location {
  id: number;
  name: string;
  status: LocationStatus;
  isolationGroupId: number;
  deleted?: boolean;
}
