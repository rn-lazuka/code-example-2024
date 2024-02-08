import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.surface.default,
      }),
      rounded: ({ theme }) => ({
        borderRadius: theme.spacing(2),
      }),
    },
    defaultProps: {
      elevation: 0,
    },
  },
};

export default component;
