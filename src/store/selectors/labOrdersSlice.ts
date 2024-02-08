import { ERROR_CODES } from '@constants/global';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@types';

export const selectorIsAllLabOrdersFiltersValid = createSelector(
  (state: RootState) => state.labOrders.filtersError,
  (filtersError) =>
    Object.keys(filtersError).every((errorKey) => {
      return !filtersError[errorKey];
    }),
);

export const selectorLabOrdersS3AntivirusErrors = createSelector(
  (state: RootState) => state.labOrders.errors,
  (errors) =>
    errors.filter((error) => error?.code === ERROR_CODES.S3_FILE_IS_NOT_FOUND).map((error) => error.rejectedValue),
);
