import { IDBPDatabase, openDB, deleteDB } from 'idb';
import { IDBPTransaction } from 'idb/build/entry';
import {
  IndexedDbConfig,
  IndexedDbStoreConfig,
  IndexedDbStoreIndex,
  IndexedDbStoreIndexConfig,
  IndexedDbStoreObject,
  WithOnlineStatus,
} from '@types';
import { OfflineStorageStatusEnum } from './abstract/OfflineStorage';
import IndexedDbStorageAbstract from './abstract/IndexedDbStorage';

export enum IndexedDbStorageTransactionEnum {
  READ_WRITE = 'readwrite',
  READ_ONLY = 'readonly',
  VERSION_CHANGE = 'versionchange',
}

export class IndexedDbStore {
  constructor(public name: string, public indexes: IndexedDbStoreIndex[], public config: IndexedDbStoreConfig) {}
}

export class IndexedDbIndex {
  constructor(public name: string, public keyPath?: string, public config?: IndexedDbStoreIndexConfig) {}
}

export class IndexedDbStorage<Item> extends IndexedDbStorageAbstract<WithOnlineStatus<Item>> {
  private transaction?: IDBPTransaction;
  private activeStore?: string;
  private stack: WithOnlineStatus<Item>[] = [];
  private filters: ((data: WithOnlineStatus<Item>) => boolean)[] = [];

  config!: IndexedDbConfig;
  database!: IDBPDatabase;

  constructor(config: IndexedDbConfig) {
    super();
    this.config = config;
  }

  static async cleanAllDatabasesByNamePattern(namePattern: RegExp) {
    const databases = await indexedDB.databases();
    const filteredDatabases = databases.filter((database) => {
      return database?.name && database.name.match(namePattern);
    });

    filteredDatabases.forEach(({ name, version }) => {
      if (name && version) {
        deleteDB(name, {
          blocked(currentVersion: number, event: IDBVersionChangeEvent) {
            console.error('deleteDB blocked', { currentVersion, event });
          },
        });
      }
    });
  }

  private getStatus() {
    return navigator.onLine ? OfflineStorageStatusEnum.ONLINE : OfflineStorageStatusEnum.OFFLINE;
  }

  private getActiveStore = (): IndexedDbStoreObject<WithOnlineStatus<Item>> => {
    return this.transaction?.objectStore(this.activeStore as string) as any as IndexedDbStoreObject<
      WithOnlineStatus<Item>
    >;
  };

  private isInTransaction() {
    return !this.transaction?.store || !this.activeStore;
  }

  private addToStack(task) {
    this.stack.push(task);
  }

  async openDb() {
    const { stores, migrationCallback = () => {} } = this.config;
    this.database = await openDB(this.config.tableName, this.config.version, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        if (oldVersion < 1) {
          stores.forEach((store) => {
            if (!db.objectStoreNames.contains(store.name)) {
              const objectStore = db.createObjectStore(store.name, store.config);
              store.indexes.forEach((index) => {
                objectStore.createIndex(index.name, index.keyPath || index.name, index.config || { unique: false });
              });
            }
          });
        }
        if (newVersion && newVersion > oldVersion) {
          migrationCallback(db, oldVersion, newVersion, transaction, event);
        }
      },
      blocked(currentVersion, blockedVersion, event) {},
      blocking(currentVersion, blockedVersion, event) {},
      terminated() {},
    });
  }

  startTransaction(
    storeName: string,
    mode: IndexedDbStorageTransactionEnum = IndexedDbStorageTransactionEnum.READ_ONLY,
    config?: { [key: string]: unknown },
  ): IndexedDbStorage<Item> {
    this.activeStore = storeName;
    this.transaction = this.database.transaction(storeName, mode, config) as any;
    return this;
  }

  async endTransaction(): Promise<any> {
    let result: any = null;
    this.activeStore = undefined;
    if (this.isInTransaction()) {
      result = await Promise.all([...this.stack, this.transaction!.done]);
      result = result
        .reduce((res, item, index, source) => {
          return Array.isArray(item) ? [...res, ...source.slice(index, 1)[0]] : [...res, item];
        }, [])
        .reduce((res, item) => {
          if (!item) return res;
          const isValid = this.filters.reduce((isValid: any, filterCallback: any) => {
            return !isValid ? isValid : filterCallback(item);
          }, true);
          return isValid ? [...res, item] : res;
        }, []);
    }
    this.stack = [];
    this.filters = [];
    return result;
  }

  getAllKeys(): IndexedDbStorage<Item> {
    if (this.isInTransaction()) return this;
    const store = this.getActiveStore();
    this.addToStack(store.getAllKeys());
    return this;
  }

  add(data: Item, key?: string): IndexedDbStorage<Item> {
    if (this.isInTransaction()) return this;
    const store = this.getActiveStore();
    this.addToStack(
      new Promise((resolve) => {
        store.add({ ...data, __STATUS__: this.getStatus() }, key).then(resolve);
      }),
    );
    return this;
  }

  read(key: string | number): IndexedDbStorage<Item> {
    if (this.isInTransaction()) return this;
    const store = this.getActiveStore();
    this.addToStack(store.get(key));
    return this;
  }

  readAll(): IndexedDbStorage<Item> {
    if (this.isInTransaction()) return this;
    const store = this.getActiveStore();
    this.addToStack(store.getAll());
    return this;
  }

  update(keys, data): IndexedDbStorage<Item> {
    if (this.isInTransaction()) return this;
    const store = this.getActiveStore();
    keys.forEach((key) => {
      this.addToStack(
        store.get(key).then((item) => {
          if (item) {
            return store.put({ ...item, ...data });
          }
        }),
      );
    });
    return this;
  }

  delete(key: string | number): IndexedDbStorage<Item> {
    if (this.isInTransaction()) return this;
    const store = this.getActiveStore();
    this.addToStack(store.delete(key));
    return this;
  }

  deleteAll(): IndexedDbStorage<Item> {
    if (this.isInTransaction()) return this;
    const store = this.getActiveStore();
    this.addToStack(store.clear());
    return this;
  }

  addFilter(filterCallback: (data) => boolean): IndexedDbStorage<Item> {
    this.filters.push(filterCallback);
    return this;
  }

  filterOffline(): IndexedDbStorage<Item> {
    this.filters.push((data) => data.__STATUS__ === OfflineStorageStatusEnum.OFFLINE);
    return this;
  }

  async deleteDB() {
    this.database.close();
    return deleteDB(this.database.name, {
      blocked(currentVersion: number, event: IDBVersionChangeEvent) {
        console.error('deleteDB blocked', { currentVersion, event });
      },
    });
  }
}
