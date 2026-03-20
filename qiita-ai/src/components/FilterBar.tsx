import { AI_TAGS } from '../constants/tags'
import type { SortOrder } from '../types/qiita'

interface Props {
  selectedTags: string[]
  sort: SortOrder
  onTagsChange: (tags: string[]) => void
  onSortChange: (sort: SortOrder) => void
}

export function FilterBar({ selectedTags, sort, onTagsChange, onSortChange }: Props) {
  function toggleTag(tag: string) {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
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

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOrder)}
        className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0"
      >
        <option value="created">新着順</option>
        <option value="likes">いいね数順</option>
      </select>
    </div>
  )
}
