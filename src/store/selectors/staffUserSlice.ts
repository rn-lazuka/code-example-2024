import type { RootState } from '@types';
import { ERROR_CODES } from '@constants/global';
import { createSelector } from '@reduxjs/toolkit';

export const selectorStaffUserS3AntivirusErrors = createSelector(
  (state: RootState) => state.staffUser.errors,
  (errors) =>
    errors.filter((error) => error?.code === ERROR_CODES.S3_FILE_IS_NOT_FOUND).map((error) => error.rejectedValue),
);
