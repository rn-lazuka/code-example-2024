import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: `${theme.spacing(1.25)} ${theme.spacing(2)}`,
        fontSize: 14,
        lineHeight: '20px',
      }),
    },
  },
};

export default component;
