import { UserPermissions } from '@enums';
import { ReactElement } from 'react';

export interface DialysisMachineNavItem {
  title: string;
  path: string;
  icon: ReactElement;
  viewPermissions: UserPermissions[];
}
