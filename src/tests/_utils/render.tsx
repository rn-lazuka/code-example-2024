import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { queries, render as rtlRender, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ServiceModal, Snacks } from '@components';
import theme from '@src/styles/theme';
import { getTestStore } from './store';

type WrapperProps = {
  children?: ReactNode;
};

interface RenderTestsProps {
  preloadedState?: any;
  store?: any;
}

export const render = (
  ui: ReactElement,
  { preloadedState, store = getTestStore(preloadedState), ...renderOptions }: RenderTestsProps = {},
) => {
  const Wrapper = ({ children }: WrapperProps) => {
    return (
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <Provider store={store}>
              <ServiceModal />
              <Snacks />
              {children}
            </Provider>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions } as RenderOptions<typeof queries>);
};

export const RenderHookWrapper = ({ children, ...props }: PropsWithChildren<any>) => (
  <Provider {...props}>{children}</Provider>
);
