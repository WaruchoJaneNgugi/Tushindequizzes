// Mahjong/utils/quizLogic.ts
import type { Question, UserAnswer } from '../types/quiz';

export const calculateScore = (questions: Question[], userAnswers: UserAnswer[]): number => {
    return userAnswers.reduce((score, userAnswer) => {
        const question = questions.find(q => q.id === userAnswer.questionId);
        if (question && userAnswer.selectedOption === question.correctAnswer) {
            return score + question.points;
        }
        return score;
    }, 0);
};

export const calculateTotalPossibleScore = (questions: Question[]): number => {
    return questions.reduce((total, question) => total + question.points, 0);
};

export const calculatePercentage = (score: number, totalPossibleScore: number): number => {
    return totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
};

// Alternative: If you want to calculate percentage based on correct answers count
export const calculateCorrectAnswerPercentage = (correct: number, total: number): number => {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
};

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};