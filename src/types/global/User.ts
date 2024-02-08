type Branch = {
  id: string;
  name: string;
};

export type Organization = {
  id: string;
  name: string;
  branches: Branch[];
};

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  photoPath?: string;
  organizations: Organization[];
  currentBranchId: string;
  currentOrganizationId: string;
  roles: string[];
  permissions: string[];
  hasOpenEncounter: boolean;
  currency: string;
}

export type UserEntityWithDeleted = {
  id: number;
  name: string;
  deleted: boolean;
};
