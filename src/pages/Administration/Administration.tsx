import { StackBlock } from '@components';
import {
  administrationBranchManagement,
  administrationDialysisMachinesManagement,
  administrationStaffManagement,
  administrationTenantManagement,
} from '@constants';
import { IconColors, UserPermissions, ViewPermissions } from '@enums';
import { PermissionGuard } from '@guards';
import { Stack } from '@mui/material';
import { selectUserPermissions } from '@store/slices';
import { useTranslation } from 'react-i18next';

export const Administration = () => {
  const { t } = useTranslation('administration');
  const userPermissions = selectUserPermissions();
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      spacing={2}
      sx={({ spacing }) => ({ width: 1, padding: spacing(0, 3, 8, 3) })}
    >
      <PermissionGuard exact={false} permissions={[UserPermissions.TenantView]}>
        <StackBlock title={t('tenantManagement')} cards={administrationTenantManagement()} />
      </PermissionGuard>
      <PermissionGuard permissions={UserPermissions.BranchView}>
        <StackBlock title={t('branchManagement')} cards={administrationBranchManagement()} />
      </PermissionGuard>
      <PermissionGuard
        exact={false}
        permissions={[UserPermissions.ViewAdministrationStaffManagement, UserPermissions.ViewAdministrationUsersList]}
      >
        <StackBlock title={t('staffAndUserManagement')} cards={administrationStaffManagement()} />
      </PermissionGuard>
      <PermissionGuard permissions={ViewPermissions.ViewAdministrationMachines}>
        <StackBlock
          title={t('dialysisMachinesManagement')}
          cards={administrationDialysisMachinesManagement().filter((card) =>
            userPermissions.includes(card?.permission),
          )}
          iconColor={IconColors.yellow}
        />
      </PermissionGuard>
    </Stack>
  );
};
