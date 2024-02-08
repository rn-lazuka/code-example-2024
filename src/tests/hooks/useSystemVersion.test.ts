import { renderHook } from '@testing-library/react';
import { getTestStore, RenderHookWrapper } from '@unit-tests';
import { useSystemVersion } from '@hooks/useSystemVersion';
import { SystemModuleName } from '@enums/global';

const user = {
  id: 1,
  firstName: 'Name',
  lastName: 'Lastname',
  login: 'login',
  organizations: [],
  currentBranchId: 1000,
  currentOrganizationId: 1001,
  roles: [],
  permissions: [],
};

describe('useSystemVersion', () => {
  it('should get back an object with data about system version and hash', () => {
    const store = getTestStore({
      user: {
        user,
      },
      system: {
        moduleBuildVersions: {
          [SystemModuleName.Host]: '1.5.0-testbuild',
        },
      },
    });

    const { result } = renderHook(() => useSystemVersion(), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });

    expect(result.current.mainVersion).toEqual('1.5.0');
    expect(result.current.buildVersion).toEqual('testbuild');
    expect(result.current.hashVersion).toBeTruthy();
  });
});
