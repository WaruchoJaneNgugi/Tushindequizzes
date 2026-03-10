import type { CellValue, GameLevel, LevelConfig, Player } from '../types/game.types';

// ─── Winning combinations ────────────────────────────────────────────────────
export const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// ─── Level configurations ────────────────────────────────────────────────────
export const LEVEL_CONFIGS: Record<GameLevel, LevelConfig> = {
  easy: {
    id: 'easy',
    label: 'EASY',
    wager: 5,
    reward: 9,
    drawRefund: true,
    aiDepth: 1,
    aiRandomness: 0.85,
    color: '#00ffaa',
    glowColor: 'rgba(0,255,170,0.6)',
    description: 'AI plays mostly random — perfect for beginners',
    stars: 1,
  },
  medium: {
    id: 'medium',
    label: 'MEDIUM',
    wager: 10,
    reward: 22,
    drawRefund: true,
    aiDepth: 2,
    aiRandomness: 0.45,
    color: '#00ccff',
    glowColor: 'rgba(0,204,255,0.6)',
    description: 'AI occasionally finds the smart move',
    stars: 2,
  },
  hard: {
    id: 'hard',
    label: 'HARD',
    wager: 15,
    reward: 6,
    drawRefund: false,
    aiDepth: 35,
    aiRandomness: 0.1,
    color: '#ff6600',
    glowColor: 'rgba(255,102,0,0.6)',
    description: 'AI plays near-optimally — rare wins possible',
    stars: 3,
  },
  expert: {
    id: 'expert',
    label: 'EXPERT',
    wager: 25,
    reward: 65,
    drawRefund: false,
    aiDepth: 9,
    aiRandomness: 0,
    color: '#ff2266',
    glowColor: 'rgba(255,34,102,0.6)',
    description: 'Perfect minimax — draws are the best you can get',
    stars: 4,
  },
};

// ─── Board helpers ───────────────────────────────────────────────────────────
export const checkWinner = (
  board: CellValue[]
): { winner: Player | null; line: number[] | null } => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return { winner: null, line: null };
};

export const isDraw = (board: CellValue[]): boolean =>
  board.every((cell) => cell !== null);

export const getAvailableMoves = (board: CellValue[]): number[] =>
  board.reduce<number[]>((acc, cell, i) => {
    if (cell === null) acc.push(i);
    return acc;
  }, []);

// ─── Minimax with alpha-beta pruning ─────────────────────────────────────────
export const minimax = (
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  maxDepth: number
): number => {
  const { winner } = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (isDraw(board) || depth >= maxDepth) return 0;

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const next = [...board] as CellValue[];
      next[move] = 'O';
      const score = minimax(next, depth + 1, false, alpha, beta, maxDepth);
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const next = [...board] as CellValue[];
      next[move] = 'X';
      const score = minimax(next, depth + 1, true, alpha, beta, maxDepth);
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
};

// ─── AI move selector ────────────────────────────────────────────────────────
export const getBestAIMove = (board: CellValue[], level: GameLevel): number => {
  const config = LEVEL_CONFIGS[level];
  const available = getAvailableMoves(board);
  if (available.length === 0) return -1;

  // Inject randomness based on level
  if (Math.random() < config.aiRandomness) {
    return available[Math.floor(Math.random() * available.length)];
  }

  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const move of available) {
    const next = [...board] as CellValue[];
    next[move] = 'O';
    const score = minimax(next, 0, false, -Infinity, Infinity, config.aiDepth);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};

// ─── Grid 3-D projection helper ──────────────────────────────────────────────
export const cellIndexToRowCol = (index: number): [number, number] => [
  Math.floor(index / 3),
  index % 3,
];
