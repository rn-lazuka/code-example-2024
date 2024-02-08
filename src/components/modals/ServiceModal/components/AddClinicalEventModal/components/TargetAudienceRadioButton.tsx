import type { Control } from 'react-hook-form/dist/types/form';
import type { ClinicalEventFormType } from '@types';
import Typography from '@mui/material/Typography';
import { TargetAudience } from '@enums/components/TargetAudience';
import { FormInputCheckbox } from '@components/FormComponents';
import { WarningMessage } from '@components/WarningMessage/WarningMessage';
import { useTranslation } from 'react-i18next';

type TargetAudienceRadioButtonProps = {
  value: string;
  label: string;
  targetAudience?: TargetAudience;
  dialysisRelated?: boolean;
  control: Control<ClinicalEventFormType>;
};

export const TargetAudienceRadioButton = ({
  value,
  label,
  targetAudience,
  dialysisRelated,
  control,
}: TargetAudienceRadioButtonProps) => {
  const { t } = useTranslation('schedule');
  return (
    <>
      <Typography
        variant="labelL"
        sx={(theme) => ({
          color: theme.palette.text.primary,
          maxWidth: 'content',
          mt: 1,
        })}
      >
        {label}
      </Typography>
      {targetAudience === value && value !== TargetAudience.SpecificPatients && (
        <>
          <FormInputCheckbox
            control={control}
            name="dialysisRelated"
            label={t('form.dialysisDayOnly')}
            sx={{ mb: 2, mt: 2 }}
          />
          {dialysisRelated && <WarningMessage text={t('form.warning')} />}
        </>
      )}
    </>
  );
};
