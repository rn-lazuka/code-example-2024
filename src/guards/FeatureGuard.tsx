import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

type FeatureGuardProps = PropsWithChildren<{
  flag: string;
  redirectPath?: string;
  variables?: { [key: string]: any };
}>;

export const FeatureGuard = ({
  flag,
  children,
  redirectPath,
  variables = ENVIRONMENT_VARIABLES,
}: FeatureGuardProps) => {
  const isDisabled = Boolean(variables?.[flag] && variables[flag] === 'true');

  if (isDisabled && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{isDisabled ? null : children}</>;
};
