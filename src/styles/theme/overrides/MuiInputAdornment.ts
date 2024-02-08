import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.labelL,
        '& .MuiTypography-root': {
          ...theme.typography.labelL,
        },
      }),
    },
  },
};

export default component;
