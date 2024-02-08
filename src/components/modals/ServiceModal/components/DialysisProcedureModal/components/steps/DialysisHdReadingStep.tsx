import { DialysisProgressInfoBlock } from '@components/DialysisProgressInfoBlock/DialysisProgressInfoBlock';
import { GlobalLoader } from '@components/GlobalLoader/GlobalLoader';
import { DialysisProgressInfoBlockVariants, ServiceModalName, SnackType } from '@enums';
import { useAppDispatch } from '@hooks/storeHooks';
import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import { Event } from '@services/Event/Event';
import { removeServiceModal } from '@store/slices';
import {
  addDialysisHdReadingToStorage,
  closeDialysisModal,
  finishHdClick,
  selectDialysisHdReadingRecords,
  selectDialysisInfoForProgress,
  selectDialysisLoading,
  selectIsDisableInterface,
} from '@store/slices/dialysisSlice';
import type { EditHdReadingPayload } from '@store/slices/dialysisSlice';
import { addSnack, clearAllSnacks } from '@store/slices/snackSlice';
import { selectSystemNetworkConnection } from '@store/slices/systemSlice';
import type { HdReadingDataRequest } from '@types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialysisHdReadingTable from '../tables/DialysisHdReadingTable';
import { CannotSaveModal } from './components/CannotSaveModal';
import { DialysisHdReadingStepForm } from './components/DialysisHdReadingStepForm';
import { FinishHdModal } from './components/FinishHdModal';

export const DialysisHdReadingStep = ({ isXs }: { isXs: boolean }) => {
  const { t: tCommon } = useTranslation('common');
  const [openFinishHdModal, setOpenFinishHdModal] = useState(false);
  const [openCannotSaveModal, setOpenCannotSaveModal] = useState(false);
  const dispatch = useAppDispatch();
  const progressInfo = selectDialysisInfoForProgress();
  const isLoading = selectDialysisLoading();
  const records = selectDialysisHdReadingRecords();
  const isDisabledInterface = selectIsDisableInterface();
  const { backOffline } = selectSystemNetworkConnection();

  const onSubmitHdReadingHandler = (payload: HdReadingDataRequest | EditHdReadingPayload) => {
    dispatch({ type: addDialysisHdReadingToStorage.type, payload });
  };

  useEffect(() => {
    const onCloseDialysisModal = () => {
      if (isDisabledInterface) dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal));
    };

    Event.subscribe(closeDialysisModal.type, onCloseDialysisModal);
    return () => Event.unsubscribe(closeDialysisModal.type, onCloseDialysisModal);
  }, [isDisabledInterface]);

  useEffect(() => {
    if (backOffline) {
      dispatch(clearAllSnacks());
      dispatch(
        addSnack({
          type: SnackType.Error,
          message: tCommon('saveAfterRestoreConnection'),
          timeout: null,
        }),
      );
    }
  }, [backOffline]);

  useEffect(() => {
    const onFinishHdClick = () => {
      records.length ? setOpenFinishHdModal(true) : setOpenCannotSaveModal(true);
    };
    Event.subscribe(finishHdClick.type, onFinishHdClick);
    return () => Event.unsubscribe(finishHdClick.type, onFinishHdClick);
  }, [records]);

  return (
    <>
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <GlobalLoader />
        </Backdrop>
      )}
      <CannotSaveModal open={openCannotSaveModal} onClose={() => setOpenCannotSaveModal(false)} />
      <FinishHdModal open={openFinishHdModal} onClose={() => setOpenFinishHdModal(false)} />
      <Stack direction={'column'} data-testid="dialysisHdReadingStep">
        {!isDisabledInterface && (
          <Stack
            direction={'column'}
            sx={({ spacing }) => ({
              p: isXs ? spacing(2, 2, 5) : spacing(2),
              width: 1,
            })}
            spacing={2}
            alignItems="center"
          >
            <DialysisProgressInfoBlock
              variant={DialysisProgressInfoBlockVariants.Standard}
              dialysisProcessInfo={progressInfo}
              sx={{ width: 1, minWidth: (theme) => theme.spacing(43.25), maxWidth: (theme) => theme.spacing(87.125) }}
            />
            <DialysisHdReadingStepForm
              onSubmit={onSubmitHdReadingHandler}
              sx={{ width: 1, minWidth: (theme) => theme.spacing(43.25), maxWidth: (theme) => theme.spacing(87.125) }}
            />
          </Stack>
        )}
        <DialysisHdReadingTable isXs={isXs} />
      </Stack>
    </>
  );
};
