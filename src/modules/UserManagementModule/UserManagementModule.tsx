import ModuleNotLoaded from '@components/ModuleNotLoaded/ModuleNotLoaded';
import type { RemoteModule, RemoteModuleProps } from '@types';
import { RemoteWrapper } from '@components/RemoteWrapper/RemoteWrapper';
import { runSaga, store } from '@store/store';
import { lazy } from 'react';

const UserManagementModuleProvider =
  MODULE_USER_MANAGEMENT_ACTIVE === false
    ? () => <></>
    : lazy<RemoteModule<RemoteModuleProps>>(() =>
        import('UserManagement/ModuleProvider').catch((error) => {
          console.log('UserManagementModule has not been loaded ---', { error });
          return { default: ModuleNotLoaded };
        }),
      );

export const UserManagementModule = () => {
  if (MODULE_USER_MANAGEMENT_ACTIVE === false) return null;

  return (
    <RemoteWrapper>
      <UserManagementModuleProvider runSaga={runSaga} store={store} />
    </RemoteWrapper>
  );
};
