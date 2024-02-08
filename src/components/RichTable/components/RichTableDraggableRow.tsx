import { Fragment, memo } from 'react';
import TableRow from '@mui/material/TableRow';
import { convertSxToArray } from '@utils/converters';
import { Column, Row, WithSx } from '@types';
import RichTableDragAndDropRow from '@components/RichTable/components/components/RichTableDragAndDropRow';
import { isEqual } from 'lodash';

export type RichTableDragAndDropRowProps = WithSx<{
  rowKey: string | number;
  rowIndex: number;
  row: Row;
  columns: WithSx<Column[]>;
  columnWidthSum: number;
  columnsWithoutWidth: number;
  extraRowProps: any;
  getStickyPosition: (index: number, width?: number) => 'unset' | number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}>;

export function RichTableDragAndDropRowPropsAreEqual(
  prevProps: RichTableDragAndDropRowProps,
  nextProps: RichTableDragAndDropRowProps,
) {
  return (
    prevProps.rowKey === nextProps.rowKey &&
    prevProps.rowIndex === nextProps.rowIndex &&
    isEqual(prevProps.row, nextProps.row) &&
    isEqual(prevProps.columns, nextProps.columns) &&
    isEqual(prevProps.extraRowProps, nextProps.extraRowProps) &&
    prevProps.columnWidthSum === nextProps.columnWidthSum &&
    prevProps.columnsWithoutWidth === nextProps.columnsWithoutWidth &&
    prevProps.getStickyPosition === nextProps.getStickyPosition &&
    prevProps.moveRow === nextProps.moveRow
  );
}

export const RichTableDraggableRow = memo(
  ({
    rowKey,
    row,
    columns,
    rowIndex,
    columnWidthSum,
    columnsWithoutWidth,
    extraRowProps,
    getStickyPosition,
    moveRow,
    sx,
  }: RichTableDragAndDropRowProps) => {
    return (
      <Fragment key={rowKey}>
        <TableRow {...extraRowProps} sx={[extraRowProps?.sx, ...convertSxToArray(sx)]} />
        <RichTableDragAndDropRow
          key={rowKey}
          id={rowKey}
          row={row}
          columns={columns}
          index={rowIndex}
          columnsWithoutWidth={columnsWithoutWidth}
          columnWidthSum={columnWidthSum}
          getStickyPosition={getStickyPosition}
          moveRow={moveRow}
        />
      </Fragment>
    );
  },
  RichTableDragAndDropRowPropsAreEqual,
);
