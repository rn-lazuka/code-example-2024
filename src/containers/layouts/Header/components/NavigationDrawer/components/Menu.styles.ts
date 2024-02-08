import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material';

export const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  '& .MuiTypography-root, svg': {
    color: theme.palette.text.secondary,
  },
  '&:hover': {
    backgroundColor: 'unset',
    '& .MuiTypography-root, svg': {
      color: theme.palette.primary.main,
    },
  },
  '&.Mui-selected': {
    backgroundColor: alpha('#00639914', 0.08),
    borderRadius: theme.spacing(1),
    '& .MuiTypography-root, svg': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: alpha('#00639914', 0.08),
      '& .MuiTypography-root, svg': {
        color: theme.palette.primary.main,
      },
    },
  },
}));
