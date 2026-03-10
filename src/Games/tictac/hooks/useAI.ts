import { useCallback, useRef } from 'react';
import type{ CellValue, GameLevel } from '../types/game.types';
import { getBestAIMove } from '../utils/gameLogic';

interface UseAIReturn {
  requestAIMove: (
    board: CellValue[],
    level: GameLevel,
    onMove: (index: number) => void
  ) => void;
  cancelAI: () => void;
}

export const useAI = (): UseAIReturn => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Cancel any pending AI move */
  const cancelAI = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Computes the best move asynchronously (with a small "thinking" delay so it
   * feels natural) and calls onMove with the chosen board index.
   */
  const requestAIMove = useCallback(
    (board: CellValue[], level: GameLevel, onMove: (index: number) => void) => {
      cancelAI();

      // Delay gives the impression the AI is "thinking"
      const delay = level === 'easy' ? 400 : level === 'medium' ? 600 : level === 'hard' ? 800 : 1000;

      timerRef.current = setTimeout(() => {
        const move = getBestAIMove(board, level);
        if (move !== -1) onMove(move);
        timerRef.current = null;
      }, delay + Math.random() * 200);
    },
    [cancelAI]
  );

  return { requestAIMove, cancelAI };
};
