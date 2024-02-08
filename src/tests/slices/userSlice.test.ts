import {
  store,
  getUserSummary,
  getUserSummarySuccess,
  initialState,
  resetUser,
  setBranch,
  setError,
  setTenant,
} from '@store';
import { User } from '@types';

const userSummeryData: User = {
  id: 1,
  firstName: 'Test Name',
  lastName: 'Test LastName',
  login: 'Test login',
  currentBranchId: '1',
  currentOrganizationId: '1',
  organizations: [
    {
      id: '1',
      name: 'Test Organization Name',
      branches: [
        {
          id: '1',
          name: 'Test Branch Name',
        },
      ],
    },
    {
      id: '2',
      name: 'Test Organization Name 2',
      branches: [
        {
          id: '2',
          name: 'Test Branch Name 2',
        },
      ],
    },
  ],
  roles: ['TEST_ROLE'],
  permissions: ['TEST_PERMISSION'],
  hasOpenEncounter: false,
  currency: 'usd',
};
describe('userSlice', () => {
  beforeEach(() => {
    store.dispatch(resetUser());
  });
  const getState = () => {
    return store.getState().user;
  };

  it('should have correct initial state', () => {
    const state = getState();
    expect(state).toEqual(initialState);
  });

  it('should correctly change state after "getUserSummary" action', () => {
    store.dispatch(getUserSummary());
    const state = getState();

    expect(state.loading).toEqual(true);
  });

  it('should correctly change state after "getUserSummarySuccess" action', () => {
    store.dispatch(getUserSummarySuccess(userSummeryData));
    const state = getState();

    expect(state.loading).toEqual(false);
    expect(state.user).toEqual(userSummeryData);
  });

  it('should correctly change state after "setTenant" action', () => {
    store.dispatch(getUserSummarySuccess(userSummeryData));
    store.dispatch(setTenant(userSummeryData.organizations[1]));
    const state = getState();

    expect(state.user?.currentBranchId).toEqual(userSummeryData.organizations[1].branches[0].id);
    expect(state.user?.currentOrganizationId).toEqual(userSummeryData.organizations[1].id);
  });

  it('should not change state after "setTenant" action, if user equals null', () => {
    store.dispatch(setTenant(userSummeryData.organizations[1]));
    const state = getState();

    expect(state.user).toEqual(initialState.user);
  });

  it('should correctly change state after "setBranch" action', () => {
    store.dispatch(getUserSummarySuccess(userSummeryData));
    store.dispatch(setBranch({ value: '2', navigate: () => {} }));
    const state = getState();

    expect(state.user?.currentBranchId).toEqual('2');
  });

  it('should not change state after "setBranch" action, if user equals null', () => {
    store.dispatch(setTenant(userSummeryData.organizations[1]));
    const state = getState();

    expect(state.user).toEqual(initialState.user);
  });

  it('should correctly change state after "setError" action', () => {
    store.dispatch(setError({ name: 'Test Error', message: 'Test error message' }));
    const state = getState();

    expect(state.error).toEqual('Test error message');
  });
});
