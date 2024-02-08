import { TableHeaderCell } from './TableHeaderCell';
import TableRow from '@mui/material/TableRow';
import { WithSx, Column } from '@types';
import { convertSxToArray } from '@utils/converters/mui';

type TableHeaderRowProps = {
  columns: WithSx<Column>[];
  handleMoveColumn: () => any;
  handleResize: (index: number, width: number) => any;
  stickyHeader: boolean;
  getStickyPosition: (index: number, width?: number) => any;
};

export const TableHeaderRow = ({
  columns,
  handleMoveColumn,
  handleResize,
  getStickyPosition,
  stickyHeader,
}: TableHeaderRowProps) => {
  return (
    <TableRow>
      {columns.map(
        (
          { id, align, label, sx, cellCallback, withRightBorder, format, formatLabel, dotsTextOverflow, ...column },
          index,
        ) => (
          <TableHeaderCell
            key={id}
            index={index}
            onMoveColumn={handleMoveColumn()}
            onResize={handleResize as any}
            stickyHeader={stickyHeader}
            align={align}
            {...column}
            sx={[
              ...convertSxToArray(sx),
              {
                left: column.sticky ? getStickyPosition(index, column.width) : 'unset',
                borderRight: (theme) => (withRightBorder ? `1px solid ${theme.palette.border.default}` : ''),
              },
            ]}
          >
            {formatLabel ? formatLabel(label, column) : label}
          </TableHeaderCell>
        ),
      )}
    </TableRow>
  );
};
