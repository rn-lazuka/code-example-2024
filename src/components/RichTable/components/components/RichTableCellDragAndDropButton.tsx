import DragHandleIcon from '@mui/icons-material/DragHandle';
import Box from '@mui/material/Box';

export const RichTableCellDragAndDropButton = () => {
  return (
    <Box
      sx={[
        {
          cursor: 'grab',
        },
      ]}
    >
      <DragHandleIcon />
    </Box>
  );
};

export default RichTableCellDragAndDropButton;
