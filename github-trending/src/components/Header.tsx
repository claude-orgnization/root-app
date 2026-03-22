import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>⭐</span>
          <span>GitHub Trending</span>
        </Link>
        <nav className="flex gap-4">
          <Link
            to="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ホーム
          </Link>
          <Link
            to="/about"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
