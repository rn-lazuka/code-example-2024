import type { ClinicalEventFormType } from '@types';
import type { FormAutocompleteOption } from '@components/FormComponents';
import {
  FormAutocomplete,
  FormAutocompleteAsync,
  FormDatePicker,
  FormInputCheckbox,
  FormInputRadio,
  FormInputSelect,
  FormInputText,
  FormTimePicker,
} from '@components/FormComponents';
import type { Control, UseFormGetFieldState, UseFormSetValue, UseFormWatch } from 'react-hook-form/dist/types/form';
import { useCallback, useEffect, useState } from 'react';
import {
  validatorAutocompleteRequired,
  validatorFutureTime,
  validatorIsExistQuarterlyBT,
  validatorIsValidDate,
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorPastDate,
  validatorPastTime,
  validatorRequired,
  validatorTimeNotEarlierThan,
} from '@validators';
import { ClinicalScheduleEventType } from '@enums/pages/Schedule';
import Stack from '@mui/material/Stack';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { API } from '@utils/api';
import { getTenantStartCurrentDay } from '@utils/getTenantDate';
import { addServiceModal, selectClinicalShiftList, selectEvents } from '@store/slices';
import { addMinutes, parse, subMinutes } from 'date-fns';
import { DoctorSpecialities } from '@enums/global';
import Typography from '@mui/material/Typography';
import { TargetAudience } from '@enums/components/TargetAudience';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ROUTES } from '@constants/global';
import { useAppDispatch } from '@hooks/storeHooks';
import { ServiceModalName } from '@enums/components';
import { TargetAudienceRadioButton } from '@components/modals/ServiceModal/components/AddClinicalEventModal/components/TargetAudienceRadioButton';

const typeOptions = [
  { label: i18n.t('schedule:events.QUARTERLY_BLOOD_TEST'), value: ClinicalScheduleEventType.QuarterlyBloodTest },
  { label: i18n.t('schedule:events.NEPHROLOGIST_VISIT'), value: ClinicalScheduleEventType.NephrologistVisit },
  { label: i18n.t('schedule:events.PIC_VISIT'), value: ClinicalScheduleEventType.PICVisit },
  { label: i18n.t('schedule:events.CUSTOM'), value: ClinicalScheduleEventType.CustomEvent },
];

type AddClinicalEventFormProps = {
  control: Control<ClinicalEventFormType>;
  watch: UseFormWatch<ClinicalEventFormType>;
  setValue: UseFormSetValue<ClinicalEventFormType>;
  editedEventId?: string;
  targetAudienceDefault?: TargetAudience;
  dialysisRelatedDefault?: boolean;
  getFieldState: UseFormGetFieldState<ClinicalEventFormType>;
  patientsList: FormAutocompleteOption[];
  setPatientsList: (patientsList: FormAutocompleteOption[]) => void;
};

export const AddClinicalEventForm = ({
  control,
  watch,
  editedEventId,
  targetAudienceDefault,
  dialysisRelatedDefault,
  setValue,
  getFieldState,
  patientsList,
  setPatientsList,
}: AddClinicalEventFormProps) => {
  const [labOptions, setLabOptions] = useState([]);
  const { t } = useTranslation('schedule');
  const { t: tCommon } = useTranslation('common');
  const { isTouched: isTouchedDialysisRelated } = getFieldState('dialysisRelated');
  const dispatch = useAppDispatch();

  const eventType = watch('type');
  const startTime = watch('startTime');
  const isAllDay = watch('isAllDay');
  const targetAudience = watch('targetAudience', targetAudienceDefault);
  const dialysisRelated = watch('dialysisRelated', dialysisRelatedDefault);

  const events = selectEvents();
  const shifts = selectClinicalShiftList();

  const startShiftsTime = shifts[0]?.timeStart && subMinutes(parse(shifts[0].timeStart, 'HH:mm:ss', new Date()), 1);
  const endShiftsTime =
    shifts[shifts.length - 1]?.timeEnd &&
    addMinutes(parse(shifts[shifts.length - 1].timeEnd, 'HH:mm:ss', new Date()), 1);

  const getLabList = useCallback(async () => {
    API.get('/pm/labs')
      .then(({ data }) => {
        setLabOptions(data.map((option) => ({ label: option.name, value: option.id })));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setLabOptions]);

  const getCustomRadioLabel = useCallback(
    (value, label) => (
      <TargetAudienceRadioButton
        label={label}
        value={value}
        targetAudience={targetAudience}
        dialysisRelated={dialysisRelated}
        control={control}
      />
    ),
    [targetAudience, dialysisRelated, control],
  );

  const deletePatientFromList = useCallback(
    (patientId: string | number) => {
      setPatientsList(patientsList.filter((patient) => patient.value !== patientId));
    },
    [patientsList, setPatientsList],
  );

  useEffect(() => {
    getLabList();
  }, []);

  useEffect(() => {
    isTouchedDialysisRelated && targetAudience && setValue('dialysisRelated', false);
    if (patientsList.length && targetAudience !== TargetAudience.SpecificPatients) {
      dispatch(
        addServiceModal({
          name: ServiceModalName.ConfirmModal,
          payload: {
            closeCallback: () => setPatientsList([]),
            cancelCallback: () => setValue('targetAudience', TargetAudience.SpecificPatients),
            title: t('form.changeOption'),
            text: t('form.removeList'),
            confirmButton: tCommon('button.continue'),
            cancelButton: tCommon('button.cancel'),
          },
        }),
      );
    }
  }, [targetAudience]);

  return (
    <Stack direction="column" spacing={2}>
      <FormInputSelect
        required
        control={control}
        name="type"
        label={t('form.eventType')}
        isDisabled={!!editedEventId}
        options={typeOptions}
        rules={{
          required: validatorRequired(),
        }}
      />
      {eventType === ClinicalScheduleEventType.CustomEvent && (
        <FormInputText
          control={control}
          name="title"
          label={t('form.title')}
          multiline
          required
          rules={{
            required: validatorRequired(),
            minLength: validatorMinLength(1, 100),
            maxLength: validatorMaxLength(1, 100),
            pattern: validatorLatinLettersNumberCharacters(),
          }}
        />
      )}
      {eventType === ClinicalScheduleEventType.QuarterlyBloodTest && (
        <FormAutocomplete
          required
          name="laboratory"
          control={control}
          label={t('form.labName')}
          options={labOptions}
          rules={{
            required: validatorAutocompleteRequired(),
          }}
        />
      )}
      {(eventType === ClinicalScheduleEventType.NephrologistVisit ||
        eventType === ClinicalScheduleEventType.PICVisit) && (
        <FormAutocompleteAsync
          required
          name="doctor"
          control={control}
          label={t('form.doctorName')}
          getOptionsUrl={`/pm/doctors?speciality=${
            eventType === ClinicalScheduleEventType.PICVisit
              ? DoctorSpecialities.DoctorInCharge
              : DoctorSpecialities.DoctorNephrologist
          }&name=`}
          optionsTransform={(doctors) =>
            doctors
              .map((doctor) => {
                if (doctor.deleted) return null;
                return { label: doctor.name, value: doctor?.specialities[0]?.id };
              })
              .filter((item) => !!item)
          }
          rules={{
            required: validatorAutocompleteRequired(),
          }}
        />
      )}
      <FormInputText
        control={control}
        name="comment"
        label={t('form.comment')}
        multiline
        rules={{
          minLength: validatorMinLength(1, 200),
          maxLength: validatorMaxLength(1, 200),
          pattern: validatorLatinLettersNumberCharacters(),
        }}
      />
      {(eventType === ClinicalScheduleEventType.NephrologistVisit ||
        eventType === ClinicalScheduleEventType.PICVisit) && (
        <>
          <FormInputRadio
            control={control}
            name="targetAudience"
            customRadioLabelRender={getCustomRadioLabel}
            labelSx={{
              alignItems: 'start',
              mr: 0,
            }}
            options={[
              { label: t('form.forAssignedPatients'), value: TargetAudience.AssignedPatients },
              { label: t('form.forAllPatients'), value: TargetAudience.AllPatients },
              { label: t('form.forSpecificPatients'), value: TargetAudience.SpecificPatients },
            ]}
          />
          {targetAudience === TargetAudience.SpecificPatients && (
            <>
              <FormAutocompleteAsync
                required
                fullWidth
                name="patient"
                control={control}
                label={t('addHocEventForm.patientName')}
                getOptionsUrl={
                  '/pm/patients/search/custom?fields=id,name,photoPath&statuses=PERMANENT,WALK_IN,VISITING,TEMPORARY_TRANSFERRED,HOSPITALIZED&name='
                }
                optionsTransform={(options) =>
                  options
                    .filter(({ id }) => !patientsList.find((item) => item.value === id))
                    .map(({ id, name, photoPath }) => ({ value: id, label: name, photoPath }))
                }
                rules={{
                  required: ((patientsList) => () => {
                    const message = i18n.t(`common:validation.required`);
                    return !!patientsList.length || message;
                  })(patientsList),
                }}
              />
              {patientsList.map((patient) => (
                <Stack key={patient.value} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center">
                    <Avatar
                      sx={(theme) => ({ mr: 1, width: theme.spacing(4), height: theme.spacing(4) })}
                      src={patient.photoPath || ''}
                    >
                      {patient.label[0]}
                    </Avatar>
                    <Box
                      component={Link}
                      to={`/${ROUTES.patientsOverview}/${patient.value}/${ROUTES.patientProfile}`}
                      color="primary.main"
                    >
                      <Typography variant="labelM">{patient.label}</Typography>
                    </Box>
                  </Stack>
                  <IconButton
                    onClick={() => deletePatientFromList(patient.value)}
                    sx={{ m: 0, p: 0 }}
                    data-testid="closeModalButton"
                  >
                    <CloseOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </>
          )}
        </>
      )}
      <FormDatePicker
        control={control}
        name="date"
        label={t('form.date')}
        required
        minDate={getTenantStartCurrentDay()}
        isDisabled={!eventType}
        rules={{
          required: validatorRequired(),
          validate: {
            isValid: validatorIsValidDate,
            isPast: validatorPastDate,
            isExistQuarterlyBT: validatorIsExistQuarterlyBT(eventType, events, editedEventId),
          },
        }}
      />
      <FormInputCheckbox control={control} name="isAllDay" label={t('form.isAllDay')} sx={{ mb: 2, mt: 2 }} />
      <Stack direction="row" spacing={1}>
        <FormTimePicker
          control={control}
          name={'startTime'}
          label={t('form.startTime')}
          required={!isAllDay}
          isDisabled={isAllDay}
          minTime={startShiftsTime}
          maxTime={endShiftsTime}
          rules={{
            validate: {
              isValid: validatorIsValidDate,
              required: (value, { isAllDay }) => {
                const message = i18n.t(`common:validation.required`);
                return isAllDay || !!value || message;
              },
              maxDate: validatorFutureTime(endShiftsTime, t('validations.notBeLater')),
              minDate: validatorPastTime(startShiftsTime, t('validations.notBeEarlier')),
            },
          }}
        />
        <FormTimePicker
          control={control}
          name={'endTime'}
          label={t('form.endTime')}
          required={!isAllDay}
          isDisabled={isAllDay}
          minTime={startShiftsTime}
          maxTime={endShiftsTime}
          rules={{
            validate: {
              isValid: validatorIsValidDate,
              required: (value, { isAllDay }) => {
                const message = i18n.t(`common:validation.required`);
                return isAllDay || !!value || message;
              },
              maxDate: validatorFutureTime(endShiftsTime, t('validations.notBeLater')),
              minDate: validatorPastTime(startShiftsTime, t('validations.notBeEarlier')),
              notEarlierThan: validatorTimeNotEarlierThan(startTime, t('validations.earlierThanStart')),
            },
          }}
        />
      </Stack>
    </Stack>
  );
};
