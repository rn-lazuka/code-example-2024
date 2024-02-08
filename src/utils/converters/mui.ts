import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export const convertSxToArray = (sx?: SxProps<Theme>) => {
  if (!sx) return [];
  return Array.isArray(sx) ? sx : [sx];
};
