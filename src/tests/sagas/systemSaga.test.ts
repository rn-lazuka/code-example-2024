import type { Action } from 'redux';
import { runSagaHandler } from '@unit-tests';
import { updateNetworkConnectionSaga } from '@sagas/systemSaga';
import { addSnack, systemUpdateNetworkConnection, systemUpdatePageFocus } from '@store';
import { SnackType } from '@enums/components';
import i18n from 'i18next';

describe('System Saga tests', () => {
  describe('updateNetworkConnectionSaga', () => {
    it('should correctly handle case with restored connection', async () => {
      const dispatched: Action[] = [];

      await runSagaHandler(
        dispatched,
        {
          system: {
            networkConnection: {
              backOnline: true,
            },
          },
        },
        updateNetworkConnectionSaga,
        {
          type: systemUpdateNetworkConnection.type,
        },
      );

      expect(dispatched).toEqual([
        addSnack({
          type: SnackType.Success,
          message: i18n.t('connectionRestored'),
          clear: true,
        }),
        systemUpdatePageFocus({ isActive: true }),
      ]);
    });

    it('should correctly handle case with no connection', async () => {
      const dispatched: Action[] = [];

      await runSagaHandler(
        dispatched,
        {
          system: {
            networkConnection: {
              backOnline: false,
            },
          },
        },
        updateNetworkConnectionSaga,
        {
          type: systemUpdateNetworkConnection.type,
        },
      );

      expect(dispatched).toEqual([
        addSnack({
          type: SnackType.Error,
          message: i18n.t('noConnection'),
        }),
      ]);
    });
  });
});
