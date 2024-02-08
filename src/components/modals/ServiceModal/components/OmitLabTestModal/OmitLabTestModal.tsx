import type { OmitLabTestForm, LabOrdersServiceResponse, ServiceModalProps } from '@types';
import type { Theme } from '@mui/material/styles';
import { useForm, useFormState } from 'react-hook-form';
import { useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { FormInputRadio, FormInputText } from '@components/FormComponents';
import {
  addServiceModal,
  omitLabTest,
  removeServiceModal,
  selectLabOrdersIsSubmitting,
  selectServiceModal,
} from '@store/slices';
import { useAppDispatch } from '@hooks';
import { AppointmentEventPlace, OmitLabTestType, ServiceModalName } from '@enums';
import {
  validatorLatinLettersNumberCharacters,
  validatorRequired,
  validatorMinLength,
  validatorMaxLength,
} from '@validators';
import Divider from '@mui/material/Divider';

const OmitLabTestModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const {
    labTest,
    appointmentId,
    patientName,
    place,
  }: { labTest: LabOrdersServiceResponse; appointmentId: string; patientName: string; place: AppointmentEventPlace } =
    selectServiceModal(ServiceModalName.OmitLabTest);
  const isLoading = selectLabOrdersIsSubmitting();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const defaultValues: OmitLabTestForm = {
    type: OmitLabTestType.RescheduleToNextSession,
    comment: '',
  };
  const { handleSubmit, control, watch } = useForm<OmitLabTestForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });
  const typeField = watch('type');

  const onCloseHandler = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeServiceModal(ServiceModalName.OmitLabTest)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeServiceModal(ServiceModalName.OmitLabTest));
  };

  const onSubmit = (data: OmitLabTestForm) => {
    const title =
      typeField === OmitLabTestType.RescheduleToNextSession
        ? 'areYouGoingToReschedule'
        : 'areYouGoingToOmitPermanently';
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => dispatch(omitLabTest({ ...data, labOrderId: labTest.id, appointmentId, place })),
          title: t(title, {
            procedureName: labTest.procedureName,
            patientName,
          }),
          text: t(
            typeField === OmitLabTestType.RescheduleToNextSession
              ? 'currentLabTestWillBeOmitted'
              : 'thisCanNotBeUndone',
          ),
          confirmButton: tCommon('button.continue'),
          cancelButton: tCommon('button.cancel'),
        },
      }),
    );
  };

  return (
    <Dialog
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      sx={{ zIndex: index, '& .MuiDialog-paper': { m: 1 } }}
      data-testid="OmitLabTestModal"
    >
      <Box sx={({ spacing }) => ({ m: 0, p: 2, width: isXs ? spacing(43) : spacing(83.5), maxWidth: spacing(87) })}>
        <Typography variant="headerS">{labTest.procedureName}</Typography>
        <IconButton
          onClick={onCloseHandler}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.icon.main,
          }}
          data-testid="OmitLabTestModalCloseIconWrapper"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} direction="column" sx={{ width: 1, p: 2 }} data-testid="OmitLabTestModalRadioGroup">
          <FormInputRadio
            control={control}
            name="type"
            options={[
              {
                label: t(`modals.omitLabTestTypeLabels.${OmitLabTestType.RescheduleToNextSession}`),
                value: OmitLabTestType.RescheduleToNextSession,
              },
              {
                label: t(`modals.omitLabTestTypeLabels.${OmitLabTestType.OmitPermanently}`),
                value: OmitLabTestType.OmitPermanently,
              },
            ]}
          />
          <FormInputText
            control={control}
            required
            name="comment"
            label={t('modals.comments')}
            multiline
            rules={{
              required: validatorRequired(),
              minLength: validatorMinLength(2, 500),
              maxLength: validatorMaxLength(2, 500),
              pattern: validatorLatinLettersNumberCharacters(),
            }}
          />
        </Stack>
        <Divider />
        <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ flexWrap: 'no-wrap', p: 2 }}>
          <Button variant="outlined" size="large" onClick={onCloseHandler} data-testid="OmitLabTestModalCancelButton">
            {tCommon('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            data-testid="OmitLabTestModalSaveButton"
          >
            {tCommon('button.save')}
            {isLoading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default OmitLabTestModal;
