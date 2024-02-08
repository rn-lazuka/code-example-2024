import { Outlet } from 'react-router-dom';
import { MainContentContainer } from '@containers/layouts/MainContentContainer';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import type { WithSx } from '@types';
import { backNavigationHeight } from '@constants';
import { selectDialysisMachine } from '@store';
import { convertSxToArray } from '@utils';
import { BackNavigation } from '@containers/layouts/BackNavigation/BackNavigation';
import { dialysisMachineMenuItems } from '@containers/layouts/SideBar/constants';
import { SideBar } from '@containers/layouts/SideBar';

type DialysisMachineLayoutProps = WithSx;

export const DialysisMachineLayout = ({ sx }: DialysisMachineLayoutProps) => {
  const machine = selectDialysisMachine();

  return (
    <MainContentContainer fullHeight sx={[{ flexDirection: 'column' }, ...convertSxToArray(sx)]}>
      <BackNavigation backButtonTitle={machine?.name} />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ height: (theme) => `calc(100% - ${theme.spacing(backNavigationHeight)})` }}
      >
        <SideBar items={dialysisMachineMenuItems} />
        <Box
          sx={(theme) => ({
            overflowY: 'auto',
            flex: { xs: 1, md: 'unset' },
            width: {
              xs: 1,
              md: `calc(100% - ${theme.spacing(27)})`,
            },
            bgcolor: theme.palette.surface.default,
          })}
        >
          <Outlet />
        </Box>
      </Stack>
    </MainContentContainer>
  );
};
