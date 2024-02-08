import { ReactNode, useCallback, useEffect } from 'react';
import { useCallbackPrompt } from '@hooks/useCallbackPrompt';
import { addServiceModal } from '@store/slices/serviceModalSlice';
import { ServiceModalName } from '@enums';
import { useAppDispatch } from '@hooks/storeHooks';
import { useTranslation } from 'react-i18next';

type PartialConfirmModalConfig = Partial<{
  cancelButton: string;
  confirmButton: string;
  text: string;
  title: string;
  icon: ReactNode;
  closeCallback: () => void;
  cancelCallback: () => void;
}>;

export const useConfirmNavigation = (
  condition: boolean,
  allowedPaths: string[] = [],
  { cancelCallback, closeCallback, ...confirmModalConfig }: PartialConfirmModalConfig = {},
) => {
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { showPrompt, confirmNavigation, cancelNavigation } = useCallbackPrompt(condition, allowedPaths);

  const onConfirmNavigation = useCallback(() => {
    closeCallback && closeCallback();
    confirmNavigation();
  }, [closeCallback]);

  const onCancelNavigation = useCallback(() => {
    cancelCallback && cancelCallback();
    cancelNavigation();
  }, [cancelCallback]);

  useEffect(() => {
    if (showPrompt) {
      dispatch(
        addServiceModal({
          name: ServiceModalName.ConfirmModal,
          payload: {
            title: tCommon('closeWithoutSaving'),
            text: tCommon('dataLost'),
            confirmButton: tCommon('button.confirm'),
            ...confirmModalConfig,
            cancelCallback: onCancelNavigation,
            closeCallback: onConfirmNavigation,
          },
        }),
      );
    }
  }, [showPrompt]);
};
