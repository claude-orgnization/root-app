import { useGameState } from './hooks/useGameState'
import { GameHeader } from './components/GameHeader'
import { PuzzleBoard } from './components/PuzzleBoard'
import { LevelComplete } from './components/LevelComplete'

function App() {
  const {
    level,
    score,
    isComplete,
    wrongSlotId,
    availablePieceIds,
    placePieceById,
    nextLevel,
    restart,
  } = useGameState()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
      <GameHeader level={level.number} score={score} />
      {isComplete ? (
        <LevelComplete
          score={score}
          level={level.number}
          onNextLevel={nextLevel}
          onRestart={restart}
        />
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

export default App
