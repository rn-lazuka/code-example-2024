import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiList: {
    styleOverrides: {
      root: ({ theme }) => ({
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
      }),
    },
  },
};

export default component;
