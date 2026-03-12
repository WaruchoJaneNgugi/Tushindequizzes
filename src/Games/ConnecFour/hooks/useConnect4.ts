import { useState, useCallback, useRef } from 'react';
import { type Board, type CellValue, type Difficulty, type GamePhase, type GameResult, LEVEL_CONFIGS } from '../types/game.types';
import { createEmptyBoard, dropPiece, checkWinner, isDraw } from '../utils/gameLogic';
import { getAIMove } from '../utils/aiEngine';

export interface UseConnect4Return {
  board: Board;
  currentTurn: 'player' | 'computer';
  gamePhase: GamePhase;
  gameResult: GameResult;
  winner: CellValue;
  winningCells: [number, number][];
  selectedDifficulty: Difficulty | null;
  hoverCol: number | null;
  isAIThinking: boolean;
  lastDropCol: number | null;
  startGame: (difficulty: Difficulty) => void;
  handleColumnClick: (col: number) => void;
  handleColumnHover: (col: number | null) => void;
  playAgain: () => void;
  goToMenu: () => void;
  goToLevelSelect: () => void;
}

export const useConnect4 = (
  onWin: (reward: number) => void,
  onLose: () => void,
): UseConnect4Return => {
  const [board, setBoard]               = useState<Board>(createEmptyBoard());
  const [currentTurn, setCurrentTurn]   = useState<'player' | 'computer'>('player');
  const [gamePhase, setGamePhase]       = useState<GamePhase>('menu');
  const [gameResult, setGameResult]     = useState<GameResult>(null);
  const [winner, setWinner]             = useState<CellValue>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [selectedDifficulty, setDiff]   = useState<Difficulty | null>(null);
  const [hoverCol, setHoverCol]         = useState<number | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [lastDropCol, setLastDropCol]   = useState<number | null>(null);

  const diffRef      = useRef<Difficulty | null>(null);
  const aiTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessing = useRef(false);

  const evaluateBoard = useCallback((updatedBoard: Board): boolean => {
    const { winner: w, cells } = checkWinner(updatedBoard);
    if (w) {
      setWinner(w); setWinningCells(cells);
      setGameResult(w === 'player' ? 'won' : 'lost');
      setGamePhase('gameOver');
      const diff = diffRef.current;
      if (w === 'player' && diff) setTimeout(() => onWin(LEVEL_CONFIGS[diff].reward), 300);
      else if (w === 'computer')  setTimeout(() => onLose(), 300);
      return true;
    }
    if (isDraw(updatedBoard)) {
      setGameResult('draw'); setGamePhase('gameOver'); return true;
    }
    return false;
  }, [onWin, onLose]);

  const scheduleAIMove = useCallback((currentBoard: Board) => {
    const diff = diffRef.current;
    if (!diff) return;
    setIsAIThinking(true);
    aiTimerRef.current = setTimeout(() => {
      const col = getAIMove(currentBoard, diff);
      if (col === -1) { setIsAIThinking(false); return; }
      setLastDropCol(col);
      setTimeout(() => {
        const res = dropPiece(currentBoard, col, 'computer');
        setLastDropCol(null); setIsAIThinking(false);
        if (!res) return;
        setBoard(res.board);
        const ended = evaluateBoard(res.board);
        if (!ended) setCurrentTurn('player');
        isProcessing.current = false;
      }, 280);
    }, LEVEL_CONFIGS[diff].thinkMs);
  }, [evaluateBoard]);

  const handleColumnClick = useCallback((col: number) => {
    if (gamePhase !== 'playing' || currentTurn !== 'player' || isAIThinking || isProcessing.current) return;
    if (board[0][col] !== null) return;
    isProcessing.current = true;
    setLastDropCol(col);
    setTimeout(() => {
      const res = dropPiece(board, col, 'player');
      setLastDropCol(null);
      if (!res) { isProcessing.current = false; return; }
      setBoard(res.board);
      const ended = evaluateBoard(res.board);
      if (!ended) { setCurrentTurn('computer'); scheduleAIMove(res.board); }
      else isProcessing.current = false;
    }, 200);
  }, [board, currentTurn, gamePhase, isAIThinking, evaluateBoard, scheduleAIMove]);

  const handleColumnHover = useCallback((col: number | null) => {
    if (gamePhase === 'playing' && currentTurn === 'player' && !isAIThinking) setHoverCol(col);
  }, [gamePhase, currentTurn, isAIThinking]);

  const resetState = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    isProcessing.current = false;
    setBoard(createEmptyBoard());
    setCurrentTurn('player');
    setGameResult(null);
    setWinner(null);
    setWinningCells([]);
    setHoverCol(null);
    setIsAIThinking(false);
    setLastDropCol(null);
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    resetState();
    diffRef.current = difficulty;
    setDiff(difficulty);
    setGamePhase('playing');
  }, [resetState]);

  const playAgain = useCallback(() => {
    resetState();
    setGamePhase('levelSelect');
  }, [resetState]);

  const goToMenu = useCallback(() => {
    resetState();
    setDiff(null);
    setGamePhase('menu');
  }, [resetState]);

  const goToLevelSelect = useCallback(() => { setGamePhase('levelSelect'); }, []);

  return {
    board, currentTurn, gamePhase, gameResult, winner, winningCells,
    selectedDifficulty, hoverCol, isAIThinking, lastDropCol,
    startGame, handleColumnClick, handleColumnHover, playAgain, goToMenu, goToLevelSelect,
  };
};
