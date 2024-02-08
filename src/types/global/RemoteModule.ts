import React from 'react';
import { SagaMiddleware } from 'redux-saga';
import { StoreWithDynamicReducers } from '../store';

export type RemoteModuleProps = {
  store: StoreWithDynamicReducers;
  runSaga: SagaMiddleware['run'];
};

export type RemoteModule<T> = React.ComponentType<T>;
