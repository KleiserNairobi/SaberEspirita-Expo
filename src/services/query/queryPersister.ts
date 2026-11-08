import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

import { storage } from "@/utils/Storage";

const mmkvStorageAdapter = {
  setItem: (key: string, value: string): Promise<void> => {
    storage.set(key, value);
    return Promise.resolve();
  },
  getItem: (key: string): Promise<string | null> => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string): Promise<void> => {
    storage.remove(key);
    return Promise.resolve();
  },
};

export const queryPersister = createAsyncStoragePersister({
  storage: mmkvStorageAdapter,
  key: "SABER_ESPIRITA_QUERY_CACHE",
});
