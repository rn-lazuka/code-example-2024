import { MainContentContainer } from '@containers/layouts/MainContentContainer';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { PropsWithChildren } from 'react';
import { footerHeight } from '@constants/containers';

type ScheduleLayoutProps = PropsWithChildren<{}>;

export const ScheduleLayout = ({ children }: ScheduleLayoutProps) => {
  const { t } = useTranslation('schedule');

  return (
    <MainContentContainer
      testId="scheduleLayout"
      sx={(theme) => ({
        bgcolor: theme.palette.background.default,
        width: 1,
        height: {
          xs: `calc(100vh - ${theme.spacing(7.125)})`,
          sm: `calc(100vh - ${theme.spacing(7.125 + footerHeight)})`,
        },
      })}
    >
      <Stack
        direction="column"
        sx={{
          width: 1,
          p: 0,
        }}
      >
        <Box
          display="flex"
          alignItems="baseline"
          sx={({ spacing, palette }) => ({
            width: 1,
            backgroundColor: palette.surface.default,
            padding: spacing(2, 3),
            height: spacing(8),
          })}
          data-testid="scheduleLayoutHeader"
        >
          <Typography variant="headerL" mr={3}>
            {t('allSchedule')}
          </Typography>
        </Box>
        {children}
      </Stack>
    </MainContentContainer>
  );
};
