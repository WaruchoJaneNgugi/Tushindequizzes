import { useState, useCallback, useEffect, useRef } from 'react';
import { ZenCanvas } from './ZenCanvas';
import { createGame, getSelectableTiles, getAvailableMatches, shuffleTiles, hasAvailableMoves } from '../game/engine';
import type { GameState, BoardTile } from '../types';
import { doTilesMatch } from '../game/tiles';
import { STAGES } from '../game/layouts';
import { Undo2, Lightbulb, Shuffle, RotateCcw, Trophy, Play, Target, XCircle, Pause, Settings, Volume2, VolumeX, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { WaveBackground } from './WaveBackground';
import "../styles/styles.css"
function initStage(stageIndex: number, carryOverScore: number = 0): { gameState: GameState, timeRemaining: number } | null {
  const stage = STAGES[stageIndex];
  if (!stage) return null;

  // Transpose layout if on a portrait screen and layout is landscape
  const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
  let finalStage = stage;

  if (isPortrait) {
    let maxX = 0, maxY = 0;
    stage.positions.forEach(p => {
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });
    if (maxX > maxY) {
      finalStage = {
        ...stage,
        positions: stage.positions.map(p => ({ ...p, x: p.y, y: p.x }))
      };
    }
  }

  return {
    gameState: createGame(finalStage, carryOverScore),
    timeRemaining: stage.timeLimit
  };
}

export function ZenMain() {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState | null>(() => {
    const init = initStage(0, 0);
    return init ? init.gameState : null;
  });
  const [hintedTiles, setHintedTiles] = useState<[string, string] | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const init = initStage(0, 0);
    return init ? init.timeRemaining : 0;
  });
  const [hintCooldown, setHintCooldown] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);

  const { width, height } = useWindowSize();
  const { playClick, playMatch, playUndo, playVictory, playGameOver } = useSoundEffects(isMuted);
  const prevGameStateRef = useRef<GameState | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  // Timer countdown
  useEffect(() => {
    if (!gameState || gameState.isGameOver || gameState.isVictory || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState(gs => gs ? { ...gs, isGameOver: true } : null);
          return 0;
        }
        return prev - 1;
      });
      setHintCooldown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  const startStage = useCallback((stageIndex: number, carryOverScore: number = 0) => {
    const init = initStage(stageIndex, carryOverScore);
    if (!init) return;

    setGameState(init.gameState);
    setCurrentStageIndex(stageIndex);
    setHintedTiles(null);
    setTimeRemaining(init.timeRemaining);
    setHintCooldown(0);
    setIsPaused(false);
    setShowResultPopup(false);
  }, []);

  const startCampaign = useCallback(() => {
    startStage(0, 0);
  }, [startStage]);

  const handleTileClick = useCallback((tile: BoardTile) => {
    if (!gameState || gameState.isGameOver || gameState.isVictory || isPaused) return;

    const isDeselect = gameState.selectedTileId === tile.id;
    const isSelect = !gameState.selectedTileId;
    const selectedTile = gameState.tiles.find(t => t.id === gameState.selectedTileId);
    const isMatch = selectedTile && doTilesMatch(selectedTile.type, tile.type);

    if (isDeselect || isSelect || !isMatch) {
      playClick();
    } else if (isMatch) {
      playMatch();
    }

    setGameState(prev => {
      if (!prev) return prev;

      // If clicking the already selected tile, deselect it
      if (prev.selectedTileId === tile.id) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        return { ...prev, selectedTileId: null };
      }

      // If no tile is selected, select this one
      if (!prev.selectedTileId) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        return { ...prev, selectedTileId: tile.id };
      }

      // If a tile is already selected, check for a match
      const selectedTile = prev.tiles.find(t => t.id === prev.selectedTileId);
      if (selectedTile && doTilesMatch(selectedTile.type, tile.type)) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([20, 30, 20]);
        // Match found! Remove both tiles.
        const newTiles = prev.tiles.filter(t => t.id !== tile.id && t.id !== selectedTile.id);
        const isVictory = newTiles.length === 0;
        const points = prev.stage.pointsPerMatch;

        return {
          ...prev,
          tiles: newTiles,
          selectedTileId: null,
          history: [...prev.history, { t1: selectedTile, t2: tile }],
          score: prev.score + points,
          matches: prev.matches + 1,
          isVictory,
        };
      }

      // If they don't match, select the new tile instead
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
      return { ...prev, selectedTileId: tile.id };
    });

    // Clear hints on any click
    setHintedTiles(null);
  }, [gameState, playClick, playMatch, isPaused]);

  const handleUndo = useCallback(() => {
    if (!gameState || gameState.history.length === 0 || isPaused || gameState.isGameOver || gameState.isVictory) return;
    playUndo();
    setGameState(prev => {
      if (!prev || prev.history.length === 0) return prev;

      const newHistory = [...prev.history];
      const lastMove = newHistory.pop()!;

      const points = prev.stage.pointsPerMatch;

      return {
        ...prev,
        tiles: [...prev.tiles, lastMove.t1, lastMove.t2],
        history: newHistory,
        score: Math.max(0, prev.score - points),
        matches: prev.matches - 1,
        selectedTileId: null,
        isVictory: false,
        isGameOver: false,
      };
    });
    setHintedTiles(null);
  }, [gameState, playUndo, isPaused]);

  const handleHint = useCallback(() => {
    if (!gameState || hintCooldown > 0 || isPaused) return;
    const matches = getAvailableMatches(gameState.tiles);
    if (matches.length > 0) {
      // Pick a random match
      const match = matches[Math.floor(Math.random() * matches.length)];
      setHintedTiles([match[0].id, match[1].id]);
      setHintCooldown(5); // 5 seconds cooldown
      setGameState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          score: Math.max(0, prev.score - 1) // Deduct 1 point
        };
      });
    }
  }, [gameState, hintCooldown, isPaused]);

  const handleShuffle = useCallback(() => {
    if (isPaused) return;
    setGameState(prev => {
      if (!prev) return prev;

      let newTiles = shuffleTiles(prev.tiles);
      let attempts = 0;

      // Try to find a solvable shuffle
      while (!hasAvailableMoves(newTiles) && attempts < 50) {
        newTiles = shuffleTiles(prev.tiles);
        attempts++;
      }

      // If we still can't find any moves after 50 shuffles, the physical layout is unsolvable
      // (e.g., the only remaining matching pair is stacked on top of each other)
      if (!hasAvailableMoves(newTiles)) {
        return {
          ...prev,
          isGameOver: true,
        };
      }

      return {
        ...prev,
        tiles: newTiles,
        history: [], // Clear history on shuffle
        selectedTileId: null,
        score: Math.max(0, prev.score - Math.max(1, Math.floor(prev.stage.pointsPerMatch / 2))), // Small penalty for shuffling
      };
    });
    setHintedTiles(null);
  }, [isPaused]);

  useEffect(() => {
    if (!gameState) return;

    const pointsPerMatch = gameState.stage.pointsPerMatch;
    const maxStageScore = (gameState.stage.positions.length / 2) * pointsPerMatch;
    const targetStageScore = gameState.initialScore + Math.floor(maxStageScore * 0.95);

    const hasMetScoreObjective = gameState.score >= targetStageScore;
    const isStageClear = gameState.isVictory && hasMetScoreObjective;
    const isStageFailed = (gameState.isVictory && !hasMetScoreObjective) || gameState.isGameOver;

    const prev = prevGameStateRef.current;

    const prevHasMetScoreObjective = prev ? prev.score >= targetStageScore : false;
    const prevIsStageClear = prev ? prev.isVictory && prevHasMetScoreObjective : false;
    const prevIsStageFailed = prev ? (prev.isVictory && !prevHasMetScoreObjective) || prev.isGameOver : false;

    if (isStageClear && !prevIsStageClear) {
      setTimeout(() => {
        playVictory();
        setShowResultPopup(true);
      }, 1000);
    } else if (isStageFailed && !prevIsStageFailed) {
      setTimeout(() => {
        playGameOver();
        setShowResultPopup(true);
      }, 1000);
    }

    prevGameStateRef.current = gameState;
  }, [gameState, playVictory, playGameOver]);

  if (!gameState || currentStageIndex === -1) {
    return null;
  }

  const selectableTiles = getSelectableTiles(gameState.tiles);
  const availableMatches = getAvailableMatches(gameState.tiles);
  const noMovesLeft = gameState.tiles.length > 0 && availableMatches.length === 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate target score for this stage based on level
  const pointsPerMatch = gameState.stage.pointsPerMatch;
  const maxStageScore = (gameState.stage.positions.length / 2) * pointsPerMatch;
  const targetStageScore = gameState.initialScore + Math.floor(maxStageScore * 0.95);

  const hasMetScoreObjective = gameState.score >= targetStageScore;
  const isStageClear = gameState.isVictory && hasMetScoreObjective;
  const isStageFailed = (gameState.isVictory && !hasMetScoreObjective) || gameState.isGameOver;

  return (
      <div className="mahjong-app-container">
        <WaveBackground />
        {/* Header */}
        <header className="mahjong-game-header">
          <div className="mahjong-header-group">
            <button
                onClick={() => startStage(currentStageIndex, 0)}
                className="mahjong-icon-btn"
                title="Restart Stage"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="mahjong-stat-col">
              <span className="mahjong-stat-label">Score</span>
              <span className="mahjong-stat-value">{gameState.score}</span>
            </div>
          </div>

          <div className="mahjong-stat-col center">
            <span className="mahjong-stat-label">{gameState.stage.difficulty}</span>
            <span className="mahjong-target-value">Target: {targetStageScore}</span>
          </div>

          <div className="mahjong-header-group">
            <div className="mahjong-stat-col center">
              <span className="mahjong-stat-label">Time</span>
              <span className={`mahjong-stat-value mono ${timeRemaining <= 30 ? 'danger' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
            </div>
            <div className="mahjong-settings-container" ref={settingsRef}>
              <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`mahjong-settings-btn ${showSettings ? 'active' : ''}`}
              >
                <Settings className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showSettings && (
                    <>
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="mahjong-settings-menu"
                      >
                        <div className="py-1 relative">
                          <div className="mahjong-settings-header">
                            <span className="mahjong-settings-title">Settings</span>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="mahjong-settings-close"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
                                setShowSettings(false);
                              }}
                              className="mahjong-settings-item"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            <span className="mahjong-settings-item-text">{isMuted ? 'Unmute Sound' : 'Mute Sound'}</span>
                          </button>
                          <div className="mahjong-settings-divider" />
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowHowToPlay(true);
                                setShowSettings(false);
                                if (!isPaused && !gameState.isGameOver && !gameState.isVictory) {
                                  setIsPaused(true);
                                }
                              }}
                              className="mahjong-settings-item"
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span className="mahjong-settings-item-text">How to Play</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Game Board */}
        <main className="mahjong-main-content">
          {isStageClear && showResultPopup && (
              <Confetti
                  width={width}
                  height={height}
                  recycle={false}
                  numberOfPieces={500}
                  gravity={0.15}
                  colors={['#fcd34d', '#34d399', '#60a5fa', '#fb7185', '#c084fc', '#facc15']}
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 100 }}
              />
          )}

          {/* Paused Overlay */}
          <AnimatePresence>
            {isPaused && !isStageClear && !isStageFailed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mahjong-screen-overlay"
                >
                  <div className="mahjong-screen-card">
                    <div className="mahjong-screen-icon-wrap success">
                      <Pause className="w-10 h-10" />
                    </div>
                    <h2 className="mahjong-screen-title success">Paused</h2>
                    <p className="mahjong-screen-desc">Take a deep breath. The timer is frozen.</p>
                    <button
                        onClick={() => setIsPaused(false)}
                        className="mahjong-btn-primary"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Resume
                    </button>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* How to Play Modal */}
          <AnimatePresence>
            {showHowToPlay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mahjong-modal-overlay"
                    onClick={() => setShowHowToPlay(false)}
                >
                  <motion.div
                      initial={{ scale: 0.95, y: 20, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.95, y: 20, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="mahjong-modal-card"
                      onClick={e => e.stopPropagation()}
                  >
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none" />

                    <button
                        onClick={() => setShowHowToPlay(false)}
                        className="mahjong-modal-close"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="mahjong-modal-content">
                      <div className="mahjong-modal-header">
                        <div className="mahjong-modal-icon-wrap">
                          <HelpCircle className="w-5 h-5 sm:w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="mahjong-modal-title">How to Play</h2>
                          <p className="mahjong-modal-subtitle">Master the ancient game of Mahjong</p>
                        </div>
                      </div>

                      <div className="mahjong-modal-body">
                        <div className="mahjong-modal-section">
                          <h3 className="mahjong-modal-section-title">
                            <Target className="w-4 h-4 text-emerald-500" />
                            The Goal
                          </h3>
                          <p className="mahjong-modal-section-text">
                            Clear the board by matching pairs of identical tiles before the time runs out.
                          </p>
                        </div>

                        <div>
                          <h3 className="mahjong-modal-section-title">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            The Rules
                          </h3>
                          <ul className="mahjong-modal-list">
                            <li className="mahjong-modal-list-item">
                              <div className="mahjong-modal-list-bullet" />
                              <span>You can only select <strong>"free"</strong> tiles.</span>
                            </li>
                            <li className="mahjong-modal-list-item">
                              <div className="mahjong-modal-list-bullet" />
                              <span>A tile is free if it has <strong>no tile directly on top</strong> of it, and is free on either its <strong>left or right side</strong>.</span>
                            </li>
                            <li className="mahjong-modal-list-item">
                              <div className="mahjong-modal-list-bullet" />
                              <span>Match identical symbols to remove them from the board.</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="mahjong-modal-section-title">
                            <Trophy className="w-4 h-4 text-purple-500" />
                            Pro Tips
                          </h3>
                          <ul className="mahjong-modal-list">
                            <li className="mahjong-modal-list-item">
                              <div className="mahjong-modal-list-bullet purple" />
                              <span>Use the <strong>Hint</strong> button if you get stuck (costs 1 point).</span>
                            </li>
                            <li className="mahjong-modal-list-item">
                              <div className="mahjong-modal-list-bullet purple" />
                              <span>Use the <strong>Shuffle</strong> button if there are no moves left (costs points).</span>
                            </li>
                            <li className="mahjong-modal-list-item">
                              <div className="mahjong-modal-list-bullet purple" />
                              <span>Try to clear the <strong>top layers first</strong> to reveal more tiles below.</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <button
                          onClick={() => setShowHowToPlay(false)}
                          className="mahjong-modal-btn"
                      >
                        Got it, let's play!
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>

          <ZenCanvas
              stage={gameState.stage}
              tiles={gameState.tiles}
              selectableTiles={selectableTiles}
              selectedTileId={gameState.selectedTileId}
              hintedTiles={hintedTiles}
              onTileClick={handleTileClick}
          />

          {/* No Moves Warning */}
          <AnimatePresence>
            {noMovesLeft && !gameState.isVictory && !gameState.isGameOver && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mahjong-warning-toast"
                >
                  <Lightbulb className="w-5 h-5" />
                  No moves left! Try shuffling.
                </motion.div>
            )}
          </AnimatePresence>

          {/* Stage Clear / Failed Screen */}
          <AnimatePresence>
            {(isStageClear || isStageFailed) && showResultPopup && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mahjong-screen-overlay"
                >
                  <div className="mahjong-screen-card">
                    <div className={`mahjong-screen-icon-wrap ${isStageClear ? 'success' : 'danger'}`}>
                      {isStageClear ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                    </div>

                    <h2 className={`mahjong-screen-title ${isStageClear ? 'success' : 'danger'}`}>
                      {isStageClear ? 'Stage Cleared!' : 'Stage Failed'}
                    </h2>

                    <p className="mahjong-screen-desc">
                      {isStageClear
                          ? 'Excellent work! Ready for the next challenge?'
                          : timeRemaining <= 0
                              ? 'Time ran out!'
                              : gameState.isVictory
                                  ? 'You cleared the board but didn\'t meet the score objective.'
                                  : 'No more moves possible! The board is unsolvable.'}
                    </p>

                    <div className="mahjong-stats-grid">
                      <div className="mahjong-stat-card">
                        <div className="mahjong-stat-label">Score</div>
                        <div className={`mahjong-stat-card-value ${hasMetScoreObjective ? 'success' : 'danger'}`}>
                          {gameState.score} <span className="mahjong-stat-card-subvalue">/ {targetStageScore}</span>
                        </div>
                      </div>
                      <div className="mahjong-stat-card">
                        <div className="mahjong-stat-label">Time Left</div>
                        <div className="mahjong-stat-card-time">{formatTime(timeRemaining)}</div>
                      </div>
                    </div>

                    {isStageClear ? (
                        currentStageIndex < STAGES.length - 1 ? (
                            <button
                                onClick={() => startStage(currentStageIndex + 1, gameState.score)}
                                className="mahjong-btn-primary"
                            >
                              <Play className="w-5 h-5 fill-current" />
                              Next Stage
                            </button>
                        ) : (
                            <button
                                onClick={startCampaign}
                                className="mahjong-btn-primary"
                            >
                              <Trophy className="w-5 h-5" />
                              You Win! Play Again
                            </button>
                        )
                    ) : (
                        <button
                            onClick={() => startStage(currentStageIndex, 0)}
                            className="mahjong-btn-secondary"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Retry Stage
                        </button>
                    )}
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Controls */}
        <footer className="mahjong-footer" style={{ transform: 'translateZ(0)' }}>
          <button
              onClick={() => setIsPaused(!isPaused)}
              disabled={gameState.isGameOver || gameState.isVictory}
              className={`mahjong-footer-btn ${isPaused ? 'active' : ''}`}
          >
            {isPaused ? <Play className="mahjong-footer-btn-icon" /> : <Pause className="mahjong-footer-btn-icon" />}
            <span className="mahjong-footer-btn-text">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
              onClick={handleUndo}
              disabled={gameState.history.length === 0 || gameState.isVictory || gameState.isGameOver}
              className="mahjong-footer-btn"
          >
            <Undo2 className="mahjong-footer-btn-icon" />
            <span className="mahjong-footer-btn-text">Undo</span>
          </button>

          <button
              onClick={handleHint}
              disabled={availableMatches.length === 0 || gameState.isVictory || gameState.isGameOver || hintCooldown > 0}
              className="mahjong-hint-btn"
          >
            {hintCooldown > 0 && (
                <div
                    className="mahjong-hint-progress"
                    style={{ height: `${(hintCooldown / 5) * 100}%`, transition: 'height 1s linear' }}
                />
            )}
            <Lightbulb className="mahjong-hint-icon" />
            <span className="mahjong-hint-text">
            {hintCooldown > 0 ? `${hintCooldown}s` : 'Hint'}
          </span>
          </button>

          <button
              onClick={handleShuffle}
              disabled={gameState.tiles.length === 0 || gameState.isVictory || gameState.isGameOver}
              className="mahjong-footer-btn"
          >
            <Shuffle className="mahjong-footer-btn-icon" />
            <span className="mahjong-footer-btn-text">Shuffle</span>
          </button>
        </footer>
      </div>
  );
}
