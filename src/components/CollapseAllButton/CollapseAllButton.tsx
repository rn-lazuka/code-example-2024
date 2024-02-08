import type { WithSx } from '@types';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Box from '@mui/material/Box';
import { convertSxToArray } from '@utils/converters/mui';

export type CollapseAllButtonProps = WithSx<{
  isAllCollapsed: boolean;
  onClick: () => void;
}>;

export const CollapseAllButton = ({ isAllCollapsed = false, onClick, sx = [] }: CollapseAllButtonProps) => {
  return (
    <Box
      data-testid="CollapseAllButton"
      sx={[
        {
          width: (theme) => theme.spacing(3),
          height: (theme) => theme.spacing(3),
          paddingLeft: (theme) => theme.spacing(1),
          border: 'none',
          transition: '.3s',
          cursor: 'pointer',
        },
        ...convertSxToArray(sx),
      ]}
      onClick={onClick}
    >
      <KeyboardDoubleArrowUpIcon
        data-testid="CollapseAllButtonIcon"
        sx={{
          transition: '.3s',
          transform: isAllCollapsed ? 'rotateX(0)' : 'rotateX(180deg)',
          fill: (theme) => theme.palette.icon.main,
        }}
      />
    </Box>
  );
};

export default CollapseAllButton;
