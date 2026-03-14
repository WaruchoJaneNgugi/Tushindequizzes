import { type ComponentType } from 'react';

// Import all the game components from their respective modules
// We keep them organized so the game hub can dynamically load any of them
import Quest from "../Games/WordQuest/components/Quest.tsx";
import {MathQuiz} from "../Games/MathQuiz/MathQuiz.tsx";
import {MainGameLayout} from "../Games/BibleQuiz/components/MainGameLayout.tsx";
import CheckersArena from "../Games/Checkers/CheckersArena.tsx";
import {ChessMain} from "../Games/chess/ChessMain.tsx";
import {SudokuMain} from "../Games/Sudoku/SudokuMain.tsx";
import {TictacToe} from "../Games/tictac/TictacToe.tsx";
import {ConnectFour} from "../Games/ConnecFour/ConnectFour.tsx";
import {KiswahiliQuiz} from "../Games/KiswahiliQuiz/Kiswahili.tsx";
import {BongoMain} from "../Games/BongoQuiz/component/BongoMain.tsx";
// import {ZenMain} from "../Games/Mahjong/components/ZenMain.tsx";

// This object maps a friendly game ID (like 'bible-quiz' or 'word-quest')
// to the actual React component that should be rendered for that game.
// It's the central registry for all games in our app.
export const gameComponents: Record<string, ComponentType<{}>> = {
    'bible-quiz': MainGameLayout,
    'word-quest': Quest,
    'math-quiz': MathQuiz,
    'checkers': CheckersArena,
    'chess': ChessMain,
    'sodoku': SudokuMain,
    'tictac': TictacToe,
    'connect-four': ConnectFour,
    'kiswahili-quiz': KiswahiliQuiz,
    'bongo-quiz': BongoMain,
    // 'mahjong-game': ZenMain
};

// A simple helper to fetch a game component by its ID.
// Useful when we only have the game ID (e.g., from a route or user selection).
// Returns the component if found, otherwise null (so we can show a 404 or fallback).
export const getGameComponent = (gameId: string | number): ComponentType<{}> | null => {
    const id = String(gameId);               // Make sure we're working with a string
    return gameComponents[id] || null;        // Look it up, or return null if it doesn't exist
};