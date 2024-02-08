import { FormAutocomplete, FormAutocompleteAsync, FormDatePicker, FormInputSelect } from '@components/FormComponents';
import { useEffect } from 'react';
import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form/dist/types/form';
import type { AddHocEventFormType } from '@types';
import { useTranslation } from 'react-i18next';
import { useLaboratoryOptionsList, useProceduresOptionsList } from '@hooks';
import {
  getOption,
  Dictionaries,
  getOptionListFromCatalog,
  noDeadPatientsFilter,
  combineFilters,
  noDischargedPatientsFilter,
} from '@utils';
import {
  validatorAutocompletePattern,
  validatorAutocompleteRequired,
  validatorLatinLettersNumberCharacters,
  validatorIsValidDate,
  validatorPastDate,
  validatorRequired,
} from '@validators';

type AddHocLabTestServiceFormProps = {
  control: Control<AddHocEventFormType>;
  setValue: UseFormSetValue<AddHocEventFormType>;
  watch: UseFormWatch<AddHocEventFormType>;
};

export const AddHocLabTestServiceForm = ({ control, setValue, watch }: AddHocLabTestServiceFormProps) => {
  const { procedureOptions } = useProceduresOptionsList();
  const { laboratoriesOptions, getLaboratoryOptions } = useLaboratoryOptionsList();

  const { t: tLabs } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('schedule');

  const procedure = watch('procedure');
  const laboratory = watch('laboratory');

  const resetLaboratories = () => {
    getLaboratoryOptions();
    setValue('laboratory', getOption('', ''));
  };

  useEffect(() => {
    if (procedure?.value) {
      if (laboratory) resetLaboratories();
      getLaboratoryOptions(Number(procedure.value));
    } else {
      resetLaboratories();
    }
  }, [procedure]);

  useEffect(() => {
    const defaultLaboratory = laboratoriesOptions.find((laboratory) => laboratory.isDefault);
    if (defaultLaboratory) {
      setValue('laboratory', getOption(defaultLaboratory.label, `${defaultLaboratory.value}`));
    }
  }, [laboratoriesOptions]);

  return (
    <>
      <FormAutocompleteAsync
        required
        fullWidth
        name="labTestPatient"
        control={control}
        label={t('addHocEventForm.patientName')}
        getOptionsUrl={`/pm/patients/search/custom?fields=name,id&name=`}
        optionsTransform={(options) =>
          options
            .filter(combineFilters(noDischargedPatientsFilter, noDeadPatientsFilter))
            .map(({ id, name }) => ({ value: id, label: name }))
        }
        rules={{
          required: validatorAutocompleteRequired(),
        }}
      />
      <FormAutocomplete
        required
        control={control}
        name="procedure"
        label={tLabs('forms.creation.procedure')}
        options={procedureOptions}
        isDisabled={!procedureOptions.length}
        groupBy={(option) => option.group || ''}
        rules={{
          required: validatorAutocompleteRequired(),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      <FormAutocomplete
        required
        name="laboratory"
        control={control}
        label={t('addHocEventForm.labName')}
        options={laboratoriesOptions}
        isDisabled={!procedure?.value || !laboratoriesOptions.length}
        rules={{
          required: validatorAutocompleteRequired(),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      <FormInputSelect
        required
        control={control}
        name="specimenType"
        label={tLabs('forms.creation.specimenType')}
        options={getOptionListFromCatalog(Dictionaries.LabOrdersSpecimenTypes)}
        rules={{
          required: validatorRequired(),
        }}
      />
      <FormDatePicker
        control={control}
        name="date"
        label={t('addHocEventForm.date')}
        fullWidth
        required
        isDisabled={true}
        rules={{
          required: { value: true, message: tCommon('validation.required') },
          validate: {
            isValid: validatorIsValidDate,
            isPast: validatorPastDate,
          },
        }}
      />
    </>
  );
};
