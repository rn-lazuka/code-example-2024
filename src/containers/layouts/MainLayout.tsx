import type { WithSx } from '@types';
import { useModuleSwitcher } from '@hooks/useModuleSwitcher';
import { selectSystemModuleSlots } from '@store/slices';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import type { PropsWithChildren } from 'react';
import { LocationBrowserStorage } from '@services';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import { selectUserPermissions } from '@store/slices/userSlice';
import { NoPermissions } from '@containers/layouts/NoPermissions/NoPermissions';
import { convertSxToArray } from '@src/utils';
import { Helmet } from 'react-helmet';

type MainLayoutProps = WithSx<PropsWithChildren<{}>>;

export const MainLayout = ({ children, sx = [] }: MainLayoutProps) => {
  const location = useLocation();

  const slots = selectSystemModuleSlots();
  const userPermissions = selectUserPermissions();

  useModuleSwitcher();

  const browserHistory = new LocationBrowserStorage();
  browserHistory.fetch(location.pathname);

  return (
    <ErrorBoundary logErrors>
      <Helmet>
        <title>{ENVIRONMENT_VARIABLES.APP_NAME}</title>
      </Helmet>
      {slots.header}
      {userPermissions.length ? children : <NoPermissions />}
      <Box
        sx={[
          (theme) => ({
            zIndex: theme.zIndex.tooltip,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: `solid 1px ${theme.palette.border.default}`,
            display: 'flex',
            justifyContent: 'center',
            bgcolor: theme.palette.surface.default,
          }),
          ...convertSxToArray(sx),
        ]}
      >
        {slots.footer}
      </Box>
    </ErrorBoundary>
  );
};
