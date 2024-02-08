import { ReactNode } from 'react';
import { WithSx } from '@types';
import { CellType, RowType } from '@enums';

export interface TableConfig {
  sx?: any;
  width?: number;
  maxWidth?: number | string;
  minWidth?: number | string;
  align?: 'right' | 'left';
  sticky?: boolean;
  format?: (value: any, fullData: any) => any;
  formatLabel?: (value: string, fullData: any) => any;
  cellCallback?: (props: any) => void;
  sortableCallback?: () => void;
  cellType?: CellType;
  collapseAllControl?: boolean;
}

export interface Column extends TableConfig {
  id: string;
  label: string;
  withRightBorder?: boolean;
  dotsTextOverflow?: boolean;
  multiLines?: boolean;
  disabled?: boolean;
  disableMoving?: boolean;
  renderCondition?: (data: any) => boolean;
  disableSelectAll?: boolean;
}

export interface Row {
  [key: string]: any;
  rowType?: RowType;
  payload?: ReactNode;
  rowCategoryParams?: WithSx<{
    [key: string]: any;
  }>;
  id: string | number;
}

export interface DragItem {
  index: number;
  type: string;
}
