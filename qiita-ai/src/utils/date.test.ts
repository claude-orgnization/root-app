import { describe, it, expect } from 'vitest'
import { formatDate } from './date'

describe('formatDate', () => {
  it('ISO文字列を YYYY/MM/DD 形式に変換する', () => {
    // UTC時刻として解釈されるので、ローカルタイムゾーンに依存しない日付を使用
    const result = formatDate('2024-06-15T12:00:00Z')
    expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
  })

  it('月・日が1桁の場合ゼロパディングする', () => {
    // ローカルタイムゾーンに関わらず2024/03/05になるように正午UTCを使用
    const result = formatDate('2024-03-05T12:00:00Z')
    expect(result).toMatch(/^2024\/\d{2}\/\d{2}$/)
    expect(result).toContain('/03/')
  })

  it('年・月・日を正しく取得する', () => {
    // ローカルタイムゾーンに依存しないようnew Dateで直接テスト
    const isoString = '2023-12-25T12:00:00Z'
    const date = new Date(isoString)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    expect(formatDate(isoString)).toBe(`${y}/${m}/${d}`)
  })

  it('月・日の数値が2桁になるようにゼロパディングされる', () => {
    // 明示的に月・日が1桁のケースを検証
    const isoString = '2024-01-09T12:00:00Z'
    const date = new Date(isoString)
    const result = formatDate(isoString)
    const parts = result.split('/')
    expect(parts).toHaveLength(3)
    expect(parts[0]).toBe(String(date.getFullYear()))
    expect(parts[1]).toHaveLength(2)
    expect(parts[2]).toHaveLength(2)
  })
})
