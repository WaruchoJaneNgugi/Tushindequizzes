import type { DifficultyConfig, PlacedWord, Position, Direction } from '../types';

export function generateGrid(
    wordGroups: string[][],
    config: DifficultyConfig,
    rows: number,
    cols: number
): { grid: string[][], placedWords: PlacedWord[] } {
  const { directions } = config;
  const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
  const placedWords: PlacedWord[] = [];

  // Place words for each group (part 1, 2, 3)
  wordGroups.forEach((words, groupIndex) => {
    const part = groupIndex + 1;

    for (const word of words) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 200) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const start: Position = {
          r: Math.floor(Math.random() * rows),
          c: Math.floor(Math.random() * cols)
        };

        if (canPlaceWord(grid, word, start, direction, rows, cols)) {
          const cells = placeWord(grid, word, start, direction);
          placedWords.push({
            word,
            start,
            end: cells[cells.length - 1],
            found: false,
            cells,
            part
          });
          placed = true;
        }
        attempts++;
      }
    }
  });

  // Fill empty spaces
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placedWords };
}

function canPlaceWord(grid: string[][], word: string, start: Position, dir: Direction, rows: number, cols: number): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = start.r + i * dir.dr;
    const c = start.c + i * dir.dc;

    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid: string[][], word: string, start: Position, dir: Direction): Position[] {
  const cells: Position[] = [];
  for (let i = 0; i < word.length; i++) {
    const r = start.r + i * dir.dr;
    const c = start.c + i * dir.dc;
    grid[r][c] = word[i];
    cells.push({ r, c });
  }
  return cells;
}