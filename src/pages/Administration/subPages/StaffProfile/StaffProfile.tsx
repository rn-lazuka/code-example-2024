import type { Spacing } from '@mui/system/createTheme/createSpacing';
import type { FileDocument } from '@types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { useAppDispatch } from '@hooks';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { getStaffUserInfo, selectStaffUser } from '@store/slices';
import { StaffInfoSkeleton } from './StaffinfoSkeleton';
import Button from '@mui/material/Button';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DataRow } from '@components/DataRow';
import { Dictionaries, getCodeValueFromCatalog } from '@utils/getOptionsListFormCatalog';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { FileLink } from '@components/FileLink/FileLink';
import { PermissionGuard } from '@guards';
import { UserPermissions, UserRoles } from '@enums';
import { StaffProfileModal } from '@components/pages/Administration';
import { InfoModal } from '@components/modals';

export const StaffProfile = () => {
  const { t } = useTranslation('staffManagement');
  const { t: tCommon } = useTranslation('common');
  const { t: tUserResponsibilities } = useTranslation(Dictionaries.UserResponsibilities);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const staffUser = selectStaffUser();
  const [isEditUserInfoModalOpen, setIsEditUserInfoModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const getDataRowStyles = (spacing: Spacing, data?: any) => ({
    maxWidth: spacing(87),
    width: 1,
    mt: `${spacing(1)} !important`,
    ...data,
  });
  const onStaffInfoEdit = () => {
    setIsEditUserInfoModalOpen(true);
  };

  useEffect(() => {
    if (id) {
      dispatch(getStaffUserInfo(id));
    }
  }, [id]);

  return (
    <>
      {isEditUserInfoModalOpen && (
        <StaffProfileModal isOpen={isEditUserInfoModalOpen} onClose={() => setIsEditUserInfoModalOpen(false)} />
      )}
      <InfoModal isOpen={isAvatarModalOpen} title={t('userPhoto')} onClose={() => setIsAvatarModalOpen(false)}>
        <Box sx={{ py: 3, px: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Avatar
            sx={(theme) => ({
              width: theme.spacing(30),
              height: theme.spacing(30),
              bgcolor: theme.palette.primary[90],
            })}
            src={staffUser?.photoPath ? staffUser.photoPath : ''}
            alt="big avatar"
          >
            <Typography sx={(theme) => ({ fontSize: theme.spacing(13.5), color: theme.palette.primary.main })}>
              {staffUser && staffUser.name && staffUser.name[0]}
            </Typography>
          </Avatar>
        </Box>
      </InfoModal>
      <Stack direction="column" sx={{ width: 1, minHeight: 1, bgcolor: (theme) => theme.palette.surface.default }}>
        <Box sx={{ px: 3, py: 2, borderBottom: (theme) => `1px solid ${theme.palette.border.default}` }}>
          <Typography variant="headerM">{t('profile')}</Typography>
        </Box>
        {staffUser?.id === Number(id) && (
          <Stack direction="column" spacing={2} sx={{ px: 3, py: 2 }}>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={(theme) => ({
                  width: theme.spacing(12.5),
                  height: theme.spacing(12.5),
                  bgcolor: theme.palette.primary[90],
                })}
                src={staffUser?.photoPath ? staffUser.photoPath : ''}
                alt="avatar"
                onClick={() => setIsAvatarModalOpen(true)}
              >
                <Typography variant="headerXL" sx={(theme) => ({ color: theme.palette.primary.main })}>
                  {staffUser && staffUser?.name && staffUser.name[0]}
                </Typography>
              </Avatar>
              <Stack direction="column" spacing={1} justifyContent="center">
                <Typography variant="headerM">{staffUser?.name}</Typography>
                <Typography variant="labelM">
                  {staffUser?.roles?.map((role) => getCodeValueFromCatalog('userRoles', role)).join(', ')}
                </Typography>
              </Stack>
            </Stack>
            <PermissionGuard permissions={UserPermissions.StaffModify} roles={[UserRoles.ROLE_NURSE_MANAGER]}>
              <Button
                variant="contained"
                onClick={onStaffInfoEdit}
                data-testid="editStaffUserProfileButton"
                sx={{ width: 'max-content', p: 1, pr: 2 }}
              >
                <EditOutlinedIcon sx={{ mr: 1, fill: ({ palette }) => palette.primary[100] }} fontSize="small" />
                {tCommon('button.edit')}
              </Button>
            </PermissionGuard>
            <Stack direction="column" spacing={1}>
              <DataRow
                title={t('login')}
                value={staffUser?.login}
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={t('gender')}
                value={
                  staffUser?.gender?.code && staffUser.gender.code !== 'other'
                    ? getCodeValueFromCatalog('gender', staffUser.gender.code)
                    : staffUser?.gender?.extValue
                }
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={t('responsibilities')}
                value={staffUser?.specialities?.map((speciality) => tUserResponsibilities(speciality)).join(', ')}
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={t('profRegNumber')}
                value={staffUser?.profRegNumber}
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={t('documentType')}
                value={staffUser?.document?.number}
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={<CallOutlinedIcon fontSize="small" />}
                value={
                  staffUser?.phone?.countryCode && (
                    <a href={`tel:${staffUser?.phone?.countryCode} ${staffUser?.phone?.number}`}>
                      <Typography variant="labelM">{`${staffUser?.phone?.countryCode} ${staffUser?.phone?.number}`}</Typography>
                    </a>
                  )
                }
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={<AlternateEmailOutlinedIcon fontSize="small" />}
                value={
                  staffUser?.email && (
                    <a href={`mailto:${staffUser.email}`}>
                      <Typography variant="labelM">{staffUser.email}</Typography>
                    </a>
                  )
                }
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={<LocationOnOutlinedIcon fontSize="small" />}
                value={staffUser?.address}
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
              <DataRow
                title={<AttachFileOutlinedIcon fontSize="small" />}
                value={
                  staffUser?.files?.length > 0 ? (
                    <Stack direction="column" spacing={1} sx={{ width: 1, maxWidth: ({ spacing }) => spacing(31) }}>
                      {staffUser.files?.map((file: FileDocument) => (
                        <FileLink
                          withIcon={false}
                          patientId={staffUser.id}
                          key={file.id}
                          file={file}
                          queryParams="?type=STAFF"
                          baseUrl="/pm/users/"
                        />
                      ))}
                    </Stack>
                  ) : undefined
                }
                sx={({ spacing }) => getDataRowStyles(spacing, { mt: '0 !important' })}
              />
            </Stack>
          </Stack>
        )}
        {staffUser?.id !== Number(id) && <StaffInfoSkeleton />}
      </Stack>
    </>
  );
};
