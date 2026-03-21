import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from './useDarkMode'

describe('useDarkMode', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value }),
      removeItem: vi.fn((key: string) => { delete store[key] }),
      clear: vi.fn(() => { store = {} }),
    }
  })()

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    localStorageMock.clear()
    vi.clearAllMocks()
    // デフォルトは prefers-color-scheme: light
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    // document.documentElement の classList をリセット
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('localStorage に保存値がない場合、matchMedia に基づいて初期状態を設定する（light）', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(false)
  })

  it('localStorage に "true" が保存されている場合、isDark=true で初期化される', () => {
    localStorageMock.getItem.mockReturnValue('true')

    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(true)
  })

  it('localStorage に "false" が保存されている場合、isDark=false で初期化される', () => {
    localStorageMock.getItem.mockReturnValue('false')

    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(false)
  })

  it('toggle を呼び出すと isDark が反転する', () => {
    localStorageMock.getItem.mockReturnValue('false')

    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isDark).toBe(true)
  })

  it('isDark=true のとき document.documentElement に "dark" クラスが追加される', () => {
    localStorageMock.getItem.mockReturnValue('true')

    renderHook(() => useDarkMode())

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('isDark=false のとき document.documentElement から "dark" クラスが削除される', () => {
    document.documentElement.classList.add('dark')
    localStorageMock.getItem.mockReturnValue('false')

    renderHook(() => useDarkMode())

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggle 後に localStorage に新しい値が保存される', () => {
    localStorageMock.getItem.mockReturnValue('false')

    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggle()
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true')
  })

  it('prefers-color-scheme: dark のとき、localStorage がない場合 isDark=true で初期化される', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(true)
  })
})
