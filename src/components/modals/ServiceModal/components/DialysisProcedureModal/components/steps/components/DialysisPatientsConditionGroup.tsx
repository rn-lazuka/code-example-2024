import { useTranslation } from 'react-i18next';
import { Control, UseFormWatch, Path, FieldValues } from 'react-hook-form';
import { PatientCondition } from '@enums';
import { InfoCard } from '@components/InfoCard/InfoCard';
import { FormInputRadio, FormInputText } from '@components';
import {
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorRequired,
} from '@validators';
import { selectIsDisableInterface } from '@store/slices/dialysisSlice';

type DialysisPatientsConditionGroupProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues, Object>;
  watch: UseFormWatch<TFormValues>;
  isXs: boolean;
};

export const DialysisPatientsConditionGroup = <TFormValues extends FieldValues>({
  control,
  watch,
  isXs,
}: DialysisPatientsConditionGroupProps<TFormValues>) => {
  const { t } = useTranslation('dialysis');
  const patientCondition = watch('patientCondition' as Path<TFormValues>);
  const isDisabledInterface = selectIsDisableInterface();

  return (
    <InfoCard title={t('form.patientsCondition')} isXs={isXs}>
      <FormInputRadio
        control={control}
        name={'patientCondition' as Path<TFormValues>}
        isDisabled={isDisabledInterface}
        options={[
          { label: t(`form.${PatientCondition.Acceptable}`), value: PatientCondition.Acceptable },
          { label: t(`form.${PatientCondition.SomeIssues}`), value: PatientCondition.SomeIssues },
        ]}
        sx={[patientCondition === PatientCondition.SomeIssues && { mb: 1 }]}
      />
      {patientCondition === PatientCondition.SomeIssues && (
        <FormInputText
          control={control}
          name={'patientConditionExtValue' as Path<TFormValues>}
          label={t('form.issues')}
          multiline
          required
          isDisabled={isDisabledInterface}
          rules={{
            required: validatorRequired(),
            minLength: validatorMinLength(2, 500),
            maxLength: validatorMaxLength(2, 500),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      )}
    </InfoCard>
  );
};
