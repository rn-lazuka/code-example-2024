import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.labelL,
        transform: `translate(${theme.spacing(2)},${theme.spacing(2)}) scale(1)`,
      }),
      shrink: ({ theme }) => ({
        transform: `translate(${theme.spacing(2)},${theme.spacing(1)}) scale(0.75)`,
      }),
    },
  },
};

export default component;
