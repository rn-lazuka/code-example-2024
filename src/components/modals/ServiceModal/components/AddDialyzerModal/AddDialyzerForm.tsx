import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form/dist/types/form';
import type { AddDialyzerFormType } from '@types';
import { Stack } from '@mui/material';
import { FormAutocompleteFreeSolo, FormInputRadio, FormInputText } from '@components/FormComponents';
import { Dictionaries, getOptionListFromCatalog } from '@utils/getOptionsListFormCatalog';
import { useMemo } from 'react';
import {
  validatorAutocompleteMaxLength,
  validatorAutocompleteMinLength,
  validatorAutocompletePattern,
  validatorAutocompleteRequired,
} from '@validators/autocomplete';
import { validatorLatinLettersNumberCharacters } from '@validators/validatorLatinLettersNumbersCharacters';
import { DialyzerUseType } from '@enums/components';
import { useTranslation } from 'react-i18next';
import { validatorRequired } from '@validators/validatorRequired';
import { validatorNumberDecimal } from '@validators/validatorNumberDecimal';
import { validatorMinLength } from '@validators/validatorMinLength';
import { validatorMaxLength } from '@validators/validatorMaxLength';
import { validatorNotZero } from '@validators/validatorNotZero';
import { transformEventCommaToDot } from '@utils/changeCommaToDot';
import { useIgnoreFirstRenderEffect } from '@hooks';
import { useDialyzerOptions } from '@hooks/useDialyzerOptions';
import Skeleton from '@mui/material/Skeleton';

type AddDialyzerFormProps = {
  control: Control<AddDialyzerFormType>;
  watch: UseFormWatch<AddDialyzerFormType>;
  setValue: UseFormSetValue<AddDialyzerFormType>;
  defaultType: DialyzerUseType;
};
export const AddDialyzerForm = ({ control, watch, setValue, defaultType }: AddDialyzerFormProps) => {
  const { t } = useTranslation('dialyzers');
  const useType = watch('useType', defaultType);
  const { dialyzerOptions } = useDialyzerOptions();

  const dialyzerBrandOptions = useMemo(() => {
    if (dialyzerOptions.length && useType) {
      return dialyzerOptions.filter(({ type }) => type === useType);
    }
    return [];
  }, [useType, dialyzerOptions]);

  useIgnoreFirstRenderEffect(() => {
    useType && setValue('dialyzerBrand', null);
  }, [useType]);

  if (!dialyzerBrandOptions.length)
    return (
      <Stack direction="column" spacing={2}>
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
      </Stack>
    );

  return (
    <Stack direction="column" spacing={2}>
      <FormInputRadio control={control} name="useType" options={getOptionListFromCatalog(Dictionaries.Dialyzer)} />
      <FormAutocompleteFreeSolo
        control={control}
        name="dialyzerBrand"
        label={t('tableView.brand')}
        required
        groupBy={(option) => option?.group || ''}
        options={dialyzerBrandOptions}
        rules={{
          required: validatorAutocompleteRequired(),
          minLength: validatorAutocompleteMinLength(1, 256),
          maxLength: validatorAutocompleteMaxLength(1, 256),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      <FormInputText
        required
        control={control}
        name="dialyzerSurfaceArea"
        label={t('tableView.surfaceArea')}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberDecimal(),
          minLength: validatorMinLength(1, 4),
          maxLength: validatorMaxLength(1, 4),
          validate: {
            notZero: validatorNotZero,
          },
        }}
        transform={transformEventCommaToDot}
        adornment={t('tableView.m2')}
      />
    </Stack>
  );
};
