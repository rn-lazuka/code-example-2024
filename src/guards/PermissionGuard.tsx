import { PropsWithChildren } from 'react';
import { UserPermissions, UserRoles, ViewPermissions } from '@enums';
import { selectUserPermissions, selectUserRoles } from '@store';

type PermissionGuardProps = PropsWithChildren<{
  permissions?: (UserPermissions | ViewPermissions) | (UserPermissions | ViewPermissions)[];
  roles?: UserRoles | UserRoles[];
  invert?: boolean;
  exact?: boolean;
}>;

export const PermissionGuard = ({
  children,
  invert,
  permissions = [],
  roles = [],
  exact = true,
}: PermissionGuardProps) => {
  const userPermissions = selectUserPermissions();
  const userRoles = selectUserRoles();
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  const roleArray = Array.isArray(roles) ? roles : [roles];

  const permissionAllowed = exact
    ? permissionArray.every((permission) => userPermissions.includes(permission))
    : permissionArray.some((permission) => userPermissions.includes(permission));

  const roleAllowed = roleArray.reduce<boolean>((acc, permission) => {
    return !acc || userRoles.includes(permission);
  }, true);
  let hasPermission = permissionAllowed && roleAllowed;

  if (invert) hasPermission = !hasPermission;

  return <>{hasPermission ? children : null}</>;
};
