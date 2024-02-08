import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import { getRoutePermissions } from '@utils';
import type { NavigationTab } from '@types';

interface TopNavigationProps {
  tabs: NavigationTab[];
}

export const TopNavigation = ({ tabs }: TopNavigationProps) => {
  const { t } = useTranslation('common');
  const paths = tabs.map((tab) => tab.path);
  const location = useLocation();
  const routeMatch = `/${location.pathname.split('/')[1]}` || '';
  const { showRoute } = getRoutePermissions();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  if (isXs) return null;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        px: 3,
      }}
    >
      <Tabs
        value={paths.includes(routeMatch) ? routeMatch : false}
        TabIndicatorProps={{
          sx: {
            height: '3px',
          },
        }}
      >
        {tabs
          .filter((tab) => tab?.active !== false)
          .map(
            (tab) =>
              showRoute[tab.permission] && (
                <Tab
                  key={tab.title}
                  label={<Typography variant="labelSCapsSB">{t(tab.title)}</Typography>}
                  value={tab.path}
                  to={tab.path}
                  component={Link}
                  disableRipple
                  sx={(theme) => ({
                    px: 0,
                    py: 2.5,
                    mx: 1.5,
                    minWidth: 'unset',
                    color: theme.palette.text.primary,
                    '&.Mui-selected': { color: theme.palette.text.primary },
                  })}
                />
              ),
          )}
      </Tabs>
    </Box>
  );
};
