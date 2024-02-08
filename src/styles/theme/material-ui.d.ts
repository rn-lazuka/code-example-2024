import '@mui/material/styles';
import { PaletteColorOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypeText {
    darker: string;
    black: string;
    white: string;
  }

  interface Palette {
    surface: PaletteColor;
    icon: PaletteColor;
    neutral: PaletteColor;
    neutralVariant: PaletteColor;
    border: PaletteColor;
  }

  interface PaletteOptions {
    surface: PaletteColorOptions;
    icon: PaletteColorOptions;
    neutral: PaletteColorOptions;
    neutralVariant: PaletteColorOptions;
    border: PaletteColorOptions;
  }

  interface PaletteColor {
    0: string;
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
    95: string;
    99: string;
    100: string;
    default?: string;
  }

  interface SimplePaletteColorOptions {
    0: string;
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
    95: string;
    99: string;
    100: string;
    default?: string;
  }

  interface TypographyVariants {
    headerXL: React.CSSProperties;
    headerL: React.CSSProperties;
    headerM: React.CSSProperties;
    headerS: React.CSSProperties;
    paragraphL: React.CSSProperties;
    paragraphM: React.CSSProperties;
    paragraphS: React.CSSProperties;
    paragraphXS: React.CSSProperties;
    labelL: React.CSSProperties;
    labelLSB: React.CSSProperties;
    labelM: React.CSSProperties;
    labelMSB: React.CSSProperties;
    labelMCaps: React.CSSProperties;
    labelS: React.CSSProperties;
    labelSCapsSB: React.CSSProperties;
    labelSSB: React.CSSProperties;
    labelSCaps: React.CSSProperties;
    labelXS: React.CSSProperties;
    labelXXS: React.CSSProperties;
    labelXXSCapsSB: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    headerXL: React.CSSProperties;
    headerL: React.CSSProperties;
    headerM: React.CSSProperties;
    headerS: React.CSSProperties;
    paragraphL: React.CSSProperties;
    paragraphM: React.CSSProperties;
    paragraphS: React.CSSProperties;
    paragraphXS: React.CSSProperties;
    labelL: React.CSSProperties;
    labelLSB: React.CSSProperties;
    labelM: React.CSSProperties;
    labelMSB: React.CSSProperties;
    labelMCaps: React.CSSProperties;
    labelS: React.CSSProperties;
    labelSCapsSB: React.CSSProperties;
    labelSSB: React.CSSProperties;
    labelSCaps: React.CSSProperties;
    labelXS: React.CSSProperties;
    labelXXS: React.CSSProperties;
    labelXXSCapsSB: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headerXL: true;
    headerL: true;
    headerM: true;
    headerS: true;
    paragraphL: true;
    paragraphM: true;
    paragraphS: true;
    paragraphXS: true;
    labelL: true;
    labelLSB: true;
    labelM: true;
    labelMSB: true;
    labelMCaps: true;
    labelS: true;
    labelSCapsSB: true;
    labelSSB: true;
    labelSCaps: true;
    labelXS: true;
    labelXXS: true;
    labelXXSCapsSB: true;

    // Disable all default MUI variants
    h1: false;
    h2: false;
    h3: false;
    h4: false;
    h5: false;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    button: false;
    caption: false;
    overline: false;
  }
}
