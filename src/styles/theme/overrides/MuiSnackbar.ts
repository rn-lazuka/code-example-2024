import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiSnackbar: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: '0 8px 16px 2px rgba(0, 0, 0, 0.16)',
        '& .MuiPaper-root': {
          borderRadius: theme.spacing(0.5),
        },
        '& .MuiButtonBase-root': {
          color: 'inherit',
          padding: theme.spacing(0.6),
        },
      }),
    },
  },
};

export default component;
