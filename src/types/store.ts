import { store } from '@store';
import { Store } from '@reduxjs/toolkit';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type StoreWithDynamicReducers = Store & { asyncReducers?: any; injectReducer?: any };
