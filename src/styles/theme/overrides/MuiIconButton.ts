import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(1),
        color: theme.palette.icon.main,
        '&:hover': {
          color: theme.palette.icon.dark,
        },
      }),
    },
  },
};
export default component;
