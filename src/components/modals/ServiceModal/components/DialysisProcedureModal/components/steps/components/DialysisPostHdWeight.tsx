import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormAutocompleteFreeSolo, FormInputText, InfoCard } from '@components';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form/dist/types/form';
import { PatientWeightsResponse, PostHDForm } from '@types';
import { Grid } from '@mui/material';
import {
  validatorAutocompleteDecimalAmountIsInRange,
  validatorAutocompleteMaxLength,
  validatorAutocompleteMinLength,
  validatorAutocompleteNumberDecimal,
  validatorAutocompleteRequired,
} from '@validators';
import { useTranslation } from 'react-i18next';
import { API, dateFormat, toAmPmTimeString, transformObjectComaToDot } from '@utils';
import { selectDialysisPatient, selectIsDisableInterface } from '@store/slices/dialysisSlice';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type DialysisPostHdWeightProps = {
  control: Control<PostHDForm>;
  preSessionWeight?: string;
  watch: UseFormWatch<PostHDForm>;
  setValue: UseFormSetValue<PostHDForm>;
  parseWeightLossResult: (preWeight: number, postWeight: number) => string;
  isXs: boolean;
};

export const DialysisPostHdWeight = ({
  control,
  watch,
  preSessionWeight,
  setValue,
  parseWeightLossResult,
  isXs,
}: DialysisPostHdWeightProps) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const postSessionWeight = watch('postSessionWeight');
  const isDisabledInterface = selectIsDisableInterface();
  const patient = selectDialysisPatient();
  const [patientWeights, setPatientWeights] = useState<PatientWeightsResponse>([]);

  useEffect(() => {
    if (patient?.id) {
      API.get<PatientWeightsResponse>(`pm/patients/${patient.id}/weights`)
        .then((res) => setPatientWeights(res.data))
        .catch((error) => {
          console.error(error);
        });
    }
  }, [patient?.id]);

  const weightOptions = useMemo(() => {
    return patientWeights.length > 0
      ? patientWeights.map((weightOption) => ({
          label: weightOption.weight.toString(),
          value: weightOption.weight.toString(),
          group: t(`form.${weightOption.hdStage}`),
          date: weightOption.weighedAt,
          id: weightOption.id,
        }))
      : [];
  }, [patientWeights]);

  const renderWeightOptionCallback = useCallback((props, option) => {
    return (
      <Stack direction="column" {...props} key={option.id} sx={{ width: 1 }}>
        <Typography variant="labelM" sx={{ width: 1 }}>{`${option.label} ${t('form.kg')}`}</Typography>
        <Typography variant="paragraphS" sx={{ width: 1 }} color={(theme) => theme.palette.text.darker}>{`${dateFormat(
          option.date,
        )} — ${toAmPmTimeString(new Date(option.date))}`}</Typography>
      </Stack>
    );
  }, []);

  useEffect(() => {
    if (postSessionWeight?.value && preSessionWeight) {
      const preWeight = parseFloat(preSessionWeight);
      const postWeight = parseFloat(postSessionWeight?.value);
      if (!isNaN(preWeight) && !isNaN(postWeight)) {
        setValue('weightLoss', parseWeightLossResult(preWeight, postWeight));
      } else {
        setValue('weightLoss', '');
      }
    }
  }, [postSessionWeight, preSessionWeight]);

  return (
    <InfoCard title={'Weight'} isXs={isXs}>
      <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid item xs={isXs ? 12 : 4}>
          <FormAutocompleteFreeSolo
            control={control}
            name="postSessionWeight"
            label={t('form.postWeight')}
            required
            groupBy={(option) => option?.group || ''}
            renderOptionCallback={renderWeightOptionCallback}
            options={weightOptions}
            inputProps={{ inputMode: 'numeric' }}
            isDisabled={isDisabledInterface}
            transform={transformObjectComaToDot}
            rules={{
              required: validatorAutocompleteRequired(),
              pattern: validatorAutocompleteNumberDecimal(),
              minLength: validatorAutocompleteMinLength(2, 5),
              maxLength: validatorAutocompleteMaxLength(2, 5),
              decimalAmount: validatorAutocompleteDecimalAmountIsInRange(
                0,
                1,
                'value',
                tCommon('validation.oneDecimalIsAllowed'),
              ),
            }}
            adornment={t('form.kg')}
          />
        </Grid>
        <Grid item xs={isXs ? 12 : 4}>
          <FormInputText
            control={control}
            name="weightLoss"
            label={t('form.weightLoss')}
            adornment={t('form.kg')}
            isDisabled
          />
        </Grid>
      </Grid>
    </InfoCard>
  );
};
