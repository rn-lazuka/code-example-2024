import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { ExpandableMenu } from '@components/ExpandableMenu/ExpandableMenu';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ViewPermissions } from '@enums';
import { MainContentContainer } from '@src/containers';
import Stack from '@mui/material/Stack';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import IconButton from '@mui/material/IconButton';
import { selectUserPermissions } from '@store/slices/userSlice';
import { footerHeight, groupedReports, ROUTES } from '@constants';

export const ReportsLayout = () => {
  const { t } = useTranslation('reports');
  const location = useLocation();
  const path = location.pathname.split('/');
  const pathName = path[path.length - 1];
  const reports = [
    ROUTES.mortalityReport,
    ROUTES.patientCensusReport,
    ROUTES.injectionHistoryReport,
    ROUTES.vascularAccessReport,
    ROUTES.hospitalizationReport,
    ROUTES.patientStationHistoryReport,
  ];
  const isReport = reports.includes(pathName);
  const navigate = useNavigate();
  const userPermissions = selectUserPermissions();
  const [label, setLabel] = useState('');

  const getOptionsForExpandableMenu = () => {
    const checkOnAccess = (allowedPermission: ViewPermissions[]): boolean => {
      return allowedPermission.some((permission) => userPermissions.includes(permission));
    };
    return groupedReports()
      .filter((report) => checkOnAccess(report.groupAccessPermissions))
      .map(({ name, options }) => ({
        name,
        options: options
          .filter(({ permissions }) => checkOnAccess(permissions))
          .map(({ link, value }) => ({ value, optionCallback: () => navigate(link) })),
      }));
  };

  useEffect(() => {
    if (isReport) {
      setLabel(t(`${pathName}`));
    } else {
      setLabel(t('allReports'));
    }
  }, [pathName, isReport]);

  return (
    <MainContentContainer
      testId="reportsLayout"
      sx={(theme) => ({
        bgcolor: isReport ? theme.palette.surface.default : theme.palette.background.default,
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
        >
          <Stack direction="row" spacing={3} alignItems="center" mr={3}>
            {isReport && (
              <IconButton
                sx={{ p: 0 }}
                data-testid="reportsLayoutNavigateToBackButton"
                onClick={() => navigate(`/${ROUTES.reports}`)}
              >
                <ArrowBackOutlinedIcon />
              </IconButton>
            )}
            <Typography variant="headerL">{label}</Typography>
          </Stack>
          <ExpandableMenu
            label={t('switchReport')}
            groupedOptions={getOptionsForExpandableMenu()}
            sx={{ minWidth: ({ spacing }) => spacing(39) }}
          />
        </Box>
        <Outlet />
      </Stack>
    </MainContentContainer>
  );
};
