import Grid from '@mui/material/Grid';
import { FormDatePicker, FormDocumentsUpload, FormInputSelect, FormInputText } from '@components/FormComponents';
import { validatorRequired } from '@validators/validatorRequired';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form/dist/types/form';
import type { PatientStatusForm } from '@types';
import {
  validatorLatinLettersNumberCharacters,
  validatorFutureDate,
  validatorIsValidDate,
  validatorMaxFileCount,
  validatorMaxFileSize,
  validatorMaxLength,
  validatorMinLength,
  validatorInfectedFiles,
} from '@validators';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';
import { NoticeBlockType } from '@enums/components';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_TEXT } from '@constants/containers';
import React, { Dispatch, SetStateAction } from 'react';
import { FileTypes } from '@enums/global';
import { getTenantEndCurrentDay } from '@utils/getTenantDate';
import { selectS3AntivirusErrors } from '@store/slices';

type PatientStatusDeadFormViewProps = {
  control: Control<PatientStatusForm>;
  isHistory: boolean;
  availableStatusOptions: { label: string; value: string }[];
  setFileLoadingCount: Dispatch<SetStateAction<number>>;
};

export const PatientStatusDeadFormView = ({
  control,
  isHistory,
  availableStatusOptions,
  setFileLoadingCount,
}: PatientStatusDeadFormViewProps) => {
  const { t } = useTranslation('patient');
  const { t: tCommon } = useTranslation('common');
  const infectedFileKeys = selectS3AntivirusErrors();

  return (
    <Grid container rowSpacing={2} columnSpacing={2} mb={2} data-testid="patientStatusDeadFormView">
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
      <Grid item xs={12} sm={6}>
        <FormDatePicker
          control={control}
          name="deathDate"
          label={t('statusModal.dateOfDeath')}
          maxDate={getTenantEndCurrentDay()}
          fullWidth
          required
          rules={{
            required: validatorRequired(),
            validate: {
              isValid: validatorIsValidDate,
              isFuture: validatorFutureDate(),
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormInputText
          multiline
          name="comment"
          label={t('statusModal.causeOfDeath')}
          control={control}
          rules={{
            minLength: validatorMinLength(0, 500),
            maxLength: validatorMaxLength(0, 500),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormDocumentsUpload
          name={FileTypes.DeathProof}
          control={control}
          maxFileSize={MAX_FILE_SIZE}
          label={t('statusModal.deathCertificateOrOtherProof')}
          subLabel={tCommon('fileUpload.fileLimits', { maxFileCount: 3, maxFileSize: MAX_FILE_SIZE_TEXT })}
          maxFileCount={3}
          rules={{
            validate: {
              maxCount: validatorMaxFileCount(3),
              maxSize: validatorMaxFileSize(MAX_FILE_SIZE),
              infected: validatorInfectedFiles(infectedFileKeys),
            },
          }}
          setFileLoadingCount={setFileLoadingCount}
          infectedFileKeys={infectedFileKeys}
        />
      </Grid>
      {!isHistory ? (
        <Grid item xs={12}>
          <NoticeBlock type={NoticeBlockType.Error} text={t('statusModal.payAttention')} />
        </Grid>
      ) : null}
    </Grid>
  );
};
