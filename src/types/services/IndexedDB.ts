import { OfflineStorageStatusEnum } from '@services/abstract/OfflineStorage';
import { IndexedDbStore } from '@services/index';
import { IDBPCursorWithValue, IDBPTransaction, TypedDOMStringList } from 'idb/build/entry';
import { IDBPDatabase } from 'idb';

export interface IndexedDbStoreConfig {
  autoIncrement?: boolean;
  keyPath?: string | string[] | null;
}

export interface IndexedDbStoreIndexConfig {
  unique: boolean;
}

export interface IndexedDbStoreIndex {
  name: string;
  keyPath?: string;
  config?: IndexedDbStoreIndexConfig;
}

export interface IndexedDbConfig {
  tableName: string;
  version: number;
  stores: IndexedDbStore[];
  migrationCallback?: (
    db: IDBPDatabase<any>,
    oldVersion: number,
    newVersion: number | null,
    transaction: IDBPTransaction<any, any, any>,
    event: IDBVersionChangeEvent,
  ) => void;
}

type IndexedDbCursorDirection = 'next' | 'nextunique' | 'prev' | 'prevunique';

export interface IndexedDbStoreObject<StoreItem> {
  readonly indexNames: TypedDOMStringList<any>;
  readonly transaction: IDBPTransaction;
  add: (value: StoreItem, key?: string) => Promise<string>;
  clear: () => Promise<void>;
  count(key?: string): Promise<number>;
  createIndex: (name: string, keyPath: string | string[], options?: any) => any;
  delete: (key: string | number) => Promise<void>;
  get(query: any): Promise<any>;
  getAll(query?: any, count?: number): Promise<any>;
  getAllKeys(query?: any, count?: number): Promise<any>;
  getKey(query: any): Promise<any>;
  index(name: string): any;
  openCursor(query?: any, direction?: IndexedDbCursorDirection): Promise<IDBPCursorWithValue>;
  openKeyCursor(query?: any, direction?: IndexedDbCursorDirection): Promise<IDBPCursorWithValue>;
  put: (value: StoreItem, key?: string) => Promise<string>;
  iterate(query?: any, direction?: IndexedDbCursorDirection): any;
}

export type WithOnlineStatus<T> = T & { __STATUS__?: OfflineStorageStatusEnum };
