mport type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios, { AxiosError } from 'axios';
import {
  ROUTES,
  getAxiosResponseErrorCodeExceptionsList,
  getAxiosResponseErrorUrlExceptionList,
  getAxiosResponseNonCriticalResourceNotFoundURLExceptionList,
  ERROR_CODES,
  ERROR_CUSTOM_SNACKS,
} from '@constants';
import { Event, LocationBrowserStorage } from '@services';
import { addSnack, systemDispatch } from '@store';
import i18n from 'i18next';
import { SnackType, Headers, HttpCodes } from '@enums';
import { getStorageInitData, clearData } from '@utils';
import { clearStorageDataBeforeLogout } from '@utils/clearStorageDataBeforeLogout';
import { globalRouter } from '@containers/providers';

const { API_URL, DEVELOPMENT_API_TARGET } = require('Config');

export const API: AxiosInstance = axios.create({
  baseURL: API_URL,
  responseType: 'json',
});

const browserHistory = new LocationBrowserStorage();

export const setHeaders = (
  headers: { [key: string]: string },
  axiosInstance: AxiosInstance = API,
  fireEvent = true,
) => {
  const commonHeaders = { ...axiosInstance.defaults.headers.common };

  Object.keys(headers).forEach((key) => (commonHeaders[key] = headers[key]));

  if (fireEvent) {
    window.dispatchEvent(new CustomEvent('SET_HEADERS', { detail: headers }));
  }

  axiosInstance.defaults.headers.common = commonHeaders;
};

export const deleteHeaders = (headerKeys: string[], axiosInstance: AxiosInstance = API) => {
  const commonHeaders = { ...axiosInstance.defaults.headers.common };

  headerKeys.forEach((key) => commonHeaders[key] && delete commonHeaders[key]);

  axiosInstance.defaults.headers.common = commonHeaders;
};

/** Reading localstorage data and adding common headers on axios initialization */
export function setInitialHeaders(axiosInstance: AxiosInstance = API) {
  const access_token = localStorage.getItem('access_token');
  const initData = localStorage.getItem('initData');
  const headers: Record<string, string> = {};

  axiosInstance.defaults.headers.common[Headers.ContentSecurityPolicy] = `default-src 'self' ${
    DEVELOPMENT_API_TARGET || API_URL
  }`;

  if (access_token) {
    axiosInstance.defaults.headers.common[Headers.Authorization] = access_token;
  }
  if (initData) {
    const { tenantId } = JSON.parse(initData);
    axiosInstance.defaults.headers.common[Headers.TenantId] = tenantId;
  }
  return headers;
}

export const setAbortControllerIfCondition = (config: AxiosRequestConfig, checkCallback: () => boolean) => {
  if (checkCallback()) {
    const controller = new AbortController();
    config.signal = controller.signal;
    controller.abort();
  }
  return config;
};

export const setInterceptors = (axiosInstance: AxiosInstance = API) => {
  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const accessToken = localStorage.getItem('access_token');

      if (
        accessToken &&
        config?.headers?.common?.[Headers.Authorization] &&
        accessToken !== config.headers.common[Headers.Authorization]
      ) {
        config.headers.common[Headers.Authorization] = accessToken;
      }

      if (config.data && !(config.data instanceof URLSearchParams)) {
        config.data = clearData(config.data, {
          leaveEmptyArrays: true,
          leaveEmptyStrings: false,
          multilineFields:
            config.headers && config.headers['multiline-fields']
              ? (config.headers['multiline-fields'] as any).split(',')
              : [],
        });
      }

      if (config.headers && config.headers['multiline-fields']) {
        delete config.headers['multiline-fields'];
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (config: AxiosResponse) => config,
    async (error: AxiosError<{ code: number | string }[]>) => {
      let skipMessageDisplay = false;
      const hasHandledErrorCode = error.response?.data ? error.response.data.length > 0 : false;
      const errorCode = hasHandledErrorCode
        ? error.response?.data?.map((error) => error?.code)
        : (error.code as string);
      const url = error?.config?.url ?? '';
      const codeExceptions = await getAxiosResponseErrorCodeExceptionsList();
      const urlExceptions = await getAxiosResponseErrorUrlExceptionList();
      const resourceNotFoundExceptions = await getAxiosResponseNonCriticalResourceNotFoundURLExceptionList();

      if (url === '/pm/users/me/summary' && error?.response?.status === HttpCodes.Unauthorized) {
        const initData = getStorageInitData();
        if (initData) {
          clearStorageDataBeforeLogout();
          window.location.replace(initData.logOutUrl);
        }
        browserHistory.clear();
      }

      if (!skipMessageDisplay && url) {
        skipMessageDisplay = urlExceptions.reduce((res, url) => {
          return !res ? error.config.url!.includes(url) : res;
        }, false);
      }

      if (!skipMessageDisplay && errorCode && errorCode?.length > 0) {
        skipMessageDisplay = codeExceptions.some((exception) =>
          Array.isArray(errorCode) ? errorCode.includes(exception) : exception === errorCode.toString(),
        );
      }

      if (!skipMessageDisplay && errorCode) {
        if (
          error.response?.status === HttpCodes.NotFound &&
          !isExceptedResourceNotFoundUrl(url, resourceNotFoundExceptions)
        ) {
          redirect(ROUTES.notFound);
        } else if (
          error.response?.status === HttpCodes.BadGateway ||
          error.response?.status === HttpCodes.GatewayTimeout ||
          error.response?.status === HttpCodes.ServiceUnavailable
        ) {
          redirect(ROUTES.serverError);
        } else {
          if (error.response?.status !== HttpCodes.Unauthorized) {
            Event.fire(systemDispatch.type, {
              type: addSnack.type,
              payload: ERROR_CUSTOM_SNACKS[errorCode.toString() as ERROR_CODES] || {
                type: SnackType.Error,
                message: i18n.exists(`errors:${errorCode}`)
                  ? i18n.t(`errors:${errorCode}`)
                  : i18n.t('errors:SYSTEM_ERROR'),
              },
            });
          }
        }
      }
      return Promise.reject(error);
    },
  );
};

const isExceptedResourceNotFoundUrl = (url: string, list: string[]) => {
  return url ? list.some((exceptionUrl) => url.includes(exceptionUrl)) : false;
};

const redirect = (route: string) => {
  if (globalRouter?.navigate) globalRouter.navigate(route);
  else window.location.href = route;
};

setInitialHeaders();
setInterceptors();
