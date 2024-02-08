import React from 'react';
import './i18n/config';
import { store } from '@store/index';
import { Provider } from 'react-redux';
import App from './App';

const AppWithStore = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWithStore;
