import type { Dispatch, ChangeEvent, SetStateAction } from 'react';
import type { PatientIsolationFilterItem } from '@types';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useCallback, useEffect } from 'react';
import { VirologyChip } from '@components/VirologyChip/VirologyChip';
import { Virus, PatientIsolationFilterNames } from '@enums';
import { useTranslation } from 'react-i18next';

type IsolationFieldsGroupProps = {
  isolationFilters: { items: PatientIsolationFilterItem[] };
  setIsolationFiltersLocalState: Dispatch<SetStateAction<{ items: PatientIsolationFilterItem[] }>>;
  isolationFiltersLocalState: { items: PatientIsolationFilterItem[] };
};
const IsolationFieldsGroup = ({
  isolationFilters,
  setIsolationFiltersLocalState,
  isolationFiltersLocalState,
}: IsolationFieldsGroupProps) => {
  const { t } = useTranslation('patient');

  const onCheckboxClick = useCallback((event: ChangeEvent<HTMLInputElement>, name) => {
    setIsolationFiltersLocalState((prevState) => ({
      ...prevState,
      items: prevState.items.map((item) => (name === item.name ? { ...item, checked: event.target.checked } : item)),
    }));
  }, []);

  useEffect(() => {
    setIsolationFiltersLocalState(isolationFilters);
  }, [isolationFilters]);

  const renderVirologyChip = (name: PatientIsolationFilterNames) => {
    switch (name) {
      case PatientIsolationFilterNames.hepB:
        return <VirologyChip name={Virus.Hbsag} key={Virus.Hbsag} />;
      case PatientIsolationFilterNames.hepC:
        return <VirologyChip name={Virus.Anti_Hcv} key={Virus.Anti_Hcv} />;
      case PatientIsolationFilterNames.hiv:
        return <VirologyChip name={Virus.Anti_Hiv} key={Virus.Anti_Hiv} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Typography variant="labelMCaps" sx={{ color: ({ palette }) => palette.text.secondary, mb: 1 }}>
        {t(`filter.isolation`)}
      </Typography>
      <FormGroup>
        {isolationFiltersLocalState.items.map(({ name, checked }, index) => (
          <Stack key={index} direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  data-testid="patientsIsolationFilter"
                  checked={checked}
                  onChange={(event) => onCheckboxClick(event, name)}
                  sx={{
                    py: 0,
                    '&:not(.Mui-disabled)': {
                      svg: {
                        color: (theme) => theme.palette.primary.main,
                      },
                    },
                  }}
                />
              }
              label={t(`filter.${name.toLowerCase()}`)}
            />
            {renderVirologyChip(name)}
          </Stack>
        ))}
      </FormGroup>
    </>
  );
};

export default IsolationFieldsGroup;
