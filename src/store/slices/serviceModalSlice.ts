import type { PayloadAction } from '@reduxjs/toolkit';
import type { ServiceModalSliceState } from '@types';
import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '@hooks/storeHooks';
import { ServiceModalName } from '@enums/components/ServiceModal';

const initialState: ServiceModalSliceState = {};

export const serviceModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    addServiceModal: (
      state,
      { payload: { name, payload } }: PayloadAction<{ name: ServiceModalName; payload: any }>,
    ) => {
      state[name] = payload;
    },
    removeServiceModal: (state, { payload }: PayloadAction<ServiceModalName>) => {
      if (payload in state) {
        delete state[payload];
      }
    },
  },
});

export const { addServiceModal, removeServiceModal } = serviceModalSlice.actions;

export const selectServiceModal = (modalName: ServiceModalName) =>
  useAppSelector((state) => state.serviceModal[modalName]);
export const selectServiceModals = () => useAppSelector((state) => state.serviceModal);
export const selectHasServiceModal = () => useAppSelector((state) => !!Object.keys(state.serviceModal).length);

const serviceModalReducer = serviceModalSlice.reducer;
export default serviceModalReducer;
