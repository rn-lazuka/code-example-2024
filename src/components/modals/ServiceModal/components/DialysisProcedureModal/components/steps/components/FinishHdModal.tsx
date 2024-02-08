import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { finishHd } from '@store/slices/dialysisSlice';
import { FinishHdForm } from '@types';
import { useAppDispatch } from '@hooks/storeHooks';
import { TimeFormType, TimeFormView } from './TimeFormView';

type FinishHdModalProps = {
  open: boolean;
  onClose: () => void;
};

export const FinishHdModal = ({ open, onClose }: FinishHdModalProps) => {
  const dispatch = useAppDispatch();

  const defaultValues = {
    endsAt: new Date(),
  };
  const { handleSubmit, control, reset } = useForm<FinishHdForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });

  useEffect(() => {
    open && reset(defaultValues);
  }, [open]);

  const onSubmitFinishTime = (data: FinishHdForm) => {
    dispatch(finishHd(data));
  };

  return (
    <TimeFormView
      control={control}
      open={open}
      onClose={onClose}
      type={TimeFormType.FINISH}
      onSubmit={handleSubmit(onSubmitFinishTime)}
    />
  );
};
