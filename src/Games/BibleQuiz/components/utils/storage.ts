// src/utils/storage.ts
const QUIZ_RESULTS_KEY = 'bible_quiz_results';
const USER_PROGRESS_KEY = 'bible_quiz_progress';

export interface StoredResult {
    quizId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
}

export const saveQuizResult = (result: StoredResult): void => {
    const existingResults = getQuizResults();
    existingResults.push(result);
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(existingResults));
};

export const getQuizResults = (): StoredResult[] => {
    const results = localStorage.getItem(QUIZ_RESULTS_KEY);
    return results ? JSON.parse(results) : [];
};

export const getQuizResultsByQuizId = (quizId: string): StoredResult[] => {
    const results = getQuizResults();
    return results.filter(result => result.quizId === quizId);
};

export const getBestScore = (quizId: string): number => {
    const results = getQuizResultsByQuizId(quizId);
    return results.length > 0 ? Math.max(...results.map(r => r.score)) : 0;
};

export const saveProgress = (quizId: string, questionIndex: number, answers: any[]): void => {
    const progress = {
        quizId,
        questionIndex,
        answers,
        savedAt: new Date().toISOString()
    };
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
};

export const getProgress = (): any => {
    const progress = localStorage.getItem(USER_PROGRESS_KEY);
    return progress ? JSON.parse(progress) : null;
};

export const clearProgress = (): void => {
    localStorage.removeItem(USER_PROGRESS_KEY);
};