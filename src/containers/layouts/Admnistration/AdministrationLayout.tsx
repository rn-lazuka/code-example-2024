import type { PropsWithChildren } from 'react';
import type { WithSx } from '@types';
import { MainContentContainer } from '@containers/layouts/MainContentContainer';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ExpandableMenu } from '@components/ExpandableMenu/ExpandableMenu';
import { useTranslation } from 'react-i18next';
import { ViewPermissions } from '@enums';
import { selectUserPermissions } from '@store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { administrationPages, footerHeight, ROUTES } from '@constants';
import IconButton from '@mui/material/IconButton';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { convertSxToArray } from '@utils/converters';

type AdministrationLayoutProps = WithSx<
  PropsWithChildren<{
    navigateBackIcon?: boolean;
  }>
>;

export const AdministrationLayout = ({ children, navigateBackIcon = false, sx }: AdministrationLayoutProps) => {
  const { t } = useTranslation('administration');
  const userPermissions = selectUserPermissions();
  const navigate = useNavigate();

  const getOptionsForExpandableMenu = () => {
    const checkOnAccess = (allowedPermission: ViewPermissions[]): boolean => {
      return allowedPermission.some((permission) => userPermissions.includes(permission));
    };
    const filterOptionsByPermission = (option) => {
      const permissions = option?.permission || [];
      const isActive = option?.active !== false;
      const arrayOfPermissions = Array.isArray(permissions) ? permissions : [permissions];
      return arrayOfPermissions.every((permission) => userPermissions.includes(permission)) && isActive;
    };
    return administrationPages()
      .filter((report) => checkOnAccess(report.accessPermissions))
      .map(({ name, options }) => ({
        name,
        options: options
          .filter(filterOptionsByPermission)
          .map(({ link, value }) => ({ value, optionCallback: () => navigate(link) })),
      }));
  };

  const pageTitle = useMemo(() => {
    if (location.pathname.includes(ROUTES.dialysisMachines)) {
      return t('dialysisMachinesList');
    }
    if (location.pathname.includes(ROUTES.staffManagement)) {
      return t('staffList');
    }
    return t('administration');
  }, [location.pathname]);

  return (
    <MainContentContainer
      testId="administrationLayout"
      sx={[
        (theme) => ({
          bgcolor: theme.palette.background.default,
          width: 1,
          height: {
            xs: `calc(100vh - ${theme.spacing(7.125)})`,
            sm: `calc(100vh - ${theme.spacing(7.125 + footerHeight)})`,
          },
        }),
        ...convertSxToArray(sx),
      ]}
    >
      <Stack
        direction="column"
        sx={{
          width: 1,
          p: 0,
          height: 1,
        }}
      >
        <Box
          display="flex"
          alignItems="baseline"
          sx={({ spacing, palette }) => ({
            width: 1,
            padding: spacing(2, 3),
            height: spacing(8),
            backgroundColor: palette.surface.default,
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {navigateBackIcon ? (
              <IconButton
                sx={{
                  p: 0,
                  mr: 2,
                  mb: 0,
                }}
                onClick={() => navigate(`/${ROUTES.administration}`)}
              >
                <ArrowBackOutlinedIcon />
              </IconButton>
            ) : null}
            <Typography variant="headerL" mr={3}>
              {pageTitle}
            </Typography>
          </Box>
          <ExpandableMenu
            label={t('selectPage')}
            groupedOptions={getOptionsForExpandableMenu()}
            sx={{ minWidth: ({ spacing }) => spacing(39) }}
          />
        </Box>
        {children}
      </Stack>
    </MainContentContainer>
  );
};
