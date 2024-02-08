import type { Theme } from '@mui/material/styles';
import type { ChangeEvent, MouseEvent } from 'react';
import type { Pagination, WithSx } from '@types';
import type { ActionCreatorWithPayload, AnyAction } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import { useAppDispatch } from '@hooks/storeHooks';
import { convertSxToArray } from '@utils/converters/mui';
import { useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MinRowsPerPage } from '@constants/components';

export type PaginationComponentProps = WithSx<{
  pagination: Pagination;
  isOuterPaginationHandler?: boolean;
  onChangePage: ActionCreatorWithPayload<number> | ((number) => AnyAction);
  onChangeRowsPerPage: ActionCreatorWithPayload<number> | ((number) => AnyAction);
  isSticky?: boolean;
  renderPlaceholder?: boolean;
}>;

export const PaginationComponent = ({
  isSticky = false,
  pagination,
  isOuterPaginationHandler,
  onChangePage,
  onChangeRowsPerPage,
  renderPlaceholder = false,
  sx = [],
}: PaginationComponentProps) => {
  const dispatch = useAppDispatch();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const { t } = useTranslation('common');

  const isShowPagination = useMemo(() => {
    return pagination && pagination.totalCount >= MinRowsPerPage;
  }, [pagination]);

  if (isShowPagination) {
    const { perPage, currentPage, totalCount } = pagination;

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, pageNumber: number) => {
      isOuterPaginationHandler ? onChangePage(pageNumber) : dispatch(onChangePage(pageNumber));
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      isOuterPaginationHandler
        ? onChangeRowsPerPage(parseInt(event.target.value, 10))
        : dispatch(onChangeRowsPerPage(parseInt(event.target.value, 10)));
    };

    return (
      <TablePagination
        data-testid="pagination"
        component="div"
        count={totalCount}
        page={currentPage}
        labelRowsPerPage={t(isXs ? 'perPage' : 'rowsPerPage')}
        onPageChange={handleChangePage}
        rowsPerPage={perPage}
        rowsPerPageOptions={[20, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={[
          (theme) => ({
            '& .MuiTablePagination-toolbar': {
              minHeight: theme.spacing(7),
              '& .MuiInputBase-colorPrimary': {
                mr: { xs: 2, sm: 4 },
              },
              '& .MuiTablePagination-actions .MuiIconButton-root svg': {
                color: theme.palette.neutralVariant[40],
              },
              '& .MuiTablePagination-actions .Mui-disabled svg': {
                color: theme.palette.neutral[60],
              },
            },
            '& .MuiTablePagination-displayedRows': { minWidth: theme.spacing(12) },
            '& .MuiTablePagination-spacer': {
              flex: 'unset',
            },
          }),
          !!isSticky && {
            position: 'sticky',
            left: 0,
          },
          ...convertSxToArray(sx),
        ]}
      />
    );
  }
  if (renderPlaceholder) return <Box data-testid="PaginationPlaceholder" sx={{ height: '56px' }} />;
  return null;
};

export default PaginationComponent;
