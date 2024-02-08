import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { VaccinationMedicationAdministeringForm } from '@types';
import { Control, UseFormSetValue } from 'react-hook-form/dist/types/form';
import { FormAutocomplete, FormInputRadio, FormInputText, FormTimePicker } from '@components/FormComponents';
import {
  validatorAutocompleteRequired,
  validatorFutureTime,
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorRequired,
} from '@validators';
import { useGetNursesOptions } from '@hooks/useGetNursesOptions';
import { capitalizeFirstLetter, getTenantDate } from '@src/utils';
import {
  VaccinationMedicationAdministeringStatus,
  VaccinationMedicationModalType,
  VaccineMedicationOmittingStatus,
} from '@enums/global';
import { useMemo } from 'react';

interface VaccineMedicationAdministeringFormProps {
  control: Control<VaccinationMedicationAdministeringForm>;
  setValue: UseFormSetValue<VaccinationMedicationAdministeringForm>;
  status: VaccinationMedicationAdministeringStatus;
  isMedication: boolean;
  mode?: VaccinationMedicationModalType;
}

const VaccineMedicationAdministeringForm = ({
  control,
  status,
  setValue,
  isMedication,
  mode,
}: VaccineMedicationAdministeringFormProps) => {
  const { t: tVaccination } = useTranslation('vaccination');
  const { t: tMedication } = useTranslation('medications');
  const { nursesOptions } = useGetNursesOptions(setValue, true);
  const statusOptions = useMemo(
    () => [
      {
        label: capitalizeFirstLetter(
          isMedication
            ? tMedication('form.rescheduledToNextHDSession')
            : tVaccination('form.rescheduledToNextHDSession'),
        ),
        value: VaccineMedicationOmittingStatus.Rescheduled,
      },
      {
        label: capitalizeFirstLetter(
          isMedication ? tMedication('form.omitCurrentInjection') : tVaccination('form.omitPermanently'),
        ),
        value: VaccineMedicationOmittingStatus.Omitted,
      },
    ],
    [],
  );

  return (
    <>
      {status === VaccinationMedicationAdministeringStatus.Omit && (
        <FormInputRadio
          control={control}
          name="status"
          options={statusOptions}
          isDisabled={mode === VaccinationMedicationModalType.Editing}
        />
      )}
      {status !== VaccinationMedicationAdministeringStatus.Omit && (
        <Stack direction="row" spacing={2}>
          <FormAutocomplete
            required
            popupIcon={false}
            fullWidth
            name="administeredBy"
            control={control}
            options={nursesOptions}
            label={tVaccination('form.administeredBy')}
            isDisabled={!nursesOptions.length}
            rules={{
              required: validatorAutocompleteRequired(),
            }}
          />
          <FormTimePicker
            ampm
            control={control}
            name="administeredTime"
            label={tVaccination('form.administeredTime')}
            maxTime={getTenantDate()}
            required
            rules={{
              required: validatorRequired(),
              validate: {
                maxDate: validatorFutureTime(),
              },
            }}
          />
        </Stack>
      )}
      <FormInputText
        required={status === VaccinationMedicationAdministeringStatus.Omit}
        control={control}
        name="comments"
        label={tVaccination('form.comments')}
        multiline
        rules={{
          required: status === VaccinationMedicationAdministeringStatus.Omit ? validatorRequired() : undefined,
          minLength: validatorMinLength(2, 500),
          maxLength: validatorMaxLength(2, 500),
          pattern: validatorLatinLettersNumberCharacters(),
        }}
      />
    </>
  );
};

export default VaccineMedicationAdministeringForm;
