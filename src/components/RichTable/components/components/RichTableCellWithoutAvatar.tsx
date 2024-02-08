import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ROUTES } from '@constants';
import { dotsTextOverflowStyles } from '@utils/styles';

interface RichTableCellWithoutAvatarProps {
  data: any;
  dotsTextOverflow?: boolean;
}

const RichTableCellWithoutAvatar = ({ dotsTextOverflow, data }: RichTableCellWithoutAvatarProps) => {
  return (
    <Box
      component={Link}
      sx={{ display: 'flex', alignItems: 'center' }}
      color="primary.main"
      to={`/${ROUTES.patientsOverview}/${data.id}/${ROUTES.patientProfile}`}
    >
      <Typography sx={dotsTextOverflow ? dotsTextOverflowStyles : []} variant="labelM">
        {data.name}
      </Typography>
    </Box>
  );
};

export default RichTableCellWithoutAvatar;
