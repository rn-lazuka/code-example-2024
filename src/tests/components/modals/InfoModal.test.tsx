import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { InfoModal } from '@components';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { render } from '@unit-tests';

describe('MainInfoModal', () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  it('should render modal with title and children if isOpen prop is true', () => {
    render(
      <InfoModal isOpen={true} title={'Patient photo'} onClose={onClose}>
        <Box sx={{ py: 3, px: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Avatar
            sx={(theme) => ({ width: 240, height: 240, bgcolor: theme.palette.primary[90] })}
            src={'#'}
            alt="big avatar"
          >
            <Typography sx={(theme) => ({ fontSize: theme.spacing(13.5), color: theme.palette.primary.main })}>
              First name letter
            </Typography>
          </Avatar>
        </Box>
      </InfoModal>,
      {
        preloadedState: {
          serviceModal: {},
        },
      },
    );
    const title = screen.getByText('Patient photo');
    const avatar = screen.getByAltText('big avatar');
    expect(title).toBeTruthy();
    expect(avatar).toBeTruthy();
  });

  it('should unmount modal if isOpen prop is false', () => {
    render(
      <InfoModal isOpen={false} title={'Patient photo'} onClose={onClose}>
        <Box sx={{ py: 3, px: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Avatar
            sx={(theme) => ({ width: 240, height: 240, bgcolor: theme.palette.primary[90] })}
            src={'#'}
            alt="big avatar"
          >
            <Typography sx={(theme) => ({ fontSize: theme.spacing(13.5), color: theme.palette.primary.main })}>
              First name letter
            </Typography>
          </Avatar>
        </Box>
      </InfoModal>,
      {
        preloadedState: {
          serviceModal: {},
        },
      },
    );
    const title = screen.queryByText('Patient photo');
    const avatar = screen.queryByAltText('big avatar');
    expect(title).not.toBeTruthy();
    expect(avatar).not.toBeTruthy();
  });

  it('should close the modal on close icon click', async () => {
    render(
      <InfoModal isOpen={true} title={'Patient photo'} onClose={onClose}>
        <Typography>info</Typography>
      </InfoModal>,
      {
        preloadedState: {
          serviceModal: {},
        },
      },
    );
    const closeBtn = screen.getByTestId('CloseOutlinedIcon');

    await act(() => user.click(closeBtn));

    expect(onClose).toBeCalledTimes(1);
  });
});
