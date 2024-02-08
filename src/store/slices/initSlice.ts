import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState, InitSliceState } from '@types';
import { useAppSelector } from '@hooks/storeHooks';

const initialState: InitSliceState = {
  loading: true,
  status: false,
  error: undefined,
};

export const initSlice = createSlice({
  name: 'init',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    appInit: () => {},
    // Use the PayloadAction type to declare the contents of `action.payload`
    appInitSuccess(state, action: PayloadAction<boolean>) {
      state.loading = false;
      state.status = action.payload;
    },
    appInitError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
    },
    setAppLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
  },
});

export const { appInit, appInitSuccess, setAppLoading, appInitError } = initSlice.actions;

export const selectInitLoading = () => useAppSelector((state: RootState) => state.init.loading);

const initReducer = initSlice.reducer;
export default initReducer;
