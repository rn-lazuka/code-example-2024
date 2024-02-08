import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@types';

export const selectorHasActiveDrawers = createSelector(
  (state: RootState) => state.drawer,
  (drawerState) => Boolean(Object.values(drawerState).length > 0),
);
