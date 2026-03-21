import { AI_TAGS } from '../constants/tags'
import type { SortOrder } from '../types/qiita'
import type { SourceFilter } from '../types/article'

interface Props {
  selectedTags: string[]
  sort: SortOrder
  source: SourceFilter
  onTagsChange: (tags: string[]) => void
  onSortChange: (sort: SortOrder) => void
  onSourceChange: (source: SourceFilter) => void
}

const SOURCE_OPTIONS: { value: SourceFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'qiita', label: 'Qiita' },
  { value: 'zenn', label: 'Zenn' },
]

export function FilterBar({ selectedTags, sort, source, onTagsChange, onSortChange, onSourceChange }: Props) {
  function toggleTag(tag: string) {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {SOURCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSourceChange(opt.value)}
              className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
                source === opt.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0"
        >
          <option value="created">新着順</option>
          <option value="likes">いいね数順</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {AI_TAGS.map((tag) => {
          const active = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                active
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}
