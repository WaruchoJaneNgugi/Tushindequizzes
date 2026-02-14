// // utils/gameComponent.ts
// // import {ChemshaBongo} from '../Games/ChemshaBongo/ChemshaBongo.tsx';
// import {MainGameLayout} from "../Games/BibleQuiz/MainGameLayout.tsx";
// import {type ComponentType} from 'react';
//
// // ComponentType with no props (empty object)
// export const gameComponents: Record<string, ComponentType<{}>> = {
//     // 'chemsha-bongo': ChemshaBongo,
//     'bible-quiz': MainGameLayout,
// };
//
// export const getGameComponent = (gameId: string | number): ComponentType<{}> | null => {
//     const id = String(gameId);
//     return gameComponents[id] || null;
// };

import { MainGameLayout } from "../Games/BibleQuiz/MainGameLayout.tsx";
import { type ComponentType } from 'react';
import Quest from "../Games/WordQuest/components/Quest.tsx";
import {MathQuiz} from "../Games/MathQuiz/MathQuiz.tsx";

// Create a placeholder component for missing games
// const PlaceholderGame = () => {
//     return (
//         <div className="placeholder-game">
//             <h2>Game Loading...</h2>
//     <p>The game is currently unavailable.</p>
//     </div>
// );
// };

export const gameComponents: Record<string, ComponentType<{}>> = {
    'bible-quiz': MainGameLayout,
    'word-quest':Quest,
    'math-quiz':MathQuiz
};

export const getGameComponent = (gameId: string | number): ComponentType<{}> | null => {
    const id = String(gameId);
    return gameComponents[id] || null;
};