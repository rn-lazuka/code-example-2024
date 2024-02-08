export enum OfflineStorageStatusEnum {
  ONLINE,
  OFFLINE,
}

export default abstract class OfflineStorage<Item> {
  public abstract add(data: Item);
  public abstract getAllKeys();
  public abstract read(key: string | number);
  public abstract readAll();
  public abstract delete(key: string | number);
  public abstract deleteAll();
  public abstract update(keys: string[], data: Partial<Item>);
  public abstract addFilter(filterCallback: (data: Item) => boolean);
  public abstract startTransaction(storeName: string);
  public abstract endTransaction();
  public abstract deleteDB();
}
