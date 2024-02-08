import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, UseFormTrigger, UseFormWatch } from 'react-hook-form/dist/types/form';
import Stack from '@mui/material/Stack';
import {
  FormAutocompleteFreeSolo,
  FormAutocompleteFreeSoloAsync,
  FormDatePicker,
  FormDocumentsUpload,
  FormInputRadio,
  FormInputSelect,
  FormInputText,
  FormNumberInput,
} from '@components';
import {
  validatorAutocompleteMaxLength,
  validatorAutocompleteMinLength,
  validatorAutocompletePattern,
  validatorAutocompleteRequired,
  validatorFutureDate,
  validatorHasTodayEncounter,
  validatorInfectedFiles,
  validatorIsValidDate,
  validatorLatinLettersNumberCharacters,
  validatorLatinLettersSpecialCharacters,
  validatorMaxFileCount,
  validatorMaxFileSize,
  validatorMaxLength,
  validatorMinLength,
  validatorPastDate,
  validatorRequired,
  validatorTimeNotEarlierThan,
  validatorTimeNotLaterThan,
} from '@validators';
import {
  capitalizeFirstLetter,
  dateToServerFormat,
  Dictionaries,
  getOptionListFromCatalog,
  getTenantEndCurrentDay,
  getTenantStartCurrentDay,
} from '@utils';
import { DrawerType, InputTextType, VaccinationDrawerType, VaccinationStatus, VaccinationType } from '@enums';
import { VaccinationForm } from '@types';
import { subYears } from 'date-fns';
import {
  selectCurrentBranch,
  selectDrawerPayload,
  selectHasTodayEncounter,
  selectVaccinationS3AntivirusErrors,
} from '@store/slices';
import { FormAutocomplete } from '@components/FormComponents/FormAutocomplete';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_TEXT } from '@constants';

type AddVaccinationFormViewProps = {
  control: Control<VaccinationForm>;
  watch: UseFormWatch<VaccinationForm>;
  trigger: UseFormTrigger<VaccinationForm>;
  setFileLoadingCount: Dispatch<SetStateAction<number>>;
  specialities: [];
  isExternalDoctor: boolean;
};

export const AddVaccinationFormView = ({
  control,
  watch,
  trigger,
  setFileLoadingCount,
  specialities,
  isExternalDoctor,
}: AddVaccinationFormViewProps) => {
  const { t } = useTranslation('vaccination');
  const { t: tCommon } = useTranslation('common');
  const currentBranch = selectCurrentBranch();
  const { type: drawerType, status } = selectDrawerPayload(DrawerType.VaccinationForm);
  const hasTodayEncounter = selectHasTodayEncounter();
  const infectedFileKeys = selectVaccinationS3AntivirusErrors();

  const typeOptions = useMemo(
    () => [
      { label: capitalizeFirstLetter(t('form.toBeAdministered')), value: VaccinationType.ToAdminister },
      { label: capitalizeFirstLetter(t('form.hasBeenAdministered')), value: VaccinationType.Administered },
    ],
    [],
  );
  const clinicOptions = useMemo(() => [{ label: currentBranch.name, value: currentBranch.id }], [currentBranch]);
  const type = watch('type');

  return (
    <Stack direction="column" spacing={2}>
      {drawerType !== VaccinationDrawerType.Edit && (
        <FormInputRadio control={control} name="type" options={typeOptions} />
      )}
      {(type === VaccinationType.ToAdminister ||
        status === VaccinationStatus.Pending ||
        status === VaccinationStatus.NotDone) && (
        <>
          <FormAutocomplete
            required
            popupIcon={false}
            capitalizedLabel
            name="vaccineType"
            control={control}
            multiline
            options={getOptionListFromCatalog(Dictionaries.Vaccines)}
            label={t('form.vaccineType')}
            rules={{
              required: validatorAutocompleteRequired(),
            }}
          />
          <FormNumberInput
            label={t('form.amount')}
            name="amount"
            minValue={1}
            maxValue={10}
            control={control}
            rules={{
              max: { value: 10, message: tCommon('validation.maxNumber', { min: 1, max: 10 }) },
              min: { value: 1, message: tCommon('validation.zeroNotAvailable') },
            }}
            sx={{ maxWidth: (theme) => theme.spacing(23) }}
          />
        </>
      )}
      {(type === VaccinationType.Administered ||
        status === VaccinationStatus.AdministeredExternal ||
        status === VaccinationStatus.AdministeredInternal) && (
        <FormInputText
          required
          name="administeredVaccineType"
          control={control}
          label={t('form.vaccineType')}
          rules={{
            required: validatorRequired(),
            minLength: validatorMinLength(2, 200),
            maxLength: validatorMaxLength(2, 200),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      )}
      <FormInputSelect
        options={getOptionListFromCatalog(Dictionaries.DosingSchedule)}
        control={control}
        name="dossingSchedule"
        label={t('form.dossingSchedule')}
        required
        rules={{
          required: validatorRequired(),
        }}
      />
      <FormDatePicker
        control={control}
        name="administerDate"
        label={t(
          type === VaccinationType.Administered ||
            status === VaccinationStatus.AdministeredExternal ||
            status === VaccinationStatus.AdministeredInternal
            ? 'form.administeredDate'
            : 'form.dateToAdminister',
        )}
        maxDate={type === VaccinationType.Administered ? getTenantEndCurrentDay() : undefined}
        minDate={type === VaccinationType.ToAdminister ? getTenantEndCurrentDay() : undefined}
        required
        rules={{
          required: validatorRequired(),
          validate: {
            isValid: validatorIsValidDate,
            isFuture:
              type === VaccinationType.Administered
                ? validatorFutureDate(tCommon('validation.enteredDateShouldNotBeLater'))
                : validatorPastDate,
            hasTodayEncounter: validatorHasTodayEncounter(
              type === VaccinationType.Administered ? false : hasTodayEncounter,
            ),
          },
        }}
      />
      {type !== VaccinationType.Administered && (
        <>
          <Divider />
          <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
            {t('form.prescribedBy')}
          </Typography>
          <FormAutocompleteFreeSoloAsync
            capitalizedLabel
            name="prescribedBy"
            trigger={trigger}
            control={control}
            label={t('form.doctorsName')}
            textType={InputTextType.Capitalize}
            getOptionsUrl="/pm/doctors?name="
            optionsTransform={(doctors) => [
              ...doctors
                .reduce((map, doctor) => {
                  if (doctor.deleted) return map;
                  map.set(doctor.id, {
                    label: doctor.name,
                    value: doctor.id,
                    specialities: doctor.specialities,
                  });
                  return map;
                }, new Map())
                .values(),
            ]}
            rules={{
              pattern: validatorAutocompletePattern(validatorLatinLettersSpecialCharacters()),
              minLength: validatorAutocompleteMinLength(1, 100, 'label'),
              maxLength: validatorAutocompleteMaxLength(1, 100, 'label'),
            }}
          />
          {!isExternalDoctor ? (
            <FormInputSelect
              required
              clearable
              options={specialities}
              control={control}
              isDisabled={specialities.length === 0}
              name="doctorsSpecialitySelect"
              label={t('form.doctorsSpeciality')}
              rules={{
                required: validatorRequired(),
              }}
            />
          ) : (
            <FormInputText
              control={control}
              name="doctorsSpecialityText"
              label={t('form.doctorsSpeciality')}
              textType={InputTextType.Capitalize}
              rules={{
                minLength: validatorMinLength(2, 100),
                maxLength: validatorMaxLength(2, 100),
                pattern: validatorLatinLettersSpecialCharacters(),
              }}
            />
          )}
          <FormDatePicker
            control={control}
            name="prescriptionDate"
            label={t('form.prescriptionDate')}
            required
            maxDate={getTenantEndCurrentDay()}
            minDate={subYears(getTenantStartCurrentDay(), 1)}
            rules={{
              required: validatorRequired(),
              validate: {
                isValid: validatorIsValidDate,
                isLater: validatorTimeNotLaterThan(
                  getTenantEndCurrentDay(),
                  tCommon('validation.enteredDateShouldNotBeLater'),
                ),
                isEarlier: validatorTimeNotEarlierThan(
                  subYears(getTenantStartCurrentDay(), 1),
                  tCommon('validation.enteredDateShouldNotBeEarlyThan', {
                    date: dateToServerFormat(subYears(getTenantStartCurrentDay(), 1)),
                  }),
                ),
              },
            }}
          />
        </>
      )}
      {type === VaccinationType.Administered && (
        <FormAutocompleteFreeSolo
          control={control}
          name="clinic"
          label={t('form.clinic')}
          options={clinicOptions}
          changeTransformCallback={(value, options) => {
            return (options.find((option) => (typeof value !== 'string' ? option.label === value?.label : false)) || {
              label: value,
              value: '',
            }) as any;
          }}
          rules={{
            minLength: validatorAutocompleteMinLength(2, 50),
            maxLength: validatorAutocompleteMaxLength(2, 50),
            pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
          }}
        />
      )}
      <Divider />
      <FormInputText
        control={control}
        name="comments"
        label={t('form.comments')}
        multiline
        rules={{
          minLength: validatorMinLength(2, 500),
          maxLength: validatorMaxLength(2, 500),
          pattern: validatorLatinLettersNumberCharacters(),
        }}
      />
      {type === VaccinationType.Administered && (
        <>
          <Divider />
          <FormDocumentsUpload
            name="files"
            control={control}
            maxFileSize={MAX_FILE_SIZE}
            label={t('form.vaccinationCertificate')}
            subLabel={t('form.fileLimits', { maxFileCount: 10, maxFileSize: MAX_FILE_SIZE_TEXT })}
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
        </>
      )}
    </Stack>
  );
};
