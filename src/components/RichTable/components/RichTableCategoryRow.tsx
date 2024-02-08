import { Fragment, memo } from 'react';
import { isEqual } from 'lodash';
import TableRow from '@mui/material/TableRow';
import { convertSxToArray } from '@utils/converters';
import { RichTableCell } from '@components/RichTable';
import { CellType } from '@enums/components';
import TableCell from '@mui/material/TableCell';
import type { Column, Row, WithSx } from '@types';
import { Theme } from '@mui/material/styles';

type RichTableCategoryRowProps = {
  rowKey: string | number;
  rowIndex: number;
  row: Row;
  columns: WithSx<Column[]>;
  rowCheckboxDisabledCondition?: (rowData: Row) => boolean;
  getStickyPosition: (index: number, width?: number) => 'unset' | number;
  extraRowProps: any;
  getCellAdditionalStyles: ({ theme, isCategoryTitle }: { theme: Theme; isCategoryTitle: boolean }) => Object;
  getRowCategoryParams: (row: Row) => any;
};

export function RichTableCategoryRowPropsAreEqual(
  prevProps: RichTableCategoryRowProps,
  nextProps: RichTableCategoryRowProps,
) {
  return (
    prevProps.rowKey === nextProps.rowKey &&
    prevProps.rowIndex === nextProps.rowIndex &&
    isEqual(prevProps.row, nextProps.row) &&
    isEqual(prevProps.columns, nextProps.columns) &&
    isEqual(prevProps.extraRowProps, nextProps.extraRowProps) &&
    prevProps.rowCheckboxDisabledCondition === nextProps.rowCheckboxDisabledCondition &&
    prevProps.getStickyPosition === nextProps.getStickyPosition &&
    prevProps.getCellAdditionalStyles === nextProps.getCellAdditionalStyles &&
    prevProps.getRowCategoryParams === nextProps.getRowCategoryParams
  );
}

export const RichTableCategoryRow = memo(
  ({
    rowKey,
    row,
    rowIndex,
    rowCheckboxDisabledCondition,
    getStickyPosition,
    columns,
    extraRowProps,
    getCellAdditionalStyles,
    getRowCategoryParams,
  }: RichTableCategoryRowProps) => {
    const { sx, ...props } = getRowCategoryParams(row);

    return (
      <Fragment key={rowKey}>
        <TableRow
          {...extraRowProps}
          sx={[
            {
              '& > td': (theme) => getCellAdditionalStyles({ theme, isCategoryTitle: true }),
            },
            extraRowProps?.sx,
            ...convertSxToArray(sx),
          ]}
        >
          <RichTableCell
            key={`${rowIndex}-${rowKey}`}
            rowKey={`${rowKey}`}
            rowIndex={rowIndex}
            data={row.label}
            fullData={row}
            cellType={CellType.CategoryTitle}
            rowCheckboxDisabledCondition={rowCheckboxDisabledCondition}
            {...props}
            sx={[
              {
                left: props?.sticky ? getStickyPosition(0, props?.width) : 'unset',
                borderRight: (theme) => `1px solid ${theme.palette.border.default}`,
              },
            ]}
          />
          <TableCell colSpan={columns.length} sx={convertSxToArray(row?.rowProps?.sx)} />
        </TableRow>
      </Fragment>
    );
  },
  RichTableCategoryRowPropsAreEqual,
);
