import { IDBPDatabase } from 'idb';
import OfflineStorage from './OfflineStorage';
import { IndexedDbConfig } from '@types';

export default abstract class IndexedDbStorageAbstract<Item> extends OfflineStorage<Item> {
  protected abstract config: IndexedDbConfig;
  protected abstract database: IDBPDatabase;
}
