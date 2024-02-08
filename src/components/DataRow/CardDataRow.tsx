import { Stack } from '@mui/material';
import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type CardDataRowProps = {
  isXs: boolean;
  name: ReactNode;
  value: ReactNode;
  additionalValue?: ReactNode;
};

export const CardDataRow = ({ isXs, name, value, additionalValue }: CardDataRowProps) => {
  return (
    <Stack direction={isXs ? 'column' : 'row'} mb={1}>
      <Stack direction="row" alignItems="center">
        <Typography
          variant="labelM"
          sx={{
            minWidth: (theme) => (isXs ? theme.spacing(16.95) : theme.spacing(23.25)),
            maxWidth: (theme) => (isXs ? theme.spacing(16.95) : theme.spacing(23.25)),
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="labelM"
          sx={[
            isXs && { whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
            !isXs && { minWidth: (theme) => theme.spacing(23.25), whiteSpace: 'pre-wrap' },
          ]}
        >
          {value || '—'}
        </Typography>
      </Stack>

      {isXs ? (
        <Stack direction="row" alignItems="center">
          <Typography
            variant="labelM"
            sx={{
              whiteSpace: 'pre-wrap',
              ml: (theme) => theme.spacing(16.95),
              mt: (theme) => theme.spacing(0.5),
            }}
          >
            {additionalValue}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="labelM" sx={{ minWidth: (theme) => theme.spacing(23.25) }}>
          {additionalValue}
        </Typography>
      )}
    </Stack>
  );
};
