import LocationBrowserStorageAbstract, { BrowserLocation } from './abstract/HistoryBrowserStorage';

export const historyBrowserData = () => {
  let locationBrowser = new LocationBrowserStorage();
  return locationBrowser.get();
};

export class LocationBrowserStorage<Item> extends LocationBrowserStorageAbstract {
  constructor() {
    super();
  }

  currentPath!: string;
  previousPath!: string;

  set(storeData: BrowserLocation): LocationBrowserStorage<Item> {
    localStorage.setItem('historyPaths', JSON.stringify(storeData));
    return this;
  }
  get(): LocationBrowserStorage<Item> {
    const locationData = localStorage.getItem('historyPaths');
    return locationData && JSON.parse(locationData);
  }
  reset(storePath: string): LocationBrowserStorage<Item> {
    this.set({
      currentPath: storePath,
      previousPath: '',
      previousSecondPath: '',
    });
    return this;
  }
  update(storePath: string): LocationBrowserStorage<Item> {
    const storeData = this.get();
    this.set({
      currentPath: storePath,
      previousPath: storeData?.currentPath || '',
      previousSecondPath: storeData?.previousPath || '',
    });
    return this;
  }
  fetch(storePath: string): LocationBrowserStorage<Item> {
    const storeData = this.get();
    if (storeData?.currentPath !== storePath) {
      this.update(storePath);
    } else if (storeData === null) {
      this.reset(storePath);
    }
    return this;
  }
  clear(): LocationBrowserStorage<Item> {
    localStorage.removeItem('historyPaths');
    return this;
  }
}
