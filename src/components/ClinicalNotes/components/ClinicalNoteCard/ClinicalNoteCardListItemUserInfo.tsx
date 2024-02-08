import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getPersonNameWithDeletedSyfix } from '@utils';
import { ROUTES } from '@constants';

export type ClinicalNoteCardListItemUserInfoProps = {
  user: {
    id: number;
    name: string;
    deleted: boolean;
  };
  date: Date | string;
};

export const ClinicalNoteCardListItemUserInfo = ({ user, date }: ClinicalNoteCardListItemUserInfoProps) => {
  return (
    <>
      {user.deleted ? (
        <Typography variant="labelS">
          {getPersonNameWithDeletedSyfix({ name: user.name, deleted: user.deleted })}
        </Typography>
      ) : (
        <Box
          data-testid="ClinicalNoteUserLink"
          component={Link}
          sx={{ display: 'flex', alignItems: 'center' }}
          color="primary.main"
          to={`/${ROUTES.administration}/${ROUTES.userManagement}/${user.id}/${ROUTES.userProfile}`}
        >
          <Typography variant="labelS">{user.name}</Typography>
        </Box>
      )}
      <Typography variant="labelS" sx={{ ml: (theme) => theme.spacing(1) }}>
        {format(new Date(date), 'dd/MM/yyyy hh:mm a')}
      </Typography>
    </>
  );
};
