// @ts-nocheck
import { ERROR_CODES } from '../global/errors';

export const getAxiosResponseErrorCodeExceptionsList = async () => {
  const userManagementSharedConstants =
    MODULE_USER_MANAGEMENT_ACTIVE === true ? await import('UserManagement/UserManagementAxiosSharedConstants') : [];
  const billingAxiosSharedConstants =
    MODULE_BILLING_ACTIVE === true ? await import('Billing/BillingAxiosSharedConstants') : [];

  const userManagementErrorCodeExceptions =
    userManagementSharedConstants?.USER_MANAGEMENT_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST &&
    Array.isArray(userManagementSharedConstants?.USER_MANAGEMENT_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST)
      ? userManagementSharedConstants.USER_MANAGEMENT_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST
      : [];

  const billingErrorCodeExceptions =
    billingAxiosSharedConstants?.BILLING_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST &&
    Array.isArray(billingAxiosSharedConstants?.BILLING_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST)
      ? billingAxiosSharedConstants.BILLING_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST
      : [];

  return [
    ...userManagementErrorCodeExceptions,
    ...billingErrorCodeExceptions,
    ERROR_CODES.ERR_CANCELED,
    ERROR_CODES.ERR_NETWORK,
    ERROR_CODES.HD_PRESCRIPTION_CANNOT_BE_DELETED,
    ERROR_CODES.MEDICATION_CONFIRMATION_FREQUENCY_MISMATCH,
    ERROR_CODES.NO_APPOINTMENTS,
    ERROR_CODES.NEXT_HD_PRESCRIPTION_CANNOT_BE_FOUND,
    ERROR_CODES.LAB_ORDER_NUMBER_ALREADY_EXISTS,
    ERROR_CODES.PATIENT_IS_NOT_UNIQUE,
    ERROR_CODES.DEVICE_IS_NOT_UNIQUE,
    ERROR_CODES.DIALYSIS_CANNOT_BE_STARTED_WITHOUT_HD_ACCESS,
    ERROR_CODES.APPOINTMENT_HAS_OPEN_ENCOUNTER,
    ERROR_CODES.S3_FILE_IS_NOT_FOUND,
    ERROR_CODES.S3_ANTIVIRUS_ERROR,
  ];
};

export const getAxiosResponseErrorUrlExceptionList = async () => {
  const userManagementSharedConstants =
    MODULE_USER_MANAGEMENT_ACTIVE === true ? await import('UserManagement/UserManagementAxiosSharedConstants') : [];
  const billingAxiosSharedConstants =
    MODULE_BILLING_ACTIVE === true ? await import('Billing/BillingAxiosSharedConstants') : [];

  const userManagementUrlExceptions =
    userManagementSharedConstants?.USER_MANAGEMENT_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST &&
    Array.isArray(userManagementSharedConstants?.USER_MANAGEMENT_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST)
      ? userManagementSharedConstants.USER_MANAGEMENT_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST
      : [];

  const billingUrlExceptions =
    billingAxiosSharedConstants?.BILLING_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST &&
    Array.isArray(billingAxiosSharedConstants?.BILLING_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST)
      ? billingAxiosSharedConstants.BILLING_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST
      : [];

  return [...userManagementUrlExceptions, ...billingUrlExceptions, '/api/pm/notifications'];
};

export const getAxiosResponseNonCriticalResourceNotFoundURLExceptionList = async () => {
  const userManagementSharedConstants =
    MODULE_USER_MANAGEMENT_ACTIVE === true ? await import('UserManagement/UserManagementAxiosSharedConstants') : [];
  const billingAxiosSharedConstants =
    MODULE_BILLING_ACTIVE === true ? await import('Billing/BillingAxiosSharedConstants') : [];

  const userManagementUrlExceptions =
    userManagementSharedConstants?.USER_MANAGEMENT_AXIOS_RESPONSE_NON_CRITICAL_RESOURCE_NOT_FOUND_URL_EXCEPTIONS_LIST &&
    Array.isArray(
      userManagementSharedConstants?.USER_MANAGEMENT_AXIOS_RESPONSE_NON_CRITICAL_RESOURCE_NOT_FOUND_URL_EXCEPTIONS_LIST,
    )
      ? userManagementSharedConstants.USER_MANAGEMENT_AXIOS_RESPONSE_NON_CRITICAL_RESOURCE_NOT_FOUND_URL_EXCEPTIONS_LIST
      : [];

  const billingUrlExceptions =
    billingAxiosSharedConstants?.BILLING_AXIOS_RESPONSE_NON_CRITICAL_RESOURCE_NOT_FOUND_URL_EXCEPTIONS_LIST &&
    Array.isArray(
      billingAxiosSharedConstants?.BILLING_AXIOS_RESPONSE_NON_CRITICAL_RESOURCE_NOT_FOUND_URL_EXCEPTIONS_LIST,
    )
      ? billingAxiosSharedConstants.BILLING_AXIOS_RESPONSE_NON_CRITICAL_RESOURCE_NOT_FOUND_URL_EXCEPTIONS_LIST
      : [];

  return [
    ...userManagementUrlExceptions,
    ...billingUrlExceptions,
    '/pm/users/me/summary',
    '/users/photos/',
    '/patients/photos/',
  ];
};
