import type { ServiceModalProps } from '@types';
import type { Theme } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useAppDispatch } from '@hooks/storeHooks';
import { selectServiceModal } from '@store/slices/serviceModalSlice';
import { GlobalLoader } from '@components/GlobalLoader/GlobalLoader';
import {
  getInitDialysisData,
  selectDialysisPatient,
  selectDialysisStatus,
  selectWithDialysis,
  selectIsDisableInterface,
  selectDialysisPre,
} from '@store/slices/dialysisSlice';
import { Header } from './components/Header';
import { DialysisServicesStep } from './components/steps/DialysisServicesStep';
import { DialysisPreHdStep } from './components/steps/DialysisPreHdStep';
import { DialysisHdReadingStep } from './components/steps/DialysisHdReadingStep';
import { DialysisPostHdStep } from './components/steps/DialysisPostHdStep';
import { ScrollToTopButton } from '@components/ScrollToTopButton/ScrollToTopButton';
import { ServiceModalName, DialysisStatus } from '@enums';
import { footerHeight } from '@constants';
import { useMediaQuery } from '@mui/material';
import { MobileFooterButton } from './components/MobileFooterButton';
import { StartHdModal } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/StartHdModal';
import Backdrop from '@mui/material/Backdrop';

const DialysisProcedureModal = ({ index }: ServiceModalProps) => {
  const { appointmentId, openOnStep } = selectServiceModal(ServiceModalName.DialysisProcedureModal);
  const patient = selectDialysisPatient();
  const status = selectDialysisStatus();
  const dispatch = useAppDispatch();
  const containerRef = useRef(null);
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isDisabledInterface = selectIsDisableInterface();
  const withDialysis = selectWithDialysis();
  const [openStartHdModal, setOpenStartHdModal] = useState(false);
  const isShowMobileFooter =
    isXs && status.activeStep !== DialysisStatus.Cancelled && !isDisabledInterface && withDialysis;
  const preHd = selectDialysisPre();

  useEffect(() => {
    if (appointmentId) {
      dispatch(getInitDialysisData({ appointmentId, openOnStep }));
    }
  }, [appointmentId, openOnStep]);
  const isPreHd = useMemo(() => !!preHd, [preHd]);

  const CurrentStep = useCallback(() => {
    switch (status.currentStep) {
      case DialysisStatus.Cancelled:
      case DialysisStatus.CheckIn:
        return <DialysisServicesStep isXs={isXs} />;
      case DialysisStatus.PreDialysis:
        return isPreHd ? (
          <DialysisPreHdStep isXs={isXs} setOpenStartHdModal={setOpenStartHdModal} />
        ) : (
          <Backdrop
            sx={(theme) => ({ color: theme.palette.primary[100], zIndex: theme.zIndex.snackbar + 1 })}
            open
            data-testid="dialysisPreHdStep"
          >
            <GlobalLoader />
          </Backdrop>
        );
      case DialysisStatus.HDReading:
        return <DialysisHdReadingStep isXs={isXs} />;
      case DialysisStatus.PostDialysis:
        return <DialysisPostHdStep isXs={isXs} />;
      default:
        return null;
    }
  }, [status.currentStep, isXs, isPreHd]);

  return (
    <Modal disableEnforceFocus open hideBackdrop data-testid="dialysisProcedureModal" sx={{ zIndex: index }}>
      <Paper
        square
        sx={(theme) => ({
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: { xs: 0, sm: theme.spacing(footerHeight) },
          backgroundColor: theme.palette.background.default,
        })}
      >
        <StartHdModal open={openStartHdModal} onClose={() => setOpenStartHdModal(false)} />
        {patient && status ? (
          <Box sx={{ height: 1 }}>
            <Header patient={patient} status={status} isXs={isXs} />
            <Box
              sx={(theme) => ({
                width: 1,
                height: `calc(100% - ${theme.spacing(isXs && status.activeStep ? 16 : 13.75)})`,
                overflow: 'auto',
              })}
              data-testid="dialysisProcedureModalStep"
              ref={containerRef}
            >
              {isXs && <ScrollToTopButton containerRef={containerRef} />}
              <CurrentStep />
              {isShowMobileFooter && (
                <MobileFooterButton patient={patient} activeStep={status.activeStep} currentStep={status.currentStep} />
              )}
            </Box>
          </Box>
        ) : (
          <GlobalLoader />
        )}
      </Paper>
    </Modal>
  );
};

export default DialysisProcedureModal;
