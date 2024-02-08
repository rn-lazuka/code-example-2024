import type { Control, UseFormTrigger, UseFormWatch } from 'react-hook-form/dist/types/form';
import type { HdSchedulingForm } from '@types';
import type { UseFieldArrayRemove, UseFormSetValue } from 'react-hook-form';
import { DeleteIcon } from '@assets/icons';
import { useEffect, useMemo } from 'react';
import { Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import { FormDatePicker, FormInputSelect, FormTimeDurationPicker } from '@components/FormComponents';
import { addMonths, format, isValid, startOfDay } from 'date-fns';
import { EIGHT_HOUR, ONE_HOUR } from '@constants';
import { useTranslation } from 'react-i18next';
import { getTenantStartCurrentDay } from '@utils/getTenantDate';
import {
  validatorHasTodayEncounter,
  validatorIsValidDate,
  validatorNoShiftsAvailable,
  validatorPastDate,
  validatorRequired,
  validatorSameDates,
  validatorSequenceDates,
  validatorTimeDurationIsInRange,
  validatorTimeNotLaterThan,
} from '@validators';
import { selectHasTodayEncounter } from '@store/slices';
import isEmpty from 'lodash/isEmpty';

type DateShiftsProps = {
  index: number;
  control: Control<HdSchedulingForm>;
  watch: UseFormWatch<HdSchedulingForm>;
  trigger: UseFormTrigger<HdSchedulingForm>;
  remove: UseFieldArrayRemove;
  setValue: UseFormSetValue<HdSchedulingForm>;
  availability: { [key: string]: { value: string; label: string }[] };
};
export const DateShifts = ({ index, watch, control, trigger, remove, setValue, availability }: DateShiftsProps) => {
  const { t } = useTranslation('hdPrescription');
  const selectedDate = watch(`dateShifts.${index}.date`, null);
  const selectedShiftId = watch(`dateShifts.${index}.shiftId`, '');
  const watchFieldArray = watch('dateShifts');
  const hasTodayEncounter = selectHasTodayEncounter();

  const shiftOptions = useMemo(() => {
    if (selectedDate && !isEmpty(availability)) {
      const key = isValid(selectedDate) && format(selectedDate, 'yyyy-MM-dd');
      return (key && availability[key]) || [];
    }
    return [];
  }, [availability, selectedDate]);

  const availableDays = useMemo(() => {
    if (!isEmpty(availability)) {
      return Object.keys(availability).filter((key) => availability[key].length);
    }
    return [];
  }, [availability]);

  useEffect(() => {
    if (selectedDate && !isEmpty(availability)) {
      const isExist = shiftOptions.find((shift) => shift.value === selectedShiftId);
      if (!isExist) {
        setValue(`dateShifts.${index}.shiftId`, '');
      }
      trigger('dateShifts');
    }
  }, [selectedDate]);

  return (
    <Stack spacing={2} direction="column">
      {index > 0 && <Divider />}
      <Stack spacing={2} direction="row">
        <Stack spacing={2} direction="column" sx={{ width: 1 }}>
          <FormDatePicker
            control={control}
            name={`dateShifts.${index}.date`}
            label={`${t('form.day')} ${index + 1}`}
            required
            shouldDisableDate={(day) => !availableDays.includes(format(day, 'yyyy-MM-dd'))}
            minDate={getTenantStartCurrentDay()}
            rules={{
              required: validatorRequired(),
              validate: {
                isValid: validatorIsValidDate,
                maxDate: validatorTimeNotLaterThan(startOfDay(addMonths(new Date(), 3))),
                isPast: validatorPastDate,
                sequenceDates: validatorSequenceDates(
                  watchFieldArray && watchFieldArray[index - 1] ? watchFieldArray[index - 1].date : null,
                  index,
                ),
                isSameDate: validatorSameDates(watchFieldArray ?? null, index),
                isNoShifts: validatorNoShiftsAvailable(availableDays),
                hasTodayEncounter: validatorHasTodayEncounter(hasTodayEncounter),
              },
            }}
          />
          <FormInputSelect
            options={shiftOptions}
            control={control}
            name={`dateShifts.${index}.shiftId`}
            label={t('form.shift')}
            required
            isDisabled={!shiftOptions.length}
            rules={{
              required: validatorRequired(),
            }}
          />
          <FormTimeDurationPicker
            control={control}
            trigger={trigger}
            watch={watch}
            name={`dateShifts.${index}.duration`}
            label={t('form.sessionDuration')}
            required
            rules={{
              required: validatorRequired(),
              validate: {
                durationTime: validatorTimeDurationIsInRange(ONE_HOUR, EIGHT_HOUR),
              },
            }}
          />
        </Stack>
        {index > 0 && (
          <Stack spacing={2} direction="column" sx={{ pt: 2 }}>
            <DeleteIcon
              onClick={() => remove(index)}
              sx={(theme) => ({
                cursor: 'pointer',
                color: theme.palette.icon.main,
                fontSize: theme.spacing(3),
              })}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
