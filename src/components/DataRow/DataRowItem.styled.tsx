import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export const DataRowItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderRadius: 'unset',
}));
