import { Control } from 'react-hook-form/dist/types/form';
import { PostHDForm } from '@types';
import { InfoCard } from '@components/InfoCard/InfoCard';
import { useTranslation } from 'react-i18next';
import { FormInputRadio, FormInputText } from '@components';
import Stack from '@mui/material/Stack';
import { validatorLatinLettersNumberCharacters, validatorMaxLength, validatorMinLength } from '@validators';
import { selectIsDisableInterface } from '@store/slices/dialysisSlice';
import { PostHdSummary } from '@enums';

type DialysisPostHdSummaryProps = {
  control: Control<PostHDForm>;
  isXs: boolean;
};
export const DialysisPostHdSummary = ({ control, isXs }: DialysisPostHdSummaryProps) => {
  const { t } = useTranslation('dialysis');
  const isDisabledInterface = selectIsDisableInterface();

  return (
    <InfoCard title={'Dialysis summary'} isXs={isXs}>
      <Stack direction="column" spacing={1}>
        <FormInputRadio
          control={control}
          name="summaryType"
          isDisabled={isDisabledInterface}
          options={[
            { label: t(`form.${PostHdSummary.Uneventful}`), value: PostHdSummary.Uneventful },
            { label: t(`form.${PostHdSummary.Eventful}`), value: PostHdSummary.Eventful },
          ]}
        />
        <FormInputText
          control={control}
          name="summaryText"
          label={t('form.summary')}
          multiline
          isDisabled={isDisabledInterface}
          rules={{
            minLength: validatorMinLength(2, 500),
            maxLength: validatorMaxLength(2, 500),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      </Stack>
    </InfoCard>
  );
};
