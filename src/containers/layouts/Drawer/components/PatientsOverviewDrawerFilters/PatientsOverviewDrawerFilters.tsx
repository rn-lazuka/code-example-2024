import {
  changePatientsOverviewFilters,
  clearPatientsOverviewChipsFilters,
  selectOverviewPatientsIsolatorFilters,
  selectOverviewPatientsPatientFilter,
} from '@store/slices/overviewPatientsSlice';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@hooks';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { removeDrawer } from '@store/slices/drawerSlice';
import { DrawerType } from '@enums';
import IsolationFieldsGroup from '@containers/layouts/Drawer/components/PatientsOverviewDrawerFilters/IsolationFieldsGroup';
import {
  AutocompleteAsync,
  AutocompleteAsyncOptionType,
} from '@components/autocompletes/AutocompleteAsync/AutocompleteAsync';
import Divider from '@mui/material/Divider';

const PatientsOverviewDrawerFilters = () => {
  const { t } = useTranslation('patient');
  const dispatch = useAppDispatch();
  const isolationFilters = selectOverviewPatientsIsolatorFilters();
  const patientFilter = selectOverviewPatientsPatientFilter();
  const [isolationFiltersLocalState, setIsolationFiltersLocalState] = useState(isolationFilters);
  const [patient, setPatient] = useState<AutocompleteAsyncOptionType | undefined | null>(patientFilter);

  useEffect(() => setPatient(patientFilter), [patientFilter]);

  return (
    <Stack direction="column" spacing={1} sx={{ '& .MuiDivider-root': { mt: 2, mb: 1 } }}>
      <AutocompleteAsync
        fullWidth
        name="patient"
        onChange={setPatient}
        value={patient}
        label={t('filter.patientName')}
        getOptionsUrl="/pm/patients/search/custom?fields=name,id&name="
        optionsTransform={(options) => options.map((option) => ({ id: option.id, label: option.name }))}
      />
      <Divider />
      <IsolationFieldsGroup
        isolationFilters={isolationFilters}
        setIsolationFiltersLocalState={setIsolationFiltersLocalState}
        isolationFiltersLocalState={isolationFiltersLocalState}
      />
      <Box
        sx={(theme) => ({
          px: 1,
          py: 1,
          borderTop: `solid 1px ${theme.palette.border.default}`,
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 1,
          zIndex: theme.zIndex.drawer,
        })}
      >
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            data-testid="clearPatientsOverviewFiltersButton"
            onClick={() => dispatch(clearPatientsOverviewChipsFilters())}
            variant={'outlined'}
            sx={{ flexGrow: 1, width: 1 }}
          >
            {t('filter.clearAll')}
          </Button>
          <Button
            onClick={() => {
              dispatch(removeDrawer(DrawerType.PatientsOverviewFilters));
              dispatch(changePatientsOverviewFilters({ patient, isolations: isolationFiltersLocalState }));
            }}
            variant={'contained'}
            sx={{ flexGrow: 1, width: 1 }}
          >
            {t('filter.show')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PatientsOverviewDrawerFilters;
