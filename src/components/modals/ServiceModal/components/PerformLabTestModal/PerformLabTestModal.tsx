import type { PerformLabOrderRequestParams, PerformLabTestForm, ServiceModalProps } from '@types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  addServiceModal,
  performLabOrder,
  removeServiceModal,
  selectLabOrdersIsSubmitting,
  selectServiceModal,
} from '@store';
import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { LabMealStatus, ServiceModalName } from '@enums';
import { getOption } from '@utils/getOption';
import { useForm, useFormState } from 'react-hook-form';
import { useConfirmNavigation } from '@hooks/useConfirmNavigation';
import { usePageUnload } from '@hooks/usePageUnload';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import { PerformLabTestFormView } from './components/PerformLabTestFormView';
import { useGetNursesOptions } from '@hooks/useGetNursesOptions';
import { dateTimeToServerFormat } from '@utils/dateFormat';

const PerformLabTestModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const { t: tLabs } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const isSubmitting = selectLabOrdersIsSubmitting();
  const { nursesOptions, nursesUnfilteredOptions, userNurse } = useGetNursesOptions();
  const { defaultFormValues, orderId, place } = selectServiceModal(ServiceModalName.PerformLabTest);
  const showForm = nursesUnfilteredOptions.length > 0;

  const defaultValues: PerformLabTestForm = {
    laboratory: getOption(defaultFormValues?.labName, String(defaultFormValues?.labId)),
    patient: {
      label: defaultFormValues?.patient.name,
      value: String(defaultFormValues?.patient.id),
    },
    procedure: getOption(defaultFormValues?.procedureName, defaultFormValues?.procedureId),
    specimenType: defaultFormValues?.specimenType,
    mealStatus: defaultFormValues?.mealStatus ?? LabMealStatus.UNKNOWN,
    performedAt: defaultFormValues?.performedAt ? new Date(defaultFormValues.performedAt) : new Date(),
    performedBy: {
      label: defaultFormValues?.performedBy?.name || userNurse?.name || '',
      value: defaultFormValues?.performedBy?.id || userNurse?.id || '',
    },
  };

  const { handleSubmit, reset, control } = useForm<PerformLabTestForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: true,
  });
  const { isDirty } = useFormState({ control });

  useEffect(() => {
    reset(defaultValues);
  }, [showForm]);

  useConfirmNavigation(isDirty, []);
  usePageUnload(isDirty, tCommon('dataLost'));

  const onSubmitHandler = (data: PerformLabTestForm) => {
    const preparedData: PerformLabOrderRequestParams = {
      labId: +data.laboratory?.value!,
      performedBy: +data.performedBy.value,
      performedAt: dateTimeToServerFormat(data.performedAt),
      mealStatus: data.mealStatus,
    };
    dispatch(performLabOrder({ place, orderId, formData: preparedData }));
  };

  const onCloseHandler = () => {
    isDirty ? openCancellationModal() : dispatch(removeServiceModal(ServiceModalName.PerformLabTest));
  };

  const openCancellationModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => dispatch(removeServiceModal(ServiceModalName.PerformLabTest)),
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  return (
    <Dialog
      open={true}
      disableEnforceFocus
      onClose={onCloseHandler}
      data-testid="PerformLabTestModal"
      sx={{ zIndex: index }}
    >
      <Box sx={{ m: 0, p: 2, minWidth: (theme) => theme.spacing(83.5) }}>
        <Typography variant="headerS">{tLabs('modal.labTest')}</Typography>
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
      <DialogContent dividers sx={{ p: 2 }}>
        {showForm && (
          <Stack direction="column">
            <PerformLabTestFormView control={control} nursesOptions={nursesOptions} />
          </Stack>
        )}
        {!showForm && (
          <Stack direction="column" data-testid="PerformLabTestSkeletonForm">
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid item xs={6}>
                <Skeleton height={56} variant="rectangular" />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={56} variant="rectangular" />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={56} variant="rectangular" />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={56} variant="rectangular" />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={56} variant="rectangular" />
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={56} variant="rectangular" />
              </Grid>
            </Grid>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {showForm && (
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              disabled={isSubmitting}
              onClick={onCloseHandler}
              variant="outlined"
              data-testid="cancelPerformLabTestButton"
            >
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={handleSubmit(onSubmitHandler)}
              variant={'contained'}
              disabled={isSubmitting}
              data-testid="savePerformLabTestButton"
            >
              {tCommon('button.save')}
              {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
            </Button>
          </Stack>
        )}
        {!showForm && <Skeleton height={38} variant="rectangular" sx={{ width: 1 }} />}
      </DialogActions>
    </Dialog>
  );
};

export default PerformLabTestModal;
