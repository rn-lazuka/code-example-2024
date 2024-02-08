import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiCheckbox: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& svg': {
          color: theme.palette.primary.main,
        },
        '&.Mui-disabled svg': {
          color: theme.palette.neutral[80],
        },
      }),
      checked: ({ theme }) => ({
        '& svg': {
          color: theme.palette.primary.main,
        },
      }),
      indeterminate: ({ theme }) => ({
        '& svg': {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
};

export default component;
