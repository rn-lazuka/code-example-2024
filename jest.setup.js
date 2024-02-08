import '@testing-library/jest-dom';
import 'jest-location-mock';
import Worker from './src/tests/jest-worker.worker';
import { server } from './src/tests/server/serverMock';

beforeAll(() => {
  server.listen();
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

jest.mock(
  'UserManagement/UserManagementAxiosSharedConstants',
  () => ({
    USER_MANAGEMENT_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST: [],
    USER_MANAGEMENT_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST: [],
  }),
  { virtual: true },
);

global.APP_VERSION = '1.10.0-buildnumber';
global.APP_NAME = 'RenalGenie';
global.ENVIRONMENT_VARIABLES = {};

jest.mock(
  'Billing/BillingAxiosSharedConstants',
  () => ({
    BILLING_AXIOS_RESPONSE_ERROR_CODE_EXCEPTIONS_LIST: [],
    BILLING_AXIOS_RESPONSE_URL_EXCEPTIONS_LIST: [],
  }),
  { virtual: true },
);

jest.mock(
  'Config',
  () => ({
    API_URL: process.env.DEVELOPMENT_API_TARGET,
  }),
  { virtual: true },
);

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  Trans: ({ children }) => children,
}));

window.Worker = Worker;
window.URL.createObjectURL = jest.fn();
