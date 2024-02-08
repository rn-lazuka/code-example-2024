import type { ThemeOptions } from '@mui/material/styles';
import muiDivider from './MuiDivider';
import muiMenuItem from './MuiMenuItem';
import muiIconButton from './MuiIconButton';
import muiList from './MuiList';
import muiPaper from './MuiPaper';
import muiTypography from './MuiTypography';
import muiFilledInput from './MuiFilledInput';
import muiInputLabel from './MuiInputLabel';
import muiPopover from './MuiPopover';
import muiButton from './MuiButton';
import muiSnackbar from './MuiSnackbar';
import muiSvgIcon from './MuiSvgIcon';
import muiTab from './MuiTab';
import muiCheckbox from './MuiCheckbox';
import muiAutocomplete from './MuiAutocomplete';
import muiSlider from './MuiSlider';
import muiInputAdornment from './MuiInputAdornment';
import muiPopper from './MuiPopper';

const overrides: ThemeOptions['components'] = {
  ...muiDivider,
  ...muiMenuItem,
  ...muiIconButton,
  ...muiList,
  ...muiPaper,
  ...muiTypography,
  ...muiFilledInput,
  ...muiInputLabel,
  ...muiPopover,
  ...muiButton,
  ...muiSnackbar,
  ...muiSvgIcon,
  ...muiTab,
  ...muiCheckbox,
  ...muiAutocomplete,
  ...muiSlider,
  ...muiInputAdornment,
  ...muiPopper,
};

export default overrides;
