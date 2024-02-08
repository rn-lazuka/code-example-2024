import type { PayloadAction } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import { useDispatchOnUnmount } from '@hooks';
import { getTestStore, RenderHookWrapper } from '@unit-tests/_utils';

describe('useDispatchOnUnmount', () => {
  it('Should dispatch on unmount', () => {
    const store = getTestStore({});
    const dispatch = jest.fn();
    store.dispatch = dispatch;

    const action: PayloadAction<null> = { type: 'TEST_TYPE', payload: null };

    const { unmount } = renderHook(() => useDispatchOnUnmount(action), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });

    expect(dispatch).not.toHaveBeenCalled();

    unmount();

    expect(dispatch).toHaveBeenCalledWith(action);
  });
});
