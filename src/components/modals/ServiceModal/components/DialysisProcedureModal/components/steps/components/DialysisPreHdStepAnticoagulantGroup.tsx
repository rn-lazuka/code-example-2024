import { Control } from 'react-hook-form/dist/types/form';
import { PreHDForm } from '@types';
import { InfoCard, FormInputText, FormAutocompleteFreeSolo } from '@components';
import {
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorNumberInt,
  validatorRequired,
  validatorAutocompleteRequired,
  validatorAutocompletePattern,
  validatorAutocompleteMinLength,
  validatorAutocompleteMaxLength,
} from '@validators';
import { useTranslation } from 'react-i18next';
import { Dictionaries, getOptionListFromCatalog } from '@utils';
import Stack from '@mui/material/Stack';
import { selectIsDisableInterface } from '@store/slices';

type DialysisPreHdStepAnticoagulantGroupProps = {
  control: Control<PreHDForm>;
  isXs: boolean;
};

const DialysisPreHdStepAnticoagulantGroup = ({ control, isXs }: DialysisPreHdStepAnticoagulantGroupProps) => {
  const { t } = useTranslation('dialysis');
  const isDisabledInterface = selectIsDisableInterface();

  return (
    <InfoCard title={t('form.anticoagulant')} isXs={isXs}>
      <Stack direction="column" spacing={2}>
        <FormAutocompleteFreeSolo
          required
          control={control}
          name="anticoagulantType"
          label={t('form.anticoagulantType')}
          options={getOptionListFromCatalog(Dictionaries.AnticoagulantType)}
          isDisabled={isDisabledInterface}
          rules={{
            required: validatorAutocompleteRequired(),
            minLength: validatorAutocompleteMinLength(1, 256),
            maxLength: validatorAutocompleteMaxLength(1, 256),
            pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
          }}
          sx={{ maxWidth: (theme) => theme.spacing(39.5) }}
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
            name="anticoagulantPrimeDose"
            label={t('form.primeDose')}
            adornment={t('form.units')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 5),
              maxLength: validatorMaxLength(1, 5),
            }}
            sx={[!isXs && { maxWidth: (theme) => theme.spacing(18.75) }]}
          />
          <FormInputText
            control={control}
            name="anticoagulantBolusDose"
            label={t('form.bolusDose')}
            adornment={t('form.units')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 5),
              maxLength: validatorMaxLength(1, 5),
            }}
            sx={[!isXs && { maxWidth: (theme) => theme.spacing(18.75) }]}
          />
          <FormInputText
            control={control}
            name="anticoagulantHourlyDose"
            label={t('form.hourlyDose')}
            adornment={t('form.units')}
            required
            isDisabled={isDisabledInterface}
            inputProps={{ inputMode: 'numeric' }}
            rules={{
              required: validatorRequired(),
              pattern: validatorNumberInt(),
              minLength: validatorMinLength(1, 5),
              maxLength: validatorMaxLength(1, 5),
            }}
            sx={[!isXs && { maxWidth: (theme) => theme.spacing(18.75) }]}
          />
        </Stack>
      </Stack>
    </InfoCard>
  );
};

export default DialysisPreHdStepAnticoagulantGroup;
