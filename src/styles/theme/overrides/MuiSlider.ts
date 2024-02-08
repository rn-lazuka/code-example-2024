import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiSlider: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '0',
        margin: '2rem 1rem',
        color: theme.palette.primary[90],
        '& .MuiSlider-track': {
          border: 'none',
        },
        '& .MuiSlider-thumb': {
          width: 20,
          height: 20,
          backgroundColor: theme.palette.primary[40],
          '&:hover, &.Mui-focusVisible, &.Mui-active': {
            cursor: 'grab',
          },
          '&:active': {
            cursor: 'grabbing',
          },
        },
      }),
    },
  },
};

export default component;
