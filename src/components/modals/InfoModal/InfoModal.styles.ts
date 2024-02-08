import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledModalPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: theme.spacing(44),
  borderRadius: theme.spacing(3),
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
}));

export const StyledModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  borderBottom: `solid 1px ${theme.palette.border.default}`,
}));
