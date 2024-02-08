import type { WithSx } from '@types';
import Box from '@mui/material/Box';
import type { DrawerProps } from '@mui/material/Drawer';
import Drawer from '@mui/material/Drawer';
import type { MenuProps } from './components/Menu';
import { Menu } from './components/Menu';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import { Footer } from '../../../Footer';
import { convertSxToArray } from '@utils/converters/mui';
import { FooterPlace } from '@enums/containers';
import { footerHeight } from '@constants';

export type NavigationDrawerProps = WithSx<{
  isOpen: DrawerProps['open'];
}> &
  MenuProps;

export const NavigationDrawer = ({ isOpen, onClose, items, sx = [] }: NavigationDrawerProps) => {
  return (
    <Drawer open={isOpen} onClose={onClose} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
      <Box
        sx={[
          (theme) => ({
            pt: 3,
            pb: { xs: 0, sm: theme.spacing(footerHeight) },
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.surface.default,
          }),
          ...convertSxToArray(sx),
        ]}
      >
        <Box
          sx={(theme) => ({
            px: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: 1,
            borderBottom: `solid 1px ${theme.palette.border.default}`,
            '& nav': { m: 0 },
          })}
        >
          <IconButton onClick={onClose} sx={{ p: 0, ml: 1, mb: 2 }} disableRipple>
            <CloseOutlinedIcon />
          </IconButton>
          <Menu onClose={onClose} items={items} sx={(theme) => ({ mb: theme.spacing(1) })} />
        </Box>
        <Footer place={FooterPlace.Drawer} />
      </Box>
    </Drawer>
  );
};
