import { Control } from 'react-hook-form/dist/types/form';
import { CVCAccessManagementForm } from '@types';
import { Instillation } from '@enums';
import { FormDatePicker, FormInputRadio, FormInputText } from '@components/FormComponents';
import { validatorIsValidDate } from '@validators/validatorIsValidDate';
import { validatorFutureDate } from '@validators/validatorFutureDate';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Dictionaries, getOptionListFromCatalog } from '@utils/getOptionsListFormCatalog';
import { validatorRequired } from '@validators/validatorRequired';
import { validatorMinLength } from '@validators/validatorMinLength';
import { validatorMaxLength } from '@validators/validatorMaxLength';
import { validatorLatinLettersNumberCharacters } from '@validators/validatorLatinLettersNumbersCharacters';
import { numbersRequiredDecimalsReg } from '@src/regexp';
import { transformEventCommaToDot } from '@utils/changeCommaToDot';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';
import { getTenantEndCurrentDay } from '@utils/getTenantDate';

type CvcCategoryFormProps = {
  control: Control<CVCAccessManagementForm>;
  defaultInstillation: string;
};
export const CvcCategoryForm = ({ defaultInstillation, control }: CvcCategoryFormProps) => {
  const { t } = useTranslation('accessManagement');
  const { t: tCommon } = useTranslation('common');
  const inputAdornment = (
    <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
      {t('modal.ml')}
    </InputAdornment>
  );

  return (
    <>
      <FormDatePicker
        control={control}
        name="insertionDate"
        label={t('modal.insertionDate')}
        maxDate={getTenantEndCurrentDay()}
        rules={{
          validate: {
            isValid: validatorIsValidDate,
            isFuture: validatorFutureDate(),
          },
        }}
      />
      <Divider />
      <FormInputRadio
        control={control}
        name="cvcCategory"
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.category')}
          </Typography>
        }
        options={getOptionListFromCatalog(Dictionaries.CvcCategories)}
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
        name="instillation"
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.instillation')}
          </Typography>
        }
        options={getOptionListFromCatalog(Dictionaries.Instillation)}
      />
      {defaultInstillation === Instillation.Others && (
        <>
          <FormInputText
            control={control}
            name="instillationExtValue"
            required
            multiline
            label={t('modal.others')}
            rules={{
              required: validatorRequired(),
              minLength: validatorMinLength(2, 50),
              maxLength: validatorMaxLength(2, 50),
              pattern: validatorLatinLettersNumberCharacters(),
            }}
            sx={(theme) => ({ maxWidth: theme.spacing(42.5) })}
          />
        </>
      )}
      <Stack spacing={2} direction="row">
        <FormInputText
          control={control}
          name="arterialVolume"
          label={t('modal.arterial')}
          rules={{
            minLength: validatorMinLength(3, 6),
            maxLength: validatorMaxLength(3, 6),
            pattern: { value: numbersRequiredDecimalsReg, message: tCommon('validation.numbersWithDecimals') },
          }}
          transform={transformEventCommaToDot}
          InputProps={{ startAdornment: inputAdornment }}
          sx={(theme) => ({ maxWidth: theme.spacing(20.25), '& input': { pl: 0 } })}
        />
        <FormInputText
          control={control}
          name="venousVolume"
          label={t('modal.venous')}
          rules={{
            minLength: validatorMinLength(3, 6),
            maxLength: validatorMaxLength(3, 6),
            pattern: { value: numbersRequiredDecimalsReg, message: tCommon('validation.numbersWithDecimals') },
          }}
          transform={transformEventCommaToDot}
          InputProps={{ startAdornment: inputAdornment }}
          sx={(theme) => ({ maxWidth: theme.spacing(20.25), '& input': { pl: 0 } })}
        />
      </Stack>
      <Divider />
    </>
  );
};
