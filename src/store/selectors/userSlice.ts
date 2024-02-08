import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@types';

export const selectorCurrentBranch = createSelector(
  (state: RootState) => state.user.user,
  (user) => {
    const currentOrganizationId = user?.currentOrganizationId;
    const currentOrganization = user?.organizations?.find((organization) => organization.id === currentOrganizationId);
    const currentBranchId = user?.currentBranchId;
    return currentOrganization?.branches?.find((branch) => branch.id === currentBranchId);
  },
);
