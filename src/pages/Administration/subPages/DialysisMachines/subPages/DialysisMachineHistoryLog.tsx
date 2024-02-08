import { useDispatchOnUnmount } from '@hooks';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import { clearDialysisMachinesSlice, getDialysisMachine } from '@store';
import Typography from '@mui/material/Typography';

export const DialysisMachineHistoryLog = () => {
  const { id } = useParams();
  const { t } = useTranslation('dialysisMachine');
  const dispatch = useAppDispatch();

  useDispatchOnUnmount(clearDialysisMachinesSlice());

  useEffect(() => {
    if (id) {
      dispatch(getDialysisMachine(id));
    }
  }, [id]);

  return (
    <>
      <Typography
        variant="headerM"
        sx={(theme) => ({
          position: 'sticky',
          zIndex: theme.zIndex.fab,
          top: 0,
          mb: 0,
          p: theme.spacing(2, 3),
          backgroundColor: theme.palette.surface.default,
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.04)',
          borderBottom: `1px solid ${theme.palette.border.default}`,
        })}
      >
        {t('dialysisMachineHistoryLog')}
      </Typography>
    </>
  );
};
