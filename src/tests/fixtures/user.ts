import { User } from '@types';
import { UserPermissions, UserRoles, ViewPermissions } from '@enums';

export const userFixture = (data: Partial<User> = {}): User => {
  return {
    id: 111,
    firstName: 'UserName',
    lastName: 'UserLastname',
    login: 'Login',
    organizations: [
      {
        id: 'dialysis',
        name: 'Dialysis Center',
        branches: [
          {
            id: 'branch1',
            name: 'Dialysis branch 1',
          },
          {
            id: 'branch2',
            name: 'Dialysis branch 2',
          },
        ],
      },
    ],
    currentBranchId: 'branch1',
    currentOrganizationId: 'dialysis',
    roles: [UserRoles.ROLE_NURSE],
    permissions: [
      UserPermissions.PatientAdd,
      UserPermissions.PatientViewDemographics,
      UserPermissions.PatientViewClinicalInfo,
      ViewPermissions.ViewClinicalReports,
      ViewPermissions.ViewAllPatientsFull,
      ViewPermissions.BillingAccessSection,
      ViewPermissions.ViewTodayPatients,
      ViewPermissions.AllSchedulesView,
      UserPermissions.IssueModify,
      UserPermissions.PatientModifyAccess,
      ViewPermissions.PatientViewAccess,
      UserPermissions.PatientDeleteAccess,
    ],
    hasOpenEncounter: false,
    currency: 'usd',
    ...data,
  };
};
