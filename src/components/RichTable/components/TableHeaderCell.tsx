import { memo, PropsWithChildren, useRef, useState } from 'react';
import ReactDraggable from 'react-draggable';
import { useDrag, useDrop } from 'react-dnd';
import type { TableCellProps } from '@mui/material/TableCell';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WithSx } from '@types';
import { CellType } from '@enums';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import { convertSxToArray } from '@utils/converters/mui';
import CollapseAllButton from '@components/CollapseAllButton/CollapseAllButton';

type TableHeaderCellProps = PropsWithChildren<
  WithSx<{
    index: number;
    onMoveColumn: (index: number, newIndex: number) => void;
    onResize: (index: number, width: number) => void;
    width?: number;
    minWidth?: number | string;
    maxWidth?: number | string;
    sticky?: boolean;
    stickyHeader?: boolean;
    align?: string;
    cellType?: CellType;
    checked?: boolean;
    checkboxIsDisabled?: boolean;
    indeterminate?: boolean;
    collapseAllControl?: boolean;
    onAllRowsSelect?: () => void;
    isAllCollapsed?: boolean;
    onCollapseAll?: () => void;
    format?: (value: string, fullData: any) => any;
    disableMoving?: boolean;
    formatLabel?: (value: string, fullData: any) => any;
  }>
> &
  TableCellProps;

export const TableHeaderCell = memo(
  ({
    index,
    onMoveColumn,
    onResize,
    width = 80,
    minWidth,
    maxWidth,
    disableMoving = false,
    stickyHeader = false,
    collapseAllControl = false,
    sticky = false,
    align = 'left',
    children,
    cellType,
    format,
    checked,
    checkboxIsDisabled = false,
    indeterminate,
    onAllRowsSelect,
    isAllCollapsed = false,
    onCollapseAll = () => {},
    sx = [],
    ...restProps
  }: TableHeaderCellProps) => {
    const ref = useRef();
    const [canDrag, setCanDrag] = useState(true);
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: 'DraggableColumn',
      collect: (monitor: any) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: ' drop-over',
        };
      },
      drop: (item: any) => {
        if (disableMoving) return;
        onMoveColumn(item.index, index);
      },
    });
    const [, drag] = useDrag({
      type: 'DraggableColumn',
      canDrag: canDrag,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));

    const renderCellLabel = () => {
      if (cellType === CellType.Checkbox) {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Checkbox
              disabled={checkboxIsDisabled}
              checked={checked}
              onChange={onAllRowsSelect}
              indeterminate={indeterminate}
              sx={{ p: 0, borderRadius: 0 }}
            />
            <Typography variant="labelSCaps" sx={{ color: (theme) => theme.palette.text.darker }}>
              {children}
            </Typography>
          </Stack>
        );
      }

      if (cellType === CellType.Primary) {
        return (
          <Typography variant="labelM" sx={{ color: (theme) => theme.palette.primary.dark }}>
            {children}
          </Typography>
        );
      }

      if (cellType === CellType.CollapseControl && collapseAllControl) {
        return <CollapseAllButton onClick={onCollapseAll} isAllCollapsed={isAllCollapsed} />;
      }

      return (
        <Typography variant="labelSCaps" sx={{ color: (theme) => theme.palette.text.darker }}>
          {children}
        </Typography>
      );
    };

    return (
      <TableCell
        ref={
          !disableMoving && cellType !== CellType.CollapseControl && cellType !== CellType.DragAndDrop ? ref : undefined
        }
        className={isOver ? dropClassName : ''}
        sx={[
          (theme) => ({
            px: 2,
            position: sticky || stickyHeader ? 'sticky' : 'relative',
            width: width,
            ...(minWidth ? { minWidth } : {}),
            ...(maxWidth ? { maxWidth } : {}),
            height: theme.spacing(7),
            zIndex: sticky ? 3 : 2,
            bgcolor: cellType === CellType.Primary ? theme.palette.primary.light : theme.palette.surface.default,
            textAlign: align,
            borderRight: sticky ? `solid 1px ${theme.palette.border.default}` : 'unset',
            cursor:
              !disableMoving && cellType !== CellType.CollapseControl && cellType !== CellType.DragAndDrop
                ? 'move'
                : 'unset',
            '&:last-child': {
              pr: 3,
            },
            '&:first-child': {
              pl: 3,
            },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:hover div:last-child': {
              borderRight: disableMoving ? 'initial' : `solid 1px ${theme.palette.border.default}`,
            },
            '&.drop-over': {
              zIndex: 10,
              borderLeft: `2px dashed ${theme.palette.primary.main}`,
            },
          }),
          ...convertSxToArray(sx),
        ]}
        {...restProps}
      >
        {renderCellLabel()}
        {!disableMoving && cellType !== CellType.CollapseControl && cellType !== CellType.DragAndDrop && (
          <ReactDraggable
            axis="x"
            defaultClassName="ReactDragHandle"
            defaultClassNameDragging="ReactDragHandleActive"
            onStop={(event, data) => {
              setCanDrag(true);
              return onResize(index, width + data.x);
            }}
            onMouseDown={() => setCanDrag(false)}
            onStart={() => setCanDrag(false)}
            position={{
              x: 0,
              y: 0,
            }}
          >
            <Box
              sx={(theme) => ({
                cursor: 'col-resize',
                position: 'absolute',
                right: 0,
                top: 0,
                width: theme.spacing(1),
                height: 1,
              })}
            />
          </ReactDraggable>
        )}
      </TableCell>
    );
  },
);
