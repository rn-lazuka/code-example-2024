import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        padding: `${theme.spacing(2.25)} 0 ${theme.spacing(2.25)} 0`,
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1.5),
        '&.Mui-selected': { color: theme.palette.text.primary },
      }),
    },
  },
};

export default component;
