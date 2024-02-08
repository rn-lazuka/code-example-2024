import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TableRow } from '@mui/material';
import { Column, DragItem, WithSx } from '@types';
import { RichTableCell } from '@src/components';
import { convertSxToArray } from '@utils/converters/mui';

interface RichTableDefaultProps {
  id: number | string;
  columnsWithoutWidth: number | string;
  columnWidthSum: number | string;
  row: any;
  columns: WithSx<Column>[];
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  getStickyPosition: (index: number, width?: number) => any;
}

const RichTableDragAndDropRow = ({
  id,
  row,
  columns,
  index,
  moveRow,
  getStickyPosition,
  columnWidthSum,
  columnsWithoutWidth,
}: RichTableDefaultProps) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [, drop] = useDrop({
    accept: 'ROW',
    hover(dragItem: DragItem, monitor) {
      if (!ref.current) return;
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? Math.max(clientOffset.y - hoverBoundingRect.top, 0) : 0;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      dragItem.index = hoverIndex;
      moveRow(dragIndex, hoverIndex);
    },
    drop() {
      setIsClicked(false);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'ROW',
    item: { type: 'ROW', id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseUp = () => {
    setIsClicked(false);
  };

  drag(drop(ref));

  return (
    <TableRow
      ref={ref}
      sx={(theme) => ({
        '& > td': {
          opacity: isDragging ? 0 : 1,
          backgroundColor: isClicked ? theme.palette.primary[90] : theme.palette.text.white,
        },
      })}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {columns.map(
        (
          { id, sticky, width, maxWidth, minWidth, cellType, format, sx, cellCallback, disabled, withRightBorder },
          columnIndex,
        ) => {
          return (
            <RichTableCell
              key={`${index}-${id}-${columnIndex}`}
              disabled={disabled}
              rowKey={`${row.id}`}
              rowIndex={index}
              sticky={sticky}
              width={width}
              minWidth={minWidth}
              maxWidth={maxWidth}
              cellType={cellType}
              cellCallback={cellCallback}
              format={format}
              data={row[id]}
              fullData={row}
              sx={[
                {
                  width: width ? width : `calc((100% - ${columnWidthSum}px) / ${columnsWithoutWidth})`,
                  maxWidth: maxWidth ? maxWidth : `calc((100% - ${columnWidthSum}px) / ${columnsWithoutWidth})`,
                  minWidth: minWidth ? minWidth : `calc((100% - ${columnWidthSum}80px) / ${columnsWithoutWidth})`,
                  left: sticky ? getStickyPosition(columnIndex, width) : 'unset',
                  borderRight: (theme) => (withRightBorder ? `1px solid ${theme.palette.border.default}` : ''),
                },
                ...convertSxToArray(sx),
              ]}
            />
          );
        },
      )}
    </TableRow>
  );
};
export default RichTableDragAndDropRow;
