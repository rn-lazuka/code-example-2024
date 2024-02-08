import Box from '@mui/material/Box';
import { WithSx } from '@types';
import type { SidebarMenuProps } from './components/SidebarMenu';
import { SidebarMenu } from './components/SidebarMenu';
import { convertSxToArray } from '@utils/converters/mui';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { HorizontalScrollContainer } from '@components/HorizontalScrollContainer/HorizontalScrollContainer';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@constants/global';

export type SideBarProps = WithSx<SidebarMenuProps>;

export const SideBar = ({ items, sx = [] }: SideBarProps) => {
  const isNotDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const location = useLocation();

  return (
    <Box
      sx={[
        (theme) => ({
          zIndex: theme.zIndex.fab,
          p: { xs: `${theme.spacing(0.75)} 0`, md: theme.spacing(3, 3, 3, 1.5) },
          height: { xs: 'unset', md: 1 },
          display: 'flex',
          position: { xs: 'relative', md: 'sticky' },
          top: 0,
          bgcolor: { xs: theme.palette.surface.default, md: theme.palette.background.default },
          borderBottom: { xs: `solid 1px ${theme.palette.border.default}`, md: 'unset' },
          ...(location.pathname.includes(ROUTES.patientProfile)
            ? {}
            : { borderRight: `solid 1px ${theme.palette.border.default}` }),
          width: {
            xs: 1,
            md: theme.spacing(27),
          },
          '& nav': {
            mb: 0,
          },
          '& nav a': {
            width: 1,
          },
          overflowY: { xs: 'unset', md: 'auto' },
          '::-webkit-scrollbar': {
            width: 0,
          },
        }),
        ...convertSxToArray(sx),
      ]}
    >
      {isNotDesktop && (
        <HorizontalScrollContainer sx={{ px: 2 }}>
          <SidebarMenu items={items} sx={(theme) => ({ mb: theme.spacing(1) })} />
        </HorizontalScrollContainer>
      )}
      {!isNotDesktop && <SidebarMenu items={items} sx={(theme) => ({ mb: theme.spacing(1) })} />}
    </Box>
  );
};
