import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
  validatorAutocompleteRequired,
  validatorFloatPositiveNegative,
  validatorFutureTime,
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMaxValue,
  validatorMinLength,
  validatorMinValue,
  validatorNumberDecimal,
  validatorNumberInt,
  validatorPositiveNegativeNumberFloat,
  validatorRequired,
} from '@validators';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { getTenantDate, transformEventCommaToDot } from '@utils';
import Button from '@mui/material/Button';
import { useForm, useFormState } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { closeDialysisModal, EditHdReadingPayload } from '@store/slices/dialysisSlice';
import { removeServiceModal } from '@store/slices/serviceModalSlice';
import { useAppDispatch, useConfirmNavigation, useGetNursesOptions, usePageUnload } from '@hooks';
import { WarningIcon } from '@assets/icons';
import { ConfirmModal, FormAutocomplete, FormInputText, FormTimePicker, InfoCard } from '@components';
import { ServiceModalName } from '@enums';
import Grid from '@mui/material/Grid';
import { Event } from '@services';
import type { HdReadingForm, WithSx, HdReadingDataRequest } from '@types';
import Box from '@mui/material/Box';

type DialysisHdReadingStepFormProps = WithSx<{
  onSubmit: (payload: EditHdReadingPayload | HdReadingDataRequest) => void;
  onClose?: () => void;
  data?: HdReadingForm;
  id?: number;
}>;

export const DialysisHdReadingStepForm = ({ sx, data, id, onClose, onSubmit }: DialysisHdReadingStepFormProps) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { t } = useTranslation('dialysis');
  const { nursesOptions, userNurse } = useGetNursesOptions();
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!data?.signedBy?.value && nursesOptions.length && userNurse?.userId && userNurse?.name) {
      setValue('signedBy', { label: userNurse.name, value: userNurse.id.toString() });
    }
  }, [data, nursesOptions]);

  const defaultValues: HdReadingForm = {
    ap: data?.ap ?? '',
    conductivity: data?.conductivity,
    cumUf: data?.cumUf,
    cumHeparin: data?.cumHeparin,
    heparinRate: data?.heparinRate,
    dialysateTemp: data?.dialysateTemp,
    ktV: data?.ktV,
    duringHdNotes: data?.duringHdNotes ?? '',
    hr: data?.hr ?? '',
    tmp: data?.tmp,
    totalUf: data?.totalUf,
    signedBy: data?.signedBy ?? { label: '', value: '' },
    qb: data?.qb,
    time: data?.time ? new Date(data.time) : new Date(),
    ufRate: data?.ufRate,
    urr: data?.urr,
    vp: data?.vp,
    qd: data?.qd,
    systolicBp: data?.systolicBp,
    diastolicBp: data?.systolicBp,
  };

  const { handleSubmit, control, watch, reset, setValue } = useForm<HdReadingForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });

  const { isDirty } = useFormState({ control });
  const currentNotesFieldLength = watch('duringHdNotes').length;

  useConfirmNavigation(isDirty, []);
  usePageUnload(isDirty, tCommon('dataLost'));

  const handleConfirmClose = () => {
    dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal));
  };

  useEffect(() => {
    const onCloseDialysisModal = () => (isDirty ? setOpenConfirmModal(true) : handleConfirmClose());
    Event.subscribe(closeDialysisModal.type, onCloseDialysisModal);
    return () => Event.unsubscribe(closeDialysisModal.type, onCloseDialysisModal);
  }, [isDirty]);

  const resetFormHandler = useCallback(() => {
    reset({ ...defaultValues, time: new Date() });
  }, []);

  const onSubmitHandler = (data: HdReadingForm) => {
    const hdReadingData: HdReadingDataRequest = {
      signedBy: data.signedBy.label,
      signedById: data.signedBy.value,
      duringHdNotes: data.duringHdNotes,
      cumHeparin: data.cumHeparin && +data.cumHeparin,
      ktV: data.ktV && +data.ktV,
      cumUf: data.cumUf && +data.cumUf,
      dialysateTemp: data.dialysateTemp && +data.dialysateTemp,
      totalUf: data.totalUf && +data.totalUf,
      ufRate: data.ufRate && +data.ufRate,
      heparinRate: data.heparinRate && +data.heparinRate,
      conductivity: data.conductivity && +data.conductivity,
      systolicBp: data.systolicBp && +data.systolicBp,
      diastolicBp: data.diastolicBp && +data.diastolicBp,
      hr: data.hr,
      tmp: data.tmp && +data.tmp,
      urr: data.urr && +data.urr,
      vp: data.vp && +data.vp,
      qb: data.qb && +data.qb,
      time: new Date(data.time).toISOString(),
      qd: data.qd && +data.qd,
      ap: data.ap,
    };
    if (id) {
      const editPayload = { data: hdReadingData, hdReadingId: id };
      onSubmit(editPayload);
    } else {
      onSubmit(hdReadingData);
    }
    resetFormHandler();
    setValue('signedBy', { label: userNurse?.name || '', value: userNurse?.id.toString() || '' });
  };

  return (
    <>
      <ConfirmModal
        onClose={() => setOpenConfirmModal(false)}
        title={tCommon('closeWithoutSaving')}
        text={tCommon('dataLost')}
        icon={WarningIcon}
        confirmButton={{ children: tCommon('button.continue'), onClick: handleConfirmClose }}
        cancelButton={{ children: tCommon('button.cancel') }}
        isOpen={openConfirmModal}
      />
      <InfoCard title={id ? null : t('form.dataEntry')} sx={sx} isXs={isXs}>
        <Box sx={[Boolean(id) && { maxHeight: (theme) => theme.spacing(55), overflow: 'auto', p: 2 }]}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={isXs ? 12 : 4}>
              <FormTimePicker
                ampm
                control={control}
                name="time"
                label={t('form.time')}
                maxTime={getTenantDate()}
                required
                rules={{
                  required: validatorRequired(),
                  validate: {
                    maxDate: validatorFutureTime(),
                  },
                }}
              />
            </Grid>
            <Grid container item columnSpacing={2} xs={12}>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="systolicBp"
                  label={t('form.systolic')}
                  adornment={t('form.mmHg')}
                  fullWidth
                  required
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    required: validatorRequired(),
                    pattern: validatorNumberInt(),
                    minLength: validatorMinLength(2, 3),
                    maxLength: validatorMaxLength(2, 3),
                  }}
                  helperText={t('form.bloodPressure')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="diastolicBp"
                  label={t('form.diastolic')}
                  adornment={t('form.mmHg')}
                  fullWidth
                  required
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    required: validatorRequired(),
                    pattern: validatorNumberInt(),
                    minLength: validatorMinLength(2, 3),
                    maxLength: validatorMaxLength(2, 3),
                  }}
                  helperText={t('form.bloodPressure')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="hr"
                  label={t('form.hr')}
                  adornment={t('form.bpm')}
                  fullWidth
                  required
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    required: validatorRequired(),
                    pattern: validatorNumberInt(),
                    minLength: validatorMinLength(2, 3),
                    maxLength: validatorMaxLength(2, 3),
                  }}
                  helperText={t('form.heartRatePulse')}
                />
              </Grid>
            </Grid>
            <Grid container item columnSpacing={2} xs={12}>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="ap"
                  label={t('form.ap')}
                  adornment={t('form.mmHg')}
                  fullWidth
                  transform={transformEventCommaToDot}
                  rules={{
                    validate: {
                      numberPositiveNegative: validatorFloatPositiveNegative,
                    },
                    pattern: validatorPositiveNegativeNumberFloat(),
                    minLength: validatorMinLength(1, 5),
                    maxLength: validatorMaxLength(1, 5),
                    max: validatorMaxValue(-150, 500),
                    min: validatorMinValue(-150, 500),
                  }}
                  helperText={t('form.arterialPressure')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="vp"
                  label={t('form.vp')}
                  adornment={t('form.mmHg')}
                  fullWidth
                  required
                  transform={transformEventCommaToDot}
                  rules={{
                    validate: {
                      numberPositiveNegative: validatorFloatPositiveNegative,
                    },
                    required: validatorRequired(),
                    pattern: validatorPositiveNegativeNumberFloat(),
                    minLength: validatorMinLength(1, 5),
                    maxLength: validatorMaxLength(1, 5),
                  }}
                  helperText={t('form.venousPressure')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="tmp"
                  label={t('form.tmp')}
                  adornment={t('form.mmHg')}
                  fullWidth
                  required
                  transform={transformEventCommaToDot}
                  rules={{
                    validate: {
                      numberPositiveNegative: validatorFloatPositiveNegative,
                    },
                    required: validatorRequired(),
                    pattern: validatorPositiveNegativeNumberFloat(),
                    minLength: validatorMinLength(1, 5),
                    maxLength: validatorMaxLength(1, 5),
                  }}
                  helperText={t('form.transMembranePressure')}
                />
              </Grid>
            </Grid>
            <Grid container item columnSpacing={2} xs={12}>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="ufRate"
                  label={t('form.ufRate')}
                  adornment={t('form.Lh')}
                  fullWidth
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(1, 5),
                    maxLength: validatorMaxLength(1, 5),
                  }}
                  helperText={t('form.ultrafiltrationRate')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="qb"
                  label={t('form.qb')}
                  adornment={t('form.mlMin')}
                  inputProps={{ inputMode: 'numeric' }}
                  fullWidth
                  rules={{
                    pattern: validatorNumberInt(),
                    minLength: validatorMinLength(2, 4),
                    maxLength: validatorMaxLength(2, 4),
                  }}
                  helperText={t('form.bloodFlow')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="qd"
                  label={t('form.qd')}
                  adornment={t('form.mlMin')}
                  fullWidth
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    pattern: validatorNumberInt(),
                    minLength: validatorMinLength(2, 4),
                    maxLength: validatorMaxLength(2, 4),
                  }}
                  helperText={t('form.dialysisFluidFlow')}
                />
              </Grid>
            </Grid>
            <Grid container item columnSpacing={2} xs={12}>
              <Grid item xs={isXs ? 12 : 4} sx={[isXs && { mb: 2 }]}>
                <FormInputText
                  control={control}
                  name="heparinRate"
                  label={t('form.heparinRate')}
                  adornment={t('form.mlH')}
                  fullWidth
                  required
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    required: validatorRequired(),
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(1, 4),
                    maxLength: validatorMaxLength(1, 4),
                  }}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4} sx={[isXs && { mb: 2 }]}>
                <FormInputText
                  control={control}
                  name="cumHeparin"
                  label={t('form.cumHeparin')}
                  adornment={t('form.mL')}
                  fullWidth
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(1, 4),
                    maxLength: validatorMaxLength(1, 4),
                  }}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="cumUf"
                  label={t('form.cumUf')}
                  adornment={t('form.l')}
                  fullWidth
                  required
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    required: validatorRequired(),
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(1, 5),
                    maxLength: validatorMaxLength(1, 5),
                  }}
                  helperText={t('form.cumUltrafiltration')}
                />
              </Grid>
            </Grid>
            <Grid container item columnSpacing={2} xs={12}>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="totalUf"
                  label={t('form.totalUf')}
                  adornment={t('form.l')}
                  fullWidth
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(1, 5),
                    maxLength: validatorMaxLength(1, 5),
                  }}
                  helperText={t('form.totalUltrafiltration')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4} sx={[isXs && { mb: 2 }]}>
                <FormInputText
                  control={control}
                  name="conductivity"
                  label={t('form.conductivity')}
                  adornment={t('form.mScm')}
                  fullWidth
                  required
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    required: validatorRequired(),
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(1, 5),
                    maxLength: validatorMaxLength(1, 5),
                  }}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="dialysateTemp"
                  label={t('form.temp')}
                  adornment={t('form.c')}
                  fullWidth
                  required
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    required: validatorRequired(),
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(2, 4),
                    maxLength: validatorMaxLength(2, 4),
                  }}
                  helperText={t('form.dialysateTemperature')}
                />
              </Grid>
            </Grid>
            <Grid container item columnSpacing={2} xs={12}>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="ktV"
                  label={t('form.ktV')}
                  fullWidth
                  transform={transformEventCommaToDot}
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    pattern: validatorNumberDecimal(),
                    minLength: validatorMinLength(1, 4),
                    maxLength: validatorMaxLength(1, 4),
                  }}
                  helperText={t('form.dialysisAdequacy')}
                />
              </Grid>
              <Grid item xs={isXs ? 12 : 4}>
                <FormInputText
                  control={control}
                  name="urr"
                  label={t('form.urr')}
                  adornment={t('form.percent')}
                  fullWidth
                  inputProps={{ inputMode: 'numeric' }}
                  rules={{
                    pattern: validatorNumberInt(),
                    minLength: validatorMinLength(1, 3),
                    maxLength: validatorMaxLength(1, 3),
                    max: validatorMaxValue(0, 100),
                    min: validatorMinValue(0, 100),
                  }}
                  helperText={t('form.dialysisAdequacy')}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormInputText
                control={control}
                name="duringHdNotes"
                label={t('form.duringHdNotes')}
                multiline
                minRows={3}
                rules={{
                  pattern: validatorLatinLettersNumberCharacters(),
                  maxLength: validatorMaxLength(2, 500),
                }}
                helperText={`${currentNotesFieldLength}/500`}
              />
            </Grid>
            <Grid item xs={isXs ? 12 : 8}>
              <FormAutocomplete
                control={control}
                name="signedBy"
                options={nursesOptions}
                label={t('form.signedBy')}
                fullWidth
                required
                rules={{
                  required: validatorAutocompleteRequired(),
                }}
              />
            </Grid>
          </Grid>
          {!id && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
              <Button onClick={resetFormHandler} variant={'outlined'} data-testid="clearHdReadingFormButton">
                {tCommon('button.clear')}
              </Button>
              <Button
                onClick={handleSubmit(onSubmitHandler)}
                variant={'contained'}
                data-testid="saveHdReadingFormButton"
                sx={{ textTransform: 'none' }}
              >
                {tCommon('button.saveData')}
              </Button>
            </Stack>
          )}
        </Box>
        {id && (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={(theme) => ({
              borderTop: `1px solid ${theme.palette.border.default}`,
              p: 2,
              width: 1,
              bgcolor: theme.palette.surface.default,
              borderRadius: theme.spacing(0, 0, 3, 3),
            })}
          >
            <Button variant="outlined" onClick={onClose} data-testid="HdReadingEditModalCancelButton">
              {tCommon('button.cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmitHandler)}
              data-testid="HdReadingEditModalSaveButton"
            >
              {tCommon('button.save')}
            </Button>
          </Stack>
        )}
      </InfoCard>
    </>
  );
};
