import i18n from 'i18next';
import uniqId from 'uniqid';
import { format } from 'date-fns';
import { CellType, RowType } from '@enums';
import { getEmptyColumn } from '@utils';
import { getColumnSizes } from '../table';
import React from 'react';
import { LabResultTableColumnLabel } from '@components/pages/PatientProfile/subPages/LabResults/LabResultTableColumnLabel';
import Typography from '@mui/material/Typography';

export const convertLabResultsToTableFormat = (
  labResultsList,
  specifications,
  { tLabResultsTestSetName, tLabResultsTestValue, tLabResultsMeasurements },
) => {
  if (!labResultsList.length) return { data: [], columns: [], preColumns: [], nextColumns: [] };

  const columnWidth = 242;

  const columns = [
    {
      id: 'label',
      label: i18n.t('labOrders:tables.resultsView.procedureTest'),
      ...getColumnSizes(columnWidth),
      cellType: CellType.Primary,
      sticky: true,
    },
    {
      id: 'range',
      label: '',
      format: (_, data) => data.range,
      cellType: CellType.Primary,
      ...getColumnSizes(columnWidth),
    },
    ...sortByCompletedAt(
      labResultsList.map(({ procedureName, completedAt, labOrderId, filePresent }) => {
        return {
          id: labOrderId,
          label: (
            <LabResultTableColumnLabel
              procedureName={procedureName}
              labOrderId={labOrderId}
              filePresent={filePresent}
            />
          ),
          completedAt,
          cellType: CellType.Primary,
          ...getColumnSizes(columnWidth),
        };
      }),
    ),
  ];
  const preColumns = [
    getEmptyColumn({ sticky: true, width: 242, minWidth: 242, maxWidth: 242 }),
    getEmptyColumn({ label: i18n.t('labOrders:tables.resultsView.range') }),
    ...sortByCompletedAt(
      labResultsList.map(({ completedAt }) => {
        return {
          id: uniqId(),
          label: format(new Date(completedAt), 'dd/MM/yyyy'),
          completedAt,
          ...getColumnSizes(columnWidth),
        };
      }),
    ),
  ];
  const nextColumns = [
    getEmptyColumn({
      label: i18n.t('labOrders:tables.resultsView.labName'),
      sticky: true,
      width: 242,
      minWidth: 242,
      maxWidth: 242,
    }),
    getEmptyColumn(),
    ...sortByCompletedAt(
      labResultsList.map(({ completedAt, labName }) => {
        return {
          id: uniqId(),
          label: labName,
          completedAt,
          ...getColumnSizes(columnWidth),
        };
      }),
    ),
  ];

  const data = specifications.reduce((rows, { categoryCode, ranges }) => {
    const categoryRow = {
      id: uniqId(),
      label: tLabResultsTestSetName(categoryCode),
      rowType: RowType.Category,
      rowCategoryParams: {
        ...getColumnSizes(columnWidth),
        sticky: true,
      },
    };
    const categorySubRows = sortByOrder(
      ranges.map(({ code: rangeCode, name, range, measurement, order }) => ({
        id: uniqId(),
        label: name || tLabResultsTestValue(rangeCode),
        order,
        ...labResultsList.reduce(
          (result, { labOrderId, testSets }) => {
            const categoryTests = testSets.find((testSet) => testSet.categoryCode === categoryCode)?.tests || [];
            const test = categoryTests.find((test) => test.code === rangeCode);
            return {
              ...result,
              [labOrderId]:
                test?.value && test?.isAbnormal ? (
                  <Typography variant="labelMSB">{test?.value}</Typography>
                ) : (
                  test?.value
                ),
            };
          },
          {
            range:
              range || measurement ? (
                <React.Fragment key={uniqId()}>
                  {range ? `${range} ` : ''}
                  {convertLabResultMeasurementToRender(tLabResultsMeasurements(measurement) || '')}
                </React.Fragment>
              ) : null,
          },
        ),
      })),
    );
    return [...rows, categoryRow, ...categorySubRows];
  }, []);

  return {
    columns,
    preColumns,
    nextColumns,
    data,
  } as any;
};

const convertLabResultMeasurementToRender = (measurement: string) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: measurement.replace(/\^(\d*)/g, (_, value) => {
          return `<span style="vertical-align: super;">${value}</span>`;
        }),
      }}
    />
  );
};

const sortByOrder = (arr: { [key: string]: any; order: number }[]) => {
  return arr.sort((test1, test2) => {
    if (test1.order > test2.order) return 1;
    if (test1.order < test2.order) return -1;
    return 0;
  });
};

const sortByCompletedAt = (arr: { [key: string]: any; completedAt: number }[]) => {
  return arr.sort((test1, test2) => {
    const completedAt1 = new Date(test1.completedAt).getTime();
    const completedAt2 = new Date(test2.completedAt).getTime();
    if (completedAt1 > completedAt2) return 1;
    if (completedAt1 < completedAt2) return -1;
    return 0;
  });
};
