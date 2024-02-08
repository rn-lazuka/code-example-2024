import { Control, UseFormWatch } from 'react-hook-form/dist/types/form';
import { DialysisStatus, AccessCondition } from '@enums';
import { InfoCard } from '@components/InfoCard/InfoCard';
import { FormInputRadio, FormInputText } from '@components/FormComponents';
import {
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorRequired,
} from '@validators';
import { useTranslation } from 'react-i18next';
import { FieldValues, Path } from 'react-hook-form';
import { selectDialysisStatus, selectIsDisableInterface } from '@store/slices/dialysisSlice';

type DialysisPAccessConditionGroupProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues, Object>;
  watch: UseFormWatch<TFormValues>;
  isXs: boolean;
};

export const DialysisAccessConditionGroup = <TFormValues extends FieldValues>({
  control,
  watch,
  isXs,
}: DialysisPAccessConditionGroupProps<TFormValues>) => {
  const { t } = useTranslation('dialysis');
  const accessCondition = watch('accessCondition' as Path<TFormValues>);
  const currentStep = selectDialysisStatus().currentStep;
  const isDisabledInterface = selectIsDisableInterface();

  const options = [
    {
      label: t(
        `form.${
          currentStep === DialysisStatus.PreDialysis
            ? AccessCondition.NoProblemsPreHd
            : AccessCondition.NoProblemsPostHd
        }`,
      ),
      value:
        currentStep === DialysisStatus.PreDialysis ? AccessCondition.NoProblemsPreHd : AccessCondition.NoProblemsPostHd,
    },
    { label: t(`form.${AccessCondition.SomeIssues}`), value: AccessCondition.SomeIssues },
  ];

  return (
    <InfoCard title={t('form.accessCondition')} isXs={isXs}>
      <FormInputRadio
        control={control}
        name={'accessCondition' as Path<TFormValues>}
        options={options}
        isDisabled={isDisabledInterface}
        sx={[accessCondition === AccessCondition.SomeIssues && { mb: 1 }]}
      />
      {accessCondition === AccessCondition.SomeIssues && (
        <FormInputText
          control={control}
          name={'accessConditionExtValue' as Path<TFormValues>}
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
