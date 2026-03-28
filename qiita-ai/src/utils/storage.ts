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
    // 書き込み検証: 読み戻して一致するか確認
    const verify = localStorage.getItem(key)
    if (verify !== json) return false
    // 同一タブの他コンポーネントに変更を通知
    window.dispatchEvent(
      new StorageEvent('storage', { key, newValue: json })
    )
    return true
  } catch {
    return false
  }
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_TTL = 5 * 60 * 1000 // 5分

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
    // キャッシュ書き込み失敗は無視（重要データではない）
  }
}
