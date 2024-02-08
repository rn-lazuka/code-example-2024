import type { AddDialyzerFormType, ServiceModalProps } from '@types';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import { AddDialyzerForm } from '@components/modals/ServiceModal/components/AddDialyzerModal/AddDialyzerForm';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {
  addServiceModal,
  removeServiceModal,
  selectIsDialyerLoading,
  selectServiceModal,
  submitDialyzerForm,
} from '@store/slices';
import { DialyzerUseType, NoticeBlockType, ServiceModalName } from '@enums/components';
import { useForm, useFormState } from 'react-hook-form';
import { useAppDispatch } from '@hooks/storeHooks';
import { AddDialyzerModalPlace } from '@enums/components/AddDialyzerModalPlace';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';

const AddDialyzerModal = ({ index }: ServiceModalProps) => {
  const { t } = useTranslation('dialyzers');
  const { t: tCommon } = useTranslation('common');
  const { place, patientId, formValue } = selectServiceModal(ServiceModalName.AddDialyzerModal);
  const isLoading = selectIsDialyerLoading();
  const dispatch = useAppDispatch();

  const defaultValues = {
    useType: formValue?.type || DialyzerUseType.Single,
    dialyzerBrand:
      formValue?.brand && !formValue?.brand?.deleted
        ? { label: formValue.brand.name, value: formValue.brand.id }
        : null,
    dialyzerSurfaceArea: formValue?.surfaceArea || null,
  };

  const { handleSubmit, control, watch, setValue } = useForm<AddDialyzerFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });

  const onCloseHandler = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeServiceModal(ServiceModalName.AddDialyzerModal)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeServiceModal(ServiceModalName.AddDialyzerModal));
  };

  const onSubmit = (data) => {
    dispatch(submitDialyzerForm({ ...data, patientId, place, dialyzerId: formValue?.id }));
  };

  return (
    <Dialog
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      data-testid="addDialyzisModal"
      sx={{ zIndex: index, width: 1, '& .MuiDialog-paper': { m: 1 } }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ m: 0, p: 1, pl: 2 }}>
        <Typography variant="labelLSB">{t(formValue?.id ? 'editDialyzer' : 'addNewDialyzer')}</Typography>
        <IconButton
          onClick={onCloseHandler}
          sx={({ palette }) => ({ color: palette.icon.main })}
          data-testid="closeIcon"
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent
        dividers
        sx={({ spacing }) => ({ p: 2, display: 'flex', flexDirection: 'column', width: spacing(43) })}
      >
        <AddDialyzerForm
          control={control}
          watch={watch}
          setValue={setValue}
          defaultType={formValue?.type || DialyzerUseType.Single}
        />
        {place === AddDialyzerModalPlace.PRE_HD_STEP && (
          <NoticeBlock type={NoticeBlockType.Info} text={t('manageDialyzres')} sx={{ mt: 2, mb: 2 }} />
        )}
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'no-wrap', paddingTop: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCloseHandler}
            fullWidth
            data-testid="addDialyzerModalCancelButton"
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            fullWidth
            disabled={isLoading}
            data-testid="addDialyzerModalSaveButton"
          >
            {tCommon('button.save')}
            {isLoading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialyzerModal;
