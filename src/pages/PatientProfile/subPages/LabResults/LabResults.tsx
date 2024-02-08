import { useDispatchOnUnmount } from '@hooks/useDispatchOnUnmount';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useAppDispatch } from '@hooks/storeHooks';
import { PermissionGuard } from '@guards';
import { GlobalAddButtonWithChips, GlobalLoader } from '@components';
import {
  DrawerType,
  FormType,
  LabOrderEventPlace,
  LabOrdersTabs,
  LabOrderStatus,
  LabTestTypes,
  LabSpecimenType,
  PatientStatuses,
  ServiceModalName,
  UserPermissions,
} from '@enums';
import {
  addDrawer,
  addServiceModal,
  resetLabResultsSlice,
  selectHasActiveDrawers,
  selectHasServiceModal,
  selectLabOrdersIsFileLoading,
  selectLabResultsIsFileLoading,
  selectPatient,
  selectUserPermissions,
} from '@store';
import { LabOrders, LabSummary } from '@components/pages/PatientProfile/subPages';
import Typography from '@mui/material/Typography';
import { ROUTES } from '@constants';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export const LabResults = () => {
  const [tabName, setTabName] = useState<LabOrdersTabs | false>(false);
  const dispatch = useAppDispatch();
  const isServiceModalOpened = selectHasServiceModal();
  const hasActiveDrawers = selectHasActiveDrawers();
  const patient = selectPatient();
  const { t } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const userPermissions = selectUserPermissions();
  const isLabResultFileLoading = selectLabResultsIsFileLoading();
  const isLabOrderFileLoading = selectLabOrdersIsFileLoading();

  const handleChangeTab = (event, tabName) => setTabName(tabName);

  const isShowAddButton = !hasActiveDrawers && patient?.status && !isServiceModalOpened;
  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;

  const openDrawer = (labTestType: LabTestTypes) => {
    const setFormInitValues = () => {
      switch (labTestType) {
        case LabTestTypes.Individual:
          return {
            patient: { label: patient?.name, value: patient?.id },
            procedure: null,
            laboratory: null,
            specimenType: LabSpecimenType.BLOOD,
            dialysisDay: true,
            planeDates: [{ date: null, status: LabOrderStatus.TO_PERFORM }],
          };
        case LabTestTypes.Quarterly:
          return {
            patient: { label: patient?.name, value: patient?.id },
            firstQuarterProcedure: null,
            secondQuarterProcedure: null,
            thirdQuarterProcedure: null,
            fourthQuarterProcedure: null,
          };
        case LabTestTypes.Urgent:
          return {
            patient: { label: patient?.name, value: patient?.id },
            procedure: null,
            laboratory: null,
            specimenType: LabSpecimenType.BLOOD,
          };
        default:
          return null;
      }
    };

    dispatch(
      labTestType === LabTestTypes.Urgent
        ? addServiceModal({
            name: ServiceModalName.UrgentLabTest,
            payload: {
              place: LabOrderEventPlace.LabResults,
              mode: FormType.Add,
              disabledPatient: true,
              formInitialValues: setFormInitValues(),
            },
          })
        : addDrawer({
            type:
              labTestType === LabTestTypes.Individual ? DrawerType.IndividualLabTestPlanForm : DrawerType.QuarterlyBT,
            payload: {
              place: LabOrderEventPlace.LabResults,
              mode: FormType.Add,
              disabledPatient: true,
              formInitialValues: setFormInitValues(),
            },
            allowedPathsToShowDrawer: [ROUTES.patientsOverview],
          }),
    );
  };

  useDispatchOnUnmount(resetLabResultsSlice());

  useEffect(() => {
    setTabName(
      !userPermissions.includes(UserPermissions.AnalysesViewResults) ? LabOrdersTabs.Orders : LabOrdersTabs.Summary,
    );
  }, []);

  return (
    <>
      {(isLabResultFileLoading || isLabOrderFileLoading) && <GlobalLoader />}
      {isShowAddButton && tabName === LabOrdersTabs.Orders && !isUnavailableStatus && (
        <PermissionGuard permissions={[UserPermissions.AnalysesModifyOrder]}>
          <GlobalAddButtonWithChips
            chips={[
              { label: t(`labTestTypes.${LabTestTypes.Individual}`), value: LabTestTypes.Individual },
              ...(patient?.status === PatientStatuses.Visiting
                ? []
                : [{ label: t(`labTestTypes.${LabTestTypes.Quarterly}`), value: LabTestTypes.Quarterly }]),
              { label: t(`labTestTypes.${LabTestTypes.Urgent}`), value: LabTestTypes.Urgent },
            ]}
            onChipClick={(value) => openDrawer(value as LabTestTypes)}
          />
        </PermissionGuard>
      )}
      {isShowAddButton && tabName === LabOrdersTabs.Orders && isUnavailableStatus && (
        <Tooltip title={tCommon('unavailableForPatients')} enterTouchDelay={0}>
          <Box
            component="span"
            sx={({ spacing }) => ({
              position: 'fixed',
              right: spacing(3),
              bottom: spacing(3.125),
            })}
          >
            <GlobalAddButtonWithChips disabled chips={[]} onChipClick={() => {}} />
          </Box>
        </Tooltip>
      )}
      <Stack
        direction="column"
        sx={{ width: 1, height: 1, p: 0, backgroundColor: (theme) => theme.palette.surface.default }}
      >
        <Tabs
          value={tabName}
          onChange={handleChangeTab}
          TabIndicatorProps={{ sx: { height: (theme) => theme.spacing(0.375) } }}
          sx={{
            px: 1.5,
            flexShrink: 0,
            borderBottom: (theme) => `solid 1px ${theme.palette.border.default}`,
            '& .MuiButtonBase-root': {
              textTransform: 'unset',
            },
          }}
        >
          {userPermissions.includes(UserPermissions.AnalysesViewResults) && (
            <Tab
              label={<Typography variant="headerM">{t('labSummary')}</Typography>}
              value={LabOrdersTabs.Summary}
              sx={{ py: 2 }}
            />
          )}
          {userPermissions.includes(UserPermissions.AnalysesViewOrders) && (
            <Tab
              label={<Typography variant="headerM">{t('labOrders')}</Typography>}
              value={LabOrdersTabs.Orders}
              sx={{ minWidth: 'max-content', py: 2 }}
            />
          )}
        </Tabs>
        {tabName === LabOrdersTabs.Summary && userPermissions.includes(UserPermissions.AnalysesViewResults) && (
          <LabSummary />
        )}
        {tabName === LabOrdersTabs.Orders && userPermissions.includes(UserPermissions.AnalysesViewOrders) && (
          <LabOrders />
        )}
      </Stack>
    </>
  );
};
