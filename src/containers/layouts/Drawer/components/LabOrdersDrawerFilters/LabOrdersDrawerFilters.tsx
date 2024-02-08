import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePickerInput } from '@components/DatePickerInput/DatePickerInput';
import { Select } from '@components/Select/Select';
import {
  AutocompleteAsync,
  AutocompleteAsyncOptionType,
  AutocompleteFreeSoloOptionType,
  AutocompleteMultiple,
} from '@components/autocompletes';
import {
  clearLabOrderFilters,
  removeDrawer,
  selectDrawerPayload,
  selectIsAllLabOrdersFiltersValid,
  selectLabOrderFilters,
  selectLabOrdersFiltersErrors,
  selectLabOrdersIsLoading,
  setFilterErrors,
  setFilters,
} from '@store/slices';
import { useAppDispatch } from '@hooks/storeHooks';
import { useProceduresOptionsList, useShiftOptionsList } from '@hooks';
import { validatorIsValidDate } from '@validators';
import { DrawerType, LabOrdersPlace } from '@enums';
import { Dictionaries, getOptionListFromCatalog, getTenantEndCurrentDay, API, checkIsDataValidToPeriod } from '@utils';

const LabOrdersDrawerFilters = () => {
  const [labOptions, setLabOptions] = useState([]);
  const filters = selectLabOrderFilters();
  const errors = selectLabOrdersFiltersErrors();
  const loading = selectLabOrdersIsLoading();
  const isAllValid = selectIsAllLabOrdersFiltersValid();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const { procedureOptions } = useProceduresOptionsList();
  const { shiftOptions } = useShiftOptionsList();
  const { place } = selectDrawerPayload(DrawerType.LabOrdersFilters);

  const [patient, setPatient] = useState<AutocompleteAsyncOptionType | null | undefined>(filters.patient);
  const [procedures, setProcedures] = useState(filters.procedures);
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);
  const [shifts, setShifts] = useState(filters.shifts);
  const [order, setOrder] = useState(filters.order);
  const [type, setType] = useState(filters.type);
  const [labIds, setLabIds] = useState(filters.labIds);
  const [planFrom, setPlanFrom] = useState(filters.planFrom);
  const [planTo, setPlanTo] = useState(filters.planTo);
  const [appointmentFrom, setAppointmentFrom] = useState(filters.appointmentFrom);
  const [appointmentTo, setAppointmentTo] = useState(filters.appointmentTo);
  const [submissionFrom, setSubmissionFrom] = useState(filters.submissionFrom);
  const [submissionTo, setSubmissionTo] = useState(filters.submissionTo);
  const [resultFrom, setResultFrom] = useState(filters.resultFrom);
  const [resultTo, setResultTo] = useState(filters.resultTo);

  useEffect(() => {
    getLabList();
  }, []);

  const getLabList = async () => {
    API.get('/pm/labs')
      .then(({ data }) => {
        setLabOptions(data.map((option) => ({ label: option.name, value: option.id })));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onChangeProcedure = (e, selectedValue) => {
    setProcedures(selectedValue);
    setLabIds([]);
  };

  const onChangeFilters = () => {
    dispatch(removeDrawer(DrawerType.LabOrdersFilters));
    dispatch(
      setFilters({
        patient,
        procedures,
        from,
        to,
        shifts,
        order,
        type,
        labIds,
        planFrom,
        planTo,
        appointmentFrom,
        appointmentTo,
        submissionFrom,
        submissionTo,
        resultFrom,
        resultTo,
      }),
    );
  };

  const setError = (name, error) => dispatch(setFilterErrors({ ...errors, [name]: error }));

  const getDateError = (value, compareField: null | Date = null) => {
    const error = compareField ? checkIsDataValidToPeriod(value, compareField) : validatorIsValidDate(value);

    return typeof error !== 'string' ? null : error;
  };

  return (
    <Stack direction="column" spacing={2} sx={{ '& .MuiDivider-root': { mt: 2, mb: 1 } }}>
      {place === LabOrdersPlace.Header && (
        <AutocompleteAsync
          value={patient}
          label={t('forms.creation.patientName')}
          getOptionsUrl={'/pm/patients/search/custom?fields=name,id&name='}
          onChange={setPatient}
          optionsTransform={(options) => options.map((option) => ({ id: option.id, label: option.name }))}
          fullWidth
          name="patient"
        />
      )}
      <AutocompleteMultiple
        placeholder={t('forms.creation.procedure')}
        options={procedureOptions}
        value={procedures}
        onChange={onChangeProcedure}
        groupBy={(option: AutocompleteFreeSoloOptionType) => option?.group || ''}
        fullWidth
        name="procedures"
      />
      <Typography variant="labelMCaps" sx={{ color: ({ palette }) => palette.text.secondary }}>
        {t('filters.performedDate')}
      </Typography>
      <DatePickerInput
        label={t('filters.fromDate')}
        value={from}
        onChange={(value) => {
          setFrom(value);
          const error = getDateError(value);
          !error && !to && setTo(value);
          setError('from', error);
        }}
        name="from"
        error={errors.from}
        maxDate={filters.to || getTenantEndCurrentDay()}
        fullWidth
      />
      <DatePickerInput
        label={t('filters.toDate')}
        value={to}
        onChange={(value) => {
          setTo(value);
          setError('to', getDateError(value, from));
        }}
        name="to"
        error={errors.to}
        fullWidth
        maxDate={getTenantEndCurrentDay()}
      />
      <AutocompleteMultiple
        placeholder={t('filters.shift')}
        options={shiftOptions}
        value={shifts}
        onChange={(e, value) => setShifts(value)}
        fullWidth
        name="shifts"
      />
      <Divider />
      <AutocompleteAsync
        value={order}
        label={t('filters.labOrder№')}
        getOptionsUrl={'/pm/lab-orders/numbers?search='}
        onChange={setOrder}
        optionsTransform={(options) => options.map((option) => ({ id: option.id, label: `${option.number}` }))}
        fullWidth
        name="labOrder"
      />
      <Select
        name="type"
        label={t('filters.orderType')}
        value={type}
        options={getOptionListFromCatalog(Dictionaries.LabOrderTypeFilter)}
        handleChange={(value) => setType(value.target.value)}
        fullWidth
      />
      <Select
        name="labIds"
        multiple
        label={t('forms.creation.labName')}
        options={labOptions}
        value={labIds.map((option) => option.value)}
        handleChange={(value) => {
          const selectedIds = value.target.value as any as string[];
          setLabIds(
            selectedIds.map((id) => labOptions.find((option: { label: string; value: string }) => id === option.value)),
          );
        }}
        fullWidth
        isDisabled={!labOptions.length}
      />
      <Divider />
      <Typography variant="labelMCaps" sx={{ color: ({ palette }) => palette.text.secondary }}>
        {t('filters.planeDate')}
      </Typography>
      <DatePickerInput
        label={t('filters.fromDate')}
        value={planFrom}
        onChange={(value) => {
          setPlanFrom(value);
          const error = getDateError(value);
          !error && !planTo && setPlanTo(value);
          setError('planFrom', error);
        }}
        name="planFrom"
        error={errors.planFrom}
        maxDate={filters.planTo || getTenantEndCurrentDay()}
        fullWidth
      />
      <DatePickerInput
        label={t('filters.toDate')}
        value={planTo}
        onChange={(value) => {
          setPlanTo(value);
          setError('planTo', getDateError(value, planFrom));
        }}
        name="planTo"
        error={errors.planTo}
        maxDate={getTenantEndCurrentDay()}
        fullWidth
      />
      <Typography variant="labelMCaps" sx={{ color: ({ palette }) => palette.text.secondary }}>
        {t('filters.appointmentDate')}
      </Typography>
      <DatePickerInput
        label={t('filters.fromDate')}
        value={appointmentFrom}
        onChange={(value) => {
          setAppointmentFrom(value);
          const error = getDateError(value);
          !error && !appointmentTo && setAppointmentTo(value);
          setError('appointmentFrom', error);
        }}
        name="appointmentFrom"
        error={errors.appointmentFrom}
        maxDate={filters.appointmentTo || getTenantEndCurrentDay()}
        fullWidth
      />
      <DatePickerInput
        label={t('filters.toDate')}
        value={appointmentTo}
        onChange={(value) => {
          setAppointmentTo(value);
          setError('appointmentTo', getDateError(value, appointmentFrom));
        }}
        name="appointmentTo"
        error={errors.appointmentTo}
        maxDate={getTenantEndCurrentDay()}
        fullWidth
      />
      <Typography variant="labelMCaps" sx={{ color: ({ palette }) => palette.text.secondary }}>
        {t('filters.submissionDate')}
      </Typography>
      <DatePickerInput
        label={t('filters.fromDate')}
        value={submissionFrom}
        onChange={(value) => {
          setSubmissionFrom(value);
          const error = getDateError(value);
          !error && !submissionTo && setSubmissionTo(value);
          setError('submissionFrom', error);
        }}
        name="submissionFrom"
        error={errors.submissionFrom}
        maxDate={filters.submissionTo || getTenantEndCurrentDay()}
        fullWidth
      />
      <DatePickerInput
        label={t('filters.toDate')}
        value={submissionTo}
        onChange={(value) => {
          setSubmissionTo(value);
          setError('submissionTo', getDateError(value, submissionFrom));
        }}
        name="submissionTo"
        error={errors.submissionTo}
        maxDate={getTenantEndCurrentDay()}
        fullWidth
      />
      <Typography variant="labelMCaps" sx={{ color: ({ palette }) => palette.text.secondary }}>
        {t('filters.resultDate')}
      </Typography>
      <DatePickerInput
        label={t('filters.fromDate')}
        value={resultFrom}
        onChange={(value) => {
          setResultFrom(value);
          const error = getDateError(value);
          !error && !resultTo && setResultTo(value);
          setError('resultFrom', error);
        }}
        name="resultFrom"
        error={errors.resultFrom}
        maxDate={filters.resultTo || getTenantEndCurrentDay()}
        fullWidth
      />
      <DatePickerInput
        label={t('filters.toDate')}
        value={resultTo}
        onChange={(value) => {
          setResultTo(value);
          setError('resultTo', getDateError(value, resultFrom));
        }}
        name="resultTo"
        error={errors.resultTo}
        maxDate={getTenantEndCurrentDay()}
        fullWidth
        sx={{ paddingBottom: ({ spacing }) => spacing(9) }}
      />
      <Box
        sx={(theme) => ({
          py: 1,
          bgcolor: theme.palette.surface.default,
          borderTop: `solid 1px ${theme.palette.border.default}`,
          position: 'absolute',
          bottom: 0,
          width: `calc(100% - ${theme.spacing(4.5)})`,
          zIndex: theme.zIndex.drawer,
        })}
      >
        <Stack spacing={2} direction="row">
          <Button
            onClick={() => dispatch(clearLabOrderFilters(place === LabOrdersPlace.Header ? [] : ['patient']))}
            variant={'outlined'}
            data-testid="cancelAddAccessManagementButton"
            sx={{ flexGrow: 1 }}
          >
            {tCommon('button.clearAll')}
          </Button>
          <Button
            onClick={onChangeFilters}
            variant={'contained'}
            disabled={!isAllValid || loading}
            data-testid="saveAddAccessManagementButton"
            sx={{ flexGrow: 1 }}
          >
            {tCommon('button.show')}
            {loading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default LabOrdersDrawerFilters;
