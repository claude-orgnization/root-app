import { idbGet, idbSet } from './idb'

// ── localStorage (同期) ──────────────────────────

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJson<T>(key: string, value: T): boolean {
  try {
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
    const verify = localStorage.getItem(key)
    if (verify !== json) return false
    window.dispatchEvent(
      new StorageEvent('storage', { key, newValue: json })
    )
    return true
  } catch {
    return false
  }
}

// ── IndexedDB (非同期・永続) ─────────────────────

/** IndexedDBに保存 (localStorage にも同時書き込み) */
export async function persistJson<T>(key: string, value: T): Promise<void> {
  saveJson(key, value)
  try {
    await idbSet(key, value)
  } catch {
    // IndexedDB非対応でも localStorage に書き込み済み
  }
}

/**
 * 起動時に IndexedDB からデータを復元する。
 * localStorage が空で IndexedDB にデータがある場合、localStorage に書き戻す。
 * 戻り値: 復元されたデータ、または fallback。
 */
export async function restoreFromIdb<T>(key: string, fallback: T): Promise<T> {
  const lsValue = loadJson<T>(key, undefined as unknown as T)

  try {
    const idbValue = await idbGet<T>(key)

    if (idbValue !== undefined) {
      if (lsValue === undefined || lsValue === null) {
        // localStorage が消えている → IndexedDB から復元
        saveJson(key, idbValue)
      }
      return idbValue
    }
  } catch {
    // IndexedDB非対応
  }

  // IndexedDB にデータがない場合は localStorage の値を使う
  return lsValue ?? fallback
}

// ── 記事キャッシュ (localStorage のみ、消えても問題ない) ─

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_TTL = 5 * 60 * 1000

export function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (Date.now() - entry.timestamp > CACHE_TTL) return null
    return entry.data
  } catch {
    return null
  }
}

export function saveCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // キャッシュ書き込み失敗は無視
  }
}
