import { useCallback, useEffect } from 'react';
import { useAppDispatch, useDispatchOnUnmount, useIgnoreFirstRenderEffect } from '@hooks';
import { PermissionGuard } from '@guards';
import {
  addDrawer,
  clearDialyzerSlice,
  getDialysisMachinesIsolationGroups,
  getDialysisMachinesList,
  selectDialysisMachinesIsSubmitting,
  selectHasActiveDrawers,
} from '@store';
import { UserPermissions, DrawerType } from '@enums';
import { ROUTES } from '@constants';
import { AdministrationLayout } from '@containers';
import { GlobalAddButton } from '@components';
import { DialysisMachinesViewTable } from '@components/pages/Administration/subPages/DialysisMachines/DialysisMachinesViewTable';

export const DialysisMachines = () => {
  const dispatch = useAppDispatch();
  const hasActiveDrawers = selectHasActiveDrawers();
  const isSubmitting = selectDialysisMachinesIsSubmitting();

  const openDrawer = useCallback(() => {
    dispatch(
      addDrawer({
        type: DrawerType.DialysisMachineForm,
        allowedPathsToShowDrawer: [ROUTES.administration],
      }),
    );
  }, []);

  const updateDialysisMachinesList = () => {
    dispatch(getDialysisMachinesList());
  };

  useDispatchOnUnmount(clearDialyzerSlice());

  useEffect(() => {
    updateDialysisMachinesList();
    dispatch(getDialysisMachinesIsolationGroups());
  }, []);

  useIgnoreFirstRenderEffect(() => {
    if (!isSubmitting) {
      updateDialysisMachinesList();
    }
  }, [isSubmitting]);

  return (
    <AdministrationLayout navigateBackIcon sx={{ bgcolor: (theme) => theme.palette.surface.default }}>
      {!hasActiveDrawers && (
        <PermissionGuard permissions={UserPermissions.DialysisMachineAdd}>
          <GlobalAddButton onClick={openDrawer} />
        </PermissionGuard>
      )}
      <DialysisMachinesViewTable />
    </AdministrationLayout>
  );
};
