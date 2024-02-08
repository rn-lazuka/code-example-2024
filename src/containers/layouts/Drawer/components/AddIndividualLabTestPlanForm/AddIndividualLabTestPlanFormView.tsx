import type { CreateIndividualLabTestPlanFormRaw } from '@types';
import type { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form/dist/types/form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import {
  FormAutocomplete,
  FormAutocompleteAsync,
  FormDatePicker,
  FormInputCheckbox,
  FormInputSelect,
  NoticeBlock,
} from '@components';
import {
  validatorAutocompletePattern,
  validatorAutocompleteRequired,
  validatorIsValidDate,
  validatorLatinLettersNumberCharacters,
  validatorPastDate,
  validatorRequired,
  validatorSequenceDates,
} from '@validators';
import { useLaboratoryOptionsList, useProceduresOptionsList } from '@hooks';
import { Dictionaries, getOption, getOptionListFromCatalog, getTenantStartCurrentDay } from '@utils';
import { DrawerType, LabOrderEventPlace, LabOrderStatus, NoticeBlockType } from '@enums';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useFieldArray } from 'react-hook-form';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { DeleteIcon } from '@assets/icons';
import { selectDrawerPayload } from '@store/slices';

type AddIndividualLabTestPlanFormViewProps = {
  control: Control<CreateIndividualLabTestPlanFormRaw>;
  watch: UseFormWatch<CreateIndividualLabTestPlanFormRaw>;
  setValue: UseFormSetValue<CreateIndividualLabTestPlanFormRaw>;
  register: UseFormRegister<CreateIndividualLabTestPlanFormRaw>;
  isDirty?: boolean;
};

export const AddIndividualLabTestPlanFormView = ({
  control,
  watch,
  setValue,
  register,
  isDirty,
}: AddIndividualLabTestPlanFormViewProps) => {
  const { t } = useTranslation('labOrders');
  const { procedureOptions } = useProceduresOptionsList();
  const { laboratoriesOptions, getLaboratoryOptions } = useLaboratoryOptionsList();
  const { place, isEditing } = selectDrawerPayload(DrawerType.IndividualLabTestPlanForm);

  const {
    fields: planeDateFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'planeDates',
  });

  const procedure = watch('procedure');
  const laboratory = watch('laboratory');
  const dialysisDays = watch('dialysisDay');
  const watchFieldArray = watch('planeDates');
  const isHasOrderNotToPerformStatus = watchFieldArray?.some(({ status }) => status !== LabOrderStatus.TO_PERFORM);

  const resetLaboratories = () => {
    getLaboratoryOptions();
    if (isEditing && !isDirty) return;
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
    if (isEditing && !isDirty) return;
    const defaultLaboratory = laboratoriesOptions.find((laboratory) => laboratory.isDefault);
    if (defaultLaboratory) {
      setValue('laboratory', getOption(defaultLaboratory.label, `${defaultLaboratory.value}`));
    }
  }, [laboratoriesOptions]);

  return (
    <Stack direction="column" spacing={2}>
      <FormAutocompleteAsync
        required
        fullWidth
        isDisabled={place === LabOrderEventPlace.LabResults || isHasOrderNotToPerformStatus}
        name="patient"
        control={control}
        label={t('forms.individualLabTestPlan.patient')}
        getOptionsUrl="/pm/patients/search/custom?fields=name,id&name="
        optionsTransform={(options) => options.map((option) => ({ value: option.id, label: option.name }))}
        rules={{
          required: validatorAutocompleteRequired(),
        }}
      />
      <FormAutocomplete
        required
        control={control}
        name="procedure"
        label={t('forms.creation.procedure')}
        options={procedureOptions}
        isDisabled={!procedureOptions.length || isHasOrderNotToPerformStatus}
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
        label={t('forms.creation.labName')}
        options={laboratoriesOptions}
        isDisabled={!procedure?.value || !laboratoriesOptions.length || isHasOrderNotToPerformStatus}
        rules={{
          required: validatorAutocompleteRequired(),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      <FormInputSelect
        required
        control={control}
        name="specimenType"
        label={t('forms.creation.specimenType')}
        options={getOptionListFromCatalog(Dictionaries.LabOrdersSpecimenTypes)}
        isDisabled={isHasOrderNotToPerformStatus}
        rules={{
          required: validatorRequired(),
        }}
      />
      <Divider sx={{ mx: ({ spacing }) => `${spacing(-2)} !important` }} />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('forms.individualLabTestPlan.selectDate')}
      </Typography>
      <FormInputCheckbox
        control={control}
        name="dialysisDay"
        label={t('forms.individualLabTestPlan.dialysisDaysOnly')}
        isDisabled={isHasOrderNotToPerformStatus}
      />
      {dialysisDays && (
        <NoticeBlock text={t('forms.individualLabTestPlan.actualDatesMayDiffer')} type={NoticeBlockType.Warning} />
      )}
      {planeDateFields.map((field, index) => (
        <Stack key={field.id} direction="row" spacing={2}>
          <FormDatePicker
            {...register(`planeDates.${index}.date` as const)}
            required
            fullWidth
            control={control}
            {...(field.status === LabOrderStatus.TO_PERFORM ? { minDate: getTenantStartCurrentDay() } : {})}
            label={t('forms.individualLabTestPlan.planeDate')}
            isDisabled={field.status !== LabOrderStatus.TO_PERFORM}
            rules={{
              required: validatorRequired(),
              validate: {
                isValid: validatorIsValidDate,
                ...(field.status === LabOrderStatus.TO_PERFORM ? { isPast: validatorPastDate } : {}),
                sequenceDates: validatorSequenceDates(
                  watchFieldArray && watchFieldArray[index - 1] ? watchFieldArray[index - 1].date : null,
                  index,
                  t('forms.individualLabTestPlan.shouldNotBeEarlier'),
                ),
              },
            }}
          />
          {index > 0 && field.status === LabOrderStatus.TO_PERFORM && (
            <IconButton onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      ))}
      <Button
        onClick={() => append({ date: null, status: LabOrderStatus.TO_PERFORM })}
        variant="outlined"
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('forms.individualLabTestPlan.addDate')}
      </Button>
    </Stack>
  );
};
