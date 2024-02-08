import type { Theme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { TodayPatientsTabs, TodayPatientsViewMode, UserPermissions } from '@enums';
import { MainContentContainer } from '@containers';
import { ROUTES } from '@constants';
import { GlobalAddButton, GlobalLoader } from '@components';
import { AppointmentsTable, RegisterPatientModal, TodayPatientsGrid } from '@components/pages/TodayPatients';
import { PermissionGuard } from '@guards';
import {
  closeDialysisModal,
  getTodayPatientsAppointments,
  selectHasActiveDrawers,
  selectHasServiceModal,
  selectPatientId,
  selectPatientSaveDataSuccess,
  selectTodayPatientsActiveTab,
  selectTodayPatientsViewMode,
  resetTodayPatientPage,
} from '@store';
import { TodayPatientsFilters } from '@components/pages/TodayPatients/components';
import { useDispatchOnUnmount, useAppDispatch } from '@hooks';
import { Event } from '@services/Event/Event';

const TodayInjections = lazy(
  () => import('@components/pages/TodayPatients/components/TodayInjections/TodayInjections'),
);

export const TodayPatients = () => {
  const dispatch = useAppDispatch();
  const patientId = selectPatientId();
  const activeTab = selectTodayPatientsActiveTab();
  const viewMode = selectTodayPatientsViewMode();
  const isServiceModalOpened = selectHasServiceModal();
  const saveSuccess = selectPatientSaveDataSuccess();
  const [isRegisterPatientModalOpen, setIsRegisterPatientModalOpen] = useState(false);
  const hasActiveDrawers = selectHasActiveDrawers();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const isInjectionsTab = activeTab === TodayPatientsTabs.Injections;

  useDispatchOnUnmount(resetTodayPatientPage());

  const handleCloseModal = () => {
    setIsRegisterPatientModalOpen(false);
  };

  useEffect(() => {
    const getAppointments = () => dispatch(getTodayPatientsAppointments());
    Event.subscribe(closeDialysisModal.type, getAppointments);
    return () => Event.unsubscribe(closeDialysisModal.type, getAppointments);
  }, []);

  if (saveSuccess && patientId) {
    return <Navigate to={`/${ROUTES.patientsOverview}/${patientId}`} />;
  }

  return (
    <MainContentContainer fullHeight sx={{ width: 1, overflow: 'auto' }}>
      {!isServiceModalOpened && !hasActiveDrawers && (
        <PermissionGuard permissions={UserPermissions.PatientAdd}>
          <GlobalAddButton onClick={() => setIsRegisterPatientModalOpen(true)} />
        </PermissionGuard>
      )}
      {isRegisterPatientModalOpen && (
        <RegisterPatientModal isOpen={isRegisterPatientModalOpen} onClose={handleCloseModal} />
      )}
      <Stack
        direction="column"
        sx={(theme) => ({
          width: 1,
          p: 0,
          backgroundColor: theme.palette.surface.default,
        })}
        spacing={3}
      >
        <PermissionGuard permissions={UserPermissions.DialysisViewAppointments}>
          {viewMode === TodayPatientsViewMode.Table ? (
            <AppointmentsTable />
          ) : (
            !isInjectionsTab && (
              <Stack direction="column" sx={{ flex: 1 }}>
                <Stack
                  spacing={2}
                  direction="column"
                  sx={{
                    p: (theme) => theme.spacing(2, isXs ? 0 : 2, 0, isXs ? 0 : 2),
                    borderBottom: (theme) => `solid 1px ${theme.palette.border.default}`,
                  }}
                >
                  <TodayPatientsFilters key="today-patients-filters" />
                </Stack>
                <TodayPatientsGrid />
              </Stack>
            )
          )}
        </PermissionGuard>

        {isInjectionsTab && (
          <PermissionGuard permissions={UserPermissions.DialysisViewAppointments}>
            <Suspense fallback={<GlobalLoader />}>
              <TodayInjections />
            </Suspense>
          </PermissionGuard>
        )}
      </Stack>
    </MainContentContainer>
  );
};
