import { Dialog, DialogContent, Skeleton, Stack, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { removeServiceModal, selectHasUserOpenEncounter, selectPatient, selectServiceModal } from '@store';
import CloseIcon from '@mui/icons-material/Close';
import { FileTypes, NoticeBlockType, PatientStatuses, ServiceModalName } from '@enums';
import { useEffect, useMemo, useState } from 'react';
import { API, Dictionaries } from '@utils';
import { PatientChangeStatusForm } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/PatientChangeStatusForm';
import { ServiceModalProps } from '@types';
import { Event } from '@services/Event/Event';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';
import Button from '@mui/material/Button';
import { useAppDispatch } from '@hooks';
import { Theme } from '@mui/material/styles';

const PatientChangeStatusModal = ({ index }: ServiceModalProps) => {
  const { t: tPatientStatuses } = useTranslation(Dictionaries.PatientStatuses);
  const { t: tPatient } = useTranslation('patient');
  const [availableStatuses, setAvailableStatuses] = useState<PatientStatuses[]>([]);
  const hasUserOpenEncounter = selectHasUserOpenEncounter();
  const dispatch = useAppDispatch();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const patientChangeStatusModalPayload = selectServiceModal(ServiceModalName.PatientStatusModal);
  const patient = selectPatient();

  const { patientStatus, isHistory, statusId, defaultFormValues } = useMemo(() => {
    if (patientChangeStatusModalPayload && patientChangeStatusModalPayload.isHistory) {
      return {
        isHistory: true,
        statusId: patientChangeStatusModalPayload?.statusData
          ? patientChangeStatusModalPayload.statusData.statusId
          : null,
        patientStatus: patientChangeStatusModalPayload?.statusData
          ? patientChangeStatusModalPayload?.statusData.status
          : null,
        defaultFormValues: patientChangeStatusModalPayload.statusData || {},
      };
    }
    if (!patientChangeStatusModalPayload.isHistory && patient?.status === PatientStatuses.Walk_In) {
      return {
        isHistory: false,
        statusId: null,
        patientStatus: patient && patient.status ? patient.status : null,
        defaultFormValues: {
          genderCode: patient?.gender?.code || '',
          kins: patient?.family?.kins || null,
          [FileTypes.Consultation]: patient?.files?.filter((file) => file.type === FileTypes.Consultation) || [],
          [FileTypes.DeathProof]: patient?.files?.filter((file) => file.type === FileTypes.DeathProof) || [],
          [FileTypes.VirologyStatus]: patient?.files?.filter((file) => file.type === FileTypes.VirologyStatus) || [],
          [FileTypes.MedicalReport]: patient?.files?.filter((file) => file.type === FileTypes.MedicalReport) || [],
          [FileTypes.BloodTest]: patient?.files?.filter((file) => file.type === FileTypes.BloodTest) || [],
          [FileTypes.Other]: patient?.files?.filter((file) => file.type === FileTypes.Other) || [],
          [FileTypes.HdPrescription]: patient?.files?.filter((file) => file.type === FileTypes.HdPrescription) || [],
          [FileTypes.IdentityDocument]:
            patient?.files?.filter((file) => file.type === FileTypes.IdentityDocument) || [],
        },
      };
    }
    return {
      isHistory: false,
      statusId: null,
      patientStatus: patient && patient.status ? patient.status : null,
      defaultFormValues: {},
    };
  }, [patientChangeStatusModalPayload, patient]);

  const onCloseHandler = () => {
    hasUserOpenEncounter
      ? dispatch(removeServiceModal(ServiceModalName.PatientStatusModal))
      : Event.fire('closePatientStatusModal');
  };

  useEffect(() => {
    if (!patient?.id) return;

    API.get<PatientStatuses[]>(`pm/patients/${patient.id}/statuses/available`)
      .then((response) => {
        setAvailableStatuses([patientStatus, ...response.data]);
      })
      .catch(() => {
        setAvailableStatuses([]);
      });
  }, [patient.id]);

  return (
    <Dialog
      open={true}
      fullScreen={isXs}
      disableEnforceFocus
      onClose={onCloseHandler}
      data-testid="patientStatusModal"
      sx={{ zIndex: index }}
    >
      <Box
        sx={({ spacing, palette }) => ({
          m: 0,
          p: 2,
          minWidth: { xs: 'unset', sm: spacing(87) },
          maxWidth: { xs: 'unset', sm: spacing(87) },
          backgroundColor: { xs: palette.primary.light, sm: 'unset' },
        })}
      >
        <Typography variant="headerS">{tPatient('statusModal.changeStatus')}</Typography>
        <IconButton
          onClick={onCloseHandler}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.icon.main,
          }}
          data-testid="closeIcon"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {hasUserOpenEncounter ? (
          <>
            <Box p={2}>
              <NoticeBlock
                type={NoticeBlockType.Warning}
                text={tPatient('statusModal.noStatusChangingDuringEncounter')}
              />
            </Box>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={({ palette }) => ({
                p: 2,
                borderTop: `solid 1px ${palette.border.default}`,
              })}
            >
              <Button
                onClick={onCloseHandler}
                variant="outlined"
                size="large"
                data-testid="cancelPatientStatusFormButton"
              >
                OK
              </Button>
            </Stack>
          </>
        ) : (
          <>
            {patientStatus && isHistory ? (
              <Typography variant="headerM" sx={{ px: 2, pt: 2 }}>{`${tPatientStatuses(patientStatus)} ${tPatient(
                'patient',
              )}`}</Typography>
            ) : null}
            {patientStatus ? (
              <PatientChangeStatusForm
                patientId={patient.id}
                isHistory={isHistory}
                statusId={statusId}
                currentPatientStatus={patientStatus}
                availableStatuses={availableStatuses}
                onCancel={onCloseHandler}
                defaultFormValues={defaultFormValues}
              />
            ) : (
              <Skeleton height={40} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientChangeStatusModal;
