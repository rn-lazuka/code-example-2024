import { Control } from 'react-hook-form/dist/types/form';
import { PreHDForm } from '@types';
import { FormInputText, InfoCard } from '@components';
import {
  validatorMaxLength,
  validatorMinLength,
  validatorNumberDecimal,
  validatorNumberInt,
  validatorRequired,
} from '@validators';
import { useTranslation } from 'react-i18next';
import { transformEventCommaToDot } from '@utils';
import Stack from '@mui/material/Stack';
import { selectIsDisableInterface } from '@store/slices';

type DialysisPreHdStepDialysateGroupProps = {
  control: Control<PreHDForm>;
  isXs: boolean;
};

const DialysisPreHdStepDialysateGroup = ({ control, isXs }: DialysisPreHdStepDialysateGroupProps) => {
  const { t } = useTranslation('dialysis');
  const isDisabledInterface = selectIsDisableInterface();

  return (
    <InfoCard title={t('form.dialysate')} isXs={isXs}>
      <Stack direction="column" spacing={2}>
        <FormInputText
          control={control}
          name="dialysateCalcium"
          label={t('form.prescribedCalcium')}
          adornment={t('form.mmolL')}
          required
          inputProps={{ inputMode: 'numeric' }}
          rules={{
            required: validatorRequired(),
            pattern: validatorNumberDecimal(),
            minLength: validatorMinLength(1, 4),
            maxLength: validatorMaxLength(1, 4),
          }}
          isDisabled={isDisabledInterface}
          sx={[!isXs && { maxWidth: ({ spacing }) => `calc(50% - ${spacing(1)})` }]}
          transform={transformEventCommaToDot}
        />
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
            name="dialysateSodiumStart"
            label={t('form.prescribedSodiumStart')}
            adornment={t('form.mmolL')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberDecimal(),
              minLength: validatorMinLength(1, 4),
              maxLength: validatorMaxLength(1, 4),
            }}
            transform={transformEventCommaToDot}
          />
          <FormInputText
            control={control}
            name="dialysateSodiumEnd"
            label={t('form.prescribedSodiumEnd')}
            adornment={t('form.mmolL')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberDecimal(),
              minLength: validatorMinLength(1, 4),
              maxLength: validatorMaxLength(1, 4),
            }}
            transform={transformEventCommaToDot}
          />
        </Stack>
        <FormInputText
          control={control}
          name="dialysatePotassium"
          label={t('form.dialysatePotassium')}
          adornment={t('form.mmolL')}
          required
          isDisabled={isDisabledInterface}
          inputProps={{ inputMode: 'numeric' }}
          rules={{
            required: validatorRequired(),
            pattern: validatorNumberDecimal(),
            minLength: validatorMinLength(1, 4),
            maxLength: validatorMaxLength(1, 4),
          }}
          sx={[!isXs && { maxWidth: ({ spacing }) => `calc(50% - ${spacing(1)})` }]}
          transform={transformEventCommaToDot}
        />
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
            name="dialysateTemperature"
            label={t('form.temperature')}
            adornment={t('form.c')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberDecimal(),
              minLength: validatorMinLength(2, 4),
              maxLength: validatorMaxLength(2, 4),
            }}
            transform={transformEventCommaToDot}
          />
          <FormInputText
            control={control}
            name="dialysateFlow"
            label={t('form.flowQD')}
            adornment={t('form.mlMin')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(2, 4),
              maxLength: validatorMaxLength(2, 4),
            }}
            transform={transformEventCommaToDot}
          />
        </Stack>
      </Stack>
    </InfoCard>
  );
};

export default DialysisPreHdStepDialysateGroup;
