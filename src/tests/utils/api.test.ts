import { Headers } from '@enums';
import { API, setAbortControllerIfCondition, setInitialHeaders } from '@utils';

const ACCESS_TOKEN_VALUE = 'ACCESS_TOKEN_VALUE';
const INIT_DATA_VALUE = { tenantId: 'TENANT_ID' };

const updateStorageReturnValue = ({ access_token, initData }: { access_token?: string; initData?: string }) => {
  Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
    switch (key) {
      case 'access_token':
        return access_token;
      case 'initData':
        return initData;
    }
  });
};

describe('API', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem');
  });

  it('should have no headers', () => {
    updateStorageReturnValue({ access_token: undefined, initData: undefined });

    setInitialHeaders();
    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(API.defaults.headers.common[Headers.Authorization]).toBe(undefined);
    expect(API.defaults.headers.common[Headers.TenantId]).toBe(undefined);
  });

  it('should have only one common header(tenantId)', () => {
    updateStorageReturnValue({ access_token: undefined, initData: JSON.stringify(INIT_DATA_VALUE) });
    setInitialHeaders();
    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(API.defaults.headers.common[Headers.Authorization]).toBe(undefined);
    expect(API.defaults.headers.common[Headers.TenantId]).toBe(INIT_DATA_VALUE.tenantId);
  });

  it('should both common headers', () => {
    updateStorageReturnValue({ access_token: ACCESS_TOKEN_VALUE, initData: JSON.stringify(INIT_DATA_VALUE) });

    setInitialHeaders();
    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(API.defaults.headers.common[Headers.Authorization]).toBe(ACCESS_TOKEN_VALUE);
    expect(API.defaults.headers.common[Headers.TenantId]).toBe(INIT_DATA_VALUE.tenantId);
  });
});

describe('setAbortControllerIfCondition', () => {
  it('should modify config object when condition if true', () => {
    const config = {
      signal: undefined,
    };
    setAbortControllerIfCondition(config, () => true);
    expect(config.signal).toBeInstanceOf(AbortSignal);
  });

  it('should not modify config object when condition if false', () => {
    const config = {
      signal: undefined,
    };
    setAbortControllerIfCondition(config, () => false);
    expect(config.signal).toBe(undefined);
  });
});
