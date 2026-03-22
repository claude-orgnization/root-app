import type { DateRange } from '../types/github'
import { LANGUAGES, type Language } from '../constants/languages'

interface Props {
  dateRange: DateRange
  language: Language
  onDateRangeChange: (range: DateRange) => void
  onLanguageChange: (lang: Language) => void
}

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  today: '今日',
  week: '今週',
  month: '今月',
}

export function FilterBar({ dateRange, language, onDateRangeChange, onLanguageChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex gap-1">
        {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((range) => (
          <button
            key={range}
            onClick={() => onDateRangeChange(range)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              dateRange === range
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {DATE_RANGE_LABELS[range]}
          </button>
        ))}
      </div>

      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang === 'All' ? 'すべての言語' : lang}
          </option>
        ))}
      </select>
    </div>
  )
}
