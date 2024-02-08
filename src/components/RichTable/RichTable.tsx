import type { PropsWithChildren, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from 'react';
import update from 'immutability-helper';
import uniqId from 'uniqid';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import LinearProgress from '@mui/material/LinearProgress';
import { TableHeaderCell, TableHeaderRow, EmptyDataBody } from '@components';
import type { PaginationComponentProps } from '@components';
import type { Column, Row, WithSx } from '@types';
import { RowType } from '@enums';
import { convertSxToArray } from '@utils/converters/mui';
import { dotsTextOverflowStyles } from '@utils/styles';
import { RichTableCategoryRow } from '@components/RichTable/components/RichTableCategoryRow';
import { RichTableRow } from '@components/RichTable/components/RichTableRow';
import { RichTableDraggableRow } from '@components/RichTable/components/RichTableDraggableRow';
import { Theme } from '@mui/material/styles';

const PaginationComponent = lazy(() => import('@components/RichTable/components/PaginationComponent'));

interface CheckboxStatusesAccumulator {
  headerCheckboxIsDisabled: boolean;
  isAllChecked: boolean;
  isPartialChecked: boolean;
  amountOfChecked: 0;
  collapsableRows: string[];
}

interface ColumnWidthAccumulator {
  columnWidthSum: number;
  columnsWithoutWidth: number;
}

type RichTableProps = PropsWithChildren<
  WithSx<{
    tableContainerProps?: WithSx<{}>;
    renderBody?: boolean;
    preColumns?: WithSx<Column>[];
    nextColumns?: WithSx<Column>[];
    columns: WithSx<Column[]>;
    rows: Row[];
    collapsableRow?: boolean;
    enableRowOrdering?: boolean;
    onDragEnd?: (list: any) => void;
    multipleCollapse?: boolean;
    renderCollapsableRow?: (item: any, collapseAllRowsHandler: () => void) => ReactNode;
    stickyHeader?: boolean;
    fullScreen?: boolean;
    headerDivider?: boolean;
    isDataLoading: boolean;
    defaultHeaderContainer?: boolean;
    rowExtraProps?: {
      condition: (data?: any) => boolean;
      props: any;
    }[];
    selectedRows?: (number | string)[];
    indeterminateRows?: (number | string)[];
    onRowSelect?: (id: number | string) => void;
    onAllRowsSelect?: () => void;
    multiPagination?: boolean;
    isOuterPaginationHandler?: boolean;
    emptyBodyBGColor?: string;
    emptyDataBodyText?: string;
    emptyBodyProps?: any;
    rowCheckboxDisabledCondition?: (rowData: any) => boolean;
    renderPaginationPlaceholder?: boolean;
  }>
> &
  Partial<Omit<PaginationComponentProps, 'isSticky'>>;

export const RichTable = ({
  tableContainerProps = {},
  renderBody = true,
  preColumns = [],
  nextColumns = [],
  stickyHeader = false,
  collapsableRow = false,
  enableRowOrdering = false,
  onDragEnd,
  multipleCollapse = false,
  renderCollapsableRow,
  rows,
  columns,
  isDataLoading,
  defaultHeaderContainer = true,
  children,
  fullScreen,
  headerDivider,
  sx,
  pagination,
  multiPagination = false,
  isOuterPaginationHandler = false,
  onChangePage,
  onChangeRowsPerPage,
  rowExtraProps,
  selectedRows,
  indeterminateRows,
  onRowSelect,
  onAllRowsSelect,
  emptyBodyBGColor,
  emptyDataBodyText,
  emptyBodyProps,
  rowCheckboxDisabledCondition,
  renderPaginationPlaceholder = false,
}: RichTableProps) => {
  const [tableData, setTableData] = useState({
    preColumns,
    columns,
    nextColumns,
    rows,
  });
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set());
  const collapseAllRows = useCallback(() => setCollapsedRows(new Set()), []);

  const tableRows = useMemo(() => tableData.rows, [tableData.rows]);
  const tableColumns = useMemo(() => tableData.columns, [tableData.columns]);

  const { headerCheckboxIsDisabled, isAllChecked, isPartialChecked, collapsableRows } = useMemo(() => {
    const selectedRowsLength = selectedRows?.length || 0;
    const indeterminateRowsLength = indeterminateRows?.length || 0;

    const { headerCheckboxIsDisabled, amountOfChecked, collapsableRows } = tableRows.reduce(
      (acc: CheckboxStatusesAccumulator, rowData) => {
        const nextAcc = { ...acc };
        const isDisabled = rowCheckboxDisabledCondition ? rowCheckboxDisabledCondition(rowData) : false;

        if (!rowData.nonCollapsable && rowData.id) nextAcc.collapsableRows.push(rowData.id.toString());

        if (!rowData?.nonCheckable && !isDisabled) {
          nextAcc.headerCheckboxIsDisabled = false;
          nextAcc.amountOfChecked += 1;
        }
        return nextAcc;
      },
      {
        headerCheckboxIsDisabled: true,
        isAllChecked: false,
        isPartialChecked: false,
        amountOfChecked: 0,
        collapsableRows: [],
      } as CheckboxStatusesAccumulator,
    );

    return {
      headerCheckboxIsDisabled,
      isAllChecked: selectedRowsLength > 0 && selectedRowsLength === amountOfChecked,
      isPartialChecked:
        (selectedRowsLength > 0 && amountOfChecked > 0 && amountOfChecked !== selectedRowsLength) ||
        indeterminateRowsLength > 0,
      collapsableRows,
    };
  }, [tableRows, selectedRows, indeterminateRows]);

  const { columnWidthSum, columnsWithoutWidth } = useMemo(
    () =>
      tableColumns.reduce(
        (sum: ColumnWidthAccumulator, col: Column) => ({
          columnWidthSum: col?.width ? sum.columnWidthSum + col.width : sum.columnWidthSum,
          columnsWithoutWidth: col?.width ? sum.columnsWithoutWidth++ : sum.columnsWithoutWidth,
        }),
        { columnWidthSum: 0, columnsWithoutWidth: 0 } as ColumnWidthAccumulator,
      ),
    [tableColumns],
  );

  useEffect(() => {
    if (rows && columns) {
      setTableData({ columns, preColumns, nextColumns, rows });
    }
  }, [rows, columns, collapsableRow]);

  const getStickyPosition = useCallback(
    (index: number, width?: number) => {
      if (!width) return 'unset';
      if (index === 0) return 0;
      let position = 0;
      for (let i = index; i >= 1; i--) {
        if (tableColumns[i - 1].sticky) {
          position += tableColumns[i - 1].width ?? 0;
        }
      }
      return position;
    },
    [tableColumns],
  );

  const handleResize = useCallback(
    (index: number, width: number) => {
      setTableData((prevState) => {
        const newColumns = [...prevState.columns];
        const newPreColumns = [...prevState.preColumns];
        const newNextColumns = [...prevState.nextColumns];
        if (newPreColumns[index]) {
          newPreColumns[index] = {
            ...newPreColumns[index],
            width,
            minWidth: width,
            maxWidth: width,
          };
        }
        if (newColumns[index]) {
          newColumns[index] = {
            ...newColumns[index],
            width,
            minWidth: width,
            maxWidth: width,
          };
        }
        if (newNextColumns[index]) {
          newNextColumns[index] = {
            ...newNextColumns[index],
            width,
            minWidth: width,
            maxWidth: width,
          };
        }
        return { ...prevState, columns: newColumns, preColumns: newPreColumns, nextColumns: newNextColumns };
      });
    },
    [setTableData],
  );

  const handleMoveColumn = useCallback(
    () => (dragIndex: number, hoverIndex: number) => {
      setTableData((prevState) => {
        const dragColumn = prevState.columns[dragIndex];

        return {
          ...prevState,
          columns: update(prevState.columns, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragColumn],
            ],
          }),
          preColumns: prevState?.preColumns?.length
            ? update(prevState.preColumns, {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, prevState.preColumns[dragIndex]],
                ],
              })
            : prevState.preColumns,
          nextColumns: prevState?.nextColumns?.length
            ? update(prevState.nextColumns, {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, prevState.nextColumns[dragIndex]],
                ],
              })
            : prevState.nextColumns,
        };
      });
    },
    [setTableData],
  );

  const toggleCollapsedRow = useCallback(
    (key: string) => {
      setCollapsedRows((collapsedList) => {
        const cloneCollapsedRows = new Set(collapsedList);
        if (cloneCollapsedRows.has(key)) {
          cloneCollapsedRows.delete(key);
          return cloneCollapsedRows;
        } else {
          !multipleCollapse && cloneCollapsedRows.clear();
          cloneCollapsedRows.add(key);
          return cloneCollapsedRows;
        }
      });
    },
    [multipleCollapse, setCollapsedRows],
  );

  const toggleAllCollapsedRows = useCallback(() => {
    if (collapsedRows.size !== collapsableRows.length) {
      setCollapsedRows(new Set(collapsableRows));
    } else {
      collapseAllRows();
    }
  }, [collapsedRows, collapsableRows]);

  const getCellAdditionalStyles = useCallback(
    ({ theme, isCollapsed = false, isCategoryTitle = false }) => {
      if (isCategoryTitle) return { backgroundColor: (theme: Theme) => theme.palette.background.default };
      if (collapsableRow)
        return { backgroundColor: isCollapsed ? 'rgba(233, 240, 246, 1)' : theme.palette.surface.default };
      return {};
    },
    [collapsableRow],
  );

  const getExtraRowProps = useCallback(
    (row): any => {
      return rowExtraProps?.reduce(
        (rowPropsData, rowCondition) =>
          rowCondition.condition(row) ? { ...rowPropsData, ...rowCondition.props } : rowPropsData,
        {},
      );
    },
    [rowExtraProps],
  );

  const getRowCategoryParams = useCallback((row) => {
    return row && row.rowCategoryParams ? row.rowCategoryParams : {};
  }, []);

  const onRowSelectCallback = useCallback(
    (row) => {
      if (onRowSelect) {
        return onRowSelect(row.id);
      }
    },
    [onRowSelect],
  );

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setTableData((prevState) => {
        const dragRows = prevState.rows[dragIndex];
        const updatedRows = update(prevState.rows, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRows],
          ],
        });
        const updatedTableData = {
          ...prevState,
          rows: updatedRows,
        };
        if (onDragEnd) {
          onDragEnd(updatedRows);
        }
        return updatedTableData;
      });
    },
    [setTableData, onDragEnd],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <TableContainer
        {...tableContainerProps}
        sx={[
          (theme) => ({ backgroundColor: theme.palette.surface.default }),
          !tableRows.length &&
            (() => ({
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            })),
          ...convertSxToArray(tableContainerProps?.sx || {}),
        ]}
      >
        {children && defaultHeaderContainer && (
          <Box
            sx={{
              position: 'sticky',
              left: 0,
              px: 3,
              py: 2,
              zIndex: 10,
              borderBottom: (theme) => (headerDivider ? `solid 1px ${theme.palette.border.default}` : 'initial'),
            }}
          >
            {children}
          </Box>
        )}
        {!defaultHeaderContainer && children}

        {renderBody ? (
          <>
            {!tableData.rows.length ? (
              <EmptyDataBody
                bgcolor={emptyBodyBGColor}
                emptyDataBodyText={emptyDataBodyText}
                loading={isDataLoading}
                {...emptyBodyProps}
              />
            ) : (
              <>
                {multiPagination && pagination && onChangePage && onChangeRowsPerPage && (
                  <Suspense fallback={<div></div>}>
                    <PaginationComponent
                      pagination={pagination}
                      isOuterPaginationHandler={isOuterPaginationHandler}
                      onChangePage={onChangePage}
                      onChangeRowsPerPage={onChangeRowsPerPage}
                      isSticky
                    />
                  </Suspense>
                )}
                <Table
                  stickyHeader={stickyHeader}
                  aria-label="sticky table"
                  sx={[{ width: fullScreen ? '100%' : 'unset' }, ...convertSxToArray(sx)]}
                >
                  <TableHead sx={{ position: stickyHeader ? 'sticky' : 'initial', zIndex: 10, top: 0 }}>
                    {!!tableData?.preColumns?.length && (
                      <TableHeaderRow
                        columns={tableData.preColumns}
                        stickyHeader={stickyHeader}
                        getStickyPosition={getStickyPosition}
                        handleMoveColumn={handleMoveColumn}
                        handleResize={handleResize}
                      />
                    )}
                    <TableRow>
                      {tableColumns.map(
                        (
                          {
                            id,
                            align,
                            label,
                            cellCallback,
                            withRightBorder,
                            dotsTextOverflow = true,
                            sx,
                            disableSelectAll,
                            ...column
                          },
                          index,
                        ) => (
                          <TableHeaderCell
                            key={uniqId()}
                            index={index}
                            onMoveColumn={handleMoveColumn()}
                            onResize={handleResize as any}
                            stickyHeader={stickyHeader}
                            align={align}
                            checkboxIsDisabled={disableSelectAll ? disableSelectAll : headerCheckboxIsDisabled}
                            checked={isAllChecked}
                            indeterminate={isPartialChecked}
                            onCollapseAll={toggleAllCollapsedRows}
                            isAllCollapsed={collapsedRows?.size === collapsableRows.length}
                            onAllRowsSelect={onAllRowsSelect}
                            {...column}
                            sx={[
                              {
                                width: column?.width
                                  ? column.width
                                  : `calc((100% - ${columnWidthSum}px) / ${columnsWithoutWidth})`,
                                maxWidth: column?.maxWidth
                                  ? column.maxWidth
                                  : `calc((100% - ${columnWidthSum}px) / ${columnsWithoutWidth})`,
                                minWidth: column?.minWidth
                                  ? column.minWidth
                                  : `calc((100% - ${columnWidthSum}px) / ${columnsWithoutWidth})`,
                                left: column.sticky ? getStickyPosition(index, column.width) : 'unset',
                                borderRight: (theme) =>
                                  withRightBorder ? `1px solid ${theme.palette.border.default}` : '',
                              },
                              dotsTextOverflow && dotsTextOverflowStyles,
                              ...convertSxToArray(sx),
                            ]}
                          >
                            {label}
                          </TableHeaderCell>
                        ),
                      )}
                    </TableRow>
                    {!!tableData?.nextColumns?.length && (
                      <TableHeaderRow
                        columns={tableData.nextColumns}
                        stickyHeader={stickyHeader}
                        getStickyPosition={getStickyPosition}
                        handleMoveColumn={handleMoveColumn}
                        handleResize={handleResize}
                      />
                    )}
                    {isDataLoading && (
                      <TableRow
                        sx={[
                          (theme) => ({ height: theme.spacing(0.5), position: 'relative', zIndex: 4 }),
                          stickyHeader &&
                            ((theme) => ({
                              position: 'sticky',
                              left: 0,
                              top: theme.spacing(7),
                            })),
                        ]}
                      >
                        <TableCell padding="none" colSpan={columns.length}>
                          <LinearProgress sx={{ width: '100%', position: 'absolute', left: 0, bottom: 0 }} />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableHead>
                  <TableBody
                    sx={(theme) => ({
                      '& .MuiTableRow-hover:hover td': {
                        bgcolor: theme.palette.border.default,
                      },
                    })}
                  >
                    {tableRows.map((row, rowIndex) => {
                      const rowKey = row?.id || rowIndex;
                      const isCollapsed = collapsedRows.has(row.id.toString());
                      const extraRowProps = getExtraRowProps(row);

                      if (row.rowType === RowType.Category) {
                        return (
                          <RichTableCategoryRow
                            key={rowKey}
                            rowKey={rowKey}
                            rowIndex={rowIndex}
                            row={row}
                            columns={tableColumns}
                            rowCheckboxDisabledCondition={rowCheckboxDisabledCondition}
                            getStickyPosition={getStickyPosition}
                            extraRowProps={extraRowProps}
                            getCellAdditionalStyles={getCellAdditionalStyles}
                            getRowCategoryParams={getRowCategoryParams}
                          />
                        );
                      }

                      if (enableRowOrdering) {
                        return (
                          <RichTableDraggableRow
                            key={rowKey}
                            rowKey={rowKey}
                            rowIndex={rowIndex}
                            row={row}
                            columns={tableColumns}
                            sx={sx}
                            columnWidthSum={columnWidthSum}
                            columnsWithoutWidth={columnsWithoutWidth}
                            extraRowProps={extraRowProps}
                            getStickyPosition={getStickyPosition}
                            moveRow={moveRow}
                          />
                        );
                      }

                      return (
                        <RichTableRow
                          key={rowKey}
                          rowKey={rowKey}
                          rowIndex={rowIndex}
                          row={row}
                          columns={tableColumns}
                          pagination={pagination}
                          columnWidthSum={columnWidthSum}
                          collapsableRow={collapsableRow}
                          renderCollapsableRow={renderCollapsableRow}
                          isCollapsed={isCollapsed}
                          collapseAllRows={collapseAllRows}
                          toggleCollapsedRow={toggleCollapsedRow}
                          onRowSelectCallback={onRowSelectCallback}
                          isRowChecked={selectedRows?.includes(rowKey)}
                          isIndeterminate={indeterminateRows?.includes(rowKey)}
                          rowCheckboxDisabledCondition={rowCheckboxDisabledCondition}
                          getStickyPosition={getStickyPosition}
                          columnsWithoutWidth={columnsWithoutWidth}
                          extraRowProps={extraRowProps}
                          getCellAdditionalStyles={getCellAdditionalStyles}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
                {pagination && onChangePage && onChangeRowsPerPage && (
                  <Suspense fallback={<div></div>}>
                    <PaginationComponent
                      renderPlaceholder={renderPaginationPlaceholder}
                      pagination={pagination}
                      isOuterPaginationHandler={isOuterPaginationHandler}
                      onChangePage={onChangePage}
                      onChangeRowsPerPage={onChangeRowsPerPage}
                      isSticky
                    />
                  </Suspense>
                )}
                {!pagination && renderPaginationPlaceholder && (
                  <Box data-testid="PaginationPlaceholder" sx={{ height: '56px' }} />
                )}
              </>
            )}
          </>
        ) : null}
      </TableContainer>
    </DndProvider>
  );
};
