import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

export const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: theme.spacing(1.5),
  lineHeight: theme.spacing(2),
  '& > div:focus': {
    background: 'none',
  },
  '&:before,&:after,&:hover:not(.Mui-disabled):before,&.Mui-disabled:before': {
    borderBottom: 'unset',
  },
  '& > div': {
    padding: 0,
  },
  '& > svg': {
    color: theme.palette.text.primary,
    width: 16,
    height: 16,
    top: 'unset',
  },
  '&:active > div,&:active > svg,&.Mui-focused > div,&.Mui-focused > svg': {
    color: theme.palette.primary.main,
  },
  '& > .MuiSelect-select': {
    minHeight: 'unset',
  },
}));
