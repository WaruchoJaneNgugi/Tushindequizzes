import { type ComponentType } from 'react';
import Quest from "../Games/WordQuest/components/Quest.tsx";
import {MathQuiz} from "../Games/MathQuiz/MathQuiz.tsx";
import {MainGameLayout} from "../Games/BibleQuiz/components/MainGameLayout.tsx";

export const gameComponents: Record<string, ComponentType<{}>> = {
    'bible-quiz': MainGameLayout,
    'word-quest':Quest,
    'math-quiz':MathQuiz
};

export const getGameComponent = (gameId: string | number): ComponentType<{}> | null => {
    const id = String(gameId);
    return gameComponents[id] || null;
};