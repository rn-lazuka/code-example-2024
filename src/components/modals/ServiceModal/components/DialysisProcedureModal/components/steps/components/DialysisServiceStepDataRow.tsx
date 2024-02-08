import { Stack } from '@mui/material';
import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type DialysisServiceStepDataRowProps = {
  isXs: boolean;
  name: ReactNode;
  value: ReactNode;
  additionalValue?: ReactNode;
};

export const DialysisServiceStepDataRow = ({ isXs, name, value, additionalValue }: DialysisServiceStepDataRowProps) => {
  return (
    <Stack
      data-testid="DialysisServiceStepDataRow"
      direction={'row'}
      alignItems={isXs ? 'flex-start' : 'center'}
      spacing={4}
      sx={({ spacing }) => ({
        pt: 1,
        width: 1,
        mt: `${spacing(0)} !important`,
        maxWidth: (theme) => theme.spacing(87),
        '& .MuiPaper-root': { maxWidth: additionalValue ? spacing(22.5) : 1 },
      })}
    >
      <Stack
        direction="row"
        spacing={4}
        alignItems={isXs ? 'flex-start' : 'center'}
        sx={{
          minWidth: (theme) => theme.spacing(20),
          maxWidth: (theme) => theme.spacing(20),
        }}
      >
        <Typography data-testid="DialysisServiceStepDataRowName" variant="labelM">
          {name}
        </Typography>
      </Stack>
      <Stack
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <Typography data-testid="DialysisServiceStepDataRowValue" variant="labelM">
          {value || '-'}
        </Typography>
        {isXs && additionalValue && (
          <Typography
            data-testid="DialysisServiceStepDataRowAdditionalXsValue"
            variant="labelM"
            sx={{
              whiteSpace: 'pre-wrap',
              mt: (theme) => theme.spacing(1),
            }}
          >
            {additionalValue}
          </Typography>
        )}
      </Stack>
      {!isXs && additionalValue && (
        <Typography data-testid="DialysisServiceStepDataRowAdditionalValue" variant="labelM">
          {additionalValue}
        </Typography>
      )}
    </Stack>
  );
};
