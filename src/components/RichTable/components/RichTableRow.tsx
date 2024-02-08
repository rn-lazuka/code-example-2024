import { Fragment, memo, ReactNode } from 'react';
import { isEqual } from 'lodash';
import TableRow from '@mui/material/TableRow';
import { RichTableCell } from '@components/RichTable';
import { convertSxToArray } from '@utils/converters';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import type { Column, Pagination, Row, WithSx } from '@types';
import { Theme } from '@mui/material/styles';

type RichTableRowProps = {
  rowKey: string | number;
  rowIndex: number;
  row: Row;
  columns: WithSx<Column[]>;
  pagination?: Pagination;
  columnWidthSum: number;
  columnsWithoutWidth: number;
  collapsableRow?: boolean;
  isCollapsed: boolean;
  renderCollapsableRow?: (item: Row, collapseAllRowsHandler: () => void) => ReactNode;
  collapseAllRows: () => void;
  toggleCollapsedRow: (key: string) => void;
  onRowSelectCallback: (row: Row) => void;
  isRowChecked?: boolean;
  isIndeterminate?: boolean;
  rowCheckboxDisabledCondition?: (rowData: Row) => boolean;
  getStickyPosition: (index: number, width?: number) => 'unset' | number;
  extraRowProps: any;
  getCellAdditionalStyles: ({ theme, isCollapsed }: { theme: Theme; isCollapsed?: boolean }) => Object;
};

export function RichTableRowPropsAreEqual(prevProps: RichTableRowProps, nextProps: RichTableRowProps) {
  return (
    prevProps.rowKey === nextProps.rowKey &&
    prevProps.rowIndex === nextProps.rowIndex &&
    isEqual(prevProps.row, nextProps.row) &&
    isEqual(prevProps.columns, nextProps.columns) &&
    isEqual(prevProps.pagination, nextProps.pagination) &&
    isEqual(prevProps.extraRowProps, nextProps.extraRowProps) &&
    prevProps.columnWidthSum === nextProps.columnWidthSum &&
    prevProps.columnsWithoutWidth === nextProps.columnsWithoutWidth &&
    prevProps.collapsableRow === nextProps.collapsableRow &&
    prevProps.isCollapsed === nextProps.isCollapsed &&
    prevProps.renderCollapsableRow === nextProps.renderCollapsableRow &&
    prevProps.collapseAllRows === nextProps.collapseAllRows &&
    prevProps.onRowSelectCallback === nextProps.onRowSelectCallback &&
    prevProps.isRowChecked === nextProps.isRowChecked &&
    prevProps.isIndeterminate === nextProps.isIndeterminate &&
    prevProps.rowCheckboxDisabledCondition === nextProps.rowCheckboxDisabledCondition &&
    prevProps.getStickyPosition === nextProps.getStickyPosition &&
    prevProps.getCellAdditionalStyles === nextProps.getCellAdditionalStyles
  );
}
export const RichTableRow = memo(
  ({
    rowKey,
    rowIndex,
    row,
    columns,
    pagination,
    columnWidthSum,
    columnsWithoutWidth,
    collapsableRow,
    renderCollapsableRow,
    isCollapsed,
    collapseAllRows,
    toggleCollapsedRow,
    onRowSelectCallback,
    isRowChecked,
    isIndeterminate,
    rowCheckboxDisabledCondition,
    getStickyPosition,
    extraRowProps,
    getCellAdditionalStyles,
  }: RichTableRowProps) => {
    return (
      <Fragment key={rowKey}>
        <TableRow
          {...extraRowProps}
          sx={[
            (theme) => ({
              '& > td': getCellAdditionalStyles({ theme, isCollapsed }),
            }),
            extraRowProps?.sx,
          ]}
        >
          {columns.map(
            (
              {
                id,
                sticky,
                width,
                maxWidth,
                minWidth,
                cellType,
                format,
                sx,
                cellCallback,
                withRightBorder,
                dotsTextOverflow = true,
                multiLines = false,
                renderCondition,
                disabled,
              },
              columnIndex,
            ) => {
              return (
                <RichTableCell
                  key={`${rowIndex}-${id}-${columnIndex}`}
                  disabled={disabled}
                  rowKey={`${rowKey}`}
                  rowIndex={rowIndex}
                  sticky={sticky}
                  width={width}
                  minWidth={minWidth}
                  maxWidth={maxWidth}
                  cellType={cellType}
                  cellCallback={cellCallback}
                  renderCondition={renderCondition}
                  format={format}
                  pagination={pagination}
                  sx={[
                    (theme) => ({
                      width: width ? width : `calc((100% - ${columnWidthSum}px) / ${columnsWithoutWidth})`,
                      maxWidth: maxWidth ? maxWidth : `calc((100% - ${columnWidthSum}px) / ${columnsWithoutWidth})`,
                      minWidth: minWidth ? minWidth : `calc((100% - ${columnWidthSum}80px) / ${columnsWithoutWidth})`,
                      left: sticky ? getStickyPosition(columnIndex, width) : 'unset',
                      borderRight: withRightBorder ? `1px solid ${theme.palette.border.default}` : '',
                    }),
                    ...convertSxToArray(sx),
                  ]}
                  data={row[id]}
                  fullData={row}
                  isCollapsed={isCollapsed}
                  toggleCollapse={toggleCollapsedRow}
                  onRowSelect={() => onRowSelectCallback(row)}
                  checked={isRowChecked}
                  isIndeterminate={isIndeterminate}
                  dotsTextOverflow={dotsTextOverflow}
                  multiLines={multiLines}
                  rowCheckboxDisabledCondition={rowCheckboxDisabledCondition}
                />
              );
            },
          )}
        </TableRow>
        {collapsableRow && renderCollapsableRow && (
          <TableRow
            sx={{
              backgroundColor: (theme) => theme.palette.surface.default,
              '& td ': {
                borderBottom: !isCollapsed ? 'none' : '1px solid rgba(224,224,224,1)',
              },
            }}
          >
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} />
            <TableCell colSpan={columns.length} style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Collapse in={isCollapsed} timeout="auto" unmountOnExit>
                {renderCollapsableRow(row, collapseAllRows)}
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  },
  RichTableRowPropsAreEqual,
);
