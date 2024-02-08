import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiSvgIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.icon.main,
      }),
    },
  },
};

export default component;
