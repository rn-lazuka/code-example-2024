import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiDivider: {
    styleOverrides: {
      root: {
        marginTop: 0,
        marginBottom: 0,
      },
    },
  },
};

export default component;
