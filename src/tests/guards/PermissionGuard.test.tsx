import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { UserPermissions, UserRoles, ViewPermissions } from '@enums';
import { PermissionGuard } from '@guards';

describe('PermissionGuard', () => {
  const validPermissions = [ViewPermissions.DialysisViewPrescriptions];
  const invalidPermissions = [UserPermissions.PatientAdd];
  const validRoles = [UserRoles.ROLE_NURSE];
  const invalidRoles = [UserRoles.ROLE_DOCTOR];
  const text = 'TEST TEXT';

  it('should check that the component is being rendered and permissions check works', () => {
    const { rerender } = render(
      <PermissionGuard permissions={validPermissions}>
        <div>{text}</div>
      </PermissionGuard>,
      {
        preloadedState: {
          user: { user: { permissions: validPermissions } },
        },
      },
    );
    expect(screen.queryByText(text)).toBeTruthy();
    rerender(
      <PermissionGuard permissions={invalidPermissions}>
        <div>{text}</div>
      </PermissionGuard>,
    );
    expect(screen.queryByText(text)).toBeFalsy();
  });

  it('should check that the component is being rendered and roles check works', () => {
    const { rerender } = render(
      <PermissionGuard roles={validRoles}>
        <div>{text}</div>
      </PermissionGuard>,
      {
        preloadedState: {
          user: { user: { roles: validRoles } },
        },
      },
    );
    expect(screen.queryByText(text)).toBeTruthy();
    rerender(
      <PermissionGuard roles={invalidRoles}>
        <div>{text}</div>
      </PermissionGuard>,
    );
    expect(screen.queryByText(text)).toBeFalsy();
  });
});
