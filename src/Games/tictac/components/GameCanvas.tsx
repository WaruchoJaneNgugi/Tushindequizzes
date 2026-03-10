import React, { useEffect, useRef } from 'react';
import type { GameState } from '../types/game.types';
import { LEVEL_CONFIGS } from '../utils/gameLogic';
import { useCanvas3D } from '../hooks/useCanvas3D';

interface GameCanvasProps {
  gameState: GameState;
  onCellClick: (index: number) => void;
  onCellPlaced: (index: number, player: 'X' | 'O') => void;
  onWinAnimTrigger: (line: number[], color: string) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  onCellClick,
  onCellPlaced,
  onWinAnimTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevBoardRef = useRef<(string | null)[]>(Array(9).fill(null));
  const prevWinRef = useRef<number[] | null>(null);

  const levelCfg = gameState.level ? LEVEL_CONFIGS[gameState.level] : null;
  const playerColor = '#00eeff';
  const aiColor = levelCfg?.color ?? '#ff2266';

  const {
    updateConfig,
    triggerCellAnim,
    triggerWinBurst,
    handleCanvasClick,
    handleCanvasMouseMove,
    reset,
  } = useCanvas3D(canvasRef);

  // Sync config every render
  useEffect(() => {
    updateConfig({
      board: gameState.board,
      winningLine: gameState.winningLine,
      currentPlayer: gameState.currentPlayer,
      isAIThinking: gameState.isAIThinking,
      status: gameState.status,
      playerColor,
      aiColor,
      winner: gameState.winner,
      onCellClick,
    });
  });

  // Detect new cell placements
  useEffect(() => {
    const prev = prevBoardRef.current;
    const curr = gameState.board;
    for (let i = 0; i < 9; i++) {
      if (prev[i] !== curr[i] && curr[i] !== null) {
        const color = curr[i] === 'X' ? playerColor : aiColor;
        triggerCellAnim(i, color);
        onCellPlaced(i, curr[i] as 'X' | 'O');
      }
    }
    prevBoardRef.current = [...curr];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.board]);

  // Detect win
  useEffect(() => {
    if (
      gameState.winningLine &&
      JSON.stringify(gameState.winningLine) !== JSON.stringify(prevWinRef.current)
    ) {
      const color = gameState.winner === 'X' ? playerColor : aiColor;
      triggerWinBurst(gameState.winningLine, color);
      onWinAnimTrigger(gameState.winningLine, color);
      prevWinRef.current = gameState.winningLine;
    }
    if (!gameState.winningLine) prevWinRef.current = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.winningLine, gameState.winner]);

  // Reset on new game
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.moveCount === 0) {
      reset();
      prevBoardRef.current = Array(9).fill(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.status, gameState.moveCount]);

  const canClick = gameState.currentPlayer === 'X' && gameState.status === 'playing' && !gameState.isAIThinking;

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      style={{ cursor: canClick ? 'crosshair' : 'default' }}
    />
  );
};
