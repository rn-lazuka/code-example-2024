import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { Control, UseFormTrigger, UseFormWatch } from 'react-hook-form/dist/types/form';
import type { HdSchedulingForm } from '@types';
import { Button, CircularProgress, Stack, Tooltip } from '@mui/material';
import { useFieldArray, UseFormSetValue } from 'react-hook-form';
import Box from '@mui/material/Box';
import { API, Dictionaries } from '@utils';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { DateShifts } from '@containers/layouts/Drawer/components/AddHdSchedulingForm/DateShifts';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import isEmpty from 'lodash/isEmpty';
import { selectDrawerPayload } from '@store/slices';
import { DrawerType } from '@enums/containers';

type AddHocSchedulingFormProps = {
  control: Control<HdSchedulingForm>;
  watch: UseFormWatch<HdSchedulingForm>;
  trigger: UseFormTrigger<HdSchedulingForm>;
  isValid: boolean;
  setValue: UseFormSetValue<HdSchedulingForm>;
};
export const AddHocSchedulingForm = ({ control, watch, trigger, isValid, setValue }: AddHocSchedulingFormProps) => {
  const { patientIsolationStatus } = selectDrawerPayload(DrawerType.HdPrescriptionForm);
  const { t } = useTranslation('hdPrescription');
  const [availability, setAvailability] = useState<{ [key: string]: { value: string; label: string }[] }>({});
  const { t: tIsolations } = useTranslation(Dictionaries.Isolations);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dateShifts',
  });
  const watchFieldArray = watch('dateShifts');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...(watchFieldArray?.[index] && watchFieldArray[index]),
    };
  });

  useEffect(() => {
    getAvailability();
  }, [patientIsolationStatus]);

  const getAvailability = () => {
    const dateShifts = getSelectedDateShifts();
    const params = {
      isolationGroupId: patientIsolationStatus?.id || null,
      ...(dateShifts.length ? { dateShifts } : {}),
    };
    return API.post('/pm/prescriptions/ad-hoc/available', params)
      .then(({ data }: AxiosResponse<{ date: string; shifts: { id: string; name: string }[] }[]>) => {
        const availabilityOptions = data.reduce((acc, item) => {
          return {
            ...acc,
            [item.date]: item.shifts.map(({ id, name }) => ({ value: `${id}`, label: name })),
          };
        }, {});

        if (dateShifts.length) {
          dateShifts.forEach(({ date, shiftId, shiftName }) => {
            if (availabilityOptions[date!]) {
              if (!availabilityOptions[date!].find(({ value }) => value === shiftId)) {
                availabilityOptions[date!].push({ value: shiftId, label: shiftName });
              }
            } else {
              availabilityOptions[date!] = [{ value: shiftId, label: shiftName }];
            }
          });
        }
        setAvailability(availabilityOptions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getSelectedDateShifts = () => {
    return controlledFields
      .filter((field) => field.date)
      .map((field) => ({
        date: field.date ? format(field.date, 'yyyy-MM-dd') : null,
        shiftId: field.shiftId,
        shiftName: field.shiftName,
      }));
  };

  const appendBlock = () => {
    getAvailability().then(() => {
      append({ date: null, shiftId: '', shiftName: '', duration: 240 });
    });
  };

  return (
    <>
      {patientIsolationStatus && patientIsolationStatus?.isolations?.length > 0 && (
        <Stack flexDirection="row" alignItems="center">
          <Typography variant="labelL" mr={0.8}>
            {patientIsolationStatus?.name}
          </Typography>
          <Tooltip
            title={patientIsolationStatus.isolations.map((isolationKey) => tIsolations(isolationKey)).join(' + ')}
          >
            <HelpOutlineOutlinedIcon sx={{ '&:hover': { color: ({ palette }) => palette.primary.main } }} />
          </Tooltip>
        </Stack>
      )}
      <Divider sx={{ mx: ({ spacing }) => `${spacing(-2)} !important` }} />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('form.dates')}
      </Typography>
      {controlledFields.map((field, index) => {
        return (
          <DateShifts
            key={field.id}
            index={index}
            watch={watch}
            control={control}
            trigger={trigger}
            remove={remove}
            availability={availability}
            setValue={setValue}
          />
        );
      })}
      {isEmpty(availability) && (
        <Stack alignItems="center">
          <CircularProgress size="2rem" />
        </Stack>
      )}
      <Button
        onClick={appendBlock}
        variant={'outlined'}
        disabled={controlledFields.length === 7 || !isValid || isEmpty(availability)}
        data-testid="addDateShiftButton"
        sx={{ width: ({ spacing }) => spacing(14) }}
      >
        <Box sx={(theme) => ({ fontSize: theme.typography.headerM.fontSize })}>+</Box>&nbsp;{t('form.addDay')}
      </Button>
    </>
  );
};
