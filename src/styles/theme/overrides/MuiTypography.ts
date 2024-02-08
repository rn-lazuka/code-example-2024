import type { ThemeOptions } from '@mui/material/styles';

const component: ThemeOptions['components'] = {
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        inherit: 'p',
        headerXL: 'h1',
        headerL: 'h2',
        headerM: 'h3',
        headerS: 'h4',
        paragraphL: 'p',
        paragraphM: 'p',
        paragraphS: 'p',
        paragraphXS: 'p',
        labelL: 'p',
        labelLSB: 'p',
        labelM: 'p',
        labelMSB: 'p',
        labelMCaps: 'p',
        labelS: 'p',
        labelSSB: 'p',
        labelSCaps: 'p',
        labelXS: 'p',
        labelXXS: 'p',
        labelXXSCapsSB: 'p',
      },
    },
    variants: [],
  },
};

export default component;
