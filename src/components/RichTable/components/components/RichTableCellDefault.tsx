import Typography from '@mui/material/Typography';
import { dotsTextOverflowStyles } from '@utils/styles';

interface RichTableCellDefaultProps {
  multiLines?: boolean;
  dotsTextOverflow?: boolean;
  data?: any;
}

const RichTableCellDefault = ({ data, dotsTextOverflow = false, multiLines = true }: RichTableCellDefaultProps) => {
  return data ? (
    <Typography
      title={typeof data === 'string' ? data : ''}
      sx={dotsTextOverflow ? dotsTextOverflowStyles : [{ whiteSpace: multiLines ? 'pre-wrap' : 'normal' }]}
      variant="paragraphM"
    >
      {data}
    </Typography>
  ) : (
    <Typography variant="labelM">—</Typography>
  );
};

export default RichTableCellDefault;
