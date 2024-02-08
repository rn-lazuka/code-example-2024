import Grid from '@mui/material/Grid';
import { FormInputSelect } from '@components/FormComponents';
import { validatorRequired } from '@validators/validatorRequired';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form/dist/types/form';
import type { PatientStatusForm } from '@types';

type PatientStatusDefaultFormViewProps = {
  control: Control<PatientStatusForm>;
  availableStatusOptions: { label: string; value: string }[];
};

export const PatientStatusDefaultFormView = ({
  control,
  availableStatusOptions,
}: PatientStatusDefaultFormViewProps) => {
  const { t: tPatient } = useTranslation('patient');

  return (
    <Grid container rowSpacing={2} columnSpacing={2} mb={2} data-testid="patientStatusDefaultFormView">
      <Grid item xs={12} sm={6}>
        <FormInputSelect
          name="status"
          label={tPatient('statusModal.patientStatus')}
          control={control}
          options={availableStatusOptions}
          required
          rules={{
            required: validatorRequired(),
          }}
        />
      </Grid>
    </Grid>
  );
};
