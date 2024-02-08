import { useTranslation } from 'react-i18next';
import { format, startOfDay, subYears } from 'date-fns';
import { Control, UseFormTrigger } from 'react-hook-form/dist/types/form';
import Stack from '@mui/material/Stack';
import {
  FormAutocompleteFreeSolo,
  FormAutocompleteFreeSoloAsync,
  FormDatePicker,
  FormInputText,
  NoticeBlock,
} from '@components';
import {
  validatorAutocompleteMaxLength,
  validatorAutocompleteMinLength,
  validatorAutocompletePattern,
  validatorAutocompleteRequired,
  validatorFutureDate,
  validatorIsValidDate,
  validatorIsValidNumber,
  validatorLatinLettersNumberCharacters,
  validatorLatinLettersSpecialCharacters,
  validatorMaxLength,
  validatorMinDate,
  validatorMinLength,
  validatorNotZero,
  validatorNumberDecimal,
  validatorNumberInt,
  validatorRequired,
} from '@validators';
import {
  dateFormat,
  Dictionaries,
  getOptionListFromCatalog,
  getTenantEndCurrentDay,
  getTenantStartCurrentDay,
  transformEventCommaToDot,
} from '@utils';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Dialyzers, HdPrescriptionForm } from '@types';
import { useAppDispatch } from '@hooks/storeHooks';
import Button from '@mui/material/Button';
import {
  addDrawer,
  addServiceModal,
  selectDrawerPayload,
  selectHdSchedulingForm,
  selectPatientDialyzersInfo,
} from '@store';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DrawerType, InputTextType, NoticeBlockType, ServiceModalName, UserPermissions } from '@enums';
import { SchedulingFormView } from './SchedulingFormView';
import { ROUTES } from '@constants/global';
import { PermissionGuard } from '@guards/PermissionGuard';
import { AddDialyzerModalPlace } from '@enums/components/AddDialyzerModalPlace';

type AddHdPrescriptionFormViewProps = {
  control: Control<HdPrescriptionForm>;
  trigger: UseFormTrigger<HdPrescriptionForm>;
  showEmptySchedulingWarning: boolean;
};

export const AddHdPrescriptionFormView = ({
  control,
  trigger,
  showEmptySchedulingWarning,
}: AddHdPrescriptionFormViewProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('hdPrescription');
  const { t: tDialyzers } = useTranslation('dialyzers');
  const schedulingForm = selectHdSchedulingForm();
  const dispatch = useAppDispatch();
  const dialyzers = selectPatientDialyzersInfo();
  const { id: patientId } = selectDrawerPayload(DrawerType.HdPrescriptionForm);

  const getDialyzerName = ({ brand, surfaceArea, history }: Dialyzers) => {
    return `${brand?.name} (${surfaceArea} ${tDialyzers('tableView.m2')}) - ${
      history && !!history.length ? dateFormat(history[0].date) : tDialyzers('tableView.new')
    }`;
  };

  const openAddNewDialyzer = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.AddDialyzerModal,
        payload: {
          place: AddDialyzerModalPlace.HD_PRESCRIPTION_FORM,
          patientId,
        },
      }),
    );
  };

  return (
    <Stack direction="column" spacing={2}>
      <FormDatePicker
        control={control}
        name="prescriptionDate"
        label={t('form.prescriptionDate')}
        required
        maxDate={getTenantEndCurrentDay()}
        minDate={subYears(getTenantStartCurrentDay(), 1)}
        rules={{
          required: validatorRequired(),
          validate: {
            isValid: validatorIsValidDate,
            isFuture: validatorFutureDate(tCommon('validation.enteredDateShouldNotBeLater')),
            minDate: validatorMinDate(
              startOfDay(subYears(getTenantStartCurrentDay(), 1)),
              tCommon('validation.notEarlierThan', { date: format(getTenantStartCurrentDay(), 'dd/MM/yyyy') }),
            ),
          },
        }}
      />
      <FormAutocompleteFreeSoloAsync
        required
        capitalizedLabel
        name="prescribedBy"
        control={control}
        trigger={trigger}
        label={t('form.prescribedBy')}
        textType={InputTextType.Capitalize}
        getOptionsUrl="/pm/doctors?name="
        optionsTransform={(doctors) => [
          ...doctors
            .reduce((map, doctor) => {
              if (doctor.deleted) return map;
              map.set(doctor.id, {
                label: doctor.name,
                value: undefined,
                specialities: doctor.specialities,
              });
              return map;
            }, new Map())
            .values(),
        ]}
        rules={{
          required: validatorAutocompleteRequired(),
          pattern: validatorAutocompletePattern(validatorLatinLettersSpecialCharacters()),
          minLength: validatorAutocompleteMinLength(1, 100, 'label'),
          maxLength: validatorAutocompleteMaxLength(1, 100, 'label'),
        }}
      />
      <FormInputText
        control={control}
        name="bloodFlow"
        label={t('form.bloodFlow')}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('ml/min')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberInt(),
          minLength: validatorMinLength(2, 4),
          maxLength: validatorMaxLength(2, 4),
          validate: {
            onlyNumbers: validatorIsValidNumber,
          },
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="dryWeight"
        label={t('form.dryWeight')}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('kg')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberDecimal(),
          minLength: validatorMinLength(2, 5),
          maxLength: validatorMaxLength(2, 5),
          validate: {
            notZero: validatorNotZero,
          },
        }}
        sx={{ '& input': { pl: 0 } }}
        transform={transformEventCommaToDot}
      />
      <Divider sx={{ mx: ({ spacing }) => `${spacing(-2)} !important` }} />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('form.dialyzer')}
      </Typography>
      <Stack direction="column" spacing={0}>
        {dialyzers && dialyzers.length ? (
          dialyzers.map((dialyzer, index) => (
            <Typography variant="paragraphM" key={dialyzer.id}>
              {`${index + 1}. ${getDialyzerName(dialyzer)}`}
            </Typography>
          ))
        ) : (
          <Typography variant="labelL">{tDialyzers('noActiveDialyzers')}</Typography>
        )}
      </Stack>
      <PermissionGuard permissions={UserPermissions.DialyzerManage}>
        <Button
          onClick={openAddNewDialyzer}
          variant={'outlined'}
          data-testid="addNewDialyzerButton"
          sx={{ width: '120px' }}
        >
          {tDialyzers('addDialyzer')}
        </Button>
      </PermissionGuard>
      <Divider sx={{ mx: ({ spacing }) => `${spacing(-2)} !important` }} />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('form.dialstate')}
      </Typography>
      <FormInputText
        control={control}
        name="calcium"
        label={t('form.calcium')}
        required
        transform={transformEventCommaToDot}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('mmol/l')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberDecimal(),
          minLength: validatorMinLength(1, 4),
          maxLength: validatorMaxLength(1, 4),
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="sodiumStart"
        label={t('form.sodiumStart')}
        required
        transform={transformEventCommaToDot}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('mmol/l')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberDecimal(),
          minLength: validatorMinLength(1, 4),
          maxLength: validatorMaxLength(1, 4),
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="sodiumEnd"
        label={t('form.sodiumEnd')}
        required
        transform={transformEventCommaToDot}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('mmol/l')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberDecimal(),
          minLength: validatorMinLength(1, 4),
          maxLength: validatorMaxLength(1, 4),
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="potassium"
        label={t('form.potassium')}
        required
        transform={transformEventCommaToDot}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('mmol/l')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberDecimal(),
          minLength: validatorMinLength(1, 4),
          maxLength: validatorMaxLength(1, 4),
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="temperature"
        label={t('form.temperature')}
        required
        transform={transformEventCommaToDot}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('℃')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberDecimal(),
          minLength: validatorMinLength(2, 4),
          maxLength: validatorMaxLength(2, 4),
          validate: {
            notZero: validatorNotZero,
          },
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="flow"
        label={t('form.flow')}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('ml/min')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberInt(),
          minLength: validatorMinLength(2, 4),
          maxLength: validatorMaxLength(2, 4),
          validate: {
            notZero: validatorNotZero,
          },
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <Divider sx={{ mx: ({ spacing }) => `${spacing(-2)} !important` }} />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('form.anticoagulant')}
      </Typography>
      <FormAutocompleteFreeSolo
        required
        control={control}
        name="anticoagulantType"
        label={t('form.anticoagulantType')}
        options={getOptionListFromCatalog(Dictionaries.AnticoagulantType)}
        rules={{
          required: validatorAutocompleteRequired(),
          minLength: validatorAutocompleteMinLength(1, 256),
          maxLength: validatorAutocompleteMaxLength(1, 256),
          pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
        }}
      />
      <FormInputText
        control={control}
        name="primeDose"
        label={t('form.primeDose')}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('units')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberInt(),
          minLength: validatorMinLength(1, 5),
          maxLength: validatorMaxLength(1, 5),
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="bolusDose"
        label={t('form.bolusDose')}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('units')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberInt(),
          minLength: validatorMinLength(1, 5),
          maxLength: validatorMaxLength(1, 5),
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <FormInputText
        control={control}
        name="hourlyDose"
        label={t('form.hourlyDose')}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5 }}>
              {tCommon('units')}
            </InputAdornment>
          ),
        }}
        inputProps={{ inputMode: 'numeric' }}
        rules={{
          required: validatorRequired(),
          pattern: validatorNumberInt(),
          minLength: validatorMinLength(1, 5),
          maxLength: validatorMaxLength(1, 5),
        }}
        sx={{ '& input': { pl: 0 } }}
      />
      <Divider sx={{ mx: ({ spacing }) => `${spacing(-2)} !important` }} />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('form.scheduling')}
      </Typography>
      <SchedulingFormView />
      {showEmptySchedulingWarning && <NoticeBlock text={t('form.setScheduleOptions')} type={NoticeBlockType.Error} />}
      <Button
        onClick={() =>
          dispatch(
            addDrawer({
              type: DrawerType.HdScheduling,
              allowedPathsToShowDrawer: [ROUTES.patientsOverview],
            }),
          )
        }
        variant="outlined"
        sx={({ spacing }) => ({ width: spacing(18), pr: 1, textTransform: 'unset' })}
        data-testid={`${schedulingForm ? 'editSchedule' : 'setSchedule'}Button`}
      >
        {t(`form.${schedulingForm ? 'editSchedule' : 'setSchedule'}`)}
        <EditOutlinedIcon fontSize="small" sx={{ fill: (theme) => theme.palette.primary.main, ml: 1 }} />
      </Button>
      <Divider sx={{ mx: ({ spacing }) => `${spacing(-2)} !important` }} />
      <Typography variant="labelMCaps" sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {t('form.comments')}
      </Typography>
      <FormInputText
        control={control}
        name="comments"
        hiddenLabel
        multiline
        rules={{
          pattern: validatorLatinLettersNumberCharacters(),
          minLength: validatorMinLength(2, 500),
          maxLength: validatorMaxLength(2, 500),
        }}
      />
    </Stack>
  );
};
