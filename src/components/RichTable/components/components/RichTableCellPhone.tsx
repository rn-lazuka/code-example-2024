import Typography from '@mui/material/Typography';
import palette from '@src/styles/theme/palette';

interface RichTableCellPhoneProps {
  data: any;
}

const RichTableCellPhone = ({ data }: RichTableCellPhoneProps) => {
  return (
    <a href={`tel:${data}`} style={{ color: palette.primary.main }}>
      <Typography variant="labelM">{`${data}`}</Typography>
    </a>
  );
};

export default RichTableCellPhone;
