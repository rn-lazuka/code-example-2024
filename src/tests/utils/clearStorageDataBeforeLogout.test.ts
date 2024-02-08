import { clearStorageDataBeforeLogout } from '@utils';

describe('clearStorageDataBeforeLogout', () => {
  it('should remove refresh_token, access_token, currentOrganizationId, currentBranchId and initData from localStorage', () => {
    localStorage.setItem('refresh_token', 'token');
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('currentOrganizationId', 'id');
    localStorage.setItem('currentBranchId', 'id');
    localStorage.setItem('initData', JSON.stringify({ someData: 'test' }));
    clearStorageDataBeforeLogout();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('currentOrganizationId')).toBeNull();
    expect(localStorage.getItem('currentBranchId')).toBeNull();
    expect(localStorage.getItem('initData')).toBeNull();
  });
});
