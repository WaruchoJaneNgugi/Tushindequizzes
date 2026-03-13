import type { Position, Stage } from '../types';

const parseLayoutStr = (layers: string[][]): Position[] => {
  const positions: Position[] = [];
  layers.forEach((layer, z) => {
    layer.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== ' ') {
          positions.push({ x, y, z });
        }
      }
    });
  });
  return positions;
};

export const STAGES: Stage[] = [
  {
    id: 'stage-1',
    name: 'Easy - Triangle',
    difficulty: 'Easy',
    timeLimit: 60, // 1 minute
    pointsPerMatch: 1,
    positions: parseLayoutStr([
      [
        "      x x      ",
        "               ",
        "    x x x x    ",
        "               ",
        "  x x x x x x  ",
        "               ",
        "x x x x x x x x"
      ]
    ]) // 20 tiles
  },
  {
    id: 'stage-2',
    name: 'Easy - Diamond',
    difficulty: 'Easy',
    timeLimit: 90, // 1.5 minutes
    pointsPerMatch: 1,
    positions: parseLayoutStr([
      [
        "        x x        ",
        "                   ",
        "      x x x x      ",
        "                   ",
        "    x x x x x x    ",
        "                   ",
        "  x x x x x x x x  ",
        "                   ",
        "    x x x x x x    ",
        "                   ",
        "      x x x x      ",
        "                   ",
        "        x x        "
      ]
    ]) // 32 tiles
  },
  {
    id: 'stage-3',
    name: 'Easy - Cross',
    difficulty: 'Easy',
    timeLimit: 120, // 2 minutes
    pointsPerMatch: 1,
    positions: parseLayoutStr([
      [
        "      x x x x      ",
        "                   ",
        "      x x x x      ",
        "                   ",
        "x x x x x x x x x x",
        "                   ",
        "x x x x x x x x x x",
        "                   ",
        "      x x x x      ",
        "                   ",
        "      x x x x      "
      ]
    ]) // 36 tiles
  },
  {
    id: 'stage-4',
    name: 'Medium - Hexagon',
    difficulty: 'Medium',
    timeLimit: 150, // 2.5 minutes
    pointsPerMatch: 2,
    positions: parseLayoutStr([
      [
        "    x x x x    ",
        "               ",
        "  x x x x x x  ",
        "               ",
        "x x x x x x x x",
        "               ",
        "x x x x x x x x",
        "               ",
        "  x x x x x x  ",
        "               ",
        "    x x x x    "
      ],
      [
        "               ",
        "               ",
        "    x x x x    ",
        "               ",
        "  x x x x x x  ",
        "               ",
        "  x x x x x x  ",
        "               ",
        "    x x x x    ",
        "               ",
        "               "
      ]
    ]) // 56 tiles
  },
  {
    id: 'stage-5',
    name: 'Medium - Hourglass',
    difficulty: 'Medium',
    timeLimit: 180, // 3 minutes
    pointsPerMatch: 2,
    positions: parseLayoutStr([
      [
        "x x x x x x x x",
        "               ",
        "  x x x x x x  ",
        "               ",
        "    x x x x    ",
        "               ",
        "      x x      ",
        "               ",
        "    x x x x    ",
        "               ",
        "  x x x x x x  ",
        "               ",
        "x x x x x x x x"
      ],
      [
        "               ",
        "               ",
        "  x x x x x x  ",
        "               ",
        "    x x x x    ",
        "               ",
        "      x x      ",
        "               ",
        "    x x x x    ",
        "               ",
        "  x x x x x x  ",
        "               ",
        "               "
      ]
    ]) // 60 tiles
  },
  {
    id: 'stage-6',
    name: 'Medium - Pyramid',
    difficulty: 'Medium',
    timeLimit: 210, // 3.5 minutes
    pointsPerMatch: 2,
    positions: parseLayoutStr([
      [
        "  x x x x x x x x  ",
        "                   ",
        "  x x x x x x x x  ",
        "                   ",
        "  x x x x x x x x  ",
        "                   ",
        "  x x x x x x x x  ",
        "                   ",
        "  x x x x x x x x  ",
        "                   ",
        "  x x x x x x x x  "
      ],
      [
        "                   ",
        "                   ",
        "    x x x x x x    ",
        "                   ",
        "    x x x x x x    ",
        "                   ",
        "    x x x x x x    ",
        "                   ",
        "    x x x x x x    ",
        "                   ",
        "                   "
      ],
      [
        "                   ",
        "                   ",
        "                   ",
        "                   ",
        "      x x x x      ",
        "                   ",
        "      x x x x      ",
        "                   ",
        "                   ",
        "                   ",
        "                   "
      ],
      [
        "                   ",
        "                   ",
        "                   ",
        "                   ",
        "                   ",
        "        x x        ",
        "                   ",
        "                   ",
        "                   ",
        "                   ",
        "                   "
      ]
    ]) // 82 tiles
  },
  {
    id: 'stage-7',
    name: 'Hard - Heart',
    difficulty: 'Hard',
    timeLimit: 300, // 5 minutes
    pointsPerMatch: 3,
    positions: parseLayoutStr([
      [
        "    x x x     x x x    ",
        "                       ",
        "  x x x x x x x x x x  ",
        "                       ",
        "x x x x x x x x x x x x",
        "                       ",
        "x x x x x x x x x x x x",
        "                       ",
        "  x x x x x x x x x x  ",
        "                       ",
        "    x x x x x x x x    ",
        "                       ",
        "      x x x x x x      ",
        "                       ",
        "        x x x x        ",
        "                       ",
        "          x x          "
      ],
      [
        "                       ",
        "                       ",
        "    x x x     x x x    ",
        "                       ",
        "  x x x x x x x x x x  ",
        "                       ",
        "  x x x x x x x x x x  ",
        "                       ",
        "    x x x x x x x x    ",
        "                       ",
        "      x x x x x x      ",
        "                       ",
        "        x x x x        ",
        "                       ",
        "          x x          ",
        "                       ",
        "                       "
      ]
    ]) // 116 tiles
  },
  {
    id: 'stage-8',
    name: 'Hard - Star',
    difficulty: 'Hard',
    timeLimit: 270, // 4.5 minutes
    pointsPerMatch: 3,
    positions: parseLayoutStr([
      [
        "            x x            ",
        "                           ",
        "          x x x x          ",
        "                           ",
        "x x x x x x x x x x x x x x",
        "                           ",
        "  x x x x x x x x x x x x  ",
        "                           ",
        "    x x x x x x x x x x    ",
        "                           ",
        "      x x x x x x x x      ",
        "                           ",
        "    x x x x     x x x x    ",
        "                           ",
        "  x x x             x x x  "
      ],
      [
        "                           ",
        "                           ",
        "          x x x x          ",
        "                           ",
        "    x x x x x x x x x x    ",
        "                           ",
        "      x x x x x x x x      ",
        "                           ",
        "        x x x x x x        ",
        "                           ",
        "      x x x     x x x      ",
        "                           ",
        "    x x             x x    ",
        "                           ",
        "                           "
      ]
    ]) // 102 tiles
  },
  {
    id: 'stage-9',
    name: 'Hard - Turtle',
    difficulty: 'Hard',
    timeLimit: 480, // 8 minutes
    pointsPerMatch: 3,
    positions: parseLayoutStr([
      [
        "          x x x x x x x x x x x x          ",
        "                                           ",
        "        x x x x x x x x x x x x x x x x    ",
        "                                           ",
        "      x x x x x x x x x x x x x x x x x x  ",
        "                                           ",
        "  x x x x x x x x x x x x x x x x x x x x x x",
        "                                           ",
        "      x x x x x x x x x x x x x x x x x x  ",
        "                                           ",
        "        x x x x x x x x x x x x x x x x    ",
        "                                           ",
        "          x x x x x x x x x x x x          "
      ],
      [
        "                                           ",
        "                                           ",
        "          x x x x x x x x x x x x          ",
        "                                           ",
        "          x x x x x x x x x x x x          ",
        "                                           ",
        "          x x x x x x x x x x x x          ",
        "                                           ",
        "          x x x x x x x x x x x x          ",
        "                                           ",
        "          x x x x x x x x x x x x          ",
        "                                           ",
        "                                           "
      ],
      [
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           ",
        "            x x x x x x x x                ",
        "                                           ",
        "            x x x x x x x x                ",
        "                                           ",
        "            x x x x x x x x                ",
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           "
      ],
      [
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           ",
        "                x x x x                    ",
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           ",
        "                                           "
      ]
    ]) // 202 tiles
  }
];
