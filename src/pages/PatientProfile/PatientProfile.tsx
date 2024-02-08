import { useDispatchOnUnmount } from '@hooks';
import type { Theme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  ClinicalInfoBlock,
  DocumentsBlock,
  FamilyInfoBlock,
  MainInfoBlock,
  TreatmentInfoBlock,
} from '@components/pages/PatientProfile';
import {
  addServiceModal,
  closeDialysisModal,
  deletePatient,
  getDialysisProcessInfo,
  resetPatientPage,
  selectDialysisProcessInfo,
  selectPatientName,
  selectPatientStatus,
  selectUserPermissions,
} from '@store';
import {
  AppointmentStatus,
  DialysisProgressInfoBlockVariants,
  DialysisStatus,
  PatientStatuses,
  ServiceModalName,
  UserPermissions,
} from '@enums';
import { useAppDispatch } from '@hooks/storeHooks';
import { useNavigate, useParams } from 'react-router-dom';
import { DialysisProgressInfoBlock } from '@components/DialysisProgressInfoBlock/DialysisProgressInfoBlock';
import intersection from 'lodash/intersection';
import { PatientStatusBlock } from '@components/pages/PatientProfile/PatientStatusBlock/PatientStatusBlock';
import { PermissionGuard } from '@guards/PermissionGuard';
import { Event } from '@services/Event/Event';
import isEmpty from 'lodash/isEmpty';
import { useMediaQuery } from '@mui/material';

const getShowBlocksPermissions = (userPermissions, status) => {
  const showBlocks = {
    mainInfo: false,
    familyInfo: false,
    clinicalInfo: false,
    treatmentInfo: false,
    billingInfo: false,
    documentsBlock: false,
    dialysisProgressInfo: false,
    patientStatus: false,
  };

  userPermissions.forEach((permission) => {
    const isWalkInOrDischargedOrDeadStatus =
      status === PatientStatuses.Walk_In || status === PatientStatuses.Discharged || status === PatientStatuses.Dead;
    switch (permission) {
      case UserPermissions.PatientViewDemographics:
        showBlocks.mainInfo = true;
        showBlocks.patientStatus = true;
        if (!status || isWalkInOrDischargedOrDeadStatus) break;
        showBlocks.familyInfo = true;
        showBlocks.documentsBlock = true;
        break;
      case UserPermissions.PatientViewClinicalInfo:
        if (!status || isWalkInOrDischargedOrDeadStatus) break;
        showBlocks.clinicalInfo = true;
        showBlocks.treatmentInfo = true;
        break;
      case UserPermissions.DialysisViewAppointments:
        showBlocks.dialysisProgressInfo = true;
        break;
    }
  });
  return showBlocks;
};

export const PatientProfile = () => {
  const { t } = useTranslation('patient');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const userPermissions = selectUserPermissions();
  const status = selectPatientStatus();
  const patientName = selectPatientName();
  const showBlocks = getShowBlocksPermissions(userPermissions, status);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const dialysisProcessInfo = selectDialysisProcessInfo();
  const showDialysisProcessInfoBlock =
    showBlocks.dialysisProgressInfo &&
    !!dialysisProcessInfo &&
    !isEmpty(dialysisProcessInfo) &&
    (dialysisProcessInfo.status === DialysisStatus.CheckIn ||
      dialysisProcessInfo.status === DialysisStatus.PreDialysis ||
      dialysisProcessInfo.status === DialysisStatus.HDReading ||
      dialysisProcessInfo.status === DialysisStatus.PostDialysis ||
      dialysisProcessInfo.status === AppointmentStatus.ServiceEncountered);
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const isUnavailableStatus =
    status === PatientStatuses.Walk_In || status === PatientStatuses.Dead || status === PatientStatuses.Discharged;

  const handleConfirmDeletePatient = () => id && dispatch(deletePatient({ id, navigate }));

  const checkDialysisInfoHandler = () => {
    const payload = {
      patientId: id,
      appointmentId: dialysisProcessInfo?.appointmentId,
    };
    dispatch(addServiceModal({ name: ServiceModalName.DialysisProcedureModal, payload }));
  };

  const handleDeletePatient = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: handleConfirmDeletePatient,
          title: t('modal.deletePatient', { name: patientName }),
          text: t('modal.cannotBeRestore'),
          confirmButton: tCommon('button.delete'),
          cancelButton: tCommon('button.cancel'),
        },
      }),
    );
  };

  useDispatchOnUnmount(resetPatientPage());

  useEffect(() => {
    if (id) {
      const getInfo = () => dispatch(getDialysisProcessInfo(id));
      getInfo();
      Event.subscribe(closeDialysisModal.type, getInfo);
      return () => Event.unsubscribe(closeDialysisModal.type, getInfo);
    }
  }, [id]);

  return (
    <Stack
      direction="column"
      sx={{ width: 1, p: ({ spacing }) => ({ xs: spacing(2), sm: spacing(3), md: spacing(3, 3, 3, 0) }) }}
      spacing={3}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={isXs ? 1 : 3}>
        <Stack direction="column" spacing={isXs ? 1 : 3} sx={{ width: 1 }}>
          {showDialysisProcessInfoBlock && (
            <DialysisProgressInfoBlock
              withAddInfoIcon={
                !!intersection(userPermissions, [
                  UserPermissions.DialysisEditMeasurement,
                  UserPermissions.DialysisAddMeasurement,
                  UserPermissions.DialysisViewMeasurements,
                ]).length
              }
              variant={DialysisProgressInfoBlockVariants.Standard}
              dialysisProcessInfo={dialysisProcessInfo}
              checkInfoHandler={checkDialysisInfoHandler}
            />
          )}
          {showBlocks.patientStatus && <PatientStatusBlock />}
          {showBlocks.mainInfo && <MainInfoBlock />}
          {showBlocks.familyInfo && <FamilyInfoBlock />}
          {showBlocks.documentsBlock && <DocumentsBlock />}
        </Stack>
        <Stack direction="column" spacing={isXs ? 1 : 3} sx={{ width: 1 }}>
          {showBlocks.clinicalInfo && <ClinicalInfoBlock />}
          {showBlocks.treatmentInfo && <TreatmentInfoBlock />}
        </Stack>
      </Stack>
      <PermissionGuard permissions={[UserPermissions.PatientDelete]}>
        <Tooltip
          title={!isUnavailableStatus ? t(`button.statusesCanBeDeleted`) : ''}
          placement="top-end"
          enterTouchDelay={0}
        >
          <Box sx={{ width: 'fit-content' }}>
            <Button
              variant="contained"
              startIcon={<DeleteOutlineOutlinedIcon sx={{ color: 'inherit' }} />}
              disabled={!isUnavailableStatus}
              onClick={handleDeletePatient}
              sx={{
                maxWidth: 'max-content',
              }}
            >
              {t('button.deletePatient')}
            </Button>
          </Box>
        </Tooltip>
      </PermissionGuard>
    </Stack>
  );
};
