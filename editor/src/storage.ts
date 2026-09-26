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
export const listRecovery = () =>
  transact<Recovery[]>("recovery", "readonly", store => store.getAll());
export const putRecovery = (recovery: Recovery) =>
  transact("recovery", "readwrite", store => store.put(recovery));
export const deleteRecovery = (path: string) =>
  transact("recovery", "readwrite", store => store.delete(path));
export const getCachedPost = (sha: string) =>
  transact<Post | undefined>("posts", "readonly", store => store.get(sha));
export const cachePost = (post: Post) =>
  transact("posts", "readwrite", store => store.put(post));
