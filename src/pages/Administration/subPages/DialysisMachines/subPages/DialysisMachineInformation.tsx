import { useDispatchOnUnmount } from '@hooks/useDispatchOnUnmount';
import type { PropsWithChildren } from 'react';
import type { WithSx } from '@types';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, isValid } from 'date-fns';
import { useAppDispatch } from '@hooks/storeHooks';
import {
  addDrawer,
  getDialysisMachine,
  getDialysisMachinesIsolationGroups,
  getDialysisMachineSuccess,
  removeDrawer,
  selectDialysisMachine,
  selectHasActiveDrawers,
} from '@store';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataRow } from '@components/DataRow/DataRow';
import { DialysisMachineStatus } from '@components/pages/Administration/subPages/DialysisMachines/components/DialysisMachineStatus';
import { DialysisMachineStatus as DialysisMachineStatusEnum, DrawerType, UserPermissions } from '@enums';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { convertSxToArray, Dictionaries } from '@utils';
import { PermissionGuard } from '@guards';
import Button from '@mui/material/Button';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ROUTES } from '@constants';
import { MachineInformationSkeleton } from '@components/pages/Administration/subPages/DialysisMachine/MachineInformationSkeleton';

export const DialysisMachineInformation = () => {
  const { id } = useParams();
  const { t } = useTranslation('dialysisMachine');
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const machine = selectDialysisMachine();
  const hasActiveDrawers = selectHasActiveDrawers();
  const { t: tCommunications } = useTranslation(Dictionaries.DialysisMachineCommunicationTypes);

  useDispatchOnUnmount(getDialysisMachineSuccess(null));

  useEffect(() => {
    if (id) {
      dispatch(removeDrawer(DrawerType.DialysisMachineForm));
      dispatch(getDialysisMachine(id));
    }
  }, [id]);

  useEffect(() => {
    dispatch(getDialysisMachinesIsolationGroups());
  }, []);

  const onEditDialysisMachine = useCallback(() => {
    dispatch(
      addDrawer({
        type: DrawerType.DialysisMachineForm,
        allowedPathsToShowDrawer: [ROUTES.administration],
        payload: {
          isEditing: true,
        },
      }),
    );
  }, []);

  return (
    <>
      <Typography
        variant="headerM"
        sx={(theme) => ({
          p: theme.spacing(2, 3),
          backgroundColor: theme.palette.surface.default,
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.04)',
          borderBottom: `1px solid ${theme.palette.border.default}`,
        })}
      >
        {t('dialysisMachineInformation')}
      </Typography>
      {machine && (
        <Stack direction="column" sx={(theme) => ({ p: theme.spacing(3, 2) })}>
          <Stack direction="row" spacing={1} sx={{ py: 1 }}>
            <PermissionGuard permissions={UserPermissions.DialysisMachineEdit}>
              <Button
                variant="contained"
                size="medium"
                onClick={() => onEditDialysisMachine()}
                disabled={hasActiveDrawers || !machine}
                data-testid="editDialysisMachineButton"
                sx={{ p: ({ spacing }) => spacing(1, 2, 1, 1) }}
              >
                <EditOutlinedIcon
                  sx={{
                    mr: 1,
                    fill: ({ palette }) => (hasActiveDrawers || !machine ? palette.neutral[60] : palette.primary[100]),
                  }}
                />
                {tCommon('button.edit')}
              </Button>
            </PermissionGuard>
          </Stack>
          <Column title={t('data.general')}>
            <DataRow title={t('data.equipmentName')} value={machine.name} />
            <DataRow title={t('data.serialNumber')} value={machine.serialNumber} />
            <DataRow title={t('data.model')} value={machine.model} />
            <DataRow title={t('data.brand')} value={machine.brand} />
            <DataRow
              title={t('data.communicationType')}
              value={machine?.communicationType ? tCommunications(machine.communicationType) : null}
            />
            <DataRow title={t('data.slots')} value={machine?.slotCount ? tCommunications(machine.slotCount) : null} />
            <DataRow
              title={t('data.description')}
              value={machine?.description ? tCommunications(machine.description) : null}
            />
          </Column>
          <Column title={t('data.condition')}>
            <DataRow title={t('data.status')} value={<DialysisMachineStatus caption status={machine?.status} />} />
            <DataRow title={t('data.commissionDate')} value={convertDateStringToViewFormat(machine.commissionedDate)} />
            <DataRow title={t('data.infectionStatus')} value={machine.isolationGroup?.name} />
            <DataRow title={t('data.connectedBay')} value={machine.location?.name} />
          </Column>
          <Column title={t('data.maintenance')}>
            <DataRow
              title={t('data.underMaintenance')}
              value={
                <DialysisMachineStatus
                  status={
                    machine.maintenanceFinished ? DialysisMachineStatusEnum.RETIRED : DialysisMachineStatusEnum.ACTIVE
                  }
                />
              }
            />
            <DataRow
              title={t('data.dateOfPreventiveMaintenance')}
              value={convertDateStringToViewFormat(machine.maintenanceTo)}
            />
          </Column>
          <Column sx={{ mb: ({ spacing }) => spacing(2) }} title={t('data.warranty')}>
            <DataRow
              title={t('data.underWarranty')}
              value={
                <DialysisMachineStatus
                  status={
                    machine.warrantyFinished ? DialysisMachineStatusEnum.RETIRED : DialysisMachineStatusEnum.ACTIVE
                  }
                />
              }
            />
            <DataRow
              title={t('data.warrantyDateRange')}
              value={`${convertDateStringToViewFormat(machine.warrantyFrom)} – ${convertDateStringToViewFormat(
                machine.warrantyTo,
              )}`}
            />
          </Column>
          <DataRow
            title={<ChatOutlinedIcon />}
            value={machine.comment}
            sx={{ '& .MuiTypography-root': { wordBreak: 'break-word', maxWidth: '50%' } }}
          />
        </Stack>
      )}
      {!machine && <MachineInformationSkeleton />}
    </>
  );
};

const convertDateStringToViewFormat = (date?: string) => {
  if (!date || !isValid(new Date(date))) return undefined;
  return format(new Date(date), 'dd/MM/yyyy');
};

const Column = ({
  title,
  children,
  sx,
}: WithSx<
  PropsWithChildren<{
    title: string;
  }>
>) => {
  return (
    <Stack
      spacing={2}
      sx={[
        {
          pt: ({ spacing }) => spacing(1),
          mb: ({ spacing }) => spacing(0.5),
        },
        ...convertSxToArray(sx),
      ]}
    >
      <Typography variant="labelL" sx={{ mb: (theme) => theme.spacing(0.5) }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
};
