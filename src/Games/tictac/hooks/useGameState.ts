import { useCallback, useEffect, useRef, useState } from 'react';
import type{ CellValue, GameLevel, GameState } from '../types/game.types';
import { checkWinner, isDraw } from '../utils/gameLogic';
import { useAI } from './useAI';

const INITIAL_STATE: GameState = {
  board: Array(9).fill(null) as CellValue[],
  currentPlayer: 'X',
  status: 'menu',
  winner: null,
  winningLine: null,
  level: null,
  isAIThinking: false,
  moveCount: 0,
};

interface UseGameStateReturn {
  state: GameState;
  startGame: (level: GameLevel) => void;
  handleCellClick: (index: number) => void;
  returnToMenu: () => void;
}

export const useGameState = (
  onWin: () => void,
  onLose: () => void,
  onDraw: () => void
): UseGameStateReturn => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const { requestAIMove, cancelAI } = useAI();

  // We need a stable ref to the latest state for use inside callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  const applyMove = useCallback(
    (index: number, player: 'X' | 'O'): GameState | null => {
      const prev = stateRef.current;
      if (prev.board[index] !== null || prev.status !== 'playing') return null;

      const newBoard = [...prev.board] as CellValue[];
      newBoard[index] = player;

      const { winner, line } = checkWinner(newBoard);
      const moveCount = prev.moveCount + 1;

      if (winner) {
        const status = winner === 'X' ? 'won' : 'lost';
        return { ...prev, board: newBoard, status, winner, winningLine: line, moveCount, isAIThinking: false };
      }
      if (isDraw(newBoard)) {
        return { ...prev, board: newBoard, status: 'draw', winner: null, winningLine: null, moveCount, isAIThinking: false };
      }

      const nextPlayer = player === 'X' ? 'O' : 'X';
      return {
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        moveCount,
        isAIThinking: nextPlayer === 'O',
      };
    },
    []
  );

  const startGame = useCallback((level: GameLevel) => {
    cancelAI();
    setState({
      ...INITIAL_STATE,
      level,
      status: 'playing',
    });
  }, [cancelAI]);

  const handleCellClick = useCallback(
    (index: number) => {
      const { status, currentPlayer, isAIThinking } = stateRef.current;
      if (status !== 'playing' || currentPlayer !== 'X' || isAIThinking) return;

      const next = applyMove(index, 'X');
      if (!next) return;
      setState(next);
    },
    [applyMove]
  );

  const returnToMenu = useCallback(() => {
    cancelAI();
    setState(INITIAL_STATE);
  }, [cancelAI]);

  // Trigger AI move whenever it's O's turn
  useEffect(() => {
    const { status, currentPlayer, board, level, isAIThinking } = state;
    if (status !== 'playing' || currentPlayer !== 'O' || !isAIThinking || !level) return;

    requestAIMove(board, level, (aiIndex) => {
      const next = applyMove(aiIndex, 'O');
      if (next) setState(next);
    });
  }, [state.currentPlayer, state.isAIThinking, state.status, state.board, state.level, requestAIMove, applyMove]);

  // Fire callbacks when game ends
  useEffect(() => {
    if (state.status === 'won') onWin();
    else if (state.status === 'lost') onLose();
    else if (state.status === 'draw') onDraw();
  }, [state.status, onWin, onLose, onDraw]);

  return { state, startGame, handleCellClick, returnToMenu };
};
