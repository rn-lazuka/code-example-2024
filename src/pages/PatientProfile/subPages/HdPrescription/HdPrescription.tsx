import { useDispatchOnUnmount } from '@hooks/useDispatchOnUnmount';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { GlobalAddButton, GlobalLoader } from '@components';
import { useAppDispatch } from '@hooks/storeHooks';
import { HdPrescriptionsTable } from '@components/pages/PatientProfile';
import {
  addDrawer,
  addServiceModal,
  clearHdPrescriptionFormData,
  getHdPrescriptionsList,
  resetHdPrescriptionSlice,
  selectHasActiveDrawers,
  selectHdPrescriptionFileLoading,
  selectPatientStatus,
  selectUserPermissions,
} from '@store';
import { PermissionGuard } from '@guards';
import { ROUTES } from '@constants';
import { DrawerType, PatientStatuses, ServiceModalName, UserPermissions, ViewPermissions } from '@enums';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { API } from '@utils/api';

export const HdPrescription = () => {
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t: tHdPrescription } = useTranslation('hdPrescription');
  const userPermissions = selectUserPermissions();
  const { id } = useParams();
  const isFileLoading = selectHdPrescriptionFileLoading();
  const dispatch = useAppDispatch();
  const hasActiveDrawers = selectHasActiveDrawers();
  const patientStatus = selectPatientStatus();

  const getIsolationAndVirologyInfo = async () => {
    try {
      setIsLoading(true);
      const { data } = await API.post('/pm/isolation-groups/virology', {
        patientId: id,
      });
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const isShowAddButton =
    userPermissions.includes(UserPermissions.DialysisAddPrescription) && !hasActiveDrawers && patientStatus;
  const isUnavailableStatus =
    patientStatus === PatientStatuses.Walk_In ||
    patientStatus === PatientStatuses.Dead ||
    patientStatus === PatientStatuses.Discharged;

  useDispatchOnUnmount(resetHdPrescriptionSlice());

  useEffect(() => {
    if (id) {
      dispatch(getHdPrescriptionsList(id));
    }
  }, [id]);

  const openDrawer = async () => {
    const isolationAndVirologyInfo = await getIsolationAndVirologyInfo();

    if (!isolationAndVirologyInfo?.isolationGroup || isolationAndVirologyInfo?.isolationGroup?.deleted) {
      dispatch(
        addServiceModal({
          name: ServiceModalName.ConfirmModal,
          payload: {
            cancelButton: null,
            confirmButton: t('button.ok'),
            title: tHdPrescription('modals.isolationStatus.title'),
            text: null,
          },
        }),
      );
    } else {
      if (isolationAndVirologyInfo?.virologyExists) {
        dispatch(clearHdPrescriptionFormData());
        dispatch(
          addDrawer({
            type: DrawerType.HdPrescriptionForm,
            payload: {
              id,
              patientIsolationStatus: isolationAndVirologyInfo.isolationGroup,
            },
            allowedPathsToShowDrawer: [ROUTES.patientsOverview],
          }),
        );
      } else {
        dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              cancelButton: null,
              confirmButton: t('button.ok'),
              title: t('isolationUnknown'),
              text: t('noMachinesForThisStatus'),
            },
          }),
        );
      }
    }
  };

  return (
    <>
      {(isFileLoading || isLoading) && <GlobalLoader />}
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
        <PermissionGuard permissions={ViewPermissions.DialysisViewPrescriptions}>
          <HdPrescriptionsTable />
        </PermissionGuard>
      </Stack>
    </>
  );
};
