import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { selectDialysisIsSubmitting, startHd } from '@store/slices/dialysisSlice';
import { StartHdForm } from '@types';
import { useAppDispatch } from '@hooks/storeHooks';
import { TimeFormType, TimeFormView } from './TimeFormView';

type StartHdModalProps = {
  open: boolean;
  onClose: () => void;
};

export const StartHdModal = ({ open, onClose }: StartHdModalProps) => {
  const dispatch = useAppDispatch();
  const isSubmitting = selectDialysisIsSubmitting();

  useEffect(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [isSubmitting]);

  const defaultValues = {
    startedAt: new Date(),
  };

  const { handleSubmit, control, reset } = useForm<StartHdForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });

  useEffect(() => {
    open && reset(defaultValues);
  }, [open]);

  const onSubmitStartTime = (data: StartHdForm) => {
    dispatch(startHd(data));
  };

  return (
    <TimeFormView
      control={control}
      open={open}
      onClose={onClose}
      type={TimeFormType.START}
      onSubmit={handleSubmit(onSubmitStartTime)}
    />
  );
};
