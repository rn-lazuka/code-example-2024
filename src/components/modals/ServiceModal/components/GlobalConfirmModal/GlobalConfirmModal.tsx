import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import { removeServiceModal, selectServiceModal } from '@store';
import { ServiceModalName } from '@enums';
import { ConfirmModal } from '@components';
import { WarningIcon } from '@assets/icons';
import { useNavigate } from 'react-router-dom';
import { ServiceModalProps } from '@types';

const GlobalConfirmModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t: tCommon } = useTranslation('common');
  const {
    cancelCallback,
    closeCallback,
    cancelButton = tCommon('button.cancel'),
    confirmButton = tCommon('button.continue'),
    text = tCommon('dataLost'),
    title = tCommon('closeWithoutSaving'),
    icon = WarningIcon,
    navigatePath,
  } = selectServiceModal(ServiceModalName.ConfirmModal);

  const onCloseHandler = () => {
    cancelCallback && cancelCallback();
    dispatch(removeServiceModal(ServiceModalName.ConfirmModal));
  };

  const handleConfirm = () => {
    closeCallback && closeCallback();
    dispatch(removeServiceModal(ServiceModalName.ConfirmModal));
    if (navigatePath) {
      navigate(navigatePath);
    }
  };

  return (
    <ConfirmModal
      disableEnforceFocus
      isOpen
      sx={{ zIndex: index }}
      title={title}
      text={text}
      icon={icon}
      onClose={onCloseHandler}
      confirmButton={confirmButton && { children: confirmButton, onClick: handleConfirm }}
      cancelButton={cancelButton && { children: cancelButton }}
      dataTestId="GlobalConfirmModal"
    />
  );
};

export default GlobalConfirmModal;
