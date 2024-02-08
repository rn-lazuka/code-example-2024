import ModuleNotLoaded from '@components/ModuleNotLoaded/ModuleNotLoaded';
import type { RemoteModule, RemoteModuleProps } from '@types';
import { RemoteWrapper } from '@components/RemoteWrapper/RemoteWrapper';
import { runSaga, store } from '@store/store';
import { lazy } from 'react';
import { selectUserPermissions } from '@store/slices';
import { ViewPermissions } from '@enums/route';

const BillingModuleProvider =
  MODULE_BILLING_ACTIVE === false
    ? () => <></>
    : lazy<RemoteModule<RemoteModuleProps>>(() =>
        import('Billing/ModuleProvider').catch((error) => {
          console.log('BillingModule has not been loaded ---', { error });
          return { default: ModuleNotLoaded };
        }),
      );

export const BillingModule = () => {
  const userPermissions = selectUserPermissions();

  if (MODULE_BILLING_ACTIVE === false || !userPermissions?.includes(ViewPermissions.BillingAccessSection)) return null;

  return (
    <RemoteWrapper>
      <BillingModuleProvider runSaga={runSaga} store={store} />
    </RemoteWrapper>
  );
};
