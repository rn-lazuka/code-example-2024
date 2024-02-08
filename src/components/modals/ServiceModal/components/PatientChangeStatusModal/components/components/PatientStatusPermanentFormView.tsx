import Grid from '@mui/material/Grid';
import { FormDocumentsUpload, FormInputSelect, FormInputText, FormPhoneInput } from '@components/FormComponents';
import { useTranslation } from 'react-i18next';
import { Control, UseFormRegister } from 'react-hook-form/dist/types/form';
import type { Kin, PatientStatusForm } from '@types';
import React, { Dispatch, SetStateAction } from 'react';
import {
  validatorInfectedFiles,
  validatorMaxFileCount,
  validatorMaxFileSize,
  validatorMaxLength,
  validatorMinLength,
  validatorRequired,
  validatorLatinLettersNumberCharacters,
} from '@validators';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_TEXT } from '@constants/containers';
import { FileTypes, PatientStatuses } from '@enums/global';
import { Dictionaries, getOptionListFromCatalog } from '@utils/getOptionsListFormCatalog';
import { latinLettersSpecialCharactersReg, latinLettersSpecialSymbolsReg } from '@src/regexp';
import { MAX_KIN_COUNT, OTHERS } from '@src/components/pages/TodayPatients';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';
import { InputTextType, NoticeBlockType } from '@enums/components';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@mui/material/Button';
import { MALAYSIA_PHONE_CODE } from '@constants/components';
import { useFieldArray } from 'react-hook-form';
import { selectS3AntivirusErrors } from '@store/slices';

type PatientStatusPermanentFormViewProps = {
  control: Control<PatientStatusForm>;
  gender?: string;
  isHistory: boolean;
  register: UseFormRegister<PatientStatusForm>;
  availableStatusOptions: { label: string; value: string }[];
  setFileLoadingCount: Dispatch<SetStateAction<number>>;
  currentPatientStatus: PatientStatuses;
  kins: Kin[];
};

export const PatientStatusPermanentFormView = ({
  control,
  isHistory,
  availableStatusOptions,
  setFileLoadingCount,
  gender,
  kins,
  register,
  currentPatientStatus,
}: PatientStatusPermanentFormViewProps) => {
  const { t } = useTranslation('patient');
  const { t: tCommon } = useTranslation('common');
  const infectedFileKeys = selectS3AntivirusErrors();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'kins',
  });

  const isWalkInStatus = currentPatientStatus === PatientStatuses.Walk_In;

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...(kins?.[index] && kins[index]),
    };
  });

  return (
    <Grid container rowSpacing={2} columnSpacing={2} mb={2} data-testid="patientStatusPermanentFormView">
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
      <Grid item xs={12}>
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
      {isWalkInStatus && (
        <>
          <Grid item xs={12} sm={6}>
            <FormInputSelect
              options={getOptionListFromCatalog(Dictionaries.Genders)}
              control={control}
              name="genderCode"
              label={t('statusModal.gender')}
              required
              rules={{
                required: { value: true, message: tCommon('validation.required') },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {gender === OTHERS && (
              <FormInputText
                control={control}
                name="genderExtValue"
                required
                label={t('statusModal.genderDetails')}
                rules={{
                  required: { value: true, message: tCommon('validation.required') },
                  minLength: { value: 4, message: tCommon('validation.length', { min: 4, max: 30 }) },
                  maxLength: { value: 30, message: tCommon('validation.length', { min: 4, max: 30 }) },
                  pattern: { value: latinLettersSpecialCharactersReg, message: tCommon('validation.name') },
                }}
                data-testid="addPatientGenderInput"
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <NoticeBlock type={NoticeBlockType.Info} text={t('statusModal.youCanAddDemographic')} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="headerM">{t('statusModal.familyInformation')}</Typography>
          </Grid>
          <Grid container item xs={12} rowSpacing={3}>
            <Grid container item xs={12} rowSpacing={2} columnSpacing={2}>
              {controlledFields.map((field, index) => {
                return (
                  <React.Fragment key={field.id}>
                    <Grid item xs={12}>
                      <Stack spacing={1.5} direction="row">
                        <Typography variant="headerS">{`${t('profile.nextOfKin')} ${index + 1}`}</Typography>
                        {index > 0 && (
                          <DeleteOutlinedIcon
                            onClick={() => remove(index)}
                            sx={(theme) => ({ cursor: 'pointer', color: theme.palette.icon.main })}
                          />
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={({ spacing }) => ({ pt: `${spacing(1)} !important` })}>
                      <FormInputText
                        control={control}
                        name={`kins.${index}.name`}
                        label={t('modal.kinName')}
                        textType={InputTextType.Capitalize}
                        required
                        rules={{
                          required: { value: true, message: tCommon('validation.required') },
                          minLength: { value: 1, message: tCommon('validation.length', { min: 1, max: 256 }) },
                          maxLength: { value: 256, message: tCommon('validation.length', { min: 1, max: 256 }) },
                          pattern: { value: latinLettersSpecialSymbolsReg, message: tCommon('validation.name') },
                        }}
                      />
                    </Grid>
                    <Grid container item columnSpacing={2} rowSpacing={2} xs={12}>
                      <Grid item xs={12} sm={6}>
                        <FormInputText
                          control={control}
                          name={`kins.${index}.relationship`}
                          label={t('modal.relationship')}
                          rules={{
                            pattern: {
                              value: latinLettersSpecialCharactersReg,
                              message: tCommon('validation.textField'),
                            },
                            minLength: { value: 3, message: tCommon('validation.length', { min: 3, max: 25 }) },
                            maxLength: { value: 25, message: tCommon('validation.length', { min: 3, max: 25 }) },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormPhoneInput
                          name={`kins.${index}.phone.number`}
                          codeName={`kins.${index}.phone.countryCode`}
                          phoneCode={field.phone.countryCode}
                          control={control}
                          register={register}
                          rules={{
                            required: { value: true, message: tCommon('validation.required') },
                            minLength: { value: 6, message: tCommon('validation.length', { min: 6, max: 14 }) },
                            maxLength: { value: 14, message: tCommon('validation.length', { min: 6, max: 14 }) },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
            <Grid item sm={6}>
              <Button
                onClick={() =>
                  append({ name: '', relationship: '', phone: { number: '', countryCode: MALAYSIA_PHONE_CODE } })
                }
                variant={'outlined'}
                sx={[{ textTransform: 'unset' }]}
                disabled={fields.length === MAX_KIN_COUNT}
                data-testid="addKinButton"
              >
                <Box sx={(theme) => ({ fontSize: theme.typography.headerM.fontSize })}>+</Box>&nbsp;{t('button.addKin')}
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="headerM">{t('modal.documentsUpload')}</Typography>
          </Grid>
        </>
      )}
      <Grid item xs={12} container rowSpacing={2} columnSpacing={2}>
        {isWalkInStatus && (
          <Grid item xs={12} sm={6}>
            <FormDocumentsUpload
              name={FileTypes.IdentityDocument}
              control={control}
              maxFileSize={MAX_FILE_SIZE}
              label={t('modal.nricOrPassport')}
              subLabel={t('modal.fieLimits', { maxFileCount: 3, maxFileSize: MAX_FILE_SIZE_TEXT })}
              maxFileCount={3}
              rules={{
                required: { value: true, message: tCommon('validation.required') },
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
        )}
        <Grid item xs={12} sm={6}>
          <FormDocumentsUpload
            name={FileTypes.VirologyStatus}
            control={control}
            maxFileSize={MAX_FILE_SIZE}
            label={t('modal.virologyFiles')}
            subLabel={t('modal.fieLimits', { maxFileCount: 5, maxFileSize: MAX_FILE_SIZE_TEXT })}
            maxFileCount={5}
            rules={{
              required: { value: true, message: tCommon('validation.required') },
              validate: {
                maxCount: validatorMaxFileCount(5),
                maxSize: validatorMaxFileSize(MAX_FILE_SIZE),
                infected: validatorInfectedFiles(infectedFileKeys),
              },
            }}
            setFileLoadingCount={setFileLoadingCount}
            infectedFileKeys={infectedFileKeys}
          />
        </Grid>
        {isWalkInStatus && (
          <>
            <Grid item xs={12} sm={6}>
              <FormDocumentsUpload
                name={FileTypes.MedicalReport}
                control={control}
                maxFileSize={MAX_FILE_SIZE}
                label={t('modal.medicalReportsFiles')}
                subLabel={t('modal.fieLimits', { maxFileCount: 5, maxFileSize: MAX_FILE_SIZE_TEXT })}
                maxFileCount={5}
                rules={{
                  required: { value: true, message: tCommon('validation.required') },
                  validate: {
                    maxCount: validatorMaxFileCount(5),
                    maxSize: validatorMaxFileSize(MAX_FILE_SIZE),
                    infected: validatorInfectedFiles(infectedFileKeys),
                  },
                }}
                setFileLoadingCount={setFileLoadingCount}
                infectedFileKeys={infectedFileKeys}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormDocumentsUpload
                name={FileTypes.Consultation}
                control={control}
                maxFileSize={MAX_FILE_SIZE}
                label={t('modal.consultationFiles')}
                subLabel={t('modal.fieLimits', { maxFileCount: 3, maxFileSize: MAX_FILE_SIZE_TEXT })}
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
            <Grid item xs={12} sm={6}>
              <FormDocumentsUpload
                name={FileTypes.BloodTest}
                control={control}
                maxFileSize={MAX_FILE_SIZE}
                label={t('modal.bloodTestsFiles')}
                subLabel={t('modal.fieLimits', { maxFileCount: 5, maxFileSize: MAX_FILE_SIZE_TEXT })}
                maxFileCount={5}
                rules={{
                  required: { value: true, message: tCommon('validation.required') },
                  validate: {
                    maxCount: validatorMaxFileCount(5),
                    maxSize: validatorMaxFileSize(MAX_FILE_SIZE),
                    infected: validatorInfectedFiles(infectedFileKeys),
                  },
                }}
                setFileLoadingCount={setFileLoadingCount}
                infectedFileKeys={infectedFileKeys}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormDocumentsUpload
                name={FileTypes.HdPrescription}
                control={control}
                maxFileSize={MAX_FILE_SIZE}
                label={t('modal.hdPrescriptionFiles')}
                subLabel={t('modal.fieLimits', { maxFileCount: 3, maxFileSize: MAX_FILE_SIZE_TEXT })}
                maxFileCount={3}
                rules={{
                  required: { value: true, message: tCommon('validation.required') },
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
            <Grid item xs={12} sm={6}>
              <FormDocumentsUpload
                name={FileTypes.Other}
                control={control}
                maxFileSize={MAX_FILE_SIZE}
                label={t('modal.otherFiles')}
                subLabel={t('modal.fieLimits', { maxFileCount: 10, maxFileSize: MAX_FILE_SIZE_TEXT })}
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
          </>
        )}
      </Grid>
    </Grid>
  );
};
