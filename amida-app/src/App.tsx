import { useState } from 'react'
import type { AmidaConfig } from './types/amida.ts'
import { SetupForm } from './components/SetupForm.tsx'
import { AmidaBoard } from './components/AmidaBoard.tsx'

function App() {
  const [config, setConfig] = useState<AmidaConfig | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <header className="text-center py-8 px-4">
        <h1 className="text-3xl font-black text-indigo-700 tracking-tight">あみだくじ</h1>
        <p className="text-gray-500 text-sm mt-1">運命の線をたどれ！</p>
      </header>

      <main className="flex flex-col items-center px-4 pb-12 gap-6">
        {config === null ? (
          <SetupForm onStart={setConfig} />
        ) : (
          <AmidaBoard config={config} onReset={() => setConfig(null)} />
        )}
      </main>
    </div>
  )
}

export default App
