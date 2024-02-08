import type { ReactNode } from 'react';
import { SystemModuleName } from '@enums';

export interface SystemSliceState {
  activeModule: SystemModuleName;
  moduleBuildVersions: {
    [SystemModuleName.Host]?: string;
    [SystemModuleName.Billing]?: string;
    [SystemModuleName.UserManagement]?: string;
  };
  slots: {
    header: ReactNode | null;
    footer: ReactNode | null;
  };
  networkConnection: {
    isOnline: boolean;
    isOffline: boolean;
    backOnline: boolean;
    backOffline: boolean;
  };
  timeZone: string;
  page: {
    isActive: boolean;
  };
  error: any;
}
