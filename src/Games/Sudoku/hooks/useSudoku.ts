import { useState, useEffect, useCallback, useRef } from 'react';
import type {Board} from '../types';
import {type Difficulty, generatePuzzle, solveBoard } from '../utils/sudoku';
import { soundEngine } from '../utils/sound';

const STAGES_PER_LEVEL = {
  Easy: 3,
  Medium: 6,
  Hard: 10
};

export const useSudoku = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [stage, setStage] = useState<number>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<Difficulty[]>(['Easy']);
  const [score, setScore] = useState<number>(10);

  const [board, setBoard] = useState<Board>(() => generatePuzzle('Easy'));
  const [selected, setSelected] = useState<{r: number, c: number} | null>(null);
  const [solution, setSolution] = useState<Board | null>(() => solveBoard(board, 'Easy'));
  const [hintedCell, setHintedCell] = useState<{r: number, c: number} | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNewGame = useCallback((newDifficulty: Difficulty, newStage: number = 1) => {
    setDifficulty(newDifficulty);
    setStage(newStage);
    const newBoard = generatePuzzle(newDifficulty);
    setBoard(newBoard);
    setSolution(solveBoard(newBoard, newDifficulty));
    setSelected(null);
    setHintedCell(null);
  }, []);

  const replayGame = useCallback(() => {
    setBoard(prev => prev.map(row => row.map(cell => ({
      ...cell,
      value: cell.isFixed ? cell.value : null,
      notes: []
    }))));
    setSelected(null);
    setHintedCell(null);
  }, []);

  const nextStage = useCallback(() => {
    let points = 0;
    if (difficulty === 'Easy') points = 10;
    else if (difficulty === 'Medium') points = 15;
    else if (difficulty === 'Hard') points = 30;
    setScore(prev => prev + points);

    const maxStages = STAGES_PER_LEVEL[difficulty];
    if (stage < maxStages) {
      startNewGame(difficulty, stage + 1);
    } else {
      let nextDiff: Difficulty = 'Easy';
      if (difficulty === 'Easy') nextDiff = 'Medium';
      else if (difficulty === 'Medium') nextDiff = 'Hard';
      else nextDiff = 'Hard';

      setUnlockedLevels(prev => {
        if (!prev.includes(nextDiff)) return [...prev, nextDiff];
        return prev;
      });

      startNewGame(nextDiff, 1);
    }
  }, [difficulty, stage, startNewGame]);

  const handleInput = useCallback((num: number) => {
    if (!selected) return;
    const { r, c } = selected;
    if (board[r][c].isFixed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[r][c].value === num) {
      newBoard[r][c].value = null;
      soundEngine.playErase();
    } else {
      newBoard[r][c].value = num;
      // Check if this new value causes a conflict
      const hasConflictNow = () => {
        const val = num;
        const size = newBoard.length;
        for (let i = 0; i < size; i++) {
          if (i !== c && newBoard[r][i].value === val) return true;
          if (i !== r && newBoard[i][c].value === val) return true;
        }
        const blockR = size === 6 ? 2 : 3;
        const blockC = 3;
        const br = Math.floor(r / blockR) * blockR;
        const bc = Math.floor(c / blockC) * blockC;
        for (let i = 0; i < blockR; i++) {
          for (let j = 0; j < blockC; j++) {
            const rr = br + i;
            const cc = bc + j;
            if ((rr !== r || cc !== c) && newBoard[rr][cc].value === val) return true;
          }
        }
        return false;
      };

      if (hasConflictNow()) {
        soundEngine.playError();
      } else {
        soundEngine.playClick();
      }
    }
    setBoard(newBoard);
  }, [selected, board]);

  const handleErase = useCallback(() => {
    if (!selected) return;
    const { r, c } = selected;
    if (board[r][c].isFixed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    if (newBoard[r][c].value !== null) {
      soundEngine.playErase();
    }
    newBoard[r][c].value = null;
    setBoard(newBoard);
  }, [selected, board]);

  const handleHint = useCallback(() => {
    if (!solution) return;
    if (score < 2) {
      soundEngine.playError();
      return;
    }
    const size = board.length;

    const triggerHintHighlight = (r: number, c: number) => {
      setHintedCell({ r, c });
      soundEngine.playHint();
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => setHintedCell(null), 1500);
    };

    if (selected) {
      const { r, c } = selected;
      if (!board[r][c].isFixed && board[r][c].value !== solution[r][c].value) {
        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        newBoard[r][c].value = solution[r][c].value;
        setBoard(newBoard);
        setScore(prev => prev - 2);
        triggerHintHighlight(r, c);
        return;
      }
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!board[r][c].isFixed && board[r][c].value !== solution[r][c].value) {
          const newBoard = board.map(row => row.map(cell => ({ ...cell })));
          newBoard[r][c].value = solution[r][c].value;
          setBoard(newBoard);
          setSelected({ r, c });
          setScore(prev => prev - 2);
          triggerHintHighlight(r, c);
          return;
        }
      }
    }
  }, [board, selected, solution, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const size = board.length;
      if (size === 6 && e.key >= '1' && e.key <= '6') {
        handleInput(parseInt(e.key));
      } else if (size === 9 && e.key >= '1' && e.key <= '9') {
        handleInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'ArrowUp') {
        setSelected(prev => prev ? { r: Math.max(0, prev.r - 1), c: prev.c } : { r: size - 1, c: 0 });
      } else if (e.key === 'ArrowDown') {
        setSelected(prev => prev ? { r: Math.min(size - 1, prev.r + 1), c: prev.c } : { r: 0, c: 0 });
      } else if (e.key === 'ArrowLeft') {
        setSelected(prev => prev ? { r: prev.r, c: Math.max(0, prev.c - 1) } : { r: 0, c: size - 1 });
      } else if (e.key === 'ArrowRight') {
        setSelected(prev => prev ? { r: prev.r, c: Math.min(size - 1, prev.c + 1) } : { r: 0, c: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleErase, board.length]);

  const hasConflict = (r: number, c: number) => {
    if (!board[r] || !board[r][c]) return false;
    const val = board[r][c].value;
    if (!val) return false;

    const size = board.length;
    for (let i = 0; i < size; i++) {
      if (i !== c && board[r][i].value === val) return true;
      if (i !== r && board[i][c].value === val) return true;
    }

    const blockR = size === 6 ? 2 : 3;
    const blockC = 3;
    const br = Math.floor(r / blockR) * blockR;
    const bc = Math.floor(c / blockC) * blockC;
    for (let i = 0; i < blockR; i++) {
      for (let j = 0; j < blockC; j++) {
        const rr = br + i;
        const cc = bc + j;
        if ((rr !== r || cc !== c) && board[rr][cc].value === val) return true;
      }
    }

    return false;
  };

  const isRelated = (r: number, c: number) => {
    if (!selected) return false;
    if (selected.r === r && selected.c === c) return false;
    const sameRow = selected.r === r;
    const sameCol = selected.c === c;

    const size = board.length;
    const blockR = size === 6 ? 2 : 3;
    const blockC = 3;
    const sameBlock = Math.floor(selected.r / blockR) === Math.floor(r / blockR) && Math.floor(selected.c / blockC) === Math.floor(c / blockC);
    return sameRow || sameCol || sameBlock;
  };

  const isSameValue = (r: number, c: number) => {
    if (!selected || !board[selected.r] || !board[selected.r][selected.c]) return false;
    const selectedValue = board[selected.r][selected.c].value;
    if (!selectedValue) return false;
    return board[r][c].value === selectedValue && !(selected.r === r && selected.c === c);
  };

  const isComplete = solution && board.length > 0 && board.every((row, r) => row.every((cell, c) => cell.value === solution[r][c].value));

  return {
    board,
    selected,
    setSelected,
    solution,
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
  };
};
