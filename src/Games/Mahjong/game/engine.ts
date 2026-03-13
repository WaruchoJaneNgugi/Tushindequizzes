import { generateDeck, doTilesMatch } from './tiles';
import type { BoardTile, GameState, Stage } from '../types';

export const TILE_WIDTH = 2;
export const TILE_HEIGHT = 2;

export const doTilesOverlap = (t1: {x: number, y: number}, t2: {x: number, y: number}): boolean => {
  return Math.max(t1.x, t2.x) < Math.min(t1.x + TILE_WIDTH, t2.x + TILE_WIDTH) &&
      Math.max(t1.y, t2.y) < Math.min(t1.y + TILE_HEIGHT, t2.y + TILE_HEIGHT);
};

export const isTileSelectable = (tile: BoardTile, allTiles: BoardTile[]): boolean => {
  // 1. Check if covered by any tile above
  const isCovered = allTiles.some(t => t.z > tile.z && doTilesOverlap(t, tile));
  if (isCovered) return false;

  // 2. Check if free on left or right
  let blockedLeft = false;
  let blockedRight = false;

  for (const t of allTiles) {
    if (t.z === tile.z && t.id !== tile.id) {
      // Check if overlapping in Y
      const overlapsY = Math.max(t.y, tile.y) < Math.min(t.y + TILE_HEIGHT, tile.y + TILE_HEIGHT);
      if (overlapsY) {
        // Check if touching on the left
        if (t.x < tile.x && t.x + TILE_WIDTH >= tile.x) {
          blockedLeft = true;
        }
        // Check if touching on the right
        if (t.x > tile.x && t.x <= tile.x + TILE_WIDTH) {
          blockedRight = true;
        }
      }
    }
  }

  return !blockedLeft || !blockedRight;
};

export const createGame = (stage: Stage, initialScore: number = 0): GameState => {
  const positions = stage.positions;
  const pairsNeeded = Math.floor(positions.length / 2);
  const deck = generateDeck(pairsNeeded);

  const tiles: BoardTile[] = positions.map((pos, i) => ({
    id: `tile-${i}`,
    type: deck[i],
    x: pos.x,
    y: pos.y,
    z: pos.z,
  }));

  return {
    stage,
    tiles,
    selectedTileId: null,
    history: [],
    score: initialScore,
    initialScore,
    matches: 0,
    startTime: Date.now(),
    isGameOver: false,
    isVictory: false,
  };
};

export const getSelectableTiles = (tiles: BoardTile[]): BoardTile[] => {
  return tiles.filter(t => isTileSelectable(t, tiles));
};

export const getAvailableMatches = (tiles: BoardTile[]): [BoardTile, BoardTile][] => {
  const selectable = getSelectableTiles(tiles);
  const matches: [BoardTile, BoardTile][] = [];

  for (let i = 0; i < selectable.length; i++) {
    for (let j = i + 1; j < selectable.length; j++) {
      if (doTilesMatch(selectable[i].type, selectable[j].type)) {
        matches.push([selectable[i], selectable[j]]);
      }
    }
  }

  return matches;
};

export const hasAvailableMoves = (tiles: BoardTile[]): boolean => {
  return getAvailableMatches(tiles).length > 0;
};

export const shuffleTiles = (tiles: BoardTile[]): BoardTile[] => {
  const newTiles = [...tiles];
  const positions = newTiles.map(t => ({ x: t.x, y: t.y, z: t.z }));

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return newTiles.map((t, i) => ({
    ...t,
    x: positions[i].x,
    y: positions[i].y,
    z: positions[i].z,
  }));
};
