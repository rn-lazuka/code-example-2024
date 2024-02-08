import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import { useAppDispatch } from '@hooks/storeHooks';
import { removeServiceModal, selectServiceModal } from '@store/slices/serviceModalSlice';
import { selectDialysisLoading, skipAppointment } from '@store/slices/dialysisSlice';
import { AppointmentSkipReason, ServiceModalName } from '@enums';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { SkipAppointmentForm } from '@types';
import { FormInputRadio, FormInputText, WarningMessage } from '@src/components';
import { Dictionaries, getOptionListFromCatalog } from '@utils/getOptionsListFormCatalog';
import { validatorMinLength } from '@validators/validatorMinLength';
import { validatorMaxLength } from '@validators/validatorMaxLength';
import { validatorLatinLettersNumberCharacters } from '@validators/validatorLatinLettersNumbersCharacters';
import React from 'react';
import { validatorRequired } from '@validators/validatorRequired';
import CircularProgress from '@mui/material/CircularProgress';

type SkipAppointmentModalProps = {
  index: number;
};

const SkipAppointmentModal = ({ index }: SkipAppointmentModalProps) => {
  const {
    appointmentId,
    skipInfo: { previousSkipped, skipReason, skipComment },
    skipPlace,
  } = selectServiceModal(ServiceModalName.SkipAppointmentModal);
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const isLoading = selectDialysisLoading();

  const onCloseHandler = () => {
    dispatch(removeServiceModal(ServiceModalName.SkipAppointmentModal));
  };
  const defaultValues: SkipAppointmentForm = {
    reason: skipReason || AppointmentSkipReason.PatientRequest,
    comment: skipComment || '',
  };

  const { handleSubmit, control } = useForm<SkipAppointmentForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });

  const onSubmit = (data: SkipAppointmentForm) => {
    dispatch(skipAppointment({ id: appointmentId, data, skipPlace }));
  };

  return (
    <Modal disableEnforceFocus open data-testid="skipAppointmentModal" sx={{ zIndex: index }}>
      <Paper
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: theme.spacing(44),
          maxWidth: theme.spacing(44),
          borderRadius: theme.spacing(2),
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
        })}
      >
        <Box
          sx={(theme) => ({
            width: 1,
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${theme.palette.border.default}`,
            p: theme.spacing(2, 2, 1, 2),
          })}
        >
          <Typography variant="headerS">{t('skipAppointment')}</Typography>
          <IconButton onClick={onCloseHandler} sx={{ mr: -1, mt: -1 }} data-testid="skipAppointmentModalCloseButton">
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
        <Stack spacing={2} direction="column" sx={{ width: 1, p: 2 }}>
          {previousSkipped && <WarningMessage text={t('youAreGoingToSkipAppointment')} sx={{ mt: 0 }} />}
          <FormInputRadio
            name="reason"
            label={
              <Typography
                variant="labelMCaps"
                data-testid="reasonOfSkippingRadioGroupLabel"
                sx={({ palette }) => ({
                  color: palette.text.secondary,
                })}
              >
                {t('reasonOfSkipping')}
              </Typography>
            }
            options={getOptionListFromCatalog(Dictionaries.SkippingReasons)}
            control={control}
            sx={{
              '& .MuiFormLabel-root': { mb: 1 },
            }}
          />
          <FormInputText
            control={control}
            name="comment"
            label={t('reasonsOrComments')}
            multiline
            required
            rules={{
              required: validatorRequired(),
              minLength: validatorMinLength(2, 500),
              maxLength: validatorMaxLength(2, 500),
              pattern: validatorLatinLettersNumberCharacters(),
            }}
          />
        </Stack>
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'no-wrap', p: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCloseHandler}
            fullWidth
            data-testid="skipAppointmentModalCancelButton"
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            fullWidth
            disabled={isLoading}
            data-testid="skipAppointmentModalSaveButton"
          >
            {tCommon('button.save')}
            {isLoading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default SkipAppointmentModal;
