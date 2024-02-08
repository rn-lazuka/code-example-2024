import { DatePickerInput } from '@components/DatePickerInput/DatePickerInput';
import { useTranslation } from 'react-i18next';
import {
  clearNoteTypeFilters,
  selectClinicalNotesFilters,
  selectClinicalNotesFiltersError,
  setClinicalNotesFilters,
  setClinicalNotesFiltersError,
} from '@store/index';
import { useAppDispatch } from '@hooks/storeHooks';
import { checkIsDataValidToPeriod, getTenantEndCurrentDay } from '@utils';
import { Chip } from '@components/Chip/Chip';
import { ChipColors, ChipVariants } from '@enums/components';
import CloseIcon from '@mui/icons-material/Close';
import { theme } from '@src/styles';
import { ClinicalNotesPlaces, ClinicalNoteTypes, CustomClinicalNoteTypes } from '@enums';
import { AutocompleteAsync } from '@components/autocompletes';
import Grid from '@mui/material/Grid';

type ClinicalNotesFiltersProps = {
  place: ClinicalNotesPlaces;
};

export const ClinicalNotesFilters = ({ place }: ClinicalNotesFiltersProps) => {
  const { t } = useTranslation('clinicalNotes');
  const dispatch = useAppDispatch();
  const filters = selectClinicalNotesFilters();
  const errors = selectClinicalNotesFiltersError();
  const selectedFiltersCount = filters ? filters.noteTypes.filter((item) => item.selected).length : 0;

  const setFilter = (value, name) => dispatch(setClinicalNotesFilters({ [name]: value }));

  const setFilterFrom = (value) => {
    const errorFrom = checkIsDataValidToPeriod(value, new Date('2022-12-01'));
    const errorTo = value ? checkIsDataValidToPeriod(filters.to, value) : null;
    dispatch(setClinicalNotesFiltersError({ from: errorFrom, to: errorTo }));
    setFilter(value, 'from');
  };

  const setFilterTo = (value) => {
    const errorFrom = checkIsDataValidToPeriod(filters.from, new Date('2022-12-01'));
    const errorTo = checkIsDataValidToPeriod(value, filters.from || new Date('2022-12-01'));
    dispatch(setClinicalNotesFiltersError({ from: errorFrom, to: errorTo }));
    setFilter(value, 'to');
  };

  const setChipFilter = (value) => {
    dispatch(
      setClinicalNotesFilters({
        ...filters,
        noteTypes: filters.noteTypes.map((filterItem) => {
          const { name, selected } = filterItem;
          if (value === name) {
            return {
              ...filterItem,
              selected: !selected,
            };
          }
          return filterItem;
        }),
      }),
    );
  };

  const chipStyles = { whiteSpace: 'nowrap' };

  return (
    <Grid container sx={{ flexWrap: 'wrap' }} rowSpacing={2} px={{ mt: 0, xs: 2, sm: 3 }} py={2}>
      <Grid item container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <DatePickerInput
            label={t('filters.fromDate')}
            value={filters.from}
            onChange={setFilterFrom}
            name="from"
            error={errors.from}
            maxDate={getTenantEndCurrentDay()}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <DatePickerInput
            label={t('filters.toDate')}
            value={filters.to}
            onChange={setFilterTo}
            name="to"
            error={errors.to}
            maxDate={getTenantEndCurrentDay()}
            fullWidth
          />
        </Grid>
        {place === ClinicalNotesPlaces.Header && (
          <Grid item xs={12} sm={4} md={3}>
            <AutocompleteAsync
              fullWidth
              name="patient"
              label={t('filters.patientName')}
              onChange={(value) => setFilter(value, 'patient')}
              value={{ label: filters.patient?.label ?? '', id: filters.patient?.id ?? '' }}
              getOptionsUrl="/pm/patients/search/custom?fields=name,id&name="
              optionsTransform={(options) => options.map((option) => ({ id: option.id, label: option.name }))}
            />
          </Grid>
        )}
      </Grid>
      <Grid item container spacing={1} sx={{ flexWrap: 'wrap' }}>
        {filters.noteTypes.map(({ name, selected }) => (
          <Grid item key={name}>
            <Chip
              dataTestId={`${name}Chip`}
              onClick={() => setChipFilter(name)}
              variant={selected ? ChipVariants.fill : ChipVariants.outlined}
              color={selected ? ChipColors.blue : ChipColors.standard}
              label={t(`filters.noteTypes.${CustomClinicalNoteTypes[name] || ClinicalNoteTypes[name]}`)}
              RightIcon={selected ? CloseIcon : undefined}
              sx={chipStyles}
            />
          </Grid>
        ))}
        {selectedFiltersCount >= 2 && (
          <Grid item>
            <Chip
              dataTestId={`${t('filters.clearAll')}Chip`}
              onClick={() => dispatch(clearNoteTypeFilters())}
              variant={ChipVariants.outlined}
              label={t('filters.clearAll')}
              RightIcon={CloseIcon}
              rightIconColor={theme.palette.error.main}
              sx={chipStyles}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
