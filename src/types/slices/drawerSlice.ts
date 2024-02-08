import { DrawerStatus, DrawerType } from '@enums';
import { ReactNode } from 'react';

export type Drawer = {
  status: DrawerStatus;
  payload?: any;
  collapsable?: boolean;
  allowedPathsToShowDrawer?: string[];
  customContent?: ReactNode;
  customTitle?: string;
};

export type DrawerStatuses = {
  isDirty: boolean;
};

export type WithDrawerType<T> = T & { type: DrawerType };

export type WithDrawerStatuses<T> = T & { statuses: DrawerStatuses };

export type DrawerWithOptionalStatuses = Drawer & Partial<{ statuses: Partial<DrawerStatuses> }>;

export type DrawerWithTransitionStatus<T> = T & { nextStatus: DrawerStatus };

export type DrawerFull = DrawerWithTransitionStatus<WithDrawerStatuses<Drawer>>;

export type DrawerFullPartial = Partial<DrawerFull>;

export type DrawerSliceState = {
  [key in DrawerType]?: DrawerFull;
};
