import type { Control } from 'react-hook-form/dist/types/form';
import type { PerformLabTestForm } from '@types';
import { useMemo } from 'react';
import { FormInputRadio, FormInputSelect, FormTimePicker } from '@components/FormComponents';
import { FormAutocompleteAsync } from '@components/FormComponents/FormAutocompleteAsync';
import { validatorAutocompleteRequired } from '@validators/autocomplete/validatorAutocompleteRequired';
import { FormAutocomplete } from '@components/FormComponents/FormAutocomplete';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import { LabMealStatus } from '@src/enums';
import { capitalizeFirstLetter, Dictionaries, getOptionListFromCatalog, getTenantDate } from '@src/utils';
import { validatorRequired } from '@validators/validatorRequired';
import { validatorFutureTime } from '@validators/validatorFutureTime';
import { validatorIsValidDate } from '@validators/validatorIsValidDate';
import Typography from '@mui/material/Typography';

type PerformLabTestFormViewProps = {
  control: Control<PerformLabTestForm>;
  nursesOptions: { label: string; value: string }[];
};
export const PerformLabTestFormView = ({ control, nursesOptions }: PerformLabTestFormViewProps) => {
  const { t: tLabs } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');

  const mealStatusOptions = useMemo(
    () => [
      { label: capitalizeFirstLetter(tLabs('forms.creation.unknown')), value: LabMealStatus.UNKNOWN },
      { label: capitalizeFirstLetter(tLabs('forms.creation.fasting')), value: LabMealStatus.FASTING },
      { label: capitalizeFirstLetter(tLabs('forms.creation.nonFasting')), value: LabMealStatus.NON_FASTING },
    ],
    [],
  );

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={6}>
        <FormAutocompleteAsync
          required
          fullWidth
          name="patient"
          control={control}
          label={tLabs('forms.creation.patientName')}
          getOptionsUrl="/pm/patients/search/custom?fields=name,id&name="
          optionsTransform={(options) => options.map((option) => ({ value: option.id, label: option.name }))}
          isDisabled
        />
      </Grid>
      <Grid item xs={6}>
        <FormAutocomplete
          required
          control={control}
          name="procedure"
          label={tLabs('forms.creation.procedure')}
          options={[]}
          isDisabled
        />
      </Grid>
      <Grid item xs={6}>
        <FormAutocomplete
          required
          name="laboratory"
          control={control}
          label={tLabs('forms.creation.labName')}
          options={[]}
          isDisabled
        />
      </Grid>
      <Grid item xs={6}>
        <FormInputSelect
          required
          control={control}
          isDisabled
          name="specimenType"
          label={tLabs('forms.creation.specimenType')}
          options={getOptionListFromCatalog(Dictionaries.LabOrdersSpecimenTypes)}
        />
      </Grid>
      <Grid item xs={6}>
        <FormTimePicker
          required
          control={control}
          name="performedAt"
          maxTime={getTenantDate()}
          label={tLabs('forms.perform.performedTime')}
          rules={{
            required: validatorRequired(),
            validate: {
              maxDate: validatorFutureTime(getTenantDate(), tCommon('validation.timeShouldNotBeMoreThanTheCurrentOne')),
              validDate: validatorIsValidDate,
            },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormAutocomplete
          required
          control={control}
          name="performedBy"
          options={nursesOptions}
          label={tLabs('forms.perform.performedBy')}
          rules={{
            required: validatorAutocompleteRequired(),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })} mb={1}>
          {tLabs('forms.creation.mealStatus')}
        </Typography>
        <FormInputRadio control={control} name="mealStatus" options={mealStatusOptions} orientation="row" />
      </Grid>
    </Grid>
  );
};
