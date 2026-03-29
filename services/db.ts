import { CharacterProfile } from '../types';

const DB_NAME = 'DaggerheartCompanionDB';
const DB_VERSION = 1;
const STORE_NAME = 'characters';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const generateId = (): string => {
  // Try to use crypto.randomUUID if available (Secure Contexts)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for other environments
  return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const saveCharacterToDB = async (character: CharacterProfile): Promise<string> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const charToSave = { ...character };
    if (!charToSave.id) {
      charToSave.id = generateId();
    }

    const request = store.put(charToSave);

    // Wait for transaction to complete to ensure data is committed
    transaction.oncomplete = () => resolve(charToSave.id!);
    transaction.onerror = () => reject(transaction.error);
    request.onerror = () => reject(request.error);
  });
};

export const getAllCharacters = async (): Promise<CharacterProfile[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteCharacterFromDB = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    // Critical: Wait for transaction completion before resolving
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    request.onerror = () => reject(request.error);
  });
};