import type {Suit, TileType} from '../types';

export const TILE_TYPES: TileType[] = [
  // Characters 1-9
  ...Array.from({ length: 9 }, (_, i) => ({ suit: 'characters' as Suit, value: i + 1, symbol: String.fromCodePoint(0x1F007 + i) })),
  // Bamboos 1-9
  ...Array.from({ length: 9 }, (_, i) => ({ suit: 'bamboos' as Suit, value: i + 1, symbol: String.fromCodePoint(0x1F010 + i) })),
  // Circles 1-9
  ...Array.from({ length: 9 }, (_, i) => ({ suit: 'circles' as Suit, value: i + 1, symbol: String.fromCodePoint(0x1F019 + i) })),
  // Winds (East, South, West, North)
  ...Array.from({ length: 4 }, (_, i) => ({ suit: 'winds' as Suit, value: i + 1, symbol: String.fromCodePoint(0x1F000 + i) })),
  // Dragons (Red, Green, White)
  ...Array.from({ length: 3 }, (_, i) => ({ suit: 'dragons' as Suit, value: i + 1, symbol: String.fromCodePoint(0x1F004 + i) })),
  // Flowers (Plum, Orchid, Chrysanthemum, Bamboo)
  ...Array.from({ length: 4 }, (_, i) => ({ suit: 'flowers' as Suit, value: i + 1, symbol: String.fromCodePoint(0x1F022 + i) })),
  // Seasons (Spring, Summer, Autumn, Winter)
  ...Array.from({ length: 4 }, (_, i) => ({ suit: 'seasons' as Suit, value: i + 1, symbol: String.fromCodePoint(0x1F026 + i) })),
];

export const generateDeck = (pairsNeeded: number): TileType[] => {
  const fullDeck: TileType[] = [];
  for (const type of TILE_TYPES) {
    if (type.suit === 'flowers' || type.suit === 'seasons') {
      fullDeck.push(type);
    } else {
      fullDeck.push(type, type, type, type);
    }
  }

  // Group by suit and value for standard tiles, or just suit for flowers/seasons
  const grouped = new Map<string, TileType[]>();
  for (const tile of fullDeck) {
    const key = (tile.suit === 'flowers' || tile.suit === 'seasons') ? tile.suit : `${tile.suit}-${tile.value}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(tile);
  }

  const groupsOf4: TileType[][] = [];
  const groupsOf2: TileType[][] = [];
  
  for (const group of grouped.values()) {
    while (group.length >= 4) {
      groupsOf4.push([group.pop()!, group.pop()!, group.pop()!, group.pop()!]);
    }
    while (group.length >= 2) {
      groupsOf2.push([group.pop()!, group.pop()!]);
    }
  }

  // Shuffle groups
  const shuffleArray = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  shuffleArray(groupsOf4);
  shuffleArray(groupsOf2);

  const deck: TileType[] = [];
  let pairsLeft = pairsNeeded;

  // Prefer groups of 4
  for (const g4 of groupsOf4) {
    if (pairsLeft >= 2) {
      deck.push(...g4);
      pairsLeft -= 2;
    } else if (pairsLeft === 1) {
      deck.push(g4[0], g4[1]);
      pairsLeft -= 1;
    }
    if (pairsLeft === 0) break;
  }

  // Fill remaining with groups of 2
  if (pairsLeft > 0) {
    for (const g2 of groupsOf2) {
      if (pairsLeft >= 1) {
        deck.push(...g2);
        pairsLeft -= 1;
      }
      if (pairsLeft === 0) break;
    }
  }

  // Shuffle the final deck
  shuffleArray(deck);

  return deck;
};

export const doTilesMatch = (t1: TileType, t2: TileType): boolean => {
  if (!t1 || !t2) return false;
  if (t1.suit === 'flowers' && t2.suit === 'flowers') return true;
  if (t1.suit === 'seasons' && t2.suit === 'seasons') return true;
  return t1.suit === t2.suit && t1.value === t2.value;
};
