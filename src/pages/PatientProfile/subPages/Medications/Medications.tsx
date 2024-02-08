import { useDispatchOnUnmount } from '@hooks/useDispatchOnUnmount';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { DrawerType, MedicationDrawerType, PatientStatuses, UserPermissions, ViewPermissions } from '@enums';
import { useAppDispatch } from '@hooks/storeHooks';
import { MedicationsTable } from '@components/pages/PatientProfile';
import {
  addDrawer,
  clearMedicationFormData,
  getMedicationsList,
  resetMedicationSlice,
  selectHasActiveDrawers,
  selectMedicationFileLoading,
  selectPatientStatus,
  selectUserPermissions,
} from '@store';
import { GlobalAddButton, GlobalLoader } from '@components';
import { ROUTES } from '@constants';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

export const Medications = () => {
  const userPermissions = selectUserPermissions();
  const { id } = useParams();
  const { t } = useTranslation('common');
  const patientStatus = selectPatientStatus();
  const isFileLoading = selectMedicationFileLoading();
  const isViewTableShown = userPermissions.includes(ViewPermissions.DialysisViewPrescriptions);
  const dispatch = useAppDispatch();
  const hasActiveDrawers = selectHasActiveDrawers();
  const isShowAddButton = userPermissions.includes(UserPermissions.MedicationAddDrug) && !hasActiveDrawers;

  const isUnavailableStatus =
    patientStatus === PatientStatuses.Walk_In ||
    patientStatus === PatientStatuses.Dead ||
    patientStatus === PatientStatuses.Discharged;

  const openDrawer = () => {
    dispatch(clearMedicationFormData());
    dispatch(
      addDrawer({
        type: DrawerType.Medication,
        payload: { id, type: MedicationDrawerType.Add },
        allowedPathsToShowDrawer: [ROUTES.patientsOverview],
      }),
    );
  };

  useDispatchOnUnmount(resetMedicationSlice());

  useEffect(() => {
    if (id) {
      dispatch(getMedicationsList(id));
    }
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
        {isViewTableShown && <MedicationsTable />}
      </Stack>
    </>
  );
};
