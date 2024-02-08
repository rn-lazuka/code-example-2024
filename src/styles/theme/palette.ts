import { createTheme, Palette } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

const primary = {
  0: '#000000',
  10: '#001D31',
  20: '#003351',
  30: '#004B74',
  40: '#006398',
  50: '#1A7DBA',
  60: '#4197D5',
  70: '#60B2F2',
  80: '#93CCFF',
  90: '#CDE5FF',
  95: '#E7F2FF',
  99: '#FCFCFF',
  100: '#FFFFFF',
};

const error = {
  0: '#000000',
  10: '#410002',
  20: '#690005',
  30: '#93000A',
  40: '#BA1A1A',
  50: '#DE3730',
  60: '#FF5449',
  70: '#FF897D',
  80: '#FFB4AB',
  90: '#FFDAD6',
  95: '#FFEDEA',
  99: '#FFFBFF',
  100: '#FFFFFF',
};

const neutral = {
  0: '#000000',
  10: '#1A1C1E',
  20: '#2F3033',
  30: '#45474A',
  40: '#5D5E61',
  50: '#76777A',
  60: '#909194',
  70: '#AAABAE',
  80: '#C6C6C9',
  90: '#E2E2E5',
  95: '#F0F0F4',
  99: '#FCFCFF',
  100: '#FFFFFF',
};

const neutralVariant = {
  0: '#000000',
  10: '#171C22',
  20: '#2B3137',
  30: '#42474E',
  40: '#595F65',
  50: '#73777D',
  60: '#8C9198',
  70: '#A6ACB3',
  80: '#C2C7CE',
  90: '#DEE3EB',
  95: '#ECF1F9',
  99: '#FCFCFF',
  100: '#FFFFFF',
};

const text = {
  black: neutral[0],
  white: neutral[100],
  primary: neutral[10],
  secondary: neutralVariant[50],
  darker: '#43474C',
  disabled: neutral[40],
};

const { palette: defaultMuiPalette } = createTheme();

const palette: Palette = deepmerge(defaultMuiPalette, {
  primary: {
    ...primary,
    main: primary[40],
    dark: primary[10],
    light: primary[90],
  },
  neutral: {
    ...neutral,
    main: neutral[40],
    dark: neutral[10],
    light: neutral[90],
  },
  neutralVariant: {
    ...neutral,
    main: neutralVariant[40],
    dark: neutralVariant[10],
    light: neutralVariant[90],
  },
  error: {
    ...error,
    main: error[40],
    dark: error[10],
    light: error[90],
  },
  background: {
    default: '#F1F0F3',
  },
  surface: {
    default: '#FDFCFE',
  },
  border: {
    default: '#DFE3E9',
    main: primary[40],
  },
  icon: {
    main: neutralVariant[50],
    dark: neutralVariant[40],
  },
  text,
});

export default palette;
