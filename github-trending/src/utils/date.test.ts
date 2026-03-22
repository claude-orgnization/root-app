import { describe, it, expect } from 'vitest'
import { formatDate, formatStarCount } from './date'

describe('formatDate', () => {
  it('ISO文字列をYYYY/MM/DD形式にフォーマットする', () => {
    expect(formatDate('2024-03-22T00:00:00Z')).toBe('2024/03/22')
  })
})

describe('formatStarCount', () => {
  it('1000未満はそのまま返す', () => {
    expect(formatStarCount(999)).toBe('999')
  })

  it('1000以上は小数点1桁でkに変換する', () => {
    expect(formatStarCount(1500)).toBe('1.5k')
  })

  it('10000は10.0kになる', () => {
    expect(formatStarCount(10000)).toBe('10.0k')
  })
})
