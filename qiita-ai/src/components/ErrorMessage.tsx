interface Props {
  message: string
  onRetry: () => void
}

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
      >
        再試行
      </button>
    </div>
  )
}
