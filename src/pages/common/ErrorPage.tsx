import { useTranslation } from 'react-i18next';
import { MainContentContainer } from '@containers/layouts/MainContentContainer';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/global';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

type ErrorPageProps = {
  code: number;
  text: string;
};

export const ErrorPage = ({ code, text }: ErrorPageProps) => {
  const { t } = useTranslation('common');

  return (
    <MainContentContainer
      fullHeight
      sx={(theme) => ({
        bgcolor: theme.palette.surface.default,
        width: 1,
        justifyContent: 'center',
      })}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Typography sx={{ fontSize: ({ spacing }) => spacing(20.5), fontWeight: 400, lineHeight: 1 }}>
          {code}
        </Typography>
        <Typography variant="headerM">{text}</Typography>
        <Box component={Link} to={ROUTES.main}>
          <Button variant="contained">{t('button.goToHomePage')}</Button>
        </Box>
      </Stack>
    </MainContentContainer>
  );
};
