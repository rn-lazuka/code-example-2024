import { WithSx } from '@types';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';
import { StyledModalHeader, StyledModalPaper } from './InfoModal.styles';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { convertSxToArray } from '@utils/converters/mui';

export type InfoModalProps = PropsWithChildren<
  WithSx<{
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onBackButtonClick?: () => void;
  }>
>;

export const InfoModal = ({ isOpen, onBackButtonClick, title, children, onClose, sx = [] }: InfoModalProps) => {
  return (
    <Modal open={isOpen} data-testid="infoModal" disableEnforceFocus disableAutoFocus={true}>
      <StyledModalPaper sx={convertSxToArray(sx)}>
        <StyledModalHeader>
          {onBackButtonClick && (
            <IconButton onClick={onBackButtonClick} sx={{ m: 0, ml: -1 }} data-testid="backArrowButton">
              <ArrowBackOutlinedIcon />
            </IconButton>
          )}
          <Typography variant="headerS">{title}</Typography>
          <IconButton onClick={onClose} sx={{ m: 0 }} data-testid="closeButton">
            <CloseOutlinedIcon />
          </IconButton>
        </StyledModalHeader>
        {children}
      </StyledModalPaper>
    </Modal>
  );
};

export default InfoModal;
