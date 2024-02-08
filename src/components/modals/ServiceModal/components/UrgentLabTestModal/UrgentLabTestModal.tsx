import type { LabCreationForm, ServiceModalProps, UrgentLabTestForm } from '@types';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  addServiceModal,
  removeServiceModal,
  selectLabOrdersIsSubmitting,
  selectServiceModal,
  submitLabOrderForm,
} from '@store';

import CloseIcon from '@mui/icons-material/Close';
import { LabSpecimenType, LabTestTypes, ServiceModalName } from '@enums';
import { useForm, useFormState } from 'react-hook-form';
import { useConfirmNavigation } from '@hooks/useConfirmNavigation';
import { usePageUnload } from '@hooks/usePageUnload';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { UrgentLabTestFormView } from '@components/modals/ServiceModal/components/UrgentLabTestModal/components/UrgentLabTestFormView';
import { DialogActions } from '@mui/material';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';

const UrgentLabTestModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const { t: tLabs } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const isSubmitting = selectLabOrdersIsSubmitting();
  const { disabledPatient, place, formInitialValues, mode, planId } = selectServiceModal(
    ServiceModalName.UrgentLabTest,
  );

  const { handleSubmit, control, watch, setValue } = useForm<UrgentLabTestForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formInitialValues,
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const { isDirty } = useFormState({ control });
  useConfirmNavigation(isDirty, []);
  usePageUnload(isDirty, tCommon('dataLost'));

  const onSubmitHandler = (data: UrgentLabTestForm) => {
    const preparedData: LabCreationForm = {
      labId: data.laboratory?.value!,
      patientId: data.patient.value,
      procedureId: data.procedure?.value!,
      specimenType: data.specimenType! as LabSpecimenType,
    };

    dispatch(
      submitLabOrderForm({
        formData: preparedData,
        place,
        type: LabTestTypes.Urgent,
        mode,
        id: planId,
      }),
    );
  };

  const onCloseHandler = () => {
    dispatch(removeServiceModal(ServiceModalName.UrgentLabTest));
  };

  const openConfirmModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: onCloseHandler,
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  return (
    <Modal disableEnforceFocus open data-testid="urgentLabTestModal" sx={{ zIndex: index }}>
      <Paper
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: { xs: '90%', sm: theme.spacing(83.5) },
          maxWidth: theme.spacing(83.5),
          borderRadius: theme.spacing(2),
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
        })}
      >
        <Box sx={{ m: 0, p: 2 }}>
          <Typography variant="headerS">{tLabs('modal.urgentLabTest')}</Typography>
          <IconButton
            onClick={openConfirmModal}
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
          <UrgentLabTestFormView
            control={control}
            setValue={setValue}
            watch={watch}
            patientDisabled={disabledPatient}
            isDirty={isDirty}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              disabled={isSubmitting}
              onClick={openConfirmModal}
              variant="outlined"
              data-testid="cancelUrgentLabTestFormButton"
            >
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={handleSubmit(onSubmitHandler)}
              variant={'contained'}
              disabled={isSubmitting}
              data-testid="saveUrgentLabTestFormButton"
            >
              {tCommon('button.save')}
              {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
            </Button>
          </Stack>
        </DialogActions>
      </Paper>
    </Modal>
  );
};

export default UrgentLabTestModal;
