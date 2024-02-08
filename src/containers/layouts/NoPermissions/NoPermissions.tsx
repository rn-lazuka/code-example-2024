import { MainContentContainer } from '@containers/layouts/MainContentContainer';
import { Box, Button, Stack, Typography } from '@mui/material';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { logOut } from '@store/slices/userSlice';
import { useAppDispatch } from '@hooks/storeHooks';

export const NoPermissions = () => {
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();

  const handleLogOut = useCallback(() => {
    dispatch(logOut());
  }, []);
  return (
    <MainContentContainer fullHeight sx={{ width: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 1,
          height: 1,
        }}
      >
        <Stack direction="column" alignItems="center" spacing={3} sx={(theme) => ({ maxWidth: theme.spacing(50) })}>
          <Box
            sx={(theme) => ({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: theme.spacing(16),
              height: theme.spacing(16),
              background: 'rgba(26, 28, 30, 0.08)',
              borderRadius: theme.spacing(8),
            })}
          >
            <ContentPasteSearchIcon sx={{ fontSize: '48px' }} />
          </Box>
          <Typography align="center">{tCommon('anyResponsibilities')}</Typography>
          <Button variant="contained" size="medium" onClick={handleLogOut} data-testid="logOutButton">
            {tCommon('button.logOut')}
          </Button>
        </Stack>
      </Box>
    </MainContentContainer>
  );
};
