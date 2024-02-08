import { useMemo } from 'react';
import { Control } from 'react-hook-form/dist/types/form';
import { VascularAccessManagementForm } from '@types';
import { useTranslation } from 'react-i18next';
import { FormDatePicker, FormInputRadio, FormInputText } from '@components';
import {
  validatorLatinLettersNumbersSpecialSymbols,
  validatorLatinLettersNumbersSpecialCharacters,
  validatorMinLength,
  validatorMaxLength,
  validatorIsValidDate,
  validatorFutureDate,
} from '@validators';
import Typography from '@mui/material/Typography';
import { Dictionaries, getOptionListFromCatalog, getTenantEndCurrentDay } from '@utils';
import { NeedleSizeRadioLabel } from '@components/pages/PatientProfile';
import { Divider } from '@mui/material';

type VascularCategoryFormProps = {
  control: Control<VascularAccessManagementForm>;
};
export const VascularCategoryForm = ({ control }: VascularCategoryFormProps) => {
  const { t } = useTranslation('accessManagement');
  const needleSizeOptions = useMemo(() => getOptionListFromCatalog(Dictionaries.NeedleSizes).reverse(), []);

  return (
    <>
      <FormDatePicker
        control={control}
        name="creationDate"
        label={t('modal.creationDate')}
        maxDate={getTenantEndCurrentDay()}
        rules={{
          validate: {
            isValid: validatorIsValidDate,
            isFuture: validatorFutureDate(),
          },
        }}
      />
      <FormInputText
        control={control}
        name="createdBy"
        label={t('modal.createdBy')}
        rules={{
          minLength: validatorMinLength(2, 50),
          maxLength: validatorMaxLength(2, 50),
          pattern: validatorLatinLettersNumbersSpecialCharacters(),
        }}
      />
      <FormInputText
        control={control}
        name="createdAt"
        label={t('modal.createdAt')}
        rules={{
          minLength: validatorMinLength(2, 50),
          maxLength: validatorMaxLength(2, 50),
          pattern: validatorLatinLettersNumbersSpecialSymbols(),
        }}
      />
      <Divider />
      <FormInputRadio
        control={control}
        name="accessType"
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.accessType')}
          </Typography>
        }
        options={getOptionListFromCatalog(Dictionaries.AccessTypes)}
      />
      <Divider />
      <FormInputText
        control={control}
        name="note"
        label={t('modal.note')}
        rules={{
          minLength: validatorMinLength(2, 100),
          maxLength: validatorMaxLength(2, 100),
          pattern: validatorLatinLettersNumbersSpecialSymbols(),
        }}
      />
      <Divider />
      <FormInputRadio
        control={control}
        name="side"
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.side')}
          </Typography>
        }
        options={getOptionListFromCatalog(Dictionaries.Sides)}
      />
      <Divider />
      <FormInputRadio
        control={control}
        name="needleType"
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.needleType')}
          </Typography>
        }
        options={getOptionListFromCatalog(Dictionaries.NeedleTypes)}
      />
      <Divider />
      <FormInputRadio
        control={control}
        name="arterialNeedleSize"
        customRadioLabelRender={(label) => <NeedleSizeRadioLabel label={label} />}
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.arterialNeedleSize')}
          </Typography>
        }
        options={needleSizeOptions}
        sx={{ width: 1, '& .MuiFormGroup-root': { width: 1 } }}
      />
      <Divider />
      <FormInputRadio
        control={control}
        name="venousNeedleSize"
        customRadioLabelRender={(label) => <NeedleSizeRadioLabel label={label} />}
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.venousNeedleSize')}
          </Typography>
        }
        options={needleSizeOptions}
        sx={{ width: 1, '& .MuiFormGroup-root': { width: 1 } }}
      />
      <Divider />
    </>
  );
};
