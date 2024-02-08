import type { WithSx } from '@types';
import { useDispatchOnUnmount } from '@hooks';
import { useEffect } from 'react';
import { MainContentContainer } from '@containers';
import { SideBar } from './SideBar';
import Box from '@mui/material/Box';
import { convertSxToArray } from '@utils/converters/mui';
import { staffMenuItems } from '@containers/layouts/SideBar/constants';
import { clearStaffUserData, getStaffUserInfo, selectStaffUserId, selectStaffUserName } from '@store/slices';
import { useAppDispatch } from '@hooks/storeHooks';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { BackNavigation } from '@containers/layouts/BackNavigation/BackNavigation';
import Stack from '@mui/material/Stack';
import { backNavigationHeight, ROUTES } from '@constants';

type StaffContentContainerProps = WithSx<{
  fullHeight?: boolean;
}>;

export const StaffContentContainer = ({ fullHeight = false, sx }: StaffContentContainerProps) => {
  const staffUserName = selectStaffUserName();
  const staffUserId = selectStaffUserId();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const pathName = location.pathname.split('/');
  const path = pathName[pathName.length - 1];

  useDispatchOnUnmount(clearStaffUserData());

  useEffect(() => {
    if (id && staffUserId !== Number(id) && path !== ROUTES.staffProfile) {
      dispatch(getStaffUserInfo(id));
    }
  }, [id, staffUserId]);

  return (
    <MainContentContainer fullHeight={fullHeight} sx={[{ flexDirection: 'column' }, ...convertSxToArray(sx)]}>
      <BackNavigation backButtonTitle={staffUserName} />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ height: (theme) => `calc(100% - ${theme.spacing(backNavigationHeight)})` }}
      >
        <SideBar items={staffMenuItems} />
        <Box
          sx={(theme) => ({
            overflowY: 'auto',
            flex: { xs: 1, md: 'unset' },
            width: {
              xs: 1,
              md: `calc(100% - ${theme.spacing(27)})`,
            },
          })}
        >
          <Outlet />
        </Box>
      </Stack>
    </MainContentContainer>
  );
};
