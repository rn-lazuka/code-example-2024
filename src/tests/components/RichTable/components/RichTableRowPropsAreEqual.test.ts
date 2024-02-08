import { RichTableRowPropsAreEqual } from '../../../../components/RichTable/components/RichTableRow';
import { RichTableCategoryRowPropsAreEqual } from '../../../../components/RichTable/components/RichTableCategoryRow';
import { RichTableDragAndDropRowPropsAreEqual } from '../../../../components/RichTable/components/RichTableDraggableRow';

describe('RichTableRowPropsAreEqual', () => {
  const collapseAllRows = () => {};
  const getCellAdditionalStyles = () => ({});
  const getExtraRowProps = () => {};
  const getStickyPosition = () => 1;
  const onRowSelectCallback = () => {};
  const otherCollapseAllRows = () => {};

  const prevProps = {
    collapsableRow: false,
    collapseAllRows,
    columnWidthSum: 1314,
    columns: [{ id: 'id', label: 'label' }],
    columnsWithoutWidth: 0,
    getCellAdditionalStyles,
    getExtraRowProps,
    getStickyPosition,
    isCollapsed: false,
    isIndeterminate: undefined,
    isRowChecked: undefined,
    onRowSelectCallback,
    pagination: { currentPage: 0, perPage: 50, totalCount: 32 },
    renderCollapsableRow: undefined,
    row: { id: '123' },
    rowCheckboxDisabledCondition: undefined,
    rowIndex: 31,
    rowKey: 12475,
  };
  const nextProps = {
    collapsableRow: false,
    collapseAllRows,
    columnWidthSum: 1314,
    columns: [{ id: 'id', label: 'label' }],
    columnsWithoutWidth: 0,
    getCellAdditionalStyles,
    getExtraRowProps,
    getStickyPosition,
    isCollapsed: false,
    isIndeterminate: undefined,
    isRowChecked: undefined,
    onRowSelectCallback,
    pagination: { currentPage: 0, perPage: 50, totalCount: 32 },
    renderCollapsableRow: undefined,
    row: { id: '123' },
    rowCheckboxDisabledCondition: undefined,
    rowIndex: 31,
    rowKey: 12475,
  };

  it('should check is equal', () => {
    expect(RichTableRowPropsAreEqual(prevProps, nextProps)).toBe(true);
  });

  it('should check is not equal', () => {
    nextProps.collapseAllRows = otherCollapseAllRows;
    expect(RichTableRowPropsAreEqual(prevProps, nextProps)).toBe(false);

    nextProps.collapseAllRows = collapseAllRows;
    nextProps.row = { id: '1' };
    expect(RichTableRowPropsAreEqual(prevProps, nextProps)).toBe(false);
  });
});

describe('RichTableCategoryRowPropsAreEqual', () => {
  const getCellAdditionalStyles = () => ({});
  const getExtraRowProps = () => {};
  const getStickyPosition = () => 1;
  const getRowCategoryParams = () => {};
  const getOtherRowCategoryParams = () => {};

  const prevProps = {
    columns: [{ id: 'id', label: 'label' }],
    getCellAdditionalStyles,
    getExtraRowProps,
    getStickyPosition,
    getRowCategoryParams,
    row: { id: '123' },
    rowCheckboxDisabledCondition: undefined,
    rowIndex: 31,
    rowKey: 12475,
  };
  const nextProps = {
    columns: [{ id: 'id', label: 'label' }],
    getCellAdditionalStyles,
    getExtraRowProps,
    getStickyPosition,
    getRowCategoryParams,
    row: { id: '123' },
    rowCheckboxDisabledCondition: undefined,
    rowIndex: 31,
    rowKey: 12475,
  };

  it('should check is equal', () => {
    expect(RichTableCategoryRowPropsAreEqual(prevProps, nextProps)).toBe(true);
  });

  it('should check is not equal', () => {
    nextProps.getRowCategoryParams = getOtherRowCategoryParams;
    expect(RichTableCategoryRowPropsAreEqual(prevProps, nextProps)).toBe(false);

    nextProps.getRowCategoryParams = getRowCategoryParams;
    nextProps.row = { id: '1' };
    expect(RichTableCategoryRowPropsAreEqual(prevProps, nextProps)).toBe(false);
  });
});

describe('RichTableDragAndDropRowPropsAreEqual', () => {
  const getExtraRowProps = () => {};
  const getStickyPosition = () => 1;
  const moveRow = () => {};
  const otherMoveRow = () => {};

  const prevProps = {
    columns: [{ id: 'id', label: 'label' }],
    columnWidthSum: 1314,
    columnsWithoutWidth: 0,
    moveRow,
    getExtraRowProps,
    getStickyPosition,
    row: { id: '123' },
    rowIndex: 31,
    rowKey: 12475,
  };
  const nextProps = {
    columns: [{ id: 'id', label: 'label' }],
    columnWidthSum: 1314,
    columnsWithoutWidth: 0,
    moveRow,
    getExtraRowProps,
    getStickyPosition,
    row: { id: '123' },
    rowIndex: 31,
    rowKey: 12475,
  };

  it('should check is equal', () => {
    expect(RichTableDragAndDropRowPropsAreEqual(prevProps, nextProps)).toBe(true);
  });

  it('should check is not equal', () => {
    nextProps.moveRow = otherMoveRow;
    expect(RichTableDragAndDropRowPropsAreEqual(prevProps, nextProps)).toBe(false);

    nextProps.moveRow = moveRow;
    nextProps.row = { id: '1' };
    expect(RichTableDragAndDropRowPropsAreEqual(prevProps, nextProps)).toBe(false);
  });
});
