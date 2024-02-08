import { useCallback } from 'react';
import { Control } from 'react-hook-form/dist/types/form';
import { InfoCard } from '@components/InfoCard/InfoCard';
import { FormInputText } from '@components';
import {
  validatorDecimalAmountIsInRange,
  validatorMaxLength,
  validatorMinLength,
  validatorNumberDecimal,
  validatorNumberInt,
  validatorRequired,
} from '@validators';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { transformEventCommaToDot } from '@utils';
import { FormMaskedInputText } from '@components/FormComponents/FormMaskedInputText';
import { FieldValues, Path } from 'react-hook-form';
import { selectDialysisStatus, selectIsDisableInterface } from '@store/slices/dialysisSlice';
import { DialysisStatus } from '@enums';

type DialysisBloodPressureTempGroupProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues, Object>;
  isXs: boolean;
};

export const DialysisBloodPressureTempGroup = <TFormValues extends FieldValues>({
  control,
  isXs,
}: DialysisBloodPressureTempGroupProps<TFormValues>) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const currentStep = selectDialysisStatus().currentStep;
  const isDisabledInterface = selectIsDisableInterface();
  const SittingBlock = useCallback(() => {
    return (
      <Stack direction="column" spacing={1}>
        <Typography variant="headerS">{t('form.sittingBP')}</Typography>
        <Stack
          direction={isXs ? 'column' : 'row'}
          spacing={isXs ? 0 : 2}
          sx={[
            isXs && {
              flexWrap: 'wrap',
              '& > :not(:first-child)': { mt: 2 },
            },
          ]}
        >
          <FormInputText
            control={control}
            name={'sittingSystolicBloodPressure' as Path<TFormValues>}
            label={t('form.systolic')}
            adornment={t('form.mmHg')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 3),
              maxLength: validatorMaxLength(1, 3),
            }}
          />
          <FormInputText
            control={control}
            name={'sittingDiastolicBloodPressure' as Path<TFormValues>}
            label={t('form.diastolic')}
            adornment={t('form.mmHg')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 3),
              maxLength: validatorMaxLength(1, 3),
            }}
          />
          <FormInputText
            control={control}
            name={'sittingPulse' as Path<TFormValues>}
            label={t('form.pulse')}
            adornment={t('form.bpm')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 3),
              maxLength: validatorMaxLength(1, 3),
            }}
          />
        </Stack>
      </Stack>
    );
  }, [isXs]);

  const StandingBlock = useCallback(() => {
    return (
      <Stack direction="column" spacing={1}>
        <Typography variant="headerS">{t('form.standingBP')}</Typography>
        <Stack
          direction={isXs ? 'column' : 'row'}
          spacing={isXs ? 0 : 2}
          sx={[
            isXs && {
              flexWrap: 'wrap',
              '& > :not(:first-child)': { mt: 2 },
            },
          ]}
        >
          <FormInputText
            control={control}
            name={'standingSystolicBloodPressure' as Path<TFormValues>}
            label={t('form.systolic')}
            adornment={t('form.mmHg')}
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 3),
              maxLength: validatorMaxLength(1, 3),
            }}
          />
          <FormInputText
            control={control}
            name={'standingDiastolicBloodPressure' as Path<TFormValues>}
            label={t('form.diastolic')}
            adornment={t('form.mmHg')}
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 3),
              maxLength: validatorMaxLength(1, 3),
            }}
          />
          <FormInputText
            control={control}
            name={'standingPulse' as Path<TFormValues>}
            label={t('form.pulse')}
            adornment={t('form.bpm')}
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 3),
              maxLength: validatorMaxLength(1, 3),
            }}
          />
        </Stack>
      </Stack>
    );
  }, [isXs]);

  return (
    <InfoCard title={t('form.bloodPressureTemp')} isXs={isXs}>
      <Stack direction="column" spacing={2}>
        {currentStep === DialysisStatus.PreDialysis ? (
          <>
            <StandingBlock />
            <SittingBlock />
          </>
        ) : (
          <>
            <SittingBlock />
            <StandingBlock />
          </>
        )}
        <FormMaskedInputText
          mask="99.9"
          maskChar="0"
          name={'bodyTemperature' as Path<TFormValues>}
          control={control}
          label={t('form.bodyTemperature')}
          adornment={t('form.c')}
          sx={{ maxWidth: ({ spacing }) => `calc(33.3% - ${spacing(1.3)})`, width: isXs ? '50%' : '100%' }}
          isDisabled={isDisabledInterface}
          InputProps={{ inputProps: { inputMode: 'numeric' } }}
          rules={{
            pattern: validatorNumberDecimal(),
            minLength: validatorMinLength(2, 4),
            maxLength: validatorMaxLength(2, 4),
            validate: {
              decimalAmount: validatorDecimalAmountIsInRange(0, 1, tCommon('validation.oneDecimalIsAllowed')),
            },
          }}
          transform={transformEventCommaToDot}
        />
      </Stack>
    </InfoCard>
  );
};
