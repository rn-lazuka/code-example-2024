export interface BrowserLocation {
  currentPath: string;
  previousPath: string;
  previousSecondPath: string;
}

export default abstract class HistoryBrowserStorage {
  public abstract set(storeData: BrowserLocation);
  public abstract get();
  public abstract clear();
  public abstract reset(storePath: string);
  public abstract update(storePath: string);
  public abstract fetch(storePath: string);
}
