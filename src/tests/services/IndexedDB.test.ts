import { IndexedDbIndex, IndexedDbStorage, IndexedDbStorageTransactionEnum, IndexedDbStore } from '../../services';
import { OfflineStorageStatusEnum } from '../../services/abstract/OfflineStorage';

interface Item {
  testValue: string;
  id: number;
}

describe('IndexedDB', () => {
  let storage: IndexedDbStorage<Item>;
  const storeName = 'TEST_STORE';
  const onlineStatus = 0;

  beforeAll(async () => {
    const index = new IndexedDbIndex('testValue');
    const store = new IndexedDbStore(storeName, [index], {
      autoIncrement: true,
      keyPath: 'id',
    });
    storage = new IndexedDbStorage({
      tableName: 'test',
      stores: [store],
      version: 1,
    });
    await storage.openDb();
    await storage
      .startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE)
      .add({ testValue: 'TEST_VALUE_1', id: 1 })
      .endTransaction();
    await storage
      .startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE)
      .add({ testValue: 'TEST_VALUE_2', id: 2 })
      .endTransaction();
    await storage
      .startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE)
      .add({ testValue: 'TEST_VALUE_3', id: 3 })
      .endTransaction();
  });

  it('Should read and filter IndexedDB data', async () => {
    const firstItem = await storage
      .startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE)
      .read(1)
      .endTransaction();
    expect(firstItem[0]).toBeTruthy();
    expect(firstItem[0].testValue).toEqual('TEST_VALUE_1');
    expect(firstItem[0].__STATUS__).toEqual(onlineStatus);

    const allKeys = await storage.startTransaction(storeName).getAllKeys().endTransaction();
    expect(allKeys.length).toEqual(3);

    const allItems = await storage.startTransaction(storeName).readAll().endTransaction();
    expect(allItems.length).toEqual(3);

    const filteredItems = await storage
      .startTransaction(storeName)
      .readAll()
      .addFilter((item) => item.testValue === 'TEST_VALUE_2')
      .endTransaction();
    expect(filteredItems.length).toEqual(1);
  });

  it('Should update data', async () => {
    await storage
      .startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE)
      .update([1], { testValue: 'UPDATED_TEST_VALUE', __STATUS__: OfflineStorageStatusEnum.OFFLINE })
      .endTransaction();
    const updatedItem = await storage.startTransaction(storeName).read(1).endTransaction();
    expect(updatedItem[0].testValue).toEqual('UPDATED_TEST_VALUE');

    const offlineItems = await storage.startTransaction(storeName).readAll().filterOffline().endTransaction();
    expect(offlineItems.length).toEqual(1);
  });

  it('Should delete all data from the store', async () => {
    const getAmount = () => storage.startTransaction(storeName).getAllKeys().endTransaction();
    const records = await storage
      .startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE)
      .readAll()
      .endTransaction();
    await storage.startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE).delete(1).endTransaction();
    expect((await getAmount()).length).toEqual(2);
    await storage.startTransaction(storeName, IndexedDbStorageTransactionEnum.READ_WRITE).deleteAll().endTransaction();
    expect((await getAmount()).length).toEqual(0);
  });
});
