import type { Control, UseFormTrigger, UseFormWatch } from 'react-hook-form/dist/types/form';
import React, { PropsWithChildren } from 'react';
import { addYears, format, isValid, startOfDay, subYears } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { FormDatePicker, FormInputSelect, FormInputText, NoticeBlock } from '@components';
import {
  validatorIsValidDate,
  validatorLatinLettersNumberCharacters,
  validatorLatinLettersNumbersSpecialCharactersComma,
  validatorMaxDate,
  validatorMaxLength,
  validatorMinDate,
  validatorMinLength,
  validatorNumberInt,
  validatorRequired,
} from '@validators';
import { Dictionaries, getOptionListFromCatalog, getTenantEndCurrentDay, getTenantStartCurrentDay } from '@utils';
import { NoticeBlockType } from '@enums';
import type { DialysisMachineForm, IsolationGroup } from '@types';
import { useIgnoreFirstRenderEffect } from '@hooks';

type AddDialysisMachineFormViewProps = {
  control: Control<DialysisMachineForm>;
  watch: UseFormWatch<DialysisMachineForm>;
  trigger: UseFormTrigger<DialysisMachineForm>;
  isDirty: boolean;
  isolationGroupOptions: { label: string; value: string }[];
  isolationGroups: IsolationGroup[];
  locationOptions: { label: string; value: number }[];
  dataIsLoading: boolean;
};

export const AddDialysisMachineFormView = ({
  control,
  watch,
  trigger,
  isDirty,
  locationOptions,
  isolationGroups,
  isolationGroupOptions,
  dataIsLoading,
}: AddDialysisMachineFormViewProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('dialysisMachines');

  const maintenanceFrom = watch('maintenanceFrom');
  const maintenanceTo = watch('maintenanceTo');
  const warrantyFrom = watch('warrantyFrom');
  const warrantyTo = watch('warrantyTo');
  const isolationGroupId = watch('isolationGroupId');

  const selectedIsGroup = isolationGroups.find((group) => group.id === isolationGroupId);

  const isSelectedIsolationGroupHasIsolations = selectedIsGroup && selectedIsGroup.isolations.length > 0;

  const showIsolationGroupWarnMessage =
    isDirty && isolationGroupId && Number(isolationGroupId) && isSelectedIsolationGroupHasIsolations;
  const maintenanceFromDate = isValid(maintenanceFrom) ? new Date(maintenanceFrom) : getTenantStartCurrentDay();
  const maintenanceToDate = isValid(maintenanceTo) ? new Date(maintenanceTo) : getTenantStartCurrentDay();
  const warrantyFromDate = isValid(warrantyFrom) ? new Date(warrantyFrom) : getTenantStartCurrentDay();
  const warrantyToDate = isValid(warrantyTo) ? new Date(warrantyTo) : getTenantStartCurrentDay();

  useIgnoreFirstRenderEffect(() => {
    if (isDirty) {
      trigger('maintenanceFrom');
      trigger('maintenanceTo');
    }
  }, [maintenanceFrom, maintenanceTo]);

  useIgnoreFirstRenderEffect(() => {
    if (isDirty) {
      trigger('warrantyFrom');
      trigger('warrantyTo');
    }
  }, [warrantyFrom, warrantyTo]);

  return (
    <Stack direction="column" spacing={2}>
      <Column title={t('form.generalInformation')}>
        <FormInputText
          required
          name="name"
          label={t('form.fields.equipmentName')}
          control={control}
          rules={{
            required: validatorRequired(),
            pattern: validatorLatinLettersNumbersSpecialCharactersComma(),
            minLength: validatorMinLength(1, 50),
            maxLength: validatorMaxLength(1, 50),
          }}
        />
        <FormInputText
          required
          name="serialNumber"
          label={t('form.fields.serialNumber')}
          control={control}
          rules={{
            required: validatorRequired(),
            pattern: validatorLatinLettersNumbersSpecialCharactersComma(),
            minLength: validatorMinLength(1, 50),
            maxLength: validatorMaxLength(1, 50),
          }}
        />
        <FormInputText
          required
          name="model"
          label={t('form.fields.model')}
          control={control}
          rules={{
            required: validatorRequired(),
            pattern: validatorLatinLettersNumbersSpecialCharactersComma(),
            minLength: validatorMinLength(1, 50),
            maxLength: validatorMaxLength(1, 50),
          }}
        />
        <FormInputText
          required
          name="brand"
          label={t('form.fields.brand')}
          control={control}
          rules={{
            required: validatorRequired(),
            pattern: validatorLatinLettersNumbersSpecialCharactersComma(),
            minLength: validatorMinLength(1, 50),
            maxLength: validatorMaxLength(1, 50),
          }}
        />
        <FormInputSelect
          name="communicationType"
          label={t('form.fields.communicationType')}
          control={control}
          options={getOptionListFromCatalog(Dictionaries.DialysisMachineCommunicationTypes)}
          required
          rules={{
            required: validatorRequired(),
          }}
        />
        <FormInputText
          required
          name="slotCount"
          label={t('form.fields.slots')}
          control={control}
          inputProps={{ inputMode: 'numeric' }}
          rules={{
            required: validatorRequired(),
            pattern: validatorNumberInt(),
            minLength: validatorMinLength(1, 2),
            maxLength: validatorMaxLength(1, 2),
          }}
        />
        <FormInputText
          required
          name="description"
          label={t('form.fields.equipmentDescription')}
          control={control}
          rules={{
            required: validatorRequired(),
            pattern: validatorLatinLettersNumbersSpecialCharactersComma(),
            minLength: validatorMinLength(1, 50),
            maxLength: validatorMaxLength(1, 50),
          }}
        />
      </Column>
      <Divider />
      <Column title={t('form.condition')}>
        <FormInputSelect
          name="status"
          label={t('form.fields.status')}
          control={control}
          options={getOptionListFromCatalog(Dictionaries.DialysisMachineStatuses)}
          required
          rules={{
            required: validatorRequired(),
          }}
        />
        <FormDatePicker
          required
          name="commissionedDate"
          label={t('form.fields.commissionedDate')}
          control={control}
          maxDate={addYears(getTenantStartCurrentDay(), 1)}
          minDate={subYears(getTenantStartCurrentDay(), 1)}
          rules={{
            required: validatorRequired(),
            validate: {
              isValid: validatorIsValidDate,
              minDate: validatorMinDate(
                subYears(getTenantStartCurrentDay(), 1),
                tCommon(`validation.enteredDateShouldNotBeEarlierThanYearsFromCurrentDate`, { years: 1 }),
              ),
              maxDate: validatorMaxDate(
                addYears(getTenantEndCurrentDay(), 1),
                undefined,
                tCommon(`validation.enteredDateShouldNotBeLaterThanYearsFromCurrentDate`, { years: 1 }),
              ),
            },
          }}
        />
        <FormInputSelect
          name="isolationGroupId"
          label={t('form.fields.infectionStatus')}
          control={control}
          options={isolationGroupOptions}
          required
          rules={{
            required: validatorRequired(),
          }}
        />
        {showIsolationGroupWarnMessage ? (
          <InfectionStatusWarnMessage message={t('form.onceTheDmIsSavedInTheInfectiousStatus')} />
        ) : null}
        <FormInputSelect
          name="locationId"
          label={t('form.fields.connectedBay')}
          control={control}
          options={locationOptions}
          isDisabled={!locationOptions.length || dataIsLoading}
        />
      </Column>
      <Divider />
      <Column title={t('form.maintenanceDateRange')}>
        <FormDatePicker
          name="maintenanceFrom"
          label={t('form.fields.from')}
          control={control}
          rules={{
            validate: {
              isValid: validatorIsValidDate,
              maxDate: validatorMaxDate(
                startOfDay(maintenanceToDate),
                undefined,
                tCommon('validation.enteredDateShouldNotBeLaterThan', {
                  date: format(maintenanceToDate, 'yyyy-MM-dd'),
                }),
              ),
            },
          }}
        />
        <FormDatePicker
          name="maintenanceTo"
          label={t('form.fields.to')}
          control={control}
          rules={{
            validate: {
              isValid: validatorIsValidDate,
              minDate: validatorMinDate(
                startOfDay(maintenanceFromDate),
                tCommon('validation.enteredDateShouldNotBeEarlyThan', {
                  date: format(maintenanceFromDate, 'yyyy-MM-dd'),
                }),
              ),
            },
          }}
        />
      </Column>
      <Divider />
      <Column title={t('form.warrantyDateRange')}>
        <FormDatePicker
          name="warrantyFrom"
          label={t('form.fields.from')}
          control={control}
          rules={{
            validate: {
              isValid: validatorIsValidDate,
              maxDate: validatorMaxDate(
                startOfDay(warrantyToDate),
                undefined,
                tCommon('validation.enteredDateShouldNotBeLaterThan', {
                  date: format(warrantyToDate, 'yyyy-MM-dd'),
                }),
              ),
            },
          }}
        />
        <FormDatePicker
          name="warrantyTo"
          label={t('form.fields.to')}
          control={control}
          rules={{
            validate: {
              isValid: validatorIsValidDate,
              minDate: validatorMinDate(
                startOfDay(warrantyFromDate),
                tCommon('validation.enteredDateShouldNotBeEarlyThan', {
                  date: format(warrantyFromDate, 'yyyy-MM-dd'),
                }),
              ),
            },
          }}
        />
      </Column>
      <Divider />
      <Column title={t('form.comments')}>
        <FormInputText
          multiline
          name="comment"
          label={t('form.fields.comments')}
          control={control}
          rules={{
            minLength: validatorMinLength(2, 500),
            maxLength: validatorMaxLength(2, 500),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      </Column>
    </Stack>
  );
};

const InfectionStatusWarnMessage = ({ message }: { message: string }) => {
  return <NoticeBlock text={message} type={NoticeBlockType.Warning} />;
};

const Column = ({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) => {
  return (
    <Stack spacing={2}>
      <Typography
        variant="labelM"
        sx={{ mb: 0, color: ({ palette }) => palette.text.secondary, textTransform: 'uppercase' }}
      >
        {title}
      </Typography>
      {children}
    </Stack>
  );
};
