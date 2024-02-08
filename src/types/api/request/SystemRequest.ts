export interface InitData {
  authUrl: string;
  clientId: string;
  tenantId: string;
  // TODO: there's no such fields as loginUrl && logoutUrl in api response
  logInUrl: string;
  logOutUrl: string;
  tenantName: string;
  timeZone: string;
}
