import { useState } from 'react'
import type { GameMode } from './types/game'
import { useGameState } from './hooks/useGameState'
import { useHardGameState } from './hooks/useHardGameState'
import { GameHeader } from './components/GameHeader'
import { PuzzleBoard } from './components/PuzzleBoard'
import { HardPuzzleCanvas } from './components/HardPuzzleCanvas'
import { LevelComplete } from './components/LevelComplete'
import { ModeSelector } from './components/ModeSelector'

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null)

  const easyGame = useGameState()
  const hardGame = useHardGameState()

  if (gameMode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex items-center justify-center">
        <ModeSelector onSelect={setGameMode} />
      </div>
    )
  }

  const handleModeChange = () => {
    setGameMode(null)
  }

  if (gameMode === 'easy') {
    const { level, score, isComplete, wrongSlotId, availablePieceIds, placePieceById, nextLevel, restart } =
      easyGame
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
        <GameHeader level={level.number} score={score} mode={gameMode} onModeChange={handleModeChange} />
        {isComplete ? (
          <LevelComplete score={score} level={level.number} onNextLevel={nextLevel} onRestart={restart} />
        ) : (
          <PuzzleBoard
            level={level}
            wrongSlotId={wrongSlotId}
            availablePieceIds={availablePieceIds}
            placePieceById={placePieceById}
          />
        )}
      </div>
    )
  }

  // Hard mode
  const {
    puzzleIndex,
    config,
    slots,
    pieces,
    score: hardScore,
    isComplete: hardIsComplete,
    wrongSlotId: hardWrongSlotId,
    availablePieceIds: hardAvailableIds,
    placePieceById: hardPlacePiece,
    nextPuzzle,
    restart: hardRestart,
  } = hardGame

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-amber-100">
      <GameHeader
        level={puzzleIndex + 1}
        score={hardScore}
        mode={gameMode}
        onModeChange={handleModeChange}
      />
      {hardIsComplete ? (
        <LevelComplete
          score={hardScore}
          level={puzzleIndex + 1}
          onNextLevel={nextPuzzle}
          onRestart={hardRestart}
        />
      ) : (
        <HardPuzzleCanvas
          config={config}
          slots={slots}
          pieces={pieces}
          wrongSlotId={hardWrongSlotId}
          availablePieceIds={hardAvailableIds}
          placePieceById={hardPlacePiece}
        />
      )}
    </div>
  )
}

export default App
