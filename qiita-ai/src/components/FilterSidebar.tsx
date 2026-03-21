import { useState } from 'react'
import { AI_TAGS } from '../constants/tags'
import type { SortOrder, DateRange } from '../types/qiita'

interface Props {
  selectedTags: string[]
  sort: SortOrder
  dateRange: DateRange
  onTagsChange: (tags: string[]) => void
  onSortChange: (sort: SortOrder) => void
  onDateRangeChange: (dateRange: DateRange) => void
}

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'all', label: '全期間' },
  { value: 'week', label: '今週' },
  { value: 'month', label: '今月' },
  { value: '3months', label: '3ヶ月以内' },
]

export function FilterSidebar({
  selectedTags,
  sort,
  dateRange,
  onTagsChange,
  onSortChange,
  onDateRangeChange,
}: Props) {
  const [collapsed, setCollapsed] = useState(false)

  function toggleTag(tag: string) {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <aside className="w-full md:w-60 shrink-0">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-5">
        {/* ヘッダー（モバイル時に折りたたみ） */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">フィルター</h2>
          <button
            className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '▼ 開く' : '▲ 閉じる'}
          </button>
        </div>

        <div className={`flex flex-col gap-5 ${collapsed ? 'hidden md:flex' : ''}`}>
          {/* タグフィルター */}
          <section>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">タグ</p>
            <div className="flex flex-col gap-1.5">
              {AI_TAGS.map((tag) => {
                const active = selectedTags.includes(tag)
                return (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleTag(tag)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${active ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-300'} group-hover:text-indigo-500`}>
                      {tag}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          {/* 期間フィルター */}
          <section>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">期間</p>
            <div className="flex flex-col gap-1.5">
              {DATE_RANGE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="dateRange"
                    value={opt.value}
                    checked={dateRange === opt.value}
                    onChange={() => onDateRangeChange(opt.value)}
                    className="w-3.5 h-3.5 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`text-sm ${dateRange === opt.value ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-300'} group-hover:text-indigo-500`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* ソート */}
          <section>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">並び順</p>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value="created">新着順</option>
              <option value="likes">いいね数順</option>
            </select>
          </section>

          {/* リセット */}
          {(selectedTags.length > 0 || dateRange !== 'all' || sort !== 'created') && (
            <button
              onClick={() => {
                onTagsChange([])
                onDateRangeChange('all')
                onSortChange('created')
              }}
              className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-left transition-colors"
            >
              フィルターをリセット
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
