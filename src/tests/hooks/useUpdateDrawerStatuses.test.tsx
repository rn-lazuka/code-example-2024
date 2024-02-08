import { DrawerType } from '@enums/containers';
import { useUpdateDrawerStatuses } from '@hooks/updateDrawerStatuses';
import { renderHook } from '@testing-library/react';
import { updateDrawer } from '@store/slices';
import { act } from 'react-dom/test-utils';
import { getTestStore, RenderHookWrapper } from '@unit-tests';

describe('useUpdateDrawerStatuses', () => {
  it('should update the drawer status', () => {
    const dispatch = jest.fn();
    const store = getTestStore({});
    store.dispatch = dispatch;

    const type = DrawerType.Empty;
    const isDirty = true;

    renderHook(() => useUpdateDrawerStatuses(type, isDirty), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });

    expect(dispatch).toHaveBeenCalledWith(updateDrawer({ type, statuses: { isDirty } }));
  });

  it('should not update the drawer status if the inputs have not changed', () => {
    const dispatch = jest.fn();
    const store = getTestStore({});
    store.dispatch = dispatch;

    const type = DrawerType.Empty;
    const isDirty = true;

    const { rerender } = renderHook(() => useUpdateDrawerStatuses(type, isDirty), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });
    rerender();

    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it('should update the drawer status if the inputs have changed', () => {
    const dispatch = jest.fn();
    const store = getTestStore({});
    store.dispatch = dispatch;

    const type = DrawerType.Empty;
    const isDirty = true;

    const { rerender } = renderHook(() => useUpdateDrawerStatuses(type, isDirty), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });

    act(() => {
      rerender();
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
