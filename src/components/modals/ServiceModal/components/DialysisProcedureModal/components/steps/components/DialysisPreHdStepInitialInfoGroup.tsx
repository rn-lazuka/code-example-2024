import { useEffect, useState } from 'react';
import { Control, UseFormTrigger, UseFormWatch } from 'react-hook-form/dist/types/form';
import { PreHDForm } from '@types';
import { InfoCard } from '@components/InfoCard/InfoCard';
import { FormDatePicker, FormInputSelect, FormInputText, SelectOptionProps } from '@components';
import { validatorIsValidDate, validatorRequired, validatorTimeDurationIsInRange } from '@validators';
import { useTranslation } from 'react-i18next';
import { FormTimeDurationPicker } from '@components/FormComponents/FormTimeDurationPicker';
import { API } from '@utils';
import { selectDialysisAppointmentId, selectIsDisableInterface } from '@store';
import { EIGHT_HOUR, ONE_HOUR } from '@constants';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

type PreHdAccessManagementProps = {
  control: Control<PreHDForm>;
  watch: UseFormWatch<PreHDForm>;
  trigger: UseFormTrigger<PreHDForm>;
  isXs: boolean;
};

const DialysisPreHdStepInitialInfoGroup = ({ control, watch, trigger, isXs }: PreHdAccessManagementProps) => {
  const { t } = useTranslation('dialysis');
  const [bayOptions, setBayOptions] = useState<SelectOptionProps[]>([]);
  const appointmentId = selectDialysisAppointmentId();
  const isDisabledInterface = selectIsDisableInterface();

  useEffect(() => {
    API.get(`/pm/appointments/${appointmentId}/locations`)
      .then(({ data }) => {
        setBayOptions(data.map((option) => ({ label: option.name, value: option.id })));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <InfoCard title={t('form.initialInfo')} isXs={isXs}>
      <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid item xs={isXs ? 12 : 4}>
          <FormInputSelect
            emptyBody={<Typography variant="labelM">{t('noAvailableBays')}</Typography>}
            options={bayOptions}
            control={control}
            name="initialBayNumber"
            label={t('form.bayNumber')}
            required
            isDisabled={isDisabledInterface}
            rules={{
              required: validatorRequired(),
            }}
          />
        </Grid>
        <Grid item xs={isXs ? 12 : 4}>
          <FormInputText control={control} name="initialTreatmentNumber" label={t('form.treatmentNumber')} isDisabled />
        </Grid>
        <Grid item xs={isXs ? 12 : 4}>
          <FormDatePicker
            control={control}
            name="initialToday"
            isDisabled
            label={t('form.date')}
            rules={{
              validate: {
                isValid: validatorIsValidDate,
              },
            }}
          />
        </Grid>
        <Grid item xs={isXs ? 7 : 4}>
          <FormTimeDurationPicker
            control={control}
            watch={watch}
            trigger={trigger}
            name="initialDuration"
            label={t('form.duration')}
            required
            isDisabled={isDisabledInterface}
            rules={{
              required: validatorRequired(),
              validate: {
                durationTime: validatorTimeDurationIsInRange(ONE_HOUR, EIGHT_HOUR),
              },
            }}
          />
        </Grid>
      </Grid>
    </InfoCard>
  );
};

export default DialysisPreHdStepInitialInfoGroup;
