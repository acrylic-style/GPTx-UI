import * as idb from 'idb'
import {IDBPDatabase, IDBPObjectStore} from "idb";

// eslint-disable-next-line no-unused-vars
export const useIDB = async <R>(name: string, action: (db: IDBPDatabase) => R | Promise<R>, upgrade: (db: IDBPDatabase) => void): Promise<R> => {
    const db = await idb.openDB(name, 1, {
        upgrade(db) {
            upgrade(db)
        },
    })
    const result = await action(db)
    db.close()
    return result
}

// eslint-disable-next-line no-unused-vars
export const transaction = async <N extends string, R>(db: IDBPDatabase, store: N, action: (store: IDBPObjectStore<unknown, [N], N, "readwrite">) => R | Promise<R>): Promise<R> => {
    const tx = db.transaction(store, 'readwrite')
    const storeObject = tx.objectStore(store)
    const result = await action(storeObject)
    await tx.done
    return result
}

// eslint-disable-next-line no-unused-vars
export const useTransaction = async <N extends string, R>(name: string, store: N, action: (store: IDBPObjectStore<unknown, [N], N, "readwrite">) => R | Promise<R>): Promise<R> => {
    return useIDB(name, db => {
        return transaction(db, store, action)
    }, db => {
        db.createObjectStore(store)
    })
}
