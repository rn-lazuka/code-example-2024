import type { DialysisPatient } from '@types';
import Box from '@mui/material/Box';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useCallback } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import {
  abortDialysis,
  finishAndSaveHdClick,
  finishHdClick,
  selectDialysisIsFutureAppointment,
  selectDialysisSkipInfo,
  selectHemodialysisService,
  setCurrentStep,
  startHdClick,
} from '@store/slices/dialysisSlice';
import { selectSystemIsOnline } from '@store/slices/systemSlice';
import { addServiceModal } from '@store/slices/serviceModalSlice';
import { DialysisStatus, PatientStatuses, ServiceModalName } from '@enums';
import { Event } from '@services/Event/Event';
import Tooltip from '@mui/material/Tooltip';
import { Stack, Typography } from '@mui/material';

type HeaderProps = {
  patient: DialysisPatient;
  activeStep: DialysisStatus;
  currentStep: DialysisStatus;
};

export const MobileFooterButton = ({ patient, activeStep, currentStep }: HeaderProps) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const networkConnectionStatus = selectSystemIsOnline();
  const dispatch = useAppDispatch();
  const isFutureAppointment = selectDialysisIsFutureAppointment();
  const skipInfo = selectDialysisSkipInfo();
  const prescription = selectHemodialysisService();

  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;
  const setStep = (step: DialysisStatus) => dispatch(setCurrentStep(step));

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

  const onFinishAndSaveButton = useCallback(() => Event.fire(finishAndSaveHdClick.type), [Event]);

  const ContinueButton = useCallback(
    () => (
      <Stack direction="row" spacing={1} flexWrap="wrap" flexBasis="100%">
        <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
          <>
            <Button
              fullWidth
              key="continueButton"
              onClick={onContinueClick}
              variant="contained"
              disabled={!networkConnectionStatus || isUnavailableStatus}
              sx={{ width: '100%' }}
              data-testid="dialysisProcedureModalContinueButton"
            >
              {t('buttons.continue')}
            </Button>
          </>
        </Tooltip>
      </Stack>
    ),
    [onContinueClick, networkConnectionStatus, isUnavailableStatus],
  );

  const AbortButton = useCallback(
    (isShowControl) => (
      <Button
        sx={{ flexBasis: isShowControl ? '50%' : '100%' }}
        data-testid="abortDialysisButton"
        onClick={onAbortClick}
      >
        {t('buttons.abortHd')}
      </Button>
    ),
    [onAbortClick],
  );

  const StartHDButton = useCallback(
    () => (
      <Button
        sx={{ flexBasis: '50%' }}
        onClick={onStartHDClick}
        variant="contained"
        disabled={!networkConnectionStatus}
        data-testid="dialysisProcedureModalStartHdButton"
      >
        {t('buttons.startHd')}
        <SmartDisplayOutlinedIcon sx={(theme) => ({ color: theme.palette.primary[100], ml: 1.5 })} />
      </Button>
    ),
    [onStartHDClick, networkConnectionStatus],
  );

  const FinishHDButton = useCallback(
    () => (
      <Button
        sx={{ flexBasis: '50%' }}
        onClick={onFinishHDClick}
        variant="contained"
        disabled={!networkConnectionStatus}
        data-testid="dialysisProcedureModalFinishHdButton"
      >
        {t('buttons.finishHd')}
        <TaskAltIcon sx={(theme) => ({ color: theme.palette.primary[100], ml: 1.5 })} />
      </Button>
    ),
    [onFinishHDClick, networkConnectionStatus],
  );

  const FinishAndSaveButton = useCallback(
    () => (
      <Button
        sx={{ flexBasis: '50%' }}
        onClick={onFinishAndSaveButton}
        variant="contained"
        disabled={!networkConnectionStatus}
        data-testid="dialysisProcedureModalFinishAndSaveButton"
      >
        {<Typography sx={{ textTransform: 'none' }}>{t('buttons.finishAndSave')}</Typography>}
      </Button>
    ),
    [onFinishAndSaveButton, networkConnectionStatus],
  );

  const getControlButtons = useCallback(() => {
    if (isFutureAppointment || skipInfo?.skipComment || !prescription) return null;
    const isShowControlButton = activeStep === currentStep;

    switch (activeStep) {
      case DialysisStatus.CheckIn:
        return <ContinueButton />;
      case DialysisStatus.PreDialysis:
        return (
          <>
            <AbortButton isShowControlButton={isShowControlButton} />
            {isShowControlButton && <StartHDButton />}
          </>
        );
      case DialysisStatus.HDReading:
        return (
          <>
            <AbortButton isShowControlButton={isShowControlButton} />
            {isShowControlButton && <FinishHDButton />}
          </>
        );
      case DialysisStatus.PostDialysis:
        return (
          <>
            <AbortButton isShowControlButton={isShowControlButton} />
            {isShowControlButton && <FinishAndSaveButton />}
          </>
        );
      default:
        return null;
    }
  }, [activeStep, onContinueClick, networkConnectionStatus]);

  return (
    <Box
      data-testid="dialysisProcedureModalMobileFooterButtonWrapper"
      sx={(theme) => ({
        overflow: 'auto',
        display: 'flex',
        position: 'fixed',
        justifyContent: 'center',
        px: theme.spacing(2),
        py: theme.spacing(1),
        maxWidth: '100%',
        zIndex: theme.zIndex.snackbar,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.primary.light,
      })}
    >
      {getControlButtons()}
    </Box>
  );
};
