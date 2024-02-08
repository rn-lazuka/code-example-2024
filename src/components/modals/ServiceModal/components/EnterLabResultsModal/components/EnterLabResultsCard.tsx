import { PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';

export const EnterLabResultsCard = ({ children }: PropsWithChildren) => (
  <Paper
    sx={[
      (theme) => ({
        minWidth: theme.spacing(43.25),
        p: theme.spacing(3),
      }),
    ]}
  >
    {children}
  </Paper>
);
