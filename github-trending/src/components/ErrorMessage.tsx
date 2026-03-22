interface Props {
  message: string
  onRetry: () => void
}

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
      >
        リトライ
      </button>
    </div>
  )
}
