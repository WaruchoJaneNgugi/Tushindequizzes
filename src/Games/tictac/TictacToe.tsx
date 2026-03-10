import  {type FC, useCallback, useEffect, useRef} from 'react';
import type{ GameLevel } from './types/game.types';
import { LEVEL_CONFIGS } from './utils/gameLogic';
import { usePoints } from './hooks/usePoints';
import { useGameState } from './hooks/useGameState';
import { LevelSelect } from './components/LevelSelect';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { GameOverlay } from './components/GameOverlay';
import "./styles/global.css"

export const TictacToe:FC = () => {
  const { balance, transactions, deductWager, addReward, refundWager, canAfford } = usePoints();

  const currentWagerRef = useRef<number>(0);
  const currentRewardRef = useRef<number>(0);
  const pointsAppliedRef = useRef<boolean>(false);

  const handleWin = useCallback(() => {}, []);
  const handleLose = useCallback(() => {}, []);
  const handleDraw = useCallback(() => {}, []);

  const { state, startGame, handleCellClick, returnToMenu } = useGameState(
      handleWin,
      handleLose,
      handleDraw
  );

  useEffect(() => {
    if (!['won', 'lost', 'draw'].includes(state.status)) {
      pointsAppliedRef.current = false;
      return;
    }
    if (pointsAppliedRef.current) return;
    if (!state.level) return;
    pointsAppliedRef.current = true;

    const cfg = LEVEL_CONFIGS[state.level];
    if (state.status === 'won') {
      addReward(cfg.reward, state.level);
      currentRewardRef.current = cfg.reward;
    } else if (state.status === 'draw' && cfg.drawRefund) {
      refundWager(cfg.wager, state.level);
    }
  }, [state.status, state.level, addReward, refundWager]);

  const handleLevelSelect = useCallback(
      (level: GameLevel) => {
        const cfg = LEVEL_CONFIGS[level];
        if (!canAfford(cfg.wager)) return;
        const ok = deductWager(cfg.wager, level);
        if (!ok) return;
        currentWagerRef.current = cfg.wager;
        currentRewardRef.current = cfg.reward;
        startGame(level);
      },
      [canAfford, deductWager, startGame]
  );

  const handlePlayAgain = useCallback(() => {
    if (!state.level) return;
    const cfg = LEVEL_CONFIGS[state.level];
    if (!canAfford(cfg.wager)) { returnToMenu(); return; }
    const ok = deductWager(cfg.wager, state.level);
    if (!ok) { returnToMenu(); return; }
    currentWagerRef.current = cfg.wager;
    currentRewardRef.current = cfg.reward;
    startGame(state.level);
  }, [state.level, canAfford, deductWager, startGame, returnToMenu]);

  const isGameOver = ['won', 'lost', 'draw'].includes(state.status);

  return (
      <div className="app">
        <div className="bg-blob bg-blob--1" />
        <div className="bg-blob bg-blob--2" />
        <div className="bg-blob bg-blob--3" />

        {state.status === 'menu' ? (
            <LevelSelect balance={balance} onSelectLevel={handleLevelSelect} />
        ) : (
            <div className="game-layout">
              {state.level && (
                  <ScoreBoard
                      balance={balance}
                      level={state.level}
                      currentPlayer={state.currentPlayer}
                      isAIThinking={state.isAIThinking}
                      moveCount={state.moveCount}
                      transactions={transactions}
                  />
              )}
              <div className="canvas-wrapper">
                <div className="canvas-header">
                  <button className="back-btn" onClick={returnToMenu}>
                    ← MENU
                  </button>
                  {state.level && (
                      <div
                          className="canvas-level-badge"
                          style={{ color: LEVEL_CONFIGS[state.level].color }}
                      >
                        {LEVEL_CONFIGS[state.level].label}
                      </div>
                  )}
                </div>
                <GameCanvas
                    gameState={state}
                    onCellClick={handleCellClick}
                    onCellPlaced={() => {}}
                    onWinAnimTrigger={() => {}}
                />
              </div>
            </div>
        )}

        {isGameOver && state.level && (
            <GameOverlay
                status={state.status as 'won' | 'lost' | 'draw'}
                level={state.level}
                balance={balance}
                reward={currentRewardRef.current}
                wager={currentWagerRef.current}
                onPlayAgain={handlePlayAgain}
                onMenu={returnToMenu}
            />
        )}
      </div>
  );
};


