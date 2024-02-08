import Grid from '@mui/material/Grid';
import {
  FormDatePicker,
  FormInputRadio,
  NoticeBlock,
  FormInputSelect,
  FormInputText,
  FormDocumentsUpload,
} from '@components';
import { useTranslation } from 'react-i18next';
import { Control, UseFormSetValue } from 'react-hook-form/dist/types/form';
import type { PatientStatusForm } from '@types';
import {
  validatorLatinLettersNumberCharacters,
  validatorIsValidDate,
  validatorRequired,
  validatorMaxLength,
  validatorMinLength,
  validatorMaxFileCount,
  validatorMaxFileSize,
  validatorFutureDate,
  validatorInfectedFiles,
} from '@validators';
import { FileTypes, NoticeBlockType, PatientHospitalizationReason } from '@enums';
import { Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import { Dictionaries, getTenantEndCurrentDay } from '@utils';
import Typography from '@mui/material/Typography';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_TEXT } from '@constants/containers';
import hospitalizationDetails from '@translations/en/dictionaries/hospitalizationDetails.json';
import i18n from 'i18next';
import { selectS3AntivirusErrors } from '@store/slices';

type PatientStatusHospitalizedFormViewProps = {
  setValue: UseFormSetValue<PatientStatusForm>;
  control: Control<PatientStatusForm>;
  isHistory: boolean;
  reason: PatientHospitalizationReason | undefined;
  availableStatusOptions: { label: string; value: string }[];
  setFileLoadingCount: Dispatch<SetStateAction<number>>;
};

export const PatientStatusHospitalizedFormView = ({
  control,
  setValue,
  reason,
  isHistory,
  availableStatusOptions,
  setFileLoadingCount,
}: PatientStatusHospitalizedFormViewProps) => {
  const { t } = useTranslation('patient');
  const { t: tHospitalizationReasons } = useTranslation(Dictionaries.PatientHospitalizationReasons);
  const { t: tHospitalizationDetails } = useTranslation(Dictionaries.HospitalizationDetails);
  const infectedFileKeys = selectS3AntivirusErrors();

  useEffect(() => {
    setValue('details', undefined);
  }, [reason]);

  const reasonOptions = useMemo(() => {
    return [
      PatientHospitalizationReason.UNKNOWN,
      PatientHospitalizationReason.HD_RELATED,
      PatientHospitalizationReason.NON_HD_RELATED,
      PatientHospitalizationReason.VASCULAR_RELATED,
    ].map((reason) => ({
      label: tHospitalizationReasons(reason),
      value: reason,
    }));
  }, []);

  const hospitalizationDetailsOptions = useMemo(() => {
    if (reason && reason !== PatientHospitalizationReason.UNKNOWN) {
      const detailKeys = Object.keys(hospitalizationDetails[reason]);
      return detailKeys.map((detailKey) => ({
        label: i18n.t(`${Dictionaries.HospitalizationDetails}:${reason}.${detailKey}`),
        value: detailKey,
      }));
    }
    return [];
  }, [tHospitalizationDetails, reason]);

  return (
    <Grid container rowSpacing={2} columnSpacing={2} mb={2} data-testid="patientStatusHospitalizedFormView">
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
      <Grid item xs={12} sm={6} sx={{ order: isHistory ? 1 : 0 }}>
        <FormDatePicker
          control={control}
          name="returningDate"
          label={t('statusModal.dateOfReturn')}
          maxDate={getTenantEndCurrentDay()}
          fullWidth
          rules={{
            validate: {
              isValid: validatorIsValidDate,
              isFuture: validatorFutureDate(),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ order: 1 }}>
        <FormInputText
          multiline
          name="clinic"
          label={t('statusModal.hospitalClinic')}
          control={control}
          rules={{
            minLength: validatorMinLength(0, 100),
            maxLength: validatorMaxLength(0, 100),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ order: isHistory ? 0 : 1, '& legend': { mb: 0.9 } }}>
        <FormInputRadio
          name="reason"
          label={
            <Typography variant="labelM" sx={{ color: (theme) => theme.palette.text.secondary }}>
              {t('statusModal.reasonToHospitalization')}
            </Typography>
          }
          control={control}
          options={reasonOptions}
        />
      </Grid>
      {reason !== PatientHospitalizationReason.UNKNOWN && (
        <Grid item xs={12} sm={6} sx={{ order: 2 }}>
          <FormInputSelect
            required
            name="details"
            label={t('statusModal.details')}
            control={control}
            options={hospitalizationDetailsOptions}
            rules={{
              required: validatorRequired(),
            }}
          />
        </Grid>
      )}
      <Grid item xs={12} sx={{ order: 3 }}>
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
      {isHistory ? (
        <Grid item xs={12} sx={{ order: 4 }}>
          <FormDocumentsUpload
            name={FileTypes.DischargeNotes}
            control={control}
            label={t('statusModal.dischargeNotes')}
            subLabel={t('statusModal.fileLimits', { maxFileCount: 10, maxFileSize: MAX_FILE_SIZE_TEXT })}
            maxFileSize={MAX_FILE_SIZE}
            maxFileCount={10}
            rules={{
              validate: {
                maxCount: validatorMaxFileCount(10),
                maxSize: validatorMaxFileSize(MAX_FILE_SIZE),
                infected: validatorInfectedFiles(infectedFileKeys),
              },
            }}
            setFileLoadingCount={setFileLoadingCount}
            infectedFileKeys={infectedFileKeys}
          />
        </Grid>
      ) : null}
      {!isHistory ? (
        <Grid item xs={12} sx={{ order: 5 }}>
          <NoticeBlock type={NoticeBlockType.Info} title={t('statusModal.beSureToPrepareDocuments')} />
        </Grid>
      ) : null}
    </Grid>
  );
};
