import {
  validatorAutocompleteMaxLength,
  validatorAutocompleteMinLength,
  validatorAutocompletePattern,
  validatorAutocompleteRequired,
  validatorHasTodayEncounter,
  validatorIsValidDate,
  validatorIsValidNumber,
  validatorLatinLettersNumberCharacters,
  validatorLatinLettersNumberCharactersWithPercentage,
  validatorLatinLettersSpecialCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorNotEarlierThan,
  validatorPastDate,
  validatorRequired,
  validatorTimeNotEarlierThanNotEqual,
  validatorTimeNotLaterThanNotEqual,
} from '@validators';
import {
  API,
  dateToServerFormat,
  Dictionaries,
  getOptionListFromCatalog,
  getTenantEndCurrentDay,
  getTenantStartCurrentDay,
  transformEventCommaToDot,
} from '@utils';
import {
  FormAutocompleteAsync,
  FormAutocompleteFreeSolo,
  FormAutocompleteFreeSoloAsync,
  FormDatePicker,
  FormInputRadio,
  FormInputSelect,
  FormInputText,
  FormNumberInput,
} from '@components';
import {
  DrawerType,
  InputTextType,
  MedicationDurationTypes,
  MedicationFrequency,
  MedicationPlaces,
  SnackType,
} from '@enums';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import type { MedicationForm, MedicationFrequencyAutocompleteFreeSoloValue } from '@types';
import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form/dist/types/form';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { subYears } from 'date-fns';
import { useFieldArray } from 'react-hook-form';
import { useAppDispatch, useIgnoreFirstRenderEffect } from '@hooks';
import { addSnack, selectDrawerPayload, selectHasTodayEncounter } from '@store/slices';
import { useEffect, useState } from 'react';

type AddMedicationFormViewProps = {
  control: Control<MedicationForm>;
  setValue: UseFormSetValue<MedicationForm>;
  watch: UseFormWatch<MedicationForm>;
  register: UseFormRegister<MedicationForm>;
  trigger: UseFormTrigger<MedicationForm>;
  doctorSpecialities: [];
  isExternalDoctor: boolean;
};

export const AddMedicationFormView = ({
  control,
  watch,
  trigger,
  doctorSpecialities,
  isExternalDoctor,
  register,
  setValue,
}: AddMedicationFormViewProps) => {
  const dispatch = useAppDispatch();
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('medications');
  const { t: tFrequency } = useTranslation(Dictionaries.MedicationFrequencyAll);
  const place = watch('place');
  const frequency = watch('frequencyDialysisRelated');
  const { id } = selectDrawerPayload(DrawerType.Medication);
  const [frequencyOptions, setFrequencyOptions] = useState<MedicationFrequencyAutocompleteFreeSoloValue[]>([]);

  const { append, fields } = useFieldArray({
    control,
    name: 'amounts' as any,
  });

  useEffect(() => {
    if (place === MedicationPlaces.InCenter && !frequencyOptions.length) {
      API.get(`pm/patients/${id}/medication-requests/frequency`)
        .then(({ data }) => {
          setFrequencyOptions(
            data.length
              ? data
                  .filter((item) => item !== MedicationFrequency.OTHER)
                  .map((item) => ({ value: item, label: tFrequency(item) }))
              : [{ label: t('form.noActiveHDPrescription'), value: t('form.noActiveHDPrescription'), disabled: true }],
          );
        })
        .catch(() => dispatch(addSnack({ type: SnackType.Error, message: tCommon('systemError') })));
    }
  }, [place]);

  useIgnoreFirstRenderEffect(() => {
    setValue('nameDrug', null);
  }, [place]);

  useIgnoreFirstRenderEffect(() => {
    if (place === MedicationPlaces.AtHome) {
      setValue('amounts', []);
    } else {
      switch (true) {
        case MedicationFrequency.EVERY_DIALYSIS === frequency:
        case MedicationFrequency.ONCE_PER_MONTH === frequency:
        case MedicationFrequency.ONCE_PER_WEEK === frequency:
        case MedicationFrequency.ONCE_PER_2WEEKS === frequency:
        case MedicationFrequency.ONCE_PER_10DAYS === frequency:
          setValue('amounts', []);
          append(1);
          break;
        case MedicationFrequency.TWICE_PER_WEEK === frequency:
          setValue('amounts', []);
          append([1, 1]);
          break;
        case MedicationFrequency.THREE_TIMES_PER_WEEK === frequency:
          setValue('amounts', []);
          append([1, 1, 1]);
          break;
      }
    }
  }, [place, frequency]);

  const durationType = watch('durationType');
  const startDate = watch('startDate');
  const hasTodayEncounter = selectHasTodayEncounter();

  return (
    <Stack spacing={2} direction="column">
      <FormInputRadio
        control={control}
        options={[
          { label: t('form.places.AT_HOME'), value: MedicationPlaces.AtHome },
          { label: t('form.places.IN_CENTER'), value: MedicationPlaces.InCenter },
        ]}
        name="place"
      />
      {place === MedicationPlaces.AtHome && (
        <FormAutocompleteFreeSoloAsync
          control={control}
          name="nameDrug"
          label={t('form.nameDrug')}
          required
          trigger={trigger}
          getOptionsUrl={`/pm/medications?isDialysis=false&isLongTerm=true&name=`}
          optionsTransform={(options) =>
            options.map((option) => ({ uid: option.uid, label: option.name, description: option.description }))
          }
          rules={{
            required: validatorAutocompleteRequired(),
            pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharactersWithPercentage()),
            minLength: validatorAutocompleteMinLength(2, 200, 'label'),
            maxLength: validatorAutocompleteMaxLength(2, 200, 'label'),
          }}
        />
      )}
      {place === MedicationPlaces.InCenter && (
        <FormAutocompleteAsync
          control={control}
          name="nameDrug"
          label={t('form.nameDrug')}
          required
          getOptionsUrl={`/pm/medications?isDialysis=true&isLongTerm=false&name=`}
          optionsTransform={(options) =>
            options.map((option) => ({ uid: option.uid, label: option.name, description: option.description }))
          }
          rules={{
            required: validatorAutocompleteRequired(),
          }}
        />
      )}
      <FormAutocompleteFreeSolo
        control={control}
        name="medicationGroup"
        label={t('form.medicationGroup')}
        options={getOptionListFromCatalog(Dictionaries.MedicationGroup)}
        rules={{
          minLength: validatorAutocompleteMinLength(0, 50),
          maxLength: validatorAutocompleteMaxLength(0, 50),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      <FormAutocompleteFreeSolo
        control={control}
        name="route"
        required
        label={t('form.route')}
        options={getOptionListFromCatalog(Dictionaries.Route)}
        rules={{
          required: validatorAutocompleteRequired(),
          minLength: validatorAutocompleteMinLength(0, 50),
          maxLength: validatorAutocompleteMaxLength(0, 50),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      {place === MedicationPlaces.AtHome && (
        <FormInputText
          control={control}
          name="amount"
          required
          label={t('form.amount')}
          transform={transformEventCommaToDot}
          rules={{
            required: validatorRequired(),
            minLength: validatorMinLength(1, 50),
            maxLength: validatorMaxLength(1, 50),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      )}
      {place === MedicationPlaces.AtHome && (
        <FormAutocompleteFreeSolo
          control={control}
          name="frequencyLongTerm"
          required
          label={t('form.frequency')}
          options={getOptionListFromCatalog(Dictionaries.MedicationFrequencyAtHome)}
          rules={{
            required: validatorAutocompleteRequired(),
            minLength: validatorAutocompleteMinLength(2, 200),
            maxLength: validatorAutocompleteMaxLength(2, 200),
            pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
          }}
        />
      )}
      {place === MedicationPlaces.InCenter && (
        <FormInputSelect
          control={control}
          options={frequencyOptions}
          label={t('form.frequency')}
          name="frequencyDialysisRelated"
          required
          rules={{
            required: validatorRequired(),
          }}
        />
      )}
      {place === MedicationPlaces.AtHome && (
        <FormInputSelect
          clearable
          options={getOptionListFromCatalog(Dictionaries.DialysisDay)}
          control={control}
          name="day"
          label={t('form.day')}
        />
      )}
      {place === MedicationPlaces.InCenter &&
        fields.map((field, index, array) => (
          <FormNumberInput
            key={field.id}
            label={array.length === 1 ? t('form.amount') : t('form.dialysisAmount', { amount: index + 1 })}
            {...register(`amounts.${index}`, {
              valueAsNumber: true,
            })}
            required
            minValue={1}
            maxValue={10}
            rules={{
              max: { value: 10, message: tCommon('validation.maxNumber', { min: 1, max: 10 }) },
              min: { value: 1, message: tCommon('validation.zeroNotAvailable', { min: 1, max: 10 }) },
            }}
            control={control}
            sx={{ maxWidth: (theme) => theme.spacing(array.length === 1 ? 24 : 30.5) }}
          />
        ))}
      {place === MedicationPlaces.InCenter && (
        <FormInputText
          control={control}
          name="day"
          label={t('form.day')}
          isDisabled={place === MedicationPlaces.InCenter}
        />
      )}
      <FormAutocompleteFreeSolo
        control={control}
        name="meal"
        label={t('form.meal')}
        options={getOptionListFromCatalog(Dictionaries.Meal)}
        rules={{
          minLength: validatorAutocompleteMinLength(0, 100),
          maxLength: validatorAutocompleteMaxLength(0, 100),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      <FormDatePicker
        control={control}
        name="prescriptionDate"
        label={t('form.prescriptionDate')}
        required
        maxDate={getTenantEndCurrentDay()}
        rules={{
          required: validatorRequired(),
          validate: {
            isValid: validatorIsValidDate,
            isLater: validatorTimeNotLaterThanNotEqual(
              getTenantEndCurrentDay(),
              tCommon('validation.enteredDateShouldNotBeLater'),
            ),
            isEarlier: validatorTimeNotEarlierThanNotEqual(
              subYears(getTenantStartCurrentDay(), 1),
              tCommon('validation.enteredDateShouldNotBeEarlyThan', {
                date: dateToServerFormat(subYears(getTenantStartCurrentDay(), 1)),
              }),
            ),
          },
        }}
      />
      {place === MedicationPlaces.InCenter && (
        <>
          <Divider />
          <Typography
            data-testid="durationOfMedicationSectionTitle"
            variant="labelMCaps"
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            {t('durationOfMedication')}
          </Typography>
          <FormInputRadio
            control={control}
            options={[
              {
                label: t(`form.durationType.${MedicationDurationTypes.Unlimited}`),
                value: MedicationDurationTypes.Unlimited,
              },
              {
                label: t(`form.durationType.${MedicationDurationTypes.VisitsAmount}`),
                value: MedicationDurationTypes.VisitsAmount,
              },
              {
                label: t(`form.durationType.${MedicationDurationTypes.DueDate}`),
                value: MedicationDurationTypes.DueDate,
              },
            ]}
            name="durationType"
          />
          <FormDatePicker
            control={control}
            name="startDate"
            label={t('form.startDate')}
            required
            minDate={getTenantStartCurrentDay()}
            rules={{
              required: validatorRequired(),
              validate: {
                isValid: validatorIsValidDate,
                isPast: validatorPastDate,
                hasTodayEncounter: validatorHasTodayEncounter(hasTodayEncounter),
              },
            }}
          />
          {durationType === MedicationDurationTypes.VisitsAmount && (
            <FormInputText
              control={control}
              required
              name="visitsAmount"
              label={t('form.visitsAmount')}
              rules={{
                required: validatorRequired(),
                validate: {
                  onlyNumbers: validatorIsValidNumber,
                },
                minLength: validatorMinLength(1, 5),
                maxLength: validatorMaxLength(1, 5),
              }}
            />
          )}
          {durationType === MedicationDurationTypes.DueDate && (
            <FormDatePicker
              control={control}
              name="dueDate"
              label={t('form.dueDate')}
              required
              minDate={getTenantStartCurrentDay()}
              rules={{
                required: validatorRequired(),
                validate: {
                  isValid: validatorIsValidDate,
                  isPast: validatorPastDate,
                  isFromGivenDate: (value) => validatorNotEarlierThan(new Date(startDate as string))(value),
                },
              }}
            />
          )}
        </>
      )}
      <Divider />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('prescribedBy')}
      </Typography>
      <FormAutocompleteFreeSoloAsync
        capitalizedLabel
        name="doctorsName"
        trigger={trigger}
        control={control}
        label={t('form.doctorsName')}
        textType={InputTextType.Capitalize}
        getOptionsUrl="/pm/doctors?name="
        optionsTransform={(doctors) => [
          ...doctors
            .reduce((map, doctor) => {
              if (doctor.deleted) return map;
              map.set(doctor.id || doctor.userId, {
                label: doctor.name,
                value: undefined,
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
          options={doctorSpecialities}
          control={control}
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
      <Divider />
      <FormInputText
        control={control}
        name="comments"
        label={t('form.comments')}
        multiline
        rules={{
          maxLength: validatorMaxLength(0, 500),
          pattern: validatorLatinLettersNumberCharacters(),
        }}
      />
    </Stack>
  );
};
