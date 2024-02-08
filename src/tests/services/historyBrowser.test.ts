import { LocationBrowserStorage, historyBrowserData } from '../../services';

describe('historyBrowser', () => {
  const storage = new LocationBrowserStorage();
  const browserPath = location.pathname;
  it('Should read history Browser', async () => {
    storage.fetch(browserPath);
    expect(storage).toBeTruthy();
    expect(storage.get()).toEqual(historyBrowserData());
  });
  it('Should update history Browser', async () => {
    storage.update(browserPath);
    expect(storage.get()?.currentPath).toEqual(historyBrowserData()?.currentPath);
  });
  it('Should delete history Browser', async () => {
    storage.clear();
    expect(storage.get()).toBeNull();
  });
});
