import { useDispatchOnUnmount } from '@hooks/useDispatchOnUnmount';
import Stack from '@mui/material/Stack';
import { getVirologyList, resetVirologySlice } from '@store/slices';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@hooks/storeHooks';
import { useEffect } from 'react';
import { VirologyTable } from '@components/pages/PatientProfile/tables/VirologyTable';

export const Virology = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useDispatchOnUnmount(resetVirologySlice());

  useEffect(() => {
    if (id) {
      dispatch(getVirologyList(id));
    }
  }, [id]);

  return (
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
      <VirologyTable />
    </Stack>
  );
};
