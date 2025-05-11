import { CEdictEntry } from "./cedict.js";
import { insertWith, unionWith } from "./map.js";

const WORD_INDEX = "wordIndex";
const SIMPLIFIED_INDEX = "simplified";
const TRADITIONAL_INDEX = "traditional";

export async function openDb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open("writer", 1);
    req.onsuccess = (ev) => res((ev.target as any).result);
    req.onerror = rej;
    req.onupgradeneeded = (ev) => {
      const db: IDBDatabase = (ev.target as any).result;
      const wordIndex = db.createObjectStore(WORD_INDEX, {
        autoIncrement: true,
      });
      wordIndex.createIndex(SIMPLIFIED_INDEX, "simp");
      wordIndex.createIndex(TRADITIONAL_INDEX, "trad");
    };
  });
}

export function writeEntries(db: IDBDatabase, entries: CEdictEntry[]) {
  const tx = db.transaction(WORD_INDEX, "readwrite");
  const wordIndex = tx.objectStore(WORD_INDEX);
  for (const entry of entries) {
    wordIndex.add(entry);
  }
  tx.commit();
}

async function searchWordIndex(
  index: IDBIndex,
  currentKey: string,
): Promise<Set<string>> {
  let results = new Set<string>();

  while (currentKey.length > 0) {
    const cursor = await new Promise<IDBCursorWithValue>((res, rej) => {
      const req = index.openCursor(IDBKeyRange.upperBound(currentKey), "prev");
      req.onsuccess = (ev) => res((ev.target as any).result);
      req.onerror = rej;
    });

    if (cursor) {
      const subKey = cursor.key as string;

      if (currentKey.startsWith(subKey)) {
        results.add(subKey);
        currentKey = subKey.substring(0, subKey.length - 1);
      } else {
        currentKey = commonPrefix(currentKey, subKey);
      }
    } else {
      break;
    }
  }

  return results;
}

async function lookupWordIndex(
  wordIndex: IDBObjectStore,
  index: IDBIndex,
  search: string,
): Promise<Map<number, CEdictEntry>> {
  const keys = await new Promise<number[]>((res, rej) => {
    const req = index.getAllKeys(search);
    req.onsuccess = (ev) => res((ev.target as any).result);
    req.onerror = rej;
  });

  let results = new Map<number, CEdictEntry>();

  for (const key of keys) {
    const entry = await new Promise<CEdictEntry>((res, rej) => {
      const req = wordIndex.get(key);
      req.onsuccess = (ev) => res((req as any).result);
      req.onerror = rej;
    });
    results.set(key, entry);
  }

  return results;
}

function commonPrefix(s1: string, s2: string): string {
  let len = 0;
  while (len < Math.min(s1.length, s2.length)) {
    if (s1[len] === s2[len]) {
      len += 1;
    } else {
      break;
    }
  }
  return s1.substring(0, len);
}

// Index keys can have more than one corresponding rows so we split into two
// steps: searchPrefixes and then lookupEntries
export async function searchPrefixes(
  db: IDBDatabase,
  search: string,
): Promise<Set<string>> {
  const tx = db.transaction(WORD_INDEX, "readonly");
  const wordIndex = tx.objectStore(WORD_INDEX);
  const simps = await searchWordIndex(
    wordIndex.index(SIMPLIFIED_INDEX),
    search,
  );
  const trads = await searchWordIndex(
    wordIndex.index(TRADITIONAL_INDEX),
    search,
  );
  return new Set(Array.from(simps).concat(Array.from(trads)));
}

export async function lookupEntries(
  db: IDBDatabase,
  search: string,
): Promise<Map<number, CEdictEntry>> {
  const tx = db.transaction(WORD_INDEX, "readonly");
  const wordIndex = tx.objectStore(WORD_INDEX);
  const simps = await lookupWordIndex(
    wordIndex,
    wordIndex.index(SIMPLIFIED_INDEX),
    search,
  );
  const trads = await lookupWordIndex(
    wordIndex,
    wordIndex.index(TRADITIONAL_INDEX),
    search,
  );
  return unionWith(simps, trads, (_k, _v1, v2) => v2);
}
