import type { PerformAndOmitDoctorsReviewForm, ServiceModalProps } from '@types';
import type { Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import {
  addServiceModal,
  performAndOmitDoctorsReview,
  removeServiceModal,
  selectDialysisIsSubmitting,
  selectServiceModal,
} from '@store/slices';
import { DoctorReviewStatus, DoctorsReviewResolutions, ServiceModalName } from '@enums';
import { useAppDispatch } from '@hooks';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useForm, useFormState } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {
  validatorRequired,
  validatorMinLength,
  validatorMaxLength,
  validatorLatinLettersNumberCharacters,
  validatorFutureTime,
} from '@validators';
import { FormInputText, FormTimePicker } from '@components/FormComponents';
import { getTenantDate } from '@utils';
import { useMediaQuery } from '@mui/material';

const PerformAndOmitDoctorsReviewModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const { review, title, appointmentId, type, patientName, place } = selectServiceModal(
    ServiceModalName.PerformAndOmitDoctorsReview,
  );
  const isLoading = selectDialysisIsSubmitting();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const defaultValues: PerformAndOmitDoctorsReviewForm = {
    time: new Date(),
    note: '',
  };

  const { handleSubmit, control } = useForm<PerformAndOmitDoctorsReviewForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });

  const onCloseHandler = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeServiceModal(ServiceModalName.PerformAndOmitDoctorsReview)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeServiceModal(ServiceModalName.PerformAndOmitDoctorsReview));
  };

  const onSaveHandler = (data) => {
    const setSubmitPayload = (resolution: DoctorsReviewResolutions) => ({
      appointmentId,
      reviewId: review.id,
      formData: data,
      administeredBy: review.doctor?.userId,
      resolution,
      doctorSpeciality: review.doctor?.speciality,
      place,
    });

    if (type === DoctorReviewStatus.OMITTED) {
      dispatch(
        addServiceModal({
          name: ServiceModalName.ConfirmModal,
          payload: {
            title: t('performDoctorsReview.areYouGoingToOmit', {
              type: t(`performDoctorsReview.${review.doctor?.speciality}`),
              patientName,
            }),
            text: tCommon('actionCanNotBeUndone'),
            confirmButton: tCommon('button.continue'),
            cancelButton: tCommon('button.cancel'),
            closeCallback: () => dispatch(performAndOmitDoctorsReview(setSubmitPayload(DoctorsReviewResolutions.Omit))),
          },
        }),
      );
    } else {
      dispatch(performAndOmitDoctorsReview(setSubmitPayload(DoctorsReviewResolutions.Perform)));
    }
  };

  return (
    <Dialog
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      sx={{ zIndex: index, '& .MuiDialog-paper': { m: 1 } }}
      data-testid="performDoctorsReviewModal"
    >
      <Box sx={({ spacing }) => ({ m: 0, p: 2, width: isXs ? spacing(43) : spacing(83.5), maxWidth: spacing(87) })}>
        <Typography variant="headerS">{title}</Typography>
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
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} direction="column" sx={{ width: 1, p: 2 }}>
          {type === DoctorReviewStatus.PERFORMED && (
            <FormTimePicker
              control={control}
              name="time"
              label={t('performDoctorsReview.form.time')}
              required
              ampm
              minTime={new Date()}
              rules={{
                required: validatorRequired(),
                validate: {
                  maxDate: validatorFutureTime(
                    getTenantDate(),
                    tCommon('validation.timeShouldNotBeMoreThanCurrentOne'),
                  ),
                },
              }}
              sx={{ maxWidth: ({ spacing }) => spacing(38.75) }}
            />
          )}
          <FormInputText
            control={control}
            required
            name="note"
            label={type === DoctorReviewStatus.PERFORMED ? title : t('performDoctorsReview.form.reasonOfOmitting')}
            multiline
            rules={{
              required: validatorRequired(),
              minLength: validatorMinLength(2, 5000),
              maxLength: validatorMaxLength(2, 5000),
              pattern: validatorLatinLettersNumberCharacters(),
            }}
          />
        </Stack>
        <Divider />
        <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ flexWrap: 'no-wrap', p: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCloseHandler}
            data-testid="performDoctorReviewModalCancelButton"
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSaveHandler)}
            disabled={isLoading}
            data-testid="performDoctorReviewModalSaveButton"
          >
            {tCommon('button.save')}
            {isLoading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default PerformAndOmitDoctorsReviewModal;
