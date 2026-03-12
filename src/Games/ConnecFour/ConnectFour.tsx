import { useCallback } from 'react';
import { type Difficulty, LEVEL_CONFIGS } from './types/game.types';
import { useConnect4 } from './hooks/useConnect4';
import { usePoints } from './hooks/usePoints';
import GameMenu from './components/GameMenu';
import LevelSelect from './components/LevelSelect';
import GameBoard from './components/GameBoard';
import WinLoseModal from './components/WinLoseModal';
import './index.css';

export const ConnectFour=()=> {
  const { points, deductPoints, addPoints, canAfford } = usePoints();

  const handleWin  = useCallback((reward: number) => addPoints(reward), [addPoints]);
  const handleLose = useCallback(() => {}, []);

  const {
    board, currentTurn, gamePhase, gameResult, winningCells,
    selectedDifficulty, hoverCol, isAIThinking, lastDropCol,
    startGame, handleColumnClick, handleColumnHover,
    playAgain, goToMenu, goToLevelSelect,
  } = useConnect4(handleWin, handleLose);

  const handleSelectLevel = useCallback((difficulty: Difficulty) => {
    const config = LEVEL_CONFIGS[difficulty];
    if (!canAfford(config.cost)) return;
    if (deductPoints(config.cost)) startGame(difficulty);
  }, [canAfford, deductPoints, startGame]);

  return (
    <div className="app-root">
      {/* Star field */}
      <div className="stars-layer stars-sm" />
      <div className="stars-layer stars-md" />
      <div className="stars-layer stars-lg" />

      {gamePhase === 'menu' && (
        <GameMenu points={points} onPlay={goToLevelSelect} />
      )}

      {gamePhase === 'levelSelect' && (
        <LevelSelect
          points={points}
          onSelectLevel={handleSelectLevel}
          onBack={goToMenu}
          canAfford={canAfford}
        />
      )}

      {(gamePhase === 'playing' || gamePhase === 'gameOver') && (
        <GameBoard
          board={board}
          currentTurn={currentTurn}
          winningCells={winningCells}
          hoverCol={hoverCol}
          isAIThinking={isAIThinking}
          lastDropCol={lastDropCol}
          selectedDifficulty={selectedDifficulty}
          points={points}
          onColumnClick={handleColumnClick}
          onColumnHover={handleColumnHover}
          onMenu={goToMenu}
        />
      )}

      {gamePhase === 'gameOver' && gameResult && (
        <WinLoseModal
          result={gameResult}
          difficulty={selectedDifficulty}
          points={points}
          onPlayAgain={playAgain}
          onMenu={goToMenu}
        />
      )}
    </div>
  );
}
