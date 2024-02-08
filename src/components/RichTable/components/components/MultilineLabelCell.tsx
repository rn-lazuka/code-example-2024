import type { WithSx } from '@types';
import Typography from '@mui/material/Typography';
import { convertSxToArray } from '@utils/converters';

interface MultilineLabelCellProps extends WithSx {
  value: string;
}

export const MultilineLabelCell = ({ value, sx }: MultilineLabelCellProps) => {
  return (
    <Typography
      variant="labelSCaps"
      sx={[
        {
          whiteSpace: 'break-spaces',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: 1,
        },
        ...convertSxToArray(sx),
      ]}
    >
      {value}
    </Typography>
  );
};
