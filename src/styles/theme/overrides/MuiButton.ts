import type { ThemeOptions } from '@mui/material/styles';
import { lighten } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.labelL,
        textTransform: 'capitalize',
        borderRadius: theme.spacing(1.5),
        padding: theme.spacing(1.25, 2),
        boxShadow: 'unset',
      }),
      contained: ({ theme }) => ({
        '&:hover': {
          backgroundColor: lighten(theme.palette.primary.main, 0.08),
        },
      }),
      outlined: ({ theme }) => ({
        padding: theme.spacing(1.125, 2),
        '&:hover': {
          backgroundColor: lighten(theme.palette.primary.main, 0.92),
        },
      }),
      sizeMedium: ({ theme }) => ({
        padding: theme.spacing(1, 2),
        ...theme.typography.labelM,
      }),
    },
  },
};

export default component;
