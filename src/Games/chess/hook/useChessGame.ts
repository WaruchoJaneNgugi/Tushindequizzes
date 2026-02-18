import { useCallback, useEffect } from 'react';
import {
  type GameState,
  type Position,
  type PieceColor,
  type Move,
  type ChessPiece,
  type Difficulty,
  DIFFICULTY_CONFIG,
} from '../types/chess.ts';
import {
  createInitialBoard,
  cloneBoard,
  getLegalMoves,
  applyMoveToBoard,
  isInCheck,
  hasAnyLegalMoves,
  posEquals,
} from '../utils/boardUtils';
import { getBestMove } from '../utils/chessAI';

// type GameAction =
//   | { type: 'SELECT_SQUARE'; pos: Position }
//   | { type: 'AI_MOVE' }
//   | { type: 'RESET' }
//   | { type: 'SET_THINKING'; thinking: boolean };
//
// interface UseChessGameState {
//   gameState: GameState;
//   isAIThinking: boolean;
//   playerColor: PieceColor;
//   difficulty: Difficulty;
// }

const createInitialGameState = (): GameState => ({
  board: createInitialBoard(),
  currentTurn: 'white',
  selectedSquare: null,
  validMoves: [],
  moveHistory: [],
  capturedByWhite: [],
  capturedByBlack: [],
  status: 'playing',
  enPassantTarget: null,
  halfMoveClock: 0,
  fullMoveNumber: 1,
  inCheck: false,
});

// const gameReducer = (state: GameState, action: GameAction, difficulty: Difficulty): GameState => {
//   return state; // placeholder — actual logic below in hook
// };
//
// export const useChessGame = (difficulty: Difficulty) => {
//   const [gameState, setGameState] = useReducerCustom(createInitialGameState());
//   const [isAIThinking, setIsAIThinking] = useSimpleState(false);
//
//   const playerColor: PieceColor = 'white';
//   const aiColor: PieceColor = 'black';
//
//   const updateStatus = useCallback((board: typeof gameState.board, color: PieceColor, enPassant: Position | null) => {
//     const inCheck = isInCheck(board, color);
//     const hasMoves = hasAnyLegalMoves(board, color, enPassant);
//     if (!hasMoves && inCheck) return 'checkmate' as const;
//     if (!hasMoves) return 'stalemate' as const;
//     if (inCheck) return 'check' as const;
//     return 'playing' as const;
//   }, []);
//
//   const handleSquareClick = useCallback((pos: Position) => {
//     setGameState(prev => {
//       if (prev.status === 'checkmate' || prev.status === 'stalemate') return prev;
//       if (prev.currentTurn !== playerColor) return prev;
//
//       const piece = prev.board[pos.row][pos.col];
//
//       // If a square is already selected and we're clicking a valid move
//       if (prev.selectedSquare && prev.validMoves.some(m => posEquals(m, pos))) {
//         const fromPiece = prev.board[prev.selectedSquare.row][prev.selectedSquare.col];
//         if (!fromPiece) return prev;
//
//         const newBoard = cloneBoard(prev.board);
//         const captured = newBoard[pos.row][pos.col];
//
//         // Detect en passant capture
//         let enPassantCapture: ChessPiece | undefined;
//         if (fromPiece.type === 'pawn' && prev.selectedSquare.col !== pos.col && !captured) {
//           enPassantCapture = newBoard[prev.selectedSquare.row][pos.col] || undefined;
//         }
//
//         applyMoveToBoard(newBoard, prev.selectedSquare, pos, fromPiece);
//
//         // Calculate new en passant target
//         let newEnPassant: Position | null = null;
//         if (fromPiece.type === 'pawn' && Math.abs(pos.row - prev.selectedSquare.row) === 2) {
//           newEnPassant = { row: (prev.selectedSquare.row + pos.row) / 2, col: pos.col };
//         }
//
//         const newCapturedByWhite = [...prev.capturedByWhite];
//         const newCapturedByBlack = [...prev.capturedByBlack];
//         if (captured) {
//           if (fromPiece.color === 'white') newCapturedByWhite.push(captured);
//           else newCapturedByBlack.push(captured);
//         }
//         if (enPassantCapture) {
//           if (fromPiece.color === 'white') newCapturedByWhite.push(enPassantCapture);
//           else newCapturedByBlack.push(enPassantCapture);
//         }
//
//         const move: Move = {
//           from: prev.selectedSquare,
//           to: pos,
//           piece: fromPiece,
//           captured: captured || undefined,
//           isEnPassant: !!enPassantCapture,
//           isCastle: fromPiece.type === 'king' && Math.abs(pos.col - prev.selectedSquare.col) === 2,
//         };
//
//         const nextStatus = updateStatus(newBoard, aiColor, newEnPassant);
//
//         return {
//           ...prev,
//           board: newBoard,
//           currentTurn: aiColor,
//           selectedSquare: null,
//           validMoves: [],
//           moveHistory: [...prev.moveHistory, move],
//           capturedByWhite: newCapturedByWhite,
//           capturedByBlack: newCapturedByBlack,
//           status: nextStatus === 'checkmate' || nextStatus === 'stalemate' ? nextStatus : 'playing',
//           enPassantTarget: newEnPassant,
//           inCheck: nextStatus === 'check' || nextStatus === 'checkmate',
//           fullMoveNumber: prev.fullMoveNumber + 1,
//         };
//       }
//
//       // Select a piece
//       if (piece && piece.color === playerColor) {
//         const moves = getLegalMoves(prev.board, pos, prev.enPassantTarget);
//         return { ...prev, selectedSquare: pos, validMoves: moves };
//       }
//
//       // Deselect
//       return { ...prev, selectedSquare: null, validMoves: [] };
//     });
//   }, [playerColor, aiColor, updateStatus]);
//
//   // AI move effect
//   useEffect(() => {
//     if (gameState.currentTurn !== aiColor) return;
//     if (gameState.status === 'checkmate' || gameState.status === 'stalemate') return;
//
//     setIsAIThinking(true);
//     const config = DIFFICULTY_CONFIG[difficulty];
//
//     const timer = setTimeout(() => {
//       const aiMove = getBestMove(
//         gameState.board,
//         aiColor,
//         config.depth,
//         gameState.enPassantTarget
//       );
//
//       if (!aiMove) {
//         setIsAIThinking(false);
//         return;
//       }
//
//       setGameState(prev => {
//         const piece = prev.board[aiMove.from.row][aiMove.from.col];
//         if (!piece) return prev;
//
//         const newBoard = cloneBoard(prev.board);
//         const captured = newBoard[aiMove.to.row][aiMove.to.col];
//         applyMoveToBoard(newBoard, aiMove.from, aiMove.to, piece);
//
//         let newEnPassant: Position | null = null;
//         if (piece.type === 'pawn' && Math.abs(aiMove.to.row - aiMove.from.row) === 2) {
//           newEnPassant = { row: (aiMove.from.row + aiMove.to.row) / 2, col: aiMove.to.col };
//         }
//
//         const newCapturedByBlack = [...prev.capturedByBlack];
//         if (captured) newCapturedByBlack.push(captured);
//
//         const move: Move = {
//           from: aiMove.from,
//           to: aiMove.to,
//           piece,
//           captured: captured || undefined,
//         };
//
//         const nextStatus = updateStatus(newBoard, playerColor, newEnPassant);
//
//         return {
//           ...prev,
//           board: newBoard,
//           currentTurn: playerColor,
//           selectedSquare: null,
//           validMoves: [],
//           moveHistory: [...prev.moveHistory, move],
//           capturedByBlack: newCapturedByBlack,
//           status: nextStatus === 'checkmate' || nextStatus === 'stalemate' ? nextStatus : 'playing',
//           enPassantTarget: newEnPassant,
//           inCheck: nextStatus === 'check' || nextStatus === 'checkmate',
//         };
//       });
//
//       setIsAIThinking(false);
//     }, 500);
//
//     return () => clearTimeout(timer);
//   }, [gameState.currentTurn, gameState.status, difficulty]);
//
//   const resetGame = useCallback(() => {
//     setGameState(createInitialGameState());
//     setIsAIThinking(false);
//   }, []);
//
//   return {
//     gameState,
//     isAIThinking,
//     playerColor,
//     handleSquareClick,
//     resetGame,
//   };
// };

// // Minimal custom hooks to avoid import issues in single-file context
// function useReducerCustom<T>(initial: T): [T, (fn: (prev: T) => T) => void] {
//   const [state, setState] = [initial, () => {}] as any;
//   // This is replaced below with actual useState
//   return [state, setState];
// }
//
// function useSimpleState<T>(initial: T): [T, (val: T) => void] {
//   return [initial, () => {}] as any;
// }

// Re-export using real hooks
import { useState } from 'react';

export const useChessGameReal = (difficulty: Difficulty) => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const playerColor: PieceColor = 'white';
  const aiColor: PieceColor = 'black';

  const updateStatus = useCallback((board: typeof gameState.board, color: PieceColor, enPassant: Position | null) => {
    const inCheck = isInCheck(board, color);
    const hasMoves = hasAnyLegalMoves(board, color, enPassant);
    if (!hasMoves && inCheck) return 'checkmate' as const;
    if (!hasMoves) return 'stalemate' as const;
    if (inCheck) return 'check' as const;
    return 'playing' as const;
  }, []);

  const handleSquareClick = useCallback((pos: Position) => {
    setGameState(prev => {
      if (prev.status === 'checkmate' || prev.status === 'stalemate') return prev;
      if (prev.currentTurn !== playerColor) return prev;

      const piece = prev.board[pos.row][pos.col];

      if (prev.selectedSquare && prev.validMoves.some(m => posEquals(m, pos))) {
        const fromPiece = prev.board[prev.selectedSquare.row][prev.selectedSquare.col];
        if (!fromPiece) return prev;

        const newBoard = cloneBoard(prev.board);
        const captured = newBoard[pos.row][pos.col];

        let enPassantCapture: ChessPiece | undefined;
        if (fromPiece.type === 'pawn' && prev.selectedSquare.col !== pos.col && !captured) {
          enPassantCapture = newBoard[prev.selectedSquare.row][pos.col] || undefined;
        }

        applyMoveToBoard(newBoard, prev.selectedSquare, pos, fromPiece);

        let newEnPassant: Position | null = null;
        if (fromPiece.type === 'pawn' && Math.abs(pos.row - prev.selectedSquare.row) === 2) {
          newEnPassant = { row: (prev.selectedSquare.row + pos.row) / 2, col: pos.col };
        }

        const newCapturedByWhite = [...prev.capturedByWhite];
        const newCapturedByBlack = [...prev.capturedByBlack];
        if (captured) {
          if (fromPiece.color === 'white') newCapturedByWhite.push(captured);
          else newCapturedByBlack.push(captured);
        }
        if (enPassantCapture) {
          if (fromPiece.color === 'white') newCapturedByWhite.push(enPassantCapture);
        }

        const move: Move = {
          from: prev.selectedSquare,
          to: pos,
          piece: fromPiece,
          captured: captured || undefined,
          isEnPassant: !!enPassantCapture,
          isCastle: fromPiece.type === 'king' && Math.abs(pos.col - prev.selectedSquare.col) === 2,
        };

        const nextStatus = updateStatus(newBoard, aiColor, newEnPassant);

        return {
          ...prev,
          board: newBoard,
          currentTurn: aiColor,
          selectedSquare: null,
          validMoves: [],
          moveHistory: [...prev.moveHistory, move],
          capturedByWhite: newCapturedByWhite,
          capturedByBlack: newCapturedByBlack,
          status: (nextStatus === 'checkmate' || nextStatus === 'stalemate') ? nextStatus : 'playing',
          enPassantTarget: newEnPassant,
          inCheck: nextStatus === 'check' || nextStatus === 'checkmate',
          fullMoveNumber: prev.fullMoveNumber + 1,
        };
      }

      if (piece && piece.color === playerColor) {
        const moves = getLegalMoves(prev.board, pos, prev.enPassantTarget);
        return { ...prev, selectedSquare: pos, validMoves: moves };
      }

      return { ...prev, selectedSquare: null, validMoves: [] };
    });
  }, [playerColor, aiColor, updateStatus]);

  useEffect(() => {
    if (gameState.currentTurn !== aiColor) return;
    if (gameState.status === 'checkmate' || gameState.status === 'stalemate') return;

    setIsAIThinking(true);
    const config = DIFFICULTY_CONFIG[difficulty];

    const timer = setTimeout(() => {
      const aiMove = getBestMove(
        gameState.board,
        aiColor,
        config.depth,
        gameState.enPassantTarget
      );

      if (!aiMove) {
        setIsAIThinking(false);
        return;
      }

      setGameState(prev => {
        const piece = prev.board[aiMove.from.row][aiMove.from.col];
        if (!piece) return prev;

        const newBoard = cloneBoard(prev.board);
        const captured = newBoard[aiMove.to.row][aiMove.to.col];
        applyMoveToBoard(newBoard, aiMove.from, aiMove.to, piece);

        let newEnPassant: Position | null = null;
        if (piece.type === 'pawn' && Math.abs(aiMove.to.row - aiMove.from.row) === 2) {
          newEnPassant = { row: (aiMove.from.row + aiMove.to.row) / 2, col: aiMove.to.col };
        }

        const newCapturedByBlack = [...prev.capturedByBlack];
        if (captured) newCapturedByBlack.push(captured);

        const move: Move = {
          from: aiMove.from,
          to: aiMove.to,
          piece,
          captured: captured || undefined,
        };

        const nextStatus = updateStatus(newBoard, playerColor, newEnPassant);

        return {
          ...prev,
          board: newBoard,
          currentTurn: playerColor,
          selectedSquare: null,
          validMoves: [],
          moveHistory: [...prev.moveHistory, move],
          capturedByBlack: newCapturedByBlack,
          status: (nextStatus === 'checkmate' || nextStatus === 'stalemate') ? nextStatus : 'playing',
          enPassantTarget: newEnPassant,
          inCheck: nextStatus === 'check' || nextStatus === 'checkmate',
        };
      });

      setIsAIThinking(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [gameState.currentTurn, gameState.status]);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setIsAIThinking(false);
  }, []);

  return { gameState, isAIThinking, playerColor, handleSquareClick, resetGame };
};
