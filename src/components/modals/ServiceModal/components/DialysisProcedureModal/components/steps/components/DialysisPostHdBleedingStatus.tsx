import { InfoCard, FormInputRadio, FormInputText } from '@components';
import { Control } from 'react-hook-form/dist/types/form';
import { PostHDForm } from '@types';
import {
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorRequired,
} from '@validators';
import { PostHdBleedingStatus } from '@enums';
import { useTranslation } from 'react-i18next';
import { UseFormWatch } from 'react-hook-form';
import { selectIsDisableInterface } from '@store/slices/dialysisSlice';

type DialysisPostHdBleedingStatusProps = {
  control: Control<PostHDForm>;
  watch: UseFormWatch<PostHDForm>;
  isXs: boolean;
};

export const DialysisPostHdBleedingStatus = ({ control, watch, isXs }: DialysisPostHdBleedingStatusProps) => {
  const { t } = useTranslation('dialysis');
  const bleedingStatus = watch('bleedingStatus');
  const isDisabledInterface = selectIsDisableInterface();

  return (
    <InfoCard title={'Bleeding status'} isXs={isXs}>
      <FormInputRadio
        control={control}
        name="bleedingStatus"
        options={[
          {
            label: t(`form.${PostHdBleedingStatus.WithoutDifficulties}`),
            value: PostHdBleedingStatus.WithoutDifficulties,
          },
          { label: t(`form.${PostHdBleedingStatus.SomeIssues}`), value: PostHdBleedingStatus.SomeIssues },
        ]}
        isDisabled={isDisabledInterface}
        sx={[bleedingStatus === PostHdBleedingStatus.SomeIssues && { mb: 1 }]}
      />
      {bleedingStatus === PostHdBleedingStatus.SomeIssues && (
        <FormInputText
          control={control}
          name="bleedingStatusExtValue"
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
