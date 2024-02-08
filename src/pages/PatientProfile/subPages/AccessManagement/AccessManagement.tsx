import { GlobalAddButton, GlobalLoader } from '@components';
import { DrawerStatus, DrawerType, PatientStatuses, UserPermissions, ViewPermissions } from '@enums';
import { useDispatchOnUnmount } from '@hooks/useDispatchOnUnmount';
import Stack from '@mui/material/Stack';
import { useAppDispatch } from '@hooks/storeHooks';
import { useParams } from 'react-router-dom';
import { ROUTES } from '@constants';
import { useEffect } from 'react';
import {
  addDrawer,
  clearAccessManagementFormData,
  getAccessManagements,
  resetAccessManagementPage,
  selectHasActiveDrawers,
  selectIsAccessManagementFileLoading,
  selectPatientStatus,
  selectUserPermissions,
  setHasBeenRedirectedToAddAccess,
} from '@store';
import { PermissionGuard } from '@guards';
import { AccessManagementTable } from '@components/pages/PatientProfile';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export const AccessManagement = () => {
  const { t } = useTranslation('common');
  const userPermissions = selectUserPermissions();
  const hasActiveDrawers = selectHasActiveDrawers();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isFileLoading = selectIsAccessManagementFileLoading();
  const patientStatus = selectPatientStatus();

  const isShowAddButton = userPermissions.includes(UserPermissions.PatientModifyAccess) && !hasActiveDrawers;
  const isUnavailableStatus =
    patientStatus === PatientStatuses.Walk_In ||
    patientStatus === PatientStatuses.Dead ||
    patientStatus === PatientStatuses.Discharged;

  const openDrawer = () => {
    dispatch(clearAccessManagementFormData());
    dispatch(
      addDrawer({
        type: DrawerType.AccessManagementForm,
        status: DrawerStatus.Showed,
        payload: { id },
        allowedPathsToShowDrawer: [ROUTES.patientsOverview],
      }),
    );
  };

  useDispatchOnUnmount(setHasBeenRedirectedToAddAccess(false), resetAccessManagementPage());

  useEffect(() => {
    id && dispatch(getAccessManagements(id));
  }, [id]);

  return (
    <>
      {isFileLoading && <GlobalLoader />}
      {isShowAddButton && isUnavailableStatus && (
        <Tooltip title={t('unavailableForPatients')} enterTouchDelay={0}>
          <Box
            component="span"
            sx={({ spacing }) => ({
              position: 'fixed',
              right: spacing(3),
              bottom: spacing(3.125),
            })}
          >
            <GlobalAddButton isDisabled onClick={openDrawer} />
          </Box>
        </Tooltip>
      )}
      {isShowAddButton && !isUnavailableStatus && <GlobalAddButton onClick={openDrawer} />}
      <Stack
        direction="column"
        sx={(theme) => ({
          width: 1,
          height: 1,
          p: 0,
          backgroundColor: theme.palette.surface.default,
        })}
        spacing={3}
      >
        <PermissionGuard permissions={[ViewPermissions.PatientViewAccess]}>
          <AccessManagementTable />
        </PermissionGuard>
      </Stack>
    </>
  );
};
