import { ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material';

const component: ThemeOptions['components'] = {
  MuiFilledInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
        '&.Mui-disabled:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
      }),
      input: ({ theme }) => ({
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      }),
    },
  },
};

export default component;
