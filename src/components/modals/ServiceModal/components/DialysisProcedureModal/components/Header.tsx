import { ROUTES } from '@constants/global';
import { DialysisStatus, PatientStatuses, ServiceModalName } from '@enums';
import { useAppDispatch } from '@hooks/storeHooks';
import CloseIcon from '@mui/icons-material/Close';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Event } from '@services';
import {
  abortDialysis,
  clearInitialDialysisData,
  closeDialysisModal,
  finishAndSaveHdClick,
  finishHdClick,
  selectDialysisAppointmentDate,
  selectDialysisIsFutureAppointment,
  selectDialysisSkipInfo,
  selectHemodialysisService,
  selectIsDisableInterface,
  selectWithDialysis,
  setCurrentStep,
  startHdClick,
} from '@store/slices/dialysisSlice';
import { addServiceModal, removeServiceModal } from '@store/slices/serviceModalSlice';
import { selectSystemIsOnline } from '@store/slices/systemSlice';
import type { DialysisPatient } from '@types';
import { dateFormat, getCodeValueFromCatalog, getTimeFromDate } from '@utils';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type Status = {
  activeStep: DialysisStatus;
  currentStep: DialysisStatus;
};

type HeaderProps = {
  patient: DialysisPatient;
  status: Status;
  isXs: boolean;
};

const allSteps = [
  DialysisStatus.CheckIn,
  DialysisStatus.PreDialysis,
  DialysisStatus.HDReading,
  DialysisStatus.PostDialysis,
  DialysisStatus.Completed,
  DialysisStatus.Cancelled,
];

export const Header = ({ patient, status, isXs }: HeaderProps) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const networkConnectionStatus = selectSystemIsOnline();
  const appointmentDate = selectDialysisAppointmentDate();
  const formatAppointmentDate = appointmentDate && dateFormat(appointmentDate);
  const dispatch = useAppDispatch();
  const isDisabledInterface = selectIsDisableInterface();
  const isFutureAppointment = selectDialysisIsFutureAppointment();
  const skipInfo = selectDialysisSkipInfo();
  const prescription = selectHemodialysisService();
  const withDialysis = selectWithDialysis();
  const [steps, setSteps] = useState<DialysisStatus[]>(allSteps);

  useEffect(() => {
    setSteps(withDialysis ? allSteps : allSteps.filter((step) => step === DialysisStatus.CheckIn));
  }, [withDialysis]);

  useEffect(() => {
    const onCloseDialysisModal = () => {
      dispatch(clearInitialDialysisData());
      dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal));
    };
    Event.subscribe(closeDialysisModal.type, onCloseDialysisModal);
    return () => Event.unsubscribe(closeDialysisModal.type, onCloseDialysisModal);
  }, []);

  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;
  const setStep = (step: DialysisStatus) => dispatch(setCurrentStep(step));

  const activeStepIndex = steps.indexOf(status.activeStep);

  const getStepButtonsTitle = (step: string) => {
    switch (step) {
      case DialysisStatus.CheckIn:
        return t('services');
      case DialysisStatus.PreDialysis:
        return t('preHd');
      case DialysisStatus.HDReading:
        return t('hdReading');
      case DialysisStatus.PostDialysis:
        return t('postHd');
    }
  };

  const onClose = useCallback(() => Event.fire(closeDialysisModal.type), [Event]);

  const onContinueClick = useCallback(() => setStep(DialysisStatus.PreDialysis), [setStep]);

  const onAbortClick = useCallback(() => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => {
            dispatch(abortDialysis());
          },
          title: t('areYouSureYouWantToAbort'),
          text: t('allDataWillBeLost'),
          confirmButton: t('buttons.abortHd'),
          cancelButton: tCommon('button.cancel'),
        },
      }),
    );
  }, [dispatch]);

  const onStartHDClick = useCallback(() => Event.fire(startHdClick.type), [Event]);

  const onFinishHDClick = useCallback(() => Event.fire(finishHdClick.type), [Event]);

  const onFinishAndSaveButton = useCallback(() => {
    if (status.activeStep === status.currentStep) Event.fire(finishAndSaveHdClick.type);
    else {
      setStep(status.activeStep);
      setTimeout(() => {
        Event.fire(finishAndSaveHdClick.type);
      }, 300);
    }
  }, [Event, status]);

  const ContinueButton = useCallback(
    () => (
      <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
        <span>
          <Button
            onClick={onContinueClick}
            variant="contained"
            disabled={!networkConnectionStatus || isUnavailableStatus}
          >
            {t('buttons.continue')}
          </Button>
        </span>
      </Tooltip>
    ),
    [onContinueClick, networkConnectionStatus],
  );

  const AbortButton = useCallback(
    () => (
      <Button data-testid="abortDialysisButton" onClick={onAbortClick}>
        {t('buttons.abortHd')}
      </Button>
    ),
    [onAbortClick],
  );

  const StartHDButton = useCallback(
    () => (
      <Button onClick={onStartHDClick} variant="contained" disabled={!networkConnectionStatus}>
        {t('buttons.startHd')}
        <SmartDisplayOutlinedIcon sx={(theme) => ({ color: theme.palette.primary[100], ml: 1.5 })} />
      </Button>
    ),
    [onStartHDClick, networkConnectionStatus],
  );

  const FinishHDButton = useCallback(
    () => (
      <Button onClick={onFinishHDClick} variant="contained" disabled={!networkConnectionStatus}>
        {t('buttons.finishHd')}
        <TaskAltIcon sx={(theme) => ({ color: theme.palette.primary[100], ml: 1.5 })} />
      </Button>
    ),
    [onFinishHDClick, networkConnectionStatus],
  );

  const FinishAndSaveButton = useCallback(
    () => (
      <Button onClick={onFinishAndSaveButton} variant="contained" disabled={!networkConnectionStatus}>
        {t('buttons.finishAndSave')}
      </Button>
    ),
    [onFinishAndSaveButton, networkConnectionStatus],
  );

  const handleTabChange = (event, newStep) => {
    setStep(newStep);
  };

  const getControlButtons = useCallback(() => {
    if (isFutureAppointment || skipInfo?.skipComment || !prescription) return null;
    const isShowControlButton = status.activeStep === status.currentStep;
    const isShowFinishAndSaveButton = status.activeStep === DialysisStatus.PostDialysis;

    switch (status.activeStep) {
      case DialysisStatus.CheckIn:
        return <ContinueButton />;
      case DialysisStatus.PreDialysis:
        return (
          <>
            <AbortButton />
            {isShowControlButton && <StartHDButton />}
            {isShowFinishAndSaveButton && <FinishAndSaveButton />}
          </>
        );
      case DialysisStatus.HDReading:
        return (
          <>
            <AbortButton />
            {isShowControlButton && <FinishHDButton />}
            {isShowFinishAndSaveButton && <FinishAndSaveButton />}
          </>
        );
      case DialysisStatus.PostDialysis:
        return (
          <>
            <AbortButton />
            {(isShowControlButton || isShowFinishAndSaveButton) && <FinishAndSaveButton />}
          </>
        );
      default:
        return null;
    }
  }, [status, isFutureAppointment, skipInfo]);

  return (
    <Box
      sx={(theme) => ({
        p: isXs ? theme.spacing(1, 1, 0, 1) : theme.spacing(1, 3, 0, 1),
        backgroundColor: theme.palette.primary.light,
      })}
      data-testid="dialysisProcedureModalHeader"
    >
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
          <Stack direction="row">
            <Box
              data-testid="ClinicalNoteUserLink"
              component={Link}
              onClick={() => dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal))}
              sx={{ display: 'flex', alignItems: 'center', mr: 1, ml: 1.5 }}
              color="primary.main"
              to={`/${ROUTES.patientsOverview}/${patient.id}/${ROUTES.userProfile}`}
            >
              <Typography variant="headerS" sx={{ textDecoration: 'underline' }}>
                {patient?.patientName}
              </Typography>
            </Box>
            <Typography
              variant="headerS"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {`- ${patient?.document?.number} - ${getTimeFromDate(patient?.birthDate)} - ${
                patient?.gender?.code !== 'other'
                  ? getCodeValueFromCatalog('gender', patient.gender.code)
                  : patient?.gender.extValue
              }${
                formatAppointmentDate?.toString() !== format(new Date(), 'dd/MM/yyyy').toString()
                  ? ` – ${formatAppointmentDate}`
                  : ''
              }`}
            </Typography>
          </Stack>
          <IconButton
            disabled={!networkConnectionStatus}
            onClick={onClose}
            sx={{ m: 0 }}
            data-testid="closeModalButton"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            {isFutureAppointment || !prescription ? (
              <Tabs
                value={status.currentStep}
                onChange={handleTabChange}
                TabIndicatorProps={{ sx: { height: (theme) => theme.spacing(0.5) } }}
                sx={{
                  flexShrink: 0,
                }}
              >
                <Tab
                  key={DialysisStatus.CheckIn}
                  value={DialysisStatus.CheckIn}
                  label={<Typography variant="labelSCapsSB">{getStepButtonsTitle(DialysisStatus.CheckIn)}</Typography>}
                  disabled={!networkConnectionStatus}
                  sx={{
                    minWidth: 'max-content',
                  }}
                />
              </Tabs>
            ) : (
              <Tabs
                value={status.currentStep}
                onChange={handleTabChange}
                TabIndicatorProps={{ sx: { height: (theme) => theme.spacing(0.5) } }}
                sx={{
                  flexShrink: 0,
                }}
              >
                {steps.map((step, index) => {
                  if (step !== DialysisStatus.Completed) {
                    return (
                      <Tab
                        key={step}
                        value={step}
                        data-testid={`${step}Tab`}
                        sx={{
                          minWidth: 'unset',
                          '&.Mui-disabled': {
                            border: 'unset',
                            color: (theme) => theme.palette.neutral[60],
                          },
                        }}
                        label={<Typography variant="labelSCapsSB">{getStepButtonsTitle(step)}</Typography>}
                        disabled={
                          status.activeStep === DialysisStatus.Cancelled ||
                          Boolean(index > activeStepIndex) ||
                          (Boolean(index !== activeStepIndex) && !networkConnectionStatus)
                        }
                      />
                    );
                  }
                })}
              </Tabs>
            )}
          </Stack>
          {!isXs && status.activeStep && !isDisabledInterface && withDialysis && (
            <Stack direction="row" spacing={1} data-testid="dialysisServicesModalControlButtons" sx={{ mt: 1, mb: 1 }}>
              {getControlButtons()}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
