import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import settings from './settings';
import components from './overrides';

const themeOptions: ThemeOptions = {
  ...settings,
  palette,
  typography,
  components,
};

const theme = createTheme(themeOptions);

export { palette, typography, components, settings };
export default theme;
