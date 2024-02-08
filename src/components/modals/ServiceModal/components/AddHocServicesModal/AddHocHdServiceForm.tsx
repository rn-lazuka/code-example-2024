import type { AxiosResponse } from 'axios';
import type { Control, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form/dist/types/form';
import type { AddHocEventFormType, AvailabilityShifts } from '@types';
import { validatorAutocompleteRequired } from '@validators/autocomplete';
import { FormAutocompleteAsync, FormDatePicker, FormInputSelect } from '@components/FormComponents';
import { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import { validatorIsValidDate } from '@validators/validatorIsValidDate';
import { validatorPastDate } from '@validators/validatorPastDate';
import { useTranslation } from 'react-i18next';
import { validatorRequired } from '@validators/validatorRequired';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';
import { NoticeBlockType, ServiceModalName, AddServiceModalPlace } from '@enums';
import Button from '@mui/material/Button';
import { addServiceModal, selectShifts } from '@store/slices';
import { useAppDispatch } from '@hooks/storeHooks';
import { API } from '@utils/api';
import { dateToServerFormat } from '@utils/dateFormat';
import { validatorNoShiftsAvailable } from '@validators/validatorNoShiftsAvailable';

type AddHocHdServiceFormProps = {
  isolationGroupId?: string;
  control: Control<AddHocEventFormType>;
  watch: UseFormWatch<AddHocEventFormType>;
  setValue: UseFormSetValue<AddHocEventFormType>;
  place: AddServiceModalPlace;
  trigger: UseFormTrigger<AddHocEventFormType>;
};
export const AddHocHdServiceForm = ({
  isolationGroupId,
  control,
  watch,
  setValue,
  place,
  trigger,
}: AddHocHdServiceFormProps) => {
  const [availabilityShifts, setAvailabilityShifts] = useState<{ [date: string]: { label: string; value: string }[] }>(
    {},
  );
  const [gettingAvailabilityShifts, setGettingAvailabilityShifts] = useState(false);
  const [shiftOptions, setShiftOptions] = useState<{ label: string; value: string }[]>([]);
  const dispatch = useAppDispatch();

  const patient = watch('patient');
  const date = watch('date');
  const shifts = selectShifts();

  const { t } = useTranslation('schedule');
  const { t: tCommon } = useTranslation('common');

  const getAvailabilityShifts = async () => {
    if (patient) {
      try {
        const { data }: AxiosResponse<AvailabilityShifts> = await API.post(`/pm/appointments/schedules/available`, {
          patientId: patient.value,
        });
        const availability = data.reduce((acc, { date, shifts }) => {
          return {
            ...acc,
            [date]: shifts.map(({ id, name }) => ({ value: id, label: name })),
          };
        }, {});
        setAvailabilityShifts(availability);
      } catch (error) {
        console.error(error);
      } finally {
        setGettingAvailabilityShifts(false);
      }
    }
  };

  useEffect(() => {
    if (patient && !gettingAvailabilityShifts) {
      trigger('date');
    }
  }, [patient, gettingAvailabilityShifts]);

  useEffect(() => {
    setGettingAvailabilityShifts(true);
    if (patient) {
      setAvailabilityShifts({});
      getAvailabilityShifts();
      place === AddServiceModalPlace.GLOBAL && setValue('date', null);
    }
  }, [patient]);

  useEffect(() => {
    if (date && isValid(date) && place === AddServiceModalPlace.GLOBAL) {
      const shifts = availabilityShifts[dateToServerFormat(date)];
      shifts && setShiftOptions(shifts);
    }
  }, [date]);

  useEffect(() => {
    place === AddServiceModalPlace.SHIFT &&
      setShiftOptions(shifts.map((shift) => ({ label: shift.name, value: shift.id })));
  }, []);

  const showHDParams = () => {
    patient?.value &&
      dispatch(
        addServiceModal({
          name: ServiceModalName.ShowHdParamsModal,
          payload: {
            patientId: patient.value,
          },
        }),
      );
  };

  return (
    <>
      <FormAutocompleteAsync
        required
        fullWidth
        name="patient"
        control={control}
        label={t('addHocEventForm.patientName')}
        getOptionsUrl={`/pm/patients/names?hasActiveHd=true${
          isolationGroupId ? `&isolationGroupId=${isolationGroupId}` : ''
        }&name=`}
        optionsTransform={(options) => options.map(({ id, name }) => ({ value: id, label: name }))}
        rules={{
          required: validatorAutocompleteRequired(),
        }}
      />
      <FormDatePicker
        control={control}
        name="date"
        label={t('addHocEventForm.date')}
        fullWidth
        required
        isDisabled={!patient || place === AddServiceModalPlace.SHIFT}
        shouldDisableDate={(day) => !availabilityShifts[format(day, 'yyyy-MM-dd')]}
        rules={{
          required: { value: true, message: tCommon('validation.required') },
          validate: {
            isValid: validatorIsValidDate,
            isPast: validatorPastDate,
            isNoShifts: validatorNoShiftsAvailable(Object.keys(availabilityShifts)),
          },
        }}
      />
      <FormInputSelect
        options={shiftOptions}
        control={control}
        name="shift"
        label={t('addHocEventForm.shift')}
        required
        isDisabled={!shiftOptions.length || place === AddServiceModalPlace.SHIFT}
        sx={(theme) => ({ maxWidth: theme.spacing(42) })}
        rules={{
          required: validatorRequired(),
        }}
      />
      <NoticeBlock type={NoticeBlockType.Info} text={t('addHocEventForm.activeHdPrescriptionWillBeUsed')} />
      <Button
        variant="text"
        onClick={showHDParams}
        disabled={!patient}
        data-testid="showHDParamsButton"
        sx={({ palette }) => ({
          backgroundColor: palette.primary[100],
          p: 1,
          pr: 2,
          border: `1px solid ${palette.primary.main}`,
          color: palette.primary.main,
          '&.Mui-disabled': {
            border: `1px solid rgba(0,0,0, 0.26)`,
          },
        })}
      >
        {t('addHocEventForm.showHDParams')}
      </Button>
    </>
  );
};
