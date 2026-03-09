import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSudoku } from './hooks/useSudoku';
import { SettingsDropdown } from './components/SettingsDropdown';
import { HowToPlayModal } from './components/HowToPlayModal';
import { NewGameModal } from './components/NewGameModal';
import { Message } from './components/Message';
import { CanvasGame } from './components/CanvasGame';
import { CongratsModal } from './components/CongratsModal';
import { soundEngine } from './utils/sound';
import "./styles/styles.css"
export const SudokuGame=()=> {
  const {
    board,
    selected,
    setSelected,
    difficulty,
    stage,
    unlockedLevels,
    score,
    startNewGame,
    replayGame,
    nextStage,
    handleInput,
    handleErase,
    handleHint,
    hasConflict,
    isRelated,
    isSameValue,
    isComplete,
    hintedCell
  } = useSudoku();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isNewGameOpen, setIsNewGameOpen] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    soundEngine.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (isComplete) {
      soundEngine.playWin();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa', '#fef08a', '#fde047']
      });
    }
  }, [isComplete]);

  const handleNextLevel = () => {
    nextStage();
  };

  const handleReplay = () => {
    replayGame();
  };

  const STAGES_PER_LEVEL = {
    Easy: 3,
    Medium: 6,
    Hard: 10
  };

  return (
      <div className="sudoku-wrapper">
        <div className="sudoku-card">

          {/* Header */}
          <div className="sudoku-header sudoku-header-dynamic" style={{ width: canvasWidth ? `${canvasWidth}px` : '100%' }}>
            <div className="sudoku-header-title">
              <h1>Sudoku</h1>
              <span>{difficulty} - Stage {stage}/{STAGES_PER_LEVEL[difficulty]}</span>
            </div>
            <div className="sudoku-header-actions">
              <button
                  onClick={() => setIsNewGameOpen(true)}
                  className="sudoku-btn-new-game"
              >
                New Game
              </button>
              <SettingsDropdown
                  isSettingsOpen={isSettingsOpen}
                  setIsSettingsOpen={setIsSettingsOpen}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  setIsHowToPlayOpen={setIsHowToPlayOpen}
              />
            </div>
          </div>

          <div className="sudoku-canvas-wrapper">
            {board && board.length > 0 ? (
                <CanvasGame
                    board={board}
                    selected={selected}
                    setSelected={setSelected}
                    hasConflict={hasConflict}
                    isSameValue={isSameValue}
                    isRelated={isRelated}
                    handleHint={handleHint}
                    handleInput={handleInput}
                    handleErase={handleErase}
                    score={score}
                    hintedCell={hintedCell}
                    onWidthChange={setCanvasWidth}
                />
            ) : (
                <div className="sudoku-loading">
                  Loading...
                </div>
            )}
          </div>

          <div className="sudoku-message-wrapper" style={{ width: canvasWidth ? `${canvasWidth}px` : '100%' }}>
            <Message isComplete={isComplete ?? false} difficulty={difficulty} stage={stage} />
          </div>
        </div>

        <HowToPlayModal
            isOpen={isHowToPlayOpen}
            onClose={() => setIsHowToPlayOpen(false)}
        />

        <NewGameModal
            isOpen={isNewGameOpen}
            onClose={() => setIsNewGameOpen(false)}
            onStart={startNewGame}
            unlockedLevels={unlockedLevels}
        />

        <CongratsModal
            isOpen={isComplete ?? false}
            onNext={handleNextLevel}
            onReplay={handleReplay}
        />
      </div>
  );
}
