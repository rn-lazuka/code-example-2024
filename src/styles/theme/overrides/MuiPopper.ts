import type { ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material';

const component: ThemeOptions['components'] = {
  MuiPopper: {
    defaultProps: {
      sx: {
        '& .MuiPickersDay-root': {
          fontSize: (theme) => theme.typography.fontSize,
          fontWeight: (theme) => theme.typography.fontWeightMedium,
          color: (theme) => theme.palette.text.primary,
          '&:hover': { background: alpha('#006399', 0.08) },
        },
        '& .MuiPickersDay-today': {
          backgroundColor: (theme) => theme.palette.primary.light,
          border: 'unset !important',
        },
        '& .Mui-selected': {
          backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
          color: (theme) => theme.palette.primary[100],
        },
        '& .Mui-disabled': {
          color: (theme) => `${theme.palette.neutral[60]} !important`,
        },
      },
    },
  },
};

export default component;
