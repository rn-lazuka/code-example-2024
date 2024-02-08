import type { InitData } from '@types';
import { localStorageFixture } from '@unit-tests/fixtures';
import { clearStorageInitData, getStorageInitData, setStorageInitData } from '@utils/storageInitData';

const initData: InitData = {
  authUrl: 'https://example.com/auth',
  clientId: '123',
  tenantId: '456',
  logInUrl: 'https://example.com/login',
  logOutUrl: 'https://example.com/logout',
  tenantName: 'Example',
  timeZone: 'UTC',
};

describe('getStorageInitData', () => {
  const sourceLocalStorage = window.localStorage;

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageFixture() });
  });

  beforeEach(() => {
    clearStorageInitData();
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: sourceLocalStorage });
  });

  it('should retrieve and parse the stored InitData object from localStorage', () => {
    setStorageInitData(initData);
    expect(getStorageInitData()).toEqual(initData);
  });

  it('should return null if there is no InitData object stored in localStorage', () => {
    expect(getStorageInitData()).toBeNull();
  });

  it('should return null if the stored InitData object cannot be parsed from JSON', () => {
    localStorage.setItem('initData', 'invalid JSON');
    expect(getStorageInitData()).toBeNull();
  });
});

describe('clearStorageInitData', () => {
  it('should remove the InitData object from localStorage', () => {
    localStorage.setItem('initData', 'some value');
    clearStorageInitData();
    expect(localStorage.getItem('initData')).toBeNull();
  });
});
