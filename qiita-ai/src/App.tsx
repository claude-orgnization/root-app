import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { BoardPage } from './pages/BoardPage'
import { AboutPage } from './pages/AboutPage'

function App() {
  return (
    <BrowserRouter basename="/root-app/qiita-ai">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
