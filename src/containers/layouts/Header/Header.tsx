import { useProtectedImageDownloader } from '@hooks/useProtectedImageDownloader';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import type { WithSx } from '@types';
import Typography from '@mui/material/Typography';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { drawerMenuItems, navTabs } from '@constants';
import { Link } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import logo from '@assets/logo.svg';
import { useTranslation } from 'react-i18next';
import { TopNavigation } from './components/TopNavigation/TopNavigation';
import { NavigationDrawer } from './components/NavigationDrawer/NavigationDrawer';
import { useAppDispatch } from '@hooks/storeHooks';
import { logOut, selectNotificationsCount, selectUser, selectUserPermissions } from '@store';
import { Notifications } from '../Notifications/Notifications';
import { convertSxToArray, getCodeValueFromCatalog } from '@utils';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

type HeaderProps = WithSx;

export const Header = ({ sx = [] }: HeaderProps) => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const open = Boolean(anchorEl);
  const user = selectUser();
  const notificationsCount = selectNotificationsCount();
  const userPermissions = selectUserPermissions();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const getImageSrc = useProtectedImageDownloader();

  const [avatarSrc, setAvatarSrc] = useState('');

  useEffect(() => {
    if (user.photoPath) {
      getImageSrc(user.photoPath)
        .then((src) => setAvatarSrc(src))
        .catch(() => setAvatarSrc(''));
    }
  }, [user.photoPath]);

  const userRoles = useMemo(() => {
    const roles = user?.roles.map((role) => getCodeValueFromCatalog('userRoles', role));
    return roles ? roles.join(', ') : null;
  }, [user?.roles]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleLogOut = useCallback(() => {
    dispatch(logOut());
  }, [dispatch]);

  const handleNotificationsClick = useCallback(() => {
    setIsNotificationsOpen((isOpen) => !isOpen);
  }, [setIsNotificationsOpen]);

  const handleNotificationsClose = useCallback(
    (_: unknown, reason?: string) => {
      if (reason === 'backdropClick' || reason === 'linkClick') {
        setIsNotificationsOpen(false);
      }
    },
    [setIsNotificationsOpen],
  );

  return (
    <Paper
      component="header"
      data-testid="header"
      square
      sx={[
        (theme) => ({
          zIndex: theme.zIndex.appBar,
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          borderBottom: `solid 1px ${theme.palette.border.default}`,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
          bgcolor: theme.palette.surface.default,
        }),
        ...convertSxToArray(sx),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1920,
          mx: 'auto',
          px: isXs ? 2 : 3,
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton
            data-testid="headerBurgerButton"
            onClick={() => setIsDrawerOpen(true)}
            disableRipple
            disableFocusRipple
            sx={{ display: { md: 'none' }, pl: 0, mr: 3 }}
          >
            <MenuIcon />
          </IconButton>
          <Box component={Link} sx={{ mr: 0.25, display: 'flex' }} to="/">
            <img src={logo} alt="logo" width={146} height={40} />
          </Box>
          <TopNavigation tabs={navTabs} />
        </Box>

        <Box display="flex" py={1}>
          <Stack spacing={2} direction="row">
            {!!userPermissions.length && (
              <IconButton onClick={handleNotificationsClick} data-testid="headerNotificationsButton">
                <Badge badgeContent={notificationsCount} color="error">
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>
            )}
            {user && (
              <>
                <IconButton onClick={handleClick} disableRipple sx={{ p: 0 }} data-testid="headerAvatarButton">
                  <Avatar sx={{ width: 40, height: 40 }} src={avatarSrc}>
                    {`${user.firstName[0]} ${user.lastName[0]}`}
                  </Avatar>
                </IconButton>
                <Menu
                  disableScrollLock={true}
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  PaperProps={{ sx: { mt: 1 } }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={({ palette, spacing }) => ({
                      p: spacing(1, 2),
                      borderBottom: `solid 1px ${palette.border.default}`,
                    })}
                  >
                    <Avatar sx={{ width: 64, height: 64 }} src={user.image}>
                      {`${user.firstName[0]} ${user.lastName[0]}`}
                    </Avatar>
                    <Stack
                      direction="column"
                      spacing={0.5}
                      sx={({ spacing }) => ({
                        maxWidth: spacing(21.5),
                      })}
                    >
                      <Typography variant="paragraphM">{`${user.firstName} ${user.lastName} (${t('you')})`}</Typography>
                      <Typography
                        variant="labelS"
                        sx={(theme) => ({
                          color: theme.palette.text.secondary,
                        })}
                      >
                        {userRoles}
                      </Typography>
                    </Stack>
                  </Stack>
                  <MenuItem onClick={handleLogOut} data-testid="logoutMenuItem">
                    <Typography variant="paragraphM">{t('button.logOut')}</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Box>

        <NavigationDrawer
          sx={(theme) => ({ width: theme.spacing(33.75) })}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          items={drawerMenuItems}
        />
      </Box>
      <Notifications isOpen={isNotificationsOpen} onClose={handleNotificationsClose} />
    </Paper>
  );
};
