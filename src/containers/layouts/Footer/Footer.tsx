import { useEffect, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CustomSelect from './components/CustomSelect';
import { useTranslation } from 'react-i18next';
import { selectUser, setBranch, setTenant } from '@store/slices/userSlice';
import { useAppDispatch, useSystemVersion } from '@hooks';
import { useNavigate } from 'react-router-dom';
import { convertSxToArray, getStorageInitData } from '@utils';
import { selectTimezone } from '@store/slices/systemSlice';
import { footerHeight, footerMaxWidth, MINUTE } from '@constants';
import { formatInTimeZone } from 'date-fns-tz';
import { addServiceModal } from '@store/slices';
import { FooterPlace, ServiceModalName } from '@enums';
import Stack from '@mui/material/Stack';
import type { WithSx } from '@types';

interface FooterProps extends WithSx {
  place: FooterPlace;
}

export const Footer = ({ place, sx }: FooterProps) => {
  const { t } = useTranslation('common');
  const timeZone = selectTimezone();
  const [isChangeOrganization, setIsChangeOrganization] = useState(false);
  const [tenantTime, setTenantTime] = useState(formatInTimeZone(new Date(), timeZone, 'dd/MM/yyy HH:mm (XXX)'));
  const dispatch = useAppDispatch();
  const user = selectUser();
  const navigate = useNavigate();
  const initData = getStorageInitData();
  const isDrawerPlace = place === FooterPlace.Drawer;
  const { CONTACT_SUPPORT_LINK_HOST } = require('Config');

  const { hashVersion, mainVersion, buildVersion } = useSystemVersion();

  useEffect(() => {
    const timerId = setInterval(() => {
      setTenantTime(formatInTimeZone(new Date(), timeZone, 'dd/MM/yyy HH:mm (XXX)'));
    }, MINUTE);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (isChangeOrganization && user?.currentBranchId) {
      dispatch(setBranch({ value: user.currentBranchId, navigate }));
      setIsChangeOrganization(false);
    }
  }, [user?.currentBranchId, isChangeOrganization]);

  const handleChangeTenant = (value: string) => {
    const selectOrganization = user?.organizations.find((organization) => organization.id === value);
    selectOrganization && dispatch(setTenant(selectOrganization));
    setIsChangeOrganization(true);
  };
  const handleChangeBranch = (value: string) => {
    dispatch(setBranch({ value, navigate }));
  };

  const branchList = useMemo(() => {
    return user?.organizations.find((organization) => organization.id == user.currentOrganizationId)?.branches;
  }, [user?.currentOrganizationId]);

  const organizationsList = user?.organizations || [];

  return (
    <Box
      sx={[
        (theme) => ({
          height: isDrawerPlace ? 'unset' : theme.spacing(footerHeight),
          p: isDrawerPlace
            ? {
                xs: 2,
                sm: `${theme.spacing(2)} ${theme.spacing(3)}`,
              }
            : `0 ${theme.spacing(1)}`,
          display: 'flex',
          flexDirection: isDrawerPlace ? 'column' : 'row',
          justifyContent: 'space-between',

          width: 1,
          maxWidth: footerMaxWidth,
        }),
        ...convertSxToArray(sx),
      ]}
    >
      <Box
        sx={[
          !isDrawerPlace && {
            display: {
              xs: 'none',
              md: 'flex',
            },
          },
          { flexDirection: isDrawerPlace ? 'column' : 'row', mb: { xs: 3, sm: 0 } },
        ]}
      >
        {initData?.tenantName && (
          <Typography
            variant="labelXS"
            sx={[
              {
                mb: isDrawerPlace ? 1 : 0,
                mr: isDrawerPlace ? 0 : 2,
              },
            ]}
          >
            {`${initData.tenantName} · ${tenantTime}`}
          </Typography>
        )}
        <CustomSelect
          label={t('footer.organization')}
          options={organizationsList}
          handleSelect={handleChangeTenant}
          currentValue={user?.currentOrganizationId}
          disabled={organizationsList && organizationsList.length <= 1}
        />
        <CustomSelect
          label={t('footer.branch')}
          options={branchList || []}
          handleSelect={handleChangeBranch}
          currentValue={user?.currentBranchId}
          disabled={branchList && branchList.length <= 1}
        />
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        width={{ xs: 1, md: 'unset' }}
        sx={[
          isDrawerPlace && { display: { xs: 'flex', sm: 'none' }, pb: 2 },
          {
            justifyContent: {
              xs: 'space-between',
              md: 'flex-start',
            },
          },
        ]}
      >
        <Typography variant="paragraphXS">
          {`${ENVIRONMENT_VARIABLES.APP_NAME}.${mainVersion}${buildVersion ? `.${buildVersion}` : ''} ${hashVersion}`}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Typography
            variant="paragraphXS"
            sx={{
              cursor: 'pointer',
              color: (theme) => theme.palette.primary.main,
            }}
            onClick={() =>
              dispatch(
                addServiceModal({
                  name: ServiceModalName.SystemInfoModal,
                  payload: {},
                }),
              )
            }
          >
            {t('about')} {ENVIRONMENT_VARIABLES.APP_NAME}
          </Typography>
          {CONTACT_SUPPORT_LINK_HOST && (
            <Box sx={{ '>a': { color: (theme) => theme.palette.primary.main } }}>
              <a href={CONTACT_SUPPORT_LINK_HOST} target="_blank" rel="noreferrer">
                <Typography variant="paragraphXS">{t('contactSupport')}</Typography>
              </a>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
