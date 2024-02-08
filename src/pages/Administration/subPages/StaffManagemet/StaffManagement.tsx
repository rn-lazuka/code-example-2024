import { useDispatchOnUnmount } from '@hooks';
import { useEffect } from 'react';
import { useAppDispatch } from '@hooks/storeHooks';
import {
  getStaffList,
  getStaffRoles,
  resetStaffManagementPage,
  selectStaffRolesFilter,
} from '@store/slices/staffManagement';
import { AdministrationLayout } from '@containers/layouts/Admnistration/AdministrationLayout';
import { StaffManagementViewTable } from '@components/pages/Administration/subPages/StaffManagement/StaffManagementViewTable';

export const StaffManagement = () => {
  const dispatch = useAppDispatch();
  const staffRoles = selectStaffRolesFilter();

  useDispatchOnUnmount(resetStaffManagementPage());

  useEffect(() => {
    dispatch(getStaffList());
    if (!staffRoles.length) dispatch(getStaffRoles());
  }, []);

  return (
    <AdministrationLayout navigateBackIcon sx={{ bgcolor: (theme) => theme.palette.surface.default }}>
      <StaffManagementViewTable />
    </AdministrationLayout>
  );
};
