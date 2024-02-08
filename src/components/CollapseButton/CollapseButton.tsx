import type { WithSx } from '@types';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import { convertSxToArray } from '@utils/converters/mui';

export type CollapseButtonProps = WithSx<{
  isCollapsed: boolean;
  onClick: () => void;
}>;

export const CollapseButton = ({ isCollapsed = false, onClick, sx = [] }: CollapseButtonProps) => {
  return (
    <Box
      component="button"
      sx={[
        {
          width: (theme) => theme.spacing(5),
          height: (theme) => theme.spacing(5),
          backgroundColor: isCollapsed ? 'rgba(0, 99, 153, 0.16)' : 'initial',
          borderRadius: (theme) => theme.spacing(4.5),
          padding: (theme) => theme.spacing(1),
          border: 'none',
          transition: '.3s',
          cursor: 'pointer',
        },
        ...convertSxToArray(sx),
      ]}
      onClick={onClick}
    >
      <ExpandLessIcon
        sx={{
          transition: '.3s',
          transform: isCollapsed ? 'rotateX(0)' : 'rotateX(180deg)',
          fill: (theme) => (isCollapsed ? theme.palette.primary.main : theme.palette.icon.main),
        }}
      />
    </Box>
  );
};

export default CollapseButton;
