import { Control } from 'react-hook-form/dist/types/form';
import { ClinicalNoteForm } from '@types';
import Stack from '@mui/material/Stack';
import { FormInputSelect, FormInputText } from '@components';
import { useTranslation } from 'react-i18next';
import {
  validatorMinLength,
  validatorMaxLength,
  validatorRequired,
  validatorLatinLettersNumberCharactersWithPercentage,
} from '@validators';
import { selectAvailableClinicalNoteTypes } from '@store';

type AddClinicalNoteFormViewProps = {
  control: Control<ClinicalNoteForm>;
};

export const AddClinicalNoteFormView = ({ control }: AddClinicalNoteFormViewProps) => {
  const { t } = useTranslation('clinicalNotes');
  const clinicalNoteTypeOptions = selectAvailableClinicalNoteTypes();

  return (
    <Stack direction="column" spacing={2}>
      <FormInputSelect
        control={control}
        options={clinicalNoteTypeOptions}
        label={t('form.noteType')}
        name="type"
        required
        rules={{
          required: validatorRequired(),
        }}
      />
      <FormInputText
        control={control}
        required
        name="note"
        label={t('form.note')}
        multiline
        minRows={3}
        rules={{
          required: validatorRequired(),
          pattern: validatorLatinLettersNumberCharactersWithPercentage(),
          minLength: validatorMinLength(2, 500),
          maxLength: validatorMaxLength(2, 500),
        }}
      />
    </Stack>
  );
};
