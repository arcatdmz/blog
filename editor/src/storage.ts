import type { Post, Recovery } from "../shared/model";

let database: Promise<IDBDatabase> | undefined;
function db() {
  database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open("junkato-blog-editor", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("recovery", { keyPath: "post.path" });
      request.result.createObjectStore("posts", { keyPath: "sha" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      database = undefined;
      reject(request.error);
    };
  });
  return database;
}
async function transact<T>(
  store: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, mode);
    const request = action(transaction.objectStore(store));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = transaction.onabort = () =>
      reject(
        transaction.error || request.error || new Error("Local storage failed.")
      );
  });
}
type StoredImage = Omit<Recovery["images"][number], "blob"> & {
  bytes: ArrayBuffer;
  mime: string;
};
type StoredRecovery = Omit<Recovery, "images"> & {
  images: (StoredImage | Recovery["images"][number])[];
};
// Preserve write/delete ordering while image bytes are read asynchronously.
let recoveryWrites: Promise<unknown> = Promise.resolve();
function queueRecoveryWrite<T>(action: () => Promise<T>): Promise<T> {
  const result = recoveryWrites.then(action);
  recoveryWrites = result.catch(() => {});
  return result;
}
export const listRecovery = async (): Promise<Recovery[]> => {
  await recoveryWrites;
  const records = await transact<StoredRecovery[]>("recovery", "readonly", store => store.getAll());
  return records.map(record => ({
    ...record,
    images: record.images.map(image => {
      // Keep recovery copies written by earlier releases readable.
      if ("blob" in image) return image;
      const { bytes, mime, ...metadata } = image;
      return { ...metadata, blob: new Blob([bytes], { type: mime }) };
    })
  }));
};
export const putRecovery = (recovery: Recovery) => queueRecoveryWrite(async () => {
  // WebKit can fail to persist Blob/File objects; store their bytes instead.
  const images = await Promise.all(recovery.images.map(async ({ blob, ...metadata }) => ({
    ...metadata, bytes: await blob.arrayBuffer(), mime: blob.type
  })));
  return transact("recovery", "readwrite", store => store.put({ ...recovery, images }));
});
export const deleteRecovery = (path: string) => queueRecoveryWrite(() =>
  transact("recovery", "readwrite", store => store.delete(path)));
export const getCachedPost = (sha: string) =>
  transact<Post | undefined>("posts", "readonly", store => store.get(sha));
export const cachePost = (post: Post) =>
  transact("posts", "readwrite", store => store.put(post));
