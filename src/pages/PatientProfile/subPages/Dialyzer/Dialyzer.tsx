import { useDispatchOnUnmount } from '@hooks';
import { addServiceModal, clearDialyzersList, getDialyzersList } from '@store';
import { Stack } from '@mui/material';
import { DialyzerTable } from '@components/pages/PatientProfile/tables/DialyzerTable';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@hooks/storeHooks';
import { GlobalAddButton } from '@components/GlobalAddButton/GlobalAddButton';
import { UserPermissions, AddDialyzerModalPlace, ServiceModalName } from '@enums';
import { PermissionGuard } from '@guards/PermissionGuard';

export const Dialyzer = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useDispatchOnUnmount(clearDialyzersList());

  useEffect(() => {
    id && dispatch(getDialyzersList(id));
  }, [id]);

  const openDrawer = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.AddDialyzerModal,
        payload: {
          place: AddDialyzerModalPlace.DIALYZER_PAGE,
          patientId: id,
        },
      }),
    );
  };

  return (
    <>
      <PermissionGuard permissions={UserPermissions.DialyzerManage}>
        <GlobalAddButton onClick={openDrawer} data-testid="addNewDialyzerButton" />
      </PermissionGuard>
      <Stack
        direction="column"
        sx={(theme) => ({
          width: 1,
          height: 1,
          p: 0,
          backgroundColor: theme.palette.surface.default,
        })}
        spacing={3}
      >
        <DialyzerTable />
      </Stack>
    </>
  );
};
