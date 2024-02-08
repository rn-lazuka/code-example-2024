import { NavigateFunction, useNavigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';

export const globalRouter = { navigate: null } as {
  navigate: null | NavigateFunction;
};

type GlobalRouterProviderProps = PropsWithChildren<{}>;

export const GlobalRouterProvider = ({ children }: GlobalRouterProviderProps) => {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;

  return <>{children}</>;
};
