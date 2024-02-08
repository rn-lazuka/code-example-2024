import { useDispatchOnUnmount } from '@hooks';
import Stack from '@mui/material/Stack';
import { VaccinationTable } from '@components/pages/PatientProfile/tables/VaccinationTable';
import { GlobalAddButton } from '@components/GlobalAddButton/GlobalAddButton';
import {
  addDrawer,
  clearVaccinationFormData,
  getVaccinationsList,
  resetVaccinationSlice,
  selectHasActiveDrawers,
  selectIsVaccinationFileLoading,
  selectPatientStatus,
  selectUserPermissions,
} from '@store/slices';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@hooks/storeHooks';
import { UserPermissions } from '@enums/store';
import { DrawerType, PatientStatuses, VaccinationDrawerType } from '@enums';
import { ROUTES } from '@constants/global';
import { useEffect } from 'react';
import { GlobalLoader } from '@components/GlobalLoader/GlobalLoader';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

export const Vaccination = () => {
  const { t } = useTranslation('common');
  const userPermissions = selectUserPermissions();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const isFileLoading = selectIsVaccinationFileLoading();
  const hasActiveDrawers = selectHasActiveDrawers();
  const isShowAddButton = userPermissions.includes(UserPermissions.VaccinationModify) && !hasActiveDrawers;
  const patientStatus = selectPatientStatus();
  const isUnavailableStatus =
    patientStatus === PatientStatuses.Walk_In ||
    patientStatus === PatientStatuses.Dead ||
    patientStatus === PatientStatuses.Discharged;

  const openDrawer = () => {
    dispatch(clearVaccinationFormData());
    dispatch(
      addDrawer({
        type: DrawerType.VaccinationForm,
        payload: { id, type: VaccinationDrawerType.Add },
        allowedPathsToShowDrawer: [ROUTES.patientsOverview],
      }),
    );
  };

  useDispatchOnUnmount(resetVaccinationSlice());

  useEffect(() => {
    if (id) {
      dispatch(getVaccinationsList(id));
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
        <VaccinationTable />
      </Stack>
    </>
  );
};
