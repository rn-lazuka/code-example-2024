import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiAutocomplete: {
    styleOverrides: {
      popper: ({ theme }) => ({
        boxShadow: '0px 8px 16px 2px rgba(0, 0, 0, 0.16)',
        borderRadius: theme.spacing(0.5),
      }),
      option: {
        borderRadius: 0,
      },
    },
  },
};

export default component;
