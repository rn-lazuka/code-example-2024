import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { LocationBrowserStorage } from '@services/LocationBrowser';
import { selectHasBeenRedirectedToAddAccess } from '@store/slices';
import Box from '@mui/material/Box';

interface BackNavigationProps {
  backButtonTitle: string;
}

export const BackNavigation = ({ backButtonTitle }: BackNavigationProps) => {
  const [previousPath, setPreviousPath] = useState<string>('../');
  const navigate = useNavigate();
  const previousLocation = new LocationBrowserStorage();
  const hasBeenRedirectedToAddAccess = selectHasBeenRedirectedToAddAccess();
  const showGoBackButton = !hasBeenRedirectedToAddAccess;
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    setPreviousPath(previousLocation.get()?.previousPath || '../');
  }, []);

  if (!showGoBackButton) return null;

  return (
    <Box
      sx={(theme) => ({
        px: isXs ? 2 : 3,
        py: 2,
        backgroundColor: theme.palette.surface.default,
        borderBottom: `solid 1px ${theme.palette.border.default}`,
      })}
    >
      <IconButton
        sx={{
          maxWidth: 1,
          p: 0,
          '&:hover': { backgroundColor: 'unset' },
        }}
        onClick={() => navigate(previousPath)}
      >
        <Stack direction="row" spacing={2} sx={{ width: 1 }} alignItems="center">
          <ArrowBackOutlinedIcon />
          {backButtonTitle && (
            <Typography
              variant="headerS"
              sx={[
                {
                  textAlign: { xs: 'center', md: 'start' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 1,
                  color: '#2F3032',
                },
                isXs && { whiteSpace: 'nowrap' },
              ]}
            >
              {backButtonTitle}
            </Typography>
          )}
          {!backButtonTitle && <Skeleton height={20} sx={{ width: (theme) => theme.spacing(25) }} />}
        </Stack>
      </IconButton>
    </Box>
  );
};
