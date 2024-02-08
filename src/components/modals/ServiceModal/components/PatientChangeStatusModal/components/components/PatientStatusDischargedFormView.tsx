import Grid from '@mui/material/Grid';
import { FormInputSelect, FormInputText } from '@components/FormComponents';
import { validatorRequired } from '@validators/validatorRequired';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form/dist/types/form';
import type { PatientStatusForm } from '@types';
import { validatorLatinLettersNumberCharacters } from '@validators/validatorLatinLettersNumbersCharacters';
import { validatorMaxLength, validatorMinLength } from '@validators';

type PatientStatusDischargedFormViewProps = {
  control: Control<PatientStatusForm>;
  isHistory: boolean;
  availableStatusOptions: { label: string; value: string }[];
};

export const PatientStatusDischargedFormView = ({
  control,
  isHistory,
  availableStatusOptions,
}: PatientStatusDischargedFormViewProps) => {
  const { t } = useTranslation('patient');

  return (
    <Grid container rowSpacing={2} columnSpacing={2} mb={2} data-testid="patientStatusDischargedFormView">
      {!isHistory && (
        <Grid item xs={12} sm={6}>
          <FormInputSelect
            name="status"
            label={t('statusModal.patientStatus')}
            control={control}
            options={availableStatusOptions}
            required
            rules={{
              required: validatorRequired(),
            }}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <FormInputText
          multiline
          name="comment"
          label={t('statusModal.comment')}
          control={control}
          rules={{
            minLength: validatorMinLength(0, 500),
            maxLength: validatorMaxLength(0, 500),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      </Grid>
    </Grid>
  );
};
